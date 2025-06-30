/**
 * QRコード生成ツール専用翻訳データ & システム
 * @description qr-code-generator.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// QRコード生成ツール用翻訳データ
window.qrCodeTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': 'QRコード生成ツール - 高品質・多機能・ブラウザ完結型 | negi-lab.com',
        'metaDescription': 'URLやテキストから高品質なQRコードを作成。エラー訂正レベル調整、ロゴ挿入、Wi-Fi設定対応。プライバシー重視のブラウザ完結型で安全にご利用いただけます。技術解説と実用ガイド付き。',
        
        // メインタイトル
        'mainTitle': 'クリエイティブQRコード生成ツール',
        'subtitle': 'URLやテキスト、Wi-Fi設定から高品質なQRコードを簡単作成。ロゴ挿入、色変更、デザインカスタマイズに対応',
        
        // モード選択
        'mode.single': '単体生成',
        'mode.batch': 'バッチ生成',
        'mode.title': '生成モード',
        
        // デザインモード
        'design.title': 'デザインモード',
        'design.standard': '標準モード',
        'design.creative': 'クリエイティブ',
        
        // テンプレート選択
        'template.title': 'テンプレート選択',
        'template.text': 'テキスト',
        'template.url': 'URL',
        'template.wifi': 'Wi-Fi',
        'template.email': 'メール',
        'template.sms': 'SMS',
        'template.phone': '電話',
        'template.vcard': '連絡先',
        
        // 入力フォーム
        'input.text.label': 'テキスト入力:',
        'input.text.placeholder': 'QRコード化したいテキストを入力してください',
        'input.url.label': 'URL:',
        'input.url.placeholder': 'https://example.com',
        'input.wifi.ssid': 'ネットワーク名 (SSID):',
        'input.wifi.password': 'パスワード:',
        'input.wifi.security': 'セキュリティ:',
        'input.email.address': 'メールアドレス:',
        'input.email.subject': '件名:',
        'input.email.body': '本文:',
        'input.sms.number': '電話番号:',
        'input.sms.message': 'メッセージ:',
        'input.phone.number': '電話番号:',
        
        // 設定オプション
        'settings.title': '詳細設定',
        'settings.size': 'サイズ:',
        'settings.errorCorrection': 'エラー訂正レベル:',
        'settings.margin': 'マージン:',
        'settings.foregroundColor': '前景色:',
        'settings.backgroundColor': '背景色:',
        'settings.logo': 'ロゴ画像:',
        'settings.logoSize': 'ロゴサイズ:',
        
        // エラー訂正レベル
        'errorLevel.L': 'L (低)',
        'errorLevel.M': 'M (中)',
        'errorLevel.Q': 'Q (高)',
        'errorLevel.H': 'H (最高)',
        
        // ボタン
        'button.generate': 'QRコード生成',
        'button.download': 'ダウンロード',
        'button.downloadPNG': 'PNG形式',
        'button.downloadSVG': 'SVG形式',
        'button.downloadPDF': 'PDF形式',
        'button.clear': 'クリア',
        'button.reset': 'リセット',
        'button.preview': 'プレビュー',
        'button.batch.upload': 'CSVファイルアップロード',
        'button.batch.download': '一括ダウンロード',
        
        // プレビュー
        'preview.title': 'QRコードプレビュー',
        'preview.size': 'サイズ: {0}x{0}px',
        'preview.errorLevel': 'エラー訂正: {0}',
        'preview.noQR': 'QRコードが生成されていません',
        
        // バッチ処理
        'batch.title': 'バッチ生成',
        'batch.instructions': 'CSVファイルをアップロードして複数のQRコードを一括生成',
        'batch.csvFormat': 'CSVフォーマット: text,filename',
        'batch.example': '例: https://example.com,example_qr',
        'batch.progress': '進捗: {0}/{1}',
        'batch.complete': 'バッチ生成完了',
        'batch.downloading': 'ZIPファイル作成中...',
        
        // メッセージ
        'message.generated': 'QRコードを生成しました',
        'message.downloaded': 'ダウンロードを開始しました',
        'message.error.empty': '入力内容が空です',
        'message.error.invalid': '無効な入力です',
        'message.error.generation': 'QRコード生成に失敗しました',
        'message.error.file': 'ファイルの読み込みに失敗しました',
        'message.error.format': 'CSVファイルの形式が正しくありません',
        
        // ガイドセクション
        'guide.title': '使い方ガイド',
        'guide.step1': '1. テンプレートを選択',
        'guide.step2': '2. 必要な情報を入力',
        'guide.step3': '3. デザイン設定を調整',
        'guide.step4': '4. QRコード生成',
        'guide.step5': '5. ダウンロード',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': 'エラー訂正レベルとは何ですか？',
        'faq.a1': 'QRコードが汚れや破損した際の復元能力です。レベルが高いほど復元力が強くなりますが、データ量も増加します。',
        'faq.q2': 'ロゴを挿入できますか？',
        'faq.a2': 'はい、クリエイティブモードでロゴ画像をアップロードして中央に配置できます。',
        'faq.q3': 'バッチ生成の使い方は？',
        'faq.a3': 'CSVファイル（text,filename形式）をアップロードすることで、複数のQRコードを一括生成できます。',
        
        // セキュリティ
        'security.title': 'プライバシー・セキュリティ',
        'security.offline': 'ブラウザ完結型',
        'security.noUpload': 'データは外部送信されません',
        'security.local': 'すべての処理はローカルで実行'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'QR Code Generator - High Quality & Multi-functional | negi-lab.com',
        'metaDescription': 'Create high-quality QR codes from URLs and text. Features error correction level adjustment, logo insertion, Wi-Fi settings support. Privacy-focused browser-based tool with technical guides.',
        
        // メインタイトル
        'mainTitle': 'Creative QR Code Generator',
        'subtitle': 'Easily create high-quality QR codes from URLs, text, and Wi-Fi settings. Supports logo insertion, color changes, and design customization',
        
        // モード選択
        'mode.single': 'Single Generation',
        'mode.batch': 'Batch Generation',
        'mode.title': 'Generation Mode',
        
        // デザインモード
        'design.title': 'Design Mode',
        'design.standard': 'Standard Mode',
        'design.creative': 'Creative Mode',
        
        // テンプレート選択
        'template.title': 'Template Selection',
        'template.text': 'Text',
        'template.url': 'URL',
        'template.wifi': 'Wi-Fi',
        'template.email': 'Email',
        'template.sms': 'SMS',
        'template.phone': 'Phone',
        'template.vcard': 'Contact',
        
        // 入力フォーム
        'input.text.label': 'Text Input:',
        'input.text.placeholder': 'Enter text to convert to QR code',
        'input.url.label': 'URL:',
        'input.url.placeholder': 'https://example.com',
        'input.wifi.ssid': 'Network Name (SSID):',
        'input.wifi.password': 'Password:',
        'input.wifi.security': 'Security:',
        'input.email.address': 'Email Address:',
        'input.email.subject': 'Subject:',
        'input.email.body': 'Body:',
        'input.sms.number': 'Phone Number:',
        'input.sms.message': 'Message:',
        'input.phone.number': 'Phone Number:',
        
        // 設定オプション
        'settings.title': 'Advanced Settings',
        'settings.size': 'Size:',
        'settings.errorCorrection': 'Error Correction Level:',
        'settings.margin': 'Margin:',
        'settings.foregroundColor': 'Foreground Color:',
        'settings.backgroundColor': 'Background Color:',
        'settings.logo': 'Logo Image:',
        'settings.logoSize': 'Logo Size:',
        
        // エラー訂正レベル
        'errorLevel.L': 'L (Low)',
        'errorLevel.M': 'M (Medium)',
        'errorLevel.Q': 'Q (High)',
        'errorLevel.H': 'H (Highest)',
        
        // ボタン
        'button.generate': 'Generate QR Code',
        'button.download': 'Download',
        'button.downloadPNG': 'PNG Format',
        'button.downloadSVG': 'SVG Format',
        'button.downloadPDF': 'PDF Format',
        'button.clear': 'Clear',
        'button.reset': 'Reset',
        'button.preview': 'Preview',
        'button.batch.upload': 'Upload CSV File',
        'button.batch.download': 'Bulk Download',
        
        // プレビュー
        'preview.title': 'QR Code Preview',
        'preview.size': 'Size: {0}x{0}px',
        'preview.errorLevel': 'Error Correction: {0}',
        'preview.noQR': 'No QR code generated',
        
        // バッチ処理
        'batch.title': 'Batch Generation',
        'batch.instructions': 'Upload CSV file to generate multiple QR codes at once',
        'batch.csvFormat': 'CSV Format: text,filename',
        'batch.example': 'Example: https://example.com,example_qr',
        'batch.progress': 'Progress: {0}/{1}',
        'batch.complete': 'Batch generation complete',
        'batch.downloading': 'Creating ZIP file...',
        
        // メッセージ
        'message.generated': 'QR code generated successfully',
        'message.downloaded': 'Download started',
        'message.error.empty': 'Input is empty',
        'message.error.invalid': 'Invalid input',
        'message.error.generation': 'Failed to generate QR code',
        'message.error.file': 'Failed to read file',
        'message.error.format': 'Invalid CSV file format',
        
        // ガイドセクション
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Select Template',
        'guide.step2': '2. Enter Information',
        'guide.step3': '3. Adjust Design Settings',
        'guide.step4': '4. Generate QR Code',
        'guide.step5': '5. Download',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'What is error correction level?',
        'faq.a1': 'It\'s the ability to restore QR codes when damaged. Higher levels provide better restoration but increase data size.',
        'faq.q2': 'Can I insert a logo?',
        'faq.a2': 'Yes, in Creative Mode you can upload a logo image to place in the center.',
        'faq.q3': 'How to use batch generation?',
        'faq.a3': 'Upload a CSV file (text,filename format) to generate multiple QR codes at once.',
        
        // セキュリティ
        'security.title': 'Privacy & Security',
        'security.offline': 'Browser-based Processing',
        'security.noUpload': 'No data transmitted externally',
        'security.local': 'All processing done locally'
    }
};

/**
 * QRコード生成ツール専用翻訳システムクラス
 */
class QRCodeTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.qrCodeTranslations;
        this.init();
    }
    
    init() {
        // 共通翻訳システムから言語設定を継承
        if (window.commonTranslationSystem) {
            this.currentLanguage = window.commonTranslationSystem.getCurrentLanguage();
        } else {
            // 保存された言語設定を読み込み
            const savedLang = localStorage.getItem('negi-lab-language');
            if (savedLang && this.translations[savedLang]) {
                this.currentLanguage = savedLang;
            }
        }
        
        // 言語変更イベントリスナー
        window.addEventListener('languageChanged', (event) => {
            this.setLanguage(event.detail.language);
        });
        
        // 初期翻訳適用
        this.translatePage();
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language "${lang}" not supported in QR Code tool`);
            return;
        }
        
        this.currentLanguage = lang;
        this.translatePage();
    }
    
    translatePage() {
        // data-i18n属性の要素を翻訳（旧形式のサポート）
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                this.applyTranslation(element, translation);
            }
        });
        
        // data-translate-key属性の要素を翻訳（新形式）
        const translateElements = document.querySelectorAll('[data-translate-key]');
        translateElements.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translation = this.getTranslation(key);
            if (translation) {
                this.applyTranslation(element, translation);
            }
        });
    }
    
    applyTranslation(element, translation) {
        if (element.tagName.toLowerCase() === 'input') {
            if (element.type === 'button' || element.type === 'submit') {
                element.value = translation;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            }
        } else if (element.hasAttribute('placeholder')) {
            element.placeholder = translation;
        } else if (element.hasAttribute('title')) {
            element.title = translation;
        } else if (element.hasAttribute('content')) {
            element.setAttribute('content', translation);
        } else {
            element.innerHTML = translation;
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
    
    // 文字列の置換をサポート（{0}, {1}など）
    formatString(template, ...args) {
        return template.replace(/\{(\d+)\}/g, (match, index) => {
            return args[index] !== undefined ? args[index] : match;
        });
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// グローバルインスタンス作成（ページ読み込み後）
document.addEventListener('DOMContentLoaded', () => {
    window.qrCodeTranslationSystem = new QRCodeTranslationSystem();
});
