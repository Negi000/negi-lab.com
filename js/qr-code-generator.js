/**
 * QRコード生成ツール - メインクラス
 * 
 * 機能:
 * - QRコード生成（標準・クリエイティブモード）
 * - カスタマイズ（色、形状、検出パターン、外枠、角丸）
 * - 複数フォーマットダウンロード（PNG、SVG、JPEG）
 * - バッチ生成対応
 * 
 * @author negi-lab.com
 * @version 2.0.0
 */

const QR_GENERATOR_DEBUG =
  Boolean(window.QR_GENERATOR_DEBUG) ||
  window.localStorage?.getItem('qrGeneratorDebug') === 'true';

const qrDebug = {
  log: (...args) => {
    if (QR_GENERATOR_DEBUG) console.log(...args);
  },
  trace: (...args) => {
    if (QR_GENERATOR_DEBUG) console.trace(...args);
  }
};

qrDebug.log('🔧 QRGenerator読み込み開始');

class QRGenerator {
  constructor() {
    qrDebug.log('🏗️ QRGeneratorコンストラクター実行');
    
    // === 基本プロパティ ===
    this.currentTemplate = 'text';
    this.currentMode = 'single';
    this.designMode = 'standard';
    this.currentShape = 'square';
    this.currentColorMode = 'solid';
    
    // === データ関連 ===
    this.qrData = null;
    this.batchData = [];
    this.currentCreativeCanvas = null;
    this.elements = {};
    
    // === 初期化 ===
    this.initializeWhenReady();
  }

  // =========================================
  // 初期化メソッド
  // =========================================

  /**
   * DOM準備完了時に初期化を実行
   */
  initializeWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.safeInitialize());
    } else {
      this.safeInitialize();
    }
  }

  /**
   * 安全な初期化処理
   */
  safeInitialize() {
    qrDebug.log('🔧 QRGenerator初期化開始');
    try {
      this.initializeElements();
      this.bindEvents();
      this.initializeSettings();
      qrDebug.log('✅ QRGenerator初期化完了');
    } catch (error) {
      console.error('❌ QRGenerator初期化エラー:', error);
    }
  }

  /**
   * DOM要素の取得と格納
   */
  initializeElements() {
    this.elements = {
      // === モード関連 ===
      modeBtns: document.querySelectorAll('.mode-btn'),
      singleModeBtn: document.getElementById('singleModeBtn'),
      batchModeBtn: document.getElementById('batchModeBtn'),
      standardModeBtn: document.getElementById('standardModeBtn'),
      creativeModeBtn: document.getElementById('creativeModeBtn'),

      // === セクション ===
      singleGenerationSection: document.getElementById('singleGenerationSection'),
      batchGenerationSection: document.getElementById('batchGenerationSection'),
      designModeSection: document.getElementById('designModeSection'),
      inputSection: document.getElementById('inputSection'),
      creativeSettingsSection: document.getElementById('creativeSettingsSection'),

      // === テンプレート ===
      templateBtns: document.querySelectorAll('.qr-template-btn'),
      templateInputs: document.querySelectorAll('.template-input'),
      qrText: document.getElementById('qrText'),
      urlText: document.getElementById('urlText'),
      wifiSSID: document.getElementById('wifiSSID'),
      wifiPassword: document.getElementById('wifiPassword'),
      wifiSecurity: document.getElementById('wifiSecurity'),
      emailAddress: document.getElementById('emailAddress'),
      emailSubject: document.getElementById('emailSubject'),
      emailBody: document.getElementById('emailBody'),
      smsNumber: document.getElementById('smsNumber'),
      smsMessage: document.getElementById('smsMessage'),
      phoneNumber: document.getElementById('phoneNumber'),

      // === VCard関連 ===
      vcardName: document.getElementById('vcardName'),
      vcardOrg: document.getElementById('vcardOrg'),
      vcardTitle: document.getElementById('vcardTitle'),
      vcardPhone: document.getElementById('vcardPhone'),
      vcardEmail: document.getElementById('vcardEmail'),
      vcardUrl: document.getElementById('vcardUrl'),
      vcardAddress: document.getElementById('vcardAddress'),

      // === イベント関連 ===
      eventTitle: document.getElementById('eventTitle'),
      eventStart: document.getElementById('eventStart'),
      eventEnd: document.getElementById('eventEnd'),
      eventLocation: document.getElementById('eventLocation'),
      eventDescription: document.getElementById('eventDescription'),

      // === 位置情報関連 ===
      locationLat: document.getElementById('locationLat'),
      locationLng: document.getElementById('locationLng'),
      locationName: document.getElementById('locationName'),

      // === ソーシャル関連 ===
      socialType: document.getElementById('socialType'),
      socialUsername: document.getElementById('socialUsername'),

      // === QR設定 ===
      qrSize: document.getElementById('qrSize'),
      errorCorrection: document.getElementById('errorCorrection'),
      foregroundColor: document.getElementById('foregroundColor'),
      backgroundColor: document.getElementById('backgroundColor'),

      // === クリエイティブ設定 ===
      colorMode: document.getElementById('colorMode'),
      solidColorBtn: document.getElementById('solidColorBtn'),
      gradientColorBtn: document.getElementById('gradientColorBtn'),
      gradientSettings: document.getElementById('gradientSettings'),
      gradientStart: document.getElementById('gradientStart'),
      gradientEnd: document.getElementById('gradientEnd'),
      gradientDirection: document.getElementById('gradientDirection'),

      // === 形状ボタン ===
      shapeBtns: document.querySelectorAll('.shape-btn'),

      // === 検出パターン設定 ===
      detectionColorMode: document.getElementById('detectionColorMode'),
      detectionColor: document.getElementById('detectionColor'),
      customDetectionColor: document.getElementById('customDetectionColor'),
      detectionShape: document.getElementById('detectionShape'),

      // === 外枠設定 ===
      borderEnabled: document.getElementById('borderEnabled'),
      borderSettings: document.getElementById('borderSettings'),
      borderWidth: document.getElementById('borderWidth'),
      borderWidthValue: document.getElementById('borderWidthValue'),
      borderColor: document.getElementById('borderColor'),
      borderColorData: document.getElementById('borderColorData'),
      borderColorCustom: document.getElementById('borderColorCustom'),
      customBorderColor: document.getElementById('customBorderColor'),

      // === 角丸設定 ===
      imageRounded: document.getElementById('imageRounded'),
      roundedRadius: document.getElementById('roundedRadius'),
      roundedRadiusValue: document.getElementById('roundedRadiusValue'),
      roundedRadiusDiv: document.getElementById('roundedRadiusDiv'),

      // === ダウンロード ===
      generateBtn: document.getElementById('generateBtn'),
      qrResult: document.getElementById('qrResult'),
      downloadBtn: document.getElementById('downloadBtn'),
      downloadFormat: document.getElementById('downloadFormat'),
      jpegQuality: document.getElementById('jpegQuality'),
      jpegQualityValue: document.getElementById('jpegQualityValue'),
      jpegQualityDiv: document.getElementById('jpegQualityDiv'),
      downloadAllBtn: document.getElementById('downloadAllBtn'),
      downloadSVG: document.getElementById('downloadSVG'),
      downloadPNG: document.getElementById('downloadPNG'),

      // === プレビュー ===
      downloadPreviewSection: document.getElementById('downloadPreviewSection'),
      downloadPreview: document.getElementById('downloadPreview'),
      creativeDownloadSection: document.getElementById('creativeDownloadSection'),

      // === デザインプリセット ===
      presetBtns: document.querySelectorAll('.preset-btn'),

      // === バッチ生成 ===
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

    qrDebug.log(`📝 要素取得完了: ${Object.keys(this.elements).length}個の要素`);
  }

  /**
   * イベントリスナーのバインド
   */
  bindEvents() {
    this.bindBasicEvents();
    this.bindDesignEvents();
    this.bindDownloadEvents();
    this.bindBatchEvents();
    qrDebug.log('✅ 全イベントバインディング完了');
  }
  
  /**
   * 初期設定の適用
   */
  initializeSettings() {
    this.initializeDetectionColorDefault();
    this.updateBorderColorSettings();
    this.initializeRoundedSettings();
    
    // クリエイティブ設定セクションを初期状態で非表示
    if (this.elements.creativeSettingsSection) {
      this.elements.creativeSettingsSection.classList.add('hidden');
      qrDebug.log('✅ クリエイティブ設定セクション初期非表示設定');
    }
    
    qrDebug.log('✅ 初期設定完了');
  }

  // =========================================
  // イベント処理メソッド
  // =========================================

  /**
   * 基本イベントのバインド
   */
  bindBasicEvents() {
    // QR生成ボタン
    if (this.elements.generateBtn) {
      this.elements.generateBtn.addEventListener('click', () => {
        qrDebug.log('🎯 QR生成ボタンクリック');
        this.generateQR();
      });
    }

    // モード切り替え
    this.elements.modeBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        qrDebug.log(`モード切り替え: ${mode}`);
        this.switchMode(mode);
      });
    });    // デザインモード切り替え
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

    // テンプレート選択
    this.elements.templateBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTemplate(btn.dataset.template);
      });
    });
  }

  /**
   * デザイン関連イベントのバインド
   */
  bindDesignEvents() {
    // カラーモード
    if (this.elements.colorMode) {
      this.elements.colorMode.addEventListener('change', () => {
        const mode = this.elements.colorMode.value;
        qrDebug.log(`カラーモード変更: ${mode}`);
        this.currentColorMode = mode;
        this.updateGradientSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // グラデーション設定
    ['gradientStart', 'gradientEnd', 'gradientDirection'].forEach(id => {
      if (this.elements[id]) {
        this.elements[id].addEventListener('change', () => {
          if (this.qrData && this.designMode === 'creative' && this.currentColorMode === 'gradient') {
            this.renderCreativeQR();
            this.updateDownloadPreview();
          }
        });
      }
    });

    // 検出パターン設定
    if (this.elements.detectionColorMode) {
      this.elements.detectionColorMode.addEventListener('change', () => {
        this.updateDetectionColorSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    if (this.elements.detectionColor) {
      this.elements.detectionColor.addEventListener('change', () => {
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }    if (this.elements.detectionShape) {
      this.elements.detectionShape.addEventListener('change', () => {
        qrDebug.log('検出パターン形状変更:', this.elements.detectionShape.value);
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 外枠設定
    if (this.elements.borderEnabled) {
      this.elements.borderEnabled.addEventListener('change', () => {
        this.updateBorderSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

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
    }

    // 外枠色設定
    ['borderColorData', 'borderColorCustom'].forEach(id => {
      if (this.elements[id]) {
        this.elements[id].addEventListener('change', () => {
          this.updateBorderColorSettings();
          if (this.qrData && this.designMode === 'creative') {
            this.renderCreativeQR();
            this.updateDownloadPreview();
          }
        });
      }
    });

    if (this.elements.borderColor) {
      this.elements.borderColor.addEventListener('change', () => {
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 角丸設定
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

    // 形状選択ボタン
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const shape = btn.dataset.shape;
        qrDebug.log(`形状変更: ${shape}`);
        this.currentShape = shape;
        
        // アクティブ状態の更新
        shapeBtns.forEach(b => {
          b.classList.remove('active', 'bg-accent', 'text-white');
          b.classList.add('bg-white', 'text-gray-700');
        });
        btn.classList.add('active', 'bg-accent', 'text-white');
        btn.classList.remove('bg-white', 'text-gray-700');
        
        // QRコードの再描画
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    });

    // カラーモードボタン
    const colorModeBtns = document.querySelectorAll('.color-mode-btn');
    colorModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.colorMode;
        qrDebug.log(`カラーモードボタン変更: ${mode}`);
        this.currentColorMode = mode;
        
        // 隠しselectを更新
        if (this.elements.colorMode) {
          this.elements.colorMode.value = mode;
        }
        
        // アクティブ状態の更新
        colorModeBtns.forEach(b => {
          b.classList.remove('active', 'bg-accent', 'text-white');
          b.classList.add('bg-white', 'text-gray-700');
        });
        btn.classList.add('active', 'bg-accent', 'text-white');
        btn.classList.remove('bg-white', 'text-gray-700');
        
        this.updateGradientSettings();
        
        // QRコードの再描画
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    });

    // 外枠設定
    if (this.elements.borderEnabled) {
      this.elements.borderEnabled.addEventListener('change', () => {
        this.updateBorderSettings();
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

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
    }

    // 外枠色設定
    ['borderColorData', 'borderColorCustom'].forEach(id => {
      if (this.elements[id]) {
        this.elements[id].addEventListener('change', () => {
          this.updateBorderColorSettings();
          if (this.qrData && this.designMode === 'creative') {
            this.renderCreativeQR();
            this.updateDownloadPreview();
          }
        });
      }
    });

    if (this.elements.borderColor) {
      this.elements.borderColor.addEventListener('change', () => {
        if (this.qrData && this.designMode === 'creative') {
          this.renderCreativeQR();
          this.updateDownloadPreview();
        }
      });
    }

    // 角丸設定
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

    // デザインプリセットボタン
    if (this.elements.presetBtns) {
      this.elements.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          qrDebug.log('デザインプリセット選択:', preset);
          this.applyDesignPreset(preset);
        });
      });
    }
  }

  /**
   * ダウンロード関連イベントのバインド
   */
  bindDownloadEvents() {
    qrDebug.log('🔗 ダウンロードイベントバインド開始');
    
    // ダウンロードボタン
    if (this.elements.downloadBtn) {
      qrDebug.log('📌 downloadBtn イベントリスナー設定');
      
      // ワンショットイベントリスナーを使用して重複を防ぐ
      const downloadHandler = () => {
        qrDebug.log('🖱️ downloadBtn クリック検出');
        this.downloadQR();
      };
      
      // 既存のハンドラーがあれば削除
      if (this.elements.downloadBtn._downloadHandler) {
        this.elements.downloadBtn.removeEventListener('click', this.elements.downloadBtn._downloadHandler);
      }
      
      this.elements.downloadBtn._downloadHandler = downloadHandler;
      this.elements.downloadBtn.addEventListener('click', downloadHandler);
    }

    if (this.elements.downloadAllBtn) {
      const downloadAllHandler = () => this.downloadAllFormats();
      if (this.elements.downloadAllBtn._downloadAllHandler) {
        this.elements.downloadAllBtn.removeEventListener('click', this.elements.downloadAllBtn._downloadAllHandler);
      }
      this.elements.downloadAllBtn._downloadAllHandler = downloadAllHandler;
      this.elements.downloadAllBtn.addEventListener('click', downloadAllHandler);
    }

    if (this.elements.downloadSVG) {
      const downloadSVGHandler = () => this.downloadCreativeSVG();
      if (this.elements.downloadSVG._downloadSVGHandler) {
        this.elements.downloadSVG.removeEventListener('click', this.elements.downloadSVG._downloadSVGHandler);
      }
      this.elements.downloadSVG._downloadSVGHandler = downloadSVGHandler;
      this.elements.downloadSVG.addEventListener('click', downloadSVGHandler);
    }

    if (this.elements.downloadPNG) {
      const downloadPNGHandler = () => this.downloadCreativePNG();
      if (this.elements.downloadPNG._downloadPNGHandler) {
        this.elements.downloadPNG.removeEventListener('click', this.elements.downloadPNG._downloadPNGHandler);
      }
      this.elements.downloadPNG._downloadPNGHandler = downloadPNGHandler;
      this.elements.downloadPNG.addEventListener('click', downloadPNGHandler);
    }

    // フォーマット変更
    if (this.elements.downloadFormat) {
      this.elements.downloadFormat.addEventListener('change', () => {
        this.updateDownloadFormatUI();
      });
    }

    // JPEG品質
    if (this.elements.jpegQuality) {
      this.elements.jpegQuality.addEventListener('input', () => {
        if (this.elements.jpegQualityValue) {
          this.elements.jpegQualityValue.textContent = 
            Math.round(this.elements.jpegQuality.value * 100) + '%';
        }
      });
    }
  }

  /**
   * バッチ処理関連イベントのバインド
   */
  bindBatchEvents() {
    // バッチ生成ボタン
    if (this.elements.generateBatchBtn) {
      this.elements.generateBatchBtn.addEventListener('click', () => {
        this.generateBatch();
      });
    }

    // CSVファイル選択
    if (this.elements.csvFileInput) {
      this.elements.csvFileInput.addEventListener('change', (e) => {
        this.handleCSVFile(e);
      });
    }

    // テキストデータ入力
    if (this.elements.batchTextData) {
      this.elements.batchTextData.addEventListener('input', () => {
        this.parseBatchTextData();
      });
    }
  }

  // =========================================
  // 設定初期化メソッド
  // =========================================

  /**
   * 検出パターンのデフォルト色を初期化
   */
  initializeDetectionColorDefault() {
    if (this.elements.detectionColor && this.elements.foregroundColor) {
      const defaultColor = this.elements.foregroundColor.value;
      this.elements.detectionColor.value = defaultColor;
      qrDebug.log('検出パターン初期色設定:', defaultColor);
    }
  }

  /**
   * 角丸設定を初期化
   */
  initializeRoundedSettings() {
    // 初期状態で角丸半径設定を非表示
    if (this.elements.roundedRadiusDiv) {
      this.elements.roundedRadiusDiv.style.display = 'none';
    }

    // 初期値の表示を更新
    if (this.elements.roundedRadius && this.elements.roundedRadiusValue) {
      this.elements.roundedRadiusValue.textContent = 
        this.elements.roundedRadius.value + '%';
    }

    qrDebug.log('✅ 角丸設定初期化完了');
  }

  // =========================================
  // UI更新メソッド
  // =========================================

  /**
   * 検出パターン色設定UIを更新
   */
  updateDetectionColorSettings() {
    if (!this.elements.detectionColorMode || !this.elements.customDetectionColor) return;

    const mode = this.elements.detectionColorMode.value;
    if (mode === 'custom') {
      this.elements.customDetectionColor.classList.remove('hidden');
      
      // デフォルト色を設定
      if (this.elements.detectionColor) {
        let defaultColor = '#000000';
        if (this.currentColorMode === 'gradient') {
          defaultColor = this.elements.gradientStart?.value || '#000000';
        } else {
          defaultColor = this.elements.foregroundColor?.value || '#000000';
        }
        this.elements.detectionColor.value = defaultColor;
      }
    } else {
      this.elements.customDetectionColor.classList.add('hidden');
    }

    qrDebug.log('検出パターン色設定更新:', mode);
  }

  /**
   * 外枠設定UIを更新
   */
  updateBorderSettings() {
    if (!this.elements.borderEnabled || !this.elements.borderSettings) return;

    if (this.elements.borderEnabled.checked) {
      this.elements.borderSettings.classList.remove('hidden');
    } else {
      this.elements.borderSettings.classList.add('hidden');
    }
    qrDebug.log('外枠設定更新:', this.elements.borderEnabled.checked);
  }

  /**
   * 外枠色設定UIを更新
   */
  updateBorderColorSettings() {
    if (!this.elements.borderColorData || !this.elements.customBorderColor) return;

    const useCustom = this.elements.borderColorCustom?.checked;
    if (useCustom) {
      this.elements.customBorderColor.classList.remove('hidden');
      
      // デフォルト色を設定
      if (this.elements.borderColor) {
        let defaultColor = '#000000';
        if (this.currentColorMode === 'gradient') {
          defaultColor = this.elements.gradientStart?.value || '#000000';
        } else {
          defaultColor = this.elements.foregroundColor?.value || '#000000';
        }
        this.elements.borderColor.value = defaultColor;
      }
    } else {
      this.elements.customBorderColor.classList.add('hidden');
    }

    qrDebug.log('外枠色設定更新:', useCustom ? 'custom' : 'data');
  }

  /**
   * グラデーション設定UIを更新
   */
  updateGradientSettings() {
    if (!this.elements.gradientSettings) return;

    if (this.currentColorMode === 'gradient') {
      this.elements.gradientSettings.classList.remove('hidden');
    } else {
      this.elements.gradientSettings.classList.add('hidden');
    }
  }

  /**
   * ダウンロードフォーマットUIを更新
   */
  updateDownloadFormatUI() {
    if (!this.elements.downloadFormat || !this.elements.jpegQualityDiv) return;

    const format = this.elements.downloadFormat.value;
    if (format === 'jpeg') {
      this.elements.jpegQualityDiv.classList.remove('hidden');
    } else {
      this.elements.jpegQualityDiv.classList.add('hidden');
    }
  }

  // =========================================
  // QRコード生成メソッド
  // =========================================

  /**
   * QRコードを生成
   */
  generateQR() {
    try {
      qrDebug.log('🔄 QRコード生成開始');
      
      const content = this.getContentFromTemplate();
      if (!content.trim()) {
        alert('QRコードにする内容を入力してください。');
        return;
      }

      const errorCorrectionLevel = this.elements.errorCorrection?.value || 'M';
      this.qrData = qrcode(0, errorCorrectionLevel);
      this.qrData.addData(content);
      this.qrData.make();

      qrDebug.log(`✅ QRコード生成成功 - 内容: ${content}`);

      if (this.designMode === 'standard') {
        this.renderStandardQR();
      } else {
        this.renderCreativeQR();
      }

      this.showDownloadButtons();
      this.updateDownloadPreview();

    } catch (error) {
      console.error('❌ QRコード生成エラー:', error);
      alert('QRコードの生成に失敗しました: ' + error.message);
    }
  }

  /**
   * テンプレートから内容を取得
   */
  getContentFromTemplate() {
    switch (this.currentTemplate) {
      case 'text':
        return this.elements.qrText?.value || '';
      
      case 'url':
        return this.elements.urlText?.value || '';
      
      case 'wifi':
        const ssid = this.elements.wifiSSID?.value || '';
        const password = this.elements.wifiPassword?.value || '';
        const security = this.elements.wifiSecurity?.value || 'WPA';
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
      
      case 'email':
        const email = this.elements.emailAddress?.value || '';
        const subject = this.elements.emailSubject?.value || '';
        const body = this.elements.emailBody?.value || '';
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      case 'sms':
        const number = this.elements.smsNumber?.value || '';
        const message = this.elements.smsMessage?.value || '';
        return `sms:${number}?body=${encodeURIComponent(message)}`;
      
      case 'phone':
        return `tel:${this.elements.phoneNumber?.value || ''}`;
      
      case 'vcard':
        return this.generateVCardContent();
      
      case 'event':
        return this.generateEventContent();
      
      case 'location':
        return this.generateLocationContent();
      
      case 'social':
        return this.generateSocialContent();
      
      default:
        return this.elements.qrText?.value || '';
    }
  }

  /**
   * vCardコンテンツを生成
   */
  generateVCardContent() {
    const name = this.elements.vcardName?.value || '';
    const org = this.elements.vcardOrg?.value || '';
    const title = this.elements.vcardTitle?.value || '';
    const phone = this.elements.vcardPhone?.value || '';
    const email = this.elements.vcardEmail?.value || '';
    const url = this.elements.vcardUrl?.value || '';
    const address = this.elements.vcardAddress?.value || '';

    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    if (name) vcard += `FN:${name}\n`;
    if (org) vcard += `ORG:${org}\n`;
    if (title) vcard += `TITLE:${title}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (url) vcard += `URL:${url}\n`;
    if (address) vcard += `ADR:;;${address};;;;\n`;
    vcard += 'END:VCARD';

    return vcard;
  }

  /**
   * イベントコンテンツを生成
   */
  generateEventContent() {
    const title = this.elements.eventTitle?.value || '';
    const start = this.elements.eventStart?.value || '';
    const end = this.elements.eventEnd?.value || '';
    const location = this.elements.eventLocation?.value || '';
    const description = this.elements.eventDescription?.value || '';

    let event = 'BEGIN:VEVENT\n';
    if (title) event += `SUMMARY:${title}\n`;
    if (start) {
      const startDate = new Date(start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      event += `DTSTART:${startDate}\n`;
    }
    if (end) {
      const endDate = new Date(end).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      event += `DTEND:${endDate}\n`;
    }
    if (location) event += `LOCATION:${location}\n`;
    if (description) event += `DESCRIPTION:${description}\n`;
    event += 'END:VEVENT';

    return event;
  }

  /**
   * 位置情報コンテンツを生成
   */
  generateLocationContent() {
    const lat = this.elements.locationLat?.value || '';
    const lng = this.elements.locationLng?.value || '';
    const name = this.elements.locationName?.value || '';

    if (!lat || !lng) {
      return '';
    }

    if (name) {
      return `geo:${lat},${lng}?q=${encodeURIComponent(name)}`;
    } else {
      return `geo:${lat},${lng}`;
    }
  }

  /**
   * ソーシャルコンテンツを生成
   */
  generateSocialContent() {
    const type = this.elements.socialType?.value || '';
    const username = this.elements.socialUsername?.value || '';

    if (!username) return '';

    // カスタムURLの場合
    if (type === 'custom') {
      return username.startsWith('http') ? username : `https://${username}`;
    }

    // ユーザー名から@を除去
    const cleanUsername = username.replace('@', '');

    switch (type) {
      case 'twitter':
        return `https://twitter.com/${cleanUsername}`;
      case 'facebook':
        return `https://facebook.com/${cleanUsername}`;
      case 'instagram':
        return `https://instagram.com/${cleanUsername}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanUsername}`;
      case 'youtube':
        return `https://youtube.com/@${cleanUsername}`;
      case 'tiktok':
        return `https://tiktok.com/@${cleanUsername}`;
      case 'line':
        return `https://line.me/ti/p/${cleanUsername}`;
      default:
        return username;
    }
  }

  // =========================================
  // レンダリングメソッド
  // =========================================

  /**
   * 標準QRコードをレンダリング
   */
  renderStandardQR() {
    if (!this.qrData) return;

    const size = parseInt(this.elements.qrSize?.value) || 256;
    const canvas = this.createQRCanvas(this.qrData, size);
    
    this.currentCreativeCanvas = canvas;
    this.displayCanvas(canvas);
    
    qrDebug.log('✅ 標準QR描画完了');
  }

  /**
   * クリエイティブQRコードをレンダリング
   */
  renderCreativeQR() {
    if (!this.qrData) return;

    qrDebug.log('🎨 クリエイティブQR描画開始');
    
    const size = parseInt(this.elements.qrSize?.value) || 256;
    const canvas = this.createCreativeQRCanvas(this.qrData, size);
    
    this.currentCreativeCanvas = canvas;
    this.displayCanvas(canvas);
    
    qrDebug.log('✅ クリエイティブQR描画完了');
  }

  /**
   * QRコード用のキャンバスを作成
   */
  createQRCanvas(qrData, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const moduleCount = qrData.getModuleCount();
    const moduleSize = size / moduleCount;

    canvas.width = size;
    canvas.height = size;

    // 背景色
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // 前景色
    const fgColor = this.elements.foregroundColor?.value || '#000000';
    ctx.fillStyle = fgColor;

    // QRモジュール描画
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    return canvas;
  }

  /**
   * クリエイティブQRコード用のキャンバスを作成
   */
  createCreativeQRCanvas(qrData, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const moduleCount = qrData.getModuleCount();
    const moduleSize = size / moduleCount;

    canvas.width = size;
    canvas.height = size;

    // 背景描画
    this.drawBackground(ctx, size);

    // QRデータ描画
    this.drawCreativeQROnCanvas(ctx, qrData, moduleCount, moduleSize, size);

    return canvas;
  }

  /**
   * 背景を描画
   */
  drawBackground(ctx, size) {
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
  }

  /**
   * クリエイティブQRをキャンバスに描画
   */
  drawCreativeQROnCanvas(ctx, qrData, moduleCount, moduleSize, qrSize) {
    // 検出パターンの位置を取得
    const detectionPatterns = this.getDetectionPatterns(moduleCount);

    // データ部の色/グラデーション設定
    let fillStyle;
    if (this.currentColorMode === 'gradient') {
      fillStyle = this.createGradient(ctx, qrSize);
    } else {
      fillStyle = this.elements.foregroundColor?.value || '#000000';
    }

    // データ部描画（検出パターンを除く）
    ctx.fillStyle = fillStyle;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.isDark(row, col) && !this.isDetectionPattern(row, col, detectionPatterns)) {
          this.drawCreativeModule(ctx, col * moduleSize, row * moduleSize, moduleSize);
        }
      }
    }

    // 検出パターン描画
    this.drawDetectionPatterns(ctx, moduleCount, moduleSize);
  }

  /**
   * クリエイティブモジュールを描画
   */
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
        
      default: // square
        ctx.fillRect(x, y, size, size);
        break;
    }
    
    ctx.restore();
  }

  /**
   * 角丸四角形を描画
   */
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

  /**
   * グラデーションを作成
   */
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
        gradient.addColorStop(0, endColor);
        gradient.addColorStop(1, startColor);
        return gradient;
      default:
        gradient = ctx.createLinearGradient(0, 0, size, 0);
        break;
    }    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  }

  /**
   * 検出パターンを描画
   */
  drawDetectionPatterns(ctx, moduleCount, moduleSize) {
    // 検出パターンの色を決定
    let patternColor;
    const detectionMode = this.elements.detectionColorMode?.value || 'same';

    if (detectionMode === 'custom') {
      patternColor = this.elements.detectionColor?.value || '#000000';
    } else {
      // データ部と同じ色/グラデーション設定を使用
      if (this.currentColorMode === 'gradient') {
        patternColor = 'グラデーション';
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

    qrDebug.log(`✅ 検出パターン描画完了 - 色: ${patternColor} 形状: ${detectionShape}`);
  }  /**
   * 単一の検出パターンを描画
   */
  drawSingleDetectionPattern(ctx, startX, startY, moduleSize, fillStyle, shape) {
    const bgColor = this.elements.backgroundColor?.value || '#ffffff';

    qrDebug.log(`🎯 検出パターン描画: 位置(${startX}, ${startY}), 形状: ${shape}`);

    // グラデーションの場合は、QRコード全体と同じグラデーションを使用
    let actualFillStyle = fillStyle;
    if (fillStyle === 'グラデーション') {
      // QRコード全体のサイズでグラデーションを作成（データ部分と統一）
      const qrSize = this.qrData.getModuleCount() * moduleSize;
      actualFillStyle = this.createGradient(ctx, qrSize);
    }

    // 外側の四角形 (7x7)
    ctx.fillStyle = actualFillStyle;
    this.drawDetectionShape(ctx, startX * moduleSize, startY * moduleSize, 7 * moduleSize, shape);

    // 内側の白い四角形 (5x5)
    ctx.fillStyle = bgColor;
    this.drawDetectionShape(ctx, (startX + 1) * moduleSize, (startY + 1) * moduleSize, 5 * moduleSize, shape);

    // 中心の黒い四角形 (3x3)
    ctx.fillStyle = actualFillStyle;
    this.drawDetectionShape(ctx, (startX + 2) * moduleSize, (startY + 2) * moduleSize, 3 * moduleSize, shape);
  }

  /**
   * 検出パターンの形状を描画
   */
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

  /**
   * キャンバスを表示
   */
  displayCanvas(canvas) {
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

  // =========================================
  // ユーティリティメソッド
  // =========================================

  /**
   * 検出パターンの位置を取得
   */
  getDetectionPatterns(moduleCount) {
    return [
      { startX: 0, startY: 0, endX: 6, endY: 6 }, // 左上
      { startX: moduleCount - 7, startY: 0, endX: moduleCount - 1, endY: 6 }, // 右上
      { startX: 0, startY: moduleCount - 7, endX: 6, endY: moduleCount - 1 } // 左下
    ];
  }

  /**
   * 指定した位置が検出パターンかどうか判定
   */
  isDetectionPattern(row, col, detectionPatterns) {
    return detectionPatterns.some(pattern => 
      col >= pattern.startX && col <= pattern.endX && 
      row >= pattern.startY && row <= pattern.endY
    );
  }

  /**
   * ダウンロードボタンを表示
   */
  showDownloadButtons() {
    if (this.designMode === 'standard') {
      if (this.elements.downloadBtn) {
        this.elements.downloadBtn.style.display = 'block';
      }
    } else {
      if (this.elements.creativeDownloadSection) {
        this.elements.creativeDownloadSection.classList.remove('hidden');
      }
    }
  }

  /**
   * モードを切り替え
   */
  switchMode(mode) {
    qrDebug.log(`モード切り替え: ${mode}`);
    this.currentMode = mode;

    // UI切り替え
    if (mode === 'single') {
      this.elements.singleGenerationSection?.classList.remove('hidden');
      this.elements.batchGenerationSection?.classList.add('hidden');
      // デザインモードセクションを表示
      this.elements.designModeSection?.classList.remove('hidden');
    } else {
      this.elements.singleGenerationSection?.classList.add('hidden');
      this.elements.batchGenerationSection?.classList.remove('hidden');
      // バッチモード時はデザインモードセクションを非表示
      this.elements.designModeSection?.classList.add('hidden');
      // クリエイティブ設定も非表示
      this.elements.creativeSettingsSection?.classList.add('hidden');
    }    // ボタンのアクティブ状態更新
    this.elements.modeBtns?.forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
        btn.classList.remove('bg-white', 'text-gray-700');
        btn.classList.add('bg-accent', 'text-white');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
      }
    });
  }
  /**
   * デザインモードを切り替え
   */
  switchDesignMode(mode) {
    qrDebug.log(`デザインモード切り替え: ${mode}`);
    this.designMode = mode;

    if (mode === 'creative') {
      this.elements.creativeSettingsSection?.classList.remove('hidden');
    } else {
      this.elements.creativeSettingsSection?.classList.add('hidden');
    }    // デザインモードボタンのアクティブ状態更新
    if (this.elements.standardModeBtn && this.elements.creativeModeBtn) {
      if (mode === 'standard') {
        this.elements.standardModeBtn.classList.add('active');
        this.elements.standardModeBtn.classList.remove('bg-white', 'text-gray-700');
        this.elements.standardModeBtn.classList.add('bg-accent', 'text-white');
        this.elements.creativeModeBtn.classList.remove('active');
        this.elements.creativeModeBtn.classList.remove('bg-accent', 'text-white');
        this.elements.creativeModeBtn.classList.add('bg-white', 'text-gray-700');
      } else {
        this.elements.creativeModeBtn.classList.add('active');
        this.elements.creativeModeBtn.classList.remove('bg-white', 'text-gray-700');
        this.elements.creativeModeBtn.classList.add('bg-accent', 'text-white');
        this.elements.standardModeBtn.classList.remove('active');
        this.elements.standardModeBtn.classList.remove('bg-accent', 'text-white');
        this.elements.standardModeBtn.classList.add('bg-white', 'text-gray-700');
      }
    }

    // 既存のQRコードがあれば再描画
    if (this.qrData) {
      if (mode === 'standard') {
        this.renderStandardQR();
      } else {
        this.renderCreativeQR();
      }
      this.updateDownloadPreview();
    }
  }

  /**
   * テンプレートを選択
   */
  selectTemplate(template) {
    qrDebug.log(`テンプレート選択: ${template}`);
    this.currentTemplate = template;

    // 全てのテンプレート入力を非表示
    this.elements.templateInputs?.forEach(input => {
      input.classList.add('hidden');
    });

    // 選択されたテンプレートの入力を表示
    const targetInput = document.getElementById(`${template}Input`);
    if (targetInput) {
      targetInput.classList.remove('hidden');
    }    // ボタンのアクティブ状態更新
    this.elements.templateBtns?.forEach(btn => {
      if (btn.dataset.template === template) {
        btn.classList.add('active');
        btn.classList.remove('bg-white', 'text-gray-700');
        btn.classList.add('bg-accent', 'text-white');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
      }
    });
  }
  // =========================================
  // ダウンロード・保存メソッド
  // =========================================

  /**
   * 保存時プレビューを更新
   */
  updateDownloadPreview() {
    try {
      qrDebug.log('📸 保存時プレビュー更新開始');
      
      if (!this.elements.downloadPreview) return;
      
      // プレビュー領域をクリア
      this.elements.downloadPreview.innerHTML = '';
      
      if (!this.currentCreativeCanvas) {
        qrDebug.log('❌ プレビュー対象のキャンバスがありません');
        return;
      }
      
      // 余白付きキャンバスを作成
      const marginCanvas = this.createCanvasWithMargin(this.currentCreativeCanvas);
      
      // 角丸処理
      const finalCanvas = this.createRoundedCanvas(marginCanvas);
      
      // プレビュー用の縮小キャンバス作成
      const previewSize = 150;
      const previewCanvas = document.createElement('canvas');
      const previewCtx = previewCanvas.getContext('2d');
      
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
      
      // 縮小して描画
      previewCtx.drawImage(finalCanvas, 0, 0, previewSize, previewSize);
      
      this.elements.downloadPreview.appendChild(previewCanvas);
      
      // プレビューセクションを表示
      if (this.elements.downloadPreviewSection) {
        this.elements.downloadPreviewSection.classList.remove('hidden');
      }
      
      qrDebug.log('✅ 保存時プレビュー更新完了');
    } catch (error) {
      console.error('❌ 保存時プレビュー更新エラー:', error);
    }
  }

  /**
   * 余白付きキャンバスを作成
   */
  createCanvasWithMargin(originalCanvas) {
    qrDebug.log('📏 余白付きキャンバス作成開始');
    
    const qrSize = originalCanvas.width;
    
    // 余白を計算（4モジュール分 + 外枠の太さ）
    const moduleSize = qrSize / this.qrData.getModuleCount();
    const baseMargin = moduleSize * 4;
    const borderWidth = this.elements.borderEnabled?.checked ? 
      (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    const margin = baseMargin + borderWidth;
    
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
    
    qrDebug.log(`✅ 余白付きキャンバス作成完了: ${qrSize}x${qrSize} → ${newSize}x${newSize} (余白: ${margin}px)`);
    
    return newCanvas;
  }

  /**
   * 余白付きキャンバスに外枠を描画
   */
  drawBorderOnMarginCanvas(ctx, totalSize, margin) {
    if (!this.elements.borderEnabled?.checked) return;
    
    const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
    const borderStyle = this.getBorderGradient(ctx, totalSize);
    
    if (!borderStyle) return;
    
    qrDebug.log(`🖼️ 外枠描画: 太さ${borderWidth}px`);
    
    ctx.strokeStyle = borderStyle;
    ctx.lineWidth = borderWidth;
    
    // 外枠は全体の外周に描画
    const halfWidth = borderWidth / 2;
    ctx.strokeRect(halfWidth, halfWidth, totalSize - borderWidth, totalSize - borderWidth);
  }

  /**
   * 角丸キャンバスを作成
   */
  createRoundedCanvas(originalCanvas) {
    if (!this.elements.imageRounded?.checked) {
      return originalCanvas;
    }

    qrDebug.log('🔄 角丸キャンバス作成開始');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = originalCanvas.width;
    const borderWidth = this.elements.borderEnabled?.checked ? 
      (parseInt(this.elements.borderWidth?.value) || 8) : 0;
    
    // 角丸半径をカスタム値から取得
    const radiusPercent = parseInt(this.elements.roundedRadius?.value) || 5;
    const baseRadius = (size * radiusPercent) / 100;
    const radius = Math.max(baseRadius, borderWidth + 2);
    
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
    
    // 角丸のクリップパスを作成
    ctx.save();
    const contentRadius = Math.max(0, radius - borderWidth);
    this.createRoundedClipPath(ctx, size, contentRadius, borderWidth);
    ctx.clip();
    
    // 元の画像を角丸でクリップして描画
    ctx.drawImage(originalCanvas, 0, 0);
    
    ctx.restore();
    
    qrDebug.log(`✅ 角丸キャンバス作成完了: 半径${radius}px(${radiusPercent}%), 外枠${borderWidth}px`);
    return canvas;
  }

  /**
   * 角丸クリップパスを作成
   */
  createRoundedClipPath(ctx, size, radius, borderWidth = 0) {
    const offset = borderWidth;
    const innerSize = size - (offset * 2);
    const x = offset;
    const y = offset;
    
    const maxRadius = Math.min(innerSize, innerSize) / 2;
    const actualRadius = Math.min(radius, maxRadius);
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

  /**
   * 角丸の外枠を描画
   */
  drawRoundedBorder(ctx, size, radius, borderWidth) {
    const borderStyle = this.getBorderGradient(ctx, size);
    
    if (!borderStyle) return;
    
    qrDebug.log(`角丸外枠描画: 太さ${borderWidth}px, 半径${radius}px`);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = borderStyle;
    
    ctx.beginPath();
    this.createRoundedPath(ctx, 0, 0, size, size, radius);
    
    const innerRadius = Math.max(0, radius - borderWidth);
    this.createRoundedPath(ctx, borderWidth, borderWidth, 
                          size - borderWidth * 2, size - borderWidth * 2, innerRadius, true);
    
    ctx.fill('evenodd');
  }

  /**
   * 角丸パスを作成
   */
  createRoundedPath(ctx, x, y, width, height, radius, reverse = false) {
    const maxRadius = Math.min(width, height) / 2;
    const actualRadius = Math.min(radius, maxRadius);
    const cp = actualRadius * 0.552284749831;
    
    if (reverse) {
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

  /**
   * 外枠のグラデーションを取得
   */
  getBorderGradient(ctx, size) {
    if (!this.elements.borderEnabled?.checked) return null;
    
    const isCustom = this.elements.borderColorCustom?.checked;
    
    if (isCustom) {
      return this.elements.borderColor?.value || '#000000';
    } else {
      if (this.currentColorMode === 'gradient') {
        return this.createGradient(ctx, size);
      } else {
        return this.elements.foregroundColor?.value || '#000000';
      }
    }
  }

  /**
   * DataURLからファイルをダウンロード
   */
  downloadDataURL(dataURL, filename) {
    qrDebug.log(`🔽 downloadDataURL 実行: ${filename}`);
    qrDebug.trace('downloadDataURL 呼び出し元のスタックトレース:');
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    qrDebug.log(`✅ ダウンロード完了: ${filename}`);
  }

  /**
   * QRコードをダウンロード
   */
  downloadQR() {
    qrDebug.log('🔽 downloadQR メソッド呼び出し開始');
    qrDebug.trace('downloadQR 呼び出し元のスタックトレース:');
    
    if (!this.currentCreativeCanvas) {
      alert('ダウンロードするQRコードがありません。');
      return;
    }

    try {
      const format = this.elements.downloadFormat?.value || 'png';
      const marginCanvas = this.createCanvasWithMargin(this.currentCreativeCanvas);
      const finalCanvas = this.createRoundedCanvas(marginCanvas);
      
      let dataURL;
      let filename;

      switch (format) {
        case 'png':
          dataURL = finalCanvas.toDataURL('image/png');
          filename = 'qr-code.png';
          break;
        case 'jpeg':
          const quality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
          dataURL = finalCanvas.toDataURL('image/jpeg', quality);
          filename = 'qr-code.jpg';
          break;
        case 'webp':
          dataURL = finalCanvas.toDataURL('image/webp');
          filename = 'qr-code.webp';
          break;
        case 'svg':
          // SVGはベクター生成関数を使用
          this.downloadCreativeSVG();
          qrDebug.log('✅ SVGダウンロード完了 (format switch)');
          return;
        default:
          dataURL = finalCanvas.toDataURL('image/png');
          filename = 'qr-code.png';
      }

      this.downloadDataURL(dataURL, filename);
      qrDebug.log(`✅ QRコードダウンロード完了: ${filename}`);
    } catch (error) {
      console.error('❌ ダウンロードエラー:', error);
      alert('ダウンロードに失敗しました: ' + error.message);
    }
  }

  /**
   * 全フォーマットでダウンロード
   */
  downloadAllFormats() {
    if (!this.currentCreativeCanvas) {
      alert('ダウンロードするQRコードがありません。');
      return;
    }

    try {
      const marginCanvas = this.createCanvasWithMargin(this.currentCreativeCanvas);
      const finalCanvas = this.createRoundedCanvas(marginCanvas);
      
      // PNG
      const pngDataURL = finalCanvas.toDataURL('image/png');
      this.downloadDataURL(pngDataURL, 'qr-code.png');
      
      // JPEG
      const jpegQuality = parseFloat(this.elements.jpegQuality?.value) || 0.9;
      const jpegDataURL = finalCanvas.toDataURL('image/jpeg', jpegQuality);
      this.downloadDataURL(jpegDataURL, 'qr-code.jpg');
      
      // WebP
      const webpDataURL = finalCanvas.toDataURL('image/webp');
      this.downloadDataURL(webpDataURL, 'qr-code.webp');
      
      // SVG（クリエイティブモードの場合）
      if (this.designMode === 'creative') {
        this.downloadCreativeSVG();
      }
      
      qrDebug.log('✅ 全フォーマットダウンロード完了');
    } catch (error) {
      console.error('❌ 全フォーマットダウンロードエラー:', error);
      alert('ダウンロードに失敗しました: ' + error.message);
    }
  }

  /**
   * SVGダウンロード
   */
  downloadCreativeSVG() {
    if (!this.qrData) return;

    try {
      qrDebug.log('📥 SVGダウンロード開始');
      
      const originalSize = parseInt(this.elements.qrSize?.value) || 256;
      const moduleCount = this.qrData.getModuleCount();
      const moduleSize = originalSize / moduleCount;
      
      // 余白を追加
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
          if (direction === 'radial-reverse') {
            svg += `<stop offset="0%" style="stop-color:${endColor}"/>`;
            svg += `<stop offset="100%" style="stop-color:${startColor}"/>`;
          } else {
            svg += `<stop offset="0%" style="stop-color:${startColor}"/>`;
            svg += `<stop offset="100%" style="stop-color:${endColor}"/>`;
          }
          svg += `</radialGradient></defs>`;
        } else {
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
      
      // 角丸クリップの定義と開始
      svg += this.getSVGRoundedClip(totalSize);
      
      // 検出パターンの位置を計算
      const detectionPatterns = this.getDetectionPatterns(moduleCount);
      
      // QRモジュール描画
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (this.qrData.isDark(row, col) && !this.isDetectionPattern(row, col, detectionPatterns)) {
            const x = col * moduleSize + margin;
            const y = row * moduleSize + margin;
            svg += this.getSVGModule(x, y, moduleSize, fillColor);
          }
        }
      }
      
      // 検出パターンをSVGで描画
      svg += this.getSVGDetectionPatterns(moduleCount, moduleSize, bgColor, margin);
      
      // 外枠をSVGで描画
      svg += this.getSVGBorder(originalSize, margin, totalSize);
      
      // 角丸クリップの終了
      svg += this.getSVGRoundedClipEnd();
      svg += '</svg>';
      
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      this.downloadDataURL(url, 'qr-code.svg');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      qrDebug.log('✅ SVGダウンロード完了');
    } catch (error) {
      console.error('❌ SVGダウンロードエラー:', error);
    }
  }

  /**
   * SVGモジュール生成
   */
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

  /**
   * SVG検出パターン生成
   */
  getSVGDetectionPatterns(moduleCount, moduleSize, bgColor, margin = 0) {
    let patternColor;
    const detectionMode = this.elements.detectionColorMode?.value || 'same';

    if (detectionMode === 'custom') {
      patternColor = this.elements.detectionColor?.value || '#000000';
    } else {
      if (this.currentColorMode === 'gradient') {
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

  /**
   * SVG単一検出パターン生成
   */
  getSVGSingleDetectionPattern(startX, startY, moduleSize, fillColor, bgColor, shape, margin = 0) {
    const x = startX * moduleSize + margin;
    const y = startY * moduleSize + margin;
    const size7 = 7 * moduleSize;
    const size5 = 5 * moduleSize;
    const size3 = 3 * moduleSize;

    let svg = '';
    svg += this.getSVGDetectionShape(x, y, size7, fillColor, shape);
    svg += this.getSVGDetectionShape(x + moduleSize, y + moduleSize, size5, bgColor, shape);
    svg += this.getSVGDetectionShape(x + 2 * moduleSize, y + 2 * moduleSize, size3, fillColor, shape);

    return svg;
  }

  /**
   * SVG検出パターン形状生成
   */
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
  }

  /**
   * SVG外枠生成
   */
  getSVGBorder(originalSize, margin = 0, totalSize) {
    if (!this.elements.borderEnabled?.checked) return '';

    const borderWidth = parseInt(this.elements.borderWidth?.value) || 8;
    const isCustom = this.elements.borderColorCustom?.checked;

    let strokeColor;
    if (isCustom) {
      strokeColor = this.elements.borderColor?.value || '#000000';
    } else {
      if (this.currentColorMode === 'gradient') {
        strokeColor = 'url(#qrGrad)';
      } else {
        strokeColor = this.elements.foregroundColor?.value || '#000000';
      }
    }

    const halfWidth = borderWidth / 2;
    return `<rect x="${halfWidth}" y="${halfWidth}" width="${totalSize - borderWidth}" height="${totalSize - borderWidth}" fill="none" stroke="${strokeColor}" stroke-width="${borderWidth}"/>`;
  }

  /**
   * SVG角丸クリップ生成
   */
  getSVGRoundedClip(totalSize) {
    if (!this.elements.imageRounded?.checked) return '';

    const radiusPercent = parseInt(this.elements.roundedRadius?.value) || 5;
    const borderWidth = this.elements.borderEnabled?.checked ? 
      (parseInt(this.elements.borderWidth?.value) || 8) : 0;

    const baseRadius = (totalSize * radiusPercent) / 100;
    const radius = Math.max(baseRadius, borderWidth + 2);

    qrDebug.log(`🎯 SVG角丸クリップ生成: 半径${radius}px(${radiusPercent}%)`);

    return `
      <defs>
        <clipPath id="roundedClip">
          <rect x="0" y="0" width="${totalSize}" height="${totalSize}" rx="${radius}" ry="${radius}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#roundedClip)">`;
  }

  /**
   * SVG角丸終了タグ
   */
  getSVGRoundedClipEnd() {
    if (!this.elements.imageRounded?.checked) return '';
    return '</g>';
  }

  /**
   * PNGダウンロード（クリエイティブ専用）
   */
  downloadCreativePNG() {
    if (!this.currentCreativeCanvas) {
      alert('ダウンロードするQRコードがありません。');
      return;
    }

    try {
      const marginCanvas = this.createCanvasWithMargin(this.currentCreativeCanvas);
      const finalCanvas = this.createRoundedCanvas(marginCanvas);
      const dataURL = finalCanvas.toDataURL('image/png');
      this.downloadDataURL(dataURL, 'qr-code-creative.png');
      qrDebug.log('✅ クリエイティブPNGダウンロード完了');
    } catch (error) {
      console.error('❌ クリエイティブPNGダウンロードエラー:', error);
      alert('ダウンロードに失敗しました: ' + error.message);
    }
  }

  // =========================================
  // バッチ処理メソッド（プレースホルダー）
  // =========================================

  generateBatch() {
    this.parseBatchTextData();
    const count = this.batchData.length;
    const message = count > 0
      ? `バッチ生成は現在準備中です。${count}件の入力内容を確認しました。単体生成をご利用ください。`
      : 'バッチ生成は現在準備中です。1行に1件ずつ入力すると、ここで内容を確認できます。';
    alert(message);
  }

  handleCSVFile(e) {
    const file = e?.target?.files?.[0];
    if (!file || !this.elements.batchTextData) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.elements.batchTextData.value = String(reader.result || '');
      this.parseBatchTextData();
    };
    reader.onerror = () => {
      alert('CSVファイルを読み込めませんでした。');
    };
    reader.readAsText(file);
  }

  parseBatchTextData() {
    const source = this.elements.batchTextData?.value || '';
    this.batchData = source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [content, filename] = line.split(',');
        return {
          content: (content || '').trim(),
          filename: (filename || `qr-code-${index + 1}`).trim()
        };
      })
      .filter((item) => item.content);

    if (this.elements.batchCount) {
      this.elements.batchCount.textContent = String(this.batchData.length);
    }

    if (!this.elements.batchPreview || !this.elements.batchPreviewList) return;

    this.elements.batchPreview.classList.toggle('hidden', this.batchData.length === 0);
    this.elements.batchPreviewList.replaceChildren();

    this.batchData.slice(0, 20).forEach((item) => {
      const row = document.createElement('div');
      row.className = 'px-3 py-2 text-sm text-gray-700 border-b border-gray-100 last:border-b-0';

      const content = document.createElement('div');
      content.className = 'font-medium truncate';
      content.textContent = item.content;

      const filename = document.createElement('div');
      filename.className = 'text-xs text-gray-500 truncate';
      filename.textContent = item.filename;

      row.append(content, filename);
      this.elements.batchPreviewList.appendChild(row);
    });

    if (this.batchData.length > 20) {
      const more = document.createElement('div');
      more.className = 'px-3 py-2 text-xs text-gray-500';
      more.textContent = `ほか ${this.batchData.length - 20} 件`;
      this.elements.batchPreviewList.appendChild(more);
    }
  }

  /**
   * デザインプリセットを適用
   */
  applyDesignPreset(preset) {
    qrDebug.log(`デザインプリセット適用: ${preset}`);
    
    // プリセットに応じて色とグラデーション設定を変更
    const presets = {
      nature: {
        colorMode: 'gradient',
        gradientStart: '#4ade80', // green-400
        gradientEnd: '#3b82f6',   // blue-500
        gradientDirection: 'to-r'
      },
      sunset: {
        colorMode: 'gradient',
        gradientStart: '#fb923c', // orange-400
        gradientEnd: '#ef4444',   // red-500
        gradientDirection: 'to-r'
      },
      ocean: {
        colorMode: 'gradient',
        gradientStart: '#60a5fa', // blue-400
        gradientEnd: '#14b8a6',   // teal-500
        gradientDirection: 'to-r'
      },
      royal: {
        colorMode: 'gradient',
        gradientStart: '#a78bfa', // purple-400
        gradientEnd: '#ec4899',   // pink-500
        gradientDirection: 'to-r'
      }
    };
    
    const presetConfig = presets[preset];
    if (!presetConfig) return;
    
    // カラーモードをグラデーションに設定
    if (this.elements.colorMode) {
      this.elements.colorMode.value = presetConfig.colorMode;
      this.currentColorMode = presetConfig.colorMode;
    }
    
    // グラデーション色を設定
    if (this.elements.gradientStart) {
      this.elements.gradientStart.value = presetConfig.gradientStart;
    }
    if (this.elements.gradientEnd) {
      this.elements.gradientEnd.value = presetConfig.gradientEnd;
    }
    if (this.elements.gradientDirection) {
      this.elements.gradientDirection.value = presetConfig.gradientDirection;
    }
    
    // UIの表示を更新
    this.updateColorModeUI();
    
    // プリセットボタンのアクティブ状態を更新
    this.elements.presetBtns?.forEach(btn => {
      btn.classList.remove('border-accent', 'bg-accent/10');
      if (btn.dataset.preset === preset) {
        btn.classList.add('border-accent', 'bg-accent/10');
      }
    });
    
    // QRコードが生成済みなら再描画
    if (this.qrData && this.designMode === 'creative') {
      this.renderCreativeQR();
      this.updateDownloadPreview();
    }
  }

  /**
   * カラーモードUIを更新
   */
  updateColorModeUI() {
    // カラーモードに応じてUIを更新
    if (this.currentColorMode === 'solid') {
      this.elements.gradientSettings?.classList.add('hidden');
      this.elements.foregroundColor?.classList.remove('hidden');
    } else {
      this.elements.gradientSettings?.classList.remove('hidden');
      this.elements.foregroundColor?.classList.add('hidden');
    }
  }
}

// === 統合QRコード生成ツール - グローバルインスタンス作成 ===
qrDebug.log('🔄 QRGeneratorインスタンス作成開始');

try {
  // DOM読み込み完了を確認してからインスタンス作成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.qrGeneratorInstance = new QRGenerator();
      qrDebug.log('✅ QRGeneratorインスタンス作成成功');
    });
  } else {
    window.qrGeneratorInstance = new QRGenerator();
    qrDebug.log('✅ QRGeneratorインスタンス作成成功');
  }
} catch (error) {
  console.error('❌ QRGeneratorインスタンス作成失敗:', error);
}

qrDebug.log('🏁 QRGenerator読み込み完了');
