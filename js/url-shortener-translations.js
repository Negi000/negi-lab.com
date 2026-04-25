// URL Shortener page translations (merged into global window.translations)
(function(){
  if (typeof window === 'undefined') return;
  window.translations = window.translations || { ja: {}, en: {} };

  Object.assign(window.translations.ja, {
    // Page meta
    'urlShortener.pageTitle': '無料URL短縮・共有リンク整形ツール - トラッキング削除とリンク生成 | negi-lab.com',
    'urlShortener.metaDescription': '長いURLを短縮し、トラッキングパラメータ削除、クエリ整理、Markdownリンク・HTMLリンク生成までブラウザで行える無料ツールです。SNS共有、資料作成、メール文面のリンク整理に使えます。',

    // UI labels
    'urlShortener.mainTitle': 'URL短縮・共有リンク整形ツール',
    'urlShortener.longUrlLabel': '元のURL:',
    'urlShortener.placeholder': '例: https://www.example.com/very/long/url',
    'urlShortener.removeTrackingLabel': 'トラッキングパラメータを削除',
    'urlShortener.sortParamsLabel': 'クエリを整理して並べ替え',
    'urlShortener.enableStatsLabel': '外部短縮URLの統計ログを有効にする',
    'urlShortener.shortenButton': '短縮・整形する',
    'urlShortener.shortUrlLabel': '短縮URL:',
    'urlShortener.cleanUrlLabel': '整理済みURL:',
    'urlShortener.markdownLabel': 'Markdownリンク:',
    'urlShortener.htmlLabel': 'HTMLリンク:',
    'urlShortener.copyButton': 'コピー',
    'urlShortener.statsLinkLabel': '統計:',
    'urlShortener.statsLinkText': '統計ページを見る',
    'urlShortener.statsInfo': '注意: 統計はis.gdによって提供され、更新に時間がかかる場合があります。',
    'urlShortener.statsNotEnabled': 'このURLでは統計ログが有効になっていません。',

    // Messages
    'urlShortener.shorteningMessage': '外部短縮URLを作成中...',
    'urlShortener.error.invalidUrl': '有効なURLを入力してください。',
    'urlShortener.error.apiError': '外部短縮URLの作成に失敗しました。整理済みURLと共有用リンクは利用できます。',
    'urlShortener.copiedMessage': 'コピーしました',
    'urlShortener.analysisLabel': '解析',
    'urlShortener.analysisDomain': 'ドメイン',
    'urlShortener.analysisLength': '文字数',
    'urlShortener.analysisParams': 'クエリ数',
    'urlShortener.analysisRemoved': '削除した追跡パラメータ'
  });

  Object.assign(window.translations.en, {
    // Page meta
    'urlShortener.pageTitle': 'Free URL Shortener and Share Link Formatter | negi-lab.com',
    'urlShortener.metaDescription': 'Shorten long URLs, remove tracking parameters, organize query strings, and generate Markdown or HTML links in your browser.',

    // UI labels
    'urlShortener.mainTitle': 'URL Shortener and Share Link Formatter',
    'urlShortener.longUrlLabel': 'Original URL:',
    'urlShortener.placeholder': 'e.g., https://www.example.com/very/long/url',
    'urlShortener.removeTrackingLabel': 'Remove tracking parameters',
    'urlShortener.sortParamsLabel': 'Sort query parameters',
    'urlShortener.enableStatsLabel': 'Enable stats for the external short URL',
    'urlShortener.shortenButton': 'Shorten and Format',
    'urlShortener.shortUrlLabel': 'Short URL:',
    'urlShortener.cleanUrlLabel': 'Clean URL:',
    'urlShortener.markdownLabel': 'Markdown link:',
    'urlShortener.htmlLabel': 'HTML link:',
    'urlShortener.copyButton': 'Copy',
    'urlShortener.statsLinkLabel': 'Stats:',
    'urlShortener.statsLinkText': 'View stats page',
    'urlShortener.statsInfo': 'Note: Statistics are provided by is.gd and may take a few moments to update.',
    'urlShortener.statsNotEnabled': 'Statistics logging was not enabled for this URL.',

    // Messages
    'urlShortener.shorteningMessage': 'Creating an external short URL...',
    'urlShortener.error.invalidUrl': 'Please enter a valid URL.',
    'urlShortener.error.apiError': 'External URL shortening failed. The cleaned URL and share links are still ready.',
    'urlShortener.copiedMessage': 'Copied',
    'urlShortener.analysisLabel': 'Analysis',
    'urlShortener.analysisDomain': 'Domain',
    'urlShortener.analysisLength': 'Length',
    'urlShortener.analysisParams': 'Query params',
    'urlShortener.analysisRemoved': 'Removed tracking params'
  });
})();
