/**
 * Portal language switching and light interactions.
 */
(function () {
  "use strict";

  const STORAGE_KEYS = ["selectedLanguage", "negi-lab-language", "preferredLanguage", "language"];
  const SUPPORTED = { ja: true, en: true };

  function normalizeLanguage(lang) {
    lang = String(lang || "").toLowerCase().slice(0, 2);
    return SUPPORTED[lang] ? lang : "ja";
  }

  function getLanguage() {
    try {
      const urlLang = new URLSearchParams(location.search).get("lang");
      if (urlLang && SUPPORTED[normalizeLanguage(urlLang)]) return normalizeLanguage(urlLang);
    } catch (_) {}
    for (const key of STORAGE_KEYS) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) return normalizeLanguage(saved);
      } catch (_) {}
    }
    return normalizeLanguage(document.documentElement.lang || navigator.language || "ja");
  }

  function persistLanguage(lang) {
    lang = normalizeLanguage(lang);
    for (const key of STORAGE_KEYS) {
      try { localStorage.setItem(key, lang); } catch (_) {}
    }
    document.documentElement.lang = lang;
    return lang;
  }

  function applyValue(element, value, mode) {
    if (!element || typeof value !== "string") return;
    const tag = element.tagName ? element.tagName.toLowerCase() : "";
    if (mode === "html") element.innerHTML = value;
    else if (mode === "placeholder") element.setAttribute("placeholder", value);
    else if (tag === "title") {
      element.textContent = value;
      document.title = value;
    } else if (tag === "meta") element.setAttribute("content", value);
    else element.textContent = value;
  }

  function translate(lang, key) {
    const table = window.translations && window.translations[lang];
    const fallback = window.translations && window.translations.ja;
    return (table && table[key]) || (fallback && fallback[key]);
  }

  function applyTranslations(lang) {
    lang = persistLanguage(lang);

    document.querySelectorAll("[data-translate-key]").forEach((element) => {
      applyValue(element, translate(lang, element.getAttribute("data-translate-key")));
    });
    document.querySelectorAll("[data-translate-html-key]").forEach((element) => {
      applyValue(element, translate(lang, element.getAttribute("data-translate-html-key")), "html");
    });
    document.querySelectorAll("[data-translate-placeholder-key]").forEach((element) => {
      applyValue(element, translate(lang, element.getAttribute("data-translate-placeholder-key")), "placeholder");
    });

    applyValue(document.querySelector("meta[name='description']"), translate(lang, window.metaDescriptionTranslationKey || "meta.description"));
    const title = translate(lang, window.pageTitleTranslationKey || "page.title");
    if (title) document.title = title;

    const guideClose = document.getElementById("guide-close");
    const guideCloseLabel = translate(lang, "guideModal.closeButton");
    if (guideClose && guideCloseLabel) guideClose.setAttribute("aria-label", guideCloseLabel);

    const selector = document.getElementById("lang-switch");
    if (selector && selector.value !== lang) selector.value = lang;
  }

  function initLanguageSwitch() {
    const selector = document.getElementById("lang-switch");
    const lang = getLanguage();
    if (selector) {
      selector.value = lang;
      if (selector.getAttribute("data-portal-i18n-bound") !== "1") {
        selector.setAttribute("data-portal-i18n-bound", "1");
        selector.addEventListener("change", () => {
          const nextLang = persistLanguage(selector.value);
          applyTranslations(nextLang);
          window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: nextLang } }));
          const guideModal = document.getElementById("guide-modal");
          if (guideModal && !guideModal.classList.contains("hidden") && window.renderGuide) {
            window.renderGuide(nextLang);
          }
        });
      }
    }
    applyTranslations(lang);
  }

  function initWikiCards() {
    document.querySelectorAll(".wiki-card").forEach((card) => {
      if (card.getAttribute("data-wiki-bound") === "1") return;
      card.setAttribute("data-wiki-bound", "1");
      const navigate = (event) => {
        if (event && event.target && event.target.closest("a")) return;
        const url = card.getAttribute("data-wiki-url");
        if (url) window.location.href = `wiki-redirect.html?url=${encodeURIComponent(url)}`;
      };
      card.addEventListener("click", navigate);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(event);
        }
      });
    });
  }

  window.applyTranslations = applyTranslations;
  window.initLanguageSwitch = initLanguageSwitch;

  document.addEventListener("DOMContentLoaded", () => {
    initLanguageSwitch();
    initWikiCards();
  });
})();
