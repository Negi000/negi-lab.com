/**
 * i18n.js - 多言語対応コアモジュール
 * 
 * 使い方:
 * 1. HTMLに <script src="i18n.js"></script> を追加
 * 2. t('nav.home') でUI文字列を取得
 * 3. getLang() で現在の言語コードを取得
 * 4. getDataPath('character_list.json') でデータパスを取得
 * 
 * URL例:
 * - characters.html        → 日本語（デフォルト）
 * - characters.html?lang=en → 英語
 */

// グローバル変数
let I18N_LANGUAGES = null;  // languages.json
let I18N_UI = null;         // ui.json
let I18N_CURRENT_LANG = 'ja';
let I18N_READY = false;
let I18N_READY_CALLBACKS = [];

/**
 * 初期化（ページ読み込み時に自動実行）
 */
async function initI18n() {
    try {
        // 言語設定とUI文字列を並列読み込み
        const [langRes, uiRes] = await Promise.all([
            fetch('i18n/languages.json'),
            fetch('i18n/ui.json')
        ]);
        
        I18N_LANGUAGES = await langRes.json();
        I18N_UI = await uiRes.json();
        
        // URLパラメータまたはlocalStorageから言語を決定
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const storedLang = localStorage.getItem('wiki_lang');
        
        // 優先順位: URL > localStorage > デフォルト
        let targetLang = urlLang || storedLang || I18N_LANGUAGES.default;
        
        // 有効な言語かチェック
        const validLang = I18N_LANGUAGES.languages.find(
            l => l.code === targetLang && l.enabled
        );
        if (!validLang) {
            targetLang = I18N_LANGUAGES.default;
        }
        
        I18N_CURRENT_LANG = targetLang;
        localStorage.setItem('wiki_lang', targetLang);
        
        // HTML lang属性を更新
        document.documentElement.lang = targetLang;
        
        // 準備完了
        I18N_READY = true;
        
        // 待機中のコールバックを実行
        I18N_READY_CALLBACKS.forEach(cb => cb());
        I18N_READY_CALLBACKS = [];
        
        // 言語セレクタを初期化（存在する場合）
        initLanguageSelector();
        
        // data-i18n属性を持つ要素を翻訳
        translatePage();
        
        console.log(`[i18n] Initialized: ${targetLang}`);
        
    } catch (error) {
        console.error('[i18n] Failed to initialize:', error);
        // フォールバック: 日本語のまま動作
        I18N_CURRENT_LANG = 'ja';
        I18N_READY = true;
        
        // エラー時も待機中のコールバックを実行
        I18N_READY_CALLBACKS.forEach(cb => cb());
        I18N_READY_CALLBACKS = [];
    }
}

/**
 * 現在の言語コードを取得
 */
function getLang() {
    return I18N_CURRENT_LANG;
}

/**
 * UI文字列を取得（フォールバック対応）
 * @param {string} key - キー（例: 'nav.home'）
 * @param {object} params - 置換パラメータ（例: {count: 143}）
 */
function t(key, params = {}) {
    if (!I18N_UI || !I18N_UI[key]) {
        console.warn(`[i18n] Missing key: ${key}`);
        return key;
    }
    
    const entry = I18N_UI[key];
    let text = entry[I18N_CURRENT_LANG];
    
    // フォールバック
    if (!text && I18N_LANGUAGES) {
        text = entry[I18N_LANGUAGES.fallback];
    }
    if (!text) {
        text = entry['ja'] || key;
    }
    
    // パラメータ置換（{count} → 143）
    for (const [param, value] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    }
    
    return text;
}

/**
 * データファイルのパスを取得（言語別ディレクトリ対応）
 * @param {string} filename - ファイル名（例: 'character_list.json'）
 */
function getDataPath(filename) {
    // details/などのサブディレクトリ対応
    return `data/${I18N_CURRENT_LANG}/${filename}`;
}

/**
 * 言語を変更
 * @param {string} langCode - 言語コード
 */
function setLang(langCode) {
    const validLang = I18N_LANGUAGES.languages.find(
        l => l.code === langCode && l.enabled
    );
    if (!validLang) {
        console.warn(`[i18n] Invalid language: ${langCode}`);
        return;
    }
    
    localStorage.setItem('wiki_lang', langCode);
    
    // URLパラメータを更新してリロード
    const url = new URL(window.location.href);
    if (langCode === I18N_LANGUAGES.default) {
        url.searchParams.delete('lang');
    } else {
        url.searchParams.set('lang', langCode);
    }
    window.location.href = url.toString();
}

/**
 * 言語セレクタを初期化
 */
function initLanguageSelector() {
    const selectors = document.querySelectorAll('.language-selector');
    console.log('[i18n] initLanguageSelector called, found', selectors.length, 'selectors');
    if (!selectors.length || !I18N_LANGUAGES) return;
    
    const enabledLangs = I18N_LANGUAGES.languages.filter(l => l.enabled);
    console.log('[i18n] Current lang:', I18N_CURRENT_LANG, 'Enabled langs:', enabledLangs.map(l => l.code));
    
    selectors.forEach(selector => {
        selector.innerHTML = enabledLangs.map(lang => 
            `<option value="${lang.code}" ${lang.code === I18N_CURRENT_LANG ? 'selected' : ''}>
                ${lang.nativeName}
            </option>`
        ).join('');
        
        selector.addEventListener('change', (e) => {
            setLang(e.target.value);
        });
    });
}

/**
 * data-i18n属性を持つ要素を翻訳
 */
function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const params = el.getAttribute('data-i18n-params');
        const parsedParams = params ? JSON.parse(params) : {};
        
        // HTMLを含む場合はinnerHTMLを使用、そうでなければtextContent
        const translated = t(key, parsedParams);
        if (translated.includes('<') && translated.includes('>')) {
            el.innerHTML = translated;
        } else {
            el.textContent = translated;
        }
    });
    
    // placeholder用
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // aria-label用
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        el.setAttribute('aria-label', t(key));
    });
}

/**
 * i18n準備完了時にコールバックを実行
 */
function onI18nReady(callback) {
    if (I18N_READY) {
        callback();
    } else {
        I18N_READY_CALLBACKS.push(callback);
    }
}

/**
 * 有効な言語リストを取得
 */
function getEnabledLanguages() {
    if (!I18N_LANGUAGES) return [];
    return I18N_LANGUAGES.languages.filter(l => l.enabled);
}

/**
 * URLに言語パラメータを付与（リンク生成用）
 */
function localizeUrl(url) {
    if (I18N_CURRENT_LANG === I18N_LANGUAGES?.default) {
        return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}lang=${I18N_CURRENT_LANG}`;
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initI18n);

// グローバル公開
window.i18n = {
    t,
    getLang,
    setLang,
    getDataPath,
    onReady: onI18nReady,
    getEnabledLanguages,
    localizeUrl
};
