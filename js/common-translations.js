/**
 * Shared translations used by common headers, footers, and utility UI.
 */

(function () {
  "use strict";

  window.commonTranslations = {
    ja: {
      "nav.tools": "Tools",
      "nav.wikis": "Game Wikis",
      "nav.home": "Home",
      "langSwitch.label": "Language",
      "langSwitch.ja": "Japanese",
      "langSwitch.en": "English",
      "common.download": "Download",
      "common.reset": "Reset",
      "common.convert": "Convert",
      "common.upload": "Upload",
      "common.copy": "Copy",
      "common.clear": "Clear",
      "common.save": "Save",
      "common.load": "Load",
      "common.apply": "Apply",
      "common.cancel": "Cancel",
      "common.success": "Success",
      "common.error": "An error occurred",
      "common.loading": "Loading...",
      "common.processing": "Processing...",
      "common.complete": "Complete",
      "common.noFileSelected": "No file selected",
      "common.invalidFile": "Invalid file",
      "common.fileTooLarge": "File size is too large",
      "footer.copyright": "© 2026 negi-lab.com",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms",
      "footer.about": "About",
      "disclaimer.title": "Site Policy and Disclaimer",
      "disclaimer.responsibility": "negi-lab.com maintains these browser-based tools with practical, transparent operation in mind.",
      "disclaimer.revenue": "Advertising and affiliate links may be used, while keeping utility and readability first.",
      "disclaimer.liability": "Please review important outputs yourself before relying on them for critical use.",
      "disclaimer.copyright": "© 2026 negi-lab.com",
      "modal.close": "Close",
      "guide.modalTitle": "Guide",
      "breadcrumb.home": "Home",
      "breadcrumb.tools": "Tools",
      "common.contact": "Contact",
      "common.sitemap": "Sitemap",
      "common.privacyPolicy": "Privacy Policy",
      "common.terms": "Terms",
      "common.about": "About",
    },
    en: {
      "nav.tools": "Tools",
      "nav.wikis": "Game Wikis",
      "nav.home": "Home",
      "langSwitch.label": "Language",
      "langSwitch.ja": "Japanese",
      "langSwitch.en": "English",
      "common.download": "Download",
      "common.reset": "Reset",
      "common.convert": "Convert",
      "common.upload": "Upload",
      "common.copy": "Copy",
      "common.clear": "Clear",
      "common.save": "Save",
      "common.load": "Load",
      "common.apply": "Apply",
      "common.cancel": "Cancel",
      "common.success": "Success",
      "common.error": "An error occurred",
      "common.loading": "Loading...",
      "common.processing": "Processing...",
      "common.complete": "Complete",
      "common.noFileSelected": "No file selected",
      "common.invalidFile": "Invalid file",
      "common.fileTooLarge": "File size is too large",
      "footer.copyright": "© 2026 negi-lab.com",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms",
      "footer.about": "About",
      "disclaimer.title": "Site Policy and Disclaimer",
      "disclaimer.responsibility": "negi-lab.com maintains these browser-based tools with practical, transparent operation in mind.",
      "disclaimer.revenue": "Advertising and affiliate links may be used, while keeping utility and readability first.",
      "disclaimer.liability": "Please review important outputs yourself before relying on them for critical use.",
      "disclaimer.copyright": "© 2026 negi-lab.com",
      "modal.close": "Close",
      "guide.modalTitle": "Guide",
      "breadcrumb.home": "Home",
      "breadcrumb.tools": "Tools",
      "common.contact": "Contact",
      "common.sitemap": "Sitemap",
      "common.privacyPolicy": "Privacy Policy",
      "common.terms": "Terms",
      "common.about": "About",
    },
  };

  class CommonTranslationSystem {
    constructor() {
      this.currentLanguage = this.resolveInitialLanguage();
      this.translations = window.commonTranslations;
      this.init();
    }

    resolveInitialLanguage() {
      try {
        const savedLang = localStorage.getItem("negi-lab-language") || localStorage.getItem("selectedLanguage");
        if (savedLang && window.commonTranslations[savedLang]) return savedLang;
      } catch (_) {}
      return "ja";
    }

    init() {
      this.setupLanguageSwitcher();
      this.translatePage();
    }

    setupLanguageSwitcher() {
      document.querySelectorAll("[data-lang]").forEach((button) => {
        button.addEventListener("click", (event) => {
          this.setLanguage(event.currentTarget.getAttribute("data-lang"));
        });
      });

      const langSelect = document.getElementById("langSelect");
      if (langSelect) {
        langSelect.value = this.currentLanguage;
        langSelect.addEventListener("change", (event) => {
          this.setLanguage(event.currentTarget.value);
        });
      }
    }

    setLanguage(lang) {
      if (!this.translations[lang]) {
        console.warn(`Language "${lang}" is not supported.`);
        return;
      }

      this.currentLanguage = lang;
      try {
        localStorage.setItem("negi-lab-language", lang);
        localStorage.setItem("selectedLanguage", lang);
      } catch (_) {}

      document.documentElement.lang = lang;
      this.translatePage();
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
    }

    translatePage() {
      document.querySelectorAll("[data-translate-key]").forEach((element) => {
        const translation = this.getTranslation(element.getAttribute("data-translate-key"));
        if (!translation) return;

        const tag = element.tagName.toLowerCase();
        if (tag === "input" && /^(button|submit|reset)$/.test(element.type || "")) {
          element.value = translation;
        } else if (element.hasAttribute("placeholder")) {
          element.setAttribute("placeholder", translation);
        } else if (element.hasAttribute("title")) {
          element.setAttribute("title", translation);
        } else {
          element.textContent = translation;
        }
      });

      this.updateLanguageButtons();
    }

    updateLanguageButtons() {
      document.querySelectorAll("[data-lang]").forEach((button) => {
        button.classList.toggle("active", button.getAttribute("data-lang") === this.currentLanguage);
      });

      const langSelect = document.getElementById("langSelect");
      if (langSelect) langSelect.value = this.currentLanguage;
    }

    getTranslation(key) {
      if (!key) return null;
      const table = this.translations[this.currentLanguage] || this.translations.ja;
      return table[key] || null;
    }

    getCurrentLanguage() {
      return this.currentLanguage;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.commonTranslationSystem = new CommonTranslationSystem();
  });
})();
