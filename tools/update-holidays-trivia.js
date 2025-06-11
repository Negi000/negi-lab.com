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

function mergeJson(oldObj, newObj) {
  // 既存データを優先しつつ、新規データを追加
  return { ...newObj, ...oldObj };
}

async function main() {
  // holidays
  const holidays = await fetchHolidays();
  const holidaysPath = path.join(__dirname, 'holidays-ja.json');
  let oldHolidays = [];
  if(fs.existsSync(holidaysPath)){
    oldHolidays = JSON.parse(fs.readFileSync(holidaysPath, 'utf8'));
  }
  // 差分追加（重複除去）
  const mergedHolidays = Array.from(new Set([...oldHolidays, ...holidays])).sort();
  fs.writeFileSync(holidaysPath, JSON.stringify(mergedHolidays, null, 2), 'utf8');

  // trivia
  const trivia = await fetchTriviaAllDays();
  const triviaPath = path.join(__dirname, 'date-trivia-ja.json');
  let oldTrivia = {};
  if(fs.existsSync(triviaPath)){
    oldTrivia = JSON.parse(fs.readFileSync(triviaPath, 'utf8'));
  }
  // 既存データ優先でマージ
  const mergedTrivia = mergeJson(oldTrivia, trivia);
  fs.writeFileSync(triviaPath, JSON.stringify(mergedTrivia, null, 2), 'utf8');
  console.log('祝日・トリビアJSONを差分マージで更新しました');
}

main();
