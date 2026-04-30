// Browser-only transparent background helper for simple, mostly solid backgrounds.
(function () {
  "use strict";

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const maxFileSize = 10 * 1024 * 1024;
  const maxPixels = 12 * 1000 * 1000;
  const maxEdge = 4096;
  const defaultFileLabel = "まだ画像は選択されていません。";
  const defaultStatus = "画像を選択すると、ここに処理結果が表示されます。";

  let sourceImage = null;
  let sourceFile = null;
  let imageObjectUrl = null;
  let downloadObjectUrl = null;
  let lastPngBlob = null;
  let reprocessTimer = null;
  let isProcessing = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function showInlineError(message, error) {
    const alertBox = byId("bgRemovalAlert");
    const alertText = byId("bgRemovalAlertText");
    if (alertBox && alertText) {
      alertText.textContent = message;
      alertBox.classList.remove("hidden");
    }

    if (window.SecurityUtils?.showUserError) {
      window.SecurityUtils.showUserError(message, error);
    }

    if (error) console.error(error);
  }

  function clearInlineError() {
    const alertBox = byId("bgRemovalAlert");
    const alertText = byId("bgRemovalAlertText");
    if (alertBox) alertBox.classList.add("hidden");
    if (alertText) alertText.textContent = "";
  }

  function showSuccess(message) {
    if (window.SecurityUtils?.showSuccessMessage) {
      window.SecurityUtils.showSuccessMessage(message);
    }
  }

  function revokeImageUrl() {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
  }

  function revokeDownloadUrl() {
    if (downloadObjectUrl) URL.revokeObjectURL(downloadObjectUrl);
    downloadObjectUrl = null;
  }

  function setStatus(message) {
    const status = byId("bgRemovalStatus");
    if (status) status.textContent = message;
  }

  function safeBaseName(fileName) {
    const baseName = String(fileName || "image").replace(/\.[^.]+$/, "").trim();
    const sanitized = baseName.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-");
    return sanitized.slice(0, 80) || "image";
  }

  function setResultActionsEnabled(enabled) {
    const downloadLink = byId("downloadLink");
    const copyButton = byId("copyImageBtn");

    if (downloadLink) {
      downloadLink.setAttribute("aria-disabled", enabled ? "false" : "true");
      downloadLink.classList.toggle("secondary", !enabled);
      if (!enabled) {
        downloadLink.removeAttribute("href");
        downloadLink.setAttribute("tabindex", "-1");
      } else {
        downloadLink.removeAttribute("tabindex");
      }
    }

    if (copyButton) copyButton.disabled = !enabled;
  }

  function setBusyState(busy) {
    isProcessing = busy;
    const removeButton = byId("removeBgBtn");
    const resetButton = byId("resetBtn");
    const imageInput = byId("imageInput");
    const thresholdRange = byId("thresholdRange");
    const featherRange = byId("featherRange");

    if (removeButton) removeButton.disabled = busy || !sourceImage;
    if (resetButton) resetButton.disabled = busy || !sourceImage;
    if (imageInput) imageInput.disabled = busy;
    if (thresholdRange) thresholdRange.disabled = busy || !sourceImage;
    if (featherRange) featherRange.disabled = busy || !sourceImage;
  }

  function resetResult() {
    const resultContainer = byId("resultContainer");
    if (resultContainer) resultContainer.classList.add("hidden");
    revokeDownloadUrl();
    lastPngBlob = null;
    setResultActionsEnabled(false);
  }

  function resetTool() {
    sourceImage = null;
    sourceFile = null;
    lastPngBlob = null;
    window.clearTimeout(reprocessTimer);
    reprocessTimer = null;
    const imageInput = byId("imageInput");
    const fileName = byId("fileName");
    const previewContainer = byId("previewContainer");
    const originalPreview = byId("originalPreview");
    if (imageInput) imageInput.value = "";
    if (fileName) fileName.textContent = defaultFileLabel;
    if (previewContainer) previewContainer.classList.add("hidden");
    if (originalPreview) originalPreview.removeAttribute("src");
    clearInlineError();
    resetResult();
    revokeImageUrl();
    setBusyState(false);
    setStatus(defaultStatus);
  }

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  function validateFile(file) {
    if (!file) return false;

    if (!allowedTypes.has(file.type)) {
      showInlineError("PNG、JPEG、WebP、GIF形式の画像ファイルを選択してください。SVGは安全性と表示差異を避けるため対象外です。");
      return false;
    }

    if (window.SecurityUtils?.validateFileSize) {
      if (!window.SecurityUtils.validateFileSize(file, 10)) {
        showInlineError("ファイルサイズが10MB以下の画像を選択してください。");
        return false;
      }
    } else if (file.size > maxFileSize) {
      showInlineError("ファイルサイズが10MB以下の画像を選択してください。");
      return false;
    }

    return true;
  }

  function validateImageDimensions(image) {
    const pixels = image.naturalWidth * image.naturalHeight;
    if (!image.naturalWidth || !image.naturalHeight) {
      showInlineError("画像サイズを読み取れませんでした。別の画像を選択してください。");
      return false;
    }

    if (pixels > maxPixels) {
      showInlineError(`画像が大きすぎます。${image.naturalWidth}x${image.naturalHeight}pxです。長辺を4096px程度まで縮小してからお試しください。`);
      return false;
    }

    if (Math.max(image.naturalWidth, image.naturalHeight) > maxEdge) {
      showInlineError(`長辺が${maxEdge}pxを超えています。${image.naturalWidth}x${image.naturalHeight}pxです。縮小してからお試しください。`);
      return false;
    }

    return true;
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      revokeImageUrl();
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed"));
      imageObjectUrl = URL.createObjectURL(file);
      image.src = imageObjectUrl;
    });
  }

  async function handleImageFile(file) {
    clearInlineError();
    resetResult();

    if (!validateFile(file)) {
      byId("imageInput").value = "";
      return;
    }

    try {
      const image = await loadImage(file);
      if (!validateImageDimensions(image)) {
        sourceImage = null;
        sourceFile = null;
        if (byId("imageInput")) byId("imageInput").value = "";
        if (byId("fileName")) byId("fileName").textContent = defaultFileLabel;
        if (byId("previewContainer")) byId("previewContainer").classList.add("hidden");
        if (byId("originalPreview")) byId("originalPreview").removeAttribute("src");
        resetResult();
        revokeImageUrl();
        setBusyState(false);
        setStatus("画像サイズを小さくしてから、もう一度選択してください。");
        return;
      }

      sourceImage = image;
      sourceFile = file;
      if (byId("fileName")) byId("fileName").textContent = `${file.name} / ${image.naturalWidth}x${image.naturalHeight}px / ${formatBytes(file.size)}`;
      if (byId("originalPreview")) byId("originalPreview").src = imageObjectUrl;
      if (byId("previewContainer")) byId("previewContainer").classList.remove("hidden");
      setBusyState(false);
      setStatus("画像を読み込みました。背景が外周に出ている画像ほど安定して透明化できます。");
      showSuccess("画像を読み込みました。");
    } catch (error) {
      resetTool();
      showInlineError("画像ファイルの読み込みに失敗しました。別の画像でお試しください。", error);
    }
  }

  function handleImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (file) handleImageFile(file);
  }

  function pixelOffset(width, x, y) {
    return (y * width + x) * 4;
  }

  function getRgb(data, width, x, y) {
    const offset = pixelOffset(width, x, y);
    return [data[offset], data[offset + 1], data[offset + 2]];
  }

  function median(values) {
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)] || 0;
  }

  function estimateBackgroundColor(data, width, height) {
    const channels = [[], [], []];
    const step = Math.max(1, Math.floor(Math.max(width, height) / 180));

    function sample(x, y) {
      const [r, g, b] = getRgb(data, width, x, y);
      channels[0].push(r);
      channels[1].push(g);
      channels[2].push(b);
    }

    for (let x = 0; x < width; x += step) {
      sample(x, 0);
      sample(x, height - 1);
    }
    for (let y = 0; y < height; y += step) {
      sample(0, y);
      sample(width - 1, y);
    }

    return channels.map(median);
  }

  function colorDistance(data, offset, bg) {
    const dr = data[offset] - bg[0];
    const dg = data[offset + 1] - bg[1];
    const db = data[offset + 2] - bg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function markConnectedBackground(imageData, threshold, backgroundColor) {
    const { data, width, height } = imageData;
    const totalPixels = width * height;
    const mask = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let head = 0;
    let tail = 0;

    function trySeed(x, y) {
      const index = y * width + x;
      if (mask[index]) return;
      const distance = colorDistance(data, index * 4, backgroundColor);
      if (distance <= threshold) {
        mask[index] = 1;
        queue[tail] = index;
        tail += 1;
      }
    }

    for (let x = 0; x < width; x += 1) {
      trySeed(x, 0);
      trySeed(x, height - 1);
    }
    for (let y = 1; y < height - 1; y += 1) {
      trySeed(0, y);
      trySeed(width - 1, y);
    }

    while (head < tail) {
      const index = queue[head];
      head += 1;
      const x = index % width;
      const y = Math.floor(index / width);

      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];

      for (let i = 0; i < neighbors.length; i += 1) {
        const next = neighbors[i];
        if (next < 0 || mask[next]) continue;
        const distance = colorDistance(data, next * 4, backgroundColor);
        if (distance <= threshold) {
          mask[next] = 1;
          queue[tail] = next;
          tail += 1;
        }
      }
    }

    return mask;
  }

  function expandMask(mask, width, height, radius) {
    let current = mask;

    for (let step = 0; step < radius; step += 1) {
      const next = new Uint8Array(current);
      for (let y = 0; y < height; y += 1) {
        const row = y * width;
        for (let x = 0; x < width; x += 1) {
          const index = row + x;
          if (current[index]) continue;
          if (
            (x > 0 && current[index - 1]) ||
            (x < width - 1 && current[index + 1]) ||
            (y > 0 && current[index - width]) ||
            (y < height - 1 && current[index + width])
          ) {
            next[index] = 1;
          }
        }
      }
      current = next;
    }

    return current;
  }

  function removeBackgroundPixels(imageData, threshold, featherRadius) {
    const { data, width, height } = imageData;
    const backgroundColor = estimateBackgroundColor(data, width, height);
    const mask = markConnectedBackground(imageData, threshold, backgroundColor);
    const softEdge = Math.max(10, threshold * 0.38);
    let transparentPixels = 0;
    let softenedPixels = 0;

    for (let i = 0; i < mask.length; i += 1) {
      if (!mask[i]) continue;
      const offset = i * 4;
      if (data[offset + 3] !== 0) transparentPixels += 1;
      data[offset + 3] = 0;
    }

    if (featherRadius > 0) {
      const featherMask = expandMask(mask, width, height, featherRadius);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const pixelIndex = y * width + x;
          if (mask[pixelIndex]) continue;
          if (!featherMask[pixelIndex]) continue;

          const offset = pixelIndex * 4;
          const distance = colorDistance(data, offset, backgroundColor);
          if (distance > threshold + softEdge) continue;

          const edgeAlpha = Math.max(0, Math.min(255, Math.round(255 * ((distance - threshold) / softEdge))));
          if (edgeAlpha < data[offset + 3]) {
            data[offset + 3] = edgeAlpha;
            softenedPixels += 1;
          }
        }
      }
    }

    return {
      backgroundColor,
      softenedPixels,
      transparentPixels,
    };
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, "image/png");
    });
  }

  async function removeBackground() {
    if (!sourceImage) {
      showInlineError("画像ファイルを選択してください。");
      return;
    }

    clearInlineError();
    const canvas = byId("resultCanvas");
    if (!canvas || typeof canvas.getContext !== "function") {
      showInlineError("このブラウザではプレビュー描画に必要なCanvas機能を利用できません。");
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      showInlineError("Canvasコンテキストを初期化できませんでした。別のブラウザでお試しください。");
      return;
    }

    const threshold = Number(byId("thresholdRange").value) || 34;
    const feather = Number(byId("featherRange").value) || 0;

    setBusyState(true);
    setStatus("処理中です。大きい画像では数秒かかる場合があります。");

    try {
      canvas.width = sourceImage.naturalWidth;
      canvas.height = sourceImage.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sourceImage, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = removeBackgroundPixels(imageData, threshold, feather);
      context.putImageData(imageData, 0, 0);

      const blob = await canvasToBlob(canvas);
      revokeDownloadUrl();
      lastPngBlob = blob;
      downloadObjectUrl = URL.createObjectURL(blob);

      const downloadLink = byId("downloadLink");
      const baseName = safeBaseName(sourceFile && sourceFile.name);
      if (downloadLink) {
        downloadLink.href = downloadObjectUrl;
        downloadLink.download = `${baseName}-transparent.png`;
      }

      byId("resultContainer").classList.remove("hidden");
      setResultActionsEnabled(true);

      const ratio = Math.round((result.transparentPixels / (canvas.width * canvas.height)) * 100);
      const bg = result.backgroundColor.join(", ");
      setStatus(`${canvas.width}x${canvas.height}px / 透明化 ${ratio}% / 推定背景 RGB(${bg}) / 許容範囲 ${threshold} / なじませ ${feather}`);
    } catch (error) {
      resetResult();
      showInlineError("透過PNGの生成に失敗しました。画像サイズを小さくするか、別の画像でお試しください。", error);
      setStatus("処理を完了できませんでした。");
    } finally {
      setBusyState(false);
    }
  }

  async function copyImageToClipboard() {
    if (!lastPngBlob) {
      showInlineError("コピーできる画像がありません。先に透過PNGを生成してください。");
      return;
    }

    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      showInlineError("このブラウザでは画像のクリップボードコピーに対応していません。ダウンロードをご利用ください。");
      return;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": lastPngBlob })]);
      setStatus("透過PNGをクリップボードへコピーしました。");
      showSuccess("画像をコピーしました。");
    } catch (error) {
      showInlineError("画像のコピーに失敗しました。ブラウザの権限設定を確認するか、ダウンロードをご利用ください。", error);
    }
  }

  function scheduleReprocess() {
    byId("thresholdValue").textContent = byId("thresholdRange").value;
    byId("featherValue").textContent = byId("featherRange").value;
    if (isProcessing || !sourceImage || byId("resultContainer").classList.contains("hidden")) return;

    window.clearTimeout(reprocessTimer);
    reprocessTimer = window.setTimeout(removeBackground, 180);
  }

  function bindDropZone() {
    const dropZone = byId("dropZone");
    const input = byId("imageInput");
    if (!dropZone || !input) return;

    dropZone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        input.click();
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (event) => {
      const file = event.dataTransfer?.files?.[0];
      if (file) handleImageFile(file);
    });
  }

  function bindEvents() {
    byId("imageInput").addEventListener("change", handleImageChange);
    byId("removeBgBtn").addEventListener("click", removeBackground);
    byId("resetBtn").addEventListener("click", resetTool);
    byId("copyImageBtn").addEventListener("click", copyImageToClipboard);
    byId("thresholdRange").addEventListener("input", scheduleReprocess);
    byId("featherRange").addEventListener("input", scheduleReprocess);
    byId("downloadLink").addEventListener("click", (event) => {
      const downloadLink = event.currentTarget;
      if (downloadLink?.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        showInlineError("先に透過PNGを生成してからダウンロードしてください。");
      }
    });
    bindDropZone();

    window.addEventListener("beforeunload", () => {
      revokeImageUrl();
      revokeDownloadUrl();
    });
  }

  function init() {
    if (
      !byId("imageInput") ||
      !byId("dropZone") ||
      !byId("thresholdRange") ||
      !byId("featherRange") ||
      !byId("thresholdValue") ||
      !byId("featherValue") ||
      !byId("downloadLink") ||
      !byId("resultContainer")
    ) {
      console.error("bg-remover: required DOM nodes are missing");
      return;
    }

    byId("thresholdValue").textContent = byId("thresholdRange").value;
    byId("featherValue").textContent = byId("featherRange").value;
    setResultActionsEnabled(false);
    setBusyState(false);
    setStatus(defaultStatus);
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
