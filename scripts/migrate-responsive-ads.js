#!/usr/bin/env node
/**
 * Responsive Ads Migration Script
 * 全てのHTMLファイルに対してレスポンシブ広告システムを適用
 * 2025-01-11 作成
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 設定
const config = {
  // 統一されたクライアントID
  adClient: 'ca-pub-1835873052239386',
  
  // 旧クライアントID（置換対象）
  oldClients: [
    'ca-pub-6234639838467127',
    // 必要に応じて他の古いIDを追加
  ],
  
  // スタイル・スクリプトの挿入位置を示すマーカー
  headMarkers: [
    '<link rel="preconnect" href="https://pagead2.googlesyndication.com">',
    '<script src="https://cdn.tailwindcss.com"></script>',
    '</head>'
  ],
  
  // 処理対象外のファイル
  excludePatterns: [
    '**/node_modules/**',
    '**/.*',
    '**/*.backup',
    '**/*.min.html'
  ]
};

/**
 * HTMLファイルを処理
 * @param {string} filePath - ファイルパス
 * @returns {boolean} - 変更があったかどうか
 */
function processHtmlFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 1. 古いクライアントIDを新しいものに置換
    config.oldClients.forEach(oldClient => {
      const regex = new RegExp(oldClient, 'g');
      if (content.includes(oldClient)) {
        content = content.replace(regex, config.adClient);
        hasChanges = true;
        console.log(`  ✓ Updated client ID: ${oldClient} → ${config.adClient}`);
      }
    });
    
    // 2. レスポンシブ広告システムのスタイル・スクリプトを追加
    const requiredAssets = [
      '<link rel="stylesheet" href="/js/responsive-ads.css">',
      '<script src="/js/responsive-ads-controller.js"></script>'
    ];
    
    // すでに追加済みかチェック
    const hasResponsiveAds = requiredAssets.some(asset => content.includes(asset));
    
    if (!hasResponsiveAds) {
      // 適切な位置にアセットを挿入
      let insertionPoint = -1;
      let marker = '';
      
      for (const testMarker of config.headMarkers) {
        insertionPoint = content.indexOf(testMarker);
        if (insertionPoint !== -1) {
          marker = testMarker;
          break;
        }
      }
      
      if (insertionPoint !== -1) {
        const insertAfter = insertionPoint + marker.length;
        const before = content.substring(0, insertAfter);
        const after = content.substring(insertAfter);
        
        content = before + '\n' + requiredAssets.join('\n') + after;
        hasChanges = true;
        console.log(`  ✓ Added responsive ads assets after: ${marker}`);
      }
    }
    
    // 3. PC用とモバイル用の広告を適切なクラスで分離
    // ad-pc, ad-sp クラスが付いていない古い広告要素を修正
    const adPattern = /<ins\s+class="adsbygoogle"([^>]*?)data-ad-slot="([^"]*?)"([^>]*?)>/g;
    content = content.replace(adPattern, (match, beforeSlot, slotId, afterSlot) => {
      // クラスにad-pcまたはad-spが含まれているかチェック
      if (match.includes(' ad-pc') || match.includes(' ad-sp')) {
        return match; // すでに適切なクラスが付いている
      }
      
      // スロットIDに基づいてデバイスタイプを判定
      const deviceClass = isPhoneSlot(slotId) ? ' ad-sp' : ' ad-pc';
      
      // クラス属性を更新
      const updatedMatch = match.replace(
        'class="adsbygoogle"',
        `class="adsbygoogle${deviceClass}"`
      );
      
      if (updatedMatch !== match) {
        hasChanges = true;
        console.log(`  ✓ Added device class ${deviceClass} to slot ${slotId}`);
      }
      
      return updatedMatch;
    });
    
    // ファイルを更新
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ File updated: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`  ⚪ No changes needed: ${path.basename(filePath)}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * スロットIDがモバイル用かどうか判定
 * @param {string} slotId - 広告スロットID
 * @returns {boolean}
 */
function isPhoneSlot(slotId) {
  const mobileSlots = ['8916646342', '3205934910', '6430083800'];
  return mobileSlots.includes(slotId);
}

/**
 * メイン処理
 */
function main() {
  console.log('🚀 Starting Responsive Ads Migration...\n');
  
  // HTMLファイルを検索
  const htmlFiles = glob.sync('**/*.html', {
    ignore: config.excludePatterns,
    absolute: true
  });
  
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  let processedCount = 0;
  let updatedCount = 0;
  
  htmlFiles.forEach(filePath => {
    processedCount++;
    if (processHtmlFile(filePath)) {
      updatedCount++;
    }
    console.log(''); // 空行を追加
  });
  
  console.log('📊 Migration Summary:');
  console.log(`  Total files processed: ${processedCount}`);
  console.log(`  Files updated: ${updatedCount}`);
  console.log(`  Files unchanged: ${processedCount - updatedCount}`);
  console.log('\n✅ Migration completed!');
}

// スクリプトが直接実行された場合にメイン処理を実行
if (require.main === module) {
  main();
}

module.exports = { processHtmlFile, isPhoneSlot };
