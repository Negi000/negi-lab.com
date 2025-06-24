// 簡易版QRGeneratorクラス - 修正版
console.log('🔧 簡易版QRGenerator読み込み開始');

class QRGenerator {
  constructor() {
    console.log('🏗️ QRGeneratorコンストラクター実行');
    this.currentTemplate = 'text';
    this.currentMode = 'single';
    this.batchData = [];
    this.designMode = 'standard';
    this.currentShape = 'square';
    this.currentColorMode = 'solid';
    this.qrData = null;
    this.currentCreativeCanvas = null;
    this.elements = {};
    
    // DOM要素が準備できてから初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.safeInitialize();
      });
    } else {
      this.safeInitialize();
    }
  }

  safeInitialize() {
    console.log('🔧 QRGenerator.safeInitialize() 開始');
    try {
      this.initializeElements();
      this.bindBasicEvents();
      this.initializeDetectionColorDefault();
      this.updateBorderColorSettings();
      console.log('✅ QRGenerator基本初期化完了');
    } catch (error) {
      console.error('❌ QRGenerator初期化エラー:', error);
    }
  }

  // 検出パターン色設定UIを更新
  updateDetectionColorSettings() {
    if (!this.elements.detectionColorMode || !this.elements.customDetectionColor) return;
    
    const mode = this.elements.detectionColorMode.value;
    if (mode === 'custom') {
      this.elements.customDetectionColor.classList.remove('hidden');
      
      // 独自の色のデフォルト値を現在のデータ部の色に設定
      if (this.elements.detectionColor) {
        let defaultColor = '#000000';
        
        // 現在のカラーモードに応じてデフォルト色を決定
        if (this.currentColorMode === 'gradient') {
          // グラデーションの場合は開始色を使用
          defaultColor = this.elements.gradientStart?.value || '#000000';
        } else {
          // 単色の場合はフォアグラウンド色を使用
          defaultColor = this.elements.foregroundColor?.value || '#000000';
        }
        
        this.elements.detectionColor.value = defaultColor;
        console.log('検出パターン独自色デフォルト設定:', defaultColor);
      }
    } else {
      this.elements.customDetectionColor.classList.add('hidden');
    }
  }

  // 検出パターンのデフォルト色を初期化
  initializeDetectionColorDefault() {
    if (this.elements.detectionColor && this.elements.foregroundColor) {
      const defaultColor = this.elements.foregroundColor.value || '#000000';
      this.elements.detectionColor.value = defaultColor;
      console.log('検出パターン初期デフォルト色設定:', defaultColor);
    }
  }

  // 外枠設定UIを更新
  updateBorderSettings() {
    if (!this.elements.borderEnabled || !this.elements.borderSettings) return;
    
    if (this.elements.borderEnabled.checked) {
      this.elements.borderSettings.classList.remove('hidden');
    } else {
      this.elements.borderSettings.classList.add('hidden');
    }
    console.log('外枠設定更新:', this.elements.borderEnabled.checked);
  }
  // 外枠色設定UI更新
  updateBorderColorSettings() {
    if (!this.elements.borderColorMode || !this.elements.customBorderColor) {
      console.log('⚠️ 外枠色設定要素が見つかりません');
      return;
    }
    
    const mode = this.elements.borderColorMode.value;
    console.log('🎨 外枠色設定更新:', mode);
    
    if (mode === 'custom') {
      this.elements.customBorderColor.classList.remove('hidden');
      
      // 独自色のデフォルト値を現在のデータ部の色に設定
      if (this.elements.borderColor) {
        let defaultColor = '#000000';
        
        // 現在のカラーモードに応じてデフォルト色を決定
        if (this.currentColorMode === 'gradient') {
          // グラデーションの場合は開始色を使用
          defaultColor = this.elements.gradientStart?.value || '#000000';
        } else {
          // 単色の場合はフォアグラウンド色を使用
          defaultColor = this.elements.foregroundColor?.value || '#000000';
        }
        
        this.elements.borderColor.value = defaultColor;
        console.log('外枠独自色デフォルト設定:', defaultColor);
      }
    } else {
      this.elements.customBorderColor.classList.add('hidden');
    }
  }
  // 現在の外枠色を取得
  getBorderColor() {
    if (!this.elements.borderColorMode) {
      console.log('⚠️ borderColorMode要素が見つかりません');
      return '#000000';
    }
    
    const mode = this.elements.borderColorMode.value;
    console.log('🎨 外枠色取得:', mode);
    
    switch (mode) {
      case 'same':
        // データ部と同じ
        if (this.currentColorMode === 'gradient') {
          const color = this.elements.gradientStart?.value || '#000000';
          console.log('外枠色（データ部グラデーション開始色）:', color);
          return color;
        } else {
          const color = this.elements.foregroundColor?.value || '#000000';
          console.log('外枠色（データ部単色）:', color);
          return color;
        }
      case 'detection':
        // 検出部と同じ
        const detectionMode = this.elements.detectionColorMode?.value || 'same';
        if (detectionMode === 'custom') {
          const color = this.elements.detectionColor?.value || '#000000';
          console.log('外枠色（検出部独自色）:', color);
          return color;
        } else {
          // 検出部がデータ部と同じなので、データ部の色を返す
          if (this.currentColorMode === 'gradient') {
            const color = this.elements.gradientStart?.value || '#000000';
            console.log('外枠色（検出部=データ部グラデーション）:', color);
            return color;
          } else {
            const color = this.elements.foregroundColor?.value || '#000000';
            console.log('外枠色（検出部=データ部単色）:', color);
            return color;
          }
        }
      case 'custom':
      default:
        const color = this.elements.borderColor?.value || '#000000';
        console.log('外枠色（独自色）:', color);
        return color;
    }
  }

  // 検出パターンの位置を取得
  getDetectionPatterns(moduleCount) {
    return [
      { startX: 0, startY: 0, endX: 6, endY: 6 }, // 左上
      { startX: moduleCount - 7, startY: 0, endX: moduleCount - 1, endY: 6 }, // 右上
      { startX: 0, startY: moduleCount - 7, endX: 6, endY: moduleCount - 1 } // 左下
    ];
  }

  // 指定した位置が検出パターンかどうか判定
  isDetectionPattern(row, col, detectionPatterns) {
    return detectionPatterns.some(pattern => 
      col >= pattern.startX && col <= pattern.endX && 
      row >= pattern.startY && row <= pattern.endY
    );
  }

  initializeElements() {
    // 全ての要素を取得
    this.elements = {
      // モードボタン
      modeBtns: document.querySelectorAll('.mode-btn'),
      singleModeBtn: document.getElementById('singleModeBtn'),
      batchModeBtn: document.getElementById('batchModeBtn'),
      
      // セクション
      singleGenerationSection: document.getElementById('singleGenerationSection'),
      batchGenerationSection: document.getElementById('batchGenerationSection'),
      
      // テンプレート
      templateBtns: document.querySelectorAll('.template-btn'),
      dynamicInputs: document.getElementById('dynamicInputs'),
      
      // デザインモード
      standardModeBtn: document.getElementById('standardModeBtn'),
      creativeModeBtn: document.getElementById('creativeModeBtn'),
      creativeSettings: document.getElementById('creativeSettings'),
      
      // 基本設定
      qrSize: document.getElementById('qrSize'),
      foregroundColor: document.getElementById('foregroundColor'),
      backgroundColor: document.getElementById('backgroundColor'),
      shapeSelect: document.getElementById('shapeSelect'),
      
      // 結果表示
      generateBtn: document.getElementById('generateBtn'),
      qrResult: document.getElementById('qrResult'),
      
      // ダウンロード関連
      downloadBtn: document.getElementById('downloadBtn'),
      downloadAllBtn: document.getElementById('downloadAllBtn'),
      downloadFormat: document.getElementById('downloadFormat'),
      jpegQuality: document.getElementById('jpegQuality'),
      jpegQualityValue: document.getElementById('jpegQualityValue'),
      jpegQualityDiv: document.getElementById('jpegQualityDiv'),
      
      // カラーモード
      colorMode: document.getElementById('colorMode'),
      gradientSettings: document.getElementById('gradientSettings'),
      gradientStart: document.getElementById('gradientStart'),
      gradientEnd: document.getElementById('gradientEnd'),
      gradientDirection: document.getElementById('gradientDirection'),
      creativeDownloadSection: document.getElementById('creativeDownloadSection'),
      downloadSVG: document.getElementById('downloadSVG'),
      downloadPNG: document.getElementById('downloadPNG'),
      
      // 検出パターン設定
      detectionColorMode: document.getElementById('detectionColorMode'),
      detectionColor: document.getElementById('detectionColor'),
      customDetectionColor: document.getElementById('customDetectionColor'),
      detectionShape: document.getElementById('detectionShape'),
      
      // 外枠設定
      borderEnabled: document.getElementById('borderEnabled'),
      borderSettings: document.getElementById('borderSettings'),
      borderWidth: document.getElementById('borderWidth'),
      borderColor: document.getElementById('borderColor'),
      borderColorMode: document.getElementById('borderColorMode'),
      customBorderColor: document.getElementById('customBorderColor'),
      
      // 保存プレビュー
      previewSaveBtn: document.getElementById('previewSaveBtn'),
      savePreviewSection: document.getElementById('savePreviewSection'),
      savePreviewResult: document.getElementById('savePreviewResult'),
        // バッチ生成
      csvFileInput: document.getElementById('csvFileInput'),
      batchTextData: document.getElementById('batchTextData'),
      batchPreview: document.getElementById('batchPreview'),
      batchPreviewList: document.getElementById('batchPreviewList'),
      batchCount: document.getElementById('batchCount'),
      generateBatchBtn: document.getElementById('generateBatchBtn'),
      batchProgress: document.getElementById('batchProgress'),
      batchProgressContainer: document.getElementById('batchProgressContainer'),
      batchProgressText: document.getElementById('batchProgressText')
    };
    
    console.log('📝 要素取得結果:', Object.keys(this.elements).length, '個の要素を取得');
      // デバッグ: 重要な要素の取得状況を確認
    const criticalElements = ['generateBtn', 'qrResult', 'qrText', 'foregroundColor', 'backgroundColor'];
    criticalElements.forEach(id => {
      const element = document.getElementById(id);
      console.log(`🔍 要素確認 ${id}:`, element ? '✅ 存在' : '❌ 未発見');
    });
  }

  bindBasicEvents() {
    // 基本的なQR生成
    if (this.elements.generateBtn) {
      this.elements.generateBtn.addEventListener('click', () => {
        console.log('🎯 Generate button clicked');
        this.generateQR();
      });
    }

    // モード選択
    this.elements.modeBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchMode(btn.dataset.mode);
      });
    });
    
    // テンプレート選択
    this.elements.templateBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTemplate(btn.dataset.template);
      });
    });

    // デザインモード
    if (this.elements.standardModeBtn) {
      this.elements.standardModeBtn.addEventListener('click', () => {
        this.switchDesignMode('standard');
      });
    }

    if (this.elements.creativeModeBtn) {
      this.elements.creativeModeBtn.addEventListener('click', () => {
        this.switchDesignMode('creative');
      });
    }

    // カラーモード変更
    if (this.elements.colorMode) {
      this.elements.colorMode.addEventListener('change', () => {
        this.currentColorMode = this.elements.colorMode.value;
        this.updateColorModeUI();
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // 形状・色変更時の再描画
    ['shapeSelect', 'foregroundColor', 'backgroundColor', 'qrSize', 
     'gradientStart', 'gradientEnd', 'gradientDirection'].forEach(id => {
      const el = this.elements[id];
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'shapeSelect') this.currentShape = el.value;
          console.log(`設定変更: ${id}`);
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 検出パターン色設定の変更
    ['detectionColorMode', 'detectionColor'].forEach(id => {
      const el = this.elements[id];
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'detectionColorMode') this.updateDetectionColorSettings();
          console.log(`検出パターン設定変更: ${id}`);
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 検出パターン形状変更
    if (this.elements.detectionShape) {
      this.elements.detectionShape.addEventListener('change', () => {
        console.log('検出パターン形状変更');
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // 外枠設定
    if (this.elements.borderEnabled) {
      this.elements.borderEnabled.addEventListener('change', () => {
        this.updateBorderSettings();
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // 外枠色設定モード
    if (this.elements.borderColorMode) {
      this.elements.borderColorMode.addEventListener('change', () => {
        this.updateBorderColorSettings();
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // 外枠の詳細設定
    [this.elements.borderWidth, this.elements.borderColor].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          console.log('外枠設定変更');
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 保存プレビューボタン
    if (this.elements.previewSaveBtn) {
      this.elements.previewSaveBtn.addEventListener('click', () => {
        this.showSavePreview();
      });
    }

    // プリセット
    document.querySelectorAll('.preset-btn')?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyPreset(btn.dataset.preset);
      });
    });

    // ダウンロード関連
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => {
        this.downloadQR();
      });
    }

    if (this.elements.downloadFormat) {
      this.elements.downloadFormat.addEventListener('change', () => {
        this.updateDownloadFormatUI();
      });
    }

    if (this.elements.jpegQuality) {
      this.elements.jpegQuality.addEventListener('input', () => {
        if (this.elements.jpegQualityValue) {
          this.elements.jpegQualityValue.textContent = Math.round(this.elements.jpegQuality.value * 100) + '%';
        }
      });
    }

    if (this.elements.downloadAllBtn) {
      this.elements.downloadAllBtn.addEventListener('click', () => {
        this.downloadAllFormats();
      });
    }

    // クリエイティブダウンロード
    if (this.elements.downloadSVG) {
      this.elements.downloadSVG.addEventListener('click', () => this.downloadCreativeSVG());
    }
    if (this.elements.downloadPNG) {
      this.elements.downloadPNG.addEventListener('click', () => this.downloadCreativePNG());
    }
  }
  // 基本的なQR生成メソッド
  generateQR() {
    console.log('🎯 QR生成開始');
    try {
      const content = this.getContentFromTemplate();
      console.log('📝 取得したコンテンツ:', content);
      
      if (!content) {
        alert('内容を入力してください');
        return;
      }

      // QRコードライブラリの存在確認
      if (typeof qrcode === 'undefined') {
        console.error('❌ QRコードライブラリが読み込まれていません');
        alert('QRコードライブラリが読み込まれていません。ページを再読み込みしてください。');
        return;
      }

      // QRコードデータ生成
      console.log('🔧 QRコードデータ生成中...');
      this.qrData = qrcode(0, 'M');
      this.qrData.addData(content);
      this.qrData.make();
      console.log('✅ QRコードデータ生成完了');

      // デザインモードに応じて描画
      if (this.designMode === 'creative') {
        console.log('🎨 クリエイティブモードで描画');
        this.renderCreativeQR();
      } else {
        console.log('📱 標準モードで描画');
        this.renderStandardQR();
      }
      
      // ダウンロードボタンを表示
      this.showDownloadButtons();
      
      console.log('✅ QRコード生成成功');
    } catch (error) {
      console.error('❌ QR生成エラー:', error);
      alert('QRコード生成エラー: ' + error.message);
    }
  }

  // ダウンロードボタン表示
  showDownloadButtons() {
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.classList.remove('hidden');
    }
    
    if (this.elements.downloadAllBtn) {
      this.elements.downloadAllBtn.classList.remove('hidden');
    }
    
    if (this.elements.previewSaveBtn) {
      this.elements.previewSaveBtn.classList.remove('hidden');
    }
    
    if (this.designMode === 'creative' && this.elements.creativeDownloadSection) {
      this.elements.creativeDownloadSection.classList.remove('hidden');
    }
  }  // テンプレートから内容を取得
  getContentFromTemplate() {
    console.log('📋 テンプレートからコンテンツ取得開始');
    
    // 基本的なテキスト入力を確認
    const qrTextElement = document.getElementById('qrText');
    if (qrTextElement && qrTextElement.value.trim()) {
      const content = qrTextElement.value.trim();
      console.log('✅ qrTextから取得:', content);
      return content;
    }
    
    // Wi-Fi設定の場合
    const wifiSSID = document.getElementById('wifiSSID');
    const wifiPassword = document.getElementById('wifiPassword');
    const wifiSecurity = document.getElementById('wifiSecurity');
    
    if (wifiSSID && wifiSSID.value.trim()) {
      const ssid = wifiSSID.value.trim();
      const password = wifiPassword ? wifiPassword.value : '';
      const security = wifiSecurity ? wifiSecurity.value : 'WPA';
      const wifiContent = `WIFI:T:${security};S:${ssid};P:${password};;`;
      console.log('✅ WiFi設定から取得:', wifiContent);
      return wifiContent;
    }
    
    // その他の入力フィールドを順次確認
    const inputs = [
      'urlInput', 'emailInput', 'phoneInput', 'smsInput', 
      'vCardName', 'eventTitle'
    ];
    
    for (const inputId of inputs) {
      const input = document.getElementById(inputId);
      if (input && input.value.trim()) {
        const content = input.value.trim();
        console.log(`✅ ${inputId}から取得:`, content);
        return content;
      }
    }
    
    // フォールバック: 表示されている任意のテキスト入力を探す
    const visibleInputs = document.querySelectorAll('input[type="text"]:not([style*="display: none"]), textarea:not([style*="display: none"])');
    for (const input of visibleInputs) {
      if (input.value.trim() && !input.closest('.hidden')) {
        const content = input.value.trim();
        console.log('✅ 表示中の入力から取得:', content);
        return content;
      }
    }
    
    console.log('⚠️ 有効な入力が見つかりません、デフォルト値を使用');
    return 'https://negi-lab.com';
  }

  // 標準QR描画
  renderStandardQR() {
    if (!this.qrData) return;
    
    const size = parseInt(this.elements.qrSize?.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // 背景
    ctx.fillStyle = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // QRコードデータ
    ctx.fillStyle = this.elements.foregroundColor?.value || '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    this.currentCreativeCanvas = canvas;
    if (this.elements.qrResult) {
      this.elements.qrResult.innerHTML = '';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '400px';
      canvas.style.height = 'auto';
      canvas.style.width = 'auto';
      canvas.style.borderRadius = '0.5rem';
      canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      this.elements.qrResult.appendChild(canvas);
    }
  }

  // クリエイティブQR描画（簡略版）
  renderCreativeQR() {
    if (!this.qrData) return;
    
    console.log('🎨 クリエイティブQR描画開始');
    
    const size = parseInt(this.elements.qrSize?.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // 背景を描画
    ctx.fillStyle = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // 検出パターンの位置を事前に計算
    const detectionPatterns = this.getDetectionPatterns(moduleCount);
    
    // フィルスタイルを設定
    let fillStyle = '#000000';
    
    if (this.currentColorMode === 'gradient') {
      const gradient = this.createGradient(ctx, qrSize);
      if (gradient) fillStyle = gradient;
    } else {
      fillStyle = this.elements.foregroundColor?.value || '#000000';
    }
    
    // QRコードセル（データ部）を描画（検出パターンを除く）
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col) && !this.isDetectionPattern(row, col, detectionPatterns)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          ctx.fillStyle = fillStyle;
          this.drawCreativeModule(ctx, x, y, moduleSize);
        }
      }
    }
      // 検出パターンを別途描画
    this.drawDetectionPatterns(ctx, moduleCount, moduleSize);
    
    // 外枠はプレビューでは描画しない（保存時のみ）
    // this.drawBorder(ctx, qrSize);
    
    this.currentCreativeCanvas = canvas;
    if (this.elements.qrResult) {
      this.elements.qrResult.innerHTML = '';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '400px';
      canvas.style.height = 'auto';
      canvas.style.width = 'auto';
      canvas.style.borderRadius = '0.5rem';
      canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      this.elements.qrResult.appendChild(canvas);
    }
    
    console.log('✅ クリエイティブQR描画完了');
  }  // グラデーション作成
  createGradient(ctx, size) {
    let gradient;
    const startColor = this.elements.gradientStart?.value || '#000000';
    const endColor = this.elements.gradientEnd?.value || '#333333';
    const direction = this.elements.gradientDirection?.value || 'horizontal';
    
    console.log('🎨 グラデーション作成:', direction, startColor, endColor);
    
    switch (direction) {
      case 'horizontal':
        gradient = ctx.createLinearGradient(0, 0, size, 0);
        break;
      case 'horizontal-reverse':
        gradient = ctx.createLinearGradient(size, 0, 0, 0);
        break;
      case 'vertical':
        gradient = ctx.createLinearGradient(0, 0, 0, size);
        break;
      case 'vertical-reverse':
        gradient = ctx.createLinearGradient(0, size, 0, 0);
        break;
      case 'diagonal':
        gradient = ctx.createLinearGradient(0, 0, size, size);
        break;
      case 'diagonal-reverse':
        gradient = ctx.createLinearGradient(size, 0, 0, size);
        break;
      case 'radial':
        gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        break;
      case 'radial-reverse':
        gradient = ctx.createRadialGradient(size/2, size/2, size/2, size/2, size/2, 0);
        break;
      default:
        console.warn('⚠️ 未知のグラデーション方向:', direction);
        gradient = ctx.createLinearGradient(0, 0, size, 0);
        break;
    }    // 放射状逆方向の場合は色の順序を逆にする
    if (direction === 'radial-reverse') {
      gradient.addColorStop(0, endColor);
      gradient.addColorStop(1, startColor);
    } else {
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);
    }
    
    console.log('✅ グラデーション作成完了');
    return gradient;
  }

  // クリエイティブモジュール描画
  drawCreativeModule(ctx, x, y, size) {
    switch (this.currentShape) {
      case 'circle':
        const r = size * 0.4;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, r, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'rounded':
        const radius = size * 0.2;
        this.drawRoundedRect(ctx, x, y, size, size, radius);
        break;
      default:
        ctx.fillRect(x, y, size, size);
        break;
    }
  }

  // 角丸四角形描画
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  // 検出パターン描画
  drawDetectionPatterns(ctx, moduleCount, moduleSize) {
    // 検出パターンの色を決定
    let patternColor;
    const detectionMode = this.elements.detectionColorMode?.value || 'same';
    
    if (detectionMode === 'custom') {
      patternColor = this.elements.detectionColor?.value || '#000000';
    } else {
      // データ部と同じ色を使用
      if (this.currentColorMode === 'gradient') {
        // グラデーションの場合は開始色を使用
        patternColor = this.elements.gradientStart?.value || '#000000';
      } else {
        patternColor = this.elements.foregroundColor?.value || '#000000';
      }
    }
    
    const detectionShape = this.elements.detectionShape?.value || 'square';
    const positions = [
      [0, 0], // 左上
      [moduleCount - 7, 0], // 右上
      [0, moduleCount - 7] // 左下
    ];
    
    positions.forEach(([startX, startY]) => {
      this.drawSingleDetectionPattern(ctx, startX, startY, moduleSize, patternColor, detectionShape);
    });
  }

  // 単一検出パターン描画
  drawSingleDetectionPattern(ctx, startX, startY, moduleSize, fillStyle, shape) {
    const x = startX * moduleSize;
    const y = startY * moduleSize;
    const size7 = 7 * moduleSize;
    const size5 = 5 * moduleSize;
    const size3 = 3 * moduleSize;
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    
    ctx.fillStyle = fillStyle;
    
    // 外側 (7x7)
    this.drawDetectionShape(ctx, x, y, size7, shape);
    // 内側 (5x5) - 背景色で塗りつぶし
    ctx.fillStyle = bgColor;
    this.drawDetectionShape(ctx, x + moduleSize, y + moduleSize, size5, shape);
    // 中心 (3x3)
    ctx.fillStyle = fillStyle;
    this.drawDetectionShape(ctx, x + 2 * moduleSize, y + 2 * moduleSize, size3, shape);
  }

  // 検出パターン形状描画
  drawDetectionShape(ctx, x, y, size, shape) {
    switch (shape) {
      case 'rounded':
        const radius = size * 0.15;
        this.drawRoundedRect(ctx, x, y, size, size, radius);
        break;
      case 'circle':
        const r = size / 2;
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
        ctx.fill();
        break;
      default: // square
        ctx.fillRect(x, y, size, size);
        break;
    }
  }

  // 外枠描画
  drawBorder(ctx, qrSize) {
    if (!this.elements.borderEnabled?.checked) return;
    
    const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
    const borderColor = this.getBorderColor();
    
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    
    // QRコードの外側に枠を描画（内側ではなく）
    const offset = borderWidth / 2;
    ctx.strokeRect(-offset, -offset, qrSize + borderWidth, qrSize + borderWidth);
    
    console.log('✅ 外枠描画完了 - 太さ:', borderWidth, '色:', borderColor);
  }

  // ダウンロード機能
  downloadQR() {
    if (!this.currentCreativeCanvas) {
      console.error('❌ ダウンロード対象のキャンバスが見つかりません');
      return;
    }
    
    // 余白を追加したキャンバスを作成
    const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);
    
    const format = this.elements.downloadFormat?.value || 'png';
    let filename = 'qr-code';
    let dataURL;
    
    switch (format) {
      case 'png':
        dataURL = canvasWithMargin.toDataURL('image/png');
        filename += '.png';
        break;
      case 'jpeg':
        const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
        dataURL = canvasWithMargin.toDataURL('image/jpeg', quality);
        filename += '.jpg';
        break;
      case 'webp':
        dataURL = canvasWithMargin.toDataURL('image/webp', 0.9);
        filename += '.webp';
        break;
    }
    
    this.downloadDataURL(dataURL, filename);
  }
  // 余白付きキャンバスを作成
  createCanvasWithMargin(originalCanvas) {
    console.log('📏 余白付きキャンバス作成開始');
    
    // QRコードの推奨余白は各辺に4モジュール分
    const qrSize = originalCanvas.width;
    const moduleCount = this.qrData ? this.qrData.getModuleCount() : 25; // fallback
    const moduleSize = Math.floor(qrSize / moduleCount);
    const margin = moduleSize * 4; // 4モジュール分の余白
    
    const newSize = qrSize + (margin * 2);
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    newCanvas.width = newSize;
    newCanvas.height = newSize;
    
    // 背景色で全体を塗りつぶし
    const backgroundColor = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, newSize, newSize);
    
    // 元のキャンバスを中央に描画
    ctx.drawImage(originalCanvas, margin, margin);
    
    // 外枠を余白の外側に描画
    if (this.elements.borderEnabled?.checked) {
      const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
      const borderColor = this.getBorderColor();
      
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      
      // 外枠は余白とQRコードの境界に描画
      const borderOffset = borderWidth / 2;
      const borderX = margin - borderOffset;
      const borderY = margin - borderOffset;
      const borderSize = qrSize + borderWidth;
      
      ctx.strokeRect(borderX, borderY, borderSize, borderSize);
      
      console.log('✅ 余白付きキャンバスに外枠描画完了 - 太さ:', borderWidth, '色:', borderColor);
    }
    
    console.log(`✅ 余白付きキャンバス作成完了: ${qrSize}x${qrSize} → ${newSize}x${newSize} (余白: ${margin}px)`);
    
    return newCanvas;
  }

  // DataURLからダウンロード
  downloadDataURL(dataURL, filename) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 保存プレビュー表示
  showSavePreview() {
    if (!this.currentCreativeCanvas) {
      console.log('❌ 保存プレビュー表示: キャンバスが存在しません');
      return;
    }

    console.log('🔍 保存プレビュー表示開始');

    // 余白付きキャンバスを作成
    const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);

    // プレビューセクションを表示
    if (this.elements.savePreviewSection) {
      this.elements.savePreviewSection.classList.remove('hidden');
    }

    // プレビュー結果エリアにキャンバスを表示
    if (this.elements.savePreviewResult) {
      this.elements.savePreviewResult.innerHTML = '';
      
      // スタイルを適用
      canvasWithMargin.style.maxWidth = '100%';
      canvasWithMargin.style.maxHeight = '400px';
      canvasWithMargin.style.height = 'auto';
      canvasWithMargin.style.width = 'auto';
      canvasWithMargin.style.borderRadius = '0.5rem';
      canvasWithMargin.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      canvasWithMargin.style.border = '2px solid #3b82f6';

      this.elements.savePreviewResult.appendChild(canvasWithMargin);

      // 情報表示を追加
      const infoDiv = document.createElement('div');
      infoDiv.className = 'mt-3 text-center text-sm text-blue-600';
      
      const originalSize = this.currentCreativeCanvas.width;
      const newSize = canvasWithMargin.width;
      const margin = (newSize - originalSize) / 2;
      
      infoDiv.innerHTML = `
        <p class="font-medium">💾 保存形式情報</p>
        <p class="text-xs mt-1">元サイズ: ${originalSize}×${originalSize}px</p>
        <p class="text-xs">保存サイズ: ${newSize}×${newSize}px</p>
        <p class="text-xs">余白: 各辺 ${Math.round(margin)}px (推奨の4モジュール分)</p>
      `;
      
      this.elements.savePreviewResult.appendChild(infoDiv);
    }

    console.log('✅ 保存プレビュー表示完了');
  }

  // その他の必要なメソッド（簡略版）
  downloadAllFormats() {
    // 簡略実装
    this.downloadQR();
  }

  downloadCreativePNG() {
    this.downloadQR();
  }

  downloadCreativeSVG() {
    // 簡略実装
    console.log('SVGダウンロードは簡略版では未実装');
  }

  updateDownloadFormatUI() {
    const format = this.elements.downloadFormat?.value;
    if (this.elements.jpegQualityDiv) {
      this.elements.jpegQualityDiv.classList.toggle('hidden', format !== 'jpeg');
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    console.log('モード切り替え:', mode);
  }

  selectTemplate(template) {
    this.currentTemplate = template;
    console.log('テンプレート選択:', template);
  }

  switchDesignMode(mode) {
    this.designMode = mode;
    console.log('デザインモード切り替え:', mode);
    
    if (this.elements.creativeSettings) {
      if (mode === 'creative') {
        this.elements.creativeSettings.classList.remove('hidden');
      } else {
        this.elements.creativeSettings.classList.add('hidden');
      }
    }
    
    // QRコードが生成済みの場合は再描画
    if (this.qrData) {
      if (mode === 'creative') {
        this.renderCreativeQR();
      } else {
        this.renderStandardQR();
      }
    }
  }

  updateColorModeUI() {
    if (this.elements.gradientSettings) {
      if (this.currentColorMode === 'gradient') {
        this.elements.gradientSettings.classList.remove('hidden');
      } else {
        this.elements.gradientSettings.classList.add('hidden');
      }
    }
  }

  applyPreset(preset) {
    console.log('プリセット適用:', preset);
    // 簡略実装
  }
}

// グローバルインスタンス作成
console.log('🔄 簡易版QRGeneratorインスタンス作成開始');

try {
  window.qrGeneratorInstance = new QRGenerator();
  console.log('✅ 簡易版QRGeneratorインスタンス作成成功:', window.qrGeneratorInstance);
} catch (error) {
  console.error('❌ 簡易版QRGeneratorインスタンス作成失敗:', error);
}

console.log('🏁 簡易版QRGenerator読み込み完了');
