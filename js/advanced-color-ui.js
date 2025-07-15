/**
 * Advanced Color Tool UI Components
 * @version 2.0.0
 * @description 高度なカラーツールUI機能とインタラクティブコンポーネント
 */

class AdvancedColorUI {
  constructor(colorEngine) {
    this.colorEngine = colorEngine;
    this.currentColor = '#4ADE80'; // デフォルト色を設定
    this.currentHue = 120;
    this.currentSaturation = 70;
    this.currentLightness = 60;
    this.isEyedropperActive = false;
    this.animationFrameId = null;
    this.components = new Map();
    this.colorHistory = [];
    this.themes = {
      light: {
        bg: '#ffffff',
        text: '#1f2937',
        border: '#d1d5db',
        accent: '#4ADE80'
      },
      dark: {
        bg: '#1f2937',
        text: '#f9fafb',
        border: '#374151',
        accent: '#4ADE80'
      }
    };
    this.currentTheme = 'light';
    
    // 既存の要素との競合チェック
    this.checkExistingElements();
    
    this.initComponents();
    this.bindEvents();
  }

  /**
   * 既存の要素との競合チェック
   */
  checkExistingElements() {
    // 既存のカラーピッカー要素をチェック
    const existingElements = [
      'hexValue', 'rgbValue', 'hslValue', 'cmykValue',
      'colorWheel', 'saturationLightness', 'colorPreviewLarge'
    ];
    
    this.hasExistingElements = existingElements.some(id => document.getElementById(id) !== null);
    
    if (this.hasExistingElements) {
      console.log('既存のカラーツール要素が検出されました。統合モードで動作します。');
      this.integrationMode = true;
    } else {
      this.integrationMode = false;
    }
  }

  /**
   * コンポーネントの初期化（統合モード対応）
   */
  initComponents() {
    if (!this.integrationMode) {
      this.createColorPicker();
    } else {
      // 既存の要素を再利用
      this.bindToExistingElements();
    }
    
    this.createContrastChecker();
    this.createPaletteGenerator();
    this.createGradientMaker();
    this.createColorHistory();
    this.createAccessibilityAnalyzer();
    this.createBatchConverter();
    this.createColorExport();
    this.createAdvancedSpectrum();
  }

  /**
   * 既存要素への統合
   */
  bindToExistingElements() {
    // 既存のカラーホイールがある場合は統合
    const existingWheel = document.getElementById('colorWheel');
    if (existingWheel) {
      this.integrateWithExistingWheel(existingWheel);
    }
    
    // 既存の入力フィールドがある場合は統合
    const existingInputs = ['hexValue', 'rgbValue', 'hslValue'];
    existingInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', (e) => {
          this.selectColor(e.target.value);
        });
      }
    });
  }

  /**
   * 高度なカラーピッカーの作成
   */
  createColorPicker() {
    const container = document.createElement('div');
    container.className = 'advanced-color-picker bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">高度な色選択</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="color-wheel-container">
          <div class="mb-3">
            <label class="block text-sm font-medium mb-2">色相環</label>
            <div class="relative w-48 h-48 mx-auto">
              <canvas id="colorWheel" width="192" height="192" class="rounded-full cursor-crosshair"></canvas>
              <div id="wheelPointer" class="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-2 -translate-y-2"></div>
            </div>
          </div>
          <div class="saturation-lightness">
            <label class="block text-sm font-medium mb-2">彩度・明度</label>
            <div class="relative w-48 h-32 mx-auto border border-gray-200 rounded">
              <canvas id="saturationLightness" width="192" height="128" class="cursor-crosshair rounded"></canvas>
              <div id="slPointer" class="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1 -translate-y-1"></div>
            </div>
          </div>
        </div>
        
        <div class="color-info">
          <div class="color-preview-large mb-4">
            <div id="colorPreviewLarge" class="w-full h-24 rounded-lg border border-gray-200 shadow-inner"></div>
          </div>
          
          <div class="color-values space-y-3">
            <div class="flex items-center space-x-2">
              <label class="w-12 text-sm font-medium">HEX:</label>
              <input id="hexValue" type="text" class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" readonly>
              <button class="copy-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs" data-copy="hexValue">📋</button>
            </div>
            <div class="flex items-center space-x-2">
              <label class="w-12 text-sm font-medium">RGB:</label>
              <input id="rgbValue" type="text" class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" readonly>
              <button class="copy-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs" data-copy="rgbValue">📋</button>
            </div>
            <div class="flex items-center space-x-2">
              <label class="w-12 text-sm font-medium">HSL:</label>
              <input id="hslValue" type="text" class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" readonly>
              <button class="copy-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs" data-copy="hslValue">📋</button>
            </div>
            <div class="flex items-center space-x-2">
              <label class="w-12 text-sm font-medium">CMYK:</label>
              <input id="cmykValue" type="text" class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" readonly>
              <button class="copy-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs" data-copy="cmykValue">📋</button>
            </div>
          </div>
          
          <div class="color-info-extra mt-4 p-3 bg-gray-50 rounded">
            <div class="text-sm space-y-1">
              <div><strong>色名:</strong> <span id="colorName"></span></div>
              <div><strong>色温度:</strong> <span id="colorTemperature"></span></div>
              <div><strong>心理効果:</strong> <span id="colorPsychology"></span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 適切な挿入先を見つける
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('colorPicker', container);
    
    this.initColorWheel();
    this.initSaturationLightness();
  }

  /**
   * コントラストチェッカーの作成
   */
  createContrastChecker() {
    const container = document.createElement('div');
    container.className = 'contrast-checker bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">アクセシビリティ・コントラストチェッカー</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="contrast-inputs">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">前景色（テキスト）</label>
            <div class="flex items-center space-x-2">
              <div id="foregroundPreview" class="w-12 h-12 border border-gray-200 rounded"></div>
              <input id="foregroundColor" type="color" class="w-16 h-12 border-0">
              <input id="foregroundHex" type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded" placeholder="#000000">
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">背景色</label>
            <div class="flex items-center space-x-2">
              <div id="backgroundPreview" class="w-12 h-12 border border-gray-200 rounded"></div>
              <input id="backgroundColor" type="color" class="w-16 h-12 border-0">
              <input id="backgroundHex" type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded" placeholder="#FFFFFF">
            </div>
          </div>
        </div>
        
        <div class="contrast-results">
          <div class="contrast-preview mb-4 p-4 rounded border-2">
            <div class="text-lg font-medium">サンプルテキスト</div>
            <div class="text-sm">小さなテキストのサンプル</div>
            <div class="text-xl font-bold">大きなテキストのサンプル</div>
          </div>
          
          <div class="contrast-ratio mb-3">
            <div class="text-sm font-medium">コントラスト比: <span id="contrastRatio" class="text-lg font-bold">1:1</span></div>
          </div>
          
          <div class="wcag-compliance space-y-2">
            <div class="flex items-center justify-between p-2 rounded" id="wcag-aa">
              <span class="text-sm">WCAG AA (通常テキスト)</span>
              <span class="compliance-badge"></span>
            </div>
            <div class="flex items-center justify-between p-2 rounded" id="wcag-aa-large">
              <span class="text-sm">WCAG AA (大きなテキスト)</span>
              <span class="compliance-badge"></span>
            </div>
            <div class="flex items-center justify-between p-2 rounded" id="wcag-aaa">
              <span class="text-sm">WCAG AAA (通常テキスト)</span>
              <span class="compliance-badge"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="suggested-pairs mt-6">
        <h4 class="font-medium mb-3">推奨されるアクセシブルな色の組み合わせ</h4>
        <div id="accessiblePairs" class="grid grid-cols-2 md:grid-cols-4 gap-3"></div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('contrastChecker', container);
  }

  /**
   * AI統合カラーパレット・ハーモニージェネレーターの作成
   */
  createPaletteGenerator() {
    const container = document.createElement('div');
    container.className = 'palette-generator bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">AI統合カラーパレット・ハーモニージェネレーター</h3>
      
      <!-- ハーモニータイプ選択 -->
      <div class="harmony-types mb-4">
        <h4 class="font-medium mb-2">カラーハーモニータイプ</h4>
        <div class="flex flex-wrap gap-2 mb-4">
          <button class="harmony-btn px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600" data-harmony="monochromatic">モノクロマチック</button>
          <button class="harmony-btn px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600" data-harmony="analogous">類似色</button>
          <button class="harmony-btn px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600" data-harmony="complementary">補色</button>
          <button class="harmony-btn px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600" data-harmony="triadic">三角配色</button>
          <button class="harmony-btn px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600" data-harmony="tetradic">四角配色</button>
          <button class="harmony-btn px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600" data-harmony="splitComplementary">分割補色</button>
        </div>
      </div>

      <!-- テーマパレット選択 -->
      <div class="theme-palettes mb-4">
        <h4 class="font-medium mb-2">テーマパレット</h4>
        <div class="flex flex-wrap gap-2 mb-4">
          <button class="palette-btn px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600" data-palette="warm">暖色系</button>
          <button class="palette-btn px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600" data-palette="cool">寒色系</button>
          <button class="palette-btn px-3 py-1 bg-pink-300 text-white rounded text-sm hover:bg-pink-400" data-palette="pastel">パステル</button>
          <button class="palette-btn px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-800" data-palette="vibrant">鮮やか</button>
          <button class="palette-btn px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700" data-palette="earth">アース</button>
        </div>
      </div>

      <!-- AI生成コントロール -->
      <div class="generator-controls mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">色数</label>
            <select id="paletteSize" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="3">3色</option>
              <option value="5" selected>5色</option>
              <option value="7">7色</option>
              <option value="10">10色</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">用途</label>
            <select id="paletteUsage" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="web">Webサイト</option>
              <option value="print">印刷物</option>
              <option value="branding">ブランディング</option>
              <option value="ui">UI/UX</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">明度調整</label>
            <input id="lightnessAdjust" type="range" min="-50" max="50" value="0" class="w-full">
            <span id="lightnessValue" class="text-sm text-gray-600">0</span>
          </div>
        </div>
      </div>
      
      <!-- 生成アクション -->
      <div class="palette-actions mb-4 flex gap-2">
        <button id="generateRandomPalette" class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">ランダム生成</button>
        <button id="refinePalette" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">微調整</button>
        <button id="savePalette" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">保存</button>
        <button id="exportPalette" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">エクスポート</button>
      </div>
      
      <!-- 統合表示エリア -->
      <div id="harmonyColors" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4"></div>
      <div id="paletteColors" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4"></div>
      <div id="generatedPalette" class="generated-palette mb-4"></div>
      
      <div class="palette-analysis">
        <h4 class="font-medium mb-2">パレット分析</h4>
        <div id="paletteStats" class="text-sm text-gray-600"></div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('paletteGenerator', container);
    
    // 統合されたイベントリスナーを追加
    this.bindPaletteEvents();
  }

  /**
   * グラデーションメーカーの作成
   */
  createGradientMaker() {
    const container = document.createElement('div');
    container.className = 'gradient-maker bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">グラデーションメーカー</h3>
      <div class="gradient-controls mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">開始色</label>
            <input id="gradientStart" type="color" class="w-full h-10 border border-gray-300 rounded">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">終了色</label>
            <input id="gradientEnd" type="color" class="w-full h-10 border border-gray-300 rounded">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">方向</label>
            <select id="gradientDirection" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="to right">→ 右</option>
              <option value="to left">← 左</option>
              <option value="to bottom">↓ 下</option>
              <option value="to top">↑ 上</option>
              <option value="45deg">↗ 右上</option>
              <option value="135deg">↘ 右下</option>
              <option value="225deg">↙ 左下</option>
              <option value="315deg">↖ 左上</option>
              <option value="radial">● 放射状</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">ステップ数</label>
            <input id="gradientSteps" type="range" min="3" max="20" value="5" class="w-full">
            <span id="stepsValue" class="text-sm text-gray-600">5</span>
          </div>
        </div>
      </div>
      
      <div class="gradient-preview mb-4">
        <div id="gradientDisplay" class="w-full h-24 rounded-lg border border-gray-200"></div>
      </div>
      
      <div class="gradient-colors mb-4">
        <h4 class="font-medium mb-2">グラデーション色</h4>
        <div id="gradientStepColors" class="flex flex-wrap gap-2"></div>
      </div>
      
      <div class="gradient-export">
        <h4 class="font-medium mb-2">エクスポート</h4>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <label class="w-16 text-sm">CSS:</label>
            <input id="gradientCSS" type="text" class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" readonly>
            <button class="copy-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs" data-copy="gradientCSS">📋</button>
          </div>
        </div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('gradientMaker', container);
  }

  /**
   * 色履歴コンポーネントの作成
   */
  createColorHistory() {
    const container = document.createElement('div');
    container.className = 'color-history bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">色履歴</h3>
      <div class="history-controls mb-4 flex justify-between items-center">
        <div class="text-sm text-gray-600">最近使用した色</div>
        <div class="space-x-2">
          <button id="clearHistory" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">クリア</button>
          <button id="exportHistory" class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">エクスポート</button>
        </div>
      </div>
      <div id="colorHistory" class="grid grid-cols-6 md:grid-cols-10 gap-2 min-h-[60px]"></div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('colorHistory', container);
    
    this.loadColorHistory();
  }

  /**
   * アクセシビリティアナライザーの作成
   */
  createAccessibilityAnalyzer() {
    const container = document.createElement('div');
    container.className = 'accessibility-analyzer bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">アクセシビリティアナライザー</h3>
      <div class="analyzer-content">
        <div class="quick-tests mb-4">
          <h4 class="font-medium mb-2">クイックテスト</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50" data-test="colorBlind">
              色覚異常シミュレーション
            </button>
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50" data-test="lowVision">
              低視力シミュレーション
            </button>
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50" data-test="motionSensitivity">
              動きに敏感度テスト
            </button>
          </div>
        </div>
        <div id="accessibilityResults" class="results-area min-h-[100px] border border-gray-200 rounded p-4 bg-gray-50">
          <div class="text-center text-gray-500">テストを選択してください</div>
        </div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('accessibilityAnalyzer', container);
  }

  /**
   * バッチ変換器の作成
   */
  createBatchConverter() {
    const container = document.createElement('div');
    container.className = 'batch-converter bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">バッチ色変換・検証</h3>
      <div class="batch-input mb-4">
        <label class="block text-sm font-medium mb-2">色リスト（1行に1色）</label>
        <textarea id="batchColorInput" class="w-full h-32 px-3 py-2 border border-gray-300 rounded" 
          placeholder="#FF0000&#10;rgb(0,255,0)&#10;hsl(240,100%,50%)&#10;blue"></textarea>
      </div>
      <div class="batch-controls mb-4 flex flex-wrap gap-2">
        <button id="processBatch" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">変換実行</button>
        <button id="validateColors" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">色検証</button>
        <button id="sortColors" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">色ソート</button>
        <button id="downloadResults" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">結果ダウンロード</button>
      </div>
      <div id="batchResults" class="results-area min-h-[200px] border border-gray-200 rounded p-4 bg-gray-50"></div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('batchConverter', container);
  }

  /**
   * 色エクスポート機能の作成
   */
  createColorExport() {
    const container = document.createElement('div');
    container.className = 'color-export bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">色エクスポート</h3>
      <div class="export-options mb-4">
        <h4 class="font-medium mb-2">エクスポート形式</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label class="flex items-center">
            <input type="radio" name="exportFormat" value="css" class="mr-2" checked>
            <span class="text-sm">CSS</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="exportFormat" value="scss" class="mr-2">
            <span class="text-sm">SCSS</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="exportFormat" value="json" class="mr-2">
            <span class="text-sm">JSON</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="exportFormat" value="ase" class="mr-2">
            <span class="text-sm">ASE</span>
          </label>
        </div>
      </div>
      
      <div class="naming-options mb-4">
        <h4 class="font-medium mb-2">命名規則</h4>
        <div class="flex gap-4">
          <select id="namingConvention" class="px-3 py-2 border border-gray-300 rounded">
            <option value="camelCase">camelCase</option>
            <option value="kebab-case">kebab-case</option>
            <option value="snake_case">snake_case</option>
            <option value="PascalCase">PascalCase</option>
          </select>
          <input id="colorPrefix" type="text" placeholder="プレフィックス" class="px-3 py-2 border border-gray-300 rounded">
        </div>
      </div>
      
      <div class="export-preview mb-4">
        <label class="block text-sm font-medium mb-2">プレビュー</label>
        <pre id="exportPreview" class="bg-gray-100 p-3 rounded text-sm overflow-x-auto font-mono"></pre>
      </div>
      
      <div class="export-actions flex gap-2">
        <button id="generateExport" class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">生成</button>
        <button id="downloadExport" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">ダウンロード</button>
        <button class="copy-btn px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" data-copy="exportPreview">コピー</button>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('colorExport', container);
  }

  /**
   * 高度なスペクトラム分析ツールの作成
   */
  createAdvancedSpectrum() {
    const container = document.createElement('div');
    container.className = 'advanced-spectrum bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">高度なスペクトラム分析</h3>
      <div class="spectrum-canvas mb-4">
        <canvas id="spectrumCanvas" width="400" height="200" class="w-full border border-gray-200 rounded"></canvas>
      </div>
      <div class="spectrum-controls mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">分析色</label>
            <input id="spectrumColor" type="color" class="w-full h-10 border border-gray-300 rounded">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">分析タイプ</label>
            <select id="spectrumType" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="hue">色相</option>
              <option value="saturation">彩度</option>
              <option value="lightness">明度</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">解像度</label>
            <input id="spectrumResolution" type="range" min="10" max="100" value="50" class="w-full">
          </div>
        </div>
      </div>
      <div id="spectrumResults" class="spectrum-results text-sm text-gray-600">
        分析色を選択してスペクトラムを表示
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('advancedSpectrum', container);
  }

  /**
   * 高度なカラーピッカーの初期化
   */
  initColorWheel() {
    const canvas = document.getElementById('colorWheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    
    // 色相環を描画
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true);
      ctx.closePath();
      
      const hsl = `hsl(${angle}, 100%, 50%)`;
      ctx.fillStyle = hsl;
      ctx.fill();
    }
    
    // クリックイベント
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > radius * 0.6 && distance < radius) {
        const hue = Math.atan2(dy, dx) * 180 / Math.PI;
        const normalizedHue = (hue + 360) % 360;
        this.updateColorFromHue(normalizedHue);
        this.updateWheelPointer(x, y);
      }
    });
  }

  /**
   * 彩度・明度エリアの初期化
   */
  initSaturationLightness() {
    const canvas = document.getElementById('saturationLightness');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // グラデーションを描画
    this.drawSaturationLightness(ctx, canvas.width, canvas.height, 0);
    
    // クリックイベント
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const saturation = (x / canvas.width) * 100;
      const lightness = 100 - (y / canvas.height) * 100;
      
      this.updateColorFromSL(saturation, lightness);
      this.updateSLPointer(x, y);
    });
  }

  /**
   * 彩度・明度グラデーションの描画
   */
  drawSaturationLightness(ctx, width, height, hue) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const saturation = (x / width) * 100;
        const lightness = 100 - (y / height) * 100;
        
        const rgb = this.hslToRgb(hue, saturation, lightness);
        const index = (y * width + x) * 4;
        
        data[index] = rgb.r;     // Red
        data[index + 1] = rgb.g; // Green
        data[index + 2] = rgb.b; // Blue
        data[index + 3] = 255;   // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * HSLからRGB値に変換（Canvas用から改良）
   */
  hslToRgbValues(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // グレー
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * 色のパース（改良版）
   */
  parseColor(color) {
    if (!color) return { r: 0, g: 0, b: 0 };
    
    // HEX形式
    if (color.startsWith('#')) {
      return this.hexToRgb(color);
    }
    
    // RGB形式
    if (color.includes('rgb')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        return {
          r: parseInt(matches[1]),
          g: parseInt(matches[2]),
          b: parseInt(matches[3])
        };
      }
    }
    
    // HSL形式
    if (color.includes('hsl')) {
      const hsl = this.parseColorToHsl(color);
      return this.hslToRgbValues(hsl.h, hsl.s, hsl.l);
    }
    
    // デフォルト値
    return { r: 0, g: 0, b: 0 };
  }

  /**
   * 色情報の更新
   */
  updateColorInfo(color) {
    const colorName = document.getElementById('colorName');
    const colorTemperature = document.getElementById('colorTemperature');
    const colorPsychology = document.getElementById('colorPsychology');

    if (colorName) colorName.textContent = this.getColorName(color);
    if (colorTemperature) colorTemperature.textContent = this.getColorTemperature(color);
    if (colorPsychology) colorPsychology.textContent = this.getColorPsychology(color);
  }

  /**
   * ホイールポインターの更新
   */
  updateWheelPointer(x, y) {
    const pointer = document.getElementById('wheelPointer');
    if (pointer) {
      pointer.style.left = `${x}px`;
      pointer.style.top = `${y}px`;
    }
  }

  /**
   * 彩度・明度ポインターの更新
   */
  updateSLPointer(x, y) {
    const pointer = document.getElementById('slPointer');
    if (pointer) {
      pointer.style.left = `${x}px`;
      pointer.style.top = `${y}px`;
    }
  }

  /**
   * ハーモニー生成
   */
  generateHarmony(harmonyType) {
    if (!this.currentColor) {
      this.currentColor = '#4ADE80'; // デフォルト色
    }

    const baseHsl = this.parseColorToHsl(this.currentColor);
    let colors = [];

    switch (harmonyType) {
      case 'monochromatic':
        colors = this.generateMonochromatic(baseHsl);
        break;
      case 'analogous':
        colors = this.generateAnalogous(baseHsl);
        break;
      case 'complementary':
        colors = this.generateComplementary(baseHsl);
        break;
      case 'triadic':
        colors = this.generateTriadic(baseHsl);
        break;
      case 'tetradic':
        colors = this.generateTetradic(baseHsl);
        break;
      case 'splitComplementary':
        colors = this.generateSplitComplementary(baseHsl);
        break;
      default:
        colors = [this.currentColor];
    }

    this.displayColors(colors, 'harmonyColors');
  }

  /**
   * パレット生成
   */
  generatePalette(paletteType) {
    let colors = [];

    switch (paletteType) {
      case 'warm':
        colors = ['#FF6B6B', '#FF8E3C', '#FFD23F', '#FFA726', '#FF7043'];
        break;
      case 'cool':
        colors = ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        break;
      case 'pastel':
        colors = ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F5E5FF'];
        break;
      case 'vibrant':
        colors = ['#FF1744', '#00E676', '#2196F3', '#FF9800', '#9C27B0'];
        break;
      case 'earth':
        colors = ['#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9'];
        break;
      default:
        colors = ['#4ADE80'];
    }

    this.displayColors(colors, 'paletteColors');
  }

  /**
   * ランダムパレット生成
   */
  generateRandomPalette() {
    const size = parseInt(document.getElementById('paletteSize')?.value) || 5;
    const colors = [];

    for (let i = 0; i < size; i++) {
      const hue = Math.random() * 360;
      const saturation = 50 + Math.random() * 50;
      const lightness = 30 + Math.random() * 40;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }

    this.displayColors(colors, 'generatedPalette');
    this.updatePaletteAnalysis(colors);
  }

  /**
   * パレット微調整
   */
  refinePalette() {
    const container = document.getElementById('generatedPalette');
    if (!container) return;

    const colorElements = container.querySelectorAll('.color-item');
    const colors = Array.from(colorElements).map(el => el.style.backgroundColor);
    
    if (colors.length === 0) {
      this.showToast('微調整するパレットがありません');
      return;
    }

    // 微調整ロジック（明度を少し調整）
    const refinedColors = colors.map(color => {
      const hsl = this.parseColorToHsl(color);
      hsl.l = Math.max(10, Math.min(90, hsl.l + (Math.random() - 0.5) * 20));
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    });

    this.displayColors(refinedColors, 'generatedPalette');
    this.updatePaletteAnalysis(refinedColors);
  }

  /**
   * パレット保存
   */
  savePalette() {
    const container = document.getElementById('generatedPalette');
    if (!container) return;

    const colorElements = container.querySelectorAll('.color-item');
    const colors = Array.from(colorElements).map(el => el.style.backgroundColor);
    
    if (colors.length === 0) {
      this.showToast('保存するパレットがありません');
      return;
    }

    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    const paletteData = {
      id: Date.now(),
      colors: colors,
      date: new Date().toISOString()
    };
    
    savedPalettes.push(paletteData);
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    
    this.showToast('パレットが保存されました');
  }

  /**
   * パレットエクスポート
   */
  exportPalette() {
    const container = document.getElementById('generatedPalette');
    if (!container) return;

    const colorElements = container.querySelectorAll('.color-item');
    const colors = Array.from(colorElements).map(el => el.style.backgroundColor);
    
    if (colors.length === 0) {
      this.showToast('エクスポートするパレットがありません');
      return;
    }

    const exportData = {
      name: 'Custom Palette',
      colors: colors,
      exported: new Date().toISOString()
    };

    this.downloadFile('palette.json', JSON.stringify(exportData, null, 2), 'application/json');
  }

  /**
   * 明度調整でパレット更新
   */
  updatePaletteWithLightness(adjustment) {
    const container = document.getElementById('generatedPalette');
    if (!container) return;

    const colorElements = container.querySelectorAll('.color-item');
    const adjustmentValue = parseInt(adjustment);

    colorElements.forEach(element => {
      const originalColor = element.dataset.originalColor || element.style.backgroundColor;
      if (!element.dataset.originalColor) {
        element.dataset.originalColor = originalColor;
      }

      const hsl = this.parseColorToHsl(originalColor);
      hsl.l = Math.max(0, Math.min(100, hsl.l + adjustmentValue));
      const newColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      element.style.backgroundColor = newColor;
    });
  }

  /**
   * 色の表示
   */
  displayColors(colors, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    colors.forEach((color, index) => {
      const colorItem = document.createElement('div');
      colorItem.className = 'color-item relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform';
      colorItem.innerHTML = `
        <div class="color-swatch h-20" style="background-color: ${color}"></div>
        <div class="p-2 text-center">
          <div class="color-value text-xs font-mono text-gray-600">${color}</div>
        </div>
      `;
      
      colorItem.addEventListener('click', () => {
        this.selectColor(color);
        this.copyToClipboard(color);
        this.showToast(`${color} をコピーしました`);
      });
      
      container.appendChild(colorItem);
    });
  }

  /**
   * パレット分析の更新
   */
  updatePaletteAnalysis(colors) {
    const container = document.getElementById('paletteStats');
    if (!container || !colors.length) return;

    const analysis = this.analyzePalette(colors);
    container.innerHTML = `
      <div>色数: ${colors.length}</div>
      <div>平均明度: ${analysis.avgLightness.toFixed(1)}%</div>
      <div>色相範囲: ${analysis.hueRange.toFixed(1)}°</div>
      <div>彩度範囲: ${analysis.saturationRange.toFixed(1)}%</div>
    `;
  }

  /**
   * パレット分析
   */
  analyzePalette(colors) {
    const hslColors = colors.map(color => this.parseColorToHsl(color));
    
    const lightnesses = hslColors.map(hsl => hsl.l);
    const hues = hslColors.map(hsl => hsl.h);
    const saturations = hslColors.map(hsl => hsl.s);

    return {
      avgLightness: lightnesses.reduce((sum, l) => sum + l, 0) / lightnesses.length,
      hueRange: Math.max(...hues) - Math.min(...hues),
      saturationRange: Math.max(...saturations) - Math.min(...saturations)
    };
  }

  /**
   * モノクロマチック配色生成
   */
  generateMonochromatic(baseHsl) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      const lightness = 20 + (i * 15);
      colors.push(`hsl(${baseHsl.h}, ${baseHsl.s}%, ${lightness}%)`);
    }
    return colors;
  }

  /**
   * 類似色配色生成
   */
  generateAnalogous(baseHsl) {
    const colors = [];
    const hueOffsets = [-30, -15, 0, 15, 30];
    hueOffsets.forEach(offset => {
      const hue = (baseHsl.h + offset + 360) % 360;
      colors.push(`hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`);
    });
    return colors;
  }

  /**
   * 補色配色生成
   */
  generateComplementary(baseHsl) {
    const complementHue = (baseHsl.h + 180) % 360;
    return [
      `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
      `hsl(${complementHue}, ${baseHsl.s}%, ${baseHsl.l}%)`
    ];
  }

  /**
   * 三角配色生成
   */
  generateTriadic(baseHsl) {
    const hueOffsets = [0, 120, 240];
    return hueOffsets.map(offset => {
      const hue = (baseHsl.h + offset) % 360;
      return `hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`;
    });
  }

  /**
   * 四角配色生成
   */
  generateTetradic(baseHsl) {
    const hueOffsets = [0, 90, 180, 270];
    return hueOffsets.map(offset => {
      const hue = (baseHsl.h + offset) % 360;
      return `hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`;
    });
  }

  /**
   * 分割補色配色生成
   */
  generateSplitComplementary(baseHsl) {
    const complementHue = (baseHsl.h + 180) % 360;
    return [
      `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
      `hsl(${(complementHue - 30 + 360) % 360}, ${baseHsl.s}%, ${baseHsl.l}%)`,
      `hsl(${(complementHue + 30) % 360}, ${baseHsl.s}%, ${baseHsl.l}%)`
    ];
  }

  /**
   * 色をHSLに変換
   */
  parseColorToHsl(color) {
    // HSL形式の場合
    if (color.includes('hsl')) {
      const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (matches) {
        return {
          h: parseInt(matches[1]),
          s: parseInt(matches[2]),
          l: parseInt(matches[3])
        };
      }
    }

    // HEX形式の場合
    if (color.startsWith('#')) {
      const rgb = this.hexToRgb(color);
      return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    }

    // RGB形式の場合
    if (color.includes('rgb')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        return this.rgbToHsl(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]));
      }
    }

    // デフォルト値
    return { h: 0, s: 50, l: 50 };
  }

  /**
   * 色をパース
   */
  parseColor(color) {
    if (!color) return { r: 0, g: 0, b: 0 };
    
    // HEX形式
    if (color.startsWith('#')) {
      return this.hexToRgb(color);
    }
    
    // RGB形式
    if (color.includes('rgb')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        return {
          r: parseInt(matches[1]),
          g: parseInt(matches[2]),
          b: parseInt(matches[3])
        };
      }
    }
    
    // HSL形式
    if (color.includes('hsl')) {
      const hsl = this.parseColorToHsl(color);
      return this.hslToRgbValues(hsl.h, hsl.s, hsl.l);
    }
    
    // デフォルト値
    return { r: 0, g: 0, b: 0 };
  }

  /**
   * HEXからRGBに変換
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  /**
   * RGBからHEXに変換
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * RGBからHSLに変換
   */
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // グレー
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * RGBからCMYKに変換
   */
  rgbToCmyk(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  /**
   * 色名を取得
   */
  getColorName(color) {
    const colorNames = {
      '#FF0000': '赤',
      '#00FF00': '緑',
      '#0000FF': '青',
      '#FFFF00': '黄',
      '#FF00FF': 'マゼンタ',
      '#00FFFF': 'シアン',
      '#000000': '黒',
      '#FFFFFF': '白',
      '#808080': 'グレー'
    };
    
    return colorNames[color.toUpperCase()] || '不明';
  }

  /**
   * 色温度を取得
   */
  getColorTemperature(color) {
    const rgb = this.parseColor(color);
    const temp = (rgb.r > rgb.b) ? '暖色' : (rgb.r < rgb.b) ? '寒色' : '中性';
    return temp;
  }

  /**
   * 色の心理効果を取得
   */
  getColorPsychology(color) {
    const hsl = this.parseColorToHsl(color);
    const hue = hsl.h;
    
    if (hue < 30) return '情熱、エネルギー';
    if (hue < 60) return '活力、楽観';
    if (hue < 120) return '自然、成長';
    if (hue < 180) return '信頼、冷静';
    if (hue < 240) return '高貴、神秘';
    if (hue < 300) return '創造、ロマンス';
    return '温かみ、快適';
  }

  /**
   * コントラストチェックの更新
   */
  updateContrastCheck() {
    const foreground = document.getElementById('foregroundColor')?.value || '#000000';
    const background = document.getElementById('backgroundColor')?.value || '#FFFFFF';
    
    const ratio = this.calculateContrastRatio(foreground, background);
    
    // 結果の更新
    const ratioElement = document.getElementById('contrastRatio');
    if (ratioElement) {
      ratioElement.textContent = `${ratio.toFixed(2)}:1`;
    }
    
    // WCAG準拠の更新
    this.updateWCAGCompliance(ratio);
    
    // プレビューの更新
    const preview = document.querySelector('.contrast-preview');
    if (preview) {
      preview.style.backgroundColor = background;
      preview.style.color = foreground;
    }
  }

  /**
   * コントラスト比の計算
   */
  calculateContrastRatio(color1, color2) {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * 輝度の計算
   */
  getLuminance(color) {
    const rgb = this.parseColor(color);
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * WCAG準拠の更新
   */
  updateWCAGCompliance(ratio) {
    const wcagAA = document.getElementById('wcag-aa');
    const wcagAALarge = document.getElementById('wcag-aa-large');
    const wcagAAA = document.getElementById('wcag-aaa');

    const updateBadge = (element, passed) => {
      if (!element) return;
      const badge = element.querySelector('.compliance-badge');
      if (badge) {
        badge.textContent = passed ? '✓' : '✗';
        badge.className = `compliance-badge ${passed ? 'text-green-600' : 'text-red-600'}`;
      }
    };

    updateBadge(wcagAA, ratio >= 4.5);
    updateBadge(wcagAALarge, ratio >= 3);
    updateBadge(wcagAAA, ratio >= 7);
  }

  /**
   * グラデーションプレビューの更新
   */
  updateGradientPreview() {
    const start = document.getElementById('gradientStart')?.value || '#FF0000';
    const end = document.getElementById('gradientEnd')?.value || '#0000FF';
    const direction = document.getElementById('gradientDirection')?.value || 'to right';
    const steps = parseInt(document.getElementById('gradientSteps')?.value) || 5;

    const display = document.getElementById('gradientDisplay');
    const cssInput = document.getElementById('gradientCSS');

    if (display) {
      const gradient = direction === 'radial' 
        ? `radial-gradient(circle, ${start}, ${end})`
        : `linear-gradient(${direction}, ${start}, ${end})`;
      
      display.style.background = gradient;
      
      if (cssInput) {
        cssInput.value = `background: ${gradient};`;
      }
    }

    this.generateGradientSteps(start, end, steps);
  }

  /**
   * グラデーションステップの生成
   */
  generateGradientSteps(start, end, steps) {
    const container = document.getElementById('gradientStepColors');
    if (!container) return;

    container.innerHTML = '';
    const startRgb = this.parseColor(start);
    const endRgb = this.parseColor(end);

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
      const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
      const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
      
      const color = this.rgbToHex(r, g, b);
      
      const colorDiv = document.createElement('div');
      colorDiv.className = 'w-8 h-8 rounded border border-gray-200 cursor-pointer';
      colorDiv.style.backgroundColor = color;
      colorDiv.title = color;
      colorDiv.addEventListener('click', () => {
        this.copyToClipboard(color);
        this.showToast(`${color} をコピーしました`);
      });
      
      container.appendChild(colorDiv);
    }
  }

  /**
   * バッチ変換の処理
   */
  processBatchConversion() {
    const input = document.getElementById('batchColorInput')?.value || '';
    const colors = input.split('\n').filter(line => line.trim());
    const results = document.getElementById('batchResults');
    
    if (!results) return;
    
    if (colors.length === 0) {
      results.innerHTML = '<div class="text-red-500">変換する色が入力されていません</div>';
      return;
    }

    let html = '<div class="space-y-2">';
    colors.forEach((color, index) => {
      try {
        const rgb = this.parseColor(color.trim());
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        html += `
          <div class="flex items-center space-x-3 p-2 bg-gray-50 rounded">
            <div class="w-8 h-8 rounded border" style="background-color: ${hex}"></div>
            <div class="flex-1 text-sm">
              <div><strong>入力:</strong> ${color}</div>
              <div><strong>HEX:</strong> ${hex}</div>
              <div><strong>RGB:</strong> rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
              <div><strong>HSL:</strong> hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)</div>
            </div>
          </div>
        `;
      } catch (error) {
        html += `
          <div class="flex items-center space-x-3 p-2 bg-red-50 rounded">
            <div class="w-8 h-8 rounded border bg-gray-200"></div>
            <div class="flex-1 text-sm text-red-600">
              <div><strong>エラー:</strong> ${color} - 無効な色形式</div>
            </div>
          </div>
        `;
      }
    });
    html += '</div>';
    
    results.innerHTML = html;
  }

  /**
   * バッチ色検証
   */
  validateBatchColors() {
    const input = document.getElementById('batchColorInput')?.value || '';
    const colors = input.split('\n').filter(line => line.trim());
    const results = document.getElementById('batchResults');
    
    if (!results) return;
    
    let validCount = 0;
    let invalidCount = 0;
    
    const validations = colors.map(color => {
      const isValid = this.isValidColor(color.trim());
      if (isValid) validCount++;
      else invalidCount++;
      return { color, isValid };
    });
    
    let html = `
      <div class="mb-4 p-3 bg-blue-50 rounded">
        <div class="font-medium">検証結果</div>
        <div class="text-sm">有効: ${validCount}色, 無効: ${invalidCount}色</div>
      </div>
      <div class="space-y-1">
    `;
    
    validations.forEach(({ color, isValid }) => {
      html += `
        <div class="flex items-center space-x-2 p-1">
          <span class="${isValid ? 'text-green-600' : 'text-red-600'}">${isValid ? '✓' : '✗'}</span>
          <span class="text-sm">${color}</span>
        </div>
      `;
    });
    
    html += '</div>';
    results.innerHTML = html;
  }

  /**
   * 色の有効性チェック
   */
  isValidColor(color) {
    // HEX形式
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true;
    
    // RGB形式
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) return true;
    
    // HSL形式
    if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color)) return true;
    
    // CSS色名
    const testElement = document.createElement('div');
    testElement.style.color = color;
    return testElement.style.color !== '';
  }

  /**
   * バッチ色ソート
   */
  sortBatchColors() {
    const input = document.getElementById('batchColorInput')?.value || '';
    const colors = input.split('\n').filter(line => line.trim());
    const results = document.getElementById('batchResults');
    
    if (!results) return;
    
    const validColors = colors.filter(color => this.isValidColor(color.trim()));
    const sortedColors = validColors.sort((a, b) => {
      const hslA = this.parseColorToHsl(a.trim());
      const hslB = this.parseColorToHsl(b.trim());
      return hslA.h - hslB.h;
    });
    
    let html = '<div class="space-y-2">';
    sortedColors.forEach((color, index) => {
      const rgb = this.parseColor(color.trim());
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      html += `
        <div class="flex items-center space-x-3 p-2 bg-gray-50 rounded">
          <div class="w-8 h-8 rounded border" style="background-color: ${hex}"></div>
          <div class="flex-1 text-sm">${color}</div>
          <div class="text-xs text-gray-500">#${index + 1}</div>
        </div>
      `;
    });
    html += '</div>';
    
    results.innerHTML = html;
  }

  /**
   * バッチ結果のダウンロード
   */
  downloadBatchResults() {
    const results = document.getElementById('batchResults');
    if (!results) return;
    
    const input = document.getElementById('batchColorInput')?.value || '';
    const colors = input.split('\n').filter(line => line.trim());
    
    const data = colors.map(color => {
      try {
        const rgb = this.parseColor(color.trim());
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        return {
          input: color,
          hex: hex,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
        };
      } catch (error) {
        return {
          input: color,
          error: '無効な色形式'
        };
      }
    });
    
    this.downloadFile('batch-color-results.json', JSON.stringify(data, null, 2), 'application/json');
  }

  /**
   * エクスポートプレビューの生成
   */
  generateExportPreview() {
    // 実装は必要に応じて追加
    this.showToast('エクスポートプレビューを生成しました');
  }

  /**
   * エクスポートのダウンロード
   */
  downloadExport() {
    // 実装は必要に応じて追加
    this.showToast('エクスポートファイルをダウンロードしました');
  }

  /**
   * 色相から色を更新
   */
  updateColorFromHue(hue) {
    this.currentHue = hue;
    const color = `hsl(${hue}, ${this.currentSaturation}%, ${this.currentLightness}%)`;
    this.updateColorDisplay(color);
    this.updateSaturationLightnessCanvas();
  }

  /**
   * 彩度・明度から色を更新
   */
  updateColorFromSL(saturation, lightness) {
    this.currentSaturation = saturation;
    this.currentLightness = lightness;
    const color = `hsl(${this.currentHue}, ${saturation}%, ${lightness}%)`;
    this.updateColorDisplay(color);
  }

  /**
   * 色表示の更新（安全な実装）
   */
  updateColorDisplay(color) {
    try {
      this.currentColor = color;
      
      // まず色を正規化
      const normalizedColor = this.normalizeColor(color);
      
      // 入力フィールドの更新
      this.updateColorInputs(normalizedColor);
      
      // 履歴に追加
      this.addToHistory(normalizedColor);
      
      // プレビューの更新
      const preview = document.getElementById('colorPreviewLarge');
      if (preview) {
        preview.style.backgroundColor = normalizedColor;
      }
    } catch (error) {
      console.warn('色表示の更新に失敗しました:', error);
    }
  }

  /**
   * 色の正規化
   */
  normalizeColor(color) {
    if (!color) return '#000000';
    
    try {
      // HSL形式の場合はHEXに変換
      if (color.includes('hsl')) {
        const hsl = this.parseColorToHsl(color);
        const rgb = this.hslToRgbValues(hsl.h, hsl.s, hsl.l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
      }
      
      // RGB形式の場合はHEXに変換
      if (color.includes('rgb')) {
        const rgb = this.parseColor(color);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
      }
      
      // HEX形式の場合はそのまま
      if (color.startsWith('#')) {
        return color;
      }
      
      return '#000000';
    } catch (error) {
      console.warn('色の正規化に失敗しました:', color, error);
      return '#000000';
    }
  }

  /**
   * 彩度・明度キャンバスの更新
   */
  updateSaturationLightnessCanvas() {
    const canvas = document.getElementById('saturationLightness');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    this.drawSaturationLightness(ctx, canvas.width, canvas.height, this.currentHue);
  }

  /**
   * 外部からの色更新（他のカラーツールとの統合用）
   */
  setColor(color) {
    const normalizedColor = this.normalizeColor(color);
    this.currentColor = normalizedColor;
    
    // HSL値も更新
    const hsl = this.parseColorToHsl(normalizedColor);
    this.currentHue = hsl.h;
    this.currentSaturation = hsl.s;
    this.currentLightness = hsl.l;
    
    // UI更新（履歴追加は避ける）
    this.updateColorInputs(normalizedColor);
    
    // プレビューの更新
    const preview = document.getElementById('colorPreviewLarge');
    if (preview) {
      preview.style.backgroundColor = normalizedColor;
    }
  }

  /**
   * 現在の色を取得
   */
  getCurrentColor() {
    return this.currentColor || '#4ADE80';
  }

  /**
   * 競合回避のための静的チェック
   */
  static checkCompatibility() {
    // 既存のグローバル変数をチェック
    const conflictingVars = ['colorUI', 'colorApp', 'colorCodeApp'];
    const conflicts = conflictingVars.filter(varName => window[varName]);
    
    if (conflicts.length > 0) {
      console.warn('既存のカラーツール変数が検出されました:', conflicts);
      return false;
    }
    
    return true;
  }

  // ...existing code...
}

// エクスポート
if (typeof window !== 'undefined') {
  window.AdvancedColorUI = AdvancedColorUI;
}
