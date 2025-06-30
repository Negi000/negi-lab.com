/**
 * 共通UI要素用翻訳データ & システム
 * @description ヘッダー・ナビ・フッター等の共通UI翻訳
 * @version 1.0.0
 * @author negi-lab.com
 */

// 共通UI翻訳データ
window.commonTranslations = {
    ja: {
        // ナビゲーション
        'nav.tools': 'ツール',
        'nav.wikis': 'ゲームWiki',
        'nav.home': 'ホーム',
        
        // 言語切り替え
        'langSwitch.label': '言語:',
        'langSwitch.ja': '日本語',
        'langSwitch.en': 'English',
        
        // 共通ボタン
        'common.download': 'ダウンロード',
        'common.reset': 'リセット',
        'common.convert': '変換',
        'common.upload': 'アップロード',
        'common.copy': 'コピー',
        'common.clear': 'クリア',
        'common.save': '保存',
        'common.load': '読み込み',
        'common.apply': '適用',
        'common.cancel': 'キャンセル',
        
        // 共通メッセージ
        'common.success': '成功しました',
        'common.error': 'エラーが発生しました',
        'common.loading': '読み込み中...',
        'common.processing': '処理中...',
        'common.complete': '完了',
        'common.noFileSelected': 'ファイルが選択されていません',
        'common.invalidFile': '無効なファイルです',
        'common.fileTooLarge': 'ファイルサイズが大きすぎます',
        
        // フッター
        'footer.copyright': '© 2024 negi-lab.com - All rights reserved',
        'footer.privacy': 'プライバシーポリシー',
        'footer.terms': '利用規約',
        'footer.about': 'サイトについて',
        
        // 独自性・運営方針・免責事項
        'disclaimer.title': 'negi-lab.comの独自性・運営方針・免責事項について',
        'disclaimer.responsibility': '本ツールはnegi-lab.comが責任開発・運営しています。',
        'disclaimer.revenue': '広告・アフィリエイト収益を含みますが、ユーザーの利便性を優先しています。',
        'disclaimer.liability': '精度・安全性には万全を期していますが、利用は自己責任でお願いします。',
        'disclaimer.copyright': '© 2025 negi-lab.com',
        
        // モーダル・UI要素
        'modal.close': '閉じる',
        'guide.modalTitle': 'ガイド',
        
        // ブレッドクラム
        'breadcrumb.home': 'ホーム',
        'breadcrumb.tools': 'ツール',
        
        // 共通リンク
        'common.contact': 'お問い合わせ',
        'common.sitemap': 'サイトマップ',
        'common.privacyPolicy': 'プライバシーポリシー',
        'common.terms': '利用規約',
        'common.about': '運営者情報',
    },
    
    en: {
        // ナビゲーション
        'nav.tools': 'Tools',
        'nav.wikis': 'Game Wikis',
        'nav.home': 'Home',
        
        // 言語切り替え
        'langSwitch.label': 'Language:',
        'langSwitch.ja': '日本語',
        'langSwitch.en': 'English',
        
        // 共通ボタン
        'common.download': 'Download',
        'common.reset': 'Reset',
        'common.convert': 'Convert',
        'common.upload': 'Upload',
        'common.copy': 'Copy',
        'common.clear': 'Clear',
        'common.save': 'Save',
        'common.load': 'Load',
        'common.apply': 'Apply',
        'common.cancel': 'Cancel',
        
        // 共通メッセージ
        'common.success': 'Success',
        'common.error': 'An error occurred',
        'common.loading': 'Loading...',
        'common.processing': 'Processing...',
        'common.complete': 'Complete',
        'common.noFileSelected': 'No file selected',
        'common.invalidFile': 'Invalid file',
        'common.fileTooLarge': 'File size too large',
        
        // フッター
        'footer.copyright': '© 2024 negi-lab.com - All rights reserved',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.about': 'About',
        
        // 独自性・運営方針・免責事項
        'disclaimer.title': 'About negi-lab.com\'s Uniqueness, Management Policy & Disclaimer',
        'disclaimer.responsibility': 'This tool is responsibly developed and operated by negi-lab.com.',
        'disclaimer.revenue': 'While including advertising and affiliate revenue, we prioritize user convenience.',
        'disclaimer.liability': 'Although we strive for accuracy and safety, please use at your own risk.',
        'disclaimer.copyright': '© 2025 negi-lab.com',
        
        // モーダル・UI要素
        'modal.close': 'Close',
        'guide.modalTitle': 'Guide',
        
        // ブレッドクラム
        'breadcrumb.home': 'Home',
        'breadcrumb.tools': 'Tools',
        
        // 共通リンク
        'common.contact': 'Contact',
        'common.sitemap': 'Sitemap',
        'common.privacyPolicy': 'Privacy Policy',
        'common.terms': 'Terms of Service',
        'common.about': 'About',
    }
};

/**
 * 共通翻訳システムクラス
 */
class CommonTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.commonTranslations;
        this.init();
    }
    
    init() {
        // 保存された言語設定を読み込み
        const savedLang = localStorage.getItem('negi-lab-language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        }
        
        // 言語切り替えボタンのイベントリスナー設定
        this.setupLanguageSwitcher();
        
        // 初期翻訳適用
        this.translatePage();
    }
    
    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
        
        // 言語切り替えセレクトボックス対応
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language "${lang}" not supported`);
            return;
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('negi-lab-language', lang);
        
        // ページを翻訳
        this.translatePage();
        
        // 他の翻訳システムにも言語変更を通知
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }
    
    translatePage() {
        const elements = document.querySelectorAll('[data-translate-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName.toLowerCase() === 'input' && 
                    (element.type === 'button' || element.type === 'submit')) {
                    element.value = translation;
                } else if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else if (element.hasAttribute('title')) {
                    element.title = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // アクティブな言語ボタンのスタイル更新
        this.updateLanguageButtons();
    }
    
    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // セレクトボックスの値も更新
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
        }
    }
    
    getTranslation(key) {
        const keys = key.split('.');
        let current = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return current;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// グローバルインスタンス作成（ページ読み込み後）
document.addEventListener('DOMContentLoaded', () => {
    window.commonTranslationSystem = new CommonTranslationSystem();
});
