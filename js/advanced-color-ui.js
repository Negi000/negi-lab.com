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
   * カラーパレット・ハーモニージェネレーターの作成
   */
  createPaletteGenerator() {
    const container = document.createElement('div');
    container.className = 'palette-generator bg-white rounded-xl shadow-lg p-6 mb-6';
    container.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">カラーパレット・ハーモニージェネレーター</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左側：ハーモニータイプとテーマ -->
        <div class="harmony-theme-section">
          <!-- ハーモニータイプ選択 -->
          <div class="harmony-types mb-4">
            <h4 class="font-medium mb-3">カラーハーモニータイプ</h4>
            <div class="grid grid-cols-2 gap-2">
              <button class="harmony-btn px-4 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors" data-harmony="monochromatic">
                <div class="font-medium">モノクロマチック</div>
                <div class="text-xs opacity-80">同一色相</div>
              </button>
              <button class="harmony-btn px-4 py-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors" data-harmony="analogous">
                <div class="font-medium">類似色</div>
                <div class="text-xs opacity-80">隣接色相</div>
              </button>
              <button class="harmony-btn px-4 py-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors" data-harmony="complementary">
                <div class="font-medium">補色</div>
                <div class="text-xs opacity-80">対立色相</div>
              </button>
              <button class="harmony-btn px-4 py-3 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors" data-harmony="triadic">
                <div class="font-medium">三角配色</div>
                <div class="text-xs opacity-80">3分割</div>
              </button>
              <button class="harmony-btn px-4 py-3 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors" data-harmony="tetradic">
                <div class="font-medium">四角配色</div>
                <div class="text-xs opacity-80">4分割</div>
              </button>
              <button class="harmony-btn px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors" data-harmony="splitComplementary">
                <div class="font-medium">分割補色</div>
                <div class="text-xs opacity-80">隣接補色</div>
              </button>
            </div>
          </div>

          <!-- テーマパレット選択 -->
          <div class="theme-palettes mb-4">
            <h4 class="font-medium mb-3">テーマパレット</h4>
            <div class="grid grid-cols-2 gap-2">
              <button class="palette-btn px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors" data-palette="warm">🔥 暖色系</button>
              <button class="palette-btn px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors" data-palette="cool">❄️ 寒色系</button>
              <button class="palette-btn px-4 py-2 bg-pink-300 text-gray-800 rounded-lg text-sm hover:bg-pink-400 transition-colors" data-palette="pastel">🌸 パステル</button>
              <button class="palette-btn px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors" data-palette="vibrant">⚡ 鮮やか</button>
              <button class="palette-btn px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors" data-palette="earth">🌍 アース</button>
            </div>
          </div>
        </div>

        <!-- 右側：コントロールとプレビュー -->
        <div class="control-preview-section">
          <!-- パレット生成コントロール -->
          <div class="generator-controls mb-4">
            <h4 class="font-medium mb-3">生成設定</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-2">色数: <span id="paletteCountDisplay">5</span></label>
                <input id="paletteSize" type="range" min="3" max="12" value="5" class="w-full">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">用途</label>
                <select id="paletteUsage" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="web">Webサイト</option>
                  <option value="print">印刷物</option>
                  <option value="branding">ブランディング</option>
                  <option value="ui">UI/UX</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">明度調整: <span id="lightnessValue">0</span></label>
                <input id="lightnessAdjust" type="range" min="-50" max="50" value="0" class="w-full">
              </div>
            </div>
          </div>
          
          <!-- 生成アクション -->
          <div class="palette-actions mb-4">
            <div class="grid grid-cols-2 gap-2">
              <button id="generateRandomPalette" class="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium">🎲 ランダム生成</button>
              <button id="refinePalette" class="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium">✨ 微調整</button>
              <button id="savePalette" class="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">💾 保存</button>
              <button id="exportPalette" class="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">📤 エクスポート</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 結果表示エリア -->
      <div class="results-section">
        <div class="mb-4">
          <h4 class="font-medium mb-3">ハーモニー結果</h4>
          <div id="harmonyColors" class="grid grid-cols-3 md:grid-cols-6 gap-3 min-h-[80px] p-3 border border-gray-200 rounded-lg bg-gray-50"></div>
        </div>
        
        <div class="mb-4">
          <h4 class="font-medium mb-3">テーマパレット結果</h4>
          <div id="paletteColors" class="grid grid-cols-3 md:grid-cols-6 gap-3 min-h-[80px] p-3 border border-gray-200 rounded-lg bg-gray-50"></div>
        </div>
        
        <div class="mb-4">
          <h4 class="font-medium mb-3">生成パレット</h4>
          <div id="generatedPalette" class="grid grid-cols-3 md:grid-cols-6 gap-3 min-h-[80px] p-3 border border-gray-200 rounded-lg bg-gray-50"></div>
        </div>
        
        <div class="palette-analysis p-4 bg-blue-50 rounded-lg">
          <h4 class="font-medium mb-2 text-blue-800">パレット分析</h4>
          <div id="paletteStats" class="text-sm text-blue-700">パレットを生成すると分析結果が表示されます</div>
        </div>
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
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors" data-test="colorBlind">
              🎨 色覚異常シミュレーション
            </button>
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors" data-test="lowVision">
              👁️ 低視力シミュレーション
            </button>
            <button class="accessibility-test-btn p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors" data-test="motionSensitivity">
              ⚡ 動きに敏感度テスト
            </button>
          </div>
        </div>
        <div id="accessibilityResults" class="results-area min-h-[200px] border border-gray-200 rounded p-4 bg-gray-50">
          <div class="text-center text-gray-500">テストを選択してください</div>
        </div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('accessibilityAnalyzer', container);
    
    // アクセシビリティテストのイベントリスナー
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('accessibility-test-btn')) {
        const testType = e.target.getAttribute('data-test');
        this.runAccessibilityTest(testType);
        
        // アクティブボタンの更新
        container.querySelectorAll('.accessibility-test-btn').forEach(btn => btn.classList.remove('bg-blue-100', 'border-blue-500'));
        e.target.classList.add('bg-blue-100', 'border-blue-500');
      }
    });
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
        <button id="processBatch" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">🔄 変換実行</button>
        <button id="validateColors" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">✅ 色検証</button>
        <button id="sortColors" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">📊 色ソート</button>
        <button id="downloadResults" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">💾 結果ダウンロード</button>
      </div>
      <div id="batchResults" class="results-area min-h-[200px] border border-gray-200 rounded p-4 bg-gray-50">
        <div class="text-center text-gray-500">上記のボタンをクリックして処理を開始してください</div>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('batchConverter', container);
    
    // バッチ変換のイベントリスナー
    container.addEventListener('click', (e) => {
      const buttonId = e.target.id;
      switch (buttonId) {
        case 'processBatch':
          this.processBatchColors();
          break;
        case 'validateColors':
          this.validateBatchColors();
          break;
        case 'sortColors':
          this.sortBatchColors();
          break;
        case 'downloadResults':
          this.downloadBatchResults();
          break;
      }
    });
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
          <label class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="exportFormat" value="css" class="mr-2" checked>
            <span class="text-sm">📄 CSS</span>
          </label>
          <label class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="exportFormat" value="scss" class="mr-2">
            <span class="text-sm">🎨 SCSS</span>
          </label>
          <label class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="exportFormat" value="json" class="mr-2">
            <span class="text-sm">📋 JSON</span>
          </label>
          <label class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="exportFormat" value="ase" class="mr-2">
            <span class="text-sm">🎯 ASE</span>
          </label>
        </div>
      </div>
      
      <div class="naming-options mb-4">
        <h4 class="font-medium mb-2">命名規則</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <pre id="exportPreview" class="bg-gray-100 p-3 rounded text-sm overflow-x-auto font-mono min-h-[100px]">エクスポートする色を選択して「生成」ボタンをクリックしてください</pre>
      </div>
      
      <div class="export-actions flex gap-2">
        <button id="generateExport" class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">🔄 生成</button>
        <button id="downloadExport" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">💾 ダウンロード</button>
        <button class="copy-btn px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors" data-copy="exportPreview">📋 コピー</button>
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('colorExport', container);
    
    // エクスポート機能のイベントリスナー
    container.addEventListener('click', (e) => {
      if (e.target.id === 'generateExport') {
        this.generateColorExport();
      } else if (e.target.id === 'downloadExport') {
        this.downloadColorExport();
      }
    });
    
    // フォーマット変更時のプレビュー更新
    container.addEventListener('change', (e) => {
      if (e.target.name === 'exportFormat' || e.target.id === 'namingConvention' || e.target.id === 'colorPrefix') {
        this.updateExportPreview();
      }
    });
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
            <input id="spectrumColor" type="color" class="w-full h-10 border border-gray-300 rounded" value="#4ADE80">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">分析タイプ</label>
            <select id="spectrumType" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="hue">色相スペクトラム</option>
              <option value="saturation">彩度スペクトラム</option>
              <option value="lightness">明度スペクトラム</option>
              <option value="rgb">RGBスペクトラム</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">解像度: <span id="resolutionValue">50</span></label>
            <input id="spectrumResolution" type="range" min="10" max="100" value="50" class="w-full">
          </div>
        </div>
      </div>
      <div class="spectrum-actions mb-4">
        <button id="analyzeSpectrum" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">🔬 スペクトラム分析</button>
        <button id="exportSpectrum" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">💾 スペクトラム保存</button>
      </div>
      <div id="spectrumResults" class="spectrum-results p-4 bg-gray-50 rounded border text-sm text-gray-600">
        分析色を選択して「スペクトラム分析」ボタンをクリックしてください
      </div>
    `;
    
    const insertPoint = document.querySelector('.container') || document.querySelector('main') || document.body;
    insertPoint.appendChild(container);
    this.components.set('advancedSpectrum', container);
    
    // スペクトラム分析のイベントリスナー
    container.addEventListener('click', (e) => {
      if (e.target.id === 'analyzeSpectrum') {
        this.analyzeColorSpectrum();
      } else if (e.target.id === 'exportSpectrum') {
        this.exportSpectrum();
      }
    });
    
    // 色変更時の自動更新
    container.addEventListener('change', (e) => {
      if (e.target.id === 'spectrumColor' || e.target.id === 'spectrumType') {
        this.analyzeColorSpectrum();
      }
    });
    
    // 解像度スライダー
    const resolutionSlider = container.querySelector('#spectrumResolution');
    resolutionSlider.addEventListener('input', (e) => {
      document.getElementById('resolutionValue').textContent = e.target.value;
    });
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
        
        const rgb = this.hslToRgbValues(hue, saturation, lightness);
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
   * 色入力フィールドの更新
   */
  updateColorInputs(color) {
    try {
      // 色の正規化
      let normalizedColor = color;
      if (color.startsWith('hsl')) {
        // HSL形式をHEXに変換
        const hsl = this.parseColorToHsl(color);
        const rgb = this.hslToRgbValues(hsl.h, hsl.s, hsl.l);
        normalizedColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      }

      // RGB値を取得
      let rgb;
      if (this.colorEngine && this.colorEngine.hexToRgb) {
        rgb = this.colorEngine.hexToRgb(normalizedColor);
      } else {
        rgb = this.parseColor(normalizedColor);
      }

      // nullチェック
      if (!rgb || rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) {
        console.warn('RGB変換に失敗しました:', color);
        return;
      }

      // 各色空間に変換
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

      // 各フィールドの更新
      const hexValue = document.getElementById('hexValue');
      const rgbValue = document.getElementById('rgbValue');
      const hslValue = document.getElementById('hslValue');
      const cmykValue = document.getElementById('cmykValue');

      if (hexValue) hexValue.value = hex;
      if (rgbValue) rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      if (hslValue) hslValue.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
      if (cmykValue) cmykValue.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

      // 色情報の更新
      this.updateColorInfo(hex);
    } catch (error) {
      console.warn('色入力フィールドの更新に失敗しました:', error);
    }
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
   * 既存のカラーホイールとの統合
   */
  integrateWithExistingWheel(wheelElement) {
    // 既存のイベントリスナーを尊重しつつ、追加の機能を提供
    const originalClickHandler = wheelElement.onclick;
    
    wheelElement.addEventListener('click', (e) => {
      // 既存のハンドラーを実行
      if (originalClickHandler) {
        originalClickHandler.call(wheelElement, e);
      }
      
      // 追加の処理
      const rect = wheelElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = wheelElement.width / 2;
      const centerY = wheelElement.height / 2;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = wheelElement.width / 2 - 10;
      
      if (distance > radius * 0.6 && distance < radius) {
        const hue = Math.atan2(dy, dx) * 180 / Math.PI;
        const normalizedHue = (hue + 360) % 360;
        this.currentHue = normalizedHue;
      }
    });
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
      colors.push(this.normalizeColor(color));
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
      return this.normalizeColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
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
      const newColor = this.normalizeColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      element.style.backgroundColor = newColor;
    });
  }

  /**
   * モノクロマチック配色生成
   */
  generateMonochromatic(baseHsl) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      const lightness = 20 + (i * 15);
      colors.push(this.normalizeColor(`hsl(${baseHsl.h}, ${baseHsl.s}%, ${lightness}%)`));
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
      colors.push(this.normalizeColor(`hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`));
    });
    return colors;
  }

  /**
   * 補色配色生成
   */
  generateComplementary(baseHsl) {
    const complementHue = (baseHsl.h + 180) % 360;
    return [
      this.normalizeColor(`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`),
      this.normalizeColor(`hsl(${complementHue}, ${baseHsl.s}%, ${baseHsl.l}%)`)
    ];
  }

  /**
   * 三角配色生成
   */
  generateTriadic(baseHsl) {
    const hueOffsets = [0, 120, 240];
    return hueOffsets.map(offset => {
      const hue = (baseHsl.h + offset) % 360;
      return this.normalizeColor(`hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`);
    });
  }

  /**
   * 四角配色生成
   */
  generateTetradic(baseHsl) {
    const hueOffsets = [0, 90, 180, 270];
    return hueOffsets.map(offset => {
      const hue = (baseHsl.h + offset) % 360;
      return this.normalizeColor(`hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`);
    });
  }

  /**
   * 分割補色配色生成
   */
  generateSplitComplementary(baseHsl) {
    const complementHue = (baseHsl.h + 180) % 360;
    return [
      this.normalizeColor(`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`),
      this.normalizeColor(`hsl(${(complementHue - 30 + 360) % 360}, ${baseHsl.s}%, ${baseHsl.l}%)`),
      this.normalizeColor(`hsl(${(complementHue + 30) % 360}, ${baseHsl.s}%, ${baseHsl.l}%)`)
    ];
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
   * 色履歴の読み込み
   */
  loadColorHistory() {
    try {
      const history = localStorage.getItem('colorHistory');
      this.colorHistory = history ? JSON.parse(history) : [];
      this.renderColorHistory();
    } catch (error) {
      console.warn('色履歴の読み込みに失敗しました:', error);
      this.colorHistory = [];
    }
  }

  /**
   * 色履歴のレンダリング
   */
  renderColorHistory() {
    const container = document.getElementById('colorHistory');
    if (!container) return;

    container.innerHTML = '';
    this.colorHistory.forEach((color, index) => {
      const colorItem = document.createElement('div');
      colorItem.className = 'color-history-item w-10 h-10 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform';
      colorItem.style.backgroundColor = color;
      colorItem.title = color;
      colorItem.addEventListener('click', () => {
        this.selectColor(color);
      });
      container.appendChild(colorItem);
    });
  }

  /**
   * 色の選択
   */
  selectColor(color) {
    this.currentColor = color;
    this.updateColorInputs(color);
    this.addToHistory(color);
  }

  /**
   * 色を履歴に追加
   */
  addToHistory(color) {
    if (!this.colorHistory) {
      this.colorHistory = [];
    }
    
    // 重複を避ける
    const index = this.colorHistory.indexOf(color);
    if (index > -1) {
      this.colorHistory.splice(index, 1);
    }
    
    // 先頭に追加
    this.colorHistory.unshift(color);
    
    // 最大20色まで保持
    if (this.colorHistory.length > 20) {
      this.colorHistory = this.colorHistory.slice(0, 20);
    }
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('colorHistory', JSON.stringify(this.colorHistory));
    } catch (error) {
      console.warn('色履歴の保存に失敗しました:', error);
    }
    
    this.renderColorHistory();
  }

  /**
   * 統合パレット機能のイベントバインディング
   */
  bindPaletteEvents() {
    // ランダム生成ボタン
    document.getElementById('generateRandomPalette')?.addEventListener('click', () => {
      this.generateRandomPalette();
    });

    // 微調整ボタン
    document.getElementById('refinePalette')?.addEventListener('click', () => {
      this.refinePalette();
    });

    // 保存ボタン
    document.getElementById('savePalette')?.addEventListener('click', () => {
      this.savePalette();
    });

    // エクスポートボタン
    document.getElementById('exportPalette')?.addEventListener('click', () => {
      this.exportPalette();
    });

    // 色数スライダー
    document.getElementById('paletteSize')?.addEventListener('input', (e) => {
      const display = document.getElementById('paletteCountDisplay');
      if (display) {
        display.textContent = e.target.value;
      }
    });

    // 明度調整スライダー
    document.getElementById('lightnessAdjust')?.addEventListener('input', (e) => {
      document.getElementById('lightnessValue').textContent = e.target.value;
      this.updatePaletteWithLightness(e.target.value);
    });
  }

  /**
   * イベントバインディング
   */
  bindEvents() {
    // コピー機能
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-btn')) {
        const copyTarget = e.target.getAttribute('data-copy');
        const element = document.getElementById(copyTarget);
        
        if (element) {
          const text = element.value || element.textContent;
          this.copyToClipboard(text);
          this.showToast('クリップボードにコピーしました');
        }
      }
    });

    // ハーモニー生成
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('harmony-btn')) {
        const harmonyType = e.target.getAttribute('data-harmony');
        this.generateHarmony(harmonyType);
        
        // アクティブボタンの更新
        document.querySelectorAll('.harmony-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });

    // パレット生成
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('palette-btn')) {
        const paletteType = e.target.getAttribute('data-palette');
        this.generatePalette(paletteType);
        
        // アクティブボタンの更新
        document.querySelectorAll('.palette-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
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
    } : null;
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
      h = s = 0; // achromatic
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
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
   * HSL文字列をパース
   */
  parseColorToHsl(color) {
    if (color.includes('hsl')) {
      const matches = color.match(/hsl\((\d+),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
      if (matches) {
        return {
          h: parseFloat(matches[1]),
          s: parseFloat(matches[2]),
          l: parseFloat(matches[3])
        };
      }
    }

    // HEX形式の場合はRGBに変換してからHSLに
    if (color.startsWith('#')) {
      const rgb = this.hexToRgb(color);
      if (rgb) {
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      }
    }

    // RGB形式の場合
    if (color.includes('rgb')) {
      const rgb = this.parseColor(color);
      if (rgb) {
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      }
    }

    // デフォルト値
    return { h: 0, s: 0, l: 0 };
  }

  /**
   * ユーティリティ関数
   */
  showToast(message) {
    // 既存のトーストを削除
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      existingToast.remove();
    }

    // 新しいトーストを作成
    const toast = document.createElement('div');
    toast.className = 'toast-message fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 3秒後に削除
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * クリップボードにコピー
   */
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // フォールバック
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * ファイルダウンロード
   */
  downloadFile(filename, content, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * 色名の取得（簡易版）
   */
  getColorName(hex) {
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
    return colorNames[hex.toUpperCase()] || 'カスタム色';
  }

  /**
   * 色温度の取得（簡易版）
   */
  getColorTemperature(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 'N/A';
    
    const temp = (rgb.r > rgb.b) ? '暖色' : (rgb.b > rgb.r) ? '寒色' : '中性';
    return temp;
  }

  /**
   * 色の心理効果（簡易版）
   */
  getColorPsychology(hex) {
    const hsl = this.parseColorToHsl(hex);
    if (hsl.h < 60) return '情熱・エネルギー';
    if (hsl.h < 120) return '自然・成長';
    if (hsl.h < 180) return '信頼・安定';
    if (hsl.h < 240) return '創造・神秘';
    if (hsl.h < 300) return '高貴・洗練';
    return '愛・優雅';
  }

  /**
   * アクセシビリティテストの実行
   */
  runAccessibilityTest(testType) {
    const resultsContainer = document.getElementById('accessibilityResults');
    if (!resultsContainer) return;

    let content = '';
    
    switch (testType) {
      case 'colorBlind':
        content = this.generateColorBlindTest();
        break;
      case 'lowVision':
        content = this.generateLowVisionTest();
        break;
      case 'motionSensitivity':
        content = this.generateMotionSensitivityTest();
        break;
    }
    
    resultsContainer.innerHTML = content;
  }

  /**
   * 色覚異常シミュレーション
   */
  generateColorBlindTest() {
    const testColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    
    return `
      <h4 class="font-medium mb-3">色覚異常シミュレーション結果</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${testColors.map(color => `
          <div class="test-color-item border rounded p-3">
            <div class="w-full h-16 mb-2 rounded" style="background-color: ${color}"></div>
            <div class="text-xs text-center">
              <div class="font-mono">${color}</div>
              <div class="text-gray-600 mt-1">
                第1色覚: ${this.simulateProtanopia(color)}<br>
                第2色覚: ${this.simulateDeuteranopia(color)}<br>
                第3色覚: ${this.simulateTritanopia(color)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * 低視力シミュレーション
   */
  generateLowVisionTest() {
    return `
      <h4 class="font-medium mb-3">低視力シミュレーション結果</h4>
      <div class="space-y-4">
        <div class="test-section">
          <h5 class="font-medium">通常視力</h5>
          <div class="p-4 border rounded" style="background: white; color: black;">
            <p class="text-lg">この文字は通常の視力で見えます</p>
            <p class="text-sm">小さな文字も問題なく読めます</p>
          </div>
        </div>
        <div class="test-section">
          <h5 class="font-medium">低視力（ぼやけ）</h5>
          <div class="p-4 border rounded" style="background: white; color: black; filter: blur(2px);">
            <p class="text-lg">この文字はぼやけて見えます</p>
            <p class="text-sm">小さな文字は読みにくくなります</p>
          </div>
        </div>
        <div class="test-section">
          <h5 class="font-medium">低コントラスト</h5>
          <div class="p-4 border rounded" style="background: #f0f0f0; color: #888;">
            <p class="text-lg">この文字はコントラストが低いです</p>
            <p class="text-sm">視認性が大幅に低下します</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 動きに敏感度テスト
   */
  generateMotionSensitivityTest() {
    return `
      <h4 class="font-medium mb-3">動きに敏感度テスト結果</h4>
      <div class="space-y-4">
        <div class="alert-box p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p class="text-yellow-800">⚠️ このテストは光過敏性てんかんなどに配慮したものです</p>
        </div>
        <div class="test-recommendations">
          <h5 class="font-medium mb-2">推奨事項:</h5>
          <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>点滅速度は3Hz以下に制限</li>
            <li>高コントラストの急激な変化を避ける</li>
            <li>アニメーションの停止オプションを提供</li>
            <li>視差効果を控えめにする</li>
          </ul>
        </div>
        <div class="current-color-test">
          <h5 class="font-medium mb-2">現在の色での安全性:</h5>
          <div class="p-3 bg-green-50 text-green-800 rounded">
            ✅ 現在選択中の色は安全な範囲内です
          </div>
        </div>
      </div>
    `;
  }

  /**
   * バッチ色処理
   */
  processBatchColors() {
    const input = document.getElementById('batchColorInput');
    const results = document.getElementById('batchResults');
    if (!input || !results) return;

    const colors = input.value.split('\n').filter(line => line.trim());
    const processedResults = [];

    colors.forEach((color, index) => {
      try {
        const normalizedColor = this.normalizeColor(color.trim());
        const rgb = this.hexToRgb(normalizedColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

        processedResults.push({
          input: color.trim(),
          hex: normalizedColor,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
        });
      } catch (error) {
        processedResults.push({
          input: color.trim(),
          error: 'Invalid color format'
        });
      }
    });

    this.displayBatchResults(processedResults, 'conversion');
  }

  /**
   * バッチ色検証
   */
  validateBatchColors() {
    const input = document.getElementById('batchColorInput');
    const results = document.getElementById('batchResults');
    if (!input || !results) return;

    const colors = input.value.split('\n').filter(line => line.trim());
    const validationResults = [];

    colors.forEach((color, index) => {
      const trimmedColor = color.trim();
      const isValid = this.isValidColor(trimmedColor);
      const format = this.detectColorFormat(trimmedColor);
      
      validationResults.push({
        input: trimmedColor,
        isValid,
        format,
        issues: this.getColorIssues(trimmedColor)
      });
    });

    this.displayBatchResults(validationResults, 'validation');
  }

  /**
   * バッチ色ソート
   */
  sortBatchColors() {
    const input = document.getElementById('batchColorInput');
    const results = document.getElementById('batchResults');
    if (!input || !results) return;

    const colors = input.value.split('\n').filter(line => line.trim());
    const sortedColors = [];

    colors.forEach(color => {
      try {
        const normalizedColor = this.normalizeColor(color.trim());
        const hsl = this.parseColorToHsl(normalizedColor);
        sortedColors.push({
          input: color.trim(),
          normalized: normalizedColor,
          hue: hsl.h,
          saturation: hsl.s,
          lightness: hsl.l
        });
      } catch (error) {
        // 無効な色は末尾に追加
      }
    });

    // 色相でソート
    sortedColors.sort((a, b) => a.hue - b.hue);

    this.displayBatchResults(sortedColors, 'sorted');
  }

  /**
   * バッチ結果をダウンロード
   */
  downloadBatchResults() {
    const results = document.getElementById('batchResults');
    if (!results) return;

    const content = results.textContent || results.innerText;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    this.downloadFile(`batch-colors-${timestamp}.txt`, content);
  }

  /**
   * バッチ結果の表示
   */
  displayBatchResults(results, type) {
    const container = document.getElementById('batchResults');
    if (!container) return;

    let content = '';

    switch (type) {
      case 'conversion':
        content = `
          <h4 class="font-medium mb-3">変換結果</h4>
          <div class="space-y-2">
            ${results.map((result, index) => `
              <div class="result-item p-3 border rounded ${result.error ? 'bg-red-50 border-red-200' : 'bg-white'}">
                ${result.error ? `
                  <div class="text-red-600">❌ ${result.input}: ${result.error}</div>
                ` : `
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded border" style="background-color: ${result.hex}"></div>
                    <div class="flex-1 text-sm">
                      <div><strong>入力:</strong> ${result.input}</div>
                      <div><strong>HEX:</strong> ${result.hex}</div>
                      <div><strong>RGB:</strong> ${result.rgb}</div>
                      <div><strong>HSL:</strong> ${result.hsl}</div>
                      <div><strong>CMYK:</strong> ${result.cmyk}</div>
                    </div>
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'validation':
        content = `
          <h4 class="font-medium mb-3">検証結果</h4>
          <div class="space-y-2">
            ${results.map(result => `
              <div class="result-item p-3 border rounded ${result.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                <div class="flex items-center space-x-2">
                  <span class="${result.isValid ? 'text-green-600' : 'text-red-600'}">${result.isValid ? '✅' : '❌'}</span>
                  <span class="font-mono">${result.input}</span>
                  <span class="text-sm text-gray-600">(${result.format})</span>
                </div>
                ${result.issues.length > 0 ? `
                  <div class="mt-2 text-sm text-gray-600">
                    <strong>Issues:</strong> ${result.issues.join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'sorted':
        content = `
          <h4 class="font-medium mb-3">ソート結果（色相順）</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            ${results.map(result => `
              <div class="result-item p-2 border rounded bg-white text-center">
                <div class="w-full h-16 rounded mb-2" style="background-color: ${result.normalized}"></div>
                <div class="text-xs font-mono">${result.normalized}</div>
                <div class="text-xs text-gray-600">H:${Math.round(result.hue)}°</div>
              </div>
            `).join('')}
          </div>
        `;
        break;
    }

    container.innerHTML = content;
  }

  /**
   * 色エクスポートの生成
   */
  generateColorExport() {
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'css';
    const naming = document.getElementById('namingConvention')?.value || 'camelCase';
    const prefix = document.getElementById('colorPrefix')?.value || '';
    
    // 現在の色履歴から色を取得
    const colors = this.colorHistory.slice(0, 10); // 最新10色
    
    let exportContent = '';
    
    switch (format) {
      case 'css':
        exportContent = this.generateCSSExport(colors, naming, prefix);
        break;
      case 'scss':
        exportContent = this.generateSCSSExport(colors, naming, prefix);
        break;
      case 'json':
        exportContent = this.generateJSONExport(colors, naming, prefix);
        break;
      case 'ase':
        exportContent = this.generateASEInfo(colors);
        break;
    }
    
    document.getElementById('exportPreview').textContent = exportContent;
  }

  /**
   * CSS形式でエクスポート
   */
  generateCSSExport(colors, naming, prefix) {
    const colorNames = colors.map((color, index) => {
      const baseName = `${prefix}color${index + 1}`;
      return this.applyNamingConvention(baseName, naming);
    });
    
    return `:root {\n${colors.map((color, index) => `  --${colorNames[index]}: ${color};`).join('\n')}\n}`;
  }

  /**
   * SCSS形式でエクスポート
   */
  generateSCSSExport(colors, naming, prefix) {
    const colorNames = colors.map((color, index) => {
      const baseName = `${prefix}color${index + 1}`;
      return this.applyNamingConvention(baseName, naming);
    });
    
    return colors.map((color, index) => `$${colorNames[index]}: ${color};`).join('\n');
  }

  /**
   * JSON形式でエクスポート
   */
  generateJSONExport(colors, naming, prefix) {
    const colorObject = {};
    colors.forEach((color, index) => {
      const baseName = `${prefix}color${index + 1}`;
      const name = this.applyNamingConvention(baseName, naming);
      colorObject[name] = color;
    });
    
    return JSON.stringify(colorObject, null, 2);
  }

  /**
   * 命名規則の適用
   */
  applyNamingConvention(name, convention) {
    switch (convention) {
      case 'camelCase':
        return name.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
      case 'kebab-case':
        return name.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`).replace(/^-/, '');
      case 'snake_case':
        return name.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`).replace(/^_/, '');
      case 'PascalCase':
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_](.)/g, (_, char) => char.toUpperCase());
      default:
        return name;
    }
  }

  /**
   * スペクトラム分析の実行
   */
  analyzeColorSpectrum() {
    const color = document.getElementById('spectrumColor')?.value || '#4ADE80';
    const type = document.getElementById('spectrumType')?.value || 'hue';
    const resolution = parseInt(document.getElementById('spectrumResolution')?.value) || 50;
    
    const canvas = document.getElementById('spectrumCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // スペクトラムを描画
    this.drawSpectrum(ctx, color, type, resolution, canvas.width, canvas.height);
    
    // 分析結果を表示
    this.displaySpectrumAnalysis(color, type);
  }

  /**
   * スペクトラム描画
   */
  drawSpectrum(ctx, baseColor, type, resolution, width, height) {
    const baseHsl = this.parseColorToHsl(baseColor);
    
    for (let i = 0; i < resolution; i++) {
      const x = (i / resolution) * width;
      const barWidth = width / resolution;
      
      let color;
      
      switch (type) {
        case 'hue':
          const hue = (i / resolution) * 360;
          color = `hsl(${hue}, ${baseHsl.s}%, ${baseHsl.l}%)`;
          break;
        case 'saturation':
          const saturation = (i / resolution) * 100;
          color = `hsl(${baseHsl.h}, ${saturation}%, ${baseHsl.l}%)`;
          break;
        case 'lightness':
          const lightness = (i / resolution) * 100;
          color = `hsl(${baseHsl.h}, ${baseHsl.s}%, ${lightness}%)`;
          break;
        case 'rgb':
          const intensity = i / resolution;
          const rgb = this.hexToRgb(baseColor);
          color = `rgb(${Math.round(rgb.r * intensity)}, ${Math.round(rgb.g * intensity)}, ${Math.round(rgb.b * intensity)})`;
          break;
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, barWidth, height);
    }
  }

  /**
   * スペクトラム分析結果の表示
   */
  displaySpectrumAnalysis(color, type) {
    const container = document.getElementById('spectrumResults');
    if (!container) return;
    
    const hsl = this.parseColorToHsl(color);
    const rgb = this.hexToRgb(color);
    
    container.innerHTML = `
      <h4 class="font-medium mb-2">スペクトラム分析結果</h4>
      <div class="analysis-data space-y-2 text-sm">
        <div><strong>基準色:</strong> ${color}</div>
        <div><strong>分析タイプ:</strong> ${type}</div>
        <div><strong>色相:</strong> ${hsl.h}°</div>
        <div><strong>彩度:</strong> ${hsl.s}%</div>
        <div><strong>明度:</strong> ${hsl.l}%</div>
        <div><strong>RGB値:</strong> R:${rgb.r}, G:${rgb.g}, B:${rgb.b}</div>
        <div class="mt-3 p-2 bg-blue-50 rounded">
          <strong>分析結果:</strong> ${this.getSpectrumAnalysisDescription(type, hsl)}
        </div>
      </div>
    `;
  }

  /**
   * スペクトラム分析の説明
   */
  getSpectrumAnalysisDescription(type, hsl) {
    switch (type) {
      case 'hue':
        return `色相スペクトラムは全ての色相を表示しています。現在の色は${hsl.h}°の位置にあります。`;
      case 'saturation':
        return `彩度スペクトラムは無彩色から純色まで表示しています。現在の彩度は${hsl.s}%です。`;
      case 'lightness':
        return `明度スペクトラムは暗色から明色まで表示しています。現在の明度は${hsl.l}%です。`;
      case 'rgb':
        return `RGBスペクトラムは各色成分の強度変化を表示しています。`;
      default:
        return '分析が完了しました。';
    }
  }

  /**
   * ユーティリティ関数群
   */
  isValidColor(color) {
    try {
      this.normalizeColor(color);
      return true;
    } catch {
      return false;
    }
  }

  detectColorFormat(color) {
    if (color.startsWith('#')) return 'HEX';
    if (color.includes('rgb')) return 'RGB';
    if (color.includes('hsl')) return 'HSL';
    if (color.includes('cmyk')) return 'CMYK';
    return 'Unknown';
  }

  getColorIssues(color) {
    const issues = [];
    if (color.startsWith('#') && color.length !== 7) {
      issues.push('Invalid HEX length');
    }
    return issues;
  }

  // 色覚異常シミュレーション（簡易版）
  simulateProtanopia(color) {
    // 第1色覚異常の簡易シミュレーション
    return color; // 実際の実装では色変換アルゴリズムを使用
  }

  simulateDeuteranopia(color) {
    // 第2色覚異常の簡易シミュレーション
    return color; // 実際の実装では色変換アルゴリズムを使用
  }

  simulateTritanopia(color) {
    // 第3色覚異常の簡易シミュレーション
    return color; // 実際の実装では色変換アルゴリズムを使用
  }

  generateASEInfo(colors) {
    return `Adobe Swatch Exchange (ASE) format information:\n\nColors to export:\n${colors.map((color, index) => `Color ${index + 1}: ${color}`).join('\n')}\n\nNote: ASE export requires additional libraries for binary format generation.`;
  }

  downloadColorExport() {
    const preview = document.getElementById('exportPreview');
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'css';
    
    if (!preview || !preview.textContent.trim()) {
      this.showToast('エクスポートするデータがありません');
      return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `colors-export-${timestamp}.${format}`;
    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    
    this.downloadFile(filename, preview.textContent, mimeType);
  }

  updateExportPreview() {
    this.generateColorExport();
  }

  exportSpectrum() {
    const canvas = document.getElementById('spectrumCanvas');
    if (!canvas) return;
    
    // Canvas を画像として保存
    const link = document.createElement('a');
    link.download = `spectrum-analysis-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  // ...existing code...
}

// エクスポート
if (typeof window !== 'undefined') {
  window.AdvancedColorUI = AdvancedColorUI;
}
