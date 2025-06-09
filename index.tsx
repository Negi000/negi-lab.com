/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Make types available on window for inline scripts if necessary
declare global {
  interface Window {
    pageTitleTranslationKey?: string;
    metaDescriptionTranslationKey?: string;
    QRCode: any; // For qrcode.js library
    translations?: Record<string, Record<string, string>>; // To provide translations to inline scripts
  }
  interface Document {
    title_translation_key?: string;
    meta_description_translation_key?: string;
  }
}

const translations = {
  ja: {
    "page.title": "negi-lab.com - 便利ツール＆ゲーム情報ポータル",
    "meta.description": "日々の作業をもっとラクに、遊びも快適に。便利なウェブツールやゲーム攻略Wikiが見つかる、negi-lab.comの公式ポータル。",
    "header.nav.tools": "ツール",
    "header.nav.wikis": "ゲームWiki",
    "option.ja": "日本語",
    "option.en": "英語",
    "hero.title_html": "毎日に<b class=\"text-accent\">“ちょうどいい”</b>便利さと<br>楽しさを。",
    "hero.subtitle_html": "negi-lab.comは、<b class=\"text-accent\">作業効率化</b>や<b class=\"text-accent\">ちょっとした手助け</b>がほしい人、<br><b class=\"text-accent\">ゲームを深く楽しみたい人</b>に向けた<br class=\"hidden md:inline\">ウェブツール＆情報サービスのポータルです。",
    "hero.cta": "ツールを使ってみる",
    "tools.sectionTitle": "便利ツール集",
    "tools.unitConverter.title": "単位変換ツール",
    "tools.unitConverter.description": "長さ・重さ・温度などの単位を日常や学習、仕事に合わせて簡単に変換。",
    "tools.unitConverter.open": "開く",
    "tools.imageConverter.title": "画像変換ツール",
    "tools.imageConverter.description": "画像をJPEG/PNG/WebP形式に変換。品質やサイズも調整可能。",
    "tools.imageConverter.open": "開く",
    "tools.qrGenerator.title": "QRコード作成",
    "tools.qrGenerator.description": "URLやテキストからQRコードを即時生成。エラー訂正レベルや色、サイズもカスタマイズ可能。",
    "tools.qrGenerator.open": "開く",
    "tools.urlShortener.title": "URL短縮ツール",
    "tools.urlShortener.description": "長いURLをワンクリックで短縮。統計ログ機能も利用可能。",
    "tools.urlShortener.open": "開く",
    "tools.adPlaceholder": "AD / サポートバナー表示枠",
    "wikis.sectionTitle": "ゲーム攻略Wiki",
    "wikis.shingetsu.title": "新月同行 Wiki",
    "wikis.shingetsu.description": "話題のスマホRPG「新月同行」の最新情報・データベース・攻略・ランキングなどを掲載。",
    "wikis.shingetsu.languageBadge": "日本語限定",
    "wikis.shingetsu.open": "Wikiを見る",
    "about.sectionTitle": "negi-lab.com について",
    "about.paragraph1": "このサイトは「誰でも気軽に使える」「ちょっと楽しい」をコンセプトに、管理人が個人で制作・運営しています。",
    "about.paragraph2_html": "ツールや情報はこれからも随時追加・改善予定。<br>「こんな機能がほしい」「使ってみた感想」など、気軽にご意見・ご要望をお寄せください。",
    "about.copyrightLine": "Copyright &copy; 2025 negi-lab.com",
    "footer.copyrightLine": "&copy; 2025 negi-lab.com",
    "footer.contactPrefix": "お問い合わせ:",

    "unitConverter.pageTitle": "単位変換ツール - negi-lab.com",
    "unitConverter.metaDescription": "長さ、重さ、温度などの単位を簡単に変換できるツール。日常や学習、仕事に役立ちます。",
    "unitConverter.mainTitle": "単位変換",
    "unitConverter.categoryLabel": "カテゴリ:",
    "unitConverter.category.length": "長さ",
    "unitConverter.category.weight": "重さ",
    "unitConverter.category.temperature": "温度",
    "unitConverter.inputValueLabel": "入力値:",
    "unitConverter.fromUnitLabel": "変換元:",
    "unitConverter.toUnitLabel": "変換先:",
    "unitConverter.resultLabel": "結果:",
    "unitConverter.swapButton": "単位を入れ替え",
    "unitConverter.length.meters": "メートル (m)",
    "unitConverter.length.kilometers": "キロメートル (km)",
    "unitConverter.length.centimeters": "センチメートル (cm)",
    "unitConverter.length.millimeters": "ミリメートル (mm)",
    "unitConverter.length.miles": "マイル (mi)",
    "unitConverter.length.yards": "ヤード (yd)",
    "unitConverter.length.feet": "フィート (ft)",
    "unitConverter.length.inches": "インチ (in)",
    "unitConverter.weight.kilograms": "キログラム (kg)",
    "unitConverter.weight.grams": "グラム (g)",
    "unitConverter.weight.milligrams": "ミリグラム (mg)",
    "unitConverter.weight.pounds": "ポンド (lb)",
    "unitConverter.weight.ounces": "オンス (oz)",
    "unitConverter.temperature.celsius": "摂氏 (°C)",
    "unitConverter.temperature.fahrenheit": "華氏 (°F)",
    "unitConverter.temperature.kelvin": "ケルビン (K)",
    "unitConverter.error.invalidTempInput": "無効な温度入力です。正しい値を入力してください（例：ケルビンは0以上）。",


    "imageConverter.pageTitle": "画像変換ツール - negi-lab.com",
    "imageConverter.metaDescription": "画像のフォーマットをJPEG, PNG, WebPに変換。品質や最大寸法も指定可能。簡単アップロードですぐに使える画像コンバーター。",
    "imageConverter.mainTitle": "画像変換ツール",
    "imageConverter.uploadLabel": "画像ファイルをアップロード:",
    "imageConverter.outputFormatLabel": "出力フォーマット:",
    "imageConverter.formatJPEG": "JPEG",
    "imageConverter.formatPNG": "PNG",
    "imageConverter.formatWebP": "WebP",
    "imageConverter.qualityLabel": "品質 (JPEG/WebP):",
    "imageConverter.maxDimensionsLabel": "最大寸法 (任意):",
    "imageConverter.maxWidthLabel": "最大幅 (px):",
    "imageConverter.maxHeightLabel": "最大高さ (px):",
    "imageConverter.convertButton": "変換する",
    "imageConverter.downloadButton": "ダウンロード",
    "imageConverter.convertingMessage": "変換中...",
    "imageConverter.previewAlt": "画像プレビュー",
    "imageConverter.noImageSelected": "変換する画像を選択してください。",
    "imageConverter.error.fileType": "非対応のファイル形式です。JPEG, PNG, GIF, WebPファイルをアップロードしてください。",
    "imageConverter.error.generic": "変換中にエラーが発生しました。",
    "imageConverter.dropInstructions": "ここにファイルをドラッグ＆ドロップ<br>またはクリックして選択",
    "imageConverter.imageTooLarge": "ファイルサイズが大きすぎます。",
    "imageConverter.error.invalidDimensions": "無効な寸法です。正の数値を入力してください。",

    "qrGenerator.pageTitle": "QRコード作成ツール - negi-lab.com",
    "qrGenerator.metaDescription": "テキストやURLから簡単にカスタムQRコードを生成。サイズ、色、エラー訂正レベルも調整可能です。",
    "qrGenerator.mainTitle": "QRコード作成ツール",
    "qrGenerator.dataLabel": "データ (テキストまたはURL):",
    "qrGenerator.sizeLabel": "サイズ (px):",
    "qrGenerator.fgColorLabel": "前景色:",
    "qrGenerator.bgColorLabel": "背景色:",
    "qrGenerator.errorCorrectionLabel": "エラー訂正レベル:",
    "qrGenerator.errorCorrection.L": "低 (L ~7%)",
    "qrGenerator.errorCorrection.M": "中 (M ~15%)",
    "qrGenerator.errorCorrection.Q": "中高 (Q ~25%)",
    "qrGenerator.errorCorrection.H": "高 (H ~30%)",
    "qrGenerator.generateButton": "QRコードを生成",
    "qrGenerator.downloadButton": "PNGでダウンロード",
    "qrGenerator.qrAlt": "生成されたQRコード",
    "qrGenerator.generatingMessage": "生成中...",
    "qrGenerator.error.emptyInput": "QRコードにしたいテキストまたはURLを入力してください。",
    "qrGenerator.error.generic": "QRコードの生成中にエラーが発生しました。",

    "urlShortener.pageTitle": "URL短縮ツール - negi-lab.com",
    "urlShortener.metaDescription": "長いURLを短く使いやすいリンクに変換。is.gd APIを利用したシンプルなURL短縮サービス。統計ログ機能付き。",
    "urlShortener.mainTitle": "URL短縮ツール",
    "urlShortener.longUrlLabel": "元のURL:",
    "urlShortener.enableStatsLabel": "統計ログを有効にする:",
    "urlShortener.shortenButton": "短縮する",
    "urlShortener.shortUrlLabel": "短縮URL:",
    "urlShortener.copyButton": "コピー",
    "urlShortener.copiedMessage": "コピーしました！",
    "urlShortener.shorteningMessage": "短縮中...",
    "urlShortener.error.invalidUrl": "有効なURLを入力してください。",
    "urlShortener.error.apiError": "URLの短縮に失敗しました。しばらくしてからもう一度お試しください。",
    "urlShortener.placeholder": "例: https://www.example.com/very/long/url",
    "urlShortener.statsLinkLabel": "統計:",
    "urlShortener.statsLinkText": "統計ページを見る",
    "urlShortener.statsNotEnabled": "このURLでは統計ログが有効になっていません。",
    "urlShortener.statsInfo": "注意: 統計はis.gdによって提供され、更新に時間がかかる場合があります。",


    "comingSoon.message": "この機能は現在準備中です。もうしばらくお待ちください。"
  },
  en: {
    "page.title": "negi-lab.com - Utility Tools & Game Info Portal",
    "meta.description": "Make your daily tasks easier and gaming more enjoyable. Find useful web tools and game strategy wikis on the official negi-lab.com portal.",
    "header.nav.tools": "Tools",
    "header.nav.wikis": "Game Wikis",
    "option.ja": "Japanese",
    "option.en": "English",
    "hero.title_html": "The <b>“just right”</b> convenience and <br>fun for your everyday.",
    "hero.subtitle_html": "negi-lab.com is a portal for web tools & information services <br>for those who want to <b>improve work efficiency</b>, need a <b>little help</b>, <br class=\"hidden md:inline\">or want to <b>enjoy games more deeply</b>.",
    "hero.cta": "Try Tools",
    "tools.sectionTitle": "Useful Tool Collection",
    "tools.unitConverter.title": "Unit Converter",
    "tools.unitConverter.description": "Easily convert units like length, weight, and temperature for daily life, study, or work.",
    "tools.unitConverter.open": "Open",
    "tools.imageConverter.title": "Image Converter",
    "tools.imageConverter.description": "Convert images to JPEG/PNG/WebP format. Adjust quality and dimensions with an easy upload interface.",
    "tools.imageConverter.open": "Open",
    "tools.qrGenerator.title": "QR Code Generator",
    "tools.qrGenerator.description": "Instantly generate QR codes from URLs or text. Customize error correction level, colors, and size.",
    "tools.qrGenerator.open": "Open",
    "tools.urlShortener.title": "URL Shortener",
    "tools.urlShortener.description": "Shorten long URLs with a single click. Get simple, shareable links with optional stats logging.",
    "tools.urlShortener.open": "Open",
    "tools.adPlaceholder": "AD / Support Banner Space",
    "wikis.sectionTitle": "Game Strategy Wikis",
    "wikis.shingetsu.title": "NewMoon Guide Wiki",
    "wikis.shingetsu.description": "Latest information, database, strategies, rankings, etc., for the popular mobile RPG 'NewMoon Guide'.",
    "wikis.shingetsu.languageBadge": "Japanese Only",
    "wikis.shingetsu.open": "View Wiki",
    "about.sectionTitle": "About negi-lab.com",
    "about.paragraph1": "This site is personally created and operated by the administrator with the concept of 'easy for anyone to use' and 'a little fun'.",
    "about.paragraph2_html": "Tools and information will continue to be added and improved. <br>Please feel free to send us your opinions and requests, such as 'I want this feature' or 'Here are my thoughts on using it'.",
    "about.copyrightLine": "Copyright &copy; 2025 negi-lab.com",
    "footer.copyrightLine": "&copy; 2025 negi-lab.com",
    "footer.contactPrefix": "Contact:",

    "unitConverter.pageTitle": "Unit Converter - negi-lab.com",
    "unitConverter.metaDescription": "An easy-to-use tool for converting units of length, weight, temperature, and more. Useful for daily life, study, and work.",
    "unitConverter.mainTitle": "Unit Converter",
    "unitConverter.categoryLabel": "Category:",
    "unitConverter.category.length": "Length",
    "unitConverter.category.weight": "Weight",
    "unitConverter.category.temperature": "Temperature",
    "unitConverter.inputValueLabel": "Input Value:",
    "unitConverter.fromUnitLabel": "From Unit:",
    "unitConverter.toUnitLabel": "To Unit:",
    "unitConverter.resultLabel": "Result:",
    "unitConverter.swapButton": "Swap Units",
    "unitConverter.length.meters": "Meters (m)",
    "unitConverter.length.kilometers": "Kilometers (km)",
    "unitConverter.length.centimeters": "Centimeters (cm)",
    "unitConverter.length.millimeters": "Millimeters (mm)",
    "unitConverter.length.miles": "Miles (mi)",
    "unitConverter.length.yards": "Yards (yd)",
    "unitConverter.length.feet": "Feet (ft)",
    "unitConverter.length.inches": "Inches (in)",
    "unitConverter.weight.kilograms": "Kilograms (kg)",
    "unitConverter.weight.grams": "Grams (g)",
    "unitConverter.weight.milligrams": "Milligrams (mg)",
    "unitConverter.weight.pounds": "Pounds (lb)",
    "unitConverter.weight.ounces": "Ounces (oz)",
    "unitConverter.temperature.celsius": "Celsius (°C)",
    "unitConverter.temperature.fahrenheit": "Fahrenheit (°F)",
    "unitConverter.temperature.kelvin": "Kelvin (K)",
    "unitConverter.error.invalidTempInput": "Invalid temperature input. Please enter a valid value (e.g., Kelvin must be non-negative).",

    "imageConverter.pageTitle": "Image Converter - negi-lab.com",
    "imageConverter.metaDescription": "Convert image formats to JPEG, PNG, or WebP. Specify quality and max dimensions. A simple image converter with an easy upload process.",
    "imageConverter.mainTitle": "Image Converter",
    "imageConverter.uploadLabel": "Upload Image File:",
    "imageConverter.outputFormatLabel": "Output Format:",
    "imageConverter.formatJPEG": "JPEG",
    "imageConverter.formatPNG": "PNG",
    "imageConverter.formatWebP": "WebP",
    "imageConverter.qualityLabel": "Quality (for JPEG/WebP):",
    "imageConverter.maxDimensionsLabel": "Max Dimensions (optional):",
    "imageConverter.maxWidthLabel": "Max Width (px):",
    "imageConverter.maxHeightLabel": "Max Height (px):",
    "imageConverter.convertButton": "Convert",
    "imageConverter.downloadButton": "Download",
    "imageConverter.convertingMessage": "Converting...",
    "imageConverter.previewAlt": "Image Preview",
    "imageConverter.noImageSelected": "Please select an image to convert.",
    "imageConverter.error.fileType": "Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP file.",
    "imageConverter.error.generic": "An error occurred during conversion.",
    "imageConverter.dropInstructions": "Drag & drop your file here<br>or click to select",
    "imageConverter.imageTooLarge": "File size is too large.",
    "imageConverter.error.invalidDimensions": "Invalid dimensions. Please enter positive numbers.",

    "qrGenerator.pageTitle": "QR Code Generator - negi-lab.com",
    "qrGenerator.metaDescription": "Easily generate custom QR codes from text or URLs. Adjust size, colors, and error correction level as needed.",
    "qrGenerator.mainTitle": "QR Code Generator",
    "qrGenerator.dataLabel": "Data (Text or URL):",
    "qrGenerator.sizeLabel": "Size (px):",
    "qrGenerator.fgColorLabel": "Foreground Color:",
    "qrGenerator.bgColorLabel": "Background Color:",
    "qrGenerator.errorCorrectionLabel": "Error Correction Level:",
    "qrGenerator.errorCorrection.L": "Low (L ~7%)",
    "qrGenerator.errorCorrection.M": "Medium (M ~15%)",
    "qrGenerator.errorCorrection.Q": "Quartile (Q ~25%)",
    "qrGenerator.errorCorrection.H": "High (H ~30%)",
    "qrGenerator.generateButton": "Generate QR Code",
    "qrGenerator.downloadButton": "Download as PNG",
    "qrGenerator.qrAlt": "Generated QR Code",
    "qrGenerator.generatingMessage": "Generating...",
    "qrGenerator.error.emptyInput": "Please enter text or a URL to generate a QR code.",
    "qrGenerator.error.generic": "An error occurred while generating the QR code.",

    "urlShortener.pageTitle": "URL Shortener - negi-lab.com",
    "urlShortener.metaDescription": "Convert long URLs into short, easy-to-use links with optional statistics logging. A simple URL shortening service using the is.gd API.",
    "urlShortener.mainTitle": "URL Shortener",
    "urlShortener.longUrlLabel": "Original URL:",
    "urlShortener.enableStatsLabel": "Enable statistics logging:",
    "urlShortener.shortenButton": "Shorten",
    "urlShortener.shortUrlLabel": "Shortened URL:",
    "urlShortener.copyButton": "Copy",
    "urlShortener.copiedMessage": "Copied!",
    "urlShortener.shorteningMessage": "Shortening...",
    "urlShortener.error.invalidUrl": "Please enter a valid URL.",
    "urlShortener.error.apiError": "Failed to shorten URL. Please try again later.",
    "urlShortener.placeholder": "e.g., https://www.example.com/very/long/url",
    "urlShortener.statsLinkLabel": "Stats:",
    "urlShortener.statsLinkText": "View Stats Page",
    "urlShortener.statsNotEnabled": "Statistics logging was not enabled for this URL.",
    "urlShortener.statsInfo": "Note: Statistics are provided by is.gd and may take a moment to update.",

    "comingSoon.message": "This feature is currently under construction. Please wait a little longer."
  }
};

// Expose translations to window for inline scripts if they need it.
window.translations = translations;

type Language = keyof typeof translations;

function applyTranslations(lang: Language) {
  const langTranslations = translations[lang] as Record<string, string>;

  const pageTitleKey = document.title_translation_key || window.pageTitleTranslationKey || "page.title";
  const metaDescKey = document.meta_description_translation_key || window.metaDescriptionTranslationKey || "meta.description";


  // Page title
  const titleElement = document.querySelector('title');
  if (titleElement && langTranslations[pageTitleKey]) {
    titleElement.textContent = langTranslations[pageTitleKey];
  } else if (titleElement && langTranslations["page.title"]) { // Fallback to generic portal title
     titleElement.textContent = langTranslations["page.title"];
  }


  // Meta description
  const metaDescElement = document.querySelector('meta[name="description"]');
  if (metaDescElement && langTranslations[metaDescKey]) {
     metaDescElement.setAttribute('content', langTranslations[metaDescKey]);
  } else if (metaDescElement && langTranslations["meta.description"]) { // Fallback to generic portal meta
    metaDescElement.setAttribute('content', langTranslations["meta.description"]);
  }


  document.querySelectorAll<HTMLElement>('[data-translate-key]').forEach(element => {
    const key = element.dataset.translateKey;
    if (key && langTranslations[key]) {
      // Handle specific elements that might need different update logic (e.g. button title)
      if (element.tagName === 'BUTTON' && element.dataset.translateKeyTitle) {
         element.title = langTranslations[key]; // If a button also wants its title attribute translated by same key
      } else if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'checkbox' && element.nextElementSibling && element.nextElementSibling.tagName === 'LABEL') {
        // For checkboxes where the label is a sibling, often the key is on the label or a parent.
        // This specific logic might be too broad; usually the label itself has data-translate-key.
        // Assuming the key is on the element itself for general textContent.
        element.textContent = langTranslations[key];
      }
      else {
        element.textContent = langTranslations[key];
      }
    } else if (key && element.tagName === 'OPTION' && element.parentElement instanceof HTMLOptGroupElement && element.parentElement.dataset.translateKey) {
      // Special case for optgroup options if parent optgroup has a key, let it handle it or ignore
    } else if (key) {
      // console.warn(`Translation key "${key}" not found for language "${lang}".`);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-translate-html-key]').forEach(element => {
    const key = element.dataset.translateHtmlKey;
    if (key && langTranslations[key]) {
      element.innerHTML = langTranslations[key];
    } else if (key) {
      // console.warn(`Translation HTML key "${key}" not found for language "${lang}".`);
    }
  });

  // For elements that might have their placeholder translated
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-translate-placeholder-key]').forEach(element => {
    const key = element.dataset.translatePlaceholderKey;
    if (key && langTranslations[key]) {
      element.placeholder = langTranslations[key];
    }
  });

   // For elements that might have their title attribute translated
  document.querySelectorAll<HTMLElement>('[data-translate-title-key]').forEach(element => {
    const key = element.dataset.translateTitleKey;
    if (key && langTranslations[key]) {
      element.title = langTranslations[key];
    }
  });
}

function setLanguage(lang: Language) {
  if (!translations[lang]) {
    console.warn(`Language "${lang}" not found in translations. Defaulting to 'ja'.`);
    lang = 'ja';
  }
  
  // Ensure page-specific keys are captured if set on window by the HTML page
  document.title_translation_key = window.pageTitleTranslationKey || document.title_translation_key;
  document.meta_description_translation_key = window.metaDescriptionTranslationKey || document.meta_description_translation_key;


  applyTranslations(lang);
  document.documentElement.lang = lang;
  localStorage.setItem('selectedLanguage', lang);
  
  const langSwitch = document.getElementById('lang-switch') as HTMLSelectElement | null;
  if (langSwitch) {
    langSwitch.value = lang;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('lang-switch') as HTMLSelectElement | null;

  // 1. localStorage優先、なければブラウザ言語、なければja
  let detectedLang: Language = 'ja';
  const savedLang = localStorage.getItem('selectedLanguage') as Language | null;
  if (savedLang && translations[savedLang]) {
    detectedLang = savedLang;
  } else if (navigator.language) {
    if (navigator.language.startsWith('en')) detectedLang = 'en';
    else if (navigator.language.startsWith('ja')) detectedLang = 'ja';
  }

  // 2. <select>と<html lang>を必ず同期
  if (langSwitch) {
    langSwitch.value = detectedLang;
    langSwitch.addEventListener('change', (e) => {
      setLanguage((e.target as HTMLSelectElement).value as Language);
    });
    setLanguage(detectedLang);
  } else {
    setLanguage(detectedLang);
  }
});

export {};
