/**
 * Universal Translation System for Tools
 * 各ツール共通の翻訳システム
 */

// Get translations from any available source
function getTranslations() {
  // Check for unit converter specific translations first
  if (window.unitConverterTranslations) {
    return window.unitConverterTranslations;
  }
  // Fallback to generic translations
  if (window.translations) {
    return window.translations;
  }
  return null;
}

// Get current language
function getLanguage() {
  return localStorage.getItem('selectedLanguage') || document.documentElement.lang || 'ja';
}

// Translation helper function (like t() in other frameworks)
function t(key, fallback = '') {
  const lang = getLanguage();
  const translationData = getTranslations();
  
  if (translationData && translationData[lang] && translationData[lang][key]) {
    return translationData[lang][key];
  }
  
  // Fallback to Japanese if English not found
  if (lang === 'en' && translationData && translationData['ja'] && translationData['ja'][key]) {
    return translationData['ja'][key];
  }
  
  return fallback || key;
}

// Universal translation system function
function applyToolTranslations(lang) {
  console.log(`Applying tool translations for language: ${lang}`);
  
  const translationData = getTranslations();
  if (!translationData || !translationData[lang]) {
    console.warn(`Translations not available for language: ${lang}`);
    return;
  }

  const translations = translationData[lang];
  console.log(`Found ${Object.keys(translations).length} translation keys`);

  // Handle regular data-translate-key elements
  const regularElements = document.querySelectorAll('[data-translate-key]');
  console.log(`Found ${regularElements.length} elements with data-translate-key`);
  
  regularElements.forEach(element => {
    const key = element.getAttribute('data-translate-key');
    if (translations[key]) {
      element.textContent = translations[key];
    } else {
      console.warn(`Translation key not found: ${key}`);
    }
  });

  // Handle HTML content with data-translate-html-key
  const htmlElements = document.querySelectorAll('[data-translate-html-key]');
  console.log(`Found ${htmlElements.length} elements with data-translate-html-key`);
  
  htmlElements.forEach(element => {
    const key = element.getAttribute('data-translate-html-key');
    if (translations[key]) {
      element.innerHTML = translations[key];
    } else {
      console.warn(`Translation HTML key not found: ${key}`);
    }
  });

  // Update document language
  document.documentElement.lang = lang;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && translations['metaDescription']) {
    metaDescription.setAttribute('content', translations['metaDescription']);
  }

  // Update page title
  if (translations['pageTitle']) {
    document.title = translations['pageTitle'];
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

  // If a dedicated translation system exists on the page, skip generic init to avoid conflicts/timeouts
  if (window.imageConverterTranslations || window.ImageConverterTranslationSystem) {
    console.log('Dedicated translation system detected; skipping generic translation initialization.');
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
