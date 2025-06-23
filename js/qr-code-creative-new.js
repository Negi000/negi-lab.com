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
        var ssid = this.elements.wifiSSID.value.trim();
        var password = this.elements.wifiPassword.value.trim();
        var security = this.elements.wifiSecurity.value;
        if (!ssid) return '';
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
      
      case 'email':
        var email = this.elements.emailAddress.value.trim();
        var subject = this.elements.emailSubject.value.trim();
        var body = this.elements.emailBody.value.trim();
        if (!email) return '';
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      case 'sms':
        var smsNumber = this.elements.smsNumber.value.trim();
        var smsMessage = this.elements.smsMessage.value.trim();
        if (!smsNumber) return '';
        return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
        
      case 'phone':
        var phoneNumber = this.elements.phoneNumber.value.trim();
        if (!phoneNumber) return '';
        return `tel:${phoneNumber}`;
      
      case 'vcard':
        return this.generateVCard();
        
      case 'event':
        return this.generateEvent();
        
      case 'location':
        var lat = this.elements.locationLat.value.trim();
        var lng = this.elements.locationLng.value.trim();
        var locationName = this.elements.locationName.value.trim();
        if (!lat || !lng) return '';
        return locationName ? 
          `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(locationName)})` :
          `geo:${lat},${lng}`;
          
      case 'social':
        return this.generateSocialUrl();
      
      default:
        return '';
    }
  }

  generateVCard() {
    var name = this.elements.vcardName?.value.trim() || '';
    var org = this.elements.vcardOrg?.value.trim() || '';
    var title = this.elements.vcardTitle?.value.trim() || '';
    var phone = this.elements.vcardPhone?.value.trim() || '';
    var email = this.elements.vcardEmail?.value.trim() || '';
    var url = this.elements.vcardUrl?.value.trim() || '';
    var address = this.elements.vcardAddress?.value.trim() || '';

    if (!name) return '';

    var vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
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
    var title = this.elements.eventTitle?.value.trim() || '';
    var start = this.elements.eventStart?.value || '';
    var end = this.elements.eventEnd?.value || '';
    var location = this.elements.eventLocation?.value.trim() || '';
    var description = this.elements.eventDescription?.value.trim() || '';

    if (!title || !start) return '';

    var formatDate = function(dateStr) {
      return dateStr.replace(/[-:]/g, '').replace('T', '') + '00Z';
    };

    var vevent = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
    vevent += `SUMMARY:${title}\n`;
    vevent += `DTSTART:${formatDate(start)}\n`;
    if (end) vevent += `DTEND:${formatDate(end)}\n`;
    if (location) vevent += `LOCATION:${location}\n`;
    if (description) vevent += `DESCRIPTION:${description}\n`;
    vevent += 'END:VEVENT\nEND:VCALENDAR';

    return vevent;
  }

  generateSocialUrl() {
    var type = this.elements.socialType?.value || '';
    var username = this.elements.socialUsername?.value.trim() || '';

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
    var text = this.getQRText();
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
      var options = {
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
        var tempContainer = document.createElement('div');
        tempContainer.style.width = options.width + 'px';
        tempContainer.style.height = options.height + 'px';
        
        try {
          // QRCode インスタンスを作成
          var qrcode = new QRCode(tempContainer, {
            text: text,
            width: options.width,
            height: options.height,
            colorDark: options.color.dark,
            colorLight: options.color.light,
            correctLevel: QRCode.CorrectLevel[options.errorCorrectionLevel] || QRCode.CorrectLevel.M
          });
          
          // 生成されたQRコードを取得
          var self = this;
          setTimeout(function() {
            var qrImg = tempContainer.querySelector('img');
            var qrCanvas = tempContainer.querySelector('canvas');
            
            if (qrImg) {
              console.log('✅ QRコード生成成功（img要素）');
              self.elements.qrResult.innerHTML = '';
              var clonedImg = qrImg.cloneNode(true);
              clonedImg.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
              self.elements.qrResult.appendChild(clonedImg);
              
              // imgからcanvasを作成
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              canvas.width = options.width;
              canvas.height = options.height;
              
              clonedImg.onload = function() {
                ctx.drawImage(clonedImg, 0, 0);
                self.currentQRCanvas = canvas;
                self.elements.downloadBtn.classList.remove('hidden');
                self.elements.downloadAllBtn.classList.remove('hidden');
              };
            } else if (qrCanvas) {
              console.log('✅ QRコード生成成功（canvas要素）');
              self.elements.qrResult.innerHTML = '';
              var clonedCanvas = qrCanvas.cloneNode(true);
              clonedCanvas.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
              self.elements.qrResult.appendChild(clonedCanvas);
              
              self.currentQRCanvas = clonedCanvas;
              self.elements.downloadBtn.classList.remove('hidden');
              self.elements.downloadAllBtn.classList.remove('hidden');
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

  // クリエイティブQR生成機能
  async generateCreativeQR(text) {
    try {
      console.log('クリエイティブQR生成開始:', text);
      
      // qrcode-generatorライブラリを使用してQRデータを生成
      var qrData;
      
      if (typeof qrcode !== 'undefined') {
        // qrcode-generatorライブラリを使用
        var errorCorrectionLevel = this.elements.errorCorrection.value;
        var qrType = this.getQRType(text.length, errorCorrectionLevel);
        
        qrData = qrcode(qrType, errorCorrectionLevel);
        qrData.addData(text);
        qrData.make();
        
        console.log('QRコードデータ生成完了（qrcode-generator）');
      } else {
        throw new Error('qrcode-generatorライブラリが利用できません');
      }
      
      this.qrData = qrData;
      await this.renderCreativeQR();
      
      // ダウンロードボタンを表示
      if (this.elements.creativeDownloadSection) {
        this.elements.creativeDownloadSection.classList.remove('hidden');
      }
      
    } catch (error) {
      console.error('クリエイティブQR生成エラー:', error);
      this.elements.qrResult.innerHTML = `
        <div class="text-center text-red-500">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>クリエイティブQR生成に失敗しました</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
  }

  getQRType(textLength, errorLevel) {
    // テキスト長と誤り訂正レベルに基づいて適切なQRタイプを決定
    var capacities = {
      'L': [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858],
      'M': [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666],
      'Q': [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482],
      'H': [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382]
    };
    
    var capacity = capacities[errorLevel] || capacities['M'];
    
    for (var i = 0; i < capacity.length; i++) {
      if (textLength <= capacity[i]) {
        return i + 1; // QRタイプは1から始まる
      }
    }
    
    return 20; // 最大タイプ
  }
  async renderCreativeQR() {
    if (!this.qrData) return;
    
    console.log('クリエイティブQR描画開始');
    console.log('現在の設定:', {
      shape: this.currentShape,
      colorMode: this.currentColorMode,
      gradientStart: this.elements.gradientStart?.value,
      gradientEnd: this.elements.gradientEnd?.value,
      gradientDirection: this.elements.gradientDirection?.value,
      foregroundColor: this.elements.foregroundColor?.value,
      backgroundColor: this.elements.backgroundColor?.value,
      patternColor: this.elements.patternColor?.value
    });
    
    var size = parseInt(this.elements.qrSize.value) || 300;
    var moduleCount = this.qrData.getModuleCount();
    var moduleSize = size / moduleCount;
    
    // SVGを作成
    var svg = this.createCreativeSVG(this.qrData, size, moduleSize, moduleCount);
    
    // 結果を表示
    this.elements.qrResult.innerHTML = '';
    var container = document.createElement('div');
    container.className = 'flex justify-center';
    container.innerHTML = svg;
    this.elements.qrResult.appendChild(container);
    
    // PNG用のcanvasも作成
    this.currentCreativeCanvas = await this.createCreativeCanvas(this.qrData, size, moduleSize, moduleCount);
    
    console.log('✅ クリエイティブQR描画完了');
  }
  createCreativeSVG(qrData, size, moduleSize, moduleCount) {
    var foregroundColor = this.elements.foregroundColor.value || '#000000';
    var backgroundColor = this.elements.backgroundColor.value || '#ffffff';
    
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="max-w-full h-auto mx-auto rounded-lg shadow-md">`;
    
    // 背景
    svg += `<rect width="${size}" height="${size}" fill="${backgroundColor}"/>`;
    
    // グラデーション定義
    if (this.currentColorMode === 'gradient') {
      svg += this.createGradientDefs();
    }
    
    // 描画済みの検出パターン位置を記録
    var finderPatternPositions = [
      {startRow: 0, endRow: 6, startCol: 0, endCol: 6},           // 左上
      {startRow: 0, endRow: 6, startCol: moduleCount-7, endCol: moduleCount-1}, // 右上
      {startRow: moduleCount-7, endRow: moduleCount-1, startCol: 0, endCol: 6}  // 左下
    ];
    
    // 通常のモジュールを描画
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col)) {
          // 検出パターン領域かチェック
          var isInFinderPattern = false;
          for (var p = 0; p < finderPatternPositions.length; p++) {
            var pos = finderPatternPositions[p];
            if (row >= pos.startRow && row <= pos.endRow && 
                col >= pos.startCol && col <= pos.endCol) {
              isInFinderPattern = true;
              break;
            }
          }
          
          var x = col * moduleSize;
          var y = row * moduleSize;
          
          if (isInFinderPattern) {
            // 検出パターンはスキップ（後で別途描画）
            continue;
          } else {
            svg += this.createModuleSVG(x, y, moduleSize, row, col);
          }
        }
      }
    }
    
    // 検出パターンを最後に描画
    finderPatternPositions.forEach(pos => {
      var x = pos.startCol * moduleSize;
      var y = pos.startRow * moduleSize;
      svg += this.createFinderPatternSVG(x, y, moduleSize);
    });
    
    svg += '</svg>';
    return svg;
  }

  createGradientDefs() {
    var startColor = this.elements.gradientStart?.value || '#000000';
    var endColor = this.elements.gradientEnd?.value || '#666666';
    var direction = this.elements.gradientDirection?.value || 'linear';
    
    var gradientDef = '<defs>';
    
    if (direction === 'linear') {
      gradientDef += `
        <linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </linearGradient>
      `;
    } else {
      gradientDef += `
        <radialGradient id="moduleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </radialGradient>
      `;
    }
    
    gradientDef += '</defs>';
    return gradientDef;
  }

  createModuleSVG(x, y, size, row, col) {
    var fill = this.currentColorMode === 'gradient' ? 'url(#moduleGradient)' : (this.elements.foregroundColor.value || '#000000');
    
    switch (this.currentShape) {
      case 'circle':
        var radius = size * 0.4;
        var cx = x + size / 2;
        var cy = y + size / 2;
        return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/>`;
      
      case 'rounded':
        var cornerRadius = size * 0.2;
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${fill}"/>`;
      
      case 'diamond':
        var centerX = x + size / 2;
        var centerY = y + size / 2;
        var halfSize = size * 0.4;
        return `<polygon points="${centerX},${centerY - halfSize} ${centerX + halfSize},${centerY} ${centerX},${centerY + halfSize} ${centerX - halfSize},${centerY}" fill="${fill}"/>`;
      
      case 'dot':
        var dotRadius = size * 0.3;
        var dotCx = x + size / 2;
        var dotCy = y + size / 2;
        return `<circle cx="${dotCx}" cy="${dotCy}" r="${dotRadius}" fill="${fill}"/>`;
      
      default: // square
        return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
    }
  }
  createFinderPatternSVG(x, y, moduleSize) {
    var patternColor = this.elements.patternColor?.value || this.elements.foregroundColor.value || '#000000';
    var backgroundColor = this.elements.backgroundColor.value || '#ffffff';
    var pattern = '';
    
    // 検出パターンを個別のモジュールとして描画
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 7; j++) {
        var shouldFill = this.isFinderPatternModule(i, j);
        if (shouldFill) {
          var moduleX = x + j * moduleSize;
          var moduleY = y + i * moduleSize;
          pattern += `<rect x="${moduleX}" y="${moduleY}" width="${moduleSize}" height="${moduleSize}" fill="${patternColor}"/>`;
        }
      }
    }
    
    return pattern;
  }

  isFinderPatternModule(row, col) {
    // 検出パターンの形状を定義（7x7内での黒いモジュール）
    // 外枠 (0行目、6行目、0列目、6列目)
    if (row === 0 || row === 6 || col === 0 || col === 6) return true;
    // 内側の3x3の中心部分 (2-4行, 2-4列)
    if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
    return false;
  }

  isFinderPattern(row, col, size) {
    // 左上の検出パターン
    if (row >= 0 && row < 7 && col >= 0 && col < 7) return true;
    // 右上の検出パターン
    if (row >= 0 && row < 7 && col >= size - 7 && col < size) return true;
    // 左下の検出パターン
    if (row >= size - 7 && row < size && col >= 0 && col < 7) return true;
    
    return false;
  }  createCreativeCanvas(qrData, size, moduleSize, moduleCount) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // 背景を描画
    ctx.fillStyle = this.elements.backgroundColor.value || '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // 検出パターンの位置を定義
    var finderPatternPositions = [
      {startRow: 0, endRow: 6, startCol: 0, endCol: 6},           // 左上
      {startRow: 0, endRow: 6, startCol: moduleCount-7, endCol: moduleCount-1}, // 右上
      {startRow: moduleCount-7, endRow: moduleCount-1, startCol: 0, endCol: 6}  // 左下
    ];
    
    // モジュール描画用のスタイルを設定
    var self = this;
    function setModuleFillStyle() {
      if (self.currentColorMode === 'gradient') {
        var startColor = self.elements.gradientStart?.value || '#000000';
        var endColor = self.elements.gradientEnd?.value || '#666666';
        var direction = self.elements.gradientDirection?.value || 'linear';
        
        var gradient;
        if (direction === 'linear') {
          gradient = ctx.createLinearGradient(0, 0, size, size);
        } else {
          gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        }
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = self.elements.foregroundColor.value || '#000000';
      }
    }
    
    // 通常のモジュールを描画
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col)) {
          // 検出パターン領域かチェック
          var isInFinderPattern = false;
          for (var p = 0; p < finderPatternPositions.length; p++) {
            var pos = finderPatternPositions[p];
            if (row >= pos.startRow && row <= pos.endRow && 
                col >= pos.startCol && col <= pos.endCol) {
              isInFinderPattern = true;
              break;
            }
          }
          
          var x = col * moduleSize;
          var y = row * moduleSize;
          
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
      var x = pos.startCol * moduleSize;
      var y = pos.startRow * moduleSize;
      self.drawFinderPatternCanvas(ctx, x, y, moduleSize);
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
        var centerX = x + size / 2;
        var centerY = y + size / 2;
        var halfSize = size * 0.4;
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
    var patternColor = this.elements.patternColor?.value || this.elements.foregroundColor.value || '#000000';
    
    ctx.save();
    ctx.fillStyle = patternColor;
    
    // 検出パターンを個別のモジュールとして描画
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 7; j++) {
        var shouldFill = this.isFinderPatternModule(i, j);
        if (shouldFill) {
          var moduleX = x + j * moduleSize;
          var moduleY = y + i * moduleSize;
          ctx.fillRect(moduleX, moduleY, moduleSize, moduleSize);
        }
      }
    }
    
    ctx.restore();
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
  }  applyPreset(preset) {
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
      
      case 'minimal':
        this.currentShape = 'square';
        this.currentColorMode = 'solid';
        if (this.elements.foregroundColor) this.elements.foregroundColor.value = '#000000';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#000000';
        break;
      
      case 'modern':
        this.currentShape = 'rounded';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#667eea';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#764ba2';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'linear';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#667eea';
        break;
      
      case 'playful':
        this.currentShape = 'circle';
        this.currentColorMode = 'gradient';
        if (this.elements.gradientStart) this.elements.gradientStart.value = '#ff9a9e';
        if (this.elements.gradientEnd) this.elements.gradientEnd.value = '#fecfef';
        if (this.elements.gradientDirection) this.elements.gradientDirection.value = 'radial';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#ffffff';
        if (this.elements.patternColor) this.elements.patternColor.value = '#ff9a9e';
        break;
      
      case 'tech':
        this.currentShape = 'square';
        this.currentColorMode = 'solid';
        if (this.elements.foregroundColor) this.elements.foregroundColor.value = '#1f2937';
        if (this.elements.backgroundColor) this.elements.backgroundColor.value = '#f3f4f6';
        if (this.elements.patternColor) this.elements.patternColor.value = '#ef4444';
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
    
    console.log('✅ プリセットUI更新完了:', {
      shape: this.currentShape,
      colorMode: this.currentColorMode
    });
  }

  downloadCreativeSVG() {
    if (!this.qrData) {
      alert('まずQRコードを生成してください');
      return;
    }
    
    var svgElement = this.elements.qrResult.querySelector('svg');
    if (!svgElement) {
      alert('SVGデータが見つかりません');
      return;
    }
    
    var svgData = new XMLSerializer().serializeToString(svgElement);
    var blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement('a');
    link.href = url;
    link.download = `qrcode_creative_${Date.now()}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('✅ クリエイティブSVGダウンロード完了');
  }

  downloadCreativePNG() {
    if (!this.currentCreativeCanvas) {
      alert('まずQRコードを生成してください');
      return;
    }
    
    var self = this;
    this.currentCreativeCanvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = `qrcode_creative_${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('✅ クリエイティブPNGダウンロード完了');
    }, 'image/png');
  }

  // その他の既存メソッド（省略されたもの）
  updateDownloadFormatUI() {
    var format = this.elements.downloadFormat.value;
    if (format === 'jpeg') {
      this.elements.jpegQualityDiv.classList.remove('hidden');
    } else {
      this.elements.jpegQualityDiv.classList.add('hidden');
    }
  }

  downloadQR() {
    if (!this.currentQRCanvas) {
      alert('まずQRコードを生成してください');
      return;
    }

    var format = this.elements.downloadFormat.value;
    var filename = `qrcode_${Date.now()}`;

    if (format === 'png') {
      this.downloadCanvas(this.currentQRCanvas, filename + '.png', 'image/png');
    } else if (format === 'jpeg') {
      var quality = parseFloat(this.elements.jpegQuality.value);
      this.downloadCanvas(this.currentQRCanvas, filename + '.jpg', 'image/jpeg', quality);
    } else if (format === 'svg') {
      this.downloadSVG(filename + '.svg');
    }
  }

  downloadCanvas(canvas, filename, mimeType, quality) {
    quality = quality || 1.0;
    var self = this;
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  downloadSVG(filename) {
    var svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" fill="black">SVG QR Code</text>
      </svg>
    `;
    
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
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

    var timestamp = Date.now();
    
    // PNG
    this.downloadCanvas(this.currentQRCanvas, `qrcode_${timestamp}.png`, 'image/png');
    
    // JPEG
    var self = this;
    setTimeout(function() {
      self.downloadCanvas(self.currentQRCanvas, `qrcode_${timestamp}.jpg`, 'image/jpeg', 0.9);
    }, 500);
    
    // SVG
    setTimeout(function() {
      self.downloadSVG(`qrcode_${timestamp}.svg`);
    }, 1000);
  }

  // バッチ生成関連（省略）
  handleCSVUpload(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    var self = this;
    reader.onload = function(e) {
      var csv = e.target.result;
      self.parseBatchData(csv);
    };
    reader.readAsText(file);
  }

  parseBatchData(data) {
    var lines = data.split('\n').filter(function(line) { return line.trim(); });
    this.batchData = lines.map(function(line) {
      var parts = line.split(',');
      return {
        text: parts[0]?.trim() || '',
        filename: parts[1]?.trim() || `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }).filter(function(item) { return item.text; });

    this.updateBatchPreview();
  }

  updateBatchPreview() {
    var textData = this.elements.batchTextData.value.trim();
    if (textData) {
      var lines = textData.split('\n').filter(function(line) { return line.trim(); });
      this.batchData = lines.map(function(line, index) {
        return {
          text: line.trim(),
          filename: `qr_${Date.now()}_${index + 1}`
        };
      });
    }

    this.elements.batchCount.textContent = this.batchData.length;
    
    if (this.batchData.length > 0) {
      this.elements.batchPreview.classList.remove('hidden');
      this.elements.batchPreviewList.innerHTML = this.batchData
        .slice(0, 5)
        .map(function(item) {
          return `<div class="text-xs p-1 border-b">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</div>`;
        })
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

    if (typeof JSZip === 'undefined') {
      alert('JSZipライブラリが読み込まれていません');
      return;
    }

    var zip = new JSZip();
    var options = {
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
      for (var i = 0; i < this.batchData.length; i++) {
        var item = this.batchData[i];
        var canvas = await this.generateQRCanvas(item.text, options);
        
        if (canvas) {
          // PNG形式でZIPに追加
          var blob = await new Promise(function(resolve) {
            canvas.toBlob(resolve, 'image/png');
          });
          
          zip.file(`${item.filename}.png`, blob);
        }
        
        // プログレス更新
        this.elements.generateBatchBtn.textContent = `生成中... (${i + 1}/${this.batchData.length})`;
      }

      // ZIPファイル生成・ダウンロード
      var zipBlob = await zip.generateAsync({ type: 'blob' });
      var url = URL.createObjectURL(zipBlob);
      var link = document.createElement('a');
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
    return new Promise(function(resolve, reject) {
      try {
        var tempContainer = document.createElement('div');
        var qrcode = new QRCode(tempContainer, {
          text: text,
          width: options.width,
          height: options.height,
          colorDark: options.color.dark,
          colorLight: options.color.light,
          correctLevel: QRCode.CorrectLevel[options.errorCorrectionLevel] || QRCode.CorrectLevel.M
        });

        setTimeout(function() {
          var canvas = tempContainer.querySelector('canvas');
          var img = tempContainer.querySelector('img');
          
          if (canvas) {
            resolve(canvas);
          } else if (img) {
            // imgからcanvasを作成
            var newCanvas = document.createElement('canvas');
            var ctx = newCanvas.getContext('2d');
            newCanvas.width = options.width;
            newCanvas.height = options.height;
            
            img.onload = function() {
              ctx.drawImage(img, 0, 0);
              resolve(newCanvas);
            };
            img.onerror = function() { reject(new Error('画像読み込み失敗')); };
          } else {
            reject(new Error('QRコード生成失敗'));
          }
        }, 100);
        
      } catch (error) {
        reject(error);
      }
    });
  }
}

// QRGeneratorの初期化を確実に行う
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded - QRGenerator初期化開始');
  if (typeof window.qrGenerator === 'undefined') {
    window.qrGenerator = new QRGenerator();
    console.log('✅ QRGenerator初期化完了');
  }
});

// ページロード完了後の追加初期化
window.addEventListener('load', function() {
  console.log('Window load - 追加初期化開始');
  if (window.qrGenerator) {
    // デザインモードの初期状態を設定
    window.qrGenerator.switchDesignMode('standard');
    console.log('✅ デザインモード初期化完了');
  }
});
