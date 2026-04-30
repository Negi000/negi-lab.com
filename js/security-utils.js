/**
 * Shared security and validation helpers.
 */

(function () {
  "use strict";

  function escapeHtml(unsafe) {
    if (typeof unsafe !== "string") return String(unsafe);
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sanitizeInput(input, maxLength = 1000) {
    if (!input || typeof input !== "string") return "";

    let value = input;
    if (value.length > maxLength) {
      console.warn(`Input exceeded max length ${maxLength}; it was truncated.`);
      value = value.substring(0, maxLength);
    }

    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "")
      .replace(/javascript:/gi, "")
      .trim();
  }

  function validateFileType(file, allowedTypes = []) {
    if (!file || !file.type) {
      console.error("Invalid file.");
      return false;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      console.error(`Unsupported file type: ${file.type}`);
      return false;
    }

    const validExtensions = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
      "application/pdf": [".pdf"],
    };

    if (validExtensions[file.type]) {
      const fileName = file.name.toLowerCase();
      const isValidExt = validExtensions[file.type].some((ext) => fileName.endsWith(ext));
      if (!isValidExt) {
        console.error(`File extension does not match MIME type: ${file.name}`);
        return false;
      }
    }

    return true;
  }

  function validateFileSize(file, maxSizeMB = 10) {
    if (!file) {
      console.error("No file selected.");
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      console.error(`File is too large: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${maxSizeMB}MB`);
      return false;
    }

    return true;
  }

  function validateUrl(url) {
    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        console.error(`Unsupported URL protocol: ${urlObj.protocol}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Invalid URL: ${url}`);
      return false;
    }
  }

  function showToast(message, variant, timeout) {
    const toast = document.createElement("div");
    const isError = variant === "error";
    toast.className = [
      "fixed top-4 right-4 border px-4 py-3 rounded shadow-lg z-50 max-w-md",
      isError ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700",
    ].join(" ");
    toast.setAttribute("role", isError ? "alert" : "status");

    const row = document.createElement("div");
    row.className = "flex items-center justify-between gap-3";

    const body = document.createElement("div");
    const label = document.createElement("strong");
    label.className = "font-bold";
    label.textContent = isError ? "Error: " : "Success: ";

    const text = document.createElement("span");
    text.className = "block sm:inline";
    text.textContent = String(message || "");

    const close = document.createElement("button");
    close.type = "button";
    close.className = isError ? "ml-4 text-red-500 hover:text-red-700" : "ml-4 text-green-500 hover:text-green-700";
    close.setAttribute("aria-label", "Close message");
    close.textContent = "x";
    close.addEventListener("click", () => toast.remove());

    body.append(label, text);
    row.append(body, close);
    toast.append(row);
    document.body.appendChild(toast);

    window.setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, timeout);
  }

  window.SecurityUtils = {
    escapeHtml,
    sanitizeInput,
    validateFileType,
    validateFileSize,
    validateUrl,
    showUserError(message, details = null) {
      showToast(message, "error", 5000);
      if (details) console.error("Error details:", details);
    },
    showSuccessMessage(message) {
      showToast(message, "success", 3000);
    },
  };

  window.SecurityUtils.CSP = {
    generateNonce() {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, array));
    },
    executeInlineScript(scriptContent, nonce = null) {
      const script = document.createElement("script");
      if (nonce) script.nonce = nonce;
      script.textContent = scriptContent;
      document.head.appendChild(script);
      document.head.removeChild(script);
    },
  };
})();
