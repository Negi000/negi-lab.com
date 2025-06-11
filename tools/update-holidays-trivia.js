// Node.jsスクリプト例: 祝日API・Wikipedia APIから祝日・トリビアを取得しJSON生成
// 実運用時はAPI仕様・CORS等に応じて修正してください
const fs = require('fs');
const fetch = require('node-fetch');

async function fetchHolidays() {
  // 例: 国民の祝日API（https://holidays-jp.github.io/api/v1/date.json）
  const url = 'https://holidays-jp.github.io/api/v1/date.json';
  const res = await fetch(url);
  const data = await res.json();
  // YYYY-MM-DD形式の配列に変換
  return Object.keys(data).sort();
}

async function fetchTrivia() {
  // 例: Wikipedia APIで「今日は何の日」取得（日本語）
  // ここではサンプルとして一部固定データを返す
  // 実運用ではAPIや記念日DB等から自動取得ロジックを実装
  return {
    "01-01": "元日。新年の始まりを祝う日です。",
    "03-11": "東日本大震災が発生した日（2011年）",
    "07-20": "アポロ11号月面着陸（1969年）",
    "08-06": "広島に原爆投下（1945年）",
    "09-01": "防災の日。関東大震災（1923年）",
    "10-10": "東京オリンピック開会式（1964年）",
    "12-25": "クリスマス。イエス・キリストの誕生日。"
    // ...さらに自動取得・拡充可能...
  };
}

async function main() {
  const holidays = await fetchHolidays();
  fs.writeFileSync('tools/holidays-ja.json', JSON.stringify(holidays, null, 2), 'utf8');
  const trivia = await fetchTrivia();
  fs.writeFileSync('tools/date-trivia-ja.json', JSON.stringify(trivia, null, 2), 'utf8');
  console.log('祝日・トリビアJSONを更新しました');
}

main();
