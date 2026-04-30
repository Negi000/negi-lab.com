// Browser-only PDF utilities powered by the locally hosted pdf-lib bundle.
(function () {
  "use strict";

  const MAX_PDF_SIZE_MB = 50;
  const MAX_IMAGE_SIZE_MB = 20;
  const MAX_TOTAL_IMAGE_PIXELS = 48_000_000;
  const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

  let loadedPdfFiles = [];
  let loadedImageFiles = [];
  let resultUrls = [];
  let currentTaskButton = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function t(key, fallback, replacements) {
    const value = window.NegiI18n?.translate ? window.NegiI18n.translate(key, fallback) : fallback;
    return Object.entries(replacements || {}).reduce(
      (text, entry) => text.replaceAll(`{${entry[0]}}`, String(entry[1])),
      value || key,
    );
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

  function setStatus(message, tone) {
    const status = byId("pdfStatus");
    if (!status) return;
    status.textContent = message;
    status.className = tone === "error" ? "text-sm text-red-700" : "text-sm text-gray-700";
  }

  function revokeResultUrls() {
    resultUrls.forEach((url) => URL.revokeObjectURL(url));
    resultUrls = [];
  }

  function clearResults(options) {
    revokeResultUrls();
    byId("pdfResult")?.replaceChildren();
    if (!options?.keepStatus) setStatus(t("pdfTool.initialStatus", "ファイルを選択してください。"));
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function validateFileSize(file, maxMb) {
    if (window.SecurityUtils?.validateFileSize) {
      return window.SecurityUtils.validateFileSize(file, maxMb);
    }
    return file.size <= maxMb * 1024 * 1024;
  }

  function isPdf(file) {
    return file?.type === "application/pdf" || /\.pdf$/i.test(file?.name || "");
  }

  function validatePdfFile(file) {
    if (!isPdf(file)) {
      showError(t("pdfTool.errorInvalidPdf", "PDFファイルのみ選択できます。"));
      return false;
    }
    if (!validateFileSize(file, MAX_PDF_SIZE_MB)) {
      showError(t("pdfTool.errorPdfTooLarge", "PDFは1ファイル{max}MB以下にしてください。", { max: MAX_PDF_SIZE_MB }));
      return false;
    }
    return true;
  }

  function validateImageFile(file) {
    if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
      showError(t("pdfTool.errorInvalidImage", "PNG/JPEG/WebP/GIF画像を選択してください。SVGやHEICは対象外です。"));
      return false;
    }
    if (!validateFileSize(file, MAX_IMAGE_SIZE_MB)) {
      showError(t("pdfTool.errorImageTooLarge", "画像は1ファイル{max}MB以下にしてください。", { max: MAX_IMAGE_SIZE_MB }));
      return false;
    }
    return true;
  }

  function renderFileList(element, files) {
    if (!element) return;
    element.replaceChildren();

    if (!files.length) {
      const empty = document.createElement("p");
      empty.textContent = t("pdfTool.noFiles", "選択中のファイルはありません。");
      element.appendChild(empty);
      return;
    }

    const list = document.createElement("ul");
    list.className = "space-y-1";
    files.forEach((file) => {
      const item = document.createElement("li");
      item.textContent = `${file.name} / ${formatBytes(file.size)}`;
      list.appendChild(item);
    });
    element.appendChild(list);
  }

  function updatePdfButtons() {
    const busy = Boolean(currentTaskButton);
    byId("mergeBtn").disabled = busy || loadedPdfFiles.length < 2;
    byId("splitBtn").disabled = busy || loadedPdfFiles.length !== 1;
    byId("compactBtn").disabled = busy || loadedPdfFiles.length === 0;
  }

  function updateImageButtons() {
    byId("img2pdfBtn").disabled = Boolean(currentTaskButton) || loadedImageFiles.length === 0;
  }

  function updateControls() {
    updatePdfButtons();
    updateImageButtons();
  }

  function handlePdfSelection(event) {
    const files = Array.from(event.target.files || []);
    if (!files.every(validatePdfFile)) {
      event.target.value = "";
      loadedPdfFiles = [];
      setStatus(t("pdfTool.selectionRejected", "対応していないファイルが含まれていたため、選択を解除しました。"), "error");
    } else {
      loadedPdfFiles = files;
      setStatus(
        files.length
          ? t("pdfTool.pdfLoadedStatus", "{count}個のPDFを読み込みました。実行する処理を選んでください。", { count: files.length })
          : t("pdfTool.initialStatus", "ファイルを選択してください。"),
      );
      if (files.length) showSuccess(t("pdfTool.pdfLoadedToast", "{count}個のPDFを読み込みました。", { count: files.length }));
    }

    renderFileList(byId("pdfFileList"), loadedPdfFiles);
    clearResults({ keepStatus: true });
    updateControls();
  }

  function handleImageSelection(event) {
    const files = Array.from(event.target.files || []);
    if (!files.every(validateImageFile)) {
      event.target.value = "";
      loadedImageFiles = [];
      setStatus(t("pdfTool.selectionRejected", "対応していないファイルが含まれていたため、選択を解除しました。"), "error");
    } else {
      loadedImageFiles = files;
      setStatus(
        files.length
          ? t("pdfTool.imageLoadedStatus", "{count}個の画像を読み込みました。PDFに変換できます。", { count: files.length })
          : t("pdfTool.initialStatus", "ファイルを選択してください。"),
      );
      if (files.length) showSuccess(t("pdfTool.imageLoadedToast", "{count}個の画像を読み込みました。", { count: files.length }));
    }

    renderFileList(byId("imgFileList"), loadedImageFiles);
    clearResults({ keepStatus: true });
    updateControls();
  }

  function ensurePdfLib() {
    if (!window.PDFLib?.PDFDocument) {
      throw new Error("PDF library is not loaded");
    }
    return window.PDFLib;
  }

  function createDownloadLink(blob, filename, label) {
    const url = URL.createObjectURL(blob);
    resultUrls.push(url);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.className = "inline-flex rounded border border-accent px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent";
    link.textContent = `${label} (${formatBytes(blob.size)})`;
    return link;
  }

  function showLinks(links, lead) {
    const result = byId("pdfResult");
    result.replaceChildren();
    if (lead) {
      const paragraph = document.createElement("p");
      paragraph.className = "mb-3 text-sm text-gray-700";
      paragraph.textContent = lead;
      result.appendChild(paragraph);
    }
    const list = document.createElement("div");
    list.className = "flex flex-wrap gap-2";
    links.forEach((link) => list.appendChild(link));
    result.appendChild(list);
  }

  async function runTask(button, message, task) {
    if (!button || button.disabled) return;
    clearResults({ keepStatus: true });
    setStatus(message);
    currentTaskButton = button;
    updateControls();
    try {
      await task();
    } catch (error) {
      const messageKey = button.id === "img2pdfBtn" ? "pdfTool.errorImageTask" : "pdfTool.errorPdfTask";
      const fallback =
        button.id === "img2pdfBtn"
          ? "画像からPDFへの変換に失敗しました。別の画像や小さい画像でお試しください。"
          : "PDF処理に失敗しました。暗号化PDF、破損PDF、大容量PDFでは処理できない場合があります。";
      showError(t(messageKey, fallback), error);
      setStatus(t(messageKey, fallback), "error");
    } finally {
      currentTaskButton = null;
      updateControls();
    }
  }

  async function mergePdfs() {
    await runTask(byId("mergeBtn"), t("pdfTool.statusMerging", "PDFを結合しています..."), async () => {
      const { PDFDocument } = ensurePdfLib();
      const mergedPdf = await PDFDocument.create();
      for (const file of loadedPdfFiles) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const pages = await mergedPdf.copyPages(source, source.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const bytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      showLinks(
        [createDownloadLink(blob, "merged.pdf", t("pdfTool.downloadMerged", "結合PDFをダウンロード"))],
        t("pdfTool.mergedLead", "{count}個のPDFを結合しました。", { count: loadedPdfFiles.length }),
      );
      setStatus(t("pdfTool.statusMerged", "結合PDFを生成しました。"));
    });
  }

  async function splitPdf() {
    await runTask(byId("splitBtn"), t("pdfTool.statusSplitting", "PDFをページごとに分割しています..."), async () => {
      const { PDFDocument } = ensurePdfLib();
      const source = await PDFDocument.load(await loadedPdfFiles[0].arrayBuffer());
      const links = [];
      for (const pageIndex of source.getPageIndices()) {
        const newPdf = await PDFDocument.create();
        const [copied] = await newPdf.copyPages(source, [pageIndex]);
        newPdf.addPage(copied);
        const bytes = await newPdf.save({ useObjectStreams: true });
        const blob = new Blob([bytes], { type: "application/pdf" });
        links.push(createDownloadLink(blob, `page-${pageIndex + 1}.pdf`, t("pdfTool.downloadPage", "{page}ページ目", { page: pageIndex + 1 })));
      }
      showLinks(links, t("pdfTool.splitLead", "{count}ページに分割しました。", { count: links.length }));
      setStatus(t("pdfTool.statusSplit", "ページごとのPDFを生成しました。"));
    });
  }

  async function compactPdfs() {
    await runTask(byId("compactBtn"), t("pdfTool.statusCompacting", "PDFを再保存しています..."), async () => {
      const { PDFDocument } = ensurePdfLib();
      const compactPdf = await PDFDocument.create();
      for (const file of loadedPdfFiles) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const pages = await compactPdf.copyPages(source, source.getPageIndices());
        pages.forEach((page) => compactPdf.addPage(page));
      }
      const bytes = await compactPdf.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      const originalSize = loadedPdfFiles.reduce((sum, file) => sum + file.size, 0);
      showLinks(
        [createDownloadLink(blob, "resaved.pdf", t("pdfTool.downloadCompacted", "再保存PDFをダウンロード"))],
        t("pdfTool.compactLead", "元サイズ: {before} / 生成後: {after}。画像圧縮ではないため、サイズが増える場合があります。", {
          before: formatBytes(originalSize),
          after: formatBytes(blob.size),
        }),
      );
      setStatus(t("pdfTool.statusCompacted", "PDFを再保存しました。"));
    });
  }

  function loadImageElement(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        if (image.naturalWidth * image.naturalHeight > MAX_TOTAL_IMAGE_PIXELS) {
          reject(new Error("Image dimensions are too large"));
          return;
        }
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };
      image.src = url;
    });
  }

  async function imageFileToPdfImage(pdfDoc, file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (file.type === "image/jpeg") {
      return pdfDoc.embedJpg(bytes);
    }
    if (file.type === "image/png") {
      return pdfDoc.embedPng(bytes);
    }

    const image = await loadImageElement(file);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available");
    context.drawImage(image, 0, 0);
    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))), "image/png");
    });
    return pdfDoc.embedPng(new Uint8Array(await pngBlob.arrayBuffer()));
  }

  async function imagesToPdf() {
    await runTask(byId("img2pdfBtn"), t("pdfTool.statusImages", "画像をPDFに変換しています..."), async () => {
      const { PDFDocument } = ensurePdfLib();
      const pdfDoc = await PDFDocument.create();
      for (const file of loadedImageFiles) {
        const image = await imageFileToPdfImage(pdfDoc, file);
        const maxSide = 1440;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, { x: 0, y: 0, width, height });
      }
      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      showLinks(
        [createDownloadLink(blob, "images.pdf", t("pdfTool.downloadImages", "画像PDFをダウンロード"))],
        t("pdfTool.imagesLead", "{count}個の画像をPDFにまとめました。", { count: loadedImageFiles.length }),
      );
      setStatus(t("pdfTool.statusImagesDone", "画像PDFを生成しました。"));
    });
  }

  function init() {
    byId("pdfFiles")?.addEventListener("change", handlePdfSelection);
    byId("imgFiles")?.addEventListener("change", handleImageSelection);
    byId("mergeBtn")?.addEventListener("click", mergePdfs);
    byId("splitBtn")?.addEventListener("click", splitPdf);
    byId("compactBtn")?.addEventListener("click", compactPdfs);
    byId("img2pdfBtn")?.addEventListener("click", imagesToPdf);
    renderFileList(byId("pdfFileList"), loadedPdfFiles);
    renderFileList(byId("imgFileList"), loadedImageFiles);
    setStatus(t("pdfTool.initialStatus", "ファイルを選択してください。"));
    updateControls();
    window.addEventListener("beforeunload", revokeResultUrls);
    window.addEventListener("languageChanged", () => {
      renderFileList(byId("pdfFileList"), loadedPdfFiles);
      renderFileList(byId("imgFileList"), loadedImageFiles);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
