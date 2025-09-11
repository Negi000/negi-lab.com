#!/usr/bin/env node
/**
 * Wiki Page Text Length Analyzer
 * Wikiページの文字数を分析して適切な広告制御値を設定
 * 2025-01-11 作成
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 設定
const config = {
  wikiPaths: [
    'gamewiki/FellowMoon/site/characters',
    'gamewiki/FellowMoon/site/roms',
    'gamewiki/FellowMoon/site'
  ],
  excludePatterns: [
    '**/template.html',
    '**/index.html',
    '**/*_template.html',
    '**/search.html'
  ]
};

/**
 * HTMLファイルからテキスト長を取得
 * @param {string} filePath - ファイルパス
 * @returns {Object} - 分析結果
 */
function analyzeHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // body全体のテキスト
    const bodyText = document.body ? document.body.textContent : '';
    
    // メインコンテンツのテキスト（より正確）
    const mainSelectors = [
      'main',
      '.content-section',
      '.wiki-content',
      '[data-wiki-content="true"]',
      '.character-details',
      '.skill-section'
    ];
    
    let mainText = '';
    for (const selector of mainSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        mainText = element.textContent || '';
        break;
      }
    }
    
    // ナビゲーション・フッター・広告を除外したテキスト
    const excludeSelectors = [
      'nav', 'header', 'footer', 
      '.ad-block', '.adsbygoogle',
      '.wiki-hero', '.wiki-search',
      '.side-box', '.breadcrumb'
    ];
    
    let cleanText = bodyText;
    excludeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const elText = el.textContent || '';
        cleanText = cleanText.replace(elText, '');
      });
    });
    
    // 文字種別分析
    const analysis = {
      filePath: path.relative(process.cwd(), filePath),
      fileName: path.basename(filePath),
      bodyLength: bodyText.length,
      mainLength: mainText.length,
      cleanLength: cleanText.trim().length,
      // 日本語文字数（ひらがな・カタカナ・漢字）
      japaneseLength: (cleanText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length,
      // 英数字
      alphanumericLength: (cleanText.match(/[a-zA-Z0-9]/g) || []).length,
      // 改行・空白を除いた実質的な文字数
      substantialLength: cleanText.replace(/\s+/g, '').length
    };
    
    return analysis;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * 指定パスのHTMLファイルを再帰的に検索
 * @param {string} basePath - 基準パス
 * @returns {string[]} - ファイルパス配列
 */
function findHtmlFiles(basePath) {
  const files = [];
  
  function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.html')) {
        // 除外パターンチェック
        const shouldExclude = config.excludePatterns.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(fullPath);
        });
        
        if (!shouldExclude) {
          files.push(fullPath);
        }
      }
    });
  }
  
  traverse(basePath);
  return files;
}

/**
 * 統計分析
 * @param {Object[]} analyses - 分析結果配列
 * @returns {Object} - 統計情報
 */
function calculateStatistics(analyses) {
  const validAnalyses = analyses.filter(a => a !== null);
  
  if (validAnalyses.length === 0) {
    return { error: 'No valid analyses found' };
  }
  
  // 各指標の統計
  const metrics = ['bodyLength', 'mainLength', 'cleanLength', 'japaneseLength', 'substantialLength'];
  const stats = {};
  
  metrics.forEach(metric => {
    const values = validAnalyses.map(a => a[metric]).sort((a, b) => a - b);
    stats[metric] = {
      min: values[0],
      max: values[values.length - 1],
      median: values[Math.floor(values.length / 2)],
      mean: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
      q1: values[Math.floor(values.length * 0.25)],
      q3: values[Math.floor(values.length * 0.75)],
      p90: values[Math.floor(values.length * 0.9)]
    };
  });
  
  return {
    totalFiles: validAnalyses.length,
    stats: stats,
    recommendations: generateRecommendations(stats)
  };
}

/**
 * 推奨設定値を生成
 * @param {Object} stats - 統計情報
 * @returns {Object} - 推奨設定
 */
function generateRecommendations(stats) {
  const cleanStats = stats.cleanLength;
  
  return {
    // 短いページ（動的広告を挿入しない）
    minTextLength: Math.max(300, cleanStats.q1),
    
    // 中程度のページ（基本広告数）
    baseTextLength: cleanStats.median,
    
    // 長いページ（追加広告を許可）
    textLengthPerExtraSlot: Math.round(cleanStats.median * 0.8),
    
    // 広告上限
    maxDesktopAds: Math.min(12, Math.ceil(cleanStats.max / cleanStats.median * 3)),
    maxMobileAds: Math.min(8, Math.ceil(cleanStats.max / cleanStats.median * 2)),
    
    // 基本広告数
    baseDesktopAds: Math.min(8, Math.ceil(cleanStats.median / 1000 * 2)),
    baseMobileAds: Math.min(5, Math.ceil(cleanStats.median / 1000 * 1.5))
  };
}

/**
 * レポート生成
 * @param {Object} statistics - 統計情報
 * @param {Object[]} analyses - 全分析結果
 */
function generateReport(statistics, analyses) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: statistics,
    detailedData: analyses.filter(a => a !== null),
    configRecommendations: statistics.recommendations
  };
  
  // JSONレポート保存
  fs.writeFileSync('wiki-text-analysis-report.json', JSON.stringify(report, null, 2));
  
  // 人間可読レポート生成
  let readableReport = `
# Wiki Pages Text Length Analysis Report
Generated: ${new Date().toLocaleString('ja-JP')}

## Summary
- Total analyzed files: ${statistics.totalFiles}
- Analysis metric: Clean text length (excluding navigation, ads, etc.)

## Text Length Statistics (characters)
`;

  Object.entries(statistics.stats.cleanLength).forEach(([key, value]) => {
    readableReport += `- ${key.toUpperCase()}: ${value.toLocaleString()} characters\n`;
  });

  readableReport += `
## Current vs Recommended Settings

### Current Settings (ads-consent-loader.js)
- textLengthPerExtraSlot: 1400
- baseDesktopCap: 8
- baseMobileCap: 5
- dynamicMaxDesktop: 12
- dynamicMaxMobile: 8

### Recommended Settings
- minTextLength: ${statistics.recommendations.minTextLength} (for dynamic ads insertion)
- textLengthPerExtraSlot: ${statistics.recommendations.textLengthPerExtraSlot}
- baseDesktopCap: ${statistics.recommendations.baseDesktopAds}
- baseMobileCap: ${statistics.recommendations.baseMobileAds}
- dynamicMaxDesktop: ${statistics.recommendations.maxDesktopAds}
- dynamicMaxMobile: ${statistics.recommendations.maxMobileAds}

## File-by-File Analysis (Top 20 longest pages)
`;

  const sortedByLength = analyses
    .filter(a => a !== null)
    .sort((a, b) => b.cleanLength - a.cleanLength)
    .slice(0, 20);

  sortedByLength.forEach((analysis, index) => {
    readableReport += `${index + 1}. ${analysis.fileName} - ${analysis.cleanLength.toLocaleString()} chars\n`;
  });

  readableReport += `
## Recommendations for ads-consent-loader.js

Based on the analysis, here are the suggested configuration updates:

\`\`\`javascript
var CONFIG = {
  // ... other settings ...
  
  // Text-based thresholds
  minTextLengthForDynamicAds: ${statistics.recommendations.minTextLength},
  textLengthPerExtraSlot: ${statistics.recommendations.textLengthPerExtraSlot},
  
  // Ad caps
  baseDesktopCap: ${statistics.recommendations.baseDesktopAds},
  baseMobileCap: ${statistics.recommendations.baseMobileAds},
  dynamicMaxDesktop: ${statistics.recommendations.maxDesktopAds},
  dynamicMaxMobile: ${statistics.recommendations.maxMobileAds},
  
  // ... other settings ...
};
\`\`\`
`;

  fs.writeFileSync('WIKI_TEXT_ANALYSIS_REPORT.md', readableReport);
  
  console.log('\n📊 Analysis Complete!');
  console.log(`📄 Reports saved:`);
  console.log(`  - wiki-text-analysis-report.json (detailed data)`);
  console.log(`  - WIKI_TEXT_ANALYSIS_REPORT.md (human readable)`);
}

/**
 * メイン処理
 */
function main() {
  console.log('🔍 Starting Wiki pages text length analysis...\n');
  
  let allFiles = [];
  
  // 各Wikiパスからファイルを収集
  config.wikiPaths.forEach(wikiPath => {
    const fullPath = path.resolve(wikiPath);
    console.log(`Scanning: ${fullPath}`);
    
    if (fs.existsSync(fullPath)) {
      const files = findHtmlFiles(fullPath);
      console.log(`  Found ${files.length} HTML files`);
      allFiles = allFiles.concat(files);
    } else {
      console.log(`  ⚠️  Path not found: ${fullPath}`);
    }
  });
  
  console.log(`\nTotal files to analyze: ${allFiles.length}\n`);
  
  // 各ファイルを分析
  const analyses = [];
  let processed = 0;
  
  allFiles.forEach(filePath => {
    processed++;
    const analysis = analyzeHtmlFile(filePath);
    if (analysis) {
      analyses.push(analysis);
      if (processed % 10 === 0 || processed === allFiles.length) {
        console.log(`Progress: ${processed}/${allFiles.length} files processed`);
      }
    }
  });
  
  // 統計計算
  const statistics = calculateStatistics(analyses);
  
  if (statistics.error) {
    console.error('❌ Analysis failed:', statistics.error);
    return;
  }
  
  // レポート生成
  generateReport(statistics, analyses);
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { analyzeHtmlFile, calculateStatistics };
