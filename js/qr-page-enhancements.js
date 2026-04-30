// QR generator page-only interactions that do not belong in the QR engine.
(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function currentLanguage() {
    const selector = byId("lang-switch");
    if (selector?.value) return selector.value.slice(0, 2);
    if (document.documentElement.lang) return document.documentElement.lang.slice(0, 2);
    if (window.NegiI18n?.getLanguage) return window.NegiI18n.getLanguage();
    return (document.documentElement.lang || "ja").slice(0, 2);
  }

  function translate(key, fallback) {
    const lang = currentLanguage();
    const table = window.qrGeneratorTranslations?.[lang] || window.qrGeneratorTranslations?.ja || {};
    if (typeof table[key] === "string") return table[key];
    if (window.NegiI18n?.resolve) return window.NegiI18n.resolve(lang, key) || fallback || key;
    return fallback || key;
  }

  function appendTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function appendGuideSection(parent, titleKey, itemKeys) {
    const section = document.createElement("section");
    section.className = "mb-6";
    appendTextElement(section, "h3", "mb-3 text-lg font-bold text-gray-800", translate(titleKey));
    const list = document.createElement("ul");
    list.className = "ml-6 list-disc space-y-2 text-gray-700";
    itemKeys.forEach((key) => {
      appendTextElement(list, "li", "text-sm leading-relaxed", translate(key));
    });
    section.appendChild(list);
    parent.appendChild(section);
  }

  function renderGuideContent() {
    const guideContent = byId("guide-modal-content");
    if (!guideContent) return;

    const fragment = document.createDocumentFragment();
    const title = appendTextElement(fragment, "h2", "mb-6 pr-8 text-2xl font-bold text-accent", translate("guide.title"));
    title.id = "guide-modal-title";

    appendGuideSection(fragment, "guide.basicTitle", ["guide.basic1", "guide.basic2", "guide.basic3", "guide.basic4"]);
    appendGuideSection(fragment, "guide.batchTitle", ["guide.batch1", "guide.batch2", "guide.batch3", "guide.batch4"]);
    appendGuideSection(fragment, "guide.tipsTitle", ["guide.tip1", "guide.tip2", "guide.tip3", "guide.tip4"]);

    guideContent.replaceChildren(fragment);
  }

  function setupGuideModal() {
    const guideBtn = byId("guide-btn");
    const guideModal = byId("guide-modal");
    const guideClose = byId("guide-close");
    const guideContent = byId("guide-modal-content");
    if (!guideBtn || !guideModal || !guideClose || !guideContent || guideBtn.dataset.qrGuideBound === "1") return;

    guideBtn.dataset.qrGuideBound = "1";

    function openGuide() {
      renderGuideContent();
      guideClose.setAttribute("aria-label", translate("common.close", "Close"));
      guideModal.classList.remove("hidden");
      guideClose.focus();
    }

    function closeGuide() {
      guideModal.classList.add("hidden");
      guideBtn.focus();
    }

    guideBtn.addEventListener("click", openGuide);
    guideClose.addEventListener("click", closeGuide);
    guideModal.addEventListener("click", (event) => {
      if (event.target === guideModal) closeGuide();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !guideModal.classList.contains("hidden")) closeGuide();
    });
  }

  function setupFocusLinks() {
    document.querySelectorAll("[data-qr-focus]").forEach((link) => {
      if (link.dataset.qrFocusBound === "1") return;
      link.dataset.qrFocusBound = "1";
      link.addEventListener("click", (event) => {
        const target = byId(link.getAttribute("data-qr-focus"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus({ preventScroll: true });
      });
    });
  }

  ready(() => {
    setupGuideModal();
    setupFocusLinks();
  });

  const previousLanguageChange = window.onLanguageChange;
  window.onLanguageChange = function onQrLanguageChange(lang) {
    if (typeof previousLanguageChange === "function") previousLanguageChange(lang);
    const guideModal = byId("guide-modal");
    if (guideModal && !guideModal.classList.contains("hidden")) renderGuideContent();
  };

  window.addEventListener("languageChanged", () => {
    const guideModal = byId("guide-modal");
    if (guideModal && !guideModal.classList.contains("hidden")) renderGuideContent();
  });
})();
