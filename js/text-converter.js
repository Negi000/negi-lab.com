// Text converter UI controller.
(function () {
  "use strict";

  const HISTORY_KEY = "textConverterHistory";
  const HISTORY_LIMIT = 8;
  const STATUS_CLASS = {
    info: ["text-gray-600"],
    success: ["text-emerald-700"],
    warning: ["text-amber-700"],
    error: ["text-red-700"],
  };
  const STATUS_CLASS_LIST = ["text-gray-600", "text-emerald-700", "text-amber-700", "text-red-700"];
  const fallbackMessages = {
    ja: {
      ready: "入力すると自動で変換結果を更新します。",
      emptyInput: "入力テキストが空です。変換したいテキストを入力してください。",
      emptyOutput: "コピーする結果がありません。",
      copyFailed: "コピーに失敗しました。手動で選択してコピーしてください。",
      copied: "コピー完了",
      converted: "変換結果を更新しました。",
      cleared: "入力欄、結果、変換履歴を除く表示をリセットしました。",
      restored: "履歴から内容を復元しました。",
      historyCleared: "変換履歴を削除しました。",
      copy: "コピー",
      chars: "文字数",
      graphemes: "表示上の文字数",
      lines: "行数",
      words: "単語数",
      bytes: "UTF-8バイト数",
      historyEmpty: "まだ履歴はありません。変換実行した内容がここに表示されます。",
      historyRestore: "復元",
      historyDelete: "削除",
    },
    en: {
      ready: "Results update automatically while you type.",
      emptyInput: "Enter text before converting.",
      emptyOutput: "There is no result to copy.",
      copyFailed: "Copy failed. Select the result and copy it manually.",
      copied: "Copied",
      converted: "Conversion complete.",
      cleared: "Cleared the current input and result.",
      restored: "Restored this item from history.",
      historyCleared: "Cleared conversion history.",
      copy: "Copy",
      chars: "Characters",
      graphemes: "Displayed characters",
      lines: "Lines",
      words: "Words",
      bytes: "UTF-8 bytes",
      historyEmpty: "No history yet. Converted items will appear here.",
      historyRestore: "Restore",
      historyDelete: "Delete",
    },
  };

  const messageKeys = {
    ready: "textConverter.status.ready",
    emptyInput: "textConverter.message.emptyInput",
    emptyOutput: "textConverter.message.emptyOutput",
    copyFailed: "textConverter.message.copyFailed",
    copied: "textConverter.message.copied",
    converted: "textConverter.status.converted",
    cleared: "textConverter.status.cleared",
    restored: "textConverter.status.restored",
    historyCleared: "textConverter.status.historyCleared",
    copy: "textConverter.button.copy",
    chars: "textConverter.stats.chars",
    graphemes: "textConverter.stats.graphemes",
    lines: "textConverter.stats.lines",
    words: "textConverter.stats.words",
    bytes: "textConverter.stats.bytes",
    historyEmpty: "textConverter.history.empty",
    historyRestore: "textConverter.history.restore",
    historyDelete: "textConverter.history.delete",
  };

  let currentType = "upper";
  let copyFeedbackTimer = null;
  let showingCopyFeedback = false;
  let lastStatusKey = "ready";
  let lastStatusTone = "info";
  let lastGuideTrigger = null;

  function getLang() {
    if (window.NegiI18n?.getLanguage) return window.NegiI18n.getLanguage();
    if (typeof window.getLanguage === "function") return window.getLanguage();
    try {
      return localStorage.getItem("selectedLanguage") || localStorage.getItem("negi-lab-language") || "ja";
    } catch (_) {
      return "ja";
    }
  }

  function msg(key) {
    const lang = getLang();
    const fallback = (fallbackMessages[lang] || fallbackMessages.ja)[key] || fallbackMessages.ja[key] || key;
    if (window.NegiI18n?.translate && messageKeys[key]) {
      return window.NegiI18n.translate(messageKeys[key], fallback);
    }
    return fallback;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatusText(text, tone) {
    const status = byId("converterStatus");
    if (!status) return;
    status.classList.remove(...STATUS_CLASS_LIST);
    status.classList.add(...(STATUS_CLASS[tone] || STATUS_CLASS.info));
    status.textContent = text;
  }

  function announce(key, tone) {
    lastStatusKey = key;
    lastStatusTone = tone || "info";
    setStatusText(msg(key), lastStatusTone);
  }

  function graphemes(text) {
    if (window.Intl?.Segmenter) {
      const segmenter = new Intl.Segmenter(getLang(), { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (part) => part.segment);
    }
    return Array.from(text);
  }

  function words(text) {
    const normalized = text.normalize("NFKC");
    const matches = normalized.match(/[\p{L}\p{N}]+/gu);
    return matches || [];
  }

  function titleCase(text) {
    return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
      const chars = graphemes(word);
      if (!chars.length) return word;
      return chars[0].toLocaleUpperCase(getLang()) + chars.slice(1).join("").toLocaleLowerCase(getLang());
    });
  }

  function camelCase(text) {
    return words(text)
      .map((word, index) => {
        const lower = word.toLocaleLowerCase(getLang());
        if (index === 0) return lower;
        const chars = graphemes(lower);
        return chars[0] ? chars[0].toLocaleUpperCase(getLang()) + chars.slice(1).join("") : "";
      })
      .join("");
  }

  function delimitedCase(text, delimiter) {
    return words(text).map((word) => word.toLocaleLowerCase(getLang())).join(delimiter);
  }

  function countText(text) {
    const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;
    const wordCount = words(text).length;
    const graphemeCount = graphemes(text).length;
    const byteCount = new TextEncoder().encode(text).length;
    return [
      `${msg("chars")}: ${text.length}`,
      `${msg("graphemes")}: ${graphemeCount}`,
      `${msg("lines")}: ${lineCount}`,
      `${msg("words")}: ${wordCount}`,
      `${msg("bytes")}: ${byteCount}`,
    ].join("\n");
  }

  function convert(input) {
    switch (currentType) {
      case "upper":
        return input.toLocaleUpperCase(getLang());
      case "lower":
        return input.toLocaleLowerCase(getLang());
      case "title":
        return titleCase(input);
      case "camel":
        return camelCase(input);
      case "snake":
        return delimitedCase(input, "_");
      case "kebab":
        return delimitedCase(input, "-");
      case "reverse":
        return graphemes(input).reverse().join("");
      case "count":
        return countText(input);
      default:
        return input;
    }
  }

  function statsText(text) {
    return `${msg("chars")}: ${text.length} / ${msg("graphemes")}: ${graphemes(text).length}`;
  }

  function updateInputStats() {
    const inputStats = byId("inputStats");
    const input = byId("inputText");
    if (inputStats && input) inputStats.textContent = statsText(input.value);
  }

  function updateCopyAvailability(text) {
    const copyButton = byId("copyBtn");
    if (copyButton) copyButton.disabled = !text;
  }

  function updateOutputCharCount(text) {
    const charCount = byId("charCount");
    if (charCount) charCount.textContent = statsText(text);
    updateCopyAvailability(text);
  }

  function clearOutput() {
    const output = byId("outputText");
    if (output) output.value = "";
    updateOutputCharCount("");
  }

  function convertText(options = {}) {
    const inputElement = byId("inputText");
    const output = byId("outputText");
    if (!inputElement || !output) return;

    const input = inputElement.value;
    const shouldAnnounce = options.announceOnSuccess === true;
    const shouldSaveHistory = options.saveHistory === true;

    if (!input.trim()) {
      clearOutput();
      setCopyLabel("copy");
      if (options.onEmpty === "warn") {
        announce("emptyInput", "warning");
        inputElement.focus();
      } else {
        announce("ready", "info");
      }
      return;
    }

    const result = convert(input);
    output.value = result;
    updateOutputCharCount(result);

    if (shouldSaveHistory) saveHistoryItem({ type: currentType, input, output: result });
    if (shouldAnnounce) announce("converted", "success");
  }

  function selectConversionType(type) {
    currentType = type;
    document.querySelectorAll(".conversion-btn").forEach((button) => {
      const isActive = button.dataset.type === type;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    convertText({ announceOnSuccess: false, saveHistory: false });
  }

  function clearAll() {
    const input = byId("inputText");
    if (input) input.value = "";
    clearOutput();
    updateInputStats();
    setCopyLabel("copy");
    announce("cleared", "info");
    input?.focus();
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (!document.execCommand("copy")) throw new Error("copy_failed");
    } finally {
      textarea.remove();
    }
  }

  async function copyResult() {
    const output = byId("outputText");
    const text = output ? output.value : "";
    if (!text) {
      announce("emptyOutput", "warning");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
      showCopyFeedback();
      announce("copied", "success");
    } catch (_) {
      try {
        fallbackCopy(text);
        showCopyFeedback();
        announce("copied", "success");
      } catch (error) {
        announce("copyFailed", "error");
      }
    }
  }

  function setCopyLabel(key) {
    const label = byId("copyBtnLabel");
    if (label) label.textContent = msg(key);
  }

  function showCopyFeedback() {
    showingCopyFeedback = true;
    setCopyLabel("copied");
    if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      showingCopyFeedback = false;
      setCopyLabel("copy");
    }, 1500);
  }

  function safeHistoryRead() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function safeHistoryWrite(history) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_) {}
  }

  function getHistory() {
    return safeHistoryRead();
  }

  function saveHistoryItem(entry) {
    const history = getHistory().filter((item) => !(item.type === entry.type && item.input === entry.input && item.output === entry.output));
    history.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: entry.type,
      input: entry.input,
      output: entry.output,
    });
    safeHistoryWrite(history.slice(0, HISTORY_LIMIT));
    renderHistory();
  }

  function removeHistoryItem(id) {
    safeHistoryWrite(getHistory().filter((item) => item.id !== id));
    renderHistory();
  }

  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (_) {
      safeHistoryWrite([]);
    }
    renderHistory();
    announce("historyCleared", "info");
  }

  function getTypeLabel(type) {
    return window.NegiI18n?.translate?.(`textConverter.type.${type}`, type) || type;
  }

  function truncateText(text, limit) {
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > limit ? `${clean.slice(0, limit - 1)}…` : clean;
  }

  function renderHistory() {
    const list = byId("historyList");
    if (!list) return;

    const history = getHistory();
    list.replaceChildren();

    if (!history.length) {
      const item = document.createElement("li");
      item.className = "rounded border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500";
      item.textContent = msg("historyEmpty");
      list.appendChild(item);
      return;
    }

    history.forEach((entry) => {
      const item = document.createElement("li");
      item.className = "flex flex-col gap-3 rounded border border-gray-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between";

      const content = document.createElement("div");
      content.className = "min-w-0";

      const title = document.createElement("p");
      title.className = "text-sm font-semibold text-gray-800";
      title.textContent = getTypeLabel(entry.type);

      const source = document.createElement("p");
      source.className = "mt-1 text-sm text-gray-600 break-words";
      source.textContent = truncateText(entry.input, 80);

      const result = document.createElement("p");
      result.className = "mt-1 text-xs text-gray-500 break-words";
      result.textContent = truncateText(entry.output, 80);

      content.append(title, source, result);

      const actions = document.createElement("div");
      actions.className = "flex gap-2 sm:shrink-0";

      const restore = document.createElement("button");
      restore.type = "button";
      restore.className = "rounded border border-accent px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/10";
      restore.textContent = msg("historyRestore");
      restore.addEventListener("click", () => restoreHistory(entry));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50";
      remove.textContent = msg("historyDelete");
      remove.addEventListener("click", () => removeHistoryItem(entry.id));

      actions.append(restore, remove);
      item.append(content, actions);
      list.appendChild(item);
    });
  }

  function restoreHistory(entry) {
    const input = byId("inputText");
    const output = byId("outputText");
    if (!input || !output) return;

    input.value = entry.input;
    updateInputStats();
    selectConversionType(entry.type);
    output.value = entry.output;
    updateOutputCharCount(entry.output);
    setCopyLabel("copy");
    announce("restored", "success");
    output.focus();
  }

  function showGuide() {
    lastGuideTrigger = document.activeElement;
    byId("guideModal")?.classList.remove("hidden");
    byId("guideClose")?.focus();
  }

  function closeGuide() {
    byId("guideModal")?.classList.add("hidden");
    if (lastGuideTrigger && typeof lastGuideTrigger.focus === "function") lastGuideTrigger.focus();
  }

  function bindEvents() {
    document.querySelectorAll(".conversion-btn").forEach((button) => {
      button.type = "button";
      button.addEventListener("click", () => selectConversionType(button.dataset.type));
    });

    byId("convertBtn")?.addEventListener("click", () => convertText({ announceOnSuccess: true, saveHistory: true, onEmpty: "warn" }));
    byId("clearBtn")?.addEventListener("click", clearAll);
    byId("copyBtn")?.addEventListener("click", copyResult);
    byId("clearHistoryBtn")?.addEventListener("click", clearHistory);
    byId("guide-btn")?.addEventListener("click", showGuide);
    byId("guideClose")?.addEventListener("click", closeGuide);

    byId("inputText")?.addEventListener("input", () => {
      updateInputStats();
      convertText({ announceOnSuccess: false, saveHistory: false });
    });

    byId("guideModal")?.addEventListener("click", (event) => {
      if (event.target === byId("guideModal")) closeGuide();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !byId("guideModal")?.classList.contains("hidden")) closeGuide();
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        convertText({ announceOnSuccess: true, saveHistory: true, onEmpty: "warn" });
      }
    });

    window.addEventListener("languageChanged", () => {
      updateInputStats();
      updateOutputCharCount(byId("outputText")?.value || "");
      setCopyLabel(showingCopyFeedback ? "copied" : "copy");
      renderHistory();
      announce(lastStatusKey, lastStatusTone);
    });
  }

  function init() {
    bindEvents();
    renderHistory();
    selectConversionType(currentType);
    updateInputStats();
    updateOutputCharCount("");
    announce("ready", "info");
  }

  window.showGuide = showGuide;
  window.closeGuide = closeGuide;
  document.addEventListener("DOMContentLoaded", init);
})();
