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
      "urlShortener.copyFailed": "コピーに失敗しました。手動でコピーしてください。",
      "urlShortener.shareReady": "共有用URLを更新しました。",
      "urlShortener.shareUnavailable": "共有機能が使えないため、共有用URLをコピーしました。",
      "urlShortener.shareMissing": "共有する結果がまだありません。",
      "urlShortener.restoreMessage": "URLの内容を復元しました。必要に応じて短縮URLを再作成してください。",
      "urlShortener.copyButton": "コピー",
      "urlShortener.shareButton": "共有URLを共有",
      "urlShortener.statsInfo": "統計はis.gdによって提供され、反映に時間がかかる場合があります。",
      "urlShortener.statsNotEnabled": "この短縮URLでは統計ログを有効にしていません。",
      "urlShortener.historyHint": "この結果は共有用URLとしてブラウザのアドレス欄にも反映されます。",
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
      "urlShortener.copyFailed": "Copy failed. Please copy the text manually.",
      "urlShortener.shareReady": "The shareable URL is ready.",
      "urlShortener.shareUnavailable": "Native sharing is unavailable, so the shareable URL was copied instead.",
      "urlShortener.shareMissing": "Create a result before sharing.",
      "urlShortener.restoreMessage": "Restored the URL from the address bar. Re-create the short URL if you need a fresh external link.",
      "urlShortener.copyButton": "Copy",
      "urlShortener.shareButton": "Share result URL",
      "urlShortener.statsInfo": "Stats are provided by is.gd and may take a few moments to update.",
      "urlShortener.statsNotEnabled": "Statistics logging was not enabled for this short URL.",
      "urlShortener.historyHint": "This result is also reflected in the browser address bar as a shareable URL.",
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
    keptParamCount: 0,
    shortUrl: "",
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

  function setStatus(message, isError) {
    $("statusMessage").textContent = isError ? "" : message;
    $("errorMessage").textContent = isError ? message : "";
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
    const analysis = $("urlAnalysis");
    analysis.replaceChildren();

    const rows = [
      [t("urlShortener.analysisDomain"), title],
      [t("urlShortener.analysisLength"), `${originalUrl.length} -> ${cleanUrl.length}`],
      [t("urlShortener.analysisParams"), String(keptParamCount)],
      [t("urlShortener.analysisRemoved"), removedParams.length ? [...new Set(removedParams)].join(", ") : "0"],
    ];

    const heading = document.createElement("p");
    heading.className = "font-semibold text-gray-700";
    heading.textContent = t("urlShortener.analysisLabel");
    analysis.appendChild(heading);

    rows.forEach(([label, value]) => {
      const row = document.createElement("p");
      const labelNode = document.createElement("span");
      labelNode.className = "font-medium";
      labelNode.textContent = `${label}: `;
      row.append(labelNode, document.createTextNode(value));
      analysis.appendChild(row);
    });
  }

  function buildShareUrl() {
    const url = new URL(window.location.href);
    if (state.originalUrl) {
      url.searchParams.set("url", state.originalUrl);
    } else {
      url.searchParams.delete("url");
    }
    url.searchParams.set("removeTracking", $("removeTracking") && $("removeTracking").checked ? "1" : "0");
    url.searchParams.set("sortParams", $("sortParams") && $("sortParams").checked ? "1" : "0");
    url.searchParams.set("enableStats", $("enableStats") && $("enableStats").checked ? "1" : "0");
    return url;
  }

  function syncHistory() {
    const url = buildShareUrl();
    window.history.replaceState({ tool: "url-shortener" }, "", url);
    $("historyMessage").textContent = t("urlShortener.historyHint");
    $("historyMessage").classList.remove("hidden");
    $("shareButton").classList.remove("hidden");
  }

  function clearMessages() {
    setStatus("", false);
    $("copyMessage").textContent = "";
    $("statsLinkContainer").classList.add("hidden");
    $("statsNotEnabledMessage").classList.add("hidden");
    $("shortUrlGroup").classList.add("hidden");
  }

  function resetResults() {
    state.cleanUrl = "";
    state.removedParams = [];
    state.keptParamCount = 0;
    state.shortUrl = "";
    $("resultContainer").classList.add("hidden");
    $("historyMessage").classList.add("hidden");
    $("shareButton").classList.add("hidden");
    $("shortUrlOutput").value = "";
    $("cleanUrlOutput").value = "";
    $("markdownOutput").value = "";
    $("htmlOutput").value = "";
    $("urlAnalysis").replaceChildren();
    $("statsLink").href = "#";
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
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) {
      throw new Error("copy failed");
    }
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
          $("copyMessage").textContent = t("urlShortener.copyFailed");
        }
      });
    });
  }

  async function shareResult() {
    if (!state.cleanUrl) {
      setStatus(t("urlShortener.shareMissing"), true);
      return;
    }

    const shareUrl = buildShareUrl().toString();
    const shareTarget = state.shortUrl || state.cleanUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("urlShortener.pageTitle"),
          text: shareTarget,
          url: shareUrl,
        });
        setStatus(t("urlShortener.shareReady"), false);
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyText(shareUrl);
      setStatus(t("urlShortener.shareUnavailable"), false);
    } catch (_) {
      setStatus(t("urlShortener.copyFailed"), true);
    }
  }

  function restoreFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const rawUrl = params.get("url");
    if (!rawUrl || !isValidHttpUrl(rawUrl)) {
      return;
    }

    $("longUrlInput").value = rawUrl;
    if ($("removeTracking") && params.has("removeTracking")) {
      $("removeTracking").checked = params.get("removeTracking") !== "0";
    }
    if ($("sortParams") && params.has("sortParams")) {
      $("sortParams").checked = params.get("sortParams") !== "0";
    }
    if ($("enableStats") && params.has("enableStats")) {
      $("enableStats").checked = params.get("enableStats") === "1";
    }

    const clean = buildCleanUrl(rawUrl);
    state.originalUrl = rawUrl;
    state.cleanUrl = clean.url;
    state.removedParams = clean.removedParams;
    state.keptParamCount = clean.keptParamCount;
    renderLocalResults(rawUrl, clean.url, clean.removedParams, clean.keptParamCount);
    $("resultContainer").classList.remove("hidden");
    syncHistory();
    setStatus(t("urlShortener.restoreMessage"), false);
  }

  async function handleSubmit() {
    clearMessages();
    const rawUrl = readUrlInput();
    if (!rawUrl || !isValidHttpUrl(rawUrl) || (window.SecurityUtils && !window.SecurityUtils.validateUrl(rawUrl))) {
      resetResults();
      setStatus(t("urlShortener.error.invalidUrl"), true);
      return;
    }

    const clean = buildCleanUrl(rawUrl);
    state.originalUrl = rawUrl;
    state.cleanUrl = clean.url;
    state.removedParams = clean.removedParams;
    state.keptParamCount = clean.keptParamCount;
    state.shortUrl = "";

    renderLocalResults(rawUrl, clean.url, clean.removedParams, clean.keptParamCount);
    $("resultContainer").classList.remove("hidden");
    syncHistory();
    setStatus(t("urlShortener.shorteningMessage"), false);
    $("shortenButton").disabled = true;

    try {
      const withStats = $("enableStats") ? $("enableStats").checked : false;
      const shortUrl = await createShortUrl(clean.url, withStats);
      state.shortUrl = shortUrl;
      $("shortUrlOutput").value = shortUrl;
      $("shortUrlGroup").classList.remove("hidden");
      if (withStats) {
        $("statsLink").href = `https://is.gd/stats.php?url=${shortUrl.replace(/^https?:\/\//, "")}`;
        $("statsLink").rel = "noopener noreferrer";
        $("statsInfoMessage").textContent = t("urlShortener.statsInfo");
        $("statsLinkContainer").classList.remove("hidden");
      } else {
        $("statsNotEnabledMessage").textContent = t("urlShortener.statsNotEnabled");
        $("statsNotEnabledMessage").classList.remove("hidden");
      }
    } catch (_) {
      setStatus(t("urlShortener.error.apiError"), true);
    } finally {
      if (!$("errorMessage").textContent) {
        setStatus("", false);
      }
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
    $("shareButton").textContent = t("urlShortener.shareButton");
    if (!$("historyMessage").classList.contains("hidden")) {
      $("historyMessage").textContent = t("urlShortener.historyHint");
    }
  }

  function init() {
    if (!$("shortenButton")) return;
    $("shortenButton").addEventListener("click", handleSubmit);
    $("shareButton").addEventListener("click", shareResult);
    $("longUrlInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    });
    bindCopyButtons();
    restoreFromQuery();
    window.addEventListener("languageChanged", refreshLanguageSensitiveOutput);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
