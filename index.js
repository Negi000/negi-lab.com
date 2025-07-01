/**
 * Portal (index.html) Main JavaScript
 * Handles translation system and language switching
 */

// Translation system function
function applyTranslations(lang) {
  console.log(`Applying translations for language: ${lang}`);
  
  if (!window.translations || !window.translations[lang]) {
    console.warn(`Translations not available for language: ${lang}`);
    return;
  }

  const translations = window.translations[lang];
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
  if (metaDescription && translations['meta.description']) {
    metaDescription.setAttribute('content', translations['meta.description']);
  }

  // Update page title
  if (translations['page.title']) {
    document.title = translations['page.title'];
  }

  // Update aria-label for guide close button
  const guideCloseBtn = document.getElementById('guide-close');
  if (guideCloseBtn && translations['guideModal.closeButton']) {
    guideCloseBtn.setAttribute('aria-label', translations['guideModal.closeButton']);
  }
}

// Language switching functionality
function initLanguageSwitch() {
  console.log('Initializing language switch...');
  
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
  if (window.translations) {
    console.log('Applying initial translations...');
    applyTranslations(savedLang);
  } else {
    console.warn('Translations not loaded yet');
  }

  // Handle language switch
  langSwitch.addEventListener('change', function() {
    const selectedLang = this.value;
    console.log(`Language switched to: ${selectedLang}`);
    localStorage.setItem('selectedLanguage', selectedLang);
    
    if (window.translations) {
      applyTranslations(selectedLang);
    } else {
      console.error('Translations not available for language switch');
    }

    // Update guide modal content if it's open
    const guideModal = document.getElementById('guide-modal');
    if (guideModal && !guideModal.classList.contains('hidden')) {
      // Re-render guide content in new language
      const guideContent = document.getElementById('guide-modal-content');
      if (guideContent && window.renderGuide) {
        window.renderGuide(selectedLang);
      }
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing translation system...');
  
  // Wait for translations to load, then initialize
  if (window.translations) {
    console.log('Translations already loaded, initializing language switch');
    initLanguageSwitch();
  } else {
    console.log('Waiting for translations to load...');
    // Fallback: wait a bit for translations to load
    setTimeout(() => {
      if (window.translations) {
        console.log('Translations loaded after timeout, initializing language switch');
        initLanguageSwitch();
      } else {
        console.error('Translations failed to load after timeout');
      }
    }, 100);
  }
});

// Export for global access
window.applyTranslations = applyTranslations;
window.initLanguageSwitch = initLanguageSwitch;
