/**
 * Translations for the color code tool.
 * Shared by static HTML content and runtime UI messages.
 */
(function initColorCodeToolTranslations() {
  const translations = {
    ja: {
      colorCodeTool: {
        pageTitle: 'カラーコード変換・色抽出ツール - HEX/RGB/HSL/CMYK対応 | negi-lab.com',
        metaDescription: 'HEX、RGB、HSL、CMYKの相互変換、カラーピッカー、画像からの色抽出、配色生成、コントラスト確認をブラウザ内で行える無料カラーツールです。',
        mainTitle: 'カラーコード変換・色抽出ツール',
        lead: 'HEX、RGB、HSL、CMYKの相互変換、画像スポイト、配色生成、アクセシビリティ確認をブラウザ内でまとめて行えます。',
        baseInputTitle: '基本カラー入力',
        selectedColorLabel: '選択中の色',
        pickerLabel: 'カラーピッカー',
        pickerAriaLabel: 'カラーピッカー',
        hexLabel: 'HEX',
        rgbLabel: 'RGB',
        hslLabel: 'HSL',
        cmykLabel: 'CMYK',
        imageSectionTitle: '画像からの色抽出',
        imageLabel: '画像から色を抽出',
        imageInputAriaLabel: '画像ファイルを選択',
        imageCanvasAriaLabel: '画像キャンバス',
        spoitInfo: '画像をクリックすると、その位置のピクセル色を取得できます。SVGは安全性と描画差異を避けるため対象外です。',
        paletteLabel: 'カラーパレット・ハーモニー生成',
        harmonyLabel: 'カラーハーモニー',
        themePaletteLabel: 'テーマパレット',
        randomizeHarmony: 'ランダム生成',
        refinePalette: '微調整',
        saveHarmony: '保存',
        palettePlaceholder: 'ボタンをクリックしてパレットを生成',
        paletteStatsPlaceholder: '色数や明度の傾向をここに表示します。',
        pickedColorTitle: '画像から取得した色',
        pickedColorHint: 'クリックしたピクセルのHEX・RGB・HSLを確認できます。',
        messageAreaLabel: 'ツールからのお知らせ',
        statusReady: '色を入力すると、変換結果とプレビューを更新します。',
        relatedToolsTitle: '関連ツール',
        relatedToolsLead: '色の確認から画像・OGP制作まで、静的サイト制作で使いやすい関連ツールです。',
        relatedImageConverterTitle: '画像変換ツール',
        relatedImageConverterDesc: 'PNG・JPEG・WebPの変換や軽量化をまとめて行えます。',
        relatedFaviconTitle: 'ファビコン・OG画像ジェネレーター',
        relatedFaviconDesc: 'SNSシェアやサイト公開向けの画像をまとめて準備できます。',
        relatedQrTitle: 'QRコード生成ツール',
        relatedQrDesc: '配布用URLや印刷物向けのQRコード作成に使えます。',
        noticeTitle: 'negi-lab.comの運営方針',
        noticeLine1: '本ツールはnegi-lab.comが独自開発・運営しています。',
        noticeLine2: '広告・アフィリエイトを含みますが、作業の邪魔になりにくい構成を心がけています。',
        noticeLine3: '正確性と安全性に配慮していますが、最終確認はご自身の用途に合わせて行ってください。',
        statusColorUpdated: '色を更新しました',
        statusImageLoaded: '画像を読み込みました。キャンバスをクリックして色を取得できます。',
        statusPaletteGenerated: 'パレットを更新しました。',
        statusPaletteCopied: '色をコピーして選択しました。',
        statusPickedColor: '画像から色を抽出しました',
        statusHistorySaved: '色履歴を更新しました。',
        colorNameCustom: 'カスタム色',
        colorInfoTemplate: '{0} ({1})',
        colorInfoTemperatureWarm: '暖色',
        colorInfoTemperatureCool: '寒色',
        colorInfoTemperatureNeutral: '中性色',
        colorInfoPsychologyWarm: '注意・活力',
        colorInfoPsychologyYellow: '明るさ・親しみ',
        colorInfoPsychologyGreen: '自然・安心',
        colorInfoPsychologyBlue: '落ち着き・信頼',
        colorInfoPsychologyPurple: '創造性・洗練',
        colorInfoPsychologyPink: '柔らかさ・印象',
        colorButtonAriaLabel: '{0} を選択してコピー',
        copySuccess: 'コピーしました: {0}',
        imageExtracted: '画像から色を抽出しました: {0}',
        invalidHex: '有効なHEXカラーコードを入力してください。',
        invalidRgb: 'RGBは「rgb(101, 193, 85)」または「101,193,85」の形式で入力してください。',
        invalidHsl: 'HSLは「hsl(100, 47%, 55%)」または「100,47,55」の形式で入力してください。',
        invalidImageType: 'PNG、JPEG、WebP、GIF形式の画像ファイルを選択してください。SVGは対象外です。',
        invalidImageSize: 'ファイルサイズが10MB以下の画像を選択してください。',
        imageLoadFailed: '画像ファイルの読み込みに失敗しました。',
        paletteEmpty: '表示できる色がありません',
        advancedAnalysisTitle: 'パレット分析',
        analysisColorCount: '色数',
        analysisAvgLightness: '平均明度',
        analysisHueRange: '色相範囲',
        analysisSaturationRange: '彩度範囲',
        batchTitleConversion: '変換結果',
        batchTitleValidation: '検証結果',
        batchTitleSorted: 'ソート結果（色相順）',
        batchTitleDefault: '結果',
        batchInputLabel: '入力',
        batchIssuesLabel: '確認事項',
        batchErrorLabel: 'エラー',
        batchStatusOk: 'OK',
        batchStatusNg: 'NG',
        spectrumTitle: 'スペクトラム分析結果',
        spectrumBaseColor: '基準色',
        spectrumType: '分析タイプ',
        spectrumHue: '色相',
        spectrumSaturation: '彩度',
        spectrumLightness: '明度',
        spectrumRgb: 'RGB値',
        spectrumSummary: '要約',
        spectrumTypeHue: '色相分布',
        spectrumTypeSaturation: '彩度分布',
        spectrumTypeLightness: '明度分布',
        spectrumTypeRgb: 'RGB分布',
        toastRoleLabel: '通知'
      }
    },
    en: {
      colorCodeTool: {
        pageTitle: 'Color Code Converter & Image Color Picker - HEX/RGB/HSL/CMYK | negi-lab.com',
        metaDescription: 'A free browser-based color tool for HEX, RGB, HSL, and CMYK conversion, color picking, image color extraction, palette generation, and contrast checks.',
        mainTitle: 'Color Code Converter & Image Color Picker',
        lead: 'Convert HEX, RGB, HSL, and CMYK, pick colors from images, generate palettes, and check accessibility in your browser.',
        baseInputTitle: 'Basic color input',
        selectedColorLabel: 'Selected color',
        pickerLabel: 'Color picker',
        pickerAriaLabel: 'Color picker',
        hexLabel: 'HEX',
        rgbLabel: 'RGB',
        hslLabel: 'HSL',
        cmykLabel: 'CMYK',
        imageSectionTitle: 'Extract color from image',
        imageLabel: 'Extract color from image',
        imageInputAriaLabel: 'Choose an image file',
        imageCanvasAriaLabel: 'Image canvas',
        spoitInfo: 'Click the image to pick the pixel color at that position. SVG is excluded to avoid safety and rendering differences.',
        paletteLabel: 'Color palette and harmony generator',
        harmonyLabel: 'Color harmony',
        themePaletteLabel: 'Theme palette',
        randomizeHarmony: 'Randomize',
        refinePalette: 'Refine',
        saveHarmony: 'Save',
        palettePlaceholder: 'Generate a palette with the buttons above',
        paletteStatsPlaceholder: 'Color count and lightness trends appear here.',
        pickedColorTitle: 'Color picked from image',
        pickedColorHint: 'Review the HEX, RGB, and HSL values for the clicked pixel.',
        messageAreaLabel: 'Tool status',
        statusReady: 'Enter a color to update the conversion result and preview.',
        relatedToolsTitle: 'Related tools',
        relatedToolsLead: 'Useful companion tools for static site work, from color checks to image and OGP creation.',
        relatedImageConverterTitle: 'Image Converter',
        relatedImageConverterDesc: 'Convert and optimize PNG, JPEG, and WebP files in one place.',
        relatedFaviconTitle: 'Favicon & OGP Generator',
        relatedFaviconDesc: 'Prepare share images and site assets for publishing and social previews.',
        relatedQrTitle: 'QR Code Generator',
        relatedQrDesc: 'Create QR codes for shared URLs, print material, and campaign pages.',
        noticeTitle: 'How negi-lab.com operates',
        noticeLine1: 'This tool is independently built and maintained by negi-lab.com.',
        noticeLine2: 'It includes ads and affiliate links, but aims to stay practical and unobtrusive.',
        noticeLine3: 'We care about accuracy and safety, but you should still verify results for your use case.',
        statusColorUpdated: 'Color updated.',
        statusImageLoaded: 'Image loaded. Click the canvas to pick a color.',
        statusPaletteGenerated: 'Palette updated.',
        statusPaletteCopied: 'Color copied and selected.',
        statusPickedColor: 'Picked a color from the image.',
        statusHistorySaved: 'Color history updated.',
        colorNameCustom: 'Custom color',
        colorInfoTemplate: '{0} ({1})',
        colorInfoTemperatureWarm: 'Warm',
        colorInfoTemperatureCool: 'Cool',
        colorInfoTemperatureNeutral: 'Neutral',
        colorInfoPsychologyWarm: 'Attention and energy',
        colorInfoPsychologyYellow: 'Brightness and friendliness',
        colorInfoPsychologyGreen: 'Nature and reassurance',
        colorInfoPsychologyBlue: 'Calm and trust',
        colorInfoPsychologyPurple: 'Creativity and polish',
        colorInfoPsychologyPink: 'Softness and impression',
        colorButtonAriaLabel: 'Select and copy {0}',
        copySuccess: 'Copied: {0}',
        imageExtracted: 'Picked a color from the image: {0}',
        invalidHex: 'Enter a valid HEX color code.',
        invalidRgb: 'Enter RGB as "rgb(101, 193, 85)" or "101,193,85".',
        invalidHsl: 'Enter HSL as "hsl(100, 47%, 55%)" or "100,47,55".',
        invalidImageType: 'Choose a PNG, JPEG, WebP, or GIF image. SVG is excluded.',
        invalidImageSize: 'Choose an image file that is 10 MB or smaller.',
        imageLoadFailed: 'Failed to load the image file.',
        paletteEmpty: 'No colors available to display.',
        advancedAnalysisTitle: 'Palette analysis',
        analysisColorCount: 'Color count',
        analysisAvgLightness: 'Average lightness',
        analysisHueRange: 'Hue range',
        analysisSaturationRange: 'Saturation range',
        batchTitleConversion: 'Conversion result',
        batchTitleValidation: 'Validation result',
        batchTitleSorted: 'Sorted result (by hue)',
        batchTitleDefault: 'Result',
        batchInputLabel: 'Input',
        batchIssuesLabel: 'Issues',
        batchErrorLabel: 'Error',
        batchStatusOk: 'OK',
        batchStatusNg: 'NG',
        spectrumTitle: 'Spectrum analysis result',
        spectrumBaseColor: 'Base color',
        spectrumType: 'Analysis type',
        spectrumHue: 'Hue',
        spectrumSaturation: 'Saturation',
        spectrumLightness: 'Lightness',
        spectrumRgb: 'RGB value',
        spectrumSummary: 'Summary',
        spectrumTypeHue: 'Hue distribution',
        spectrumTypeSaturation: 'Saturation distribution',
        spectrumTypeLightness: 'Lightness distribution',
        spectrumTypeRgb: 'RGB distribution',
        toastRoleLabel: 'Notification'
      }
    }
  };

  function getCurrentLanguage() {
    const systemLanguage = window.commonTranslationSystem?.getCurrentLanguage?.();
    if (systemLanguage && translations[systemLanguage]) {
      return systemLanguage;
    }

    const savedLanguage = localStorage.getItem('selectedLanguage') || localStorage.getItem('negi-lab-language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }

    return document.documentElement.lang === 'en' ? 'en' : 'ja';
  }

  function resolveKey(key, language = getCurrentLanguage()) {
    const normalizedKey = key.startsWith('colorCodeTool.') ? key : `colorCodeTool.${key}`;
    const segments = normalizedKey.split('.');
    let current = translations[language];

    for (const segment of segments) {
      if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, segment)) {
        current = current[segment];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  function formatString(template, ...args) {
    return String(template).replace(/\{(\d+)\}/g, (match, index) => {
      return args[index] !== undefined ? args[index] : match;
    });
  }

  function getTranslation(key, fallback, ...args) {
    const translated = resolveKey(key) || fallback || key;
    return args.length ? formatString(translated, ...args) : translated;
  }

  class ColorCodeTranslationSystem {
    constructor() {
      this.currentLanguage = getCurrentLanguage();
      this.init();
    }

    init() {
      window.addEventListener('languageChanged', (event) => {
        const nextLanguage = event?.detail?.language;
        if (nextLanguage && translations[nextLanguage]) {
          this.currentLanguage = nextLanguage;
          this.translatePage();
        }
      });

      this.translatePage();
    }

    translatePage() {
      const elements = document.querySelectorAll('[data-translate-key], [data-i18n]');
      elements.forEach((element) => {
        const key = element.getAttribute('data-translate-key') || element.getAttribute('data-i18n');
        const translation = resolveKey(key, this.currentLanguage) || key;
        this.applyTranslation(element, translation);
      });
    }

    applyTranslation(element, translation) {
      const attr = element.getAttribute('data-translate-attr');
      if (attr) {
        element.setAttribute(attr, translation);
        return;
      }

      const tagName = element.tagName.toLowerCase();
      if (tagName === 'meta') {
        element.setAttribute('content', translation);
        return;
      }

      if (tagName === 'title') {
        element.textContent = translation;
        document.title = translation;
        return;
      }

      if (tagName === 'input') {
        if (element.type === 'button' || element.type === 'submit') {
          element.value = translation;
        } else {
          element.setAttribute('placeholder', translation);
        }
        return;
      }

      element.textContent = translation;
    }

    getCurrentLanguage() {
      return this.currentLanguage;
    }

    getTranslation(key, fallback, ...args) {
      const translated = resolveKey(key, this.currentLanguage) || fallback || key;
      return args.length ? formatString(translated, ...args) : translated;
    }
  }

  window.colorCodeToolTranslations = translations;
  window.getColorCodeToolTranslation = getTranslation;
  window.ColorCodeTranslationSystem = ColorCodeTranslationSystem;

  document.addEventListener('DOMContentLoaded', () => {
    window.colorCodeTranslationSystem = new ColorCodeTranslationSystem();
  });
})();
