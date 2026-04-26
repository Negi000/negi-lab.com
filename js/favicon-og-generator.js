// Favicon and OG image generator controller.
(function () {
  "use strict";

  const sizes = {
    favicon: [32, 32, "favicon.png"],
    ogp: [1200, 630, "og-image.png"],
    icon180: [180, 180, "apple-touch-icon.png"],
    icon192: [192, 192, "android-chrome-192x192.png"],
  };
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

  let uploadedImage = null;
  let imageObjectUrl = null;
  let downloadObjectUrl = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function showError(message, error) {
    if (window.SecurityUtils?.showUserError) window.SecurityUtils.showUserError(message, error);
    else alert(message);
    if (error) console.error(error);
  }

  function showSuccess(message) {
    if (window.SecurityUtils?.showSuccessMessage) window.SecurityUtils.showSuccessMessage(message);
  }

  function safeText(value, maxLength = 32) {
    const text = String(value || "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
    return text.slice(0, maxLength);
  }

  function setStatus(message) {
    const status = byId("generationStatus");
    if (status) status.textContent = message;
  }

  function revokeImageUrl() {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
  }

  function revokeDownloadUrl() {
    if (downloadObjectUrl) URL.revokeObjectURL(downloadObjectUrl);
    downloadObjectUrl = null;
  }

  function validateFile(file) {
    if (!allowedTypes.has(file.type)) {
      showError("PNG、JPEG、WebP、GIF形式の画像ファイルを選択してください");
      return false;
    }
    if (window.SecurityUtils?.validateFileSize) {
      if (!window.SecurityUtils.validateFileSize(file, 10)) {
        showError("ファイルサイズが10MB以下の画像を選択してください");
        return false;
      }
    } else if (file.size > 10 * 1024 * 1024) {
      showError("ファイルサイズが10MB以下の画像を選択してください");
      return false;
    }
    return true;
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      revokeImageUrl();
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed"));
      imageObjectUrl = URL.createObjectURL(file);
      image.src = imageObjectUrl;
    });
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      uploadedImage = null;
      byId("fileName").textContent = "";
      return;
    }
    if (!validateFile(file)) {
      event.target.value = "";
      uploadedImage = null;
      byId("fileName").textContent = "";
      return;
    }

    try {
      uploadedImage = await loadImageFromFile(file);
      byId("fileName").textContent = file.name;
      showSuccess("画像を読み込みました");
    } catch (error) {
      uploadedImage = null;
      event.target.value = "";
      byId("fileName").textContent = "";
      showError("画像の読み込みに失敗しました", error);
    }
  }

  function getSize() {
    const selected = byId("sizeSelect").value;
    if (selected === "custom") {
      const width = Math.min(2048, Math.max(16, Number(byId("customWidth").value) || 512));
      const height = Math.min(2048, Math.max(16, Number(byId("customHeight").value) || 512));
      byId("customWidth").value = String(width);
      byId("customHeight").value = String(height);
      return [width, height, "custom-image.png"];
    }
    return sizes[selected] || sizes.favicon;
  }

  function updateCustomFields() {
    const show = byId("sizeSelect").value === "custom";
    [byId("customWidth"), byId("customHeight"), byId("customX")].forEach((element) => {
      if (element) element.style.display = show ? "" : "none";
    });
  }

  function drawCover(ctx, image, width, height) {
    const ratio = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * ratio;
    const drawHeight = image.naturalHeight * ratio;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  }

  function drawText(ctx, text, width, height) {
    if (!text) return;
    const isWide = width / height > 1.5;
    const maxFont = isWide ? height * 0.22 : height * 0.52;
    const fontSize = Math.max(14, Math.min(maxFont, width / Math.max(2.5, text.length * 0.62)));
    ctx.font = `800 ${fontSize}px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,0.24)";
    ctx.lineWidth = Math.max(2, fontSize * 0.08);
    ctx.fillStyle = byId("textColorInput").value || "#ffffff";
    ctx.strokeText(text, width / 2, height / 2);
    ctx.fillText(text, width / 2, height / 2);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, "image/png");
    });
  }

  async function generateImage() {
    const [width, height, filename] = getSize();
    const canvas = byId("resultCanvas");
    const ctx = canvas.getContext("2d");
    const text = safeText(byId("textInput").value);

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = byId("bgColorInput").value || "#4ade80";
    ctx.fillRect(0, 0, width, height);

    if (uploadedImage) {
      drawCover(ctx, uploadedImage, width, height);
      if (text) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, width, height);
      }
    }
    drawText(ctx, text, width, height);

    try {
      const blob = await canvasToBlob(canvas);
      revokeDownloadUrl();
      downloadObjectUrl = URL.createObjectURL(blob);
      byId("downloadLink").href = downloadObjectUrl;
      byId("downloadLink").download = filename;
      byId("resultContainer").classList.remove("hidden");
      setStatus(`${width}x${height}px / PNG`);
    } catch (error) {
      showError("画像の生成に失敗しました", error);
    }
  }

  function bindEvents() {
    byId("imageInput").addEventListener("change", handleFileChange);
    byId("sizeSelect").addEventListener("change", updateCustomFields);
    byId("generateBtn").addEventListener("click", generateImage);
    [byId("textInput"), byId("bgColorInput"), byId("textColorInput"), byId("customWidth"), byId("customHeight")].forEach((element) => {
      element.addEventListener("input", () => {
        if (!byId("resultContainer").classList.contains("hidden")) generateImage();
      });
    });
    window.addEventListener("beforeunload", () => {
      revokeImageUrl();
      revokeDownloadUrl();
    });
  }

  function init() {
    if (window.renderSmartAds) window.renderSmartAds("smart-ads");
    updateCustomFields();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
