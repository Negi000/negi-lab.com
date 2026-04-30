// Backward-compatible alias for older QR generator translation key.
(function () {
  "use strict";

  const fallback = { ja: {}, en: {} };
  window.qrCodeGeneratorTranslations = window.qrGeneratorTranslations || fallback;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = window.qrCodeGeneratorTranslations;
  }
})();
