/**
 * テキスト変換ツール専用翻訳データ & システム
 * @description text-converter.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// テキスト変換ツール用翻訳データ
window.textConverterTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': 'テキスト変換ツール - 大文字小文字・全角半角・文字コード変換 | negi-lab.com',
        'metaDescription': '大文字小文字変換、全角半角変換、文字コード変換、改行コード変換、HTMLエンコード・デコード、URLエンコード・デコード、Base64エンコード・デコードなど豊富なテキスト変換機能。',
        
        // メインタイトル
        'mainTitle': '多機能テキスト変換ツール',
        'subtitle': '大文字小文字・全角半角・文字コード・エンコード変換対応',
        'description': '様々なテキスト変換機能を一つのツールで。プログラミング・Web開発に便利',
        
        // 変換カテゴリ
        'category.title': '変換カテゴリ',
        'category.case': '大文字小文字',
        'category.width': '全角半角',
        'category.encoding': 'エンコード',
        'category.linebreak': '改行コード',
        'category.format': 'フォーマット',
        'category.special': '特殊変換',
        
        // 入力エリア
        'input.title': '変換元テキスト',
        'input.placeholder': 'ここに変換したいテキストを入力してください',
        'input.wordCount': '文字数: {0}',
        'input.lineCount': '行数: {0}',
        'input.clear': 'クリア',
        'input.paste': '貼り付け',
        'input.selectAll': '全選択',
        
        // 出力エリア
        'output.title': '変換後テキスト',
        'output.placeholder': '変換結果がここに表示されます',
        'output.copy': 'コピー',
        'output.download': 'ダウンロード',
        'output.clear': 'クリア',
        
        // 大文字小文字変換
        'case.uppercase': '大文字変換',
        'case.lowercase': '小文字変換',
        'case.capitalize': '単語の先頭を大文字',
        'case.sentence': '文の先頭を大文字',
        'case.toggle': '大文字小文字切り替え',
        'case.camelCase': 'camelCase',
        'case.pascalCase': 'PascalCase',
        'case.snakeCase': 'snake_case',
        'case.kebabCase': 'kebab-case',
        
        // 全角半角変換
        'width.toFullWidth': '半角→全角',
        'width.toHalfWidth': '全角→半角',
        'width.alphanumeric': '英数字のみ',
        'width.kana': 'カナのみ',
        'width.symbols': '記号のみ',
        'width.spaces': 'スペースのみ',
        'width.all': 'すべて',
        
        // エンコード変換
        'encoding.htmlEncode': 'HTMLエンコード',
        'encoding.htmlDecode': 'HTMLデコード',
        'encoding.urlEncode': 'URLエンコード',
        'encoding.urlDecode': 'URLデコード',
        'encoding.base64Encode': 'Base64エンコード',
        'encoding.base64Decode': 'Base64デコード',
        'encoding.unicodeEscape': 'Unicode エスケープ',
        'encoding.unicodeUnescape': 'Unicode アンエスケープ',
        
        // 改行コード変換
        'linebreak.toCRLF': 'CRLF (Windows)',
        'linebreak.toLF': 'LF (Unix/Mac)',
        'linebreak.toCR': 'CR (旧Mac)',
        'linebreak.remove': '改行削除',
        'linebreak.normalize': '改行正規化',
        
        // フォーマット変換
        'format.removeSpaces': 'スペース削除',
        'format.removeExtraSpaces': '余分なスペース削除',
        'format.addSpaces': 'スペース挿入',
        'format.trimLines': '行の前後空白削除',
        'format.removeEmptyLines': '空行削除',
        'format.addLineNumbers': '行番号追加',
        'format.removeLineNumbers': '行番号削除',
        'format.reverse': '文字列反転',
        'format.sort': '行ソート',
        'format.unique': '重複行削除',
        
        // 特殊変換
        'special.hiraganaToKatakana': 'ひらがな→カタカナ',
        'special.katakanaToHiragana': 'カタカナ→ひらがな',
        'special.romajiToHiragana': 'ローマ字→ひらがな',
        'special.hiraganaToRomaji': 'ひらがな→ローマ字',
        'special.extractNumbers': '数字抽出',
        'special.extractEmails': 'メール抽出',
        'special.extractUrls': 'URL抽出',
        'special.wordCount': '単語数カウント',
        'special.charFrequency': '文字頻度',
        
        // 設定オプション
        'options.title': '変換オプション',
        'options.preserveCase': '大文字小文字保持',
        'options.preserveSpaces': 'スペース保持',
        'options.preserveLinebreaks': '改行保持',
        'options.trimWhitespace': '前後空白削除',
        'options.skipEmpty': '空行をスキップ',
        
        // ボタン
        'button.convert': '変換実行',
        'button.clear': 'クリア',
        'button.copy': 'コピー',
        'button.paste': '貼り付け',
        'button.download': 'ダウンロード',
        'button.upload': 'ファイル読み込み',
        'button.undo': '元に戻す',
        'button.redo': 'やり直し',
        'button.selectAll': '全選択',
        
        // ファイル操作
        'file.upload': 'ファイルアップロード',
        'file.download': 'ファイルダウンロード',
        'file.fileName': 'ファイル名:',
        'file.encoding': '文字エンコード:',
        'file.format': 'ファイル形式:',
        'file.maxSize': '最大ファイルサイズ: 10MB',
        
        // 履歴機能
        'history.title': '変換履歴',
        'history.clear': '履歴クリア',
        'history.empty': '履歴がありません',
        'history.restore': '復元',
        'history.delete': '削除',
        
        // プリセット
        'preset.title': 'プリセット',
        'preset.webDev': 'Web開発用',
        'preset.dataClean': 'データクリーニング',
        'preset.textFormat': 'テキスト整形',
        'preset.coding': 'プログラミング',
        'preset.japanese': '日本語処理',
        
        // 統計情報
        'stats.title': 'テキスト統計',
        'stats.characters': '文字数',
        'stats.charactersNoSpaces': '文字数（空白除く）',
        'stats.words': '単語数',
        'stats.lines': '行数',
        'stats.paragraphs': '段落数',
        'stats.bytes': 'バイト数',
        
        // メッセージ
        'message.converted': '変換しました',
        'message.copied': 'コピーしました',
        'message.cleared': 'クリアしました',
        'message.uploaded': 'ファイルを読み込みました',
        'message.downloaded': 'ダウンロードしました',
        'message.error': 'エラーが発生しました',
        'message.emptyInput': '入力テキストが空です',
        'message.fileTooLarge': 'ファイルサイズが大きすぎます',
        'message.invalidFile': '無効なファイルです',
        'message.encodingError': 'エンコードエラーが発生しました',
        
        // ガイド
        'guide.title': '使い方ガイド',
        'guide.step1': '1. 変換したいテキストを入力',
        'guide.step2': '2. 変換カテゴリを選択',
        'guide.step3': '3. 変換ボタンをクリック',
        'guide.step4': '4. 結果をコピーまたはダウンロード',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': '対応している文字エンコードは？',
        'faq.a1': 'UTF-8、Shift_JIS、EUC-JP、ISO-2022-JP等の主要エンコードに対応しています。',
        'faq.q2': '処理できるテキストサイズの上限は？',
        'faq.a2': 'ブラウザのメモリ制限内であれば処理できますが、快適な動作のため数MB以下を推奨します。',
        'faq.q3': 'ファイルの内容は外部に送信されますか？',
        'faq.a3': 'いいえ、すべての処理はブラウザ内で完結します。',
        
        // ショートカット
        'shortcut.title': 'キーボードショートカット',
        'shortcut.copy': 'Ctrl+C: コピー',
        'shortcut.paste': 'Ctrl+V: 貼り付け',
        'shortcut.selectAll': 'Ctrl+A: 全選択',
        'shortcut.clear': 'Ctrl+L: クリア',
        'shortcut.convert': 'Ctrl+Enter: 変換実行'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'Text Converter Tool - Case, Width, Character Code Conversion | negi-lab.com',
        'metaDescription': 'Comprehensive text conversion tool featuring case conversion, full/half-width conversion, character encoding, line break conversion, HTML encode/decode, URL encode/decode, Base64 encode/decode.',
        
        // メインタイトル
        'mainTitle': 'Multi-Function Text Converter',
        'subtitle': 'Case, Width, Character Code, and Encoding Conversion',
        'description': 'Various text conversion functions in one tool. Convenient for programming and web development',
        
        // 変換カテゴリ
        'category.title': 'Conversion Category',
        'category.case': 'Case Conversion',
        'category.width': 'Width Conversion',
        'category.encoding': 'Encoding',
        'category.linebreak': 'Line Breaks',
        'category.format': 'Format',
        'category.special': 'Special Conversion',
        
        // 入力エリア
        'input.title': 'Source Text',
        'input.placeholder': 'Enter text to convert here',
        'input.wordCount': 'Characters: {0}',
        'input.lineCount': 'Lines: {0}',
        'input.clear': 'Clear',
        'input.paste': 'Paste',
        'input.selectAll': 'Select All',
        
        // 出力エリア
        'output.title': 'Converted Text',
        'output.placeholder': 'Conversion result will be displayed here',
        'output.copy': 'Copy',
        'output.download': 'Download',
        'output.clear': 'Clear',
        
        // 大文字小文字変換
        'case.uppercase': 'UPPERCASE',
        'case.lowercase': 'lowercase',
        'case.capitalize': 'Capitalize Words',
        'case.sentence': 'Sentence case',
        'case.toggle': 'tOGGLE cASE',
        'case.camelCase': 'camelCase',
        'case.pascalCase': 'PascalCase',
        'case.snakeCase': 'snake_case',
        'case.kebabCase': 'kebab-case',
        
        // 全角半角変換
        'width.toFullWidth': 'Half → Full Width',
        'width.toHalfWidth': 'Full → Half Width',
        'width.alphanumeric': 'Alphanumeric Only',
        'width.kana': 'Kana Only',
        'width.symbols': 'Symbols Only',
        'width.spaces': 'Spaces Only',
        'width.all': 'All',
        
        // エンコード変換
        'encoding.htmlEncode': 'HTML Encode',
        'encoding.htmlDecode': 'HTML Decode',
        'encoding.urlEncode': 'URL Encode',
        'encoding.urlDecode': 'URL Decode',
        'encoding.base64Encode': 'Base64 Encode',
        'encoding.base64Decode': 'Base64 Decode',
        'encoding.unicodeEscape': 'Unicode Escape',
        'encoding.unicodeUnescape': 'Unicode Unescape',
        
        // 改行コード変換
        'linebreak.toCRLF': 'CRLF (Windows)',
        'linebreak.toLF': 'LF (Unix/Mac)',
        'linebreak.toCR': 'CR (Old Mac)',
        'linebreak.remove': 'Remove Line Breaks',
        'linebreak.normalize': 'Normalize Line Breaks',
        
        // フォーマット変換
        'format.removeSpaces': 'Remove Spaces',
        'format.removeExtraSpaces': 'Remove Extra Spaces',
        'format.addSpaces': 'Add Spaces',
        'format.trimLines': 'Trim Line Whitespace',
        'format.removeEmptyLines': 'Remove Empty Lines',
        'format.addLineNumbers': 'Add Line Numbers',
        'format.removeLineNumbers': 'Remove Line Numbers',
        'format.reverse': 'Reverse Text',
        'format.sort': 'Sort Lines',
        'format.unique': 'Remove Duplicate Lines',
        
        // 特殊変換
        'special.hiraganaToKatakana': 'Hiragana → Katakana',
        'special.katakanaToHiragana': 'Katakana → Hiragana',
        'special.romajiToHiragana': 'Romaji → Hiragana',
        'special.hiraganaToRomaji': 'Hiragana → Romaji',
        'special.extractNumbers': 'Extract Numbers',
        'special.extractEmails': 'Extract Emails',
        'special.extractUrls': 'Extract URLs',
        'special.wordCount': 'Word Count',
        'special.charFrequency': 'Character Frequency',
        
        // 設定オプション
        'options.title': 'Conversion Options',
        'options.preserveCase': 'Preserve Case',
        'options.preserveSpaces': 'Preserve Spaces',
        'options.preserveLinebreaks': 'Preserve Line Breaks',
        'options.trimWhitespace': 'Trim Whitespace',
        'options.skipEmpty': 'Skip Empty Lines',
        
        // ボタン
        'button.convert': 'Convert',
        'button.clear': 'Clear',
        'button.copy': 'Copy',
        'button.paste': 'Paste',
        'button.download': 'Download',
        'button.upload': 'Upload File',
        'button.undo': 'Undo',
        'button.redo': 'Redo',
        'button.selectAll': 'Select All',
        
        // ファイル操作
        'file.upload': 'File Upload',
        'file.download': 'File Download',
        'file.fileName': 'File Name:',
        'file.encoding': 'Character Encoding:',
        'file.format': 'File Format:',
        'file.maxSize': 'Max file size: 10MB',
        
        // 履歴機能
        'history.title': 'Conversion History',
        'history.clear': 'Clear History',
        'history.empty': 'No history available',
        'history.restore': 'Restore',
        'history.delete': 'Delete',
        
        // プリセット
        'preset.title': 'Presets',
        'preset.webDev': 'Web Development',
        'preset.dataClean': 'Data Cleaning',
        'preset.textFormat': 'Text Formatting',
        'preset.coding': 'Programming',
        'preset.japanese': 'Japanese Processing',
        
        // 統計情報
        'stats.title': 'Text Statistics',
        'stats.characters': 'Characters',
        'stats.charactersNoSpaces': 'Characters (no spaces)',
        'stats.words': 'Words',
        'stats.lines': 'Lines',
        'stats.paragraphs': 'Paragraphs',
        'stats.bytes': 'Bytes',
        
        // メッセージ
        'message.converted': 'Text converted successfully',
        'message.copied': 'Copied to clipboard',
        'message.cleared': 'Content cleared',
        'message.uploaded': 'File uploaded successfully',
        'message.downloaded': 'File downloaded successfully',
        'message.error': 'An error occurred',
        'message.emptyInput': 'Input text is empty',
        'message.fileTooLarge': 'File size too large',
        'message.invalidFile': 'Invalid file',
        'message.encodingError': 'Encoding error occurred',
        
        // ガイド
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Enter text to convert',
        'guide.step2': '2. Select conversion category',
        'guide.step3': '3. Click convert button',
        'guide.step4': '4. Copy or download result',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'What character encodings are supported?',
        'faq.a1': 'Major encodings including UTF-8, Shift_JIS, EUC-JP, and ISO-2022-JP are supported.',
        'faq.q2': 'What is the text size limit?',
        'faq.a2': 'Text can be processed within browser memory limits, but a few MB or less is recommended for optimal performance.',
        'faq.q3': 'Is file content sent to external servers?',
        'faq.a3': 'No, all processing is done within your browser.',
        
        // ショートカット
        'shortcut.title': 'Keyboard Shortcuts',
        'shortcut.copy': 'Ctrl+C: Copy',
        'shortcut.paste': 'Ctrl+V: Paste',
        'shortcut.selectAll': 'Ctrl+A: Select All',
        'shortcut.clear': 'Ctrl+L: Clear',
        'shortcut.convert': 'Ctrl+Enter: Convert'
    }
};

/**
 * テキスト変換ツール専用翻訳システムクラス
 */
class TextConverterTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.textConverterTranslations;
        this.init();
    }
    
    init() {
        // 共通翻訳システムから言語設定を継承
        if (window.commonTranslationSystem) {
            this.currentLanguage = window.commonTranslationSystem.getCurrentLanguage();
        } else {
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
            console.warn(`Language "${lang}" not supported in Text Converter`);
            return;
        }
        
        this.currentLanguage = lang;
        this.translatePage();
    }
    
    translatePage() {
        const elements = document.querySelectorAll('[data-translate-key], [data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate-key') || element.getAttribute('data-i18n');
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
    
    formatString(template, ...args) {
        return template.replace(/\{(\d+)\}/g, (match, index) => {
            return args[index] !== undefined ? args[index] : match;
        });
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// グローバルインスタンス作成
document.addEventListener('DOMContentLoaded', () => {
    window.textConverterTranslationSystem = new TextConverterTranslationSystem();
});
