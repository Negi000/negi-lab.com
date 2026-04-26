// Browser-only transparent background helper for simple, mostly solid backgrounds.
(function () {
  "use strict";

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const maxFileSize = 10 * 1024 * 1024;
  let sourceImage = null;
  let imageObjectUrl = null;
  let downloadObjectUrl = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function showError(message, error) {
    if (window.SecurityUtils?.showUserError) {
      window.SecurityUtils.showUserError(message, error);
    } else {
      alert(message);
    }
    if (error) console.error(error);
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

  function resetResult() {
    const resultContainer = byId("resultContainer");
    if (resultContainer) resultContainer.classList.add("hidden");
    const downloadLink = byId("downloadLink");
    if (downloadLink) downloadLink.removeAttribute("href");
    revokeDownloadUrl();
  }

  function validateFile(file) {
    if (!allowedTypes.has(file.type)) {
      showError("PNG、JPEG、WebP、GIF形式の画像ファイルを選択してください。SVGは安全性と描画差異を避けるため対象外です。");
      return false;
    }

    if (window.SecurityUtils?.validateFileSize) {
      if (!window.SecurityUtils.validateFileSize(file, 10)) {
        showError("ファイルサイズが10MB以下の画像を選択してください。");
        return false;
      }
    } else if (file.size > maxFileSize) {
      showError("ファイルサイズが10MB以下の画像を選択してください。");
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

  async function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = "";
      sourceImage = null;
      resetResult();
      return;
    }

    try {
      sourceImage = await loadImage(file);
      byId("fileName").textContent = file.name;
      byId("originalPreview").src = imageObjectUrl;
      byId("previewContainer").classList.remove("hidden");
      byId("removeBgBtn").disabled = false;
      resetResult();
      setStatus("画像を読み込みました。背景が四隅に出ている画像ほどきれいに処理できます。");
      showSuccess("画像を読み込みました。");
    } catch (error) {
      sourceImage = null;
      byId("fileName").textContent = "";
      byId("previewContainer").classList.add("hidden");
      byId("removeBgBtn").disabled = true;
      resetResult();
      showError("画像ファイルの読み込みに失敗しました。", error);
    }
  }

  function averageCornerColor(data, width, height) {
    const points = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
    ];
    const total = points.reduce(
      (sum, [x, y]) => {
        const index = (y * width + x) * 4;
        sum[0] += data[index];
        sum[1] += data[index + 1];
        sum[2] += data[index + 2];
        return sum;
      },
      [0, 0, 0],
    );
    return total.map((value) => Math.round(value / points.length));
  }

  function removeBackgroundPixels(imageData, threshold) {
    const { data, width, height } = imageData;
    const [bgR, bgG, bgB] = averageCornerColor(data, width, height);
    const softEdge = Math.max(12, threshold * 0.45);
    let transparentPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - bgR;
      const dg = data[i + 1] - bgG;
      const db = data[i + 2] - bgB;
      const distance = Math.sqrt(dr * dr + dg * dg + db * db);

      if (distance <= threshold) {
        if (data[i + 3] !== 0) transparentPixels += 1;
        data[i + 3] = 0;
      } else if (distance <= threshold + softEdge) {
        const alpha = Math.round(255 * ((distance - threshold) / softEdge));
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }

    return transparentPixels;
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
      showError("画像ファイルを選択してください。");
      return;
    }

    const canvas = byId("resultCanvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(sourceImage, 0, 0);

    const threshold = Number(byId("thresholdRange").value) || 32;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const transparentPixels = removeBackgroundPixels(imageData, threshold);
    context.putImageData(imageData, 0, 0);

    try {
      const blob = await canvasToBlob(canvas);
      revokeDownloadUrl();
      downloadObjectUrl = URL.createObjectURL(blob);
      const downloadLink = byId("downloadLink");
      downloadLink.href = downloadObjectUrl;
      downloadLink.download = "transparent-background.png";
      byId("resultContainer").classList.remove("hidden");
      const ratio = Math.round((transparentPixels / (canvas.width * canvas.height)) * 100);
      setStatus(`${canvas.width}x${canvas.height}px / 透明化した画素: ${ratio}% / 許容範囲: ${threshold}`);
    } catch (error) {
      showError("透過PNGの生成に失敗しました。", error);
    }
  }

  function bindEvents() {
    byId("imageInput").addEventListener("change", handleImageChange);
    byId("removeBgBtn").addEventListener("click", removeBackground);
    byId("thresholdRange").addEventListener("input", (event) => {
      byId("thresholdValue").textContent = event.target.value;
    });
    window.addEventListener("beforeunload", () => {
      revokeImageUrl();
      revokeDownloadUrl();
    });
  }

  function init() {
    if (window.renderSmartAds) window.renderSmartAds("smart-ads");
    byId("thresholdValue").textContent = byId("thresholdRange").value;
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
