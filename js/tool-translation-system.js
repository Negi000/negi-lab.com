(function(){
  'use strict';

  var STORAGE_KEYS = ['selectedLanguage', 'negi-lab-language', 'preferredLanguage', 'language'];
  var SUPPORTED = { ja: true, en: true };
  var applyingEvent = false;

  function normalizeLanguage(lang) {
    lang = String(lang || '').toLowerCase().slice(0, 2);
    return SUPPORTED[lang] ? lang : 'ja';
  }

  function getLanguage() {
    try {
      var urlLang = new URLSearchParams(location.search).get('lang');
      if (SUPPORTED[normalizeLanguage(urlLang)] && urlLang) return normalizeLanguage(urlLang);
    } catch (_) {}
    for (var i = 0; i < STORAGE_KEYS.length; i++) {
      try {
        var saved = localStorage.getItem(STORAGE_KEYS[i]);
        if (saved) return normalizeLanguage(saved);
      } catch (_) {}
    }
    return normalizeLanguage(document.documentElement.lang || navigator.language || 'ja');
  }

  function persistLanguage(lang) {
    lang = normalizeLanguage(lang);
    for (var i = 0; i < STORAGE_KEYS.length; i++) {
      try { localStorage.setItem(STORAGE_KEYS[i], lang); } catch (_) {}
    }
    document.documentElement.lang = lang;
    return lang;
  }

  function getTranslationSources() {
    return [
      window.qrGeneratorTranslations,
      window.unitConverterTranslations,
      window.imageConverterTranslations,
      window.dateCalculatorTranslations,
      window.colorCodeToolTranslations,
      window.colorCodeTranslations,
      window.bgRemoverTranslations,
      window.faviconOgGenTranslations,
      window.pdfToolTranslations,
      window.textConverterTranslations,
      window.musicGeneratorTranslations,
      window.commonTranslations,
      window.translations
    ].filter(Boolean);
  }

  function lookupObject(obj, key) {
    if (!obj || !key) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];

    var parts = key.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, parts[i])) {
        current = undefined;
        break;
      }
      current = current[parts[i]];
    }
    if (typeof current !== 'undefined') return current;

    // Compatibility for older dictionaries that used un-namespaced keys
    // while HTML already moved to namespaced keys such as pdfTool.pageTitle.
    if (parts.length > 1) {
      return lookupObject(obj, parts.slice(1).join('.'));
    }
    return undefined;
  }

  function resolveTranslation(lang, key) {
    lang = normalizeLanguage(lang);
    var sources = getTranslationSources();
    for (var i = 0; i < sources.length; i++) {
      var table = sources[i];
      var value = lookupObject(table[lang], key);
      if (typeof value === 'string') return value;
    }
    if (lang !== 'ja') {
      for (var j = 0; j < sources.length; j++) {
        var fallbackValue = lookupObject(sources[j].ja, key);
        if (typeof fallbackValue === 'string') return fallbackValue;
      }
    }
    return undefined;
  }

  function t(key, fallback) {
    var value = resolveTranslation(getLanguage(), key);
    return typeof value === 'string' ? value : (fallback || key);
  }

  function applyValue(element, value, mode) {
    if (typeof value !== 'string') return;
    var tag = element.tagName ? element.tagName.toLowerCase() : '';

    if (mode === 'html') {
      element.innerHTML = value;
    } else if (mode === 'placeholder') {
      element.setAttribute('placeholder', value);
    } else if (mode === 'title') {
      element.setAttribute('title', value);
    } else if (mode === 'aria') {
      element.setAttribute('aria-label', value);
    } else if (tag === 'title') {
      element.textContent = value;
      document.title = value;
    } else if (tag === 'meta') {
      element.setAttribute('content', value);
    } else if (tag === 'optgroup') {
      element.setAttribute('label', value);
    } else if (element.hasAttribute && element.hasAttribute('placeholder')) {
      element.setAttribute('placeholder', value);
    } else if (tag === 'input' && /^(button|submit|reset)$/.test(element.type || '')) {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }

  function applyToolTranslations(lang) {
    lang = persistLanguage(lang || getLanguage());

    document.querySelectorAll('[data-translate-key]').forEach(function(element){
      applyValue(element, resolveTranslation(lang, element.getAttribute('data-translate-key')));
    });
    document.querySelectorAll('[data-translate-html-key]').forEach(function(element){
      applyValue(element, resolveTranslation(lang, element.getAttribute('data-translate-html-key')), 'html');
    });
    document.querySelectorAll('[data-translate-placeholder-key]').forEach(function(element){
      applyValue(element, resolveTranslation(lang, element.getAttribute('data-translate-placeholder-key')), 'placeholder');
    });
    document.querySelectorAll('[data-translate-title-key]').forEach(function(element){
      applyValue(element, resolveTranslation(lang, element.getAttribute('data-translate-title-key')), 'title');
    });
    document.querySelectorAll('[data-translate-aria-label-key]').forEach(function(element){
      applyValue(element, resolveTranslation(lang, element.getAttribute('data-translate-aria-label-key')), 'aria');
    });

    var metaKey = window.metaDescriptionTranslationKey;
    var titleKey = window.pageTitleTranslationKey;
    if (metaKey) {
      var meta = document.querySelector('meta[name="description"]');
      applyValue(meta || {}, resolveTranslation(lang, metaKey));
    }
    if (titleKey) {
      var title = resolveTranslation(lang, titleKey);
      if (typeof title === 'string') document.title = title;
    }

    var langSwitch = document.getElementById('lang-switch') || document.getElementById('langSelect');
    if (langSwitch && langSwitch.value !== lang) langSwitch.value = lang;

    if (typeof window.onLanguageChange === 'function') {
      try { window.onLanguageChange(lang); } catch (_) {}
    }
  }

  function setLanguage(lang, options) {
    lang = persistLanguage(lang);
    applyToolTranslations(lang);
    if (!options || options.dispatch !== false) {
      applyingEvent = true;
      try {
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      } finally {
        applyingEvent = false;
      }
    }
  }

  function bindLanguageSelector() {
    var selector = document.getElementById('lang-switch') || document.getElementById('langSelect');
    if (!selector || selector.getAttribute('data-negi-i18n-bound') === '1') return;
    selector.setAttribute('data-negi-i18n-bound', '1');
    selector.value = getLanguage();
    selector.addEventListener('change', function(){
      setLanguage(selector.value);
    });
  }

  function initToolLanguageSwitch() {
    bindLanguageSelector();
    applyToolTranslations(getLanguage());
  }

  function applyPortalBaseTranslations(lang) {
    applyToolTranslations(lang);
  }

  window.NegiI18n = {
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    translate: t,
    apply: applyToolTranslations,
    resolve: resolveTranslation,
    persistLanguage: persistLanguage
  };
  window.getLanguage = getLanguage;
  window.t = t;
  window.applyToolTranslations = applyToolTranslations;
  window.initToolLanguageSwitch = initToolLanguageSwitch;
  window.applyPortalBaseTranslations = applyPortalBaseTranslations;

  window.addEventListener('languageChanged', function(event){
    if (applyingEvent) return;
    var lang = event && event.detail ? event.detail.language : getLanguage();
    applyToolTranslations(lang);
  });

  document.addEventListener('DOMContentLoaded', initToolLanguageSwitch);
})();
