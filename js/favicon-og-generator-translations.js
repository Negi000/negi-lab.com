// favicon-og-generator page translations (merge into global window.translations)
(function(){
  if (typeof window === 'undefined') return;
  window.translations = window.translations || { ja: {}, en: {} };

  Object.assign(window.translations.ja, {
    'faviconOgGen.pageTitle': '【無料】ファビコン・OGP画像ジェネレータ - Webサイト用画像作成 | negi-lab.com',
    'faviconOgGen.metaDescription': 'Webサイト用ファビコンとOGP画像を複数サイズで一括生成する専門ツール。SEO対策・ブランディング・SNS最適化に必要な全サイズのファビコンとソーシャルメディア画像を効率的に作成できます。',
    'faviconOgGen.mainTitle': 'ファビコン&OG画像ジェネレータ',
    'faviconOgGen.lead': 'ファビコンやOGP画像を簡単に生成・ダウンロードできるツールです。WebサイトやSNS用のアイコン・サムネイル作成に。',
    'faviconOgGen.uploadOptional': '画像アップロード（任意）',
    'faviconOgGen.textOptional': 'テキスト（任意）',
    'faviconOgGen.textPlaceholder': '例: N',
    'faviconOgGen.bgColor': '背景色',
    'faviconOgGen.textColor': '文字色',
    'faviconOgGen.size': 'サイズ',
    'faviconOgGen.size.favicon': 'ファビコン(32x32)',
    'faviconOgGen.size.ogp': 'OGP(1200x630)',
    'faviconOgGen.size.icon180': 'iOSアイコン(180x180)',
    'faviconOgGen.size.icon192': 'Androidアイコン(192x192)',
    'faviconOgGen.size.custom': 'カスタム',
    'faviconOgGen.generate': '画像生成＆プレビュー',
    'faviconOgGen.previewDownload': 'プレビュー＆ダウンロード',
    'faviconOgGen.download': '画像をダウンロード',
  'faviconOgGen.breadcrumbCurrent': 'ファビコン・OG画像ジェネレータ',
  // Guide/sections (headings only)
  'guide.sectionTitle': 'ファビコン・OGP画像作成ガイド',
  'guide.whatIs': 'ファビコン・OGPとは',
  'guide.sizes': '各サイズの用途',
  'guide.techSpec': '技術仕様と実装方法',
  'guide.htmlImpl': 'HTML実装方法',
  'guide.optimization': '最適化のポイント',
  'guide.faq': 'よくある質問（FAQ）',
  // Cases (headings only)
  'cases.title': '作成前のチェックポイント',
  'cases.startup.title': 'スタートアップのブランド構築',
  'cases.corporate.title': '企業サイトのプロフェッショナル化',
  'cases.ec.title': 'ECサイトでのSEO・UX改善',
  'cases.blog.title': 'ブログ・メディアでの読者獲得',
  'cases.school.title': '教育機関での情報発信強化',
  'cases.medical.title': '医療・サービス業での信頼構築',
  // CTA
  'cta.heading': '用途に合わせて画像を作成しましょう',
  'cta.button': '今すぐFavicon・OG画像生成を始める'
  });

  Object.assign(window.translations.en, {
    'faviconOgGen.pageTitle': 'Free Favicon & OG Image Generator - Website/SNS Image Maker | negi-lab.com',
    'faviconOgGen.metaDescription': 'Generate favicons and OGP images in multiple sizes at once. Create all necessary sizes for SEO, branding, and SNS optimization efficiently with this specialized tool.',
    'faviconOgGen.mainTitle': 'Favicon & OG Image Generator',
    'faviconOgGen.lead': 'Easily generate and download favicons and OGP images. Great for website and SNS icons/thumbnails.',
    'faviconOgGen.uploadOptional': 'Upload Image (Optional)',
    'faviconOgGen.textOptional': 'Text (Optional)',
    'faviconOgGen.textPlaceholder': 'e.g., N',
    'faviconOgGen.bgColor': 'Background Color',
    'faviconOgGen.textColor': 'Text Color',
    'faviconOgGen.size': 'Size',
    'faviconOgGen.size.favicon': 'Favicon (32x32)',
    'faviconOgGen.size.ogp': 'OGP (1200x630)',
    'faviconOgGen.size.icon180': 'iOS Icon (180x180)',
    'faviconOgGen.size.icon192': 'Android Icon (192x192)',
    'faviconOgGen.size.custom': 'Custom',
    'faviconOgGen.generate': 'Generate & Preview',
    'faviconOgGen.previewDownload': 'Preview & Download',
    'faviconOgGen.download': 'Download Image',
  'faviconOgGen.breadcrumbCurrent': 'Favicon & OG Image Generator',
  // Guide/sections (headings only)
  'guide.sectionTitle': 'Favicon & OGP Image Creation Guide',
  'guide.whatIs': 'What are Favicon and OGP Images',
  'guide.sizes': 'Use Cases by Size',
  'guide.techSpec': 'Technical Specs & Implementation',
  'guide.htmlImpl': 'HTML Implementation',
  'guide.optimization': 'Optimization Tips',
  'guide.faq': 'Frequently Asked Questions (FAQ)',
  // Cases (headings only)
  'cases.title': 'Pre-generation Checklist',
  'cases.startup.title': 'Branding for Startups',
  'cases.corporate.title': 'Professionalize Corporate Sites',
  'cases.ec.title': 'Improve SEO & UX for E-commerce',
  'cases.blog.title': 'Acquire Readers for Blogs/Media',
  'cases.school.title': 'Enhance Outreach for Education',
  'cases.medical.title': 'Build Trust for Medical/Services',
  // CTA
  'cta.heading': 'Create images for each use case',
  'cta.button': 'Start Generating Favicon/OG Images Now'
  });
})();
