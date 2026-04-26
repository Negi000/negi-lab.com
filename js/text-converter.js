// Text converter UI controller.
(function () {
  "use strict";

  const messages = {
    ja: {
      emptyInput: "入力テキストが空です。変換したいテキストを入力してください。",
      emptyOutput: "コピーする結果がありません。",
      copied: "コピー完了",
      copy: "コピー",
      chars: "文字数",
      graphemes: "表示上の文字数",
      lines: "行数",
      words: "単語数",
      bytes: "UTF-8バイト数",
    },
    en: {
      emptyInput: "Enter text before converting.",
      emptyOutput: "There is no result to copy.",
      copied: "Copied",
      copy: "Copy",
      chars: "Characters",
      graphemes: "Graphemes",
      lines: "Lines",
      words: "Words",
      bytes: "UTF-8 bytes",
    },
  };

  let currentType = "upper";

  function getLang() {
    if (typeof window.getLanguage === "function") return window.getLanguage();
    try {
      return localStorage.getItem("selectedLanguage") || localStorage.getItem("negi-lab-language") || "ja";
    } catch (_) {
      return "ja";
    }
  }

  function msg(key) {
    const lang = getLang();
    return (messages[lang] || messages.ja)[key] || messages.ja[key] || key;
  }

  function byId(id) {
    return document.getElementById(id);
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
    if (inputStats) inputStats.textContent = statsText(byId("inputText").value);
  }

  function updateOutputCharCount(text) {
    const charCount = byId("charCount");
    if (charCount) charCount.textContent = statsText(text);
  }

  function convertText(options = {}) {
    const input = byId("inputText").value;
    const output = byId("outputText");
    const showEmptyAlert = options.showEmptyAlert !== false;

    if (!input.trim()) {
      output.value = "";
      updateOutputCharCount("");
      if (showEmptyAlert) alert(msg("emptyInput"));
      return;
    }

    const result = convert(input);
    output.value = result;
    updateOutputCharCount(result);
  }

  function selectConversionType(type) {
    currentType = type;
    document.querySelectorAll(".conversion-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.type === type);
      button.setAttribute("aria-pressed", String(button.dataset.type === type));
    });
    convertText({ showEmptyAlert: false });
  }

  function clearAll() {
    byId("inputText").value = "";
    byId("outputText").value = "";
    updateInputStats();
    updateOutputCharCount("");
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  async function copyResult() {
    const text = byId("outputText").value;
    if (!text) {
      alert(msg("emptyOutput"));
      return;
    }

    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
      showCopyFeedback();
    } catch (_) {
      fallbackCopy(text);
      showCopyFeedback();
    }
  }

  function showCopyFeedback() {
    const copyBtn = byId("copyBtn");
    const original = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' + msg("copied");
    setTimeout(() => {
      copyBtn.innerHTML = original || msg("copy");
    }, 1500);
  }

  function showGuide() {
    byId("guideModal").classList.remove("hidden");
  }

  function closeGuide() {
    byId("guideModal").classList.add("hidden");
  }

  function bindEvents() {
    document.querySelectorAll(".conversion-btn").forEach((button) => {
      button.type = "button";
      button.addEventListener("click", () => selectConversionType(button.dataset.type));
    });

    byId("convertBtn").addEventListener("click", () => convertText());
    byId("clearBtn").addEventListener("click", clearAll);
    byId("copyBtn").addEventListener("click", copyResult);
    byId("guide-btn")?.addEventListener("click", showGuide);
    byId("guideClose")?.addEventListener("click", closeGuide);

    byId("inputText").addEventListener("input", () => {
      updateInputStats();
      convertText({ showEmptyAlert: false });
    });

    byId("guideModal").addEventListener("click", (event) => {
      if (event.target === byId("guideModal")) closeGuide();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !byId("guideModal").classList.contains("hidden")) closeGuide();
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") convertText();
    });

    document.addEventListener("languageChanged", () => {
      updateInputStats();
      updateOutputCharCount(byId("outputText").value);
    });
  }

  function init() {
    bindEvents();
    selectConversionType(currentType);
    updateInputStats();
    updateOutputCharCount("");
  }

  window.showGuide = showGuide;
  window.closeGuide = closeGuide;
  document.addEventListener("DOMContentLoaded", init);
})();
