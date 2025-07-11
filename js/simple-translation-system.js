/**
 * シンプル翻訳システム
 * 音楽生成ツール用
 */

let currentLanguage = 'ja';
let translationData = {};

/**
 * 翻訳システムの初期化
 * @param {Object} translations - 翻訳データオブジェクト
 */
function initTranslationSystem(translations) {
  translationData = translations;
  
  // URLパラメータから言語を取得
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && translationData[langParam]) {
    currentLanguage = langParam;
  }
  
  // 翻訳を適用
  applyTranslations();
  
  // 言語切り替えイベントの設定
  setupLanguageSwitcher();
  
  console.log('✅ 翻訳システム初期化完了:', currentLanguage);
}

/**
 * 翻訳を適用
 */
function applyTranslations() {
  const elements = document.querySelectorAll('[data-translate-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate-key');
    const translation = getTranslation(key);
    
    if (translation) {
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translation;
      } else if (element.tagName === 'META') {
        element.content = translation;
      } else if (element.tagName === 'TITLE') {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
}

/**
 * 翻訳文字列を取得
 * @param {string} key - 翻訳キー
 * @returns {string} 翻訳文字列
 */
function getTranslation(key) {
  if (!translationData[currentLanguage]) {
    return key;
  }
  
  const keys = key.split('.');
  let value = translationData[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * 言語切り替えイベントの設定
 */
function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('[data-lang]');
  
  langButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = button.getAttribute('data-lang');
      switchLanguage(newLang);
    });
  });
}

/**
 * 言語を切り替え
 * @param {string} language - 言語コード
 */
function switchLanguage(language) {
  if (translationData[language]) {
    currentLanguage = language;
    applyTranslations();
    
    // URLパラメータを更新
    const url = new URL(window.location);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
    
    console.log('🌐 言語切り替え:', language);
  }
}

/**
 * 現在の言語を取得
 * @returns {string} 現在の言語コード
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * 翻訳データを取得
 * @returns {Object} 翻訳データ
 */
function getTranslationData() {
  return translationData;
}

// グローバルに公開
window.initTranslationSystem = initTranslationSystem;
window.getTranslation = getTranslation;
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.getTranslationData = getTranslationData;
