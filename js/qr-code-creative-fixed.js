// QRGeneratorクラス定義
class QRGenerator {
  constructor() {
    this.currentTemplate = 'text';
    this.currentMode = 'single';
    this.batchData = [];
    
    // クリエイティブ機能追加
    this.designMode = 'standard'; // 'standard' or 'creative'
    this.currentShape = 'square';
    this.currentColorMode = 'solid';
    this.qrData = null; // QR生成用
    this.currentCreativeCanvas = null;
    this.elements = {}; // 初期化時は空
    
    console.log('🏗️ QRGeneratorコンストラクター実行開始');
    
    // DOM要素の初期化とイベントバインディングを遅延実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initialize();
      });
    } else {
      // DOMが既に読み込まれている場合は即座に実行
      this.initialize();
    }
  }

  initialize() {
    console.log('🔧 QRGenerator.initialize() 開始');
    try {
      this.initializeElements();
      this.bindEvents();
      console.log('✅ QRGenerator初期化完了');
    } catch (error) {
      console.error('❌ QRGenerator初期化エラー:', error);
    }
  }

  initializeElements() {
    this.elements = {
      // モードボタン
      modeBtns: document.querySelectorAll('.mode-btn'),
      singleModeBtn: document.getElementById('singleModeBtn'),
      batchModeBtn: document.getElementById('batchModeBtn'),
      
      // セクション
      singleGenerationSection: document.getElementById('singleGenerationSection'),
      batchGenerationSection: document.getElementById('batchGenerationSection'),
      inputSection: document.getElementById('inputSection'),
      
      // 単体生成要素
      templateBtns: document.querySelectorAll('.qr-template-btn'),
      templateInputs: document.querySelectorAll('.template-input'),
      qrText: document.getElementById('qrText'),
      wifiSSID: document.getElementById('wifiSSID'),
      wifiPassword: document.getElementById('wifiPassword'),
      wifiSecurity: document.getElementById('wifiSecurity'),
      emailAddress: document.getElementById('emailAddress'),
      emailSubject: document.getElementById('emailSubject'),
      emailBody: document.getElementById('emailBody'),
      smsNumber: document.getElementById('smsNumber'),
      smsMessage: document.getElementById('smsMessage'),
      phoneNumber: document.getElementById('phoneNumber'),
      
      // 新しいテンプレート要素
      vcardName: document.getElementById('vcardName'),
      vcardOrg: document.getElementById('vcardOrg'),
      vcardTitle: document.getElementById('vcardTitle'),
      vcardPhone: document.getElementById('vcardPhone'),
      vcardEmail: document.getElementById('vcardEmail'),
      vcardUrl: document.getElementById('vcardUrl'),
      vcardAddress: document.getElementById('vcardAddress'),
      
      eventTitle: document.getElementById('eventTitle'),
      eventStart: document.getElementById('eventStart'),
      eventEnd: document.getElementById('eventEnd'),
      eventLocation: document.getElementById('eventLocation'),
      eventDescription: document.getElementById('eventDescription'),
      
      locationLat: document.getElementById('locationLat'),
      locationLng: document.getElementById('locationLng'),
      locationName: document.getElementById('locationName'),
      
      socialType: document.getElementById('socialType'),
      socialUsername: document.getElementById('socialUsername'),
      
      // ダウンロード関連
      downloadFormat: document.getElementById('downloadFormat'),
      jpegQuality: document.getElementById('jpegQuality'),
      jpegQualityValue: document.getElementById('jpegQualityValue'),
      jpegQualityDiv: document.getElementById('jpegQualityDiv'),
      downloadAllBtn: document.getElementById('downloadAllBtn'),
      
      // バッチ生成要素
      csvFileInput: document.getElementById('csvFileInput'),
      batchTextData: document.getElementById('batchTextData'),
      batchPreview: document.getElementById('batchPreview'),
      batchPreviewList: document.getElementById('batchPreviewList'),
      batchCount: document.getElementById('batchCount'),
      generateBatchBtn: document.getElementById('generateBatchBtn'),
      qrSize: document.getElementById('qrSize'),
      errorCorrection: document.getElementById('errorCorrection'),
      foregroundColor: document.getElementById('foregroundColor'),
      backgroundColor: document.getElementById('backgroundColor'),
      generateBtn: document.getElementById('generateBtn'),
      qrResult: document.getElementById('qrResult'),
      downloadBtn: document.getElementById('downloadBtn'),
      
      // クリエイティブ機能要素
      designModeSection: document.getElementById('designModeSection'),
      standardModeBtn: document.getElementById('standardModeBtn'),
      creativeModeBtn: document.getElementById('creativeModeBtn'),
      creativeSettingsSection: document.getElementById('creativeSettingsSection'),
      colorMode: document.getElementById('colorMode'),
      gradientSettings: document.getElementById('gradientSettings'),
      gradientStart: document.getElementById('gradientStart'),
      gradientEnd: document.getElementById('gradientEnd'),
      gradientDirection: document.getElementById('gradientDirection'),
      patternSelect: document.getElementById('patternSelect'),
      patternColor: document.getElementById('patternColor'),
      creativeDownloadSection: document.getElementById('creativeDownloadSection'),
      downloadSVG: document.getElementById('downloadSVG'),
      downloadPNG: document.getElementById('downloadPNG')
    };
  }

  bindEvents() {
    // モード選択
    this.elements.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchMode(btn.dataset.mode);
      });
    });
    
    // テンプレート選択
    this.elements.templateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTemplate(btn.dataset.template);
      });
    });

    // 単体生成ボタン
    this.elements.generateBtn.addEventListener('click', () => {
      this.generateQR();
    });

    // ダウンロードボタン
    this.elements.downloadBtn.addEventListener('click', () => {
      this.downloadQR();
    });
    
    // バッチ生成関連
    this.elements.csvFileInput.addEventListener('change', (e) => {
      this.handleCSVUpload(e);
    });
    
    this.elements.batchTextData.addEventListener('input', () => {
      this.updateBatchPreview();
    });
    
    this.elements.generateBatchBtn.addEventListener('click', () => {
      this.generateBatchQR();
    });
    
    // ダウンロード形式変更
    this.elements.downloadFormat.addEventListener('change', () => {
      this.updateDownloadFormatUI();
    });
    
    // JPEG品質変更
    this.elements.jpegQuality.addEventListener('input', () => {
      this.elements.jpegQualityValue.textContent = Math.round(this.elements.jpegQuality.value * 100) + '%';
    });
    
    // 全形式ダウンロード
    this.elements.downloadAllBtn.addEventListener('click', () => {
      this.downloadAllFormats();
    });

    // クリエイティブ機能イベント
    this.bindCreativeEvents();
  }

  bindCreativeEvents() {
    // デザインモード切り替え
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

    // 形状選択
    document.querySelectorAll('.shape-btn[data-shape]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shape-btn[data-shape]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentShape = btn.dataset.shape;
        console.log('形状変更:', this.currentShape);
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    });

    // カラーモードボタン
    document.querySelectorAll('.color-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentColorMode = btn.dataset.colorMode;
        if (this.elements.colorMode) this.elements.colorMode.value = this.currentColorMode;
        this.updateColorModeUI();
        console.log('カラーモード変更:', this.currentColorMode);
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    });

    // カラーモード（セレクト要素）
    if (this.elements.colorMode) {
      this.elements.colorMode.addEventListener('change', () => {
        this.currentColorMode = this.elements.colorMode.value;
        this.updateColorModeUI();
        console.log('カラーモード変更:', this.currentColorMode);
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // グラデーション設定
    [this.elements.gradientStart, this.elements.gradientEnd, this.elements.gradientDirection].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          console.log('グラデーション設定変更:', {
            start: this.elements.gradientStart?.value,
            end: this.elements.gradientEnd?.value,
            direction: this.elements.gradientDirection?.value
          });
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 色の変更
    [this.elements.foregroundColor, this.elements.backgroundColor, this.elements.patternColor].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          console.log('色設定変更');
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 検出パターン
    document.querySelectorAll('.shape-btn[data-pattern-shape]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shape-btn[data-pattern-shape]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePatternShape(btn.dataset.patternShape);
      });
    });

    if (this.elements.patternColor) {
      this.elements.patternColor.addEventListener('change', () => {
        this.updatePatternColor();
      });
    }

    // プリセット
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyPreset(btn.dataset.preset);
      });
    });

    // クリエイティブダウンロード
    if (this.elements.downloadSVG) {
      this.elements.downloadSVG.addEventListener('click', () => this.downloadCreativeSVG());
    }
    if (this.elements.downloadPNG) {
      this.elements.downloadPNG.addEventListener('click', () => this.downloadCreativePNG());
    }
  }

  switchDesignMode(mode) {
    this.designMode = mode;
    
    // ボタンのスタイル更新
    this.elements.standardModeBtn.classList.toggle('active', mode === 'standard');
    this.elements.creativeModeBtn.classList.toggle('active', mode === 'creative');
    
    // セクションの表示/非表示
    if (this.elements.creativeSettingsSection) {
      this.elements.creativeSettingsSection.classList.toggle('hidden', mode === 'standard');
    }
    
    if (this.elements.creativeDownloadSection) {
      this.elements.creativeDownloadSection.classList.toggle('hidden', mode === 'standard');
    }
    
    console.log('デザインモード切り替え:', mode);
    
    // QRコードが生成済みの場合は再描画
    if (this.qrData) {
      if (mode === 'creative') {
        this.renderCreativeQR();
      } else {
        this.generateQR();
      }
    }
  }

  generateQR() {
    const content = this.getContentFromTemplate();
    if (!content) {
      alert('内容を入力してください');
      return;
    }

    try {
      const size = parseInt(this.elements.qrSize.value) || 256;
      const errorCorrectionLevel = this.elements.errorCorrection.value || 'M';
      
      // QRデータを生成
      this.qrData = qrcode(0, errorCorrectionLevel);
      this.qrData.addData(content);
      this.qrData.make();
      
      if (this.designMode === 'creative') {
        this.renderCreativeQR();
      } else {
        this.renderStandardQR();
      }
      
      this.elements.downloadBtn.classList.remove('hidden');
      this.elements.downloadAllBtn.classList.remove('hidden');
      
    } catch (error) {
      console.error('QRコード生成エラー:', error);
      alert('QRコード生成に失敗しました: ' + error.message);
    }
  }

  renderStandardQR() {
    const size = parseInt(this.elements.qrSize.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // 背景を描画
    ctx.fillStyle = this.elements.backgroundColor.value || '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // QRコードを描画
    ctx.fillStyle = this.elements.foregroundColor.value || '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    this.currentCreativeCanvas = canvas;
    this.elements.qrResult.innerHTML = '';
    this.elements.qrResult.appendChild(canvas);
  }

  renderCreativeQR() {
    if (!this.qrData) return;
    
    const size = parseInt(this.elements.qrSize.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    this.createCreativeCanvas(this.qrData, qrSize, moduleSize, moduleCount)
      .then(canvas => {
        this.currentCreativeCanvas = canvas;
        this.elements.qrResult.innerHTML = '';
        this.elements.qrResult.appendChild(canvas);
        
        // クリエイティブダウンロードボタンを表示
        if (this.elements.creativeDownloadSection) {
          this.elements.creativeDownloadSection.classList.remove('hidden');
        }
      })
      .catch(error => {
        console.error('クリエイティブQR描画エラー:', error);
      });
  }

  createCreativeCanvas(qrData, size, moduleSize, moduleCount) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // 背景を描画
    ctx.fillStyle = this.elements.backgroundColor.value || '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // 検出パターンの位置を定義
    const finderPatternPositions = [
      {startRow: 0, endRow: 6, startCol: 0, endCol: 6},           // 左上
      {startRow: 0, endRow: 6, startCol: moduleCount-7, endCol: moduleCount-1}, // 右上
      {startRow: moduleCount-7, endRow: moduleCount-1, startCol: 0, endCol: 6}  // 左下
    ];
    
    // モジュール描画用のスタイルを設定
    const setModuleFillStyle = () => {
      if (this.currentColorMode === 'gradient') {
        const startColor = this.elements.gradientStart?.value || '#000000';
        const endColor = this.elements.gradientEnd?.value || '#666666';
        const direction = this.elements.gradientDirection?.value || 'linear';
        
        let gradient;
        if (direction === 'radial') {
          gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        } else {
          gradient = ctx.createLinearGradient(0, 0, size, size);
        }
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = this.elements.foregroundColor.value || '#000000';
      }
    };
    
    // 通常のモジュールを描画
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col)) {
          // 検出パターン領域かチェック
          let isInFinderPattern = false;
          for (const pos of finderPatternPositions) {
            if (row >= pos.startRow && row <= pos.endRow && 
                col >= pos.startCol && col <= pos.endCol) {
              isInFinderPattern = true;
              break;
            }
          }
          
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          if (isInFinderPattern) {
            // 検出パターンはスキップ
            continue;
          } else {
            setModuleFillStyle();
            this.drawModuleCanvas(ctx, x, y, moduleSize);
          }
        }
      }
    }
    
    // 検出パターンを最後に描画
    finderPatternPositions.forEach(pos => {
      const x = pos.startCol * moduleSize;
      const y = pos.startRow * moduleSize;
      this.drawFinderPatternCanvas(ctx, x, y, moduleSize);
    });
    
    return Promise.resolve(canvas);
  }

  drawModuleCanvas(ctx, x, y, size) {
    ctx.save();
    
    switch (this.currentShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size * 0.4, 0, 2 * Math.PI);
        ctx.fill();
        break;
      
      case 'rounded':
        this.drawRoundedRect(ctx, x, y, size, size, size * 0.2);
        break;
      
      case 'diamond':
        ctx.beginPath();
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const halfSize = size * 0.4;
        ctx.moveTo(centerX, centerY - halfSize);
        ctx.lineTo(centerX + halfSize, centerY);
        ctx.lineTo(centerX, centerY + halfSize);
        ctx.lineTo(centerX - halfSize, centerY);
        ctx.closePath();
        ctx.fill();
        break;
      
      case 'dot':
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        break;
      
      default: // square
        ctx.fillRect(x, y, size, size);
        break;
    }
    
    ctx.restore();
  }

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

  drawFinderPatternCanvas(ctx, x, y, moduleSize) {
    const patternColor = this.elements.patternColor?.value || this.elements.foregroundColor.value || '#000000';
    
    ctx.save();
    ctx.fillStyle = patternColor;
    
    // 検出パターンを個別のモジュールとして描画
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const shouldFill = this.isFinderPatternModule(i, j);
        if (shouldFill) {
          const moduleX = x + j * moduleSize;
          const moduleY = y + i * moduleSize;
          ctx.fillRect(moduleX, moduleY, moduleSize, moduleSize);
        }
      }
    }
    
    ctx.restore();
  }

  isFinderPatternModule(row, col) {
    // 検出パターンの形状を定義（7x7内での黒いモジュール）
    // 外枠 (0行目、6行目、0列目、6列目)
    if (row === 0 || row === 6 || col === 0 || col === 6) return true;
    // 内側の3x3の中心部分 (2-4行, 2-4列)
    if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
    return false;
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

  updatePatternShape(shape) {
    console.log('パターン形状更新:', shape);
    if (this.qrData && this.designMode === 'creative') {
      this.renderCreativeQR();
    }
  }

  updatePatternColor() {
    console.log('パターン色更新');
    if (this.qrData && this.designMode === 'creative') {
      this.renderCreativeQR();
    }
  }

  applyPreset(preset) {
    console.log('プリセット適用:', preset);
    
    // プリセット設定を適用
    switch (preset) {
      case 'nature':
        this.currentShape = 'circle';
        this.currentColorMode = 'gradient';
        if (this.elements.foregroundColor) this.elements.foregroundColor.value = '#10b981';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#10b981';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#3b82f6';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'linear';
        if (this.elements.patternColor) this.elements.patternColor.value = '#10b981';
        break;
      
      case 'sunset':
        this.currentShape = 'rounded';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#fb923c';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#ef4444';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'linear';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#fb923c';
        break;
      
      case 'ocean':
        this.currentShape = 'circle';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#3b82f6';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#14b8a6';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'radial';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#3b82f6';
        break;
      
      case 'royal':
        this.currentShape = 'diamond';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#a855f7';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#ec4899';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'linear';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#a855f7';
        break;
    }

    // UI要素の状態を更新
    this.updateUIFromCurrentState();
    
    // QRコードを再描画
    if (this.qrData && this.designMode === 'creative') {
      this.renderCreativeQR();
    }
  }

  updateUIFromCurrentState() {
    // 形状ボタンの状態更新
    document.querySelectorAll('.shape-btn[data-shape]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.shape === this.currentShape);
    });

    // カラーモードボタンの状態更新
    document.querySelectorAll('.color-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.colorMode === this.currentColorMode);
    });

    // セレクト要素の値更新
    if (this.elements.colorMode) {
      this.elements.colorMode.value = this.currentColorMode;
    }

    // グラデーション設定の表示/非表示
    this.updateColorModeUI();
  }

  downloadCreativeSVG() {
    if (!this.qrData) {
      alert('先にQRコードを生成してください');
      return;
    }
    
    console.log('SVGダウンロード開始');
    const svgContent = this.createCreativeSVG();
    this.downloadTextFile(svgContent, 'creative-qr.svg', 'image/svg+xml');
  }

  createCreativeSVG() {
    const size = parseInt(this.elements.qrSize.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    let svg = `<svg width="${qrSize}" height="${qrSize}" xmlns="http://www.w3.org/2000/svg">`;
    
    // 背景
    const backgroundColor = this.elements.backgroundColor.value || '#ffffff';
    svg += `<rect width="${qrSize}" height="${qrSize}" fill="${backgroundColor}"/>`;
    
    // グラデーション定義
    if (this.currentColorMode === 'gradient') {
      const startColor = this.elements.gradientStart?.value || '#000000';
      const endColor = this.elements.gradientEnd?.value || '#666666';
      const direction = this.elements.gradientDirection?.value || 'linear';
      
      svg += `<defs>`;
      if (direction === 'radial') {
        svg += `<radialGradient id="moduleGradient" cx="50%" cy="50%" r="50%">`;
      } else {
        svg += `<linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">`;
      }
      svg += `<stop offset="0%" style="stop-color:${startColor}"/>`;
      svg += `<stop offset="100%" style="stop-color:${endColor}"/>`;
      svg += direction === 'radial' ? `</radialGradient>` : `</linearGradient>`;
      svg += `</defs>`;
    }
    
    // 検出パターンの位置を定義
    const finderPatternPositions = [
      {startRow: 0, endRow: 6, startCol: 0, endCol: 6},
      {startRow: 0, endRow: 6, startCol: moduleCount-7, endCol: moduleCount-1},
      {startRow: moduleCount-7, endRow: moduleCount-1, startCol: 0, endCol: 6}
    ];
    
    // 通常のモジュールを描画
    const fillColor = this.currentColorMode === 'gradient' ? 'url(#moduleGradient)' : (this.elements.foregroundColor.value || '#000000');
    
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          // 検出パターン領域かチェック
          let isInFinderPattern = false;
          for (const pos of finderPatternPositions) {
            if (row >= pos.startRow && row <= pos.endRow && 
                col >= pos.startCol && col <= pos.endCol) {
              isInFinderPattern = true;
              break;
            }
          }
          
          if (!isInFinderPattern) {
            const x = col * moduleSize;
            const y = row * moduleSize;
            svg += this.createModuleSVG(x, y, moduleSize, fillColor);
          }
        }
      }
    }
    
    // 検出パターンを最後に描画
    finderPatternPositions.forEach(pos => {
      const x = pos.startCol * moduleSize;
      const y = pos.startRow * moduleSize;
      svg += this.createFinderPatternSVG(x, y, moduleSize);
    });
    
    svg += `</svg>`;
    return svg;
  }

  createModuleSVG(x, y, size, fill) {
    switch (this.currentShape) {
      case 'circle':
        const radius = size * 0.4;
        const cx = x + size / 2;
        const cy = y + size / 2;
        return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/>`;
      
      case 'rounded':
        const cornerRadius = size * 0.2;
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${cornerRadius}" fill="${fill}"/>`;
      
      case 'diamond':
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const halfSize = size * 0.4;
        const points = `${centerX},${centerY - halfSize} ${centerX + halfSize},${centerY} ${centerX},${centerY + halfSize} ${centerX - halfSize},${centerY}`;
        return `<polygon points="${points}" fill="${fill}"/>`;
      
      case 'dot':
        const dotRadius = size * 0.3;
        const dotCx = x + size / 2;
        const dotCy = y + size / 2;
        return `<circle cx="${dotCx}" cy="${dotCy}" r="${dotRadius}" fill="${fill}"/>`;
      
      default: // square
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
    }
  }

  createFinderPatternSVG(x, y, moduleSize) {
    const patternColor = this.elements.patternColor?.value || this.elements.foregroundColor.value || '#000000';
    let pattern = '';
    
    // 検出パターンを個別のモジュールとして描画
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const shouldFill = this.isFinderPatternModule(i, j);
        if (shouldFill) {
          const moduleX = x + j * moduleSize;
          const moduleY = y + i * moduleSize;
          pattern += `<rect x="${moduleX}" y="${moduleY}" width="${moduleSize}" height="${moduleSize}" fill="${patternColor}"/>`;
        }
      }
    }
    
    return pattern;
  }

  downloadCreativePNG() {
    if (!this.currentCreativeCanvas) {
      alert('先にクリエイティブQRコードを生成してください');
      return;
    }
    
    this.currentCreativeCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'creative-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  downloadTextFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 以下、既存の基本機能メソッドを継続（省略されている部分は元のファイルから）
  switchMode(mode) {
    this.currentMode = mode;
    
    // ボタンのスタイル更新
    this.elements.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // セクションの表示切替
    this.elements.singleGenerationSection.classList.toggle('hidden', mode !== 'single');
    this.elements.batchGenerationSection.classList.toggle('hidden', mode !== 'batch');
    this.elements.inputSection.classList.toggle('hidden', mode !== 'single');
  }

  selectTemplate(template) {
    this.currentTemplate = template;
    
    // ボタンのスタイル更新
    this.elements.templateBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === template);
    });
    
    // 入力フォームの表示切替
    this.elements.templateInputs.forEach(input => {
      input.classList.add('hidden');
    });
    
    const targetInput = document.getElementById(template + 'Input');
    if (targetInput) {
      targetInput.classList.remove('hidden');
    }
  }

  getContentFromTemplate() {
    switch (this.currentTemplate) {
      case 'text':
      case 'url':
        return this.elements.qrText.value.trim();
        
      case 'wifi':
        const ssid = this.elements.wifiSSID.value.trim();
        const password = this.elements.wifiPassword.value.trim();
        const security = this.elements.wifiSecurity.value;
        
        if (!ssid) return null;
        
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
        
      case 'email':
        const email = this.elements.emailAddress.value.trim();
        const subject = this.elements.emailSubject.value.trim();
        const body = this.elements.emailBody.value.trim();
        
        if (!email) return null;
        
        let emailContent = `mailto:${email}`;
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        
        if (params.length > 0) {
          emailContent += '?' + params.join('&');
        }
        
        return emailContent;
        
      case 'sms':
        const smsNumber = this.elements.smsNumber.value.trim();
        const smsMessage = this.elements.smsMessage.value.trim();
        
        if (!smsNumber) return null;
        
        if (smsMessage) {
          return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
        } else {
          return `sms:${smsNumber}`;
        }
        
      case 'phone':
        const phoneNumber = this.elements.phoneNumber.value.trim();
        return phoneNumber ? `tel:${phoneNumber}` : null;
        
      default:
        return this.elements.qrText.value.trim();
    }
  }

  updateDownloadFormatUI() {
    const format = this.elements.downloadFormat.value;
    this.elements.jpegQualityDiv.classList.toggle('hidden', format !== 'jpeg');
  }

  downloadQR() {
    if (!this.currentCreativeCanvas) {
      alert('先にQRコードを生成してください');
      return;
    }
    
    const format = this.elements.downloadFormat.value;
    const filename = `qr-code.${format === 'jpeg' ? 'jpg' : format}`;
    
    if (format === 'svg') {
      this.downloadSVG(filename);
    } else {
      const quality = format === 'jpeg' ? parseFloat(this.elements.jpegQuality.value) : 1.0;
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      this.downloadCanvas(this.currentCreativeCanvas, filename, mimeType, quality);
    }
  }

  downloadCanvas(canvas, filename, mimeType, quality) {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  downloadSVG(filename) {
    const svgContent = this.designMode === 'creative' ? this.createCreativeSVG() : this.createStandardSVG();
    this.downloadTextFile(svgContent, filename, 'image/svg+xml');
  }

  createStandardSVG() {
    const size = parseInt(this.elements.qrSize.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    let svg = `<svg width="${qrSize}" height="${qrSize}" xmlns="http://www.w3.org/2000/svg">`;
    
    // 背景
    const backgroundColor = this.elements.backgroundColor.value || '#ffffff';
    svg += `<rect width="${qrSize}" height="${qrSize}" fill="${backgroundColor}"/>`;
    
    // QRコード
    const foregroundColor = this.elements.foregroundColor.value || '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${foregroundColor}"/>`;
        }
      }
    }
    
    svg += `</svg>`;
    return svg;
  }

  downloadAllFormats() {
    if (!this.currentCreativeCanvas) {
      alert('先にQRコードを生成してください');
      return;
    }
    
    // PNG
    this.downloadCanvas(this.currentCreativeCanvas, 'qr-code.png', 'image/png', 1.0);
    
    // JPEG
    setTimeout(() => {
      this.downloadCanvas(this.currentCreativeCanvas, 'qr-code.jpg', 'image/jpeg', 0.9);
    }, 100);
    
    // SVG
    setTimeout(() => {
      this.downloadSVG('qr-code.svg');
    }, 200);
  }

  handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.elements.batchTextData.value = e.target.result;
      this.updateBatchPreview();
    };
    reader.readAsText(file);
  }

  parseBatchData(data) {
    return data.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        const parts = line.split(',');
        return {
          text: parts[0] || '',
          filename: parts[1] || `qr-${index + 1}`
        };
      });
  }

  updateBatchPreview() {
    const data = this.elements.batchTextData.value.trim();
    if (!data) {
      this.elements.batchPreview.classList.add('hidden');
      this.elements.generateBatchBtn.disabled = true;
      return;
    }
    
    this.batchData = this.parseBatchData(data);
    this.elements.batchCount.textContent = this.batchData.length;
    
    const previewHTML = this.batchData
      .slice(0, 10)
      .map((item, index) => {
        const displayText = item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text;
        return `<div class="flex justify-between py-1 border-b border-gray-100">
          <span class="text-gray-600">${index + 1}.</span>
          <span class="flex-1 mx-2 truncate">${displayText}</span>
          <span class="text-xs text-gray-400">${item.filename}</span>
        </div>`;
      })
      .join('');
    
    this.elements.batchPreviewList.innerHTML = previewHTML + 
      (this.batchData.length > 10 ? `<div class="text-center text-xs text-gray-400 mt-2">...他${this.batchData.length - 10}件</div>` : '');
    
    this.elements.batchPreview.classList.remove('hidden');
    this.elements.generateBatchBtn.disabled = this.batchData.length === 0;
  }

  async generateBatchQR() {
    if (this.batchData.length === 0) {
      alert('バッチデータを入力してください');
      return;
    }
    
    const zip = new JSZip();
    const size = parseInt(this.elements.qrSize.value) || 256;
    const errorCorrection = this.elements.errorCorrection.value || 'M';
    
    for (let i = 0; i < this.batchData.length; i++) {
      const item = this.batchData[i];
      
      try {
        const qr = qrcode(0, errorCorrection);
        qr.addData(item.text);
        qr.make();
        
        const canvas = this.generateQRCanvas(item.text, {
          size: size,
          errorCorrection: errorCorrection,
          foregroundColor: this.elements.foregroundColor.value,
          backgroundColor: this.elements.backgroundColor.value
        });
        
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png');
        });
        
        zip.file(`${item.filename}.png`, blob);
        
      } catch (error) {
        console.error(`QRコード生成エラー (${i + 1}):`, error);
      }
    }
    
    zip.generateAsync({ type: 'blob' })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qr-codes-batch.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  }

  generateQRCanvas(text, options) {
    const qr = qrcode(0, options.errorCorrection);
    qr.addData(text);
    qr.make();
    
    const moduleCount = qr.getModuleCount();
    const moduleSize = Math.floor(options.size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // 背景
    ctx.fillStyle = options.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // QRコード
    ctx.fillStyle = options.foregroundColor || '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    return canvas;
  }
}

// グローバルインスタンス作成
console.log('🔄 QRGenerator初期化開始...');

// 即座にインスタンス作成を試行
if (!window.qrGeneratorInstance) {
  try {
    window.qrGeneratorInstance = new QRGenerator();
    console.log('✅ QRGeneratorインスタンス作成成功:', window.qrGeneratorInstance);
  } catch (error) {
    console.error('❌ QRGeneratorインスタンス作成失敗:', error);
    
    // DOMContentLoaded後に再試行
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🔄 DOMContentLoaded後にQRGenerator再初期化...');
      if (!window.qrGeneratorInstance) {
        try {
          window.qrGeneratorInstance = new QRGenerator();
          console.log('✅ DOMContentLoaded後のQRGeneratorインスタンス作成成功');
        } catch (retryError) {
          console.error('❌ DOMContentLoaded後のQRGeneratorインスタンス作成失敗:', retryError);
        }
      }
    });
  }
} else {
  console.log('ℹ️ QRGeneratorインスタンスは既に存在します');
}
