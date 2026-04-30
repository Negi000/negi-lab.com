// Browser-only image size converter for social and web presets.
(function () {
  "use strict";

  const messages = {
    ja: {
      unsupported: "PNG、JPEG、WebP、GIF の画像ファイルを選択してください。SVG は安全性と描画差異を避けるため対象外です。",
      tooLarge: "ファイルサイズは 20MB 以下にしてください。",
      loadFailed: "画像ファイルを読み込めませんでした。別の画像でお試しください。",
      loaded: "画像を読み込みました。変換するサイズを選んでください。",
      selectFile: "先に画像ファイルを選択してください。",
      selectPreset: "変換するサイズを1つ以上選択してください。",
      converting: "変換中です...",
      converted: (count) => `${count}サイズを生成しました。プレビューから個別保存、または一括ダウンロードできます。`,
      convertFailed: "画像サイズ変換に失敗しました。",
      copied: "画像をクリップボードにコピーしました。",
      copyFailed: "このブラウザでは画像コピーに対応していないか、コピーに失敗しました。",
      downloadAll: "一括ダウンロード",
      download: "ダウンロード",
      copy: "コピー",
      cover: "中央トリミング",
      contain: "余白を追加",
      original: "元画像",
      fileReady: (name, width, height, size) => `${name} / ${width}x${height}px / ${size}`,
    },
    en: {
      unsupported: "Choose a PNG, JPEG, WebP, or GIF image file. SVG is not supported to avoid security and rendering differences.",
      tooLarge: "Please choose an image up to 20 MB.",
      loadFailed: "Could not load this image. Please try another file.",
      loaded: "Image loaded. Choose the sizes you want to convert.",
      selectFile: "Choose an image file first.",
      selectPreset: "Select at least one output size.",
      converting: "Converting...",
      converted: (count) => `${count} size(s) generated. Save individual previews or download all.`,
      convertFailed: "Image conversion failed.",
      copied: "Image copied to the clipboard.",
      copyFailed: "This browser may not support image copy, or the copy failed.",
      downloadAll: "Download all",
      download: "Download",
      copy: "Copy",
      cover: "Center crop",
      contain: "Add padding",
      original: "Original image",
      fileReady: (name, width, height, size) => `${name} / ${width}x${height}px / ${size}`,
    },
  };

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const maxFileSize = 20 * 1024 * 1024;
  const presets = {
    youtube: { label: { ja: "YouTube サムネイル", en: "YouTube thumbnail" }, width: 1280, height: 720 },
    twitter: { label: { ja: "X ヘッダー", en: "X header" }, width: 1500, height: 500 },
    "twitter-icon": { label: { ja: "X アイコン", en: "X icon" }, width: 400, height: 400 },
    instagram: { label: { ja: "Instagram 投稿", en: "Instagram post" }, width: 1080, height: 1080 },
    facebook: { label: { ja: "Facebook カバー", en: "Facebook cover" }, width: 820, height: 312 },
    line: { label: { ja: "LINE アイコン", en: "LINE icon" }, width: 640, height: 640 },
  };

  let sourceImage = null;
  let sourceObjectUrl = null;
  let downloadItems = [];

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function t(key, ...args) {
    const value = messages[lang()][key] || messages.ja[key];
    return typeof value === "function" ? value(...args) : value;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(message, type) {
    const status = byId("conversionStatus");
    if (!status) return;
    status.textContent = message;
    status.className = `text-sm mb-3 ${type === "error" ? "text-red-700" : "text-gray-600"}`;
  }

  function showError(message, error) {
    setStatus(message, "error");
    const errorBox = byId("fileError");
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove("hidden");
    }
    if (error) console.error(error);
  }

  function clearError() {
    const errorBox = byId("fileError");
    if (errorBox) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    }
  }

  function revokeSourceUrl() {
    if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
    sourceObjectUrl = null;
  }

  function revokeDownloadUrls() {
    downloadItems.forEach((item) => URL.revokeObjectURL(item.url));
    downloadItems = [];
  }

  function resetResults() {
    revokeDownloadUrls();
    byId("compareGrid").innerHTML = "";
    byId("resultContainer").classList.add("hidden");
    byId("downloadAllBtn").classList.add("hidden");
    setStatus("");
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function validateFile(file) {
    clearError();
    if (!file) return false;
    if (!allowedTypes.has(file.type)) {
      showError(t("unsupported"));
      return false;
    }
    if (file.size > maxFileSize) {
      showError(t("tooLarge"));
      return false;
    }
    return true;
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      revokeSourceUrl();
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed"));
      sourceObjectUrl = URL.createObjectURL(file);
      image.src = sourceObjectUrl;
    });
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = "";
      sourceImage = null;
      byId("convertBtn").disabled = true;
      return;
    }

    try {
      sourceImage = await loadImage(file);
      byId("fileName").textContent = t("fileReady", file.name, sourceImage.naturalWidth, sourceImage.naturalHeight, formatBytes(file.size));
      byId("originalPreview").src = sourceObjectUrl;
      byId("originalPreview").alt = t("original");
      byId("previewContainer").classList.remove("hidden");
      byId("convertBtn").disabled = false;
      resetResults();
      setStatus(t("loaded"));
    } catch (error) {
      sourceImage = null;
      byId("fileName").textContent = "";
      byId("previewContainer").classList.add("hidden");
      byId("convertBtn").disabled = true;
      resetResults();
      showError(t("loadFailed"), error);
    }
  }

  function getSelectedPresets() {
    return Array.from(document.querySelectorAll(".size-check"))
      .filter((input) => input.checked)
      .map((input) => ({ key: input.value, ...presets[input.value] }))
      .filter((preset) => preset.width);
  }

  function getOutputSettings() {
    const format = byId("outputFormat").value;
    const quality = Number(byId("qualityRange").value || 88) / 100;
    return {
      fit: byId("fitMode").value,
      format,
      mime: format === "jpg" ? "image/jpeg" : `image/${format}`,
      extension: format === "jpg" ? "jpg" : format,
      quality,
      background: byId("paddingColor").value || "#ffffff",
    };
  }

  function drawImageToPreset(canvas, preset, settings) {
    const context = canvas.getContext("2d");
    canvas.width = preset.width;
    canvas.height = preset.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    if (settings.format !== "png" || settings.fit === "contain") {
      context.fillStyle = settings.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const sourceWidth = sourceImage.naturalWidth;
    const sourceHeight = sourceImage.naturalHeight;
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = preset.width / preset.height;

    if (settings.fit === "contain") {
      const scale = Math.min(preset.width / sourceWidth, preset.height / sourceHeight);
      const drawWidth = Math.round(sourceWidth * scale);
      const drawHeight = Math.round(sourceHeight * scale);
      const dx = Math.round((preset.width - drawWidth) / 2);
      const dy = Math.round((preset.height - drawHeight) / 2);
      context.drawImage(sourceImage, dx, dy, drawWidth, drawHeight);
      return;
    }

    let sx = 0;
    let sy = 0;
    let sw = sourceWidth;
    let sh = sourceHeight;

    if (sourceRatio > targetRatio) {
      sw = Math.round(sourceHeight * targetRatio);
      sx = Math.round((sourceWidth - sw) / 2);
    } else if (sourceRatio < targetRatio) {
      sh = Math.round(sourceWidth / targetRatio);
      sy = Math.round((sourceHeight - sh) / 2);
    }

    context.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, preset.width, preset.height);
  }

  function canvasToBlob(canvas, settings) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, settings.mime, settings.quality);
    });
  }

  async function copyBlob(blob) {
    try {
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setStatus(t("copied"));
    } catch (error) {
      showError(t("copyFailed"), error);
    }
  }

  function triggerDownload(item) {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadAll() {
    downloadItems.forEach((item, index) => {
      setTimeout(() => triggerDownload(item), index * 150);
    });
  }

  function createResultCard(preset, item, settings) {
    const label = preset.label[lang()];
    const article = document.createElement("article");
    article.className = "rounded-lg border border-gray-200 bg-gray-50 p-3";

    const title = document.createElement("h3");
    title.className = "text-sm font-semibold text-gray-900";
    title.textContent = `${label} (${preset.width}x${preset.height})`;

    const meta = document.createElement("p");
    meta.className = "mt-1 text-xs text-gray-500";
    meta.textContent = `${settings.fit === "cover" ? t("cover") : t("contain")} / ${settings.extension.toUpperCase()} / ${formatBytes(item.blob.size)}`;

    const image = document.createElement("img");
    image.src = item.url;
    image.alt = `${label} ${preset.width}x${preset.height} preview`;
    image.className = "my-3 h-40 w-full rounded border border-gray-200 bg-white object-contain";
    image.loading = "lazy";

    const actions = document.createElement("div");
    actions.className = "grid grid-cols-2 gap-2";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "form-button bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
    copyButton.textContent = t("copy");
    copyButton.addEventListener("click", () => copyBlob(item.blob));

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.className = "form-button";
    downloadButton.textContent = t("download");
    downloadButton.addEventListener("click", () => triggerDownload(item));

    actions.append(copyButton, downloadButton);
    article.append(title, meta, image, actions);
    return article;
  }

  async function convertImages() {
    clearError();
    if (!sourceImage) {
      showError(t("selectFile"));
      return;
    }

    const selected = getSelectedPresets();
    if (selected.length === 0) {
      showError(t("selectPreset"));
      return;
    }

    const settings = getOutputSettings();
    const compareGrid = byId("compareGrid");
    compareGrid.innerHTML = "";
    revokeDownloadUrls();
    byId("resultContainer").classList.remove("hidden");
    byId("downloadAllBtn").classList.add("hidden");
    byId("convertBtn").disabled = true;
    setStatus(t("converting"));

    try {
      for (const preset of selected) {
        const canvas = document.createElement("canvas");
        drawImageToPreset(canvas, preset, settings);
        const blob = await canvasToBlob(canvas, settings);
        const filename = `${preset.key}-${preset.width}x${preset.height}.${settings.extension}`;
        const item = { blob, filename, url: URL.createObjectURL(blob) };
        downloadItems.push(item);
        compareGrid.appendChild(createResultCard(preset, item, settings));
      }
      byId("downloadAllBtn").textContent = t("downloadAll");
      byId("downloadAllBtn").classList.remove("hidden");
      setStatus(t("converted", selected.length));
    } catch (error) {
      showError(t("convertFailed"), error);
    } finally {
      byId("convertBtn").disabled = false;
    }
  }

  function bindEvents() {
    byId("imageFile").addEventListener("change", handleFileChange);
    byId("convertBtn").addEventListener("click", convertImages);
    byId("downloadAllBtn").addEventListener("click", downloadAll);
    byId("qualityRange").addEventListener("input", (event) => {
      byId("qualityValue").textContent = event.target.value;
    });
    window.addEventListener("beforeunload", () => {
      revokeSourceUrl();
      revokeDownloadUrls();
    });
  }

  function init() {
    byId("qualityValue").textContent = byId("qualityRange").value;
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
