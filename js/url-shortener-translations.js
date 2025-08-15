// URL Shortener page translations (merged into global window.translations)
(function(){
  if (typeof window === 'undefined') return;
  window.translations = window.translations || { ja: {}, en: {} };

  Object.assign(window.translations.ja, {
    // Page meta
    'urlShortener.pageTitle': '【無料】URL短縮ツール - 長いリンクを短縮・統計機能付き | negi-lab.com',
    'urlShortener.metaDescription': '長いURLを短く管理しやすいリンクに変換する無料ツール。クリック統計やアクセス解析機能を搭載し、SNSシェアやマーケティング活動に最適です。セキュリティ対策も万全の専門的URL短縮サービスです。',

    // UI labels
    'urlShortener.mainTitle': 'URL短縮ツール',
    'urlShortener.longUrlLabel': '元のURL:',
    'urlShortener.placeholder': '例: https://www.example.com/very/long/url',
    'urlShortener.enableStatsLabel': '統計ログを有効にする',
    'urlShortener.shortenButton': '短縮する',
    'urlShortener.shortUrlLabel': '短縮URL:',
    'urlShortener.copyButton': 'コピー',
    'urlShortener.statsLinkLabel': '統計:',
    'urlShortener.statsLinkText': '統計ページを見る',
    'urlShortener.statsInfo': '注意: 統計はis.gdによって提供され、更新に時間がかかる場合があります。',
    'urlShortener.statsNotEnabled': 'このURLでは統計ログが有効になっていません。',

    // Messages
    'urlShortener.shorteningMessage': '短縮中...',
    'urlShortener.error.invalidUrl': '有効なURLを入力してください。',
    'urlShortener.error.apiError': 'URLの短縮に失敗しました。しばらくしてからお試しください。',
    'urlShortener.copiedMessage': 'コピーしました！'
  });

  Object.assign(window.translations.en, {
    // Page meta
    'urlShortener.pageTitle': 'Free URL Shortener - Shorten long links with stats | negi-lab.com',
    'urlShortener.metaDescription': 'Free tool to convert long URLs into short, manageable links. Includes click stats and analytics, ideal for SNS sharing and marketing. Security-conscious, professional URL shortening service.',

    // UI labels
    'urlShortener.mainTitle': 'URL Shortener',
    'urlShortener.longUrlLabel': 'Original URL:',
    'urlShortener.placeholder': 'e.g., https://www.example.com/very/long/url',
    'urlShortener.enableStatsLabel': 'Enable statistics',
    'urlShortener.shortenButton': 'Shorten',
    'urlShortener.shortUrlLabel': 'Short URL:',
    'urlShortener.copyButton': 'Copy',
    'urlShortener.statsLinkLabel': 'Stats:',
    'urlShortener.statsLinkText': 'View stats page',
    'urlShortener.statsInfo': 'Note: Statistics are provided by is.gd and may take a few moments to update.',
    'urlShortener.statsNotEnabled': 'Statistics logging was not enabled for this URL.',

    // Messages
    'urlShortener.shorteningMessage': 'Shortening...',
    'urlShortener.error.invalidUrl': 'Please enter a valid URL.',
    'urlShortener.error.apiError': 'Failed to shorten URL. Please try again later.',
    'urlShortener.copiedMessage': 'Copied!'
  });
})();
