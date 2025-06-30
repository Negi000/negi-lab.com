/**
 * 単位変換ツール専用翻訳データ & システム
 * @description unit-converter.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// 単位変換ツール用翻訳データ
window.unitConverterTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': '単位変換ツール - 長さ・重さ・面積・体積・温度変換 | negi-lab.com',
        'metaDescription': '長さ、重さ、面積、体積、温度、時間、エネルギーなど様々な単位を相互変換。メートル法、ヤード・ポンド法対応。履歴機能、お気に入り登録、計算式表示付き。',
        
        // メインタイトル
        'mainTitle': '多機能単位変換ツール',
        'subtitle': '長さ・重さ・面積・体積・温度・時間・エネルギー変換対応',
        'description': 'あらゆる単位を素早く正確に変換。履歴機能とお気に入り登録で効率的な作業をサポート',
        
        // カテゴリ選択
        'category.title': '変換カテゴリ',
        'category.length': '長さ',
        'category.weight': '重さ・質量',
        'category.area': '面積',
        'category.volume': '体積・容積',
        'category.temperature': '温度',
        'category.time': '時間',
        'category.speed': '速度',
        'category.energy': 'エネルギー',
        'category.power': '電力・仕事率',
        'category.pressure': '圧力',
        'category.angle': '角度',
        'category.data': 'データ容量',
        
        // 変換インターフェース
        'converter.from': '変換元',
        'converter.to': '変換先',
        'converter.value': '値',
        'converter.result': '結果',
        'converter.swap': '入れ替え',
        'converter.clear': 'クリア',
        'converter.copy': 'コピー',
        
        // 単位（長さ）
        'unit.length.mm': 'ミリメートル (mm)',
        'unit.length.cm': 'センチメートル (cm)',
        'unit.length.m': 'メートル (m)',
        'unit.length.km': 'キロメートル (km)',
        'unit.length.inch': 'インチ (in)',
        'unit.length.ft': 'フィート (ft)',
        'unit.length.yard': 'ヤード (yd)',
        'unit.length.mile': 'マイル (mi)',
        'unit.length.nauticalMile': '海里 (nmi)',
        
        // 単位（重さ）
        'unit.weight.mg': 'ミリグラム (mg)',
        'unit.weight.g': 'グラム (g)',
        'unit.weight.kg': 'キログラム (kg)',
        'unit.weight.ton': 'トン (t)',
        'unit.weight.oz': 'オンス (oz)',
        'unit.weight.lb': 'ポンド (lb)',
        'unit.weight.stone': 'ストーン (st)',
        
        // 単位（面積）
        'unit.area.mm2': '平方ミリメートル (mm²)',
        'unit.area.cm2': '平方センチメートル (cm²)',
        'unit.area.m2': '平方メートル (m²)',
        'unit.area.km2': '平方キロメートル (km²)',
        'unit.area.hectare': 'ヘクタール (ha)',
        'unit.area.acre': 'エーカー (ac)',
        'unit.area.sqInch': '平方インチ (sq in)',
        'unit.area.sqFt': '平方フィート (sq ft)',
        'unit.area.sqYard': '平方ヤード (sq yd)',
        
        // 単位（体積）
        'unit.volume.ml': 'ミリリットル (ml)',
        'unit.volume.l': 'リットル (l)',
        'unit.volume.m3': '立方メートル (m³)',
        'unit.volume.flOz': '液量オンス (fl oz)',
        'unit.volume.cup': 'カップ (cup)',
        'unit.volume.pint': 'パイント (pt)',
        'unit.volume.quart': 'クォート (qt)',
        'unit.volume.gallon': 'ガロン (gal)',
        
        // 単位（温度）
        'unit.temperature.celsius': '摂氏 (°C)',
        'unit.temperature.fahrenheit': '華氏 (°F)',
        'unit.temperature.kelvin': 'ケルビン (K)',
        'unit.temperature.rankine': 'ランキン (°R)',
        
        // 単位（時間）
        'unit.time.millisecond': 'ミリ秒 (ms)',
        'unit.time.second': '秒 (s)',
        'unit.time.minute': '分 (min)',
        'unit.time.hour': '時間 (h)',
        'unit.time.day': '日 (d)',
        'unit.time.week': '週 (week)',
        'unit.time.month': 'ヶ月 (month)',
        'unit.time.year': '年 (year)',
        
        // 単位（速度）
        'unit.speed.mps': 'メートル毎秒 (m/s)',
        'unit.speed.kmh': 'キロメートル毎時 (km/h)',
        'unit.speed.mph': 'マイル毎時 (mph)',
        'unit.speed.knot': 'ノット (kt)',
        'unit.speed.fps': 'フィート毎秒 (ft/s)',
        
        // 単位（エネルギー）
        'unit.energy.joule': 'ジュール (J)',
        'unit.energy.kj': 'キロジュール (kJ)',
        'unit.energy.cal': 'カロリー (cal)',
        'unit.energy.kcal': 'キロカロリー (kcal)',
        'unit.energy.wh': 'ワット時 (Wh)',
        'unit.energy.kwh': 'キロワット時 (kWh)',
        'unit.energy.btu': 'BTU',
        
        // 単位（データ容量）
        'unit.data.byte': 'バイト (B)',
        'unit.data.kb': 'キロバイト (KB)',
        'unit.data.mb': 'メガバイト (MB)',
        'unit.data.gb': 'ギガバイト (GB)',
        'unit.data.tb': 'テラバイト (TB)',
        'unit.data.pb': 'ペタバイト (PB)',
        
        // 履歴機能
        'history.title': '変換履歴',
        'history.clear': '履歴クリア',
        'history.empty': '履歴がありません',
        'history.reuse': '再利用',
        'history.delete': '削除',
        'history.favorite': 'お気に入り追加',
        
        // お気に入り機能
        'favorites.title': 'お気に入り変換',
        'favorites.add': 'お気に入り追加',
        'favorites.remove': 'お気に入り削除',
        'favorites.empty': 'お気に入りがありません',
        'favorites.name': '名前を付けて保存',
        
        // 計算式表示
        'formula.title': '計算式',
        'formula.show': '計算式を表示',
        'formula.hide': '計算式を非表示',
        
        // クイック変換
        'quick.title': 'クイック変換',
        'quick.common': 'よく使う変換',
        'quick.recent': '最近の変換',
        
        // 設定
        'settings.title': '設定',
        'settings.precision': '表示精度:',
        'settings.notation': '表記法:',
        'settings.scientific': '科学的記数法',
        'settings.decimal': '小数表記',
        'settings.auto': '自動選択',
        'settings.theme': 'テーマ:',
        'settings.light': 'ライト',
        'settings.dark': 'ダーク',
        'settings.save': '設定保存',
        
        // ボタン・アクション
        'button.convert': '変換',
        'button.swap': '入れ替え',
        'button.clear': 'クリア',
        'button.copy': 'コピー',
        'button.save': '保存',
        'button.load': '読み込み',
        'button.export': 'エクスポート',
        'button.import': 'インポート',
        
        // メッセージ
        'message.copied': 'コピーしました',
        'message.saved': '保存しました',
        'message.loaded': '読み込みました',
        'message.deleted': '削除しました',
        'message.error': 'エラーが発生しました',
        'message.invalidInput': '無効な入力値です',
        'message.historyCleared': '履歴をクリアしました',
        'message.favoritesCleared': 'お気に入りをクリアしました',
        
        // ガイド
        'guide.title': '使い方ガイド',
        'guide.step1': '1. 変換カテゴリを選択',
        'guide.step2': '2. 変換元・変換先の単位を選択',
        'guide.step3': '3. 値を入力して変換実行',
        'guide.step4': '4. 結果をコピーまたは保存',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': '計算精度はどの程度ですか？',
        'faq.a1': '最大15桁の精度で計算します。科学技術計算にも対応できる高精度です。',
        'faq.q2': '履歴は保存されますか？',
        'faq.a2': 'ブラウザのローカルストレージに保存されます。他の端末とは同期されません。',
        'faq.q3': 'オフラインでも使用できますか？',
        'faq.a3': 'はい、一度読み込めばオフラインでも使用できます。',
        
        // ツールチップ
        'tooltip.swap': '変換元と変換先を入れ替えます',
        'tooltip.copy': '結果をクリップボードにコピーします',
        'tooltip.favorite': 'この変換をお気に入りに追加します',
        'tooltip.precision': '表示する小数点以下の桁数',
        'tooltip.formula': '変換に使用される計算式を表示'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'Unit Converter - Length, Weight, Area, Volume, Temperature | negi-lab.com',
        'metaDescription': 'Convert various units including length, weight, area, volume, temperature, time, and energy. Supports metric and imperial systems. Features history, favorites, and formula display.',
        
        // メインタイトル
        'mainTitle': 'Multi-Function Unit Converter',
        'subtitle': 'Length, Weight, Area, Volume, Temperature, Time, Energy Conversion',
        'description': 'Convert any units quickly and accurately. History and favorites functions support efficient work',
        
        // カテゴリ選択
        'category.title': 'Conversion Category',
        'category.length': 'Length',
        'category.weight': 'Weight/Mass',
        'category.area': 'Area',
        'category.volume': 'Volume',
        'category.temperature': 'Temperature',
        'category.time': 'Time',
        'category.speed': 'Speed',
        'category.energy': 'Energy',
        'category.power': 'Power',
        'category.pressure': 'Pressure',
        'category.angle': 'Angle',
        'category.data': 'Data Size',
        
        // 変換インターフェース
        'converter.from': 'From',
        'converter.to': 'To',
        'converter.value': 'Value',
        'converter.result': 'Result',
        'converter.swap': 'Swap',
        'converter.clear': 'Clear',
        'converter.copy': 'Copy',
        
        // 単位（長さ）
        'unit.length.mm': 'Millimeter (mm)',
        'unit.length.cm': 'Centimeter (cm)',
        'unit.length.m': 'Meter (m)',
        'unit.length.km': 'Kilometer (km)',
        'unit.length.inch': 'Inch (in)',
        'unit.length.ft': 'Foot (ft)',
        'unit.length.yard': 'Yard (yd)',
        'unit.length.mile': 'Mile (mi)',
        'unit.length.nauticalMile': 'Nautical Mile (nmi)',
        
        // 単位（重さ）
        'unit.weight.mg': 'Milligram (mg)',
        'unit.weight.g': 'Gram (g)',
        'unit.weight.kg': 'Kilogram (kg)',
        'unit.weight.ton': 'Ton (t)',
        'unit.weight.oz': 'Ounce (oz)',
        'unit.weight.lb': 'Pound (lb)',
        'unit.weight.stone': 'Stone (st)',
        
        // 単位（面積）
        'unit.area.mm2': 'Square Millimeter (mm²)',
        'unit.area.cm2': 'Square Centimeter (cm²)',
        'unit.area.m2': 'Square Meter (m²)',
        'unit.area.km2': 'Square Kilometer (km²)',
        'unit.area.hectare': 'Hectare (ha)',
        'unit.area.acre': 'Acre (ac)',
        'unit.area.sqInch': 'Square Inch (sq in)',
        'unit.area.sqFt': 'Square Foot (sq ft)',
        'unit.area.sqYard': 'Square Yard (sq yd)',
        
        // 単位（体積）
        'unit.volume.ml': 'Milliliter (ml)',
        'unit.volume.l': 'Liter (l)',
        'unit.volume.m3': 'Cubic Meter (m³)',
        'unit.volume.flOz': 'Fluid Ounce (fl oz)',
        'unit.volume.cup': 'Cup',
        'unit.volume.pint': 'Pint (pt)',
        'unit.volume.quart': 'Quart (qt)',
        'unit.volume.gallon': 'Gallon (gal)',
        
        // 単位（温度）
        'unit.temperature.celsius': 'Celsius (°C)',
        'unit.temperature.fahrenheit': 'Fahrenheit (°F)',
        'unit.temperature.kelvin': 'Kelvin (K)',
        'unit.temperature.rankine': 'Rankine (°R)',
        
        // 単位（時間）
        'unit.time.millisecond': 'Millisecond (ms)',
        'unit.time.second': 'Second (s)',
        'unit.time.minute': 'Minute (min)',
        'unit.time.hour': 'Hour (h)',
        'unit.time.day': 'Day (d)',
        'unit.time.week': 'Week',
        'unit.time.month': 'Month',
        'unit.time.year': 'Year',
        
        // 単位（速度）
        'unit.speed.mps': 'Meter per Second (m/s)',
        'unit.speed.kmh': 'Kilometer per Hour (km/h)',
        'unit.speed.mph': 'Mile per Hour (mph)',
        'unit.speed.knot': 'Knot (kt)',
        'unit.speed.fps': 'Foot per Second (ft/s)',
        
        // 単位（エネルギー）
        'unit.energy.joule': 'Joule (J)',
        'unit.energy.kj': 'Kilojoule (kJ)',
        'unit.energy.cal': 'Calorie (cal)',
        'unit.energy.kcal': 'Kilocalorie (kcal)',
        'unit.energy.wh': 'Watt-hour (Wh)',
        'unit.energy.kwh': 'Kilowatt-hour (kWh)',
        'unit.energy.btu': 'BTU',
        
        // 単位（データ容量）
        'unit.data.byte': 'Byte (B)',
        'unit.data.kb': 'Kilobyte (KB)',
        'unit.data.mb': 'Megabyte (MB)',
        'unit.data.gb': 'Gigabyte (GB)',
        'unit.data.tb': 'Terabyte (TB)',
        'unit.data.pb': 'Petabyte (PB)',
        
        // 履歴機能
        'history.title': 'Conversion History',
        'history.clear': 'Clear History',
        'history.empty': 'No history available',
        'history.reuse': 'Reuse',
        'history.delete': 'Delete',
        'history.favorite': 'Add to Favorites',
        
        // お気に入り機能
        'favorites.title': 'Favorite Conversions',
        'favorites.add': 'Add to Favorites',
        'favorites.remove': 'Remove from Favorites',
        'favorites.empty': 'No favorites available',
        'favorites.name': 'Save with Name',
        
        // 計算式表示
        'formula.title': 'Formula',
        'formula.show': 'Show Formula',
        'formula.hide': 'Hide Formula',
        
        // クイック変換
        'quick.title': 'Quick Conversion',
        'quick.common': 'Common Conversions',
        'quick.recent': 'Recent Conversions',
        
        // 設定
        'settings.title': 'Settings',
        'settings.precision': 'Display Precision:',
        'settings.notation': 'Notation:',
        'settings.scientific': 'Scientific Notation',
        'settings.decimal': 'Decimal Notation',
        'settings.auto': 'Auto Select',
        'settings.theme': 'Theme:',
        'settings.light': 'Light',
        'settings.dark': 'Dark',
        'settings.save': 'Save Settings',
        
        // ボタン・アクション
        'button.convert': 'Convert',
        'button.swap': 'Swap',
        'button.clear': 'Clear',
        'button.copy': 'Copy',
        'button.save': 'Save',
        'button.load': 'Load',
        'button.export': 'Export',
        'button.import': 'Import',
        
        // メッセージ
        'message.copied': 'Copied to clipboard',
        'message.saved': 'Saved successfully',
        'message.loaded': 'Loaded successfully',
        'message.deleted': 'Deleted successfully',
        'message.error': 'An error occurred',
        'message.invalidInput': 'Invalid input value',
        'message.historyCleared': 'History cleared',
        'message.favoritesCleared': 'Favorites cleared',
        
        // ガイド
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Select conversion category',
        'guide.step2': '2. Choose from and to units',
        'guide.step3': '3. Enter value and convert',
        'guide.step4': '4. Copy or save results',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'What is the calculation precision?',
        'faq.a1': 'Calculations are performed with up to 15-digit precision, suitable for scientific calculations.',
        'faq.q2': 'Is history saved?',
        'faq.a2': 'History is saved in browser local storage. It is not synced across devices.',
        'faq.q3': 'Can it be used offline?',
        'faq.a3': 'Yes, once loaded, it can be used offline.',
        
        // ツールチップ
        'tooltip.swap': 'Swap from and to units',
        'tooltip.copy': 'Copy result to clipboard',
        'tooltip.favorite': 'Add this conversion to favorites',
        'tooltip.precision': 'Number of decimal places to display',
        'tooltip.formula': 'Show formula used for conversion'
    }
};

/**
 * 単位変換ツール専用翻訳システムクラス
 */
class UnitConverterTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.unitConverterTranslations;
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
            console.warn(`Language "${lang}" not supported in Unit Converter`);
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
    window.unitConverterTranslationSystem = new UnitConverterTranslationSystem();
});
