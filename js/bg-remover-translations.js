// bg-remover page translations (merge into global window.translations)
(function(){
  if (typeof window === 'undefined') return;
  window.translations = window.translations || { ja: {}, en: {} };

  Object.assign(window.translations.ja, {
    'bgRemover.pageTitle': '【無料】画像背景リムーバ・透過PNG生成ツール - AI自動背景削除 | negi-lab.com',
    'bgRemover.metaDescription': '最新AI技術による高精度な画像背景除去と透過PNG生成ツール。人物・商品写真・ロゴ画像の背景削除をワンクリックで実現し、プロ品質の画像処理を提供する専門ツールです。',
    'bgRemover.mainTitle': '画像背景リムーバ&透過PNG生成ツール',
    'bgRemover.lead': '画像の背景を自動で削除し、透過PNG画像を生成できるツールです。人物・商品・ロゴ等の切り抜きに便利です。',
    'bgRemover.selectImage': '画像ファイルを選択',
    'bgRemover.originalPreview': 'オリジナル画像プレビュー',
    'bgRemover.removeButton': '背景を削除して透過PNG生成',
    'bgRemover.resultPreview': '背景除去結果プレビュー',
    'bgRemover.download': '透過PNGをダウンロード',
    'bgRemover.breadcrumbCurrent': '背景除去ツール'
  });

  Object.assign(window.translations.en, {
    'bgRemover.pageTitle': 'Free Background Remover & Transparent PNG Generator | negi-lab.com',
    'bgRemover.metaDescription': 'High-precision background removal and transparent PNG generation powered by AI. One-click background removal for people, product photos, and logos — professional-grade image processing.',
    'bgRemover.mainTitle': 'Background Remover & Transparent PNG Generator',
    'bgRemover.lead': 'Remove image backgrounds automatically and generate transparent PNGs. Perfect for people, products, and logos.',
    'bgRemover.selectImage': 'Select Image File',
    'bgRemover.originalPreview': 'Original Image Preview',
    'bgRemover.removeButton': 'Remove Background & Generate PNG',
    'bgRemover.resultPreview': 'Background Removal Preview',
    'bgRemover.download': 'Download Transparent PNG',
    'bgRemover.breadcrumbCurrent': 'Background Remover'
  });
})();
