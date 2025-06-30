/**
 * 日付計算ツール専用翻訳データ & システム
 * @description date-calculator.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// 日付計算ツール用翻訳データ
window.dateCalculatorTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': '日付計算ツール - 期間計算・営業日計算・年齢計算 | negi-lab.com',
        'metaDescription': '日付間の期間計算、営業日計算、年齢計算、日付の加算減算、祝日判定など総合的な日付計算ツール。和暦・西暦対応、タイムゾーン考慮、カレンダー表示機能付き。',
        
        // メインタイトル
        'mainTitle': '日付計算ツール',
        'subtitle': '期間計算・営業日計算・年齢計算・日付演算対応',
        'description': '様々な日付計算を簡単実行。営業日、祝日、和暦にも対応した総合日付ツール',
        
        // 計算タイプ
        'type.title': '計算タイプ',
        'type.period': '期間計算',
        'type.businessDays': '営業日計算',
        'type.age': '年齢計算',
        'type.dateAdd': '日付加算',
        'type.dateSubtract': '日付減算',
        'type.weekday': '曜日計算',
        'type.holiday': '祝日判定',
        'type.calendar': 'カレンダー表示',
        
        // 日付入力
        'input.title': '日付入力',
        'input.startDate': '開始日',
        'input.endDate': '終了日',
        'input.baseDate': '基準日',
        'input.targetDate': '対象日',
        'input.birthDate': '生年月日',
        'input.today': '今日',
        'input.clear': 'クリア',
        'input.calendar': 'カレンダー',
        
        // 期間指定
        'period.title': '期間指定',
        'period.years': '年',
        'period.months': 'ヶ月',
        'period.weeks': '週',
        'period.days': '日',
        'period.hours': '時間',
        'period.minutes': '分',
        'period.seconds': '秒',
        'period.add': '加算',
        'period.subtract': '減算',
        
        // 計算結果
        'result.title': '計算結果',
        'result.period': '期間',
        'result.totalDays': '総日数',
        'result.businessDays': '営業日数',
        'result.weekends': '土日数',
        'result.holidays': '祝日数',
        'result.age': '年齢',
        'result.ageDetailed': '詳細年齢',
        'result.resultDate': '結果日付',
        'result.weekday': '曜日',
        'result.isHoliday': '祝日判定',
        'result.holidayName': '祝日名',
        
        // 期間表示形式
        'format.years': '{0}年',
        'format.months': '{0}ヶ月',
        'format.days': '{0}日',
        'format.yearsMonthsDays': '{0}年{1}ヶ月{2}日',
        'format.totalDays': '合計{0}日',
        'format.businessDays': '営業日{0}日',
        'format.ageYears': '{0}歳',
        'format.ageDetailed': '{0}歳{1}ヶ月{2}日',
        
        // 曜日
        'weekday.sunday': '日曜日',
        'weekday.monday': '月曜日',
        'weekday.tuesday': '火曜日',
        'weekday.wednesday': '水曜日',
        'weekday.thursday': '木曜日',
        'weekday.friday': '金曜日',
        'weekday.saturday': '土曜日',
        'weekday.sun': '日',
        'weekday.mon': '月',
        'weekday.tue': '火',
        'weekday.wed': '水',
        'weekday.thu': '木',
        'weekday.fri': '金',
        'weekday.sat': '土',
        
        // 月名
        'month.january': '1月',
        'month.february': '2月',
        'month.march': '3月',
        'month.april': '4月',
        'month.may': '5月',
        'month.june': '6月',
        'month.july': '7月',
        'month.august': '8月',
        'month.september': '9月',
        'month.october': '10月',
        'month.november': '11月',
        'month.december': '12月',
        
        // 和暦
        'era.title': '和暦',
        'era.reiwa': '令和',
        'era.heisei': '平成',
        'era.showa': '昭和',
        'era.taisho': '大正',
        'era.meiji': '明治',
        
        // 営業日設定
        'business.title': '営業日設定',
        'business.excludeWeekends': '土日除外',
        'business.excludeHolidays': '祝日除外',
        'business.customHolidays': 'カスタム休日',
        'business.startDay': '週の開始',
        'business.endDay': '週の終了',
        
        // カレンダー
        'calendar.title': 'カレンダー表示',
        'calendar.previous': '前月',
        'calendar.next': '次月',
        'calendar.today': '今日',
        'calendar.selectDate': '日付選択',
        'calendar.selectedDate': '選択日',
        'calendar.holiday': '祝日',
        'calendar.weekend': '土日',
        'calendar.businessDay': '営業日',
        
        // 設定オプション
        'options.title': '設定オプション',
        'options.includeEndDate': '終了日を含む',
        'options.excludeStartDate': '開始日を除く',
        'options.showWeekdays': '曜日表示',
        'options.showHolidays': '祝日表示',
        'options.showEra': '和暦表示',
        'options.timeZone': 'タイムゾーン',
        'options.dateFormat': '日付形式',
        
        // タイムゾーン
        'timezone.jst': '日本標準時 (JST)',
        'timezone.utc': '協定世界時 (UTC)',
        'timezone.est': '東部標準時 (EST)',
        'timezone.pst': '太平洋標準時 (PST)',
        'timezone.cet': '中央ヨーロッパ時間 (CET)',
        
        // 日付形式
        'dateFormat.japanese': '和暦 (令和○年○月○日)',
        'dateFormat.iso': 'ISO形式 (YYYY-MM-DD)',
        'dateFormat.us': 'アメリカ形式 (MM/DD/YYYY)',
        'dateFormat.european': 'ヨーロッパ形式 (DD/MM/YYYY)',
        'dateFormat.japanese_slash': '日本形式 (YYYY/MM/DD)',
        
        // ボタン・アクション
        'button.calculate': '計算実行',
        'button.clear': 'クリア',
        'button.today': '今日',
        'button.copy': 'コピー',
        'button.export': 'エクスポート',
        'button.print': '印刷',
        'button.share': '共有',
        
        // 履歴
        'history.title': '計算履歴',
        'history.clear': '履歴クリア',
        'history.empty': '履歴がありません',
        'history.reuse': '再利用',
        'history.delete': '削除',
        
        // プリセット
        'preset.title': 'プリセット計算',
        'preset.retirement': '定年まで',
        'preset.schoolYear': '年度末まで',
        'preset.projectDeadline': 'プロジェクト期限',
        'preset.vacation': '有給消化',
        'preset.anniversary': '記念日まで',
        
        // メッセージ
        'message.calculated': '計算しました',
        'message.copied': 'コピーしました',
        'message.exported': 'エクスポートしました',
        'message.error': 'エラーが発生しました',
        'message.invalidDate': '無効な日付です',
        'message.dateRangeError': '日付の範囲が正しくありません',
        'message.futureDate': '未来の日付です',
        'message.pastDate': '過去の日付です',
        
        // エラーメッセージ
        'error.invalidStartDate': '開始日が無効です',
        'error.invalidEndDate': '終了日が無効です',
        'error.startAfterEnd': '開始日が終了日より後です',
        'error.dateOutOfRange': '日付が範囲外です',
        'error.calculationError': '計算中にエラーが発生しました',
        
        // ガイド
        'guide.title': '使い方ガイド',
        'guide.step1': '1. 計算タイプを選択',
        'guide.step2': '2. 日付を入力',
        'guide.step3': '3. オプションを設定',
        'guide.step4': '4. 計算実行',
        
        // FAQ
        'faq.title': 'よくある質問',
        'faq.q1': '営業日計算で祝日は自動判定されますか？',
        'faq.a1': 'はい、日本の国民の祝日は自動的に判定され、営業日から除外されます。',
        'faq.q2': '和暦での表示は可能ですか？',
        'faq.a2': 'はい、令和、平成、昭和などの和暦での表示に対応しています。',
        'faq.q3': '計算結果の精度はどの程度ですか？',
        'faq.a3': '日付計算は秒単位まで正確に計算され、うるう年も適切に処理されます。',
        
        // ヒント
        'tip.title': '便利な使い方',
        'tip.keyboard': 'キーボードでの日付入力も可能です',
        'tip.calendar': 'カレンダーをクリックして日付選択もできます',
        'tip.copy': '計算結果はワンクリックでコピーできます',
        'tip.history': '履歴から過去の計算を再利用できます'
    },
    
    en: {
        // ページタイトル・メタ
        'pageTitle': 'Date Calculator - Period, Business Days, Age Calculation | negi-lab.com',
        'metaDescription': 'Comprehensive date calculation tool for period calculation, business days, age calculation, date addition/subtraction, holiday determination. Supports Japanese era, timezone, calendar display.',
        
        // メインタイトル
        'mainTitle': 'Date Calculator',
        'subtitle': 'Period, Business Days, Age Calculation & Date Operations',
        'description': 'Easily perform various date calculations. Comprehensive date tool supporting business days, holidays, and Japanese era',
        
        // 計算タイプ
        'type.title': 'Calculation Type',
        'type.period': 'Period Calculation',
        'type.businessDays': 'Business Days',
        'type.age': 'Age Calculation',
        'type.dateAdd': 'Date Addition',
        'type.dateSubtract': 'Date Subtraction',
        'type.weekday': 'Weekday Calculation',
        'type.holiday': 'Holiday Check',
        'type.calendar': 'Calendar Display',
        
        // 日付入力
        'input.title': 'Date Input',
        'input.startDate': 'Start Date',
        'input.endDate': 'End Date',
        'input.baseDate': 'Base Date',
        'input.targetDate': 'Target Date',
        'input.birthDate': 'Birth Date',
        'input.today': 'Today',
        'input.clear': 'Clear',
        'input.calendar': 'Calendar',
        
        // 期間指定
        'period.title': 'Period Specification',
        'period.years': 'Years',
        'period.months': 'Months',
        'period.weeks': 'Weeks',
        'period.days': 'Days',
        'period.hours': 'Hours',
        'period.minutes': 'Minutes',
        'period.seconds': 'Seconds',
        'period.add': 'Add',
        'period.subtract': 'Subtract',
        
        // 計算結果
        'result.title': 'Calculation Result',
        'result.period': 'Period',
        'result.totalDays': 'Total Days',
        'result.businessDays': 'Business Days',
        'result.weekends': 'Weekends',
        'result.holidays': 'Holidays',
        'result.age': 'Age',
        'result.ageDetailed': 'Detailed Age',
        'result.resultDate': 'Result Date',
        'result.weekday': 'Weekday',
        'result.isHoliday': 'Holiday Check',
        'result.holidayName': 'Holiday Name',
        
        // 期間表示形式
        'format.years': '{0} years',
        'format.months': '{0} months',
        'format.days': '{0} days',
        'format.yearsMonthsDays': '{0} years, {1} months, {2} days',
        'format.totalDays': 'Total {0} days',
        'format.businessDays': '{0} business days',
        'format.ageYears': '{0} years old',
        'format.ageDetailed': '{0} years, {1} months, {2} days old',
        
        // 曜日
        'weekday.sunday': 'Sunday',
        'weekday.monday': 'Monday',
        'weekday.tuesday': 'Tuesday',
        'weekday.wednesday': 'Wednesday',
        'weekday.thursday': 'Thursday',
        'weekday.friday': 'Friday',
        'weekday.saturday': 'Saturday',
        'weekday.sun': 'Sun',
        'weekday.mon': 'Mon',
        'weekday.tue': 'Tue',
        'weekday.wed': 'Wed',
        'weekday.thu': 'Thu',
        'weekday.fri': 'Fri',
        'weekday.sat': 'Sat',
        
        // 月名
        'month.january': 'January',
        'month.february': 'February',
        'month.march': 'March',
        'month.april': 'April',
        'month.may': 'May',
        'month.june': 'June',
        'month.july': 'July',
        'month.august': 'August',
        'month.september': 'September',
        'month.october': 'October',
        'month.november': 'November',
        'month.december': 'December',
        
        // 和暦
        'era.title': 'Japanese Era',
        'era.reiwa': 'Reiwa',
        'era.heisei': 'Heisei',
        'era.showa': 'Showa',
        'era.taisho': 'Taisho',
        'era.meiji': 'Meiji',
        
        // 営業日設定
        'business.title': 'Business Day Settings',
        'business.excludeWeekends': 'Exclude Weekends',
        'business.excludeHolidays': 'Exclude Holidays',
        'business.customHolidays': 'Custom Holidays',
        'business.startDay': 'Week Start',
        'business.endDay': 'Week End',
        
        // カレンダー
        'calendar.title': 'Calendar Display',
        'calendar.previous': 'Previous',
        'calendar.next': 'Next',
        'calendar.today': 'Today',
        'calendar.selectDate': 'Select Date',
        'calendar.selectedDate': 'Selected Date',
        'calendar.holiday': 'Holiday',
        'calendar.weekend': 'Weekend',
        'calendar.businessDay': 'Business Day',
        
        // 設定オプション
        'options.title': 'Options',
        'options.includeEndDate': 'Include End Date',
        'options.excludeStartDate': 'Exclude Start Date',
        'options.showWeekdays': 'Show Weekdays',
        'options.showHolidays': 'Show Holidays',
        'options.showEra': 'Show Japanese Era',
        'options.timeZone': 'Time Zone',
        'options.dateFormat': 'Date Format',
        
        // タイムゾーン
        'timezone.jst': 'Japan Standard Time (JST)',
        'timezone.utc': 'Coordinated Universal Time (UTC)',
        'timezone.est': 'Eastern Standard Time (EST)',
        'timezone.pst': 'Pacific Standard Time (PST)',
        'timezone.cet': 'Central European Time (CET)',
        
        // 日付形式
        'dateFormat.japanese': 'Japanese Era (Reiwa XX/MM/DD)',
        'dateFormat.iso': 'ISO Format (YYYY-MM-DD)',
        'dateFormat.us': 'US Format (MM/DD/YYYY)',
        'dateFormat.european': 'European Format (DD/MM/YYYY)',
        'dateFormat.japanese_slash': 'Japanese Format (YYYY/MM/DD)',
        
        // ボタン・アクション
        'button.calculate': 'Calculate',
        'button.clear': 'Clear',
        'button.today': 'Today',
        'button.copy': 'Copy',
        'button.export': 'Export',
        'button.print': 'Print',
        'button.share': 'Share',
        
        // 履歴
        'history.title': 'Calculation History',
        'history.clear': 'Clear History',
        'history.empty': 'No history available',
        'history.reuse': 'Reuse',
        'history.delete': 'Delete',
        
        // プリセット
        'preset.title': 'Preset Calculations',
        'preset.retirement': 'Until Retirement',
        'preset.schoolYear': 'Until School Year End',
        'preset.projectDeadline': 'Project Deadline',
        'preset.vacation': 'Vacation Days',
        'preset.anniversary': 'Until Anniversary',
        
        // メッセージ
        'message.calculated': 'Calculation completed',
        'message.copied': 'Copied to clipboard',
        'message.exported': 'Exported successfully',
        'message.error': 'An error occurred',
        'message.invalidDate': 'Invalid date',
        'message.dateRangeError': 'Invalid date range',
        'message.futureDate': 'Future date',
        'message.pastDate': 'Past date',
        
        // エラーメッセージ
        'error.invalidStartDate': 'Invalid start date',
        'error.invalidEndDate': 'Invalid end date',
        'error.startAfterEnd': 'Start date is after end date',
        'error.dateOutOfRange': 'Date out of range',
        'error.calculationError': 'Calculation error occurred',
        
        // ガイド
        'guide.title': 'Usage Guide',
        'guide.step1': '1. Select calculation type',
        'guide.step2': '2. Enter dates',
        'guide.step3': '3. Configure options',
        'guide.step4': '4. Execute calculation',
        
        // FAQ
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'Are holidays automatically detected in business day calculations?',
        'faq.a1': 'Yes, Japanese national holidays are automatically detected and excluded from business days.',
        'faq.q2': 'Can dates be displayed in Japanese era format?',
        'faq.a2': 'Yes, Japanese era formats including Reiwa, Heisei, and Showa are supported.',
        'faq.q3': 'How accurate are the calculations?',
        'faq.a3': 'Date calculations are accurate to the second and properly handle leap years.',
        
        // ヒント
        'tip.title': 'Useful Tips',
        'tip.keyboard': 'Keyboard date input is supported',
        'tip.calendar': 'Click on calendar to select dates',
        'tip.copy': 'One-click copy of calculation results',
        'tip.history': 'Reuse past calculations from history'
    }
};

/**
 * 日付計算ツール専用翻訳システムクラス
 */
class DateCalculatorTranslationSystem {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = window.dateCalculatorTranslations;
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
            console.warn(`Language "${lang}" not supported in Date Calculator`);
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
    window.dateCalculatorTranslationSystem = new DateCalculatorTranslationSystem();
});
