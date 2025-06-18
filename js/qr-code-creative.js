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
          standardModeBtn: document.getElementById('standardModeBtn'),
          creativeModeBtn: document.getElementById('creativeModeBtn'),
          creativeOptions: document.getElementById('creativeOptions'),
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
        this.elements.standardModeBtn.addEventListener('click', () => {
          this.switchDesignMode('standard');
        });
        
        this.elements.creativeModeBtn.addEventListener('click', () => {
          this.switchDesignMode('creative');
        });

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
        this.elements.colorMode.addEventListener('change', () => {
          this.currentColorMode = this.elements.colorMode.value;
          this.updateColorModeUI();
          if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
        });

        // グラデーション設定
        [this.elements.gradientStart, this.elements.gradientEnd, this.elements.gradientDirection].forEach(el => {
          el.addEventListener('change', () => {
            if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
          });
        });

        // 検出パターン
        document.querySelectorAll('.shape-btn[data-pattern-shape]').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.shape-btn[data-pattern-shape]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.updatePatternShape(btn.dataset.patternShape);
          });
        });

        this.elements.patternColor.addEventListener('change', () => {
          this.updatePatternColor();
        });

        // プリセット
        document.querySelectorAll('.preset-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this.applyPreset(btn.dataset.preset);
          });
        });

        // クリエイティブダウンロード
        this.elements.downloadSVG.addEventListener('click', () => this.downloadCreativeSVG());
        this.elements.downloadPNG.addEventListener('click', () => this.downloadCreativePNG());
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
          // QRコード生成（古いQRCode.jsライブラリ形式）
          if (typeof QRCode !== 'undefined') {
            console.log('QRCode（古い形式）での生成を試行...');
            
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
                } else {
                  throw new Error('QRコード要素が見つかりません');
                }
              }, 100); // 少し待ってから要素を取得
              
            } catch (error) {
              console.error('QRCode生成エラー:', error);
              throw error;
            }
          } else {
            // ライブラリの詳細情報をログ出力
            console.log('=== QRライブラリ詳細調査 ===');
            console.log('QRCode:', typeof QRCode !== 'undefined' ? QRCode : 'undefined');
            console.log('qrcode:', typeof qrcode !== 'undefined' ? qrcode : 'undefined');
            console.log('window.QRCode:', window.QRCode);
            console.log('window.qrcode:', window.qrcode);
            
            if (typeof QRCode !== 'undefined') {
              console.log('QRCodeのプロパティ:', Object.keys(QRCode));
              console.log('QRCode.toCanvas:', typeof QRCode.toCanvas);
              console.log('QRCode.toDataURL:', typeof QRCode.toDataURL);
              console.log('QRCode.create:', typeof QRCode.create);
            }
            
            if (typeof qrcode !== 'undefined') {
              console.log('qrcodeのプロパティ:', Object.keys(qrcode));
            }
              // 代替手段：データURLを直接生成
            if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
              console.log('QRCode.toDataURLを試行中...');
              
              // Promise版とコールバック版の両方を試行
              try {
                const dataURL = await QRCode.toDataURL(text, options);
                console.log('✅ QRCode.toDataURL（Promise版）成功');
                this.displayQRFromDataURL(dataURL, options);
              } catch (promiseError) {
                console.log('Promise版失敗、コールバック版を試行:', promiseError);
                QRCode.toDataURL(text, options, (error, dataURL) => {
                  if (error) {
                    console.error('QRCode.toDataURL（コールバック版）エラー:', error);
                    throw error;
                  }
                  console.log('✅ QRCode.toDataURL（コールバック版）成功');
                  this.displayQRFromDataURL(dataURL, options);
                });
              }
            } else if (typeof QRCode !== 'undefined' && QRCode.create) {
              console.log('QRCode.createを試行中...');
              const qr = QRCode.create(text, options);
              console.log('QRCode.create結果:', qr);
              
              // SVGまたは他の形式で表示
              this.elements.qrResult.innerHTML = `
                <div class="text-center text-green-600">
                  <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>QRコード生成完了</p>
                  <p class="text-sm mt-2">QRCode.createメソッドで作成されました</p>
                  <pre class="text-xs mt-4 bg-gray-100 p-2 rounded">${JSON.stringify(qr, null, 2)}</pre>
                </div>
              `;
            } else {
              throw new Error('QRライブラリのAPIが利用できません');
            }
          }

        } catch (error) {
          console.error('❌ QRコード生成エラー:', error);
          this.elements.qrResult.innerHTML = `
            <div class="text-center text-red-500">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p>QRコードの生成に失敗しました</p>
              <p class="text-sm mt-2">${error.message}</p>
            </div>
          `;
        }
      }

      displayQRFromDataURL(dataURL, options) {
        const img = document.createElement('img');
        img.src = dataURL;
        img.className = 'max-w-full h-auto mx-auto rounded-lg shadow-md';
        
        this.elements.qrResult.innerHTML = '';
        this.elements.qrResult.appendChild(img);
        
        // CanvasをDataURLから作成
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
      
      // バッチ生成関連メソッド
      handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvText = e.target.result;
          this.elements.batchTextData.value = csvText;
          this.updateBatchPreview();
        };
        reader.readAsText(file);
      }
      
      updateBatchPreview() {
        const text = this.elements.batchTextData.value.trim();
        if (!text) {
          this.elements.batchPreview.classList.add('hidden');
          this.elements.generateBatchBtn.disabled = true;
          return;
        }
        
        // データ解析
        this.batchData = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map((line, index) => {
            const parts = line.split(',');
            return {
              text: parts[0].trim(),
              filename: parts[1] ? parts[1].trim() : `qr_${index + 1}`,
              index: index + 1
            };
          });
        
        // プレビュー表示
        this.elements.batchCount.textContent = this.batchData.length;
        this.elements.batchPreviewList.innerHTML = this.batchData
          .slice(0, 10) // 最初の10件のみ表示
          .map(item => `<div class="mb-1 p-1 bg-white rounded text-xs">
            ${item.index}. ${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''} 
            <span class="text-gray-500">(${item.filename})</span>
          </div>`).join('');
          
        if (this.batchData.length > 10) {
          this.elements.batchPreviewList.innerHTML += 
            `<div class="text-gray-500 text-xs mt-2">...他 ${this.batchData.length - 10} 件</div>`;
        }
        
        this.elements.batchPreview.classList.remove('hidden');
        this.elements.generateBatchBtn.disabled = this.batchData.length === 0;
      }
      
      async generateBatchQR() {
        if (this.batchData.length === 0) return;
        
        this.elements.generateBatchBtn.disabled = true;
        this.elements.generateBatchBtn.innerHTML = `
          <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          生成中... 0/${this.batchData.length}
        `;
        
        try {
          const generatedQRs = [];
          let successCount = 0;
          
          for (let i = 0; i < this.batchData.length; i++) {
            const item = this.batchData[i];
            
            try {
              // QRコード生成
              const canvas = await this.generateQRCanvas(item.text, {
                width: 256,
                height: 256,
                errorCorrectionLevel: 'M',
                color: { dark: '#000000', light: '#ffffff' }
              });
              
              // Canvas から Data URL を取得
              const dataURL = canvas.toDataURL('image/png');
              
              generatedQRs.push({
                filename: `${item.filename}.png`,
                dataURL: dataURL
              });
              
              successCount++;
              
              // 進捗更新
              this.elements.generateBatchBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                生成中... ${successCount}/${this.batchData.length}
              `;
              
            } catch (error) {
              console.error(`QRコード生成失敗: ${item.text}`, error);
            }
          }
          
          // 個別ダウンロード（ZIPライブラリがない場合の代替手段）
          if (successCount > 0) {
            for (const qr of generatedQRs) {
              const link = document.createElement('a');
              link.download = qr.filename;
              link.href = qr.dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // ダウンロード間隔を設ける
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            this.elements.generateBatchBtn.innerHTML = `
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              完了！${successCount}件生成
            `;
          } else {
            throw new Error('すべての生成に失敗しました');
          }
          
        } catch (error) {
          console.error('バッチ生成エラー:', error);
          this.elements.generateBatchBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            エラーが発生しました
          `;
        }
        
        // 3秒後にボタンをリセット
        setTimeout(() => {
          this.elements.generateBatchBtn.disabled = false;
          this.elements.generateBatchBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            バッチ生成・ダウンロード
          `;
        }, 3000);
      }
      
      // 新しいテンプレート生成メソッド
      generateVCard() {
        const name = this.elements.vcardName.value.trim();
        const org = this.elements.vcardOrg.value.trim();
        const title = this.elements.vcardTitle.value.trim();
        const phone = this.elements.vcardPhone.value.trim();
        const email = this.elements.vcardEmail.value.trim();
        const url = this.elements.vcardUrl.value.trim();
        const address = this.elements.vcardAddress.value.trim();
        
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
        const title = this.elements.eventTitle.value.trim();
        const start = this.elements.eventStart.value;
        const end = this.elements.eventEnd.value;
        const location = this.elements.eventLocation.value.trim();
        const description = this.elements.eventDescription.value.trim();
        
        if (!title || !start) return '';
        
        const formatDate = (dateStr) => {
          return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
        ical += `SUMMARY:${title}\n`;
        ical += `DTSTART:${formatDate(start)}\n`;
        if (end) ical += `DTEND:${formatDate(end)}\n`;
        if (location) ical += `LOCATION:${location}\n`;
        if (description) ical += `DESCRIPTION:${description}\n`;
        ical += 'END:VEVENT\nEND:VCALENDAR';
        
        return ical;
      }
      
      generateSocialUrl() {
        const type = this.elements.socialType.value;
        const username = this.elements.socialUsername.value.trim();
        
        if (!username) return '';
        
        // URLが直接入力された場合
        if (username.startsWith('http')) return username;
        
        // ユーザー名から各SNSのURLを生成
        const cleanUsername = username.replace('@', '');
        const urls = {
          twitter: `https://twitter.com/${cleanUsername}`,
          facebook: `https://facebook.com/${cleanUsername}`,
          instagram: `https://instagram.com/${cleanUsername}`,
          linkedin: `https://linkedin.com/in/${cleanUsername}`,
          youtube: `https://youtube.com/@${cleanUsername}`,
          tiktok: `https://tiktok.com/@${cleanUsername}`,
          line: `https://line.me/ti/p/~${cleanUsername}`,
          custom: username
        };
        
        return urls[type] || username;
      }
      
      // ダウンロード機能強化
      async downloadQR() {
        const canvas = this.elements.qrResult.querySelector('canvas');
        if (!canvas) {
          alert('QRコードを先に生成してください');
          return;
        }
        
        const format = this.elements.downloadFormat.value;
        const filename = `qr_code_${Date.now()}`;
        
        await this.downloadCanvasAs(canvas, filename, format);
      }
      
      async downloadAllFormats() {
        const canvas = this.elements.qrResult.querySelector('canvas');
        if (!canvas) {
          alert('QRコードを先に生成してください');
          return;
        }
        
        const filename = `qr_code_${Date.now()}`;
        const formats = ['png', 'jpeg', 'webp'];
        
        this.elements.downloadAllBtn.disabled = true;
        this.elements.downloadAllBtn.innerHTML = `
          <svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          ダウンロード中...
        `;
        
        for (const format of formats) {
          await this.downloadCanvasAs(canvas, `${filename}_${format}`, format);
          await new Promise(resolve => setTimeout(resolve, 500)); // 間隔を空ける
        }
        
        this.elements.downloadAllBtn.disabled = false;
        this.elements.downloadAllBtn.innerHTML = `
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          全形式DL
        `;
      }
      
      async downloadCanvasAs(canvas, filename, format) {
        let dataURL;
        
        switch (format) {
          case 'png':
            dataURL = canvas.toDataURL('image/png');
            break;
          case 'jpeg':
            const quality = parseFloat(this.elements.jpegQuality.value);
            dataURL = canvas.toDataURL('image/jpeg', quality);
            break;
          case 'webp':
            dataURL = canvas.toDataURL('image/webp', 0.9);
            break;
          case 'svg':
            // SVGの場合は別の方法で生成
            await this.downloadAsSVG(filename);
            return;
          default:
            dataURL = canvas.toDataURL('image/png');
        }
        
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      async downloadAsSVG(filename) {
        // SVG生成（簡易版）
        const text = this.getQRText();
        if (!text) return;
        
        try {
          // QRコードのデータをSVGとして生成
          const size = parseInt(this.elements.qrSize.value);
          const svg = this.generateQRSVG(text, size);
          
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.download = `${filename}.svg`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('SVG生成エラー:', error);
          alert('SVG形式での保存に失敗しました');
        }
      }
      
      generateQRSVG(text, size) {
        // 簡易SVG生成（実際のQRコードロジックは省略）
        const foreground = this.elements.foregroundColor.value;
        const background = this.elements.backgroundColor.value;
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${background}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12" fill="${foreground}">
    QR Code: ${text.substring(0, 20)}...
  </text>
</svg>`;
      }
      
      // クリエイティブQR機能メソッド
      switchDesignMode(mode) {
        this.designMode = mode;
        
        // ボタンスタイル更新
        document.querySelectorAll('[data-design-mode]').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.designMode === mode);
        });
        
        // クリエイティブオプション表示切り替え
        if (mode === 'creative') {
          this.elements.creativeOptions.classList.remove('hidden');
          this.elements.creativeDownloadSection.classList.remove('hidden');
        } else {
          this.elements.creativeOptions.classList.add('hidden');
          this.elements.creativeDownloadSection.classList.add('hidden');
        }
      }

      updateColorModeUI() {
        if (this.currentColorMode === 'gradient') {
          this.elements.gradientSettings.classList.remove('hidden');
        } else {
          this.elements.gradientSettings.classList.add('hidden');
        }
      }

      async generateCreativeQR(text) {
        try {
          // QRコードデータ生成（qrcode-generatorライブラリを使用）
          const qr = qrcode(0, 'M'); // エラー訂正レベル M
          qr.addData(text);
          qr.make();
          
          this.qrData = qr;
          this.renderCreativeQR();
          
          console.log('✅ クリエイティブQRコード生成完了');
        } catch (error) {
          console.error('❌ クリエイティブQRコード生成エラー:', error);
          this.elements.qrResult.innerHTML = `
            <div class="text-center text-red-500">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p>クリエイティブQRコード生成に失敗しました</p>
              <p class="text-sm mt-2">${error.message}</p>
            </div>
          `;
        }
      }

      renderCreativeQR() {
        if (!this.qrData) return;

        const moduleCount = this.qrData.getModuleCount();
        const size = parseInt(this.elements.qrSize.value);
        const cellSize = Math.floor(size / moduleCount);
        const actualSize = cellSize * moduleCount;

        // SVG作成
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', actualSize);
        svg.setAttribute('height', actualSize);
        svg.setAttribute('viewBox', `0 0 ${actualSize} ${actualSize}`);
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';

        // グラデーション定義
        if (this.currentColorMode === 'gradient') {
          this.addGradientDefinition(svg);
        }

        // 背景
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', actualSize);
        background.setAttribute('height', actualSize);
        background.setAttribute('fill', this.elements.backgroundColor.value);
        svg.appendChild(background);

        // セル描画
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (this.qrData.isDark(row, col)) {
              const x = col * cellSize;
              const y = row * cellSize;
              
              // 検出パターンかチェック
              const isPattern = this.isDetectionPattern(row, col, moduleCount);
              
              if (isPattern) {
                this.drawDetectionPattern(svg, row, col, cellSize, moduleCount, isPattern);
              } else {
                this.drawCreativeCell(svg, x, y, cellSize, row, col);
              }
            }
          }
        }

        // プレビューに表示
        this.elements.qrResult.innerHTML = '';
        this.elements.qrResult.appendChild(svg);

        // セルクリックイベント追加
        this.addCellClickEvents(svg);

        // ダウンロードボタン表示
        this.elements.downloadBtn.classList.remove('hidden');
        this.elements.downloadAllBtn.classList.remove('hidden');
      }

      addGradientDefinition(svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'cellGradient');
        
        const direction = this.elements.gradientDirection.value;
        switch (direction) {
          case 'horizontal':
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '0%');
            break;
          case 'vertical':
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '0%');
            gradient.setAttribute('y2', '100%');
            break;
          case 'diagonal':
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');
            break;
          case 'radial':
            // 放射状グラデーション用
            const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            radialGradient.setAttribute('id', 'cellGradient');
            radialGradient.setAttribute('cx', '50%');
            radialGradient.setAttribute('cy', '50%');
            radialGradient.setAttribute('r', '50%');
            
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', this.elements.gradientStart.value);

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', this.elements.gradientEnd.value);

            radialGradient.appendChild(stop1);
            radialGradient.appendChild(stop2);
            defs.appendChild(radialGradient);
            svg.appendChild(defs);
            return;
        }

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', this.elements.gradientStart.value);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', this.elements.gradientEnd.value);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
      }

      isDetectionPattern(row, col, moduleCount) {
        // 左上 (0-6, 0-6)
        if (row < 7 && col < 7) return 'top-left';
        
        // 右上 (0-6, moduleCount-7 to moduleCount-1)
        if (row < 7 && col >= moduleCount - 7) return 'top-right';
        
        // 左下 (moduleCount-7 to moduleCount-1, 0-6)
        if (row >= moduleCount - 7 && col < 7) return 'bottom-left';
        
        return false;
      }

      drawDetectionPattern(svg, row, col, cellSize, moduleCount, patternType) {
        const x = col * cellSize;
        const y = row * cellSize;
        const customization = this.patternCustomizations[patternType];
        
        // 検出パターンは通常のセルとして描画（将来的に特別な描画を追加可能）
        this.drawCreativeCell(svg, x, y, cellSize, row, col, customization.color);
      }

      drawCreativeCell(svg, x, y, size, row, col, customColor = null) {
        const cellId = `cell-${row}-${col}`;
        
        // 個別カスタマイズチェック
        const customization = this.cellCustomizations.get(cellId);
        const shape = customization?.shape || this.currentShape;
        const color = customColor || customization?.color || this.getCellColor(row, col);

        let element;

        switch (shape) {
          case 'circle':
            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttribute('cx', x + size / 2);
            element.setAttribute('cy', y + size / 2);
            element.setAttribute('r', size * 0.4);
            break;
            
          case 'rounded':
            element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            element.setAttribute('x', x + size * 0.1);
            element.setAttribute('y', y + size * 0.1);
            element.setAttribute('width', size * 0.8);
            element.setAttribute('height', size * 0.8);
            element.setAttribute('rx', size * 0.2);
            break;
            
          case 'diamond':
            element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            element.setAttribute('x', x + size / 2);
            element.setAttribute('y', y + size / 2);
            element.setAttribute('width', size * 0.7);
            element.setAttribute('height', size * 0.7);
            element.setAttribute('transform', `rotate(45 ${x + size / 2} ${y + size / 2}) translate(${-size * 0.35} ${-size * 0.35})`);
            break;
            
          default: // square
            element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            element.setAttribute('x', x);
            element.setAttribute('y', y);
            element.setAttribute('width', size);
            element.setAttribute('height', size);
            break;
        }

        element.setAttribute('fill', color);
        element.setAttribute('data-row', row);
        element.setAttribute('data-col', col);
        element.setAttribute('data-cell-id', cellId);
        element.classList.add('qr-cell');

        svg.appendChild(element);
      }

      getCellColor(row, col) {
        switch (this.currentColorMode) {
          case 'gradient':
            return 'url(#cellGradient)';
            
          case 'rainbow':
            const hue = ((row + col) * 30) % 360;
            return `hsl(${hue}, 70%, 50%)`;
            
          case 'pattern':
            // チェッカーボードパターン
            return (row + col) % 2 === 0 ? this.elements.foregroundColor.value : '#666666';
            
          default: // solid
            return this.elements.foregroundColor.value;
        }
      }

      addCellClickEvents(svg) {
        svg.addEventListener('click', (e) => {
          const cell = e.target.closest('.qr-cell');
          if (cell) {
            this.selectCell(cell);
          }
        });

        svg.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const cell = e.target.closest('.qr-cell');
          if (cell) {
            this.cycleCellShape(cell);
          }
        });
      }

      selectCell(cell) {
        // 前の選択を解除
        document.querySelectorAll('.qr-cell').forEach(c => {
          c.classList.remove('selected');
        });

        // 新しい選択
        cell.classList.add('selected');

        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        const cellId = cell.getAttribute('data-cell-id');

        console.log(`セル選択: (${row}, ${col})`);
      }

      cycleCellShape(cell) {
        const shapes = ['square', 'circle', 'rounded', 'diamond'];
        const cellId = cell.getAttribute('data-cell-id');
        const current = this.cellCustomizations.get(cellId)?.shape || this.currentShape;
        const currentIndex = shapes.indexOf(current);
        const nextShape = shapes[(currentIndex + 1) % shapes.length];

        const customization = this.cellCustomizations.get(cellId) || {};
        customization.shape = nextShape;
        this.cellCustomizations.set(cellId, customization);

        this.renderCreativeQR();
      }

      updatePatternShape(shape) {
        const selectedPattern = this.elements.patternSelect.value;
        if (selectedPattern === 'all') {
          Object.keys(this.patternCustomizations).forEach(key => {
            this.patternCustomizations[key].shape = shape;
          });
        } else {
          this.patternCustomizations[selectedPattern].shape = shape;
        }
        
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      }

      updatePatternColor() {
        const color = this.elements.patternColor.value;
        const selectedPattern = this.elements.patternSelect.value;
        
        if (selectedPattern === 'all') {
          Object.keys(this.patternCustomizations).forEach(key => {
            this.patternCustomizations[key].color = color;
          });
        } else {
          this.patternCustomizations[selectedPattern].color = color;
        }
        
        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      }

      applyPreset(preset) {
        switch (preset) {
          case 'minimal':
            this.elements.foregroundColor.value = '#000000';
            this.elements.backgroundColor.value = '#ffffff';
            this.elements.colorMode.value = 'solid';
            this.currentShape = 'square';
            break;
            
          case 'neon':
            this.elements.gradientStart.value = '#ff0080';
            this.elements.gradientEnd.value = '#00ff80';
            this.elements.colorMode.value = 'gradient';
            this.elements.backgroundColor.value = '#000000';
            this.currentShape = 'rounded';
            break;
            
          case 'nature':
            this.elements.gradientStart.value = '#22c55e';
            this.elements.gradientEnd.value = '#16a34a';
            this.elements.colorMode.value = 'gradient';
            this.elements.backgroundColor.value = '#f0fdf4';
            this.currentShape = 'circle';
            break;
            
          case 'retro':
            this.elements.foregroundColor.value = '#d97706';
            this.elements.backgroundColor.value = '#fef3c7';
            this.elements.colorMode.value = 'solid';
            this.currentShape = 'rounded';
            break;
        }

        // UI更新
        this.currentColorMode = this.elements.colorMode.value;
        this.updateColorModeUI();
        
        // 形状ボタン更新
        document.querySelectorAll('.shape-btn[data-shape]').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.shape === this.currentShape);
        });

        if (this.qrData && this.designMode === 'creative') this.renderCreativeQR();
      }

      downloadCreativeSVG() {
        const svg = this.elements.qrResult.querySelector('svg');
        if (!svg) {
          alert('先にクリエイティブQRコードを生成してください');
          return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'creative-qr-code.svg';
        a.click();

        URL.revokeObjectURL(url);
      }

      downloadCreativePNG() {
        const svg = this.elements.qrResult.querySelector('svg');
        if (!svg) {
          alert('先にクリエイティブQRコードを生成してください');
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const size = parseInt(this.elements.qrSize.value);
        canvas.width = size;
        canvas.height = size;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'creative-qr-code.png';
            a.click();
            URL.revokeObjectURL(url);
          }, 'image/png');
          
          URL.revokeObjectURL(url);
        };

        img.src = url;
      }
      
      async generateQRCanvas(text, options) {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas');
          canvas.width = options.width;
          canvas.height = options.height;
          
          try {
            const container = document.createElement('div');
            const qrcode = new QRCode(container, {
              text: text,
              width: options.width,
              height: options.height,
              colorDark: options.color.dark,
              colorLight: options.color.light,
              correctLevel: QRCode.CorrectLevel[options.errorCorrectionLevel] || QRCode.CorrectLevel.M
            });
            
            setTimeout(() => {
              const generatedCanvas = container.querySelector('canvas');
              if (generatedCanvas) {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(generatedCanvas, 0, 0);
                resolve(canvas);
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
