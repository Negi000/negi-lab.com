// 簡易版QRGeneratorクラス - デバッグ用
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
  }  safeInitialize() {
    console.log('🔧 QRGenerator.safeInitialize() 開始');
    try {
      this.initializeElements();
      this.bindBasicEvents();
      this.initializeDetectionColorDefault(); // 検出パターンのデフォルト色を初期化
      this.updateBorderColorSettings(); // 外枠色設定を初期化
      this.initializeRoundedSettings(); // 角丸設定を初期化
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
          // 単色の場合は前景色を使用
          defaultColor = this.elements.foregroundColor?.value || '#000000';
        }
        
        this.elements.detectionColor.value = defaultColor;
        console.log('検出パターンデフォルト色設定:', defaultColor);
      }
    } else {
      this.elements.customDetectionColor.classList.add('hidden');
    }    console.log('検出パターン色設定更新:', mode);
  }

  // 検出パターンのデフォルト色を初期化
  initializeDetectionColorDefault() {
    if (this.elements.detectionColor && this.elements.foregroundColor) {
      // 前景色と同じ値に設定
      const defaultColor = this.elements.foregroundColor.value;
      this.elements.detectionColor.value = defaultColor;      console.log('検出パターン初期デフォルト色設定:', defaultColor);
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
  }initializeElements() {
    // 全ての要素を取得
    this.elements = {
      // モードボタン
      modeBtns: document.querySelectorAll('.mode-btn'),
      singleModeBtn: document.getElementById('singleModeBtn'),
      batchModeBtn: document.getElementById('batchModeBtn'),
      
      // セクション
      singleGenerationSection: document.getElementById('singleGenerationSection'),
      batchGenerationSection: document.getElementById('batchGenerationSection'),
      inputSection: document.getElementById('inputSection'),
      
      // テンプレート
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
      
      // QR設定
      qrSize: document.getElementById('qrSize'),
      errorCorrection: document.getElementById('errorCorrection'),
      foregroundColor: document.getElementById('foregroundColor'),
      backgroundColor: document.getElementById('backgroundColor'),
      
      // 結果・ダウンロード
      generateBtn: document.getElementById('generateBtn'),
      qrResult: document.getElementById('qrResult'),
      downloadBtn: document.getElementById('downloadBtn'),
      downloadFormat: document.getElementById('downloadFormat'),
      jpegQuality: document.getElementById('jpegQuality'),
      jpegQualityValue: document.getElementById('jpegQualityValue'),
      jpegQualityDiv: document.getElementById('jpegQualityDiv'),
      downloadAllBtn: document.getElementById('downloadAllBtn'),
      
      // デザインモード
      standardModeBtn: document.getElementById('standardModeBtn'),
      creativeModeBtn: document.getElementById('creativeModeBtn'),
      creativeSettingsSection: document.getElementById('creativeSettingsSection'),
      
      // クリエイティブ設定
      colorMode: document.getElementById('colorMode'),
      gradientSettings: document.getElementById('gradientSettings'),      gradientStart: document.getElementById('gradientStart'),
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
      borderEnabled: document.getElementById('borderEnabled'),      borderSettings: document.getElementById('borderSettings'),
      borderWidth: document.getElementById('borderWidth'),
      borderWidthValue: document.getElementById('borderWidthValue'),
      borderColor: document.getElementById('borderColor'),
      borderColorData: document.getElementById('borderColorData'),
      borderColorCustom: document.getElementById('borderColorCustom'),
      customBorderColor: document.getElementById('customBorderColor'),
        // 画像の角丸設定
      imageRounded: document.getElementById('imageRounded'),
      roundedRadius: document.getElementById('roundedRadius'),
      roundedRadiusValue: document.getElementById('roundedRadiusValue'),
      roundedRadiusDiv: document.getElementById('roundedRadiusDiv'),
      
      // プレビュー
      downloadPreviewSection: document.getElementById('downloadPreviewSection'),
      downloadPreview: document.getElementById('downloadPreview'),
      
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

    // カラーモードボタン
    document.querySelectorAll('.color-mode-btn')?.forEach(btn => {
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

    // 形状選択
    document.querySelectorAll('.shape-btn[data-shape]')?.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shape-btn[data-shape]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentShape = btn.dataset.shape;
        console.log('形状変更:', this.currentShape);
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    });

    // グラデーション設定
    [this.elements.gradientStart, this.elements.gradientEnd, this.elements.gradientDirection].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          console.log('グラデーション設定変更');
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });    // 色の変更
    [this.elements.foregroundColor, this.elements.backgroundColor].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          console.log('色設定変更');
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });
      }
    });

    // 検出パターン設定
    if (this.elements.detectionColorMode) {
      this.elements.detectionColorMode.addEventListener('change', () => {
        this.updateDetectionColorSettings();
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }    if (this.elements.detectionColor) {
      this.elements.detectionColor.addEventListener('change', () => {
        console.log('検出パターン色変更');
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // 検出パターン形状変更
    if (this.elements.detectionShape) {
      this.elements.detectionShape.addEventListener('change', () => {
        console.log('検出パターン形状変更');
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }    // 外枠設定
    if (this.elements.borderEnabled) {
      this.elements.borderEnabled.addEventListener('change', () => {
        this.updateBorderSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 外枠の太さスライダー
    if (this.elements.borderWidth) {
      this.elements.borderWidth.addEventListener('input', () => {
        if (this.elements.borderWidthValue) {
          this.elements.borderWidthValue.textContent = this.elements.borderWidth.value + 'px';
        }
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }    // 外枠の色設定モード
    if (this.elements.borderColorData) {
      this.elements.borderColorData.addEventListener('change', () => {
        this.updateBorderColorSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    if (this.elements.borderColorCustom) {
      this.elements.borderColorCustom.addEventListener('change', () => {
        this.updateBorderColorSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 外枠の独自色
    if (this.elements.borderColor) {
      this.elements.borderColor.addEventListener('change', () => {
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }      });
    }    // 画像の角丸設定
    if (this.elements.imageRounded) {
      this.elements.imageRounded.addEventListener('change', () => {
        if (this.elements.roundedRadiusDiv) {
          this.elements.roundedRadiusDiv.style.display = 
            this.elements.imageRounded.checked ? 'block' : 'none';
        }
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 角丸半径設定
    if (this.elements.roundedRadius) {
      this.elements.roundedRadius.addEventListener('input', () => {
        if (this.elements.roundedRadiusValue) {
          this.elements.roundedRadiusValue.textContent = 
            this.elements.roundedRadius.value + '%';
        }
        if (this.qrData && this.designMode === 'creative' && this.elements.imageRounded?.checked) {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
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

    // バッチ生成イベント
    if (this.elements.csvFileInput) {
      this.elements.csvFileInput.addEventListener('change', async () => {
        console.log('📁 CSVファイル選択:', this.elements.csvFileInput.files[0]?.name);
        await this.processBatchData();
      });
    }

    if (this.elements.batchTextData) {
      this.elements.batchTextData.addEventListener('input', async () => {
        console.log('📝 バッチテキスト入力変更');
        await this.processBatchData();
      });
    }

    if (this.elements.generateBatchBtn) {
      this.elements.generateBatchBtn.addEventListener('click', async () => {
        console.log('🚀 バッチ生成ボタンクリック');
        await this.generateBatch();
      });
    }

    console.log('✅ 全イベントバインディング完了');
  }

  // テンプレートからコンテンツを取得
  getContentFromTemplate() {
    switch (this.currentTemplate) {
      case 'text':
      case 'url':
        return this.elements.qrText?.value?.trim();
        
      case 'wifi':
        const ssid = this.elements.wifiSSID?.value?.trim();
        const password = this.elements.wifiPassword?.value?.trim();
        const security = this.elements.wifiSecurity?.value || 'WPA';
        
        if (!ssid) return null;
        
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
        
      case 'email':
        const email = this.elements.emailAddress?.value?.trim();
        const subject = this.elements.emailSubject?.value?.trim();
        const body = this.elements.emailBody?.value?.trim();
        
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
        const smsNumber = this.elements.smsNumber?.value?.trim();
        const smsMessage = this.elements.smsMessage?.value?.trim();
        
        if (!smsNumber) return null;
        
        if (smsMessage) {
          return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
        } else {
          return `sms:${smsNumber}`;
        }
        
      case 'phone':
        const phoneNumber = this.elements.phoneNumber?.value?.trim();
        return phoneNumber ? `tel:${phoneNumber}` : null;
        
      default:
        return this.elements.qrText?.value?.trim();
    }
  }

  // テンプレート更新版QR生成
  generateQR() {
    console.log('🔄 QRコード生成開始 - テンプレート:', this.currentTemplate);
    
    let content;
    if (this.currentTemplate === 'text' || this.currentTemplate === 'url') {
      content = this.elements.qrText?.value?.trim();
    } else {
      content = this.getContentFromTemplate();
    }
      if (!content) {
      const message = window.languageManager ? window.languageManager.t('qrCode.error.required') : '必要な情報を入力してください';
      alert(message);
      return;
    }

    try {
      const size = parseInt(this.elements.qrSize?.value) || 256;
      const errorCorrectionLevel = this.elements.errorCorrection?.value || 'M';
      
      // QRデータを生成
      this.qrData = qrcode(0, errorCorrectionLevel);
      this.qrData.addData(content);
      this.qrData.make();
      
      // デザインモードに応じて描画
      if (this.designMode === 'creative') {
        this.renderCreativeQR();
      } else {
        this.renderStandardQR();
      }
      
      if (this.elements.downloadBtn) {
        this.elements.downloadBtn.classList.remove('hidden');
      }
      
      // 全形式ダウンロードボタンも表示
      if (this.elements.downloadAllBtn) {
        this.elements.downloadAllBtn.classList.remove('hidden');
      }
      
      // クリエイティブモードの場合はクリエイティブダウンロードボタンも表示
      if (this.designMode === 'creative' && this.elements.creativeDownloadSection) {
        this.elements.creativeDownloadSection.classList.remove('hidden');
      } else if (this.elements.creativeDownloadSection) {
        this.elements.creativeDownloadSection.classList.add('hidden');
      }
      
      console.log('✅ QRコード生成成功 - 内容:', content);
        } catch (error) {
      console.error('❌ QRコード生成エラー:', error);
      const message = window.languageManager ? window.languageManager.t('qrCode.error.generateFailed') : 'QRコード生成に失敗しました';
      alert(message + ': ' + error.message);
    }
  }

  renderStandardQR() {
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
    
    // QRコードを描画
    ctx.fillStyle = this.elements.foregroundColor?.value || '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }    }
      this.currentCreativeCanvas = canvas;
    if (this.elements.qrResult) {
      this.elements.qrResult.innerHTML = '';
      // プレビューエリア内に収まるようにスタイルを追加
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '400px';
      canvas.style.height = 'auto';
      canvas.style.width = 'auto';
      
      // 角丸設定に応じてスタイルを適用
      if (this.elements.imageRounded?.checked) {
        canvas.style.borderRadius = '0.5rem';
      } else {
        canvas.style.borderRadius = '0';
      }
      
      canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      this.elements.qrResult.appendChild(canvas);
    }
  }
  // クリエイティブQR描画
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
      }    }
      // 検出パターンを別途描画
    this.drawDetectionPatterns(ctx, moduleCount, moduleSize);
    
    // 外枠は保存時のみ描画（プレビューでは余白付きキャンバスで描画）
    // this.drawBorder(ctx, qrSize);
    
    this.currentCreativeCanvas = canvas;
    if (this.elements.qrResult) {
      this.elements.qrResult.innerHTML = '';
      // プレビューエリア内に収まるようにスタイルを追加
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '400px';
      canvas.style.height = 'auto';
      canvas.style.width = 'auto';
      canvas.style.borderRadius = '0.5rem';
      canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      this.elements.qrResult.appendChild(canvas);    }
    
    console.log('✅ クリエイティブQR描画完了');
    
    // 保存時プレビューを更新
    this.updateDownloadPreview();
  }// グラデーション作成
  createGradient(ctx, size) {
    let gradient;
    const startColor = this.elements.gradientStart?.value || '#000000';
    const endColor = this.elements.gradientEnd?.value || '#333333';
    const direction = this.elements.gradientDirection?.value || 'horizontal';
    
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
        gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        // 放射状逆方向の場合は色の順序を逆にする
        gradient.addColorStop(0, endColor);
        gradient.addColorStop(1, startColor);
        return gradient;
      default:
        gradient = ctx.createLinearGradient(0, 0, size, 0);
        break;
    }
    
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    
    return gradient;
  }

  // クリエイティブモジュール描画
  drawCreativeModule(ctx, x, y, size) {
    ctx.save();
    
    switch (this.currentShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2 * 0.8, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'rounded':
        this.drawRoundedRect(ctx, x, y, size, size, size * 0.2);
        break;
        
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x + size/2, y);
        ctx.lineTo(x + size, y + size/2);
        ctx.lineTo(x + size/2, y + size);
        ctx.lineTo(x, y + size/2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'star':
        this.drawStar(ctx, x + size/2, y + size/2, size/2 * 0.4, size/2 * 0.8, 5);
        break;
        
      case 'hexagon':
        this.drawPolygon(ctx, x + size/2, y + size/2, size/2 * 0.8, 6);
        break;
        
      default: // square
        ctx.fillRect(x, y, size, size);
        break;
    }
    
    ctx.restore();
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

  // 星形描画
  drawStar(ctx, cx, cy, innerRadius, outerRadius, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  // 多角形描画
  drawPolygon(ctx, cx, cy, radius, sides) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }  // 検出パターン描画
  drawDetectionPatterns(ctx, moduleCount, moduleSize) {
    // 検出パターンの色を決定
    let patternFillStyle;
    const detectionMode = this.elements.detectionColorMode?.value || 'same';
    
    if (detectionMode === 'custom') {
      patternFillStyle = this.elements.detectionColor?.value || '#000000';
    } else {
      // データ部と同じ色を使用（グラデーションも含む）
      if (this.currentColorMode === 'gradient') {
        // 検出パターン用のグラデーションを作成
        patternFillStyle = this.createGradient(ctx, moduleCount * moduleSize);
      } else {
        patternFillStyle = this.elements.foregroundColor?.value || '#000000';
      }
    }
    
    // 検出パターンの形状を取得
    const detectionShape = this.elements.detectionShape?.value || 'square';
    
    // 検出パターンの位置
    const positions = [
      [0, 0], // 左上
      [moduleCount - 7, 0], // 右上
      [0, moduleCount - 7] // 左下
    ];
    
    positions.forEach(([startX, startY]) => {
      this.drawSingleDetectionPattern(ctx, startX, startY, moduleSize, patternFillStyle, detectionShape);
    });
    
    console.log('✅ 検出パターン描画完了 - 色:', typeof patternFillStyle === 'string' ? patternFillStyle : 'グラデーション', '形状:', detectionShape);
  }
  // 単一の検出パターンを描画
  drawSingleDetectionPattern(ctx, startX, startY, moduleSize, fillStyle, shape) {
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    
    console.log(`🎯 検出パターン描画: 位置(${startX}, ${startY}), 形状: ${shape}`);
    
    // 外側の四角形 (7x7)
    ctx.fillStyle = fillStyle;
    this.drawDetectionShape(ctx, startX * moduleSize, startY * moduleSize, 7 * moduleSize, shape);
    
    // 内側の白い四角形 (5x5)
    ctx.fillStyle = bgColor;
    this.drawDetectionShape(ctx, (startX + 1) * moduleSize, (startY + 1) * moduleSize, 5 * moduleSize, shape);
    
    // 中心の黒い四角形 (3x3)
    ctx.fillStyle = fillStyle;
    this.drawDetectionShape(ctx, (startX + 2) * moduleSize, (startY + 2) * moduleSize, 3 * moduleSize, shape);
  }
  // 検出パターンの形状を描画
  drawDetectionShape(ctx, x, y, size, shape) {
    switch (shape) {
      case 'rounded':
        this.drawRoundedRect(ctx, x, y, size, size, size * 0.15);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
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
    
    const borderWidth = parseInt(this.elements.borderWidth?.value) || 2;
    const borderColor = this.elements.borderColor?.value || '#000000';
    
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(0, 0, qrSize, qrSize);
    
    console.log('✅ 外枠描画完了 - 太さ:', borderWidth, '色:', borderColor);  }
  
  // ダウンロード機能
  downloadQR() {
    if (!this.currentCreativeCanvas) {
      console.error('❌ ダウンロード対象のキャンバスが見つかりません');
      return;
    }
    
    // 余白を追加したキャンバスを作成
    const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);
    
    // 角丸処理を適用
    const finalCanvas = this.createRoundedCanvas(canvasWithMargin);
    
    const format = this.elements.downloadFormat?.value || 'png';
    let filename = 'qr-code';
    let dataURL;
    
    switch (format) {
      case 'png':
        dataURL = finalCanvas.toDataURL('image/png');
        filename += '.png';
        break;      case 'jpeg':
        const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
        dataURL = finalCanvas.toDataURL('image/jpeg', quality);
        filename += '.jpg';
        break;
      case 'webp':
        dataURL = finalCanvas.toDataURL('image/webp', 0.9);
        filename += '.webp';
        break;
    }
    
    this.downloadDataURL(dataURL, filename);
  }
  // 余白付きキャンバスを作成
  createCanvasWithMargin(originalCanvas) {
    console.log('📏 余白付きキャンバス作成開始');
    
    // QRコードの推奨余白は各辺に4モジュール分 + 外枠の太さ
    const qrSize = originalCanvas.width;
    const moduleCount = this.qrData ? this.qrData.getModuleCount() : 25; // fallback
    const moduleSize = Math.floor(qrSize / moduleCount);
    const baseMargin = moduleSize * 4; // 4モジュール分の基本余白
    const borderWidth = this.elements.borderEnabled?.checked ? (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    const margin = baseMargin + borderWidth; // 基本余白 + 外枠の太さ
    
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
    
    // 外枠を余白の外側に描画（角丸が無効な場合のみ）
    if (!this.elements.imageRounded?.checked) {
      this.drawBorderOnMarginCanvas(ctx, newSize, margin);
    }
    
    console.log(`✅ 余白付きキャンバス作成完了: ${qrSize}x${qrSize} → ${newSize}x${newSize} (余白: ${margin}px)`);
    
    return newCanvas;
  }
  // 余白付きキャンバスに外枠を描画
  drawBorderOnMarginCanvas(ctx, totalSize, margin) {
    if (!this.elements.borderEnabled?.checked) return;
    
    const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
    const borderStyle = this.getBorderGradient(ctx, totalSize);
    
    if (!borderStyle) return;
    
    console.log(`🖼️ 外枠描画: 太さ${borderWidth}px`);
    
    ctx.strokeStyle = borderStyle;
    ctx.lineWidth = borderWidth;
    
    // 外枠は全体の外周に描画
    const halfWidth = borderWidth / 2;
    ctx.strokeRect(halfWidth, halfWidth, totalSize - borderWidth, totalSize - borderWidth);
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
  // 全フォーマットダウンロード
  downloadAllFormats() {
    if (!this.currentCreativeCanvas) return;
    
    const formats = [
      { format: 'png', ext: 'png' },
      { format: 'jpeg', ext: 'jpg' },
      { format: 'webp', ext: 'webp' }
    ];
      // 余白を追加したキャンバスを作成
    const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);
    
    // 角丸処理を適用
    const finalCanvas = this.createRoundedCanvas(canvasWithMargin);
    
    formats.forEach(({format, ext}, index) => {
      setTimeout(() => {
        let dataURL;
        if (format === 'jpeg') {
          const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
          dataURL = finalCanvas.toDataURL(`image/${format}`, quality);
        } else {
          dataURL = finalCanvas.toDataURL(`image/${format}`, 0.9);
        }
        this.downloadDataURL(dataURL, `qr-code.${ext}`);
      }, 100 * index);
    });  }

  // SVGダウンロード
  downloadCreativeSVG() {
    if (!this.qrData) return;
    
    const originalSize = parseInt(this.elements.qrSize?.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = originalSize / moduleCount;
    
    // 余白を追加（4モジュール分 + 外枠の太さ）
    const baseMargin = moduleSize * 4;
    const borderWidth = this.elements.borderEnabled?.checked ? (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    const margin = baseMargin + borderWidth;
    const totalSize = originalSize + (margin * 2);
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">`;
    
    // 背景
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    svg += `<rect width="${totalSize}" height="${totalSize}" fill="${bgColor}"/>`;

    // グラデーション定義
    if (this.currentColorMode === 'gradient') {
      const startColor = this.elements.gradientStart?.value || '#000000';
      const endColor = this.elements.gradientEnd?.value || '#333333';
      const direction = this.elements.gradientDirection?.value || 'horizontal';
      
      if (direction === 'radial' || direction === 'radial-reverse') {
        svg += `<defs><radialGradient id="qrGrad" cx="50%" cy="50%" r="50%">`;
        // 放射状逆方向の場合は色の順序を逆にする
        if (direction === 'radial-reverse') {
          svg += `<stop offset="0%" style="stop-color:${endColor}"/>`;
          svg += `<stop offset="100%" style="stop-color:${startColor}"/>`;
        } else {
          svg += `<stop offset="0%" style="stop-color:${startColor}"/>`;
          svg += `<stop offset="100%" style="stop-color:${endColor}"/>`;
        }
        svg += `</radialGradient></defs>`;
      } else {
        // 線形グラデーションの方向設定
        let gradientAttrs;
        switch (direction) {
          case 'horizontal':
            gradientAttrs = 'x1="0%" y1="0%" x2="100%" y2="0%"';
            break;
          case 'horizontal-reverse':
            gradientAttrs = 'x1="100%" y1="0%" x2="0%" y2="0%"';
            break;
          case 'vertical':
            gradientAttrs = 'x1="0%" y1="0%" x2="0%" y2="100%"';
            break;
          case 'vertical-reverse':
            gradientAttrs = 'x1="0%" y1="100%" x2="0%" y2="0%"';
            break;
          case 'diagonal':
            gradientAttrs = 'x1="0%" y1="0%" x2="100%" y2="100%"';
            break;
          case 'diagonal-reverse':
            gradientAttrs = 'x1="100%" y1="0%" x2="0%" y2="100%"';
            break;
          default:
            gradientAttrs = 'x1="0%" y1="0%" x2="100%" y2="0%"';
            break;
        }
        svg += `<defs><linearGradient id="qrGrad" ${gradientAttrs}>`;
        svg += `<stop offset="0%" style="stop-color:${startColor}"/>`;
        svg += `<stop offset="100%" style="stop-color:${endColor}"/>`;
        svg += `</linearGradient></defs>`;
      }
    }
      const fillColor = this.currentColorMode === 'gradient' ? 'url(#qrGrad)' : (this.elements.foregroundColor?.value || '#000000');
    
    // 角丸クリップの定義と開始（角丸が有効な場合）
    svg += this.getSVGRoundedClip(totalSize);
    
    // 検出パターンの位置を計算
    const detectionPatterns = this.getDetectionPatterns(moduleCount);
    
    // QRモジュール描画（データ部のみ、検出パターンを除く）
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col) && !this.isDetectionPattern(row, col, detectionPatterns)) {
          const x = col * moduleSize + margin; // 余白分オフセット
          const y = row * moduleSize + margin; // 余白分オフセット
          
          svg += this.getSVGModule(x, y, moduleSize, fillColor);
        }
      }
    }
    
    // 検出パターンをSVGで描画（余白付き）
    svg += this.getSVGDetectionPatterns(moduleCount, moduleSize, bgColor, margin);
    
    // 外枠をSVGで描画（余白付き）- 角丸対応
    svg += this.getSVGBorder(originalSize, margin, totalSize);
    
    // 角丸クリップの終了
    svg += this.getSVGRoundedClipEnd();
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    this.downloadDataURL(url, 'qr-code.svg');
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
  // SVGモジュール取得
  getSVGModule(x, y, size, fillColor) {
    switch (this.currentShape) {
      case 'circle':
        const r = size * 0.4;
        return `<circle cx="${x + size/2}" cy="${y + size/2}" r="${r}" fill="${fillColor}"/>`;
      case 'rounded':
        const radius = size * 0.2;
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="${fillColor}"/>`;
      default:
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fillColor}"/>`;
    }
  }  // SVG検出パターン生成
  getSVGDetectionPatterns(moduleCount, moduleSize, bgColor, margin = 0) {
    // 検出パターンの色を決定
    let patternColor;
    const detectionMode = this.elements.detectionColorMode?.value || 'same';
    
    if (detectionMode === 'custom') {
      patternColor = this.elements.detectionColor?.value || '#000000';
    } else {
      // データ部と同じ色を使用
      if (this.currentColorMode === 'gradient') {
        // SVGでグラデーションを使用
        patternColor = 'url(#qrGrad)';
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
    
    let svg = '';
    positions.forEach(([startX, startY]) => {
      svg += this.getSVGSingleDetectionPattern(startX, startY, moduleSize, patternColor, bgColor, detectionShape, margin);
    });
    
    return svg;
  }
  // SVG単一検出パターン生成
  getSVGSingleDetectionPattern(startX, startY, moduleSize, fillColor, bgColor, shape, margin = 0) {
    const x = startX * moduleSize + margin;
    const y = startY * moduleSize + margin;
    const size7 = 7 * moduleSize;
    const size5 = 5 * moduleSize;
    const size3 = 3 * moduleSize;
    
    let svg = '';
    
    // 外側 (7x7)
    svg += this.getSVGDetectionShape(x, y, size7, fillColor, shape);
    // 内側 (5x5)
    svg += this.getSVGDetectionShape(x + moduleSize, y + moduleSize, size5, bgColor, shape);
    // 中心 (3x3)
    svg += this.getSVGDetectionShape(x + 2 * moduleSize, y + 2 * moduleSize, size3, fillColor, shape);
    
    return svg;
  }

  // SVG検出パターン形状生成
  getSVGDetectionShape(x, y, size, fill, shape) {
    switch (shape) {
      case 'rounded':
        const radius = size * 0.15;
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="${fill}"/>`;
      case 'circle':
        const r = size / 2;
        return `<circle cx="${x + r}" cy="${y + r}" r="${r}" fill="${fill}"/>`;
      default: // square
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
    }
  }  // SVG外枠生成
  getSVGBorder(originalSize, margin = 0) {
    if (!this.elements.borderEnabled?.checked) return '';
    
    const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
    const isCustom = this.elements.borderColorCustom?.checked;
    
    let strokeColor;
    if (isCustom) {
      strokeColor = this.elements.borderColor?.value || '#000000';
    } else {
      // データ部と同じ色/グラデーション
      if (this.currentColorMode === 'gradient') {
        strokeColor = 'url(#qrGrad)'; // SVGのグラデーション参照
      } else {
        strokeColor = this.elements.foregroundColor?.value || '#000000';
      }
    }
    
    const totalSize = originalSize + (margin * 2);
    const halfWidth = borderWidth / 2;
    
    // 外枠は全体の外周に描画
    return `<rect x="${halfWidth}" y="${halfWidth}" width="${totalSize - borderWidth}" height="${totalSize - borderWidth}" fill="none" stroke="${strokeColor}" stroke-width="${borderWidth}"/>`;  }
  
  // PNGダウンロード（クリエイティブ専用）
  downloadCreativePNG() {
    if (!this.currentCreativeCanvas) return;
    
    // 余白を追加したキャンバスを作成
    const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);
    
    // 角丸処理を適用
    const finalCanvas = this.createRoundedCanvas(canvasWithMargin);
    const dataURL = finalCanvas.toDataURL('image/png');
    this.downloadDataURL(dataURL, 'qr-code-creative.png');
  }

  // ダウンロードフォーマットUI更新
  updateDownloadFormatUI() {
    const format = this.elements.downloadFormat?.value;
    if (this.elements.jpegQualityDiv) {
      this.elements.jpegQualityDiv.classList.toggle('hidden', format !== 'jpeg');
    }
  }

  // モード切り替え
  switchMode(mode) {
    this.currentMode = mode;
    console.log('モード切り替え:', mode);
    
    // ボタンのスタイル更新
    this.elements.modeBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // セクションの表示切替
    if (this.elements.singleGenerationSection) {
      this.elements.singleGenerationSection.classList.toggle('hidden', mode !== 'single');
    }
    if (this.elements.batchGenerationSection) {
      this.elements.batchGenerationSection.classList.toggle('hidden', mode !== 'batch');
    }
    if (this.elements.inputSection) {
      this.elements.inputSection.classList.toggle('hidden', mode !== 'single');
    }
  }

  // テンプレート選択
  selectTemplate(template) {
    this.currentTemplate = template;
    console.log('テンプレート選択:', template);
    
    // ボタンのスタイル更新
    this.elements.templateBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === template);
    });
    
    // 入力フォームの表示切替
    this.elements.templateInputs?.forEach(input => {
      input.classList.add('hidden');
    });
    
    const targetInput = document.getElementById(template + 'Input');
    if (targetInput) {
      targetInput.classList.remove('hidden');
    }
  }

  // デザインモード切り替え
  switchDesignMode(mode) {
    this.designMode = mode;
    console.log('デザインモード切り替え:', mode);
    
    // ボタンのスタイル更新
    if (this.elements.standardModeBtn) {
      this.elements.standardModeBtn.classList.toggle('active', mode === 'standard');
    }
    if (this.elements.creativeModeBtn) {
      this.elements.creativeModeBtn.classList.toggle('active', mode === 'creative');
    }
    
    // セクションの表示/非表示
    if (this.elements.creativeSettingsSection) {
      this.elements.creativeSettingsSection.classList.toggle('hidden', mode === 'standard');
    }
    
    if (this.elements.creativeDownloadSection) {
      this.elements.creativeDownloadSection.classList.toggle('hidden', mode === 'standard');
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

  // カラーモードUI更新
  updateColorModeUI() {
    if (this.elements.gradientSettings) {
      if (this.currentColorMode === 'gradient') {
        this.elements.gradientSettings.classList.remove('hidden');
      } else {
        this.elements.gradientSettings.classList.add('hidden');
      }
    }
  }

  // プリセット適用
  applyPreset(preset) {
    console.log('プリセット適用:', preset);
    
    switch (preset) {
      case 'nature':
        this.currentShape = 'circle';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#10b981';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#3b82f6';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'linear';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
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

  // UI状態更新
  updateUIFromCurrentState() {
    // 形状ボタンの状態更新
    document.querySelectorAll('.shape-btn[data-shape]')?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.shape === this.currentShape);
    });

    // カラーモードボタンの状態更新
    document.querySelectorAll('.color-mode-btn')?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.colorMode === this.currentColorMode);
    });

    // セレクト要素の値更新
    if (this.elements.colorMode) {
      this.elements.colorMode.value = this.currentColorMode;
    }

    // グラデーション設定の表示/非表示
    this.updateColorModeUI();
  }

  // バッチ生成機能
  async processBatchData() {
    if (!this.elements.batchTextData && !this.elements.csvFileInput) return;
    
    let data = [];
    
    // CSVファイルから読み込み
    if (this.elements.csvFileInput?.files?.length > 0) {
      const file = this.elements.csvFileInput.files[0];
      const text = await this.readFileAsText(file);
      data = this.parseCSV(text);
    } 
    // テキストエリアから読み込み
    else if (this.elements.batchTextData?.value?.trim()) {
      const lines = this.elements.batchTextData.value.trim().split('\n');
      data = lines.map(line => ({ content: line.trim() })).filter(item => item.content);
    }
    
    this.batchData = data;
    this.updateBatchPreview();
    
    console.log('📋 バッチデータ処理完了:', data.length, '件');
  }

  // ファイル読み込み
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // CSV解析
  parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values[0]) { // 最初の列が空でない場合のみ
        const item = { content: values[0] };
        // 追加データがあれば含める
        for (let j = 1; j < values.length && j < headers.length; j++) {
          if (values[j]) {
            item[headers[j]] = values[j];
          }
        }
        data.push(item);
      }
    }
    
    return data;
  }

  // バッチプレビュー更新
  updateBatchPreview() {
    if (!this.elements.batchPreviewList || !this.elements.batchCount) return;
    
    this.elements.batchCount.textContent = this.batchData.length;
    
    if (this.batchData.length === 0) {
      this.elements.batchPreviewList.innerHTML = '<p class="text-gray-500">データがありません</p>';
      if (this.elements.generateBatchBtn) {
        this.elements.generateBatchBtn.disabled = true;
      }
      return;
    }
    
    // バッチ生成ボタンを有効化
    if (this.elements.generateBatchBtn) {
      this.elements.generateBatchBtn.disabled = false;
    }
    
    let html = '';
    this.batchData.slice(0, 10).forEach((item, index) => {
      html += `
        <div class="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span class="text-sm truncate flex-1 mr-2">${index + 1}. ${item.content}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">${item.content.length}文字</span>
        </div>
      `;
    });
    
    if (this.batchData.length > 10) {
      html += `<p class="text-sm text-gray-500 text-center p-2">...他${this.batchData.length - 10}件</p>`;
    }
    
    this.elements.batchPreviewList.innerHTML = html;
    
    if (this.elements.batchPreview) {
      this.elements.batchPreview.classList.remove('hidden');
    }
  }

  // バッチ生成実行
  async generateBatch() {
    if (this.batchData.length === 0) {
      alert('バッチデータがありません');
      return;
    }

    // JSZipライブラリの利用可能性をチェック
    if (typeof JSZip === 'undefined') {
      console.error('❌ JSZipライブラリが読み込まれていません');
      alert('バッチ生成機能に必要なライブラリが読み込まれていません。ページを再読み込みしてください。');
      return;
    }
    
    console.log('🔄 バッチ生成開始:', this.batchData.length, '件');
    
    // UI状態更新
    if (this.elements.generateBatchBtn) {
      this.elements.generateBatchBtn.disabled = true;
      this.elements.generateBatchBtn.innerHTML = '生成中...';
    }
    
    if (this.elements.batchProgressContainer) {
      this.elements.batchProgressContainer.classList.remove('hidden');
    }
    
    const zip = new JSZip();
    const size = parseInt(this.elements.qrSize?.value) || 256;
    const errorCorrectionLevel = this.elements.errorCorrection?.value || 'M';
    
    for (let i = 0; i < this.batchData.length; i++) {
      const item = this.batchData[i];
      
      try {
        // QRコード生成
        const qr = qrcode(0, errorCorrectionLevel);
        qr.addData(item.content);
        qr.make();
        
        // キャンバスに描画
        const canvas = this.createQRCanvas(qr, size);
        
        // PNG形式でZIPに追加
        const dataURL = canvas.toDataURL('image/png');
        const base64Data = dataURL.split(',')[1];
        
        const filename = `qr_${i + 1}_${this.sanitizeFilename(item.content.substring(0, 20))}.png`;
        zip.file(filename, base64Data, { base64: true });
        
        // 進捗表示
        if (this.elements.batchProgress) {
          const progress = ((i + 1) / this.batchData.length) * 100;
          this.elements.batchProgress.style.width = `${progress}%`;
        }
        if (this.elements.batchProgressText) {
          this.elements.batchProgressText.textContent = `${i + 1} / ${this.batchData.length}`;
        }
        
        // 描画処理を非同期にして、UIの更新を許可
        await new Promise(resolve => setTimeout(resolve, 10));
        
      } catch (error) {
        console.error(`❌ バッチ生成エラー (${i + 1}):`, error);
      }
    }
    
    try {
      // ZIPファイルをダウンロード
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      this.downloadDataURL(url, `qr-codes-batch-${new Date().toISOString().slice(0, 10)}.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('✅ バッチ生成完了');
      alert(`${this.batchData.length}件のQRコードをZIPファイルでダウンロードしました。`);
    } catch (error) {
      console.error('❌ ZIP生成エラー:', error);
      alert('ZIP ファイルの生成に失敗しました: ' + error.message);
    } finally {
      // UI状態をリセット
      if (this.elements.generateBatchBtn) {
        this.elements.generateBatchBtn.disabled = false;
        this.elements.generateBatchBtn.innerHTML = `
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
          </svg>
          バッチ生成・ダウンロード
        `;
      }
      
      // 進捗をリセット
      setTimeout(() => {
        if (this.elements.batchProgressContainer) {
          this.elements.batchProgressContainer.classList.add('hidden');
        }
        if (this.elements.batchProgress) {
          this.elements.batchProgress.style.width = '0%';
        }
        if (this.elements.batchProgressText) {
          this.elements.batchProgressText.textContent = '0 / 0';
        }
      }, 2000);
    }
  }

  // QRキャンバス作成
  createQRCanvas(qrData, size) {
    const moduleCount = qrData.getModuleCount();
    const moduleSize = Math.floor(size / moduleCount);
    const qrSize = moduleSize * moduleCount;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // 背景
    ctx.fillStyle = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // デザインモードに応じて描画
    if (this.designMode === 'creative') {
      this.drawCreativeQROnCanvas(ctx, qrData, moduleCount, moduleSize, qrSize);
    } else {
      // 標準描画
      ctx.fillStyle = this.elements.foregroundColor?.value || '#000000';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qrData.isDark(row, col)) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }
    
    return canvas;
  }

  // クリエイティブQRをキャンバスに描画
  drawCreativeQROnCanvas(ctx, qrData, moduleCount, moduleSize, qrSize) {
    // フィルスタイルを設定
    let fillStyle = '#000000';
    
    if (this.currentColorMode === 'gradient') {
      const gradient = this.createGradient(ctx, qrSize);
      if (gradient) fillStyle = gradient;
    } else {
      fillStyle = this.elements.foregroundColor?.value || '#000000';
    }
    
    // QRコードセルを描画
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          ctx.fillStyle = fillStyle;
          this.drawCreativeModule(ctx, x, y, moduleSize);
        }
      }
    }
    
    // 検出パターン描画
    this.drawDetectionPatterns(ctx, moduleCount, moduleSize);
  }

  // 外枠の色設定を更新
  updateBorderColorSettings() {
    if (!this.elements.borderColorCustom || !this.elements.customBorderColor) return;
    
    const isCustom = this.elements.borderColorCustom.checked;
    if (isCustom) {
      this.elements.customBorderColor.classList.remove('hidden');
    } else {
      this.elements.customBorderColor.classList.add('hidden');
    }
  }
  // 外枠の色を取得
  getBorderColor() {
    if (!this.elements.borderEnabled?.checked) return null;
    
    const isCustom = this.elements.borderColorCustom?.checked;
    
    if (isCustom) {
      return this.elements.borderColor?.value || '#000000';
    } else {
      // データ部と同じ色
      return this.elements.foregroundColor?.value || '#000000';
    }
  }

  // 外枠のグラデーションを取得（Canvas用）
  getBorderGradient(ctx, size) {
    if (!this.elements.borderEnabled?.checked) return null;
    
    const isCustom = this.elements.borderColorCustom?.checked;
    
    if (isCustom) {
      return this.elements.borderColor?.value || '#000000';
    } else {
      // データ部と同じ色/グラデーション
      if (this.currentColorMode === 'gradient') {
        return this.createGradient(ctx, size);
      } else {
        return this.elements.foregroundColor?.value || '#000000';
      }
    }
  }

  // 保存時プレビューを更新
  updateDownloadPreview() {
    if (!this.currentCreativeCanvas || !this.elements.downloadPreview) return;
    
    console.log('📸 保存時プレビュー更新開始');
      try {
      // 余白付きキャンバスを作成
      const canvasWithMargin = this.createCanvasWithMargin(this.currentCreativeCanvas);
      
      // 角丸処理を適用（実際の保存時と同じ処理）
      const finalCanvas = this.createRoundedCanvas(canvasWithMargin);
      
      // プレビューエリアに表示
      this.elements.downloadPreview.innerHTML = '';
        // プレビュー用にサイズを調整
      const previewCanvas = document.createElement('canvas');
      const previewCtx = previewCanvas.getContext('2d');
      const previewSize = 200; // プレビューサイズ
      
      previewCanvas.width = previewSize;
      previewCanvas.height = previewSize;
      previewCanvas.style.maxWidth = '100%';
      previewCanvas.style.height = 'auto';
      previewCanvas.style.border = '2px solid #e5e7eb';
        // 角丸設定に応じてスタイルを適用
      if (this.elements.imageRounded?.checked) {
        previewCanvas.style.borderRadius = '0.5rem';
      } else {
        previewCanvas.style.borderRadius = '0';
      }
      
      // 縮小して描画（実際の保存時と同じ最終キャンバスを使用）
      previewCtx.drawImage(finalCanvas, 0, 0, previewSize, previewSize);
      
      this.elements.downloadPreview.appendChild(previewCanvas);
      
      // プレビューセクションを表示
      if (this.elements.downloadPreviewSection) {
        this.elements.downloadPreviewSection.classList.remove('hidden');
      }
      
      console.log('✅ 保存時プレビュー更新完了');
    } catch (error) {
      console.error('❌ 保存時プレビュー更新エラー:', error);
    }
  }  // 角丸キャンバスを作成（外枠対応）
  createRoundedCanvas(originalCanvas) {
    if (!this.elements.imageRounded?.checked) {
      return originalCanvas; // 角丸が無効な場合はそのまま返す
    }

    console.log('🔄 角丸キャンバス作成開始');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = originalCanvas.width;
    const borderWidth = this.elements.borderEnabled?.checked ? 
      (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    
    // 角丸半径をカスタム値から取得（デフォルト5%）
    const radiusPercent = parseInt(this.elements.roundedRadius?.value) || 5;
    const baseRadius = (size * radiusPercent) / 100;
    const radius = Math.max(baseRadius, borderWidth + 2); // 最低でも外枠+2px
    
    canvas.width = size;
    canvas.height = size;
    
    // 透明な背景で初期化
    ctx.clearRect(0, 0, size, size);
    
    // 高品質描画設定
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 外枠がある場合は、角丸の外枠を最初に描画
    if (this.elements.borderEnabled?.checked) {
      this.drawRoundedBorder(ctx, size, radius, borderWidth);
    }
    
    // 角丸のクリップパスを作成（外枠の内側）
    ctx.save();
    const contentRadius = Math.max(0, radius - borderWidth);
    this.createRoundedClipPath(ctx, size, contentRadius, borderWidth);
    ctx.clip();
    
    // 元の画像を角丸でクリップして描画
    ctx.drawImage(originalCanvas, 0, 0);
    
    ctx.restore();
    
    console.log(`✅ 角丸キャンバス作成完了: 半径${radius}px(${radiusPercent}%), 外枠${borderWidth}px`);
    return canvas;
  }// SVG角丸クリップ生成（カスタム半径対応）
  getSVGRoundedClip(totalSize) {
    if (!this.elements.imageRounded?.checked) return '';
    
    // 角丸半径をカスタム値から取得（デフォルト5%）
    const radiusPercent = parseInt(this.elements.roundedRadius?.value) || 5;
    const borderWidth = this.elements.borderEnabled?.checked ? 
      (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    
    const baseRadius = (totalSize * radiusPercent) / 100;
    const radius = Math.max(baseRadius, borderWidth + 2);
    
    console.log(`🎯 SVG角丸クリップ生成: 半径${radius}px(${radiusPercent}%)`);
    
    return `
      <defs>
        <clipPath id="roundedClip">
          <rect x="0" y="0" width="${totalSize}" height="${totalSize}" rx="${radius}" ry="${radius}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#roundedClip)">`;
  }

  // SVG角丸終了タグ
  getSVGRoundedClipEnd() {
    if (!this.elements.imageRounded?.checked) return '';
    return '</g>';
  }

  // 角丸処理を適用（ベジェ曲線使用）
  applyRoundedCorners(ctx, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    this.createRoundedPath(ctx, x, y, width, height, radius);
    ctx.clip();
  }

  // 角丸クリップパスを作成（外枠の太さを考慮、ベジェ曲線使用）
  createRoundedClipPath(ctx, size, radius, borderWidth = 0) {
    // 外枠がある場合は、その分だけ内側にクリップパスを作成
    const offset = borderWidth;
    const innerSize = size - (offset * 2);
    const x = offset;
    const y = offset;
    
    // 角丸半径が大きすぎる場合は調整
    const maxRadius = Math.min(innerSize, innerSize) / 2;
    const actualRadius = Math.min(radius, maxRadius);
    
    // ベジェ曲線の制御点計算
    const cp = actualRadius * 0.552284749831;
    
    ctx.beginPath();
    ctx.moveTo(x + actualRadius, y);
    ctx.lineTo(x + innerSize - actualRadius, y);
    ctx.bezierCurveTo(x + innerSize - actualRadius + cp, y, x + innerSize, y + actualRadius - cp, x + innerSize, y + actualRadius);
    ctx.lineTo(x + innerSize, y + innerSize - actualRadius);
    ctx.bezierCurveTo(x + innerSize, y + innerSize - actualRadius + cp, x + innerSize - actualRadius + cp, y + innerSize, x + innerSize - actualRadius, y + innerSize);
    ctx.lineTo(x + actualRadius, y + innerSize);
    ctx.bezierCurveTo(x + actualRadius - cp, y + innerSize, x, y + innerSize - actualRadius + cp, x, y + innerSize - actualRadius);
    ctx.lineTo(x, y + actualRadius);
    ctx.bezierCurveTo(x, y + actualRadius - cp, x + actualRadius - cp, y, x + actualRadius, y);
    ctx.closePath();
  }

  // 角丸の外枠を描画（改良版）
  drawRoundedBorder(ctx, size, radius, borderWidth) {
    const borderStyle = this.getBorderGradient(ctx, size);
    
    if (!borderStyle) return;
    
    console.log(`🖼️ 角丸外枠描画: 太さ${borderWidth}px, 半径${radius}px`);
    
    // 高品質描画設定
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 外枠を塗りつぶしで描画（ストロークより滑らか）
    ctx.fillStyle = borderStyle;
    
    // 外側の角丸パス
    ctx.beginPath();
    this.createRoundedPath(ctx, 0, 0, size, size, radius);
    
    // 内側の角丸パス（くり抜き用）
    const innerRadius = Math.max(0, radius - borderWidth);
    this.createRoundedPath(ctx, borderWidth, borderWidth, 
                          size - borderWidth * 2, size - borderWidth * 2, innerRadius, true);
    
    ctx.fill('evenodd'); // even-odd ルールで内側をくり抜き
  }

  // 角丸パスを作成するヘルパーメソッド（ベジェ曲線使用）
  createRoundedPath(ctx, x, y, width, height, radius, reverse = false) {
    // 角丸半径が大きすぎる場合は調整
    const maxRadius = Math.min(width, height) / 2;
    const actualRadius = Math.min(radius, maxRadius);
    
    // ベジェ曲線の制御点計算（より滑らかな角丸）
    const cp = actualRadius * 0.552284749831; // 1/4円に近い値
    
    if (reverse) {
      // 反時計回り（くり抜き用）
      ctx.moveTo(x + actualRadius, y);
      ctx.bezierCurveTo(x + actualRadius - cp, y, x, y + actualRadius - cp, x, y + actualRadius);
      ctx.lineTo(x, y + height - actualRadius);
      ctx.bezierCurveTo(x, y + height - actualRadius + cp, x + actualRadius - cp, y + height, x + actualRadius, y + height);
      ctx.lineTo(x + width - actualRadius, y + height);
      ctx.bezierCurveTo(x + width - actualRadius + cp, y + height, x + width, y + height - actualRadius + cp, x + width, y + height - actualRadius);
      ctx.lineTo(x + width, y + actualRadius);
      ctx.bezierCurveTo(x + width, y + actualRadius - cp, x + width - actualRadius + cp, y, x + width - actualRadius, y);
      ctx.closePath();
    } else {
      // 時計回り（通常）
      ctx.moveTo(x + actualRadius, y);
      ctx.lineTo(x + width - actualRadius, y);
      ctx.bezierCurveTo(x + width - actualRadius + cp, y, x + width, y + actualRadius - cp, x + width, y + actualRadius);
      ctx.lineTo(x + width, y + height - actualRadius);
      ctx.bezierCurveTo(x + width, y + height - actualRadius + cp, x + width - actualRadius + cp, y + height, x + width - actualRadius, y + height);
      ctx.lineTo(x + actualRadius, y + height);
      ctx.bezierCurveTo(x + actualRadius - cp, y + height, x, y + height - actualRadius + cp, x, y + height - actualRadius);
      ctx.lineTo(x, y + actualRadius);
      ctx.bezierCurveTo(x, y + actualRadius - cp, x + actualRadius - cp, y, x + actualRadius, y);
      ctx.closePath();
    }
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
