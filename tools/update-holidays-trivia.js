// Node.jsスクリプト例: 祝日API・Wikipedia APIから祝日・トリビアを取得しJSON生成
// 実運用時はAPI仕様・CORS等に応じて修正してください
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

async function fetchHolidays() {
  // 国民の祝日API（1948年～未来まで）
  const url = 'https://holidays-jp.github.io/api/v1/date.json';
  const res = await fetch(url);
  const data = await res.json();
  // YYYY-MM-DD形式の配列
  return Object.keys(data).sort();
}

async function fetchTriviaAllDays() {
  // Wikipedia APIから「今日は何の日」全日分を取得
  // 例: https://ja.wikipedia.org/api/rest_v1/page/mobile-sections/今日は何の日_各日
  // ここでは1年分(01-01～12-31)をループで取得
  const trivia = {};
  for(let m=1;m<=12;m++){
    for(let d=1;d<=31;d++){
      const mm = String(m).padStart(2,'0');
      const dd = String(d).padStart(2,'0');
      const key = `${mm}-${dd}`;
      // Wikipedia APIで各日を取得
      const title = encodeURIComponent(`${m}月${d}日`);
      const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${title}`;
      try {
        const res = await fetch(url);
        if(res.ok){
          const data = await res.json();
          if(data.extract) trivia[key] = data.extract.replace(/\n/g, ' ');
        }
      } catch(e) {/* 無視 */}
    }
  }
  return trivia;
}

async function fetchPastHolidaysFromWikipedia() {
  // Wikipedia「日本の祝日一覧」から1948年～2023年の祝日を抽出
  // 例: https://ja.wikipedia.org/wiki/日本の祝日一覧
  const url = 'https://ja.wikipedia.org/wiki/日本の祝日一覧';
  const res = await fetch(url);
  const html = await res.text();
  const holidaySet = new Set();
  // 簡易パース: YYYY年MM月DD日 形式を全て抽出
  const dateRegex = /(19[4-9][0-9]|20[0-2][0-9]|2023)年([0-1]?[0-9])月([0-3]?[0-9])日/g;
  let m;
  while ((m = dateRegex.exec(html)) !== null) {
    const y = m[1];
    const mo = m[2].padStart(2, '0');
    const d = m[3].padStart(2, '0');
    holidaySet.add(`${y}-${mo}-${d}`);
  }
  return Array.from(holidaySet);
}

function mergeJson(oldObj, newObj) {
  // 既存データを優先しつつ、新規データを追加
  return { ...newObj, ...oldObj };
}

async function fetchTriviaFromAnniversaryApi() {
  // 今日は何の日API（https://today-anniversary-api.vercel.app/api/ja）から1年分取得
  // API例: https://today-anniversary-api.vercel.app/api/ja?date=01-01
  const trivia = {};
  for(let m=1;m<=12;m++){
    for(let d=1;d<=31;d++){
      const mm = String(m).padStart(2,'0');
      const dd = String(d).padStart(2,'0');
      const key = `${mm}-${dd}`;
      const url = `https://today-anniversary-api.vercel.app/api/ja?date=${key}`;
      try {
        const res = await fetch(url);
        if(res.ok){
          const data = await res.json();
          if(Array.isArray(data.anniversary) && data.anniversary.length > 0){
            trivia[key] = data.anniversary;
          }
        }
      } catch(e) {/* 無視 */}
    }
  }
  return trivia;
}

function mergeTriviaMulti(oldObj, newObj) {
  // 既存データ（配列/文字列）と新規データ（配列）をマージ
  const result = {...newObj};
  for(const k in oldObj){
    if(Array.isArray(result[k])){
      // 既存が配列/文字列
      if(Array.isArray(oldObj[k])){
        result[k] = Array.from(new Set([...result[k], ...oldObj[k]]));
      }else if(typeof oldObj[k]==='string'){
        if(!result[k].includes(oldObj[k])) result[k].push(oldObj[k]);
      }
    }else if(typeof result[k]==='undefined'){
      result[k] = oldObj[k];
    }
  }
  return result;
}

async function main() {
  // holidays
  const holidaysApi = await fetchHolidays();
  const holidaysPast = await fetchPastHolidaysFromWikipedia();
  const holidaysPath = path.join(__dirname, 'holidays-ja.json');
  let oldHolidays = [];
  if(fs.existsSync(holidaysPath)){
    oldHolidays = JSON.parse(fs.readFileSync(holidaysPath, 'utf8'));
  }
  // API・Wikipedia・既存を全てマージ（重複除去）
  const mergedHolidays = Array.from(new Set([...oldHolidays, ...holidaysApi, ...holidaysPast])).sort();
  fs.writeFileSync(holidaysPath, JSON.stringify(mergedHolidays, null, 2), 'utf8');

  // trivia
  const triviaAnniv = await fetchTriviaFromAnniversaryApi();
  const triviaPath = path.join(__dirname, 'date-trivia-ja.json');
  let oldTrivia = {};
  if(fs.existsSync(triviaPath)){
    oldTrivia = JSON.parse(fs.readFileSync(triviaPath, 'utf8'));
  }
  // 既存データも配列化してマージ
  const mergedTrivia = mergeTriviaMulti(oldTrivia, triviaAnniv);
  fs.writeFileSync(triviaPath, JSON.stringify(mergedTrivia, null, 2), 'utf8');
  console.log('祝日・トリビアJSONを差分マージで更新しました（祝日は1948年～、トリビアは1日複数件対応）');
}

main();
