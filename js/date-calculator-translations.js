/**
 * Date calculator translations.
 * Keep JA/EN keys symmetrical because the shared translation system reads this object directly.
 */
window.dateCalculatorTranslations = {
  ja: {
    dateCalculator: {
      pageTitle: '日付計算・日数差・加算減算ツール | negi-lab.com',
      metaDescription: '2つの日付の差分計算、基準日からの日付加算・減算、営業日数の確認に使えるブラウザ内日付計算ツールです。',
      mainTitle: '日付計算ツール',
      lead: '開始日と終了日の差分、基準日からの日付加算・減算をブラウザ内で確認できます。',
      tabDiff: '日付の差分',
      tabAddSub: '日付の加算・減算',
      optionsTitle: '計算オプション',
      includeStart: '開始日を含める',
      includeEnd: '終了日を含める',
      businessDays: '営業日で数える（土日・内蔵祝日を除外）',
      diffTitle: '2つの日付の差を計算',
      start: '開始日',
      end: '終了日',
      calcDiff: '日数を計算',
      addsubTitle: '日付を加算・減算',
      base: '基準日',
      days: '日数（±）',
      daysPlaceholder: '例: 10 または -5',
      calcAddSub: '日付を計算',
      copyResult: '結果をコピー',
      triviaTitle: '日付トリビア',
      historyTitle: '計算履歴',
      clearHistory: '履歴を削除',
      noteTitle: '注意事項',
      noteBody: '営業日計算は土日と内蔵の日本の祝日を除外します。重要な締切や法的・医療・金融上の判断には、必ず公式情報や専門家の確認を併用してください。',
      faqTitle: 'よくある質問',
      faqPrivacyQ: '入力した日付は送信されますか？',
      faqPrivacyA: '通常の計算はブラウザ内で完結します。計算履歴はこの端末のlocalStorageにのみ保存され、履歴削除ボタンで消せます。',
      faqBusinessQ: '営業日計算はどこまで対応していますか？',
      faqBusinessA: '土日と内蔵の日本の祝日データを除外します。会社独自の休日や最新の祝日変更は、必要に応じて公式カレンダーで確認してください。',
      faqReverseQ: 'マイナスの日数も使えますか？',
      faqReverseA: 'はい。日付の加算・減算では、-5 のように入力すると基準日より前の日付を計算できます。'
    },
    header: {
      nav: {
        home: 'ホーム',
        tools: 'ツール',
        wikis: 'ゲームWiki'
      },
      guide: 'ガイド'
    },
    option: {
      ja: '日本語',
      en: 'English'
    },
    footer: {
      privacyPolicy: 'プライバシーポリシー',
      terms: '利用規約',
      about: '運営者情報',
      contact: 'お問い合わせ',
      sitemap: 'サイトマップ',
      copyright: '© 2026 negi-lab.com'
    }
  },
  en: {
    dateCalculator: {
      pageTitle: 'Date Difference and Add/Subtract Calculator | negi-lab.com',
      metaDescription: 'Calculate the difference between two dates, add or subtract days from a base date, and check business-day counts in your browser.',
      mainTitle: 'Date Calculator',
      lead: 'Check date differences and add or subtract days from a base date directly in your browser.',
      tabDiff: 'Date difference',
      tabAddSub: 'Add / subtract',
      optionsTitle: 'Calculation options',
      includeStart: 'Include start date',
      includeEnd: 'Include end date',
      businessDays: 'Count business days (exclude weekends and bundled holidays)',
      diffTitle: 'Calculate the difference between two dates',
      start: 'Start date',
      end: 'End date',
      calcDiff: 'Calculate days',
      addsubTitle: 'Add or subtract days',
      base: 'Base date',
      days: 'Days (+/-)',
      daysPlaceholder: 'Example: 10 or -5',
      calcAddSub: 'Calculate date',
      copyResult: 'Copy result',
      triviaTitle: 'Date trivia',
      historyTitle: 'Calculation history',
      clearHistory: 'Clear history',
      noteTitle: 'Notes',
      noteBody: 'Business-day mode excludes weekends and bundled Japanese national holidays. For critical legal, medical, financial, or deadline decisions, also verify with official sources or a qualified professional.',
      faqTitle: 'FAQ',
      faqPrivacyQ: 'Are entered dates sent anywhere?',
      faqPrivacyA: 'Regular calculations run in your browser. Calculation history is stored only in this device\'s localStorage and can be removed with the clear-history button.',
      faqBusinessQ: 'What does business-day mode support?',
      faqBusinessA: 'It excludes weekends and bundled Japanese national holidays. Company-specific holidays and recent holiday changes should be checked against official calendars when needed.',
      faqReverseQ: 'Can I use negative day counts?',
      faqReverseA: 'Yes. In add/subtract mode, enter a value such as -5 to calculate a date before the base date.'
    },
    header: {
      nav: {
        home: 'Home',
        tools: 'Tools',
        wikis: 'Game Wikis'
      },
      guide: 'Guide'
    },
    option: {
      ja: 'Japanese',
      en: 'English'
    },
    footer: {
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms',
      about: 'About',
      contact: 'Contact',
      sitemap: 'Sitemap',
      copyright: '© 2026 negi-lab.com'
    }
  }
};

window.dateCalculatorTranslationSystem = {
  getCurrentLanguage() {
    return window.NegiI18n?.getLanguage?.() || document.documentElement.lang || 'ja';
  },
  setLanguage(lang) {
    if (window.NegiI18n?.setLanguage) {
      window.NegiI18n.setLanguage(lang);
    }
  }
};
