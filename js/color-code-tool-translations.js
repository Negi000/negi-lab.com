/**
 * カラーコードツール専用翻訳データ & システム
 * @description color-code-tool.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// カラーコードツール用翻訳データ
window.colorCodeTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': 'カラーコード変換ツール - HEX・RGB・HSL・CMYK変換 | negi-lab.com',
        'metaDescription': 'HEX、RGB、HSL、CMYK、HSV間の色コード相互変換。カラーピッカー、パレット作成、色の組み合わせ提案、アクセシビリティチェック機能付き。Web・デザイン制作に最適。',
        
        // メインタイトル
        'mainTitle': 'カラーコード変換ツール',
        'subtitle': 'HEX・RGB・HSL・CMYK・HSV 完全対応',
        'description': 'あらゆる色コード形式を相互変換。カラーピッカー、パレット作成、アクセシビリティチェック機能搭載',
        
        // カラーピッカー
        'picker.title': 'カラーピッカー',
        'picker.currentColor': '現在の色',
        'picker.selectColor': '色を選択',
        'picker.eyedropper': 'スポイトツール',
        'picker.random': 'ランダム色',
        'picker.favoriteColors': 'お気に入りの色',
        'picker.recentColors': '最近使った色',
        
        // 色コード入力
        'input.title': '色コード入力',
        'input.hex': 'HEXコード',
        'input.rgb': 'RGB',
        'input.hsl': 'HSL',
        'input.cmyk': 'CMYK',
        'input.hsv': 'HSV',
        'input.colorName': '色名',
        'input.placeholder.hex': '#FFFFFF または FFFFFF',
        'input.placeholder.rgb': 'rgb(255, 255, 255) または 255,255,255',
        'input.placeholder.hsl': 'hsl(0, 100%, 50%) または 0,100,50',
        'input.placeholder.cmyk': 'cmyk(0, 0, 0, 0) または 0,0,0,0',
        'input.placeholder.hsv': 'hsv(0, 100%, 100%) または 0,100,100',
        'input.placeholder.name': 'red, blue, green など',
        
        // 色コード出力
        'output.title': '変換結果',
        'output.hex.upper': 'HEX（大文字）',
        'output.hex.lower': 'HEX（小文字）',
        'output.rgb.decimal': 'RGB（10進数）',
        'output.rgb.percent': 'RGB（パーセント）',
        'output.hsl': 'HSL',
        'output.cmyk': 'CMYK',
        'output.hsv': 'HSV',
        'output.css': 'CSS形式',
        'output.scss': 'SCSS変数',
        'output.swift': 'Swift UIColor',
        'output.android': 'Android Color',
        
        // カラーパレット
        'palette.title': 'カラーパレット',
        'palette.create': 'パレット作成',
        'palette.monochromatic': '単色系',
        'palette.analogous': '類似色',
        'palette.complementary': '補色',
        'palette.triadic': '三角配色',
        'palette.tetradic': '四角配色',
        'palette.splitComplementary': '分裂補色',
        'palette.customPalette': 'カスタムパレット',
        'palette.addColor': '色を追加',
        'palette.removeColor': '色を削除',
        'palette.export': 'パレットエクスポート',
        'palette.import': 'パレットインポート',
        
        // カラーハーモニー
        'harmony.title': 'カラーハーモニー',
        'harmony.generate': 'ハーモニー生成',
        'harmony.baseColor': 'ベースカラー',
        'harmony.scheme': '配色方式',
        'harmony.count': '色の数',
        'harmony.preview': 'プレビュー',
        
        // グラデーション
        'gradient.title': 'グラデーション',
        'gradient.linear': '線形グラデーション',
        'gradient.radial': '円形グラデーション',
        'gradient.angle': '角度',
        'gradient.direction': '方向',
        'gradient.steps': 'ステップ数',
        'gradient.cssCode': 'CSSコード',
        'gradient.preview': 'プレビュー',
        
        // アクセシビリティ
        'accessibility.title': 'アクセシビリティ',
        'accessibility.contrast': 'コントラスト比',
        'accessibility.foreground': 'テキスト色',
        'accessibility.background': '背景色',
        'accessibility.ratioNormal': '通常テキスト',
        'accessibility.ratioLarge': '大きなテキスト',
        'accessibility.wcagAA': 'WCAG AA準拠',
        'accessibility.wcagAAA': 'WCAG AAA準拠',
        'accessibility.pass': '適合',
        'accessibility.fail': '不適合',
        'accessibility.suggestions': '改善提案',
        
        // 色の情報
        'info.title': '色の詳細情報',
        'info.brightness': '明度',
        'info.lightness': '輝度',
        'info.saturation': '彩度',
        'info.hue': '色相',
        'info.temperature': '色温度',
        'info.warm': '暖色',
        'info.cool': '寒色',
        'info.neutral': '中性色',
        'info.websafe': 'Webセーフカラー',
        'info.colorBlind': '色覚異常での見え方',
        
        // ツール機能
        'tools.title': 'ツール機能',
        'tools.colorMixer': 'カラーミキサー',
        'tools.colorAnalyzer': 'カラー解析',
        'tools.colorExtractor': '画像から色抽出',
        'tools.colorBlindness': '色覚異常シミュレーター',
        'tools.trending': 'トレンドカラー',
        'tools.seasonalColors': '季節の色',
        
        // 設定
        'settings.title': '設定',
        'settings.format': 'デフォルト形式',
        'settings.precision': '精度',
        'settings.uppercase': '大文字表示',
        'settings.copyFormat': 'コピー形式',
        'settings.autoUpdate': '自動更新',
        'settings.showPreview': 'プレビュー表示',
        
        // ボタン・アクション
        'button.convert': '変換',
        'button.copy': 'コピー',
        'button.copyAll': '全てコピー',
        'button.clear': 'クリア',
        'button.random': 'ランダム',
        'button.save': '保存',
        'button.load': '読み込み',
        'button.export': 'エクスポート',
        'button.import': 'インポート',
        'button.addToFavorites': 'お気に入り追加',
        'button.removeFromFavorites': 'お気に入り削除',
        
        // 履歴
        'history.title': '色履歴',
        'history.recent': '最近使用',
        'history.favorites': 'お気に入り',
        'history.clear': '履歴クリア',
        'history.empty': '履歴がありません',
        'history.reuse': '再利用',
        
        // プリセット
        'preset.title': 'プリセットカラー',
        'preset.basic': '基本色',
        'preset.web': 'Web標準色',
        'preset.material': 'マテリアルデザイン',
        'preset.bootstrap': 'Bootstrap',
        'preset.tailwind': 'Tailwind CSS',
        'preset.brand': 'ブランドカラー',
        'preset.nature': '自然の色',
        'preset.seasonal': '季節の色',
        
        // メッセージ
        'message.copied': 'コピーしました',
        'message.saved': '保存しました',
        'message.loaded': '読み込みました',
        'message.exported': 'エクスポートしました',
        'message.imported': 'インポートしました',
        'message.error': 'エラーが発生しました',
        'message.invalidColor': '無効な色コードです',
        'message.invalidFormat': '無効な形式です',
        'message.paletteCreated': 'パレットを作成しました',
        'message.addedToFavorites': 'お気に入りに追加しました',
        
        // ガイド
        'guide.title': '使い方ガイド',
        'guide.step1': '1. 色を選択またはコード入力',
        'guide.step2': '2. 形式を選択して変換',
        'guide.step3': '3. 結果をコピーまたは保存',
        'guide.step4': '4. パレットやハーモニーを活用',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': 'HEXコードの#は必要ですか？',
        'faq.a1': '#は省略可能です。「FFFFFF」または「#FFFFFF」どちらでも認識します。',
        'faq.q2': 'CMYKからRGBへの変換精度は？',
        'faq.a2': '一般的な変換式を使用していますが、印刷時の実際の色とは若干異なる場合があります。',
        'faq.q3': 'カラーピッカーで透明度は指定できますか？',
        'faq.a3': 'はい、RGBA、HSLA形式で透明度（アルファ値）を指定できます。',
        
        // ショートカット
        'shortcut.title': 'キーボードショートカット',
        'shortcut.copy': 'Ctrl+C: コピー',
        'shortcut.paste': 'Ctrl+V: 貼り付け',
        'shortcut.random': 'R: ランダム色生成',
        'shortcut.clear': 'Escape: クリア',
        'shortcut.convert': 'Enter: 変換実行'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'Color Code Converter - HEX, RGB, HSL, CMYK Conversion | negi-lab.com',
        'metaDescription': 'Convert between HEX, RGB, HSL, CMYK, HSV color codes. Features color picker, palette creation, color harmony suggestions, and accessibility checker. Perfect for web and design work.',
        
        // メインタイトル
        'mainTitle': 'Color Code Converter',
        'subtitle': 'Complete Support for HEX, RGB, HSL, CMYK, HSV',
        'description': 'Convert between all color code formats. Features color picker, palette creation, and accessibility checker',
        
        // カラーピッカー
        'picker.title': 'Color Picker',
        'picker.currentColor': 'Current Color',
        'picker.selectColor': 'Select Color',
        'picker.eyedropper': 'Eyedropper Tool',
        'picker.random': 'Random Color',
        'picker.favoriteColors': 'Favorite Colors',
        'picker.recentColors': 'Recent Colors',
        
        // 色コード入力
        'input.title': 'Color Code Input',
        'input.hex': 'HEX Code',
        'input.rgb': 'RGB',
        'input.hsl': 'HSL',
        'input.cmyk': 'CMYK',
        'input.hsv': 'HSV',
        'input.colorName': 'Color Name',
        'input.placeholder.hex': '#FFFFFF or FFFFFF',
        'input.placeholder.rgb': 'rgb(255, 255, 255) or 255,255,255',
        'input.placeholder.hsl': 'hsl(0, 100%, 50%) or 0,100,50',
        'input.placeholder.cmyk': 'cmyk(0, 0, 0, 0) or 0,0,0,0',
        'input.placeholder.hsv': 'hsv(0, 100%, 100%) or 0,100,100',
        'input.placeholder.name': 'red, blue, green, etc.',
        
        // 色コード出力
        'output.title': 'Conversion Result',
        'output.hex.upper': 'HEX (Uppercase)',
        'output.hex.lower': 'HEX (Lowercase)',
        'output.rgb.decimal': 'RGB (Decimal)',
        'output.rgb.percent': 'RGB (Percentage)',
        'output.hsl': 'HSL',
        'output.cmyk': 'CMYK',
        'output.hsv': 'HSV',
        'output.css': 'CSS Format',
        'output.scss': 'SCSS Variable',
        'output.swift': 'Swift UIColor',
        'output.android': 'Android Color',
        
        // カラーパレット
        'palette.title': 'Color Palette',
        'palette.create': 'Create Palette',
        'palette.monochromatic': 'Monochromatic',
        'palette.analogous': 'Analogous',
        'palette.complementary': 'Complementary',
        'palette.triadic': 'Triadic',
        'palette.tetradic': 'Tetradic',
        'palette.splitComplementary': 'Split Complementary',
        'palette.customPalette': 'Custom Palette',
        'palette.addColor': 'Add Color',
        'palette.removeColor': 'Remove Color',
        'palette.export': 'Export Palette',
        'palette.import': 'Import Palette',
        
        // カラーハーモニー
        'harmony.title': 'Color Harmony',
        'harmony.generate': 'Generate Harmony',
        'harmony.baseColor': 'Base Color',
        'harmony.scheme': 'Color Scheme',
        'harmony.count': 'Number of Colors',
        'harmony.preview': 'Preview',
        
        // グラデーション
        'gradient.title': 'Gradient',
        'gradient.linear': 'Linear Gradient',
        'gradient.radial': 'Radial Gradient',
        'gradient.angle': 'Angle',
        'gradient.direction': 'Direction',
        'gradient.steps': 'Steps',
        'gradient.cssCode': 'CSS Code',
        'gradient.preview': 'Preview',
        
        // アクセシビリティ
        'accessibility.title': 'Accessibility',
        'accessibility.contrast': 'Contrast Ratio',
        'accessibility.foreground': 'Text Color',
        'accessibility.background': 'Background Color',
        'accessibility.ratioNormal': 'Normal Text',
        'accessibility.ratioLarge': 'Large Text',
        'accessibility.wcagAA': 'WCAG AA Compliant',
        'accessibility.wcagAAA': 'WCAG AAA Compliant',
        'accessibility.pass': 'Pass',
        'accessibility.fail': 'Fail',
        'accessibility.suggestions': 'Improvement Suggestions',
        
        // 色の情報
        'info.title': 'Color Information',
        'info.brightness': 'Brightness',
        'info.lightness': 'Lightness',
        'info.saturation': 'Saturation',
        'info.hue': 'Hue',
        'info.temperature': 'Color Temperature',
        'info.warm': 'Warm',
        'info.cool': 'Cool',
        'info.neutral': 'Neutral',
        'info.websafe': 'Web Safe Color',
        'info.colorBlind': 'Color Blind View',
        
        // ツール機能
        'tools.title': 'Tool Functions',
        'tools.colorMixer': 'Color Mixer',
        'tools.colorAnalyzer': 'Color Analyzer',
        'tools.colorExtractor': 'Extract Colors from Image',
        'tools.colorBlindness': 'Color Blindness Simulator',
        'tools.trending': 'Trending Colors',
        'tools.seasonalColors': 'Seasonal Colors',
        
        // 設定
        'settings.title': 'Settings',
        'settings.format': 'Default Format',
        'settings.precision': 'Precision',
        'settings.uppercase': 'Uppercase Display',
        'settings.copyFormat': 'Copy Format',
        'settings.autoUpdate': 'Auto Update',
        'settings.showPreview': 'Show Preview',
        
        // ボタン・アクション
        'button.convert': 'Convert',
        'button.copy': 'Copy',
        'button.copyAll': 'Copy All',
        'button.clear': 'Clear',
        'button.random': 'Random',
        'button.save': 'Save',
        'button.load': 'Load',
        'button.export': 'Export',
        'button.import': 'Import',
        'button.addToFavorites': 'Add to Favorites',
        'button.removeFromFavorites': 'Remove from Favorites',
        
        // 履歴
        'history.title': 'Color History',
        'history.recent': 'Recently Used',
        'history.favorites': 'Favorites',
        'history.clear': 'Clear History',
        'history.empty': 'No history available',
        'history.reuse': 'Reuse',
        
        // プリセット
        'preset.title': 'Preset Colors',
        'preset.basic': 'Basic Colors',
        'preset.web': 'Web Standard Colors',
        'preset.material': 'Material Design',
        'preset.bootstrap': 'Bootstrap',
        'preset.tailwind': 'Tailwind CSS',
        'preset.brand': 'Brand Colors',
        'preset.nature': 'Nature Colors',
        'preset.seasonal': 'Seasonal Colors',
        
        // メッセージ
        'message.copied': 'Copied to clipboard',
        'message.saved': 'Saved successfully',
        'message.loaded': 'Loaded successfully',
        'message.exported': 'Exported successfully',
        'message.imported': 'Imported successfully',
        'message.error': 'An error occurred',
        'message.invalidColor': 'Invalid color code',
        'message.invalidFormat': 'Invalid format',
        'message.paletteCreated': 'Palette created successfully',
        'message.addedToFavorites': 'Added to favorites',
        
        // ガイド
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Select color or enter code',
        'guide.step2': '2. Choose format and convert',
        'guide.step3': '3. Copy or save results',
        'guide.step4': '4. Use palettes and harmonies',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'Is the # required for HEX codes?',
        'faq.a1': 'The # is optional. Both "FFFFFF" and "#FFFFFF" are recognized.',
        'faq.q2': 'How accurate is CMYK to RGB conversion?',
        'faq.a2': 'We use standard conversion formulas, but actual print colors may vary slightly.',
        'faq.q3': 'Can transparency be specified in the color picker?',
        'faq.a3': 'Yes, transparency (alpha values) can be specified in RGBA and HSLA formats.',
        
        // ショートカット
        'shortcut.title': 'Keyboard Shortcuts',
        'shortcut.copy': 'Ctrl+C: Copy',
        'shortcut.paste': 'Ctrl+V: Paste',
        'shortcut.random': 'R: Generate Random Color',
        'shortcut.clear': 'Escape: Clear',
        'shortcut.convert': 'Enter: Execute Conversion'
    }
};

/**
 * カラーコードツール専用翻訳システムクラス
 */
class ColorCodeTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.colorCodeTranslations;
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
            console.warn(`Language "${lang}" not supported in Color Code tool`);
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
    window.colorCodeTranslationSystem = new ColorCodeTranslationSystem();
});
