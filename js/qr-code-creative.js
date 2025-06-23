class QRGenerator {
  constructor() {
    this.currentTemplate = 'text';
    this.currentMode = 'single';
    this.batchData = [];
    
    // クリエイティブ機能追加
    this.designMode = 'standard'; // 'standard' or 'creative'
    this.currentShape = 'square';
    this.currentColorMode = 'solid';
    this.qrData = null; // SVG生成用
    this.cellCustomizations = new Map();
    this.patternCustomizations = {
      'top-left': { shape: 'square', color: '#000000', size: 1.0 },
      'top-right': { shape: 'square', color: '#000000', size: 1.0 },
      'bottom-left': { shape: 'square', color: '#000000', size: 1.0 }
    };
    
    this.initializeElements();
    this.bindEvents();
    console.log('✅ QRGenerator初期化完了');
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
      creativeOptions: document.getElementById('creativeSettingsSection'), // 新しいID
      shapeBtns: document.querySelectorAll('.shape-btn[data-shape]'),
      colorModeBtns: document.querySelectorAll('.color-mode-btn'),
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
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    });

    // カラーモード
    if (this.elements.colorMode) {
      this.elements.colorMode.addEventListener('change', () => {
        this.currentColorMode = this.elements.colorMode.value;
        this.updateColorModeUI();
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      });
    }

    // グラデーション設定
    [this.elements.gradientStart, this.elements.gradientEnd, this.elements.gradientDirection].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
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
    
    // ボタンスタイル更新
    if (this.elements.standardModeBtn && this.elements.creativeModeBtn) {
      this.elements.standardModeBtn.classList.toggle('active', mode === 'standard');
      this.elements.creativeModeBtn.classList.toggle('active', mode === 'creative');
    }
    
    // クリエイティブ設定セクションの表示切り替え
    if (this.elements.creativeSettingsSection) {
      if (mode === 'creative') {
        this.elements.creativeSettingsSection.classList.remove('hidden');
      } else {
        this.elements.creativeSettingsSection.classList.add('hidden');
      }
    }
    
    // ダウンロードセクションの切り替え
    if (this.elements.creativeDownloadSection) {
      if (mode === 'creative') {
        this.elements.creativeDownloadSection.classList.remove('hidden');
        if (this.elements.downloadBtn) this.elements.downloadBtn.classList.add('hidden');
      } else {
        this.elements.creativeDownloadSection.classList.add('hidden');
        if (this.elements.downloadBtn) this.elements.downloadBtn.classList.remove('hidden');
      }
    }
    
    console.log(`✅ デザインモードを${mode}に切り替えました`);
  }

  updateDownloadFormatUI() {
    const format = this.elements.downloadFormat.value;
    if (format === 'jpeg') {
      this.elements.jpegQualityDiv.classList.remove('hidden');
    } else {
      this.elements.jpegQualityDiv.classList.add('hidden');
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    
    // ボタンスタイル更新
    this.elements.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // セクション表示切り替え
    if (mode === 'single') {
      this.elements.singleGenerationSection.classList.remove('hidden');
      this.elements.batchGenerationSection.classList.add('hidden');
      this.elements.inputSection.classList.remove('hidden');
    } else {
      this.elements.singleGenerationSection.classList.add('hidden');
      this.elements.batchGenerationSection.classList.remove('hidden');
      this.elements.inputSection.classList.add('hidden');
    }
  }

  selectTemplate(template) {
    // ボタンのアクティブ状態更新
    this.elements.templateBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === template);
    });

    // 入力エリアの表示切り替え
    this.elements.templateInputs.forEach(input => {
      input.classList.add('hidden');
    });

    this.currentTemplate = template;
    
    if (template === 'text' || template === 'url') {
      document.getElementById('textInput').classList.remove('hidden');
      if (template === 'url') {
        this.elements.qrText.placeholder = 'https://example.com';
      } else {
        this.elements.qrText.placeholder = 'QRコードにしたいテキストを入力してください';
      }
    } else if (template === 'wifi') {
      document.getElementById('wifiInput').classList.remove('hidden');
    } else if (template === 'email') {
      document.getElementById('emailInput').classList.remove('hidden');
    } else if (template === 'sms') {
      document.getElementById('smsInput').classList.remove('hidden');
    } else if (template === 'phone') {
      document.getElementById('phoneInput').classList.remove('hidden');
    } else if (template === 'vcard') {
      document.getElementById('vcardInput').classList.remove('hidden');
    } else if (template === 'event') {
      document.getElementById('eventInput').classList.remove('hidden');
    } else if (template === 'location') {
      document.getElementById('locationInput').classList.remove('hidden');
    } else if (template === 'social') {
      document.getElementById('socialInput').classList.remove('hidden');
    }
  }

  getQRText() {
    switch (this.currentTemplate) {
      case 'text':
      case 'url':
        return this.elements.qrText.value.trim();
      
      case 'wifi':
        const ssid = this.elements.wifiSSID.value.trim();
        const password = this.elements.wifiPassword.value.trim();
        const security = this.elements.wifiSecurity.value;
        if (!ssid) return '';
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
      
      case 'email':
        const email = this.elements.emailAddress.value.trim();
        const subject = this.elements.emailSubject.value.trim();
        const body = this.elements.emailBody.value.trim();
        if (!email) return '';
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      case 'sms':
        const smsNumber = this.elements.smsNumber.value.trim();
        const smsMessage = this.elements.smsMessage.value.trim();
        if (!smsNumber) return '';
        return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
        
      case 'phone':
        const phoneNumber = this.elements.phoneNumber.value.trim();
        if (!phoneNumber) return '';
        return `tel:${phoneNumber}`;
      
      case 'vcard':
        const vcard = this.generateVCard();
        return vcard;
        
      case 'event':
        const event = this.generateEvent();
        return event;
        
      case 'location':
        const lat = this.elements.locationLat.value.trim();
        const lng = this.elements.locationLng.value.trim();
        const locationName = this.elements.locationName.value.trim();
        if (!lat || !lng) return '';
        return locationName ? 
          `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(locationName)})` :
          `geo:${lat},${lng}`;
          
      case 'social':
        const socialUrl = this.generateSocialUrl();
        return socialUrl;
      
      default:
        return '';
    }
  }

  generateVCard() {
    const name = this.elements.vcardName?.value.trim() || '';
    const org = this.elements.vcardOrg?.value.trim() || '';
    const title = this.elements.vcardTitle?.value.trim() || '';
    const phone = this.elements.vcardPhone?.value.trim() || '';
    const email = this.elements.vcardEmail?.value.trim() || '';
    const url = this.elements.vcardUrl?.value.trim() || '';
    const address = this.elements.vcardAddress?.value.trim() || '';

    if (!name) return '';

    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${name}\n`;
    if (org) vcard += `ORG:${org}\n`;
    if (title) vcard += `TITLE:${title}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (url) vcard += `URL:${url}\n`;
    if (address) vcard += `ADR:;;${address};;;;\n`;
    vcard += 'END:VCARD';

    return vcard;
  }

  generateEvent() {
    const title = this.elements.eventTitle?.value.trim() || '';
    const start = this.elements.eventStart?.value || '';
    const end = this.elements.eventEnd?.value || '';
    const location = this.elements.eventLocation?.value.trim() || '';
    const description = this.elements.eventDescription?.value.trim() || '';

    if (!title || !start) return '';

    const formatDate = (dateStr) => {
      return dateStr.replace(/[-:]/g, '').replace('T', '') + '00Z';
    };

    let vevent = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
    vevent += `SUMMARY:${title}\n`;
    vevent += `DTSTART:${formatDate(start)}\n`;
    if (end) vevent += `DTEND:${formatDate(end)}\n`;
    if (location) vevent += `LOCATION:${location}\n`;
    if (description) vevent += `DESCRIPTION:${description}\n`;
    vevent += 'END:VEVENT\nEND:VCALENDAR';

    return vevent;
  }

  generateSocialUrl() {
    const type = this.elements.socialType?.value || '';
    const username = this.elements.socialUsername?.value.trim() || '';

    if (!username) return '';

    switch (type) {
      case 'twitter':
        return `https://twitter.com/${username}`;
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'facebook':
        return `https://facebook.com/${username}`;
      case 'linkedin':
        return `https://linkedin.com/in/${username}`;
      case 'youtube':
        return `https://youtube.com/@${username}`;
      case 'github':
        return `https://github.com/${username}`;
      default:
        return username;
    }
  }

  async generateQR() {
    const text = this.getQRText();
    if (!text) {
      alert('内容を入力してください');
      return;
    }

    // ローディング表示
    this.elements.qrResult.innerHTML = `
      <div class="text-center text-gray-500">
        <svg class="w-8 h-8 mx-auto mb-2 loading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <p>生成中...</p>
      </div>
    `;

    try {
      // クリエイティブモードの場合
      if (this.designMode === 'creative') {
        await this.generateCreativeQR(text);
        return;
      }

      // 標準モードの場合（既存のロジック）
      const options = {
        width: parseInt(this.elements.qrSize.value),
        height: parseInt(this.elements.qrSize.value),
        color: {
          dark: this.elements.foregroundColor.value,
          light: this.elements.backgroundColor.value
        },
        errorCorrectionLevel: this.elements.errorCorrection.value
      };

      // QRコード生成
      if (typeof QRCode !== 'undefined') {
        console.log('QRCode（既存形式）での生成を試行...');
        
        // 一時的なコンテナを作成
        const tempContainer = document.createElement('div');
        tempContainer.style.width = options.width + 'px';
        tempContainer.style.height = options.height + 'px';
        
        try {
          // QRCode インスタンスを作成
          const qrcode = new QRCode(tempContainer, {
            text: text,
            width: options.width,
            height: options.height,
            colorDark: options.color.dark,
            colorLight: options.color.light,
            correctLevel: QRCode.CorrectLevel[options.errorCorrectionLevel] || QRCode.CorrectLevel.M
          });
          
          // 生成されたQRコードを取得
          setTimeout(() => {
            const qrImg = tempContainer.querySelector('img');
            const qrCanvas = tempContainer.querySelector('canvas');
            
            if (qrImg) {
              console.log('✅ QRコード生成成功（img要素）');
              this.elements.qrResult.innerHTML = '';
              const clonedImg = qrImg.cloneNode(true);
              clonedImg.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
              this.elements.qrResult.appendChild(clonedImg);
              
              // imgからcanvasを作成
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = options.width;
              canvas.height = options.height;
              
              clonedImg.onload = () => {
                ctx.drawImage(clonedImg, 0, 0);
                this.currentQRCanvas = canvas;
                this.elements.downloadBtn.classList.remove('hidden');
                this.elements.downloadAllBtn.classList.remove('hidden');
              };
            } else if (qrCanvas) {
              console.log('✅ QRコード生成成功（canvas要素）');
              this.elements.qrResult.innerHTML = '';
              const clonedCanvas = qrCanvas.cloneNode(true);
              clonedCanvas.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
              this.elements.qrResult.appendChild(clonedCanvas);
              
              this.currentQRCanvas = clonedCanvas;
              this.elements.downloadBtn.classList.remove('hidden');
              this.elements.downloadAllBtn.classList.remove('hidden');
            } else {
              throw new Error('QRコード要素が見つかりません');
            }
          }, 100);
          
        } catch (error) {
          console.error('QRCode生成エラー:', error);
          throw error;
        }
      } else {
        throw new Error('QRライブラリが利用できません');
      }

    } catch (error) {
      console.error('QR生成エラー:', error);
      this.elements.qrResult.innerHTML = `
        <div class="text-center text-red-500">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>QRコード生成に失敗しました</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
  }

  displayQRFromDataURL(dataURL, options) {
    this.elements.qrResult.innerHTML = '';
    const img = document.createElement('img');
    img.src = dataURL;
    img.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
    img.alt = 'Generated QR Code';
    this.elements.qrResult.appendChild(img);

    // ダウンロード用にcanvasを作成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = options.width;
    canvas.height = options.height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      this.currentQRCanvas = canvas;
      this.elements.downloadBtn.classList.remove('hidden');
      this.elements.downloadAllBtn.classList.remove('hidden');
    };
  }

  downloadQR() {
    if (!this.currentQRCanvas) {
      alert('まずQRコードを生成してください');
      return;
    }

    const format = this.elements.downloadFormat.value;
    const filename = `qrcode_${Date.now()}`;

    if (format === 'png') {
      this.downloadCanvas(this.currentQRCanvas, filename + '.png', 'image/png');
    } else if (format === 'jpeg') {
      const quality = parseFloat(this.elements.jpegQuality.value);
      this.downloadCanvas(this.currentQRCanvas, filename + '.jpg', 'image/jpeg', quality);
    } else if (format === 'svg') {
      // SVG形式でのダウンロード（簡易版）
      this.downloadSVG(filename + '.svg');
    }
  }

  downloadCanvas(canvas, filename, mimeType, quality = 1.0) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  downloadSVG(filename) {
    // 簡易SVG生成（実際のQRコードデータが必要）
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" fill="black">SVG QR Code</text>
      </svg>
    `;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadAllFormats() {
    if (!this.currentQRCanvas) {
      alert('まずQRコードを生成してください');
      return;
    }

    const timestamp = Date.now();
    
    // PNG
    this.downloadCanvas(this.currentQRCanvas, `qrcode_${timestamp}.png`, 'image/png');
    
    // JPEG
    setTimeout(() => {
      this.downloadCanvas(this.currentQRCanvas, `qrcode_${timestamp}.jpg`, 'image/jpeg', 0.9);
    }, 500);
    
    // SVG
    setTimeout(() => {
      this.downloadSVG(`qrcode_${timestamp}.svg`);
    }, 1000);
  }

  // バッチ生成関連メソッド
  handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      this.parseBatchData(csv);
    };
    reader.readAsText(file);
  }

  parseBatchData(data) {
    const lines = data.split('\n').filter(line => line.trim());
    this.batchData = lines.map(line => {
      const parts = line.split(',');
      return {
        text: parts[0]?.trim() || '',
        filename: parts[1]?.trim() || `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }).filter(item => item.text);

    this.updateBatchPreview();
  }

  updateBatchPreview() {
    const textData = this.elements.batchTextData.value.trim();
    if (textData) {
      const lines = textData.split('\n').filter(line => line.trim());
      this.batchData = lines.map((line, index) => ({
        text: line.trim(),
        filename: `qr_${Date.now()}_${index + 1}`
      }));
    }

    this.elements.batchCount.textContent = this.batchData.length;
    
    if (this.batchData.length > 0) {
      this.elements.batchPreview.classList.remove('hidden');
      this.elements.batchPreviewList.innerHTML = this.batchData
        .slice(0, 5)
        .map(item => `<div class="text-xs p-1 border-b">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</div>`)
        .join('');
      
      if (this.batchData.length > 5) {
        this.elements.batchPreviewList.innerHTML += `<div class="text-xs p-1 text-gray-500">...他 ${this.batchData.length - 5} 件</div>`;
      }
      
      this.elements.generateBatchBtn.disabled = false;
    } else {
      this.elements.batchPreview.classList.add('hidden');
      this.elements.generateBatchBtn.disabled = true;
    }
  }

  async generateBatchQR() {
    if (this.batchData.length === 0) {
      alert('バッチデータを入力してください');
      return;
    }

    const zip = new JSZip();
    const options = {
      width: parseInt(this.elements.qrSize.value),
      height: parseInt(this.elements.qrSize.value),
      color: {
        dark: this.elements.foregroundColor.value,
        light: this.elements.backgroundColor.value
      },
      errorCorrectionLevel: this.elements.errorCorrection.value
    };

    // プログレス表示
    this.elements.generateBatchBtn.textContent = '生成中...';
    this.elements.generateBatchBtn.disabled = true;

    try {
      for (let i = 0; i < this.batchData.length; i++) {
        const item = this.batchData[i];
        const canvas = await this.generateQRCanvas(item.text, options);
        
        if (canvas) {
          // PNG形式でZIPに追加
          const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
          });
          
          zip.file(`${item.filename}.png`, blob);
        }
        
        // プログレス更新
        this.elements.generateBatchBtn.textContent = `生成中... (${i + 1}/${this.batchData.length})`;
      }

      // ZIPファイル生成・ダウンロード
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcodes_batch_${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('バッチ生成エラー:', error);
      alert('バッチ生成中にエラーが発生しました');
    } finally {
      this.elements.generateBatchBtn.textContent = 'バッチ生成・ダウンロード';
      this.elements.generateBatchBtn.disabled = false;
    }
  }

  generateQRCanvas(text, options) {
    return new Promise((resolve, reject) => {
      try {
        const tempContainer = document.createElement('div');
        const qrcode = new QRCode(tempContainer, {
          text: text,
          width: options.width,
          height: options.height,
          colorDark: options.color.dark,
          colorLight: options.color.light,
          correctLevel: QRCode.CorrectLevel[options.errorCorrectionLevel] || QRCode.CorrectLevel.M
        });

        setTimeout(() => {
          const canvas = tempContainer.querySelector('canvas');
          const img = tempContainer.querySelector('img');
          
          if (canvas) {
            resolve(canvas);
          } else if (img) {
            // imgからcanvasを作成
            const newCanvas = document.createElement('canvas');
            const ctx = newCanvas.getContext('2d');
            newCanvas.width = options.width;
            newCanvas.height = options.height;
            
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              resolve(newCanvas);
            };
            img.onerror = () => reject(new Error('画像読み込み失敗'));
          } else {
            reject(new Error('QRコード生成失敗'));
          }
        }, 100);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // クリエイティブ機能のスタブメソッド
  async generateCreativeQR(text) {
    // クリエイティブQR生成機能は将来的に実装
    console.log('クリエイティブQR生成（未実装）:', text);
    this.elements.qrResult.innerHTML = `
      <div class="text-center text-blue-500">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>クリエイティブモード</p>
        <p class="text-sm mt-2">この機能は開発中です</p>
      </div>
    `;
  }

  renderCreativeQR() {
    console.log('クリエイティブQR再描画（未実装）');
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
  }

  updatePatternColor() {
    console.log('パターン色更新');
  }

  applyPreset(preset) {
    console.log('プリセット適用:', preset);
  }

  downloadCreativeSVG() {
    console.log('クリエイティブSVGダウンロード（未実装）');
  }

  downloadCreativePNG() {
    console.log('クリエイティブPNGダウンロード（未実装）');
  }
}
