// bg-remover page translations (merge into global window.translations)
(function () {
  if (typeof window === "undefined") return;
  window.translations = window.translations || { ja: {}, en: {} };

  Object.assign(window.translations.ja, {
    "bgRemover.pageTitle": "画像背景リムーバ・透過PNG生成ツール - 単色背景向け | negi-lab.com",
    "bgRemover.metaDescription": "画像の四隅に近い背景色を透明化し、透過PNGを生成する無料ツール。単色背景の商品画像、ロゴ、アイコン素材の下処理をブラウザ内で行えます。",
    "bgRemover.mainTitle": "画像背景リムーバ・透過PNG生成ツール",
    "bgRemover.lead": "画像の四隅に近い背景色を透明化し、透過PNGを生成するブラウザ内処理ツールです。単色背景の商品画像、ロゴ、アイコン素材の下処理に向いています。",
    "bgRemover.selectImage": "画像ファイルを選択",
    "bgRemover.originalPreview": "オリジナル画像プレビュー",
    "bgRemover.removeButton": "背景を透明化してPNG生成",
    "bgRemover.resultPreview": "透過処理結果プレビュー",
    "bgRemover.download": "透過PNGをダウンロード",
    "bgRemover.breadcrumbCurrent": "背景除去ツール",
  });

  Object.assign(window.translations.en, {
    "bgRemover.pageTitle": "Background Remover & Transparent PNG Generator for Solid Backgrounds | negi-lab.com",
    "bgRemover.metaDescription": "A free browser-based tool that makes colors near the image corners transparent and exports a PNG. Useful for simple product images, logos, and icon assets with mostly solid backgrounds.",
    "bgRemover.mainTitle": "Background Remover & Transparent PNG Generator",
    "bgRemover.lead": "This browser-based tool makes colors close to the image corners transparent and exports a transparent PNG. It works best for product images, logos, and icon assets on mostly solid backgrounds.",
    "bgRemover.selectImage": "Select Image File",
    "bgRemover.originalPreview": "Original Image Preview",
    "bgRemover.removeButton": "Make Background Transparent",
    "bgRemover.resultPreview": "Transparent PNG Preview",
    "bgRemover.download": "Download Transparent PNG",
    "bgRemover.breadcrumbCurrent": "Background Remover",
  });
})();
