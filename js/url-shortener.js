(function () {
  "use strict";

  const TRACKING_PARAM_PATTERNS = [
    /^utm_/i,
    /^fbclid$/i,
    /^gclid$/i,
    /^gbraid$/i,
    /^wbraid$/i,
    /^yclid$/i,
    /^msclkid$/i,
    /^igshid$/i,
    /^mc_cid$/i,
    /^mc_eid$/i,
    /^vero_id$/i,
    /^spm$/i,
  ];

  const fallbackText = {
    ja: {
      "urlShortener.shorteningMessage": "外部短縮URLを作成中...",
      "urlShortener.error.invalidUrl": "http:// または https:// で始まる有効なURLを入力してください。",
      "urlShortener.error.apiError": "外部短縮URLの作成に失敗しました。整理済みURLと共有用リンクは利用できます。",
      "urlShortener.copiedMessage": "コピーしました",
      "urlShortener.copyButton": "コピー",
      "urlShortener.statsInfo": "統計はis.gdによって提供され、反映に時間がかかる場合があります。",
      "urlShortener.statsNotEnabled": "この短縮URLでは統計ログを有効にしていません。",
      "urlShortener.analysisLabel": "解析",
      "urlShortener.analysisDomain": "ドメイン",
      "urlShortener.analysisLength": "文字数",
      "urlShortener.analysisParams": "クエリ数",
      "urlShortener.analysisRemoved": "削除した追跡パラメータ",
    },
    en: {
      "urlShortener.shorteningMessage": "Creating an external short URL...",
      "urlShortener.error.invalidUrl": "Enter a valid URL that starts with http:// or https://.",
      "urlShortener.error.apiError": "External URL shortening failed. The cleaned URL and share links are still ready.",
      "urlShortener.copiedMessage": "Copied",
      "urlShortener.copyButton": "Copy",
      "urlShortener.statsInfo": "Stats are provided by is.gd and may take a few moments to update.",
      "urlShortener.statsNotEnabled": "Statistics logging was not enabled for this short URL.",
      "urlShortener.analysisLabel": "Analysis",
      "urlShortener.analysisDomain": "Domain",
      "urlShortener.analysisLength": "Length",
      "urlShortener.analysisParams": "Query params",
      "urlShortener.analysisRemoved": "Removed tracking params",
    },
  };

  const state = {
    originalUrl: "",
    cleanUrl: "",
    removedParams: [],
  };

  function $(id) {
    return document.getElementById(id);
  }

  function getLanguage() {
    if (window.NegiI18n && typeof window.NegiI18n.getLanguage === "function") {
      return window.NegiI18n.getLanguage() === "en" ? "en" : "ja";
    }
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function t(key) {
    const lang = getLanguage();
    if (window.NegiI18n && typeof window.NegiI18n.resolve === "function") {
      const value = window.NegiI18n.resolve(lang, key);
      if (typeof value === "string") return value;
    }
    if (window.translations && window.translations[lang] && typeof window.translations[lang][key] === "string") {
      return window.translations[lang][key];
    }
    return (fallbackText[lang] && fallbackText[lang][key]) || fallbackText.en[key] || key;
  }

  function readUrlInput() {
    if (window.CommonUtils && typeof window.CommonUtils.getFormValue === "function") {
      return window.CommonUtils.getFormValue("longUrlInput", true, 4000);
    }
    const input = $("longUrlInput");
    return input ? input.value.trim() : "";
  }

  function isValidHttpUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function shouldRemoveParam(key) {
    return TRACKING_PARAM_PATTERNS.some((pattern) => pattern.test(key));
  }

  function buildCleanUrl(rawUrl) {
    const url = new URL(rawUrl);
    const removeTracking = $("removeTracking") ? $("removeTracking").checked : true;
    const sortParams = $("sortParams") ? $("sortParams").checked : true;
    const entries = Array.from(url.searchParams.entries());
    const kept = [];
    const removed = [];

    entries.forEach(([key, value]) => {
      if (removeTracking && shouldRemoveParam(key)) {
        removed.push(key);
      } else {
        kept.push([key, value]);
      }
    });

    if (sortParams) {
      kept.sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));
    }

    url.search = "";
    kept.forEach(([key, value]) => url.searchParams.append(key, value));

    return {
      url: url.toString(),
      removedParams: removed,
      keptParamCount: kept.length,
    };
  }

  function displayNameFor(urlString) {
    try {
      const url = new URL(urlString);
      return url.hostname.replace(/^www\./, "");
    } catch (_) {
      return "link";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderLocalResults(originalUrl, cleanUrl, removedParams, keptParamCount) {
    const title = displayNameFor(cleanUrl);
    $("cleanUrlOutput").value = cleanUrl;
    $("markdownOutput").value = `[${title}](${cleanUrl})`;
    $("htmlOutput").value = `<a href="${escapeHtml(cleanUrl)}" rel="noopener noreferrer">${escapeHtml(title)}</a>`;
    $("urlAnalysis").innerHTML = [
      `<strong>${escapeHtml(t("urlShortener.analysisLabel"))}</strong>`,
      `${escapeHtml(t("urlShortener.analysisDomain"))}: ${escapeHtml(title)}`,
      `${escapeHtml(t("urlShortener.analysisLength"))}: ${originalUrl.length} -> ${cleanUrl.length}`,
      `${escapeHtml(t("urlShortener.analysisParams"))}: ${keptParamCount}`,
      `${escapeHtml(t("urlShortener.analysisRemoved"))}: ${removedParams.length ? escapeHtml([...new Set(removedParams)].join(", ")) : "0"}`,
    ].join("<br>");
  }

  function clearMessages() {
    $("statusMessage").textContent = "";
    $("errorMessage").textContent = "";
    $("copyMessage").textContent = "";
    $("statsLinkContainer").classList.add("hidden");
    $("statsNotEnabledMessage").classList.add("hidden");
    $("shortUrlGroup").classList.add("hidden");
  }

  async function createShortUrl(url, withStats) {
    const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}&logstats=${withStats ? 1 : 0}`;
    const response = await fetch(apiUrl);
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
    if (!response.ok || !data || !data.shorturl) {
      throw new Error((data && data.errormessage) || `Shortener status ${response.status}`);
    }
    return data.shorturl;
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function bindCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach((button) => {
      if (button.getAttribute("data-url-copy-bound") === "1") return;
      button.setAttribute("data-url-copy-bound", "1");
      button.addEventListener("click", async () => {
        const target = $(button.getAttribute("data-copy-target"));
        if (!target || !target.value) return;
        const original = button.textContent;
        try {
          await copyText(target.value);
          $("copyMessage").textContent = t("urlShortener.copiedMessage");
          button.textContent = t("urlShortener.copiedMessage");
          setTimeout(() => {
            $("copyMessage").textContent = "";
            button.textContent = t("urlShortener.copyButton");
          }, 1800);
        } catch (_) {
          button.textContent = original;
          $("copyMessage").textContent = "Copy failed.";
        }
      });
    });
  }

  async function handleSubmit() {
    clearMessages();
    const rawUrl = readUrlInput();
    if (!rawUrl || !isValidHttpUrl(rawUrl) || (window.SecurityUtils && !window.SecurityUtils.validateUrl(rawUrl))) {
      $("errorMessage").textContent = t("urlShortener.error.invalidUrl");
      return;
    }

    const clean = buildCleanUrl(rawUrl);
    state.originalUrl = rawUrl;
    state.cleanUrl = clean.url;
    state.removedParams = clean.removedParams;

    renderLocalResults(rawUrl, clean.url, clean.removedParams, clean.keptParamCount);
    $("resultContainer").classList.remove("hidden");
    $("statusMessage").textContent = t("urlShortener.shorteningMessage");
    $("shortenButton").disabled = true;

    try {
      const withStats = $("enableStats") ? $("enableStats").checked : false;
      const shortUrl = await createShortUrl(clean.url, withStats);
      $("shortUrlOutput").value = shortUrl;
      $("shortUrlGroup").classList.remove("hidden");
      if (withStats) {
        $("statsLink").href = `https://is.gd/stats.php?url=${shortUrl.replace(/^https?:\/\//, "")}`;
        $("statsInfoMessage").textContent = t("urlShortener.statsInfo");
        $("statsLinkContainer").classList.remove("hidden");
      } else {
        $("statsNotEnabledMessage").textContent = t("urlShortener.statsNotEnabled");
        $("statsNotEnabledMessage").classList.remove("hidden");
      }
    } catch (error) {
      console.warn("URL shortening unavailable:", error);
      $("errorMessage").textContent = t("urlShortener.error.apiError");
    } finally {
      $("statusMessage").textContent = "";
      $("shortenButton").disabled = false;
    }
  }

  function refreshLanguageSensitiveOutput() {
    if (state.cleanUrl) {
      const clean = buildCleanUrl(state.originalUrl);
      renderLocalResults(state.originalUrl, clean.url, clean.removedParams, clean.keptParamCount);
    }
    document.querySelectorAll("[data-copy-target]").forEach((button) => {
      button.textContent = t("urlShortener.copyButton");
    });
  }

  function init() {
    if (!$("shortenButton")) return;
    $("shortenButton").addEventListener("click", handleSubmit);
    bindCopyButtons();
    window.addEventListener("languageChanged", refreshLanguageSensitiveOutput);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
