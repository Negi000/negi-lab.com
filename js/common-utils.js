/**
 * Shared utility helpers for static browser tools.
 */

(function () {
  "use strict";

  function enhancePageChrome() {
    const main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";

    if (main && !document.querySelector("[data-negi-skip-link]")) {
      const link = document.createElement("a");
      link.href = `#${main.id}`;
      link.setAttribute("data-negi-skip-link", "true");
      link.className = "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded focus:bg-gray-950 focus:px-4 focus:py-2 focus:text-white";
      link.textContent = "Skip to content";
      document.body.insertBefore(link, document.body.firstChild);
    }

    document.querySelectorAll("#lang-switch, #langSelect").forEach((select) => {
      if (!select.getAttribute("aria-label")) select.setAttribute("aria-label", "Language");
    });
  }

  function replaceChildren(element, children) {
    element.replaceChildren(...children.filter(Boolean));
  }

  function showLoading(targetElementId, message = "Processing...") {
    const element = document.getElementById(targetElementId);
    if (!element) return;

    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-center p-8";

    const spinner = document.createElement("div");
    spinner.className = "animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-3";

    const label = document.createElement("span");
    label.className = "text-gray-600";
    label.textContent = message;

    wrapper.append(spinner, label);
    replaceChildren(element, [wrapper]);
  }

  function hideLoading(targetElementId) {
    const element = document.getElementById(targetElementId);
    if (element) element.replaceChildren();
  }

  function safeFilename(filename, fallback = "download") {
    const raw = window.SecurityUtils && SecurityUtils.sanitizeInput
      ? SecurityUtils.sanitizeInput(filename || fallback)
      : String(filename || fallback);
    return raw.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 120) || fallback;
  }

  function downloadFile(blob, filename) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFilename(filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (window.SecurityUtils) SecurityUtils.showSuccessMessage(`Download started: ${a.download}`);
    } catch (error) {
      if (window.SecurityUtils) SecurityUtils.showUserError("Failed to download the file.", error);
      else console.error(error);
    }
  }

  function previewImage(file, previewElementId) {
    const security = window.SecurityUtils;
    if (security && !security.validateFileType(file, ["image/jpeg", "image/png", "image/gif", "image/webp"])) return false;
    if (security && !security.validateFileSize(file, 10)) return false;

    const previewElement = document.getElementById(previewElementId);
    if (!previewElement) {
      console.error(`Preview element not found: ${previewElementId}`);
      return false;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const wrapper = document.createElement("div");
      wrapper.className = "text-center";

      const img = document.createElement("img");
      img.src = event.target.result;
      img.alt = "Preview";
      img.className = "max-w-full h-auto max-h-64 mx-auto rounded border shadow";

      const meta = document.createElement("p");
      meta.className = "text-sm text-gray-600 mt-2";
      meta.textContent = `File: ${file.name} / Size: ${(file.size / 1024).toFixed(1)} KB`;

      wrapper.append(img, meta);
      replaceChildren(previewElement, [wrapper]);
    };

    reader.onerror = function () {
      if (security) security.showUserError("Failed to read the image.");
    };

    reader.readAsDataURL(file);
    return true;
  }

  function copyToClipboard(text, successMessage = "Copied to clipboard.") {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        if (window.SecurityUtils) SecurityUtils.showSuccessMessage(successMessage);
      } catch (error) {
        if (window.SecurityUtils) SecurityUtils.showUserError("Failed to copy to clipboard.", error);
      }
      textArea.remove();
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.SecurityUtils) SecurityUtils.showSuccessMessage(successMessage);
      })
      .catch((error) => {
        if (window.SecurityUtils) SecurityUtils.showUserError("Failed to copy to clipboard.", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhancePageChrome);
  } else {
    enhancePageChrome();
  }

  window.CommonUtils = {
    showLoading,
    hideLoading,
    downloadFile,
    previewImage,
    copyToClipboard,
    safeFilename,
  };
})();
