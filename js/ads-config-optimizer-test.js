// ads-config-optimizer-test.js
// 最適化後のCONFIG設定をテストするスクリプト

// 最適化前のCONFIG（旧設定）
const OLD_CONFIG = {
  baseDesktopCap: 8,
  baseMobileCap: 5,
  textLengthPerExtraSlot: 1400,
  dynamicMaxDesktop: 12,
  dynamicMaxMobile: 8
};

// 最適化後のCONFIG（新設定）
const NEW_CONFIG = {
  baseDesktopCap: 6,
  baseMobileCap: 3,
  textLengthPerExtraSlot: 2500,
  dynamicMaxDesktop: 10,
  dynamicMaxMobile: 7
};

// テスト用のページテキスト長サンプル
const TEST_CASES = [
  { name: "短いページ", textLength: 3000 },   // 基本情報のみ
  { name: "標準ページ", textLength: 6000 },   // 通常のキャラページ
  { name: "長いページ", textLength: 9000 },   // 詳細なキャラページ
  { name: "特殊ページ", textLength: 1500 }    // 086.htmlのような短いページ
];

function calculateAdCount(config, textLength, isMobile = false) {
  const base = isMobile ? config.baseMobileCap : config.baseDesktopCap;
  const maxCap = isMobile ? config.dynamicMaxMobile : config.dynamicMaxDesktop;
  
  let extraSlots = 0;
  if (textLength > 0) {
    extraSlots = Math.floor(textLength / config.textLengthPerExtraSlot);
  }
  
  let total = base + extraSlots;
  if (total > maxCap) total = maxCap;
  if (total < 1) total = 1;
  
  return total;
}

console.log("=== ads-consent-loader.js CONFIG最適化テスト ===\n");

TEST_CASES.forEach(testCase => {
  console.log(`【${testCase.name}】 (${testCase.textLength.toLocaleString()}文字)`);
  
  // デスクトップ
  const oldDesktop = calculateAdCount(OLD_CONFIG, testCase.textLength, false);
  const newDesktop = calculateAdCount(NEW_CONFIG, testCase.textLength, false);
  console.log(`  デスクトップ: ${oldDesktop}個 → ${newDesktop}個 (${newDesktop - oldDesktop >= 0 ? '+' : ''}${newDesktop - oldDesktop})`);
  
  // モバイル
  const oldMobile = calculateAdCount(OLD_CONFIG, testCase.textLength, true);
  const newMobile = calculateAdCount(NEW_CONFIG, testCase.textLength, true);
  console.log(`  モバイル: ${oldMobile}個 → ${newMobile}個 (${newMobile - oldMobile >= 0 ? '+' : ''}${newMobile - oldMobile})`);
  
  console.log();
});

console.log("=== 最適化の効果 ===");
console.log("✅ textLengthPerExtraSlot: 1400 → 2500 (実測テキスト長に基づく調整)");
console.log("✅ baseDesktopCap: 8 → 6 (基本広告数を適度に減少)");
console.log("✅ baseMobileCap: 5 → 3 (モバイル基本数を大幅減少)");
console.log("✅ dynamicMaxDesktop: 12 → 10 (上限を適切に調整)");
console.log("✅ dynamicMaxMobile: 8 → 7 (モバイル上限を抑制)");
console.log("\n💡 結果: より適切な広告密度でユーザー体験向上 & 収益最適化");

// ===== 実行部分 =====
// Node.js環境で実行する場合はここをコメントアウト
// ブラウザで実行する場合はそのまま実行される
