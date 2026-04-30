/**
 * Responsive AdSense slot normalizer.
 *
 * This file only keeps the correct device slot in the DOM and exposes a
 * small API used by ads-consent-loader.js. It must not silence console output
 * or push AdSense; consent-gated loading is handled by ads-consent-loader.js.
 */
(function () {
  "use strict";

  const AD_CLIENT = "ca-pub-1835873052239386";
  const AD_SLOTS = {
    mobile: {
      top: "6430083800",
      middle: "3205934910",
      bottom: "8916646342"
    },
    pc: {
      top: "4837564489",
      middle: "9898319477",
      bottom: "7843001775"
    }
  };

  const POSITION_BY_SLOT = Object.keys(AD_SLOTS).reduce((result, device) => {
    Object.keys(AD_SLOTS[device]).forEach((position) => {
      result[AD_SLOTS[device][position]] = position;
    });
    return result;
  }, {});

  const DEBUG = window.NEGI_AD_DEBUG === true || /[?&]debugAds=1\b/.test(location.search);

  function log() {
    if (DEBUG && window.console) console.debug.apply(console, arguments);
  }

  function isMobileDevice() {
    const userAgent = navigator.userAgent || "";
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width || 1024;
    return width <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

  function slotPosition(element) {
    const explicit = element.getAttribute("data-ad-position");
    if (explicit && AD_SLOTS.pc[explicit]) return explicit;
    const slot = element.getAttribute("data-ad-slot");
    return POSITION_BY_SLOT[slot] || "middle";
  }

  function normalizeElement(element, device) {
    const isMobile = device === "mobile";
    const activeClass = isMobile ? "ad-sp" : "ad-pc";
    const inactiveClass = isMobile ? "ad-pc" : "ad-sp";
    const position = slotPosition(element);

    element.classList.add(activeClass);
    element.classList.remove(inactiveClass);
    element.setAttribute("data-device-type", device);
    element.setAttribute("data-ad-position", position);
    element.setAttribute("data-ad-client", AD_CLIENT);
    element.setAttribute("data-ad-slot", AD_SLOTS[device][position] || AD_SLOTS[device].middle);
    element.style.display = "block";
    return element;
  }

  function ensureCounterpartBeforeRemoval(element, device) {
    const parent = element.parentElement;
    if (!parent || !element.matches("ins.adsbygoogle")) return;
    const activeClass = device === "mobile" ? "ad-sp" : "ad-pc";
    if (parent.querySelector(`ins.adsbygoogle.${activeClass}`)) return;

    const clone = element.cloneNode(false);
    normalizeElement(clone, device);
    parent.insertBefore(clone, element.nextSibling);
  }

  function setupResponsiveAds() {
    const device = isMobileDevice() ? "mobile" : "pc";
    const activeClass = device === "mobile" ? "ad-sp" : "ad-pc";
    const inactiveClass = device === "mobile" ? "ad-pc" : "ad-sp";

    document.querySelectorAll(`ins.adsbygoogle.${inactiveClass}`).forEach((element) => {
      ensureCounterpartBeforeRemoval(element, device);
      element.remove();
    });

    document.querySelectorAll(`ins.adsbygoogle.${activeClass}`).forEach((element) => {
      normalizeElement(element, device);
    });

    if (document.body) {
      document.body.setAttribute("data-device-type", device);
      document.body.setAttribute("data-screen-width", String(window.innerWidth || 0));
    }
    log("[ResponsiveAds] normalized", device);
  }

  function createAdElement(position, lazy) {
    const device = isMobileDevice() ? "mobile" : "pc";
    const normalizedPosition = AD_SLOTS[device][position] ? position : "middle";
    const ins = document.createElement("ins");
    ins.className = `adsbygoogle ${device === "mobile" ? "ad-sp" : "ad-pc"}`;
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", AD_CLIENT);
    ins.setAttribute("data-ad-slot", AD_SLOTS[device][normalizedPosition]);
    ins.setAttribute("data-ad-position", normalizedPosition);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    ins.setAttribute("data-device-type", device);
    if (lazy !== false) ins.setAttribute("data-ad-lazy", "1");
    return ins;
  }

  function fixDuplicateAds() {
    document.querySelectorAll(".ad-block, aside").forEach((block) => {
      const ads = Array.from(block.querySelectorAll("ins.adsbygoogle"));
      if (ads.length <= 1) return;
      const device = isMobileDevice() ? "mobile" : "pc";
      const activeClass = device === "mobile" ? "ad-sp" : "ad-pc";
      let kept = false;
      ads.forEach((ad) => {
        if (!kept && ad.classList.contains(activeClass)) {
          kept = true;
          normalizeElement(ad, device);
        } else {
          ad.remove();
        }
      });
    });
  }

  function handleResize() {
    clearTimeout(window.responsiveAdsTimeout);
    window.responsiveAdsTimeout = setTimeout(() => {
      setupResponsiveAds();
      fixDuplicateAds();
    }, 250);
  }

  function init() {
    setupResponsiveAds();
    fixDuplicateAds();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.ResponsiveAds = {
    createAdElement,
    isMobileDevice,
    fixDuplicateAds,
    setupResponsiveAds,
    AD_SLOTS,
    AD_CLIENT
  };
})();
