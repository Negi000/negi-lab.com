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
  }

  safeInitialize() {
    console.log('🔧 QRGenerator.safeInitialize() 開始');
    try {
      this.initializeElements();
      this.bindBasicEvents();
      console.log('✅ QRGenerator基本初期化完了');
    } catch (error) {
      console.error('❌ QRGenerator初期化エラー:', error);
    }
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
      gradientSettings: document.getElementById('gradientSettings'),
      gradientStart: document.getElementById('gradientStart'),
      gradientEnd: document.getElementById('gradientEnd'),
      gradientDirection: document.getElementById('gradientDirection'),
      patternColor: document.getElementById('patternColor'),
      creativeDownloadSection: document.getElementById('creativeDownloadSection'),
      downloadSVG: document.getElementById('downloadSVG'),
      downloadPNG: document.getElementById('downloadPNG'),
      
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
      alert('必要な情報を入力してください');
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
      alert('QRコード生成に失敗しました: ' + error.message);
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
      canvas.style.borderRadius = '0.5rem';
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
        if (this.qrData.isDark(row, col)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          ctx.fillStyle = fillStyle;
          this.drawCreativeModule(ctx, x, y, moduleSize);
        }
      }
    }
    
    // 検出パターンを特別描画（オプション）    this.drawDetectionPatterns(ctx, moduleCount, moduleSize);
    
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
      this.elements.qrResult.appendChild(canvas);
    }
    
    console.log('✅ クリエイティブQR描画完了');
  }

  // グラデーション作成
  createGradient(ctx, size) {
    let gradient;
    const startColor = this.elements.gradientStart?.value || '#000000';
    const endColor = this.elements.gradientEnd?.value || '#333333';
    const direction = this.elements.gradientDirection?.value || 'linear';
    
    if (direction === 'radial') {
      gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    } else {
      gradient = ctx.createLinearGradient(0, 0, size, size);
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
  }

  // 検出パターン描画
  drawDetectionPatterns(ctx, moduleCount, moduleSize) {
    const patternColor = this.elements.patternColor?.value || '#000000';
    
    // 検出パターンの位置
    const positions = [
      [0, 0], // 左上
      [moduleCount - 7, 0], // 右上
      [0, moduleCount - 7] // 左下
    ];
    
    ctx.fillStyle = patternColor;
    
    positions.forEach(([startX, startY]) => {
      // 外側の四角形 (7x7)
      ctx.fillRect(startX * moduleSize, startY * moduleSize, 7 * moduleSize, 7 * moduleSize);
      
      // 内側の白い四角形 (5x5)
      ctx.fillStyle = this.elements.backgroundColor?.value || '#ffffff';
      ctx.fillRect((startX + 1) * moduleSize, (startY + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      
      // 中心の黒い四角形 (3x3)
      ctx.fillStyle = patternColor;
      ctx.fillRect((startX + 2) * moduleSize, (startY + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    });
  }

  // ダウンロード機能
  downloadQR() {
    if (!this.currentCreativeCanvas) {
      console.error('❌ ダウンロード対象のキャンバスが見つかりません');
      return;
    }
    
    const format = this.elements.downloadFormat?.value || 'png';
    let filename = 'qr-code';
    let dataURL;
    
    switch (format) {
      case 'png':
        dataURL = this.currentCreativeCanvas.toDataURL('image/png');
        filename += '.png';
        break;
      case 'jpeg':
        const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
        dataURL = this.currentCreativeCanvas.toDataURL('image/jpeg', quality);
        filename += '.jpg';
        break;
      case 'webp':
        dataURL = this.currentCreativeCanvas.toDataURL('image/webp', 0.9);
        filename += '.webp';
        break;
    }
    
    this.downloadDataURL(dataURL, filename);
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
    
    formats.forEach(({format, ext}, index) => {
      setTimeout(() => {
        let dataURL;
        if (format === 'jpeg') {
          const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
          dataURL = this.currentCreativeCanvas.toDataURL(`image/${format}`, quality);
        } else {
          dataURL = this.currentCreativeCanvas.toDataURL(`image/${format}`, 0.9);
        }
        this.downloadDataURL(dataURL, `qr-code.${ext}`);
      }, 100 * index);
    });
  }

  // SVGダウンロード
  downloadCreativeSVG() {
    if (!this.qrData) return;
    
    const size = parseInt(this.elements.qrSize?.value) || 256;
    const moduleCount = this.qrData.getModuleCount();
    const moduleSize = size / moduleCount;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    
    // 背景
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    svg += `<rect width="${size}" height="${size}" fill="${bgColor}"/>`;
    
    // グラデーション定義
    if (this.currentColorMode === 'gradient') {
      const startColor = this.elements.gradientStart?.value || '#000000';
      const endColor = this.elements.gradientEnd?.value || '#333333';
      const direction = this.elements.gradientDirection?.value || 'linear';
      
      if (direction === 'radial') {
        svg += `<defs><radialGradient id="qrGrad" cx="50%" cy="50%" r="50%">`;
      } else {
        svg += `<defs><linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">`;
      }
      svg += `<stop offset="0%" style="stop-color:${startColor}"/>`;
      svg += `<stop offset="100%" style="stop-color:${endColor}"/>`;
      svg += `</linearGradient></defs>`;
    }
    
    const fillColor = this.currentColorMode === 'gradient' ? 'url(#qrGrad)' : (this.elements.foregroundColor?.value || '#000000');
    
    // QRモジュール描画
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrData.isDark(row, col)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          svg += this.getSVGModule(x, y, moduleSize, fillColor);
        }
      }
    }
    
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
  }

  // PNGダウンロード（クリエイティブ専用）
  downloadCreativePNG() {
    if (!this.currentCreativeCanvas) return;
    
    const dataURL = this.currentCreativeCanvas.toDataURL('image/png');
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

  // ファイル名サニタイズ
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9\-_]/g, '_');
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
