// Browser-only favicon, app icon, and OGP image generator.
(function () {
  "use strict";

  const presets = {
    favicon16: { width: 16, height: 16, filename: "favicon-16x16.png", label: "Favicon 16x16", kind: "icon" },
    favicon32: { width: 32, height: 32, filename: "favicon-32x32.png", label: "Favicon 32x32", kind: "icon" },
    apple180: { width: 180, height: 180, filename: "apple-touch-icon.png", label: "Apple Touch Icon 180x180", kind: "icon" },
    android192: { width: 192, height: 192, filename: "android-chrome-192x192.png", label: "Android/PWA Icon 192x192", kind: "icon" },
    android512: { width: 512, height: 512, filename: "android-chrome-512x512.png", label: "Android/PWA Icon 512x512", kind: "icon" },
    ogp: { width: 1200, height: 630, filename: "og-image.png", label: "OGP 1200x630", kind: "ogp" },
  };

  const bundleTargets = [
    presets.favicon16,
    presets.favicon32,
    presets.apple180,
    presets.android192,
    presets.android512,
    presets.ogp,
  ];

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const allowedExtensions = /\.(png|jpe?g|webp|gif)$/i;
  const maxFileSize = 10 * 1024 * 1024;
  const maxPixels = 16 * 1000 * 1000;

  let uploadedImage = null;
  let uploadedFile = null;
  let imageObjectUrl = null;
  let downloadObjectUrl = null;
  let lastPngBlob = null;
  let generateTimer = null;
  let radiusTouched = false;
  let paddingTouched = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function showInlineError(message, error) {
    const alertBox = byId("generationAlert");
    const alertText = byId("generationAlertText");
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
    const alertBox = byId("generationAlert");
    const alertText = byId("generationAlertText");
    if (alertBox) alertBox.classList.add("hidden");
    if (alertText) alertText.textContent = "";
  }

  function showSuccess(message) {
    if (window.SecurityUtils?.showSuccessMessage) {
      window.SecurityUtils.showSuccessMessage(message);
    }
  }

  function safeText(value, maxLength = 48) {
    return String(value || "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
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

  function setResultActionsEnabled(enabled) {
    const downloadLink = byId("downloadLink");
    const copyImageButton = byId("copyImageBtn");

    if (downloadLink) {
      downloadLink.setAttribute("aria-disabled", enabled ? "false" : "true");
      if (!enabled) {
        downloadLink.removeAttribute("href");
      }
    }

    if (copyImageButton) copyImageButton.disabled = !enabled;
  }

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  function bytesStartWith(bytes, signature) {
    if (bytes.length < signature.length) return false;
    return signature.every((value, index) => bytes[index] === value);
  }

  function isWebpSignature(bytes) {
    return bytes.length >= 12
      && bytesStartWith(bytes, [0x52, 0x49, 0x46, 0x46])
      && bytes[8] === 0x57
      && bytes[9] === 0x45
      && bytes[10] === 0x42
      && bytes[11] === 0x50;
  }

  async function hasValidImageSignature(file) {
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    if (file.type === "image/png") return bytesStartWith(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (file.type === "image/jpeg") return bytesStartWith(header, [0xff, 0xd8, 0xff]);
    if (file.type === "image/gif") return bytesStartWith(header, [0x47, 0x49, 0x46, 0x38]);
    if (file.type === "image/webp") return isWebpSignature(header);
    return false;
  }

  async function validateFile(file) {
    if (!file) return false;

    if (!allowedTypes.has(file.type) || !allowedExtensions.test(file.name)) {
      showInlineError("PNG、JPEG、WebP、GIF形式の画像ファイルを選択してください。SVGや不明な形式は対象外です。");
      return false;
    }

    if (file.size <= 0) {
      showInlineError("空のファイルは読み込めません。別の画像を選択してください。");
      return false;
    }

    if (file.size > maxFileSize) {
      showInlineError("ファイルサイズは10MB以下の画像を選択してください。");
      return false;
    }

    try {
      if (!(await hasValidImageSignature(file))) {
        showInlineError("ファイルの内容と画像形式が一致しません。PNG、JPEG、WebP、GIFの画像を選択してください。");
        return false;
      }
    } catch (error) {
      showInlineError("画像ファイルの検証に失敗しました。別の画像でお試しください。", error);
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
      showInlineError(`画像が大きすぎます。現在は${image.naturalWidth}x${image.naturalHeight}pxです。1600万ピクセル以下に縮小してからお試しください。`);
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

  async function handleFile(file) {
    clearInlineError();
    if (!(await validateFile(file))) {
      byId("imageInput").value = "";
      return;
    }

    try {
      const image = await loadImageFromFile(file);
      if (!validateImageDimensions(image)) {
        clearUploadedImage(false);
        return;
      }

      uploadedImage = image;
      uploadedFile = file;
      byId("fileName").textContent = `${file.name} / ${image.naturalWidth}x${image.naturalHeight}px / ${formatBytes(file.size)}`;
      byId("clearImageBtn").disabled = false;
      showSuccess("画像を読み込みました。");
      scheduleGenerate();
    } catch (error) {
      clearUploadedImage(false);
      showInlineError("画像の読み込みに失敗しました。別の画像でお試しください。", error);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (file) handleFile(file);
  }

  function clearUploadedImage(shouldRegenerate = true) {
    uploadedImage = null;
    uploadedFile = null;
    byId("imageInput").value = "";
    byId("fileName").textContent = "画像なし。文字と背景色だけでも生成できます。";
    byId("clearImageBtn").disabled = true;
    revokeImageUrl();
    if (shouldRegenerate) scheduleGenerate();
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function getSelectedPreset() {
    const selected = byId("sizeSelect").value;
    if (selected === "custom") {
      const width = clampNumber(byId("customWidth").value, 16, 2048, 512);
      const height = clampNumber(byId("customHeight").value, 16, 2048, 512);
      byId("customWidth").value = String(width);
      byId("customHeight").value = String(height);
      return {
        width,
        height,
        filename: `custom-${width}x${height}.png`,
        label: `Custom ${width}x${height}`,
        kind: width / height > 1.4 ? "ogp" : "icon",
      };
    }

    return presets[selected] || presets.favicon32;
  }

  function getSettings() {
    return {
      backgroundColor: byId("bgColorInput").value || "#16a34a",
      fit: byId("fitSelect").value === "cover" ? "cover" : "contain",
      paddingPercent: clampNumber(byId("paddingRange").value, 0, 32, 18),
      radiusPercent: clampNumber(byId("radiusRange").value, 0, 50, 18),
      text: safeText(byId("textInput").value),
      textColor: byId("textColorInput").value || "#ffffff",
    };
  }

  function updateRangeOutputs() {
    byId("paddingValue").textContent = `${byId("paddingRange").value}%`;
    byId("radiusValue").textContent = `${byId("radiusRange").value}%`;
  }

  function updateCustomFields() {
    const customGroup = byId("customSizeGroup");
    if (customGroup) customGroup.classList.toggle("hidden", byId("sizeSelect").value !== "custom");
  }

  function applyPresetDefaults() {
    const preset = getSelectedPreset();
    if (!paddingTouched) byId("paddingRange").value = preset.kind === "ogp" ? "10" : "18";
    if (!radiusTouched) byId("radiusRange").value = preset.kind === "ogp" ? "0" : "18";
    updateRangeOutputs();
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawImageFit(ctx, image, x, y, width, height, fit) {
    const ratio = fit === "cover"
      ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
      : Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * ratio;
    const drawHeight = image.naturalHeight * ratio;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }

  function hexToRgb(hex) {
    const normalized = String(hex || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return [255, 255, 255];
    return [
      parseInt(normalized.slice(0, 2), 16),
      parseInt(normalized.slice(2, 4), 16),
      parseInt(normalized.slice(4, 6), 16),
    ];
  }

  function relativeLuminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function wrapText(ctx, text, maxWidth, maxLines) {
    if (!text) return [];
    const hasSpaces = /\s/.test(text);
    const units = hasSpaces ? text.split(/(\s+)/).filter(Boolean) : Array.from(text);
    const lines = [];
    let line = "";

    for (let i = 0; i < units.length; i += 1) {
      const unit = units[i];
      const candidate = `${line}${unit}`;
      if (!line || ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }

      lines.push(line.trim());
      line = unit.trimStart();

      if (lines.length === maxLines) break;
    }

    if (line && lines.length < maxLines) lines.push(line.trim());

    if (lines.length > maxLines) lines.length = maxLines;
    if (lines.length === maxLines && units.join("").length > lines.join("").length) {
      let last = lines[lines.length - 1];
      while (last.length > 1 && ctx.measureText(`${last}...`).width > maxWidth) {
        last = Array.from(last).slice(0, -1).join("");
      }
      lines[lines.length - 1] = `${last}...`;
    }

    return lines.filter(Boolean);
  }

  function drawText(ctx, settings, preset, contentBox) {
    if (!settings.text) return;

    const isOgp = preset.kind === "ogp";
    const maxLines = isOgp ? 2 : 1;
    const minFontSize = isOgp ? 42 : 8;
    const maxFontSize = isOgp ? Math.floor(preset.height * 0.2) : Math.floor(contentBox.height * 0.72);
    let lines = [];
    let fontSize = maxFontSize;

    for (; fontSize >= minFontSize; fontSize -= 2) {
      ctx.font = `800 ${fontSize}px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      lines = wrapText(ctx, settings.text, contentBox.width, maxLines);
      const lineHeight = fontSize * 1.12;
      if (lines.length && lineHeight * lines.length <= contentBox.height) break;
    }

    if (!lines.length) return;

    const lineHeight = fontSize * 1.12;
    const textY = contentBox.y + contentBox.height / 2 - (lineHeight * (lines.length - 1)) / 2;
    const lightText = relativeLuminance(settings.textColor) > 0.55;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.font = `800 ${fontSize}px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.strokeStyle = lightText ? "rgba(0,0,0,0.34)" : "rgba(255,255,255,0.42)";
    ctx.lineWidth = Math.max(1.5, fontSize * 0.08);
    ctx.fillStyle = settings.textColor;
    ctx.shadowColor = lightText ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.18)";
    ctx.shadowBlur = Math.max(2, fontSize * 0.04);

    lines.forEach((line, index) => {
      const y = textY + index * lineHeight;
      ctx.strokeText(line, preset.width / 2, y);
      ctx.fillText(line, preset.width / 2, y);
    });
    ctx.restore();
  }

  function renderToCanvas(canvas, preset, settings) {
    const ctx = canvas.getContext("2d");
    const width = preset.width;
    const height = preset.height;
    const minDimension = Math.min(width, height);
    const padding = Math.round(minDimension * (settings.paddingPercent / 100));
    const radius = Math.round(minDimension * (settings.radiusPercent / 100));
    const contentBox = {
      x: padding,
      y: padding,
      width: Math.max(1, width - padding * 2),
      height: Math.max(1, height - padding * 2),
    };

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    drawRoundedRect(ctx, 0, 0, width, height, radius);
    ctx.fillStyle = settings.backgroundColor;
    ctx.fill();
    ctx.clip();

    if (uploadedImage) {
      drawImageFit(ctx, uploadedImage, contentBox.x, contentBox.y, contentBox.width, contentBox.height, settings.fit);
      if (settings.text) {
        const lightText = relativeLuminance(settings.textColor) > 0.55;
        ctx.fillStyle = lightText ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.18)";
        ctx.fillRect(0, 0, width, height);
      }
    }

    ctx.restore();
    drawText(ctx, settings, preset, contentBox);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, "image/png");
    });
  }

  async function renderPngBlob(preset, settings) {
    const canvas = document.createElement("canvas");
    renderToCanvas(canvas, preset, settings);
    return canvasToBlob(canvas);
  }

  function updateMarkupSnippet() {
    const snippet = [
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
      '<link rel="manifest" href="/site.webmanifest">',
      '<meta property="og:image" content="https://example.com/og-image.png">',
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      '<meta name="twitter:card" content="summary_large_image">',
      '<meta name="twitter:image" content="https://example.com/og-image.png">',
    ].join("\n");

    byId("markupSnippet").value = snippet;
  }

  async function generateImage() {
    clearInlineError();
    const preset = getSelectedPreset();
    const settings = getSettings();
    const canvas = byId("resultCanvas");

    try {
      renderToCanvas(canvas, preset, settings);
      const blob = await canvasToBlob(canvas);
      revokeDownloadUrl();
      lastPngBlob = blob;
      downloadObjectUrl = URL.createObjectURL(blob);

      const downloadLink = byId("downloadLink");
      downloadLink.href = downloadObjectUrl;
      downloadLink.download = preset.filename;
      downloadLink.textContent = `${preset.filename} を保存`;
      setResultActionsEnabled(true);
      updateMarkupSnippet();
      setStatus(`${preset.label} / PNG / ${formatBytes(blob.size)}`);
    } catch (error) {
      lastPngBlob = null;
      setResultActionsEnabled(false);
      showInlineError("画像の生成に失敗しました。設定を確認してもう一度お試しください。", error);
      setStatus("生成できませんでした。");
    }
  }

  function scheduleGenerate() {
    window.clearTimeout(generateTimer);
    generateTimer = window.setTimeout(generateImage, 120);
  }

  async function copyImageToClipboard() {
    if (!lastPngBlob) {
      showInlineError("コピーできる画像がありません。先に画像を生成してください。");
      return;
    }

    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      showInlineError("このブラウザは画像のクリップボードコピーに対応していません。ダウンロードをご利用ください。");
      return;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": lastPngBlob })]);
      setStatus("生成画像をクリップボードへコピーしました。");
      showSuccess("画像をコピーしました。");
    } catch (error) {
      showInlineError("画像のコピーに失敗しました。ブラウザの権限設定を確認するか、ダウンロードをご利用ください。", error);
    }
  }

  async function copyMarkupToClipboard() {
    const snippet = byId("markupSnippet").value;
    if (!navigator.clipboard?.writeText) {
      showInlineError("このブラウザはテキストコピーに対応していません。設置用HTML欄を選択してコピーしてください。");
      return;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setStatus("設置用HTMLをクリップボードへコピーしました。");
      showSuccess("HTMLタグをコピーしました。");
    } catch (error) {
      showInlineError("HTMLタグのコピーに失敗しました。ブラウザの権限設定を確認してください。", error);
    }
  }

  function makeManifestText() {
    return JSON.stringify(
      {
        name: "Site name",
        short_name: "Site",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: byId("bgColorInput").value || "#16a34a",
        background_color: byId("bgColorInput").value || "#16a34a",
        display: "standalone",
      },
      null,
      2,
    );
  }

  function crc32(bytes) {
    let crc = -1;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  })();

  function writeUint16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function writeUint32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }

  function getDosDateTime() {
    const now = new Date();
    const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    return { date, time };
  }

  function createZip(files) {
    const encoder = new TextEncoder();
    const { date, time } = getDosDateTime();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach((file) => {
      const nameBytes = encoder.encode(file.name);
      const data = file.data;
      const checksum = crc32(data);
      const localHeader = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(localHeader.buffer);

      writeUint32(localView, 0, 0x04034b50);
      writeUint16(localView, 4, 20);
      writeUint16(localView, 6, 0x0800);
      writeUint16(localView, 8, 0);
      writeUint16(localView, 10, time);
      writeUint16(localView, 12, date);
      writeUint32(localView, 14, checksum);
      writeUint32(localView, 18, data.length);
      writeUint32(localView, 22, data.length);
      writeUint16(localView, 26, nameBytes.length);
      writeUint16(localView, 28, 0);
      localHeader.set(nameBytes, 30);

      const centralHeader = new Uint8Array(46 + nameBytes.length);
      const centralView = new DataView(centralHeader.buffer);
      writeUint32(centralView, 0, 0x02014b50);
      writeUint16(centralView, 4, 20);
      writeUint16(centralView, 6, 20);
      writeUint16(centralView, 8, 0x0800);
      writeUint16(centralView, 10, 0);
      writeUint16(centralView, 12, time);
      writeUint16(centralView, 14, date);
      writeUint32(centralView, 16, checksum);
      writeUint32(centralView, 20, data.length);
      writeUint32(centralView, 24, data.length);
      writeUint16(centralView, 28, nameBytes.length);
      writeUint16(centralView, 30, 0);
      writeUint16(centralView, 32, 0);
      writeUint16(centralView, 34, 0);
      writeUint16(centralView, 36, 0);
      writeUint32(centralView, 38, 0);
      writeUint32(centralView, 42, offset);
      centralHeader.set(nameBytes, 46);

      localParts.push(localHeader, data);
      centralParts.push(centralHeader);
      offset += localHeader.length + data.length;
    });

    const centralOffset = offset;
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    writeUint32(endView, 0, 0x06054b50);
    writeUint16(endView, 4, 0);
    writeUint16(endView, 6, 0);
    writeUint16(endView, 8, files.length);
    writeUint16(endView, 10, files.length);
    writeUint32(endView, 12, centralSize);
    writeUint32(endView, 16, centralOffset);
    writeUint16(endView, 20, 0);

    return new Blob([...localParts, ...centralParts, endRecord], { type: "application/zip" });
  }

  async function downloadBundleZip() {
    clearInlineError();
    setStatus("基本セットを生成しています。");

    try {
      const settings = getSettings();
      const files = [];

      for (let i = 0; i < bundleTargets.length; i += 1) {
        const target = bundleTargets[i];
        const blob = await renderPngBlob(target, settings);
        files.push({
          name: target.filename,
          data: new Uint8Array(await blob.arrayBuffer()),
        });
      }

      const encoder = new TextEncoder();
      files.push({ name: "favicon-markup.txt", data: encoder.encode(byId("markupSnippet").value) });
      files.push({ name: "site.webmanifest.sample.json", data: encoder.encode(makeManifestText()) });

      const zipBlob = createZip(files);
      const zipUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = zipUrl;
      anchor.download = "favicon-og-assets.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
      setStatus(`基本セットをZIP生成しました。${files.length}ファイル / ${formatBytes(zipBlob.size)}`);
      showSuccess("ZIPを生成しました。");
    } catch (error) {
      showInlineError("ZIPの生成に失敗しました。設定を確認してもう一度お試しください。", error);
      setStatus("ZIPを生成できませんでした。");
    }
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
      if (file) handleFile(file);
    });
  }

  function bindEvents() {
    byId("imageInput").addEventListener("change", handleFileChange);
    byId("generateBtn").addEventListener("click", generateImage);
    byId("clearImageBtn").addEventListener("click", () => clearUploadedImage(true));
    byId("copyImageBtn").addEventListener("click", copyImageToClipboard);
    byId("copyMarkupBtn").addEventListener("click", copyMarkupToClipboard);
    byId("downloadZipBtn").addEventListener("click", downloadBundleZip);
    byId("downloadLink").addEventListener("click", (event) => {
      if (!lastPngBlob) {
        event.preventDefault();
        showInlineError("ダウンロードできる画像がありません。先に画像を生成してください。");
      }
    });

    byId("sizeSelect").addEventListener("change", () => {
      updateCustomFields();
      applyPresetDefaults();
      scheduleGenerate();
    });

    [
      byId("textInput"),
      byId("bgColorInput"),
      byId("textColorInput"),
      byId("fitSelect"),
      byId("customWidth"),
      byId("customHeight"),
    ].forEach((element) => {
      element.addEventListener("input", scheduleGenerate);
      element.addEventListener("change", scheduleGenerate);
    });

    byId("paddingRange").addEventListener("input", () => {
      paddingTouched = true;
      updateRangeOutputs();
      scheduleGenerate();
    });

    byId("radiusRange").addEventListener("input", () => {
      radiusTouched = true;
      updateRangeOutputs();
      scheduleGenerate();
    });

    bindDropZone();

    window.addEventListener("beforeunload", () => {
      revokeImageUrl();
      revokeDownloadUrl();
    });
  }

  function init() {
    updateCustomFields();
    updateRangeOutputs();
    updateMarkupSnippet();
    setResultActionsEnabled(false);
    bindEvents();
    generateImage();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
