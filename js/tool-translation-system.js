/**
 * Universal Translation System for Tools
 * 各ツール共通の翻訳システム
 */

// Get translations from any available source
function getTranslations() {
  // QRコード生成ツール専用翻訳を最優先
  if (window.qrGeneratorTranslations) {
    return window.qrGeneratorTranslations;
  }
  // Check for unit converter specific translations first
  if (window.unitConverterTranslations) {
    return window.unitConverterTranslations;
  }
  // Color code tool specific translations
  if (window.colorCodeToolTranslations) {
    return window.colorCodeToolTranslations;
  }
  if (window.colorCodeTranslations) {
    return window.colorCodeTranslations;
  }
  // Fallback to generic translations
  if (window.translations) {
    return window.translations;
  }
  return null;
}

// Get current language
function getLanguage() {
  return (
    localStorage.getItem('selectedLanguage') ||
    localStorage.getItem('negi-lab-language') ||
    document.documentElement.lang ||
    'ja'
  );
}

// Global language switcher shim to unify language change across tools
function initGlobalLanguageSwitchShim() {
  if (window.__langSwitchShimInitialized) return;
  const langSwitch = document.getElementById('lang-switch');
  const saved = getLanguage();
  if (langSwitch) {
    langSwitch.value = saved;
    langSwitch.addEventListener('change', function() {
      const lang = this.value;
      try {
        localStorage.setItem('selectedLanguage', lang);
        localStorage.setItem('negi-lab-language', lang);
      } catch (_) { /* ignore */ }
      document.documentElement.lang = lang;
      // Notify any tool-specific systems
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      // If a dedicated translator exists, ask it to update immediately
      if (window.dateCalculatorTranslationSystem && typeof window.dateCalculatorTranslationSystem.setLanguage === 'function') {
        window.dateCalculatorTranslationSystem.setLanguage(lang);
      }
      if (window.ImageConverterTranslationSystem && typeof window.ImageConverterTranslationSystem.setLanguage === 'function') {
        window.ImageConverterTranslationSystem.setLanguage(lang);
      }
      if (window.colorCodeTranslationSystem && typeof window.colorCodeTranslationSystem.setLanguage === 'function') {
        window.colorCodeTranslationSystem.setLanguage(lang);
      }
      // Generic apply as fallback
      const translations = getTranslations();
      if (translations && typeof window.applyToolTranslations === 'function') {
        window.applyToolTranslations(lang);
      }
      // Always apply portal base translations for shared header/footer keys
      if (typeof window.applyPortalBaseTranslations === 'function') {
        window.applyPortalBaseTranslations(lang);
      }
    });
  }
  window.__langSwitchShimInitialized = true;
}

// Resolve a translation value from available sources (tool-specific -> portal) 
function resolveTranslation(lang, key) {
  // 1) Tool-specific (qr/unit/generic merged window.translations might contain page-specific keys)
  const data = getTranslations();
  if (data && data[lang] && Object.prototype.hasOwnProperty.call(data[lang], key)) {
    return data[lang][key];
  }
  // 2) Portal/global translations as fallback
  if (window.translations && window.translations[lang] && Object.prototype.hasOwnProperty.call(window.translations[lang], key)) {
    return window.translations[lang][key];
  }
  // 3) Japanese fallback if English missing
  if (lang === 'en') {
    if (data && data.ja && Object.prototype.hasOwnProperty.call(data.ja, key)) {
      return data.ja[key];
    }
    if (window.translations && window.translations.ja && Object.prototype.hasOwnProperty.call(window.translations.ja, key)) {
      return window.translations.ja[key];
    }
  }
  return undefined;
}

// Translation helper function (like t() in other frameworks)
function t(key, fallback = '') {
  const lang = getLanguage();
  const value = resolveTranslation(lang, key);
  if (typeof value === 'string') return value;
  return fallback || key;
}

// Universal translation system function
function applyToolTranslations(lang) {
  console.log(`Applying tool translations for language: ${lang}`);
  
  const translationData = getTranslations() || window.translations; // try portal as generic source
  if (!translationData || !translationData[lang]) {
    console.warn(`Translations not available for language: ${lang}`);
    return;
  }

  const translations = translationData[lang];
  console.log(`Found ${Object.keys(translations).length} translation keys in primary dictionary`);

  // Handle regular data-translate-key elements
  const regularElements = document.querySelectorAll('[data-translate-key]');
  console.log(`Found ${regularElements.length} elements with data-translate-key`);
  
  regularElements.forEach(element => {
    const key = element.getAttribute('data-translate-key');
    const value = resolveTranslation(lang, key);
    if (typeof value === 'string') {
      element.textContent = value;
    } else {
      console.warn(`Translation key not found: ${key}`);
    }
  });

  // Handle HTML content with data-translate-html-key
  const htmlElements = document.querySelectorAll('[data-translate-html-key]');
  console.log(`Found ${htmlElements.length} elements with data-translate-html-key`);
  
  htmlElements.forEach(element => {
    const key = element.getAttribute('data-translate-html-key');
    const value = resolveTranslation(lang, key);
    if (typeof value === 'string') {
      element.innerHTML = value;
    } else {
      console.warn(`Translation HTML key not found: ${key}`);
    }
  });

  // Handle placeholders with data-translate-placeholder-key
  const placeholderElements = document.querySelectorAll('[data-translate-placeholder-key]');
  console.log(`Found ${placeholderElements.length} elements with data-translate-placeholder-key`);
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-translate-placeholder-key');
    const value = resolveTranslation(lang, key);
    if (typeof value === 'string') {
      element.setAttribute('placeholder', value);
    } else {
      console.warn(`Translation placeholder key not found: ${key}`);
    }
  });

  // Update document language
  document.documentElement.lang = lang;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    // Prefer explicit page key if provided
    const metaKey = window.metaDescriptionTranslationKey;
    const value = metaKey ? resolveTranslation(lang, metaKey) : (resolveTranslation(lang, 'metaDescription') || translations['metaDescription']);
    if (typeof value === 'string') {
      metaDescription.setAttribute('content', value);
    }
  }

  // Update page title
  const titleKey = window.pageTitleTranslationKey;
  const titleValue = titleKey ? resolveTranslation(lang, titleKey) : (resolveTranslation(lang, 'pageTitle') || translations['pageTitle']);
  if (typeof titleValue === 'string') {
    document.title = titleValue;
  }
}

// Language switching functionality
function initToolLanguageSwitch() {
  console.log('Initializing tool language switch...');
  
  const langSwitch = document.getElementById('lang-switch');
  if (!langSwitch) {
    console.error('Language switch element not found');
    return;
  }

  // Set initial language from localStorage or default to 'ja'
  const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
  console.log(`Setting initial language to: ${savedLang}`);
  langSwitch.value = savedLang;
  
  // Apply translations for the saved language
  const translationData = getTranslations();
  if (translationData) {
    console.log('Applying initial translations...');
    applyToolTranslations(savedLang);
  } else {
    console.warn('Translations not loaded yet');
  }

  // Handle language switch
  langSwitch.addEventListener('change', function() {
    const selectedLang = this.value;
    console.log(`Language switched to: ${selectedLang}`);
    localStorage.setItem('selectedLanguage', selectedLang);
    
    const translationData = getTranslations();
    if (translationData) {
      applyToolTranslations(selectedLang);
      
      // Call additional tool-specific update functions if they exist
      if (typeof window.onLanguageChange === 'function') {
        window.onLanguageChange(selectedLang);
      }
    } else {
      console.error('Translations not available for language switch');
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing tool translation system...');
  // Always initialize language switcher shim so the dropdown works on all tool pages
  initGlobalLanguageSwitchShim();

  // If a dedicated translation system exists on the page, skip generic init to avoid conflicts/timeouts
  if (
    window.imageConverterTranslations ||
    window.ImageConverterTranslationSystem ||
  window.qrGeneratorTranslations || // QRツール専用翻訳データがあるページではスキップ
  window.dateCalculatorTranslations ||
  window.dateCalculatorTranslationSystem || // 日付計算ツール専用翻訳があるページではスキップ
  window.colorCodeTranslations ||
  window.colorCodeToolTranslations ||
  window.colorCodeTranslationSystem // カラーコードツール専用翻訳があるページではスキップ
  ) {
    console.log('Dedicated translation system detected; applying portal base translations and skipping generic init.');
    // Apply portal/shared translations for header/footer even when dedicated systems are used
    const lang = getLanguage();
    if (typeof window.applyPortalBaseTranslations === 'function') {
      window.applyPortalBaseTranslations(lang);
    } else {
      // Minimal inline implementation if function not yet defined
      applyPortalBaseTranslations(lang);
    }
    // 併せてツール側の data-translate-key も初期適用（辞書があれば）
    try {
      if (typeof window.applyToolTranslations === 'function') {
        applyToolTranslations(lang);
      }
    } catch (_) { /* noop */ }
    return;
  }
  
  // Wait for translations to load, then initialize
  const translationData = getTranslations();
  if (translationData) {
    console.log('Translations already loaded, initializing language switch');
    initToolLanguageSwitch();
  } else {
    console.log('Waiting for translations to load...');
    // Fallback: wait a bit for translations to load
    setTimeout(() => {
      const translationData = getTranslations();
      if (translationData) {
        console.log('Translations loaded after timeout, initializing language switch');
        initToolLanguageSwitch();
      } else {
        console.warn('Generic translations not found; if a tool-specific system is present, this is expected.');
      }
    }, 100);
  }
});

// Export for global access
window.applyToolTranslations = applyToolTranslations;
window.initToolLanguageSwitch = initToolLanguageSwitch;
window.getLanguage = getLanguage;
window.t = t;

// Apply only portal/global translations for shared UI (header/footer/title/meta/placeholders)
function applyPortalBaseTranslations(lang) {
  if (!window.translations || !window.translations[lang]) return;
  const map = window.translations[lang];

  // data-translate-key
  document.querySelectorAll('[data-translate-key]').forEach(el => {
    const key = el.getAttribute('data-translate-key');
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      el.textContent = map[key];
    }
  });

  // data-translate-html-key
  document.querySelectorAll('[data-translate-html-key]').forEach(el => {
    const key = el.getAttribute('data-translate-html-key');
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      el.innerHTML = map[key];
    }
  });

  // data-translate-placeholder-key
  document.querySelectorAll('[data-translate-placeholder-key]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder-key');
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      el.setAttribute('placeholder', map[key]);
    }
  });

  // Title and meta via explicit keys if present
  const metaKey = window.metaDescriptionTranslationKey;
  const titleKey = window.pageTitleTranslationKey;
  if (metaKey) {
    const meta = document.querySelector('meta[name="description"]');
    const v = map[metaKey];
    if (meta && typeof v === 'string') meta.setAttribute('content', v);
  }
  if (titleKey) {
    const v = map[titleKey];
    if (typeof v === 'string') document.title = v;
  }
}

// expose
window.applyPortalBaseTranslations = applyPortalBaseTranslations;
