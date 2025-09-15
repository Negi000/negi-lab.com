// 自動フィールド挿入スクリプト
// 要件:
//  1. 基本情報 内で "誕生日" の直後に "CV": "" を追加
//  2. 基本情報 内で "タグ" の直後に "攻撃タイプ": "" を追加
// 既に存在する場合は追加しない。順序を崩さず最小限テキスト置換。

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'gamewiki', 'FellowMoon', 'character.json');
let text = fs.readFileSync(filePath, 'utf-8');

function insertAfterBirthday(block) {
  if (/"CV"\s*:/.test(block)) return block; // 既に存在
  return block.replace(/("誕生日"\s*:\s*"[^"]*"\s*,?)/, (full, birthdayLine) => {
    const line = /,\s*$/.test(birthdayLine) ? birthdayLine : birthdayLine.replace(/"\s*$/, '",');
    return line + '\n      "CV": "",';
  });
}

function insertAfterTag(block) {
  if (/"攻撃タイプ"\s*:/.test(block)) return block; // 既に存在
  return block.replace(/("タグ"\s*:\s*"[^"]*"\s*,?)/, (full, tagLine) => {
    const line = /,\s*$/.test(tagLine) ? tagLine : tagLine + ',';
    return line + '\n      "攻撃タイプ": "",';
  });
}

// "基本情報": { ... } ブロックを走査して挿入
text = text.replace(/("基本情報"\s*:\s*{)([^{}]*?)(\n\s*})/g, (match, start, body, end) => {
  let updated = body;
  updated = insertAfterBirthday(updated);
  updated = insertAfterTag(updated);
  return start + updated + end;
});

fs.writeFileSync(filePath, text, 'utf-8');
console.log('character.json 更新完了 (CV / 攻撃タイプ 追加)');
