/**
 * PDFツール専用翻訳データ & システム
 * @description pdf-tool.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// PDFツール用翻訳データ
window.pdfToolTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': 'PDFツール - 分割・結合・変換・圧縮対応 | negi-lab.com',
        'metaDescription': 'PDFファイルの分割、結合、画像変換、圧縮、回転などを無料で実行。ブラウザ完結型でプライバシー安全。パスワード保護、透かし追加、メタデータ編集も対応。',
        
        // メインタイトル
        'mainTitle': 'PDFツール',
        'subtitle': '分割・結合・変換・圧縮 - すべてブラウザで完結',
        'description': 'PDFファイルの様々な操作を無料で実行。外部アップロード不要でプライバシーも安心',
        
        // 機能選択
        'function.title': '機能選択',
        'function.split': 'PDF分割',
        'function.merge': 'PDF結合',
        'function.compress': 'PDF圧縮',
        'function.convert': '画像変換',
        'function.rotate': 'PDF回転',
        'function.password': 'パスワード保護',
        'function.watermark': '透かし追加',
        'function.metadata': 'メタデータ編集',
        
        // ファイルアップロード
        'upload.title': 'ファイルアップロード',
        'upload.dropzone': 'PDFファイルをここにドラッグ&ドロップ<br>またはクリックして選択',
        'upload.multiple': '複数ファイル対応（結合時）',
        'upload.maxSize': '最大ファイルサイズ: 100MB',
        'upload.supportedFormats': '対応形式: PDF',
        
        // PDF分割
        'split.title': 'PDF分割',
        'split.pageRange': 'ページ範囲指定',
        'split.splitBy': '分割方法:',
        'split.byPages': 'ページ数指定',
        'split.byRange': '範囲指定',
        'split.eachPage': '1ページずつ',
        'split.pages': 'ページ数:',
        'split.from': '開始ページ:',
        'split.to': '終了ページ:',
        'split.preview': '分割プレビュー',
        
        // PDF結合
        'merge.title': 'PDF結合',
        'merge.order': 'ファイル順序',
        'merge.dragReorder': 'ドラッグで順序変更',
        'merge.addFiles': 'ファイル追加',
        'merge.removeFile': 'ファイル削除',
        'merge.fileName': 'ファイル名: {0}',
        'merge.pages': 'ページ数: {0}',
        
        // PDF圧縮
        'compress.title': 'PDF圧縮',
        'compress.quality': '圧縮品質:',
        'compress.high': '高品質（軽い圧縮）',
        'compress.medium': '標準品質（中程度圧縮）',
        'compress.low': '低品質（強い圧縮）',
        'compress.custom': 'カスタム設定',
        'compress.imageQuality': '画像品質:',
        'compress.originalSize': '元のサイズ: {0}',
        'compress.compressedSize': '圧縮後サイズ: {0}',
        'compress.ratio': '圧縮率: {0}%',
        
        // 画像変換
        'convert.title': 'PDF→画像変換',
        'convert.format': '出力形式:',
        'convert.quality': '画像品質:',
        'convert.resolution': '解像度:',
        'convert.pageSelect': 'ページ選択:',
        'convert.allPages': '全ページ',
        'convert.specificPages': '指定ページ',
        'convert.pageNumbers': 'ページ番号（例: 1,3,5-10）:',
        
        // PDF回転
        'rotate.title': 'PDF回転',
        'rotate.angle': '回転角度:',
        'rotate.90cw': '90度右回転',
        'rotate.180': '180度回転',
        'rotate.90ccw': '90度左回転',
        'rotate.pages': '対象ページ:',
        'rotate.allPages': '全ページ',
        'rotate.oddPages': '奇数ページ',
        'rotate.evenPages': '偶数ページ',
        'rotate.specificPages': '指定ページ',
        
        // パスワード保護
        'password.title': 'パスワード保護',
        'password.set': 'パスワード設定',
        'password.remove': 'パスワード解除',
        'password.userPassword': 'ユーザーパスワード:',
        'password.ownerPassword': 'オーナーパスワード:',
        'password.permissions': '権限設定:',
        'password.print': '印刷',
        'password.copy': 'コピー',
        'password.modify': '変更',
        'password.annotate': '注釈',
        
        // 透かし
        'watermark.title': '透かし追加',
        'watermark.type': '透かしタイプ:',
        'watermark.text': 'テキスト透かし',
        'watermark.image': '画像透かし',
        'watermark.textContent': '透かしテキスト:',
        'watermark.imageFile': '透かし画像:',
        'watermark.position': '配置:',
        'watermark.opacity': '透明度:',
        'watermark.rotation': '回転角度:',
        'watermark.size': 'サイズ:',
        
        // メタデータ
        'metadata.title': 'メタデータ編集',
        'metadata.title_field': 'タイトル:',
        'metadata.author': '作成者:',
        'metadata.subject': '件名:',
        'metadata.keywords': 'キーワード:',
        'metadata.creator': '作成アプリケーション:',
        'metadata.producer': '生成者:',
        'metadata.creationDate': '作成日:',
        'metadata.modificationDate': '更新日:',
        
        // ボタン
        'button.process': '処理実行',
        'button.download': 'ダウンロード',
        'button.downloadAll': '全てダウンロード',
        'button.preview': 'プレビュー',
        'button.reset': 'リセット',
        'button.addFile': 'ファイル追加',
        'button.removeFile': 'ファイル削除',
        'button.clear': 'クリア',
        
        // プレビュー
        'preview.title': 'プレビュー',
        'preview.page': 'ページ {0}',
        'preview.totalPages': '全{0}ページ',
        'preview.noPreview': 'プレビューできません',
        'preview.loading': '読み込み中...',
        
        // 進捗・メッセージ
        'progress.processing': '処理中...',
        'progress.uploading': 'アップロード中...',
        'progress.splitting': '分割中...',
        'progress.merging': '結合中...',
        'progress.compressing': '圧縮中...',
        'progress.converting': '変換中...',
        'progress.complete': '処理完了',
        
        'message.success': '処理が完了しました',
        'message.error': 'エラーが発生しました',
        'message.fileRequired': 'ファイルを選択してください',
        'message.invalidFile': '無効なPDFファイルです',
        'message.fileTooLarge': 'ファイルサイズが大きすぎます',
        'message.processingError': '処理中にエラーが発生しました',
        'message.downloadReady': 'ダウンロード準備完了',
        
        // ガイド
        'guide.title': '使い方ガイド',
        'guide.step1': '1. 機能を選択',
        'guide.step2': '2. PDFファイルをアップロード',
        'guide.step3': '3. 設定を調整',
        'guide.step4': '4. 処理を実行',
        'guide.step5': '5. 結果をダウンロード',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': 'ファイルは外部に送信されますか？',
        'faq.a1': 'いいえ、すべての処理はブラウザ内で完結します。ファイルが外部に送信されることはありません。',
        'faq.q2': '処理できるファイルサイズの上限は？',
        'faq.a2': '最大100MBまでのPDFファイルを処理できます。',
        'faq.q3': 'パスワード付きPDFも処理できますか？',
        'faq.a3': 'パスワード解除機能でパスワードを除去した後、他の機能を使用できます。',
        
        // セキュリティ
        'security.title': 'プライバシー・セキュリティ',
        'security.offline': 'オフライン処理',
        'security.noUpload': 'ファイル送信なし',
        'security.browserOnly': 'ブラウザ内完結'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'PDF Tools - Split, Merge, Convert, Compress | negi-lab.com',
        'metaDescription': 'Free PDF file split, merge, image conversion, compression, rotation and more. Browser-based processing ensures privacy. Supports password protection, watermarks, and metadata editing.',
        
        // メインタイトル
        'mainTitle': 'PDF Tools',
        'subtitle': 'Split, Merge, Convert, Compress - All in Your Browser',
        'description': 'Perform various PDF operations for free. No external uploads required, ensuring privacy',
        
        // 機能選択
        'function.title': 'Function Selection',
        'function.split': 'PDF Split',
        'function.merge': 'PDF Merge',
        'function.compress': 'PDF Compress',
        'function.convert': 'Image Convert',
        'function.rotate': 'PDF Rotate',
        'function.password': 'Password Protect',
        'function.watermark': 'Add Watermark',
        'function.metadata': 'Edit Metadata',
        
        // ファイルアップロード
        'upload.title': 'File Upload',
        'upload.dropzone': 'Drag & drop PDF files here<br>or click to select',
        'upload.multiple': 'Multiple files supported (for merging)',
        'upload.maxSize': 'Max file size: 100MB',
        'upload.supportedFormats': 'Supported formats: PDF',
        
        // PDF分割
        'split.title': 'PDF Split',
        'split.pageRange': 'Page Range Specification',
        'split.splitBy': 'Split Method:',
        'split.byPages': 'By Page Count',
        'split.byRange': 'By Range',
        'split.eachPage': 'Each Page',
        'split.pages': 'Page Count:',
        'split.from': 'From Page:',
        'split.to': 'To Page:',
        'split.preview': 'Split Preview',
        
        // PDF結合
        'merge.title': 'PDF Merge',
        'merge.order': 'File Order',
        'merge.dragReorder': 'Drag to reorder',
        'merge.addFiles': 'Add Files',
        'merge.removeFile': 'Remove File',
        'merge.fileName': 'File Name: {0}',
        'merge.pages': 'Pages: {0}',
        
        // PDF圧縮
        'compress.title': 'PDF Compression',
        'compress.quality': 'Compression Quality:',
        'compress.high': 'High Quality (Light Compression)',
        'compress.medium': 'Standard Quality (Medium Compression)',
        'compress.low': 'Low Quality (Strong Compression)',
        'compress.custom': 'Custom Settings',
        'compress.imageQuality': 'Image Quality:',
        'compress.originalSize': 'Original Size: {0}',
        'compress.compressedSize': 'Compressed Size: {0}',
        'compress.ratio': 'Compression Ratio: {0}%',
        
        // 画像変換
        'convert.title': 'PDF to Image Conversion',
        'convert.format': 'Output Format:',
        'convert.quality': 'Image Quality:',
        'convert.resolution': 'Resolution:',
        'convert.pageSelect': 'Page Selection:',
        'convert.allPages': 'All Pages',
        'convert.specificPages': 'Specific Pages',
        'convert.pageNumbers': 'Page Numbers (e.g., 1,3,5-10):',
        
        // PDF回転
        'rotate.title': 'PDF Rotation',
        'rotate.angle': 'Rotation Angle:',
        'rotate.90cw': '90° Clockwise',
        'rotate.180': '180°',
        'rotate.90ccw': '90° Counter-clockwise',
        'rotate.pages': 'Target Pages:',
        'rotate.allPages': 'All Pages',
        'rotate.oddPages': 'Odd Pages',
        'rotate.evenPages': 'Even Pages',
        'rotate.specificPages': 'Specific Pages',
        
        // パスワード保護
        'password.title': 'Password Protection',
        'password.set': 'Set Password',
        'password.remove': 'Remove Password',
        'password.userPassword': 'User Password:',
        'password.ownerPassword': 'Owner Password:',
        'password.permissions': 'Permission Settings:',
        'password.print': 'Print',
        'password.copy': 'Copy',
        'password.modify': 'Modify',
        'password.annotate': 'Annotate',
        
        // 透かし
        'watermark.title': 'Add Watermark',
        'watermark.type': 'Watermark Type:',
        'watermark.text': 'Text Watermark',
        'watermark.image': 'Image Watermark',
        'watermark.textContent': 'Watermark Text:',
        'watermark.imageFile': 'Watermark Image:',
        'watermark.position': 'Position:',
        'watermark.opacity': 'Opacity:',
        'watermark.rotation': 'Rotation Angle:',
        'watermark.size': 'Size:',
        
        // メタデータ
        'metadata.title': 'Metadata Editing',
        'metadata.title_field': 'Title:',
        'metadata.author': 'Author:',
        'metadata.subject': 'Subject:',
        'metadata.keywords': 'Keywords:',
        'metadata.creator': 'Creator Application:',
        'metadata.producer': 'Producer:',
        'metadata.creationDate': 'Creation Date:',
        'metadata.modificationDate': 'Modification Date:',
        
        // ボタン
        'button.process': 'Process',
        'button.download': 'Download',
        'button.downloadAll': 'Download All',
        'button.preview': 'Preview',
        'button.reset': 'Reset',
        'button.addFile': 'Add File',
        'button.removeFile': 'Remove File',
        'button.clear': 'Clear',
        
        // プレビュー
        'preview.title': 'Preview',
        'preview.page': 'Page {0}',
        'preview.totalPages': 'Total {0} pages',
        'preview.noPreview': 'Preview not available',
        'preview.loading': 'Loading...',
        
        // 進捗・メッセージ
        'progress.processing': 'Processing...',
        'progress.uploading': 'Uploading...',
        'progress.splitting': 'Splitting...',
        'progress.merging': 'Merging...',
        'progress.compressing': 'Compressing...',
        'progress.converting': 'Converting...',
        'progress.complete': 'Processing Complete',
        
        'message.success': 'Processing completed successfully',
        'message.error': 'An error occurred',
        'message.fileRequired': 'Please select a file',
        'message.invalidFile': 'Invalid PDF file',
        'message.fileTooLarge': 'File size too large',
        'message.processingError': 'Error occurred during processing',
        'message.downloadReady': 'Download ready',
        
        // ガイド
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Select Function',
        'guide.step2': '2. Upload PDF File',
        'guide.step3': '3. Adjust Settings',
        'guide.step4': '4. Execute Processing',
        'guide.step5': '5. Download Results',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'Are files sent to external servers?',
        'faq.a1': 'No, all processing is done within your browser. Files are never transmitted externally.',
        'faq.q2': 'What is the file size limit?',
        'faq.a2': 'PDF files up to 100MB can be processed.',
        'faq.q3': 'Can password-protected PDFs be processed?',
        'faq.a3': 'Yes, use the password removal function first, then use other features.',
        
        // セキュリティ
        'security.title': 'Privacy & Security',
        'security.offline': 'Offline Processing',
        'security.noUpload': 'No File Transmission',
        'security.browserOnly': 'Browser-Only Processing'
    }
};

/**
 * PDFツール専用翻訳システムクラス
 */
class PDFToolTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.pdfToolTranslations;
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
            console.warn(`Language "${lang}" not supported in PDF tool`);
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
    window.pdfToolTranslationSystem = new PDFToolTranslationSystem();
});
