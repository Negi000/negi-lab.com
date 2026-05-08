(function () {
  "use strict";

  const CONSENT_STORAGE_KEY = "cookieConsent";
  const GOOGLE_ADS_SESSION_OFF_KEY = "negiGoogleAdsSessionOff";
  const AD_CLIENT = "ca-pub-1835873052239386";
  const GA_ID = "G-N9X3N0RY0H";
  const ADSENSE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + AD_CLIENT;
  const RAKUTEN_AFFILIATE_ID = "4c2fb9c2.c3e2b140.4c2fb9c3.cbd16d01";
  const RAKUTEN_TS = "1757509067733";

  const CONFIG = {
    gaIdleDelayMs: 4000,
    lazyRootMargin: "180px 0px 220px 0px",
    adFillTimeoutMs: 8000,
    baseDesktopCap: 2,
    baseMobileCap: 1,
    maxDesktopCap: 4,
    maxMobileCap: 2,
    textLengthPerExtraSlot: 2500,
    dynamicMinTextLength: 2500,
    dynamicDelayMs: 12000,
    dynamicScrollDepth: 0.5,
    dynamicMaxSlots: 1,
    overlayWatchdogIntervalMs: 500,
    overlayWatchdogWindowMs: 20000,
    overlayHiddenGraceMs: 2500
  };

  const host = location.hostname || "";
  const ENV_OK = /(^|\.)negi-lab\.com$/i.test(host)
    || /(^|\.)gamewiki\.jp$/i.test(host)
    || /^(localhost|127\.0\.0\.1)$/.test(host);
  const DEBUG = /[?&]debugAds=1\b/.test(location.search) || safeGet("adsDebug") === "1";

  let consentAccepted = hasConsent();
  let currentAdPushCount = 0;
  let lazyObserver = null;
  let runtimeStarted = false;
  let noVignetteObserver = null;
  let overlayWatchdogStarted = false;

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (_) {}
  }

  function log() {
    if (DEBUG && window.console) console.debug.apply(console, arguments);
  }

  function hasConsent() {
    return safeGet(CONSENT_STORAGE_KEY) === "accepted";
  }

  function syncConsentState() {
    document.documentElement.setAttribute("data-ads-consent", consentAccepted ? "accepted" : "pending");
  }

  function dispatchConsentAccepted() {
    try {
      document.dispatchEvent(new Event("cookieConsentAccepted"));
    } catch (_) {
      const event = document.createEvent("Event");
      event.initEvent("cookieConsentAccepted", true, true);
      document.dispatchEvent(event);
    }
  }

  function getAdShell(node) {
    return node.closest("aside, .ad-block, .dynamic-ad-container") || node.parentElement;
  }

  function setPendingAdShells(pending) {
    document.querySelectorAll("ins.adsbygoogle, .rakuten-widget-placeholder").forEach((node) => {
      const shell = getAdShell(node);
      if (!shell || shell === document.body || shell === document.documentElement) return;
      if (pending) {
        shell.setAttribute("data-ads-pending-hidden", "1");
        shell.hidden = true;
      } else if (shell.getAttribute("data-ads-pending-hidden") === "1") {
        shell.hidden = false;
        shell.removeAttribute("data-ads-pending-hidden");
      }
    });
  }

  function ensureBaseAdCSS() {
    if (document.getElementById("negi-ad-runtime-css")) return;
    const style = document.createElement("style");
    style.id = "negi-ad-runtime-css";
    style.textContent = [
      "html[data-ads-consent='pending'] ins.adsbygoogle{display:none!important;min-height:0!important;height:0!important;}",
      "[data-ads-pending-hidden='1']{display:none!important;}",
      "[data-ad-empty='true']{display:none!important;visibility:hidden!important;height:0!important;margin:0!important;padding:0!important;border:0!important;}",
      "[data-ad-empty='fallback']{display:block!important;visibility:visible!important;}",
      ".negi-ad-fallback{display:flex;min-height:160px;align-items:center;justify-content:center;border:1px solid rgba(148,163,184,.45);background:rgba(248,250,252,.9);}",
      ".negi-ad-fallback-label{margin-bottom:.25rem;font-size:.75rem;color:#94a3b8;}",
      ".dynamic-ad-container{overflow:hidden;}",
      ".dynamic-ad-container ins.adsbygoogle{min-height:180px;}"
    ].join("");
    document.head.appendChild(style);
  }

  function loadScriptOnce(key, src, attrs) {
    if (window[key]) return window[key];
    window[key] = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src^="${src.split("?")[0]}"]`);
      if (existing) {
        if (attrs) {
          Object.keys(attrs).forEach((name) => existing.setAttribute(name, attrs[name]));
        }
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (existing.dataset.loaded === "1") resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      if (attrs) {
        Object.keys(attrs).forEach((name) => script.setAttribute(name, attrs[name]));
      }
      script.addEventListener("load", () => {
        script.dataset.loaded = "1";
        resolve();
      }, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
    return window[key];
  }

  const gaQueue = [];

  function track(event, params) {
    if (!consentAccepted) return;
    try {
      if (window.gtag) window.gtag("event", event, params || {});
      else gaQueue.push({ event, params });
    } catch (_) {}
  }

  function initGA() {
    if (!ENV_OK || window.__negiGaLoaded) return;
    window.__negiGaLoaded = true;
    loadScriptOnce("__negiGaScript", "https://www.googletagmanager.com/gtag/js?id=" + GA_ID)
      .then(() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GA_ID, { anonymize_ip: true });
        while (gaQueue.length) {
          const item = gaQueue.shift();
          gtag("event", item.event, item.params || {});
        }
      })
      .catch((error) => {
        if (DEBUG) console.warn("[ads-consent-loader] GA load failed", error);
      });
  }

  function scheduleGALoad() {
    if (window.__negiGaScheduled) return;
    window.__negiGaScheduled = true;
    let fired = false;
    const events = ["scroll", "keydown", "pointerdown", "click", "touchstart", "visibilitychange"];
    const fire = () => {
      if (fired) return;
      fired = true;
      events.forEach((event) => window.removeEventListener(event, fire, true));
      initGA();
    };
    events.forEach((event) => window.addEventListener(event, fire, { passive: true, capture: true }));
    setTimeout(fire, CONFIG.gaIdleDelayMs);
  }

  function isMobile() {
    return window.ResponsiveAds && typeof window.ResponsiveAds.isMobileDevice === "function"
      ? window.ResponsiveAds.isMobileDevice()
      : (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  function pageTextLength() {
    if (typeof window.__pageTextLen === "number") return window.__pageTextLen;
    try {
      window.__pageTextLen = (document.body.innerText || "").length;
    } catch (_) {
      window.__pageTextLen = 0;
    }
    return window.__pageTextLen;
  }

  function computeAdaptiveCap() {
    const mobile = isMobile();
    const base = mobile ? CONFIG.baseMobileCap : CONFIG.baseDesktopCap;
    const max = mobile ? CONFIG.maxMobileCap : CONFIG.maxDesktopCap;
    const extra = Math.max(0, Math.floor((pageTextLength() - CONFIG.dynamicMinTextLength) / CONFIG.textLengthPerExtraSlot));
    return Math.max(1, Math.min(max, base + extra));
  }

  function adCapReached() {
    return currentAdPushCount >= computeAdaptiveCap();
  }

  function isElementNearViewport(element) {
    if (!element || !element.getBoundingClientRect) return false;
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    return rect.top < viewHeight * 1.35 && rect.bottom > -viewHeight * 0.35;
  }

  function markAdShellEmpty(ins) {
    const shell = getAdShell(ins);
    if (shell) shell.setAttribute("data-ad-empty", "true");
  }

  function createRakutenFallback(reason) {
    const fragment = document.createDocumentFragment();

    const label = document.createElement("div");
    label.className = "negi-ad-fallback-label";
    label.textContent = "Sponsored Links";

    const placeholder = document.createElement("div");
    placeholder.className = "rakuten-widget-placeholder negi-ad-fallback";
    placeholder.setAttribute("data-rakuten-widget", "slide");
    placeholder.setAttribute("data-rakuten-affiliate", RAKUTEN_AFFILIATE_ID);
    placeholder.setAttribute("data-rakuten-ts", RAKUTEN_TS);
    placeholder.setAttribute("data-rakuten-size-mobile", "300x250");
    placeholder.setAttribute("data-rakuten-size-desktop", "468x160");
    placeholder.setAttribute("data-google-ad-fallback-reason", reason || "google-disabled");

    fragment.append(label, placeholder);
    return { fragment, placeholder };
  }

  function renderFallbackAdShell(shell, reason) {
    if (!shell || shell === document.body || shell === document.documentElement) return null;
    if (shell.getAttribute("data-google-ad-fallback") === "true") {
      return shell.querySelector(".rakuten-widget-placeholder");
    }

    const fallback = createRakutenFallback(reason);
    shell.hidden = false;
    shell.removeAttribute("data-ads-pending-hidden");
    shell.setAttribute("data-ad-empty", "fallback");
    shell.setAttribute("data-google-ad-fallback", "true");
    shell.replaceChildren(fallback.fragment);
    if (consentAccepted) loadRakutenFor(fallback.placeholder);
    return fallback.placeholder;
  }

  function insertFallbackAd(reason) {
    const main = document.querySelector("main");
    if (!main || document.querySelector("[data-google-ad-fallback='true']")) return null;

    const wrapper = document.createElement("aside");
    wrapper.className = "mx-auto my-8 max-w-3xl px-4 sm:px-6";
    wrapper.setAttribute("aria-label", "Sponsored links");
    wrapper.setAttribute("data-runtime-fallback-ad", "true");

    const fallback = createRakutenFallback(reason);
    wrapper.setAttribute("data-ad-empty", "fallback");
    wrapper.setAttribute("data-google-ad-fallback", "true");
    wrapper.appendChild(fallback.fragment);

    const anchor = main.querySelector("section:nth-of-type(2), article, .tool-shell, .grid") || main.firstElementChild;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
    else main.appendChild(wrapper);

    if (consentAccepted) loadRakutenFor(fallback.placeholder);
    return fallback.placeholder;
  }

  function disableGoogleAdSlots(reason) {
    document.documentElement.setAttribute("data-google-ads-disabled", reason || "1");
    let fallbackCount = 0;
    document.querySelectorAll("ins.adsbygoogle").forEach((ins) => {
      ins.setAttribute("data-ads-pushed", "disabled");
      ins.setAttribute("data-ad-status", "unfilled");
      const shell = getAdShell(ins);
      if (shell) {
        renderFallbackAdShell(shell, reason || "google-disabled");
        fallbackCount += 1;
      } else {
        ins.style.display = "none";
      }
    });
    if (fallbackCount === 0) insertFallbackAd(reason || "google-disabled");
  }

  function mobileGoogleAdsDisabled() {
    return isMobile() && document.documentElement.hasAttribute("data-disable-mobile-google-ads");
  }

  function googleAdsDisabledBySession() {
    return safeSessionGet(GOOGLE_ADS_SESSION_OFF_KEY) === "1";
  }

  function googleAdsDisabledByMeta() {
    return !!document.querySelector('meta[name="ads"][content="off"]');
  }

  function shouldDisableGoogleAds() {
    return googleAdsDisabledByMeta() || googleAdsDisabledBySession() || mobileGoogleAdsDisabled();
  }

  function googleVignetteHashActive() {
    return /(?:^|[#&])google_vignette(?:=|&|$)/i.test(location.hash || "");
  }

  function clearGoogleVignetteHash() {
    if (!googleVignetteHashActive() || !history.replaceState) return;
    const cleanUrl = location.pathname + location.search;
    try { history.replaceState(null, document.title, cleanUrl); } catch (_) {}
  }

  function markNoVignetteLinks(root) {
    const scope = root && root.querySelectorAll ? root : document;
    if (document.documentElement.hasAttribute("data-allow-vignette-ads")) return;
    scope.querySelectorAll("a[href]").forEach((link) => {
      if (!link.hasAttribute("data-google-vignette")) {
        link.setAttribute("data-google-vignette", "false");
      }
    });
  }

  function setupNoVignetteLinks() {
    markNoVignetteLinks(document);
    if (noVignetteObserver || !("MutationObserver" in window)) return;
    const target = document.body || document.documentElement;
    noVignetteObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches("a[href]")) {
            if (!node.hasAttribute("data-google-vignette")) {
              node.setAttribute("data-google-vignette", "false");
            }
          }
          markNoVignetteLinks(node);
        });
      });
    });
    noVignetteObserver.observe(target, { childList: true, subtree: true });
  }

  function startAdOverlayWatchdog() {
    if (overlayWatchdogStarted || !ENV_OK) return;
    overlayWatchdogStarted = true;
    const started = Date.now();
    let hiddenSince = 0;

    const timer = setInterval(() => {
      const now = Date.now();
      const bodyHidden = document.body && document.body.getAttribute("aria-hidden") === "true";
      const vignetteHash = googleVignetteHashActive();

      if (bodyHidden) hiddenSince = hiddenSince || now;
      else hiddenSince = 0;

      const stuckHidden = hiddenSince && now - hiddenSince >= CONFIG.overlayHiddenGraceMs;
      if (vignetteHash || stuckHidden) {
        safeSessionSet(GOOGLE_ADS_SESSION_OFF_KEY, "1");
        document.documentElement.setAttribute("data-google-overlay-recovered", vignetteHash ? "vignette" : "aria-hidden");
        clearGoogleVignetteHash();
        clearInterval(timer);
        setTimeout(() => {
          try { location.reload(); } catch (_) {}
        }, 120);
        return;
      }

      if (now - started > CONFIG.overlayWatchdogWindowMs) clearInterval(timer);
    }, CONFIG.overlayWatchdogIntervalMs);
  }

  function watchAdFill(ins) {
    const shell = getAdShell(ins);
    if (!shell) return;
    shell.setAttribute("data-ad-empty", "pending");
    const markFilled = () => {
      shell.setAttribute("data-ad-empty", "false");
    };
    const getAdState = () => {
      const adStatus = (ins.getAttribute("data-ad-status") || "").toLowerCase();
      if (adStatus === "unfilled" || adStatus.indexOf("unfill") === 0) return "unfilled";
      if (adStatus === "filled") return "filled";

      const iframe = ins.querySelector("iframe");
      if (iframe) {
        const rect = iframe.getBoundingClientRect();
        if (rect.width > 1 && rect.height > 1) return "filled";
      }

      return "pending";
    };
    const observer = new MutationObserver(() => {
      const state = getAdState();
      if (state === "filled") {
        markFilled();
        observer.disconnect();
      } else if (state === "unfilled") {
        renderFallbackAdShell(shell, "adsense-unfilled");
        observer.disconnect();
      }
    });
    observer.observe(ins, { attributes: true, childList: true, subtree: true });
    setTimeout(() => {
      const state = getAdState();
      if (state === "filled") markFilled();
      else if (state === "unfilled") renderFallbackAdShell(shell, "adsense-unfilled");
      else renderFallbackAdShell(shell, "adsense-timeout");
      observer.disconnect();
    }, CONFIG.adFillTimeoutMs);
  }

  function pushAdSlot(ins) {
    if (!ins || ins.getAttribute("data-ads-pushed") === "1") return;
    if (adCapReached()) {
      ins.setAttribute("data-ads-pushed", "cap");
      markAdShellEmpty(ins);
      return;
    }
    if (ins.getAttribute("data-ad-lazy") === "1" && !isElementNearViewport(ins)) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ins.setAttribute("data-ads-pushed", "1");
      currentAdPushCount += 1;
      watchAdFill(ins);
      track("ad_slot_pushed", {
        slot: ins.getAttribute("data-ad-slot") || "auto",
        position_index: currentAdPushCount
      });
    } catch (error) {
      if (DEBUG) console.warn("[ads-consent-loader] AdSense push failed", error);
      const shell = getAdShell(ins);
      if (shell) renderFallbackAdShell(shell, "push-failed");
    }
  }

  function observeLazySlots() {
    const slots = Array.from(document.querySelectorAll("ins.adsbygoogle:not([data-ads-pushed='1']):not([data-ads-pushed='cap'])"));
    if (!slots.length) return;
    if (!("IntersectionObserver" in window)) {
      slots.forEach(pushAdSlot);
      return;
    }
    if (!lazyObserver) {
      lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lazyObserver.unobserve(entry.target);
          pushAdSlot(entry.target);
        });
      }, { root: null, rootMargin: CONFIG.lazyRootMargin, threshold: 0.01 });
    }
    slots.forEach((slot) => {
      if (slot.getAttribute("data-ad-lazy") !== "1" || isElementNearViewport(slot)) pushAdSlot(slot);
      else lazyObserver.observe(slot);
    });
  }

  function startAdSlotObserver() {
    if (window.__negiAdSlotObserverStarted || !("MutationObserver" in window)) return;
    const observer = new MutationObserver((mutations) => {
      let found = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if ((node.matches && node.matches("ins.adsbygoogle")) || (node.querySelector && node.querySelector("ins.adsbygoogle"))) {
            found = true;
          }
        });
      });
      if (found && window.__negiAdsLoaded) observeLazySlots();
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    window.__negiAdSlotObserverStarted = true;
  }

  function initAds() {
    if (!ENV_OK || document.documentElement.hasAttribute("data-ads-disabled")) return;
    setupNoVignetteLinks();
    if (googleVignetteHashActive()) {
      safeSessionSet(GOOGLE_ADS_SESSION_OFF_KEY, "1");
      clearGoogleVignetteHash();
    }
    if (shouldDisableGoogleAds()) {
      disableGoogleAdSlots(googleAdsDisabledBySession() ? "session-overlay-recovery" : "disabled");
      return;
    }

    if (window.ResponsiveAds && typeof window.ResponsiveAds.setupResponsiveAds === "function") {
      window.ResponsiveAds.setupResponsiveAds();
      if (typeof window.ResponsiveAds.fixDuplicateAds === "function") {
        window.ResponsiveAds.fixDuplicateAds();
      }
    }
    setPendingAdShells(false);
    startAdSlotObserver();
    startAdOverlayWatchdog();

    loadScriptOnce("__negiAdsenseScript", ADSENSE_SRC, { crossorigin: "anonymous", "data-overlays": "bottom" })
      .then(() => {
        window.__negiAdsLoaded = true;
        observeLazySlots();
        setTimeout(observeLazySlots, 1200);
        try {
          document.dispatchEvent(new Event("adsReady"));
        } catch (_) {
          const event = document.createEvent("Event");
          event.initEvent("adsReady", true, true);
          document.dispatchEvent(event);
        }
      })
      .catch((error) => {
        if (DEBUG) console.warn("[ads-consent-loader] AdSense load failed", error);
        safeSessionSet(GOOGLE_ADS_SESSION_OFF_KEY, "1");
        disableGoogleAdSlots("load-failed");
      });
  }

  function dynamicAdsDisabled() {
    return document.documentElement.hasAttribute("data-no-dynamic-ads")
      || !!document.querySelector('meta[name="ads-dynamic"][content="off"]')
      || !!document.querySelector(".wiki-hero, .wiki-header, [data-wiki-content='true']");
  }

  function safeDistanceFromAds(anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    return Array.from(document.querySelectorAll("ins.adsbygoogle, .dynamic-ad-container")).every((ad) => {
      const rect = ad.getBoundingClientRect();
      return Math.abs(rect.top - anchorRect.top) >= 800;
    });
  }

  function createDynamicAd() {
    const wrapper = document.createElement("aside");
    wrapper.className = "max-w-3xl mx-auto my-10 dynamic-ad-container";
    wrapper.setAttribute("aria-label", "スポンサー広告");
    wrapper.setAttribute("data-dynamic-ad", "true");

    const label = document.createElement("div");
    label.className = "text-xs text-gray-400 mb-1";
    label.textContent = "スポンサーリンク";
    wrapper.appendChild(label);

    const ad = window.ResponsiveAds && typeof window.ResponsiveAds.createAdElement === "function"
      ? window.ResponsiveAds.createAdElement("middle", true)
      : document.createElement("ins");
    if (!(window.ResponsiveAds && typeof window.ResponsiveAds.createAdElement === "function")) {
      ad.className = "adsbygoogle ad-pc";
      ad.style.display = "block";
      ad.setAttribute("data-ad-client", AD_CLIENT);
      ad.setAttribute("data-ad-slot", "9898319477");
      ad.setAttribute("data-ad-format", "auto");
      ad.setAttribute("data-full-width-responsive", "true");
      ad.setAttribute("data-ad-lazy", "1");
    }
    wrapper.appendChild(ad);
    return wrapper;
  }

  function maybeInsertDynamicAds() {
    if (!consentAccepted || !ENV_OK || dynamicAdsDisabled() || isMobile()) return;
    if (pageTextLength() < CONFIG.dynamicMinTextLength) return;
    if (document.querySelector("[data-dynamic-ads-managed='1']")) return;
    if (document.querySelectorAll("ins.adsbygoogle").length >= 2) return;

    let inserted = 0;
    const started = Date.now();
    const tryInsert = () => {
      if (inserted >= CONFIG.dynamicMaxSlots || adCapReached()) return;
      const scrollDepth = (window.scrollY + window.innerHeight) / Math.max(1, document.documentElement.scrollHeight);
      if (Date.now() - started < CONFIG.dynamicDelayMs || scrollDepth < CONFIG.dynamicScrollDepth) return;

      const headings = document.querySelectorAll("main h2, main h3");
      const anchor = headings[1] || document.querySelector("main");
      if (!anchor || !anchor.parentNode || !safeDistanceFromAds(anchor)) return;

      const wrapper = createDynamicAd();
      anchor.parentNode.insertBefore(wrapper, anchor);
      inserted += 1;
      document.body.setAttribute("data-dynamic-ads-managed", "1");
      observeLazySlots();
      window.removeEventListener("scroll", tryInsert, true);
    };

    window.addEventListener("scroll", tryInsert, { passive: true, capture: true });
    setTimeout(tryInsert, CONFIG.dynamicDelayMs + 250);
  }

  function loadRakutenFor(placeholder) {
    if (placeholder.getAttribute("data-loaded") === "1") return;
    const affiliateId = placeholder.getAttribute("data-rakuten-affiliate");
    const timestamp = placeholder.getAttribute("data-rakuten-ts");
    if (!affiliateId || !timestamp) return;

    placeholder.setAttribute("data-loading", "1");
    const config = document.createElement("script");
    const mobileSize = placeholder.getAttribute("data-rakuten-size-mobile") || "300x250";
    const desktopSize = placeholder.getAttribute("data-rakuten-size-desktop") || "468x160";
    const design = placeholder.getAttribute("data-rakuten-widget") || "slide";
    config.textContent = [
      `rakuten_design="${design}";`,
      `rakuten_affiliateId="${affiliateId}";`,
      'rakuten_items="ctsmatch";',
      'rakuten_genreId="0";',
      `rakuten_size=(window.innerWidth<768?"${mobileSize}":"${desktopSize}");`,
      'rakuten_target="_blank";',
      'rakuten_theme="gray";',
      'rakuten_border="off";',
      'rakuten_auto_mode="on";',
      'rakuten_genre_title="off";',
      'rakuten_recommend="on";',
      `rakuten_ts="${timestamp}";`
    ].join("");
    const script = document.createElement("script");
    script.src = "https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106";
    script.defer = true;
    script.onload = () => {
      placeholder.setAttribute("data-loaded", "1");
      placeholder.removeAttribute("data-loading");
      const shell = getAdShell(placeholder);
      if (shell) shell.setAttribute("data-ad-empty", "false");
    };
    script.onerror = () => {
      const shell = getAdShell(placeholder);
      if (shell) shell.setAttribute("data-ad-empty", "true");
    };
    placeholder.append(config, script);
  }

  function initRakutenLazy() {
    const nodes = Array.from(document.querySelectorAll(".rakuten-widget-placeholder[data-rakuten-widget]"));
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(loadRakutenFor);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        loadRakutenFor(entry.target);
      });
    }, { rootMargin: CONFIG.lazyRootMargin, threshold: 0.01 });
    nodes.forEach((node) => observer.observe(node));
  }

  function acceptConsent(banner) {
    safeSet(CONSENT_STORAGE_KEY, "accepted");
    consentAccepted = true;
    syncConsentState();
    if (banner) {
      banner.classList.add("hidden");
      banner.style.display = "none";
    }
    dispatchConsentAccepted();
    startRuntimeAfterConsent();
  }

  function createFallbackConsentBanner() {
    const banner = document.createElement("div");
    banner.id = "consent-banner";
    banner.className = "fixed bottom-0 left-0 z-30 flex hidden w-full max-w-full flex-col items-center justify-between gap-2 border-t border-accent/40 bg-white p-3 shadow-lg transition-transform md:flex-row";
    banner.setAttribute("role", "alertdialog");
    banner.setAttribute("aria-modal", "true");

    const text = document.createElement("span");
    text.className = "text-xs text-gray-700 md:text-sm";
    text.append("本サイトは広告・アクセス解析のためCookie等を利用します。詳細は");
    const link = document.createElement("a");
    link.href = "/privacy-policy.html";
    link.className = "mx-1 underline text-accent";
    link.textContent = "プライバシーポリシー";
    text.append(link, "をご確認ください。同意いただける場合のみOKを押してください。");

    const button = document.createElement("button");
    button.id = "consent-accept";
    button.type = "button";
    button.className = "ml-2 rounded bg-accent px-3 py-1 text-xs font-semibold text-white md:text-sm";
    button.textContent = "OK";

    banner.append(text, button);
    document.body.appendChild(banner);
    return banner;
  }

  function injectConsentBanner() {
    const banner = document.getElementById("consent-banner") || createFallbackConsentBanner();
    const accept = document.getElementById("consent-accept") || banner.querySelector("[data-consent-accept]");
    if (consentAccepted || !ENV_OK) {
      banner.classList.add("hidden");
      banner.style.display = "none";
      return;
    }
    banner.classList.remove("hidden");
    banner.style.display = "flex";
    if (accept && accept.getAttribute("data-consent-bound") !== "1") {
      accept.setAttribute("data-consent-bound", "1");
      accept.addEventListener("click", () => acceptConsent(banner));
    }
  }

  function startRuntimeAfterConsent() {
    if (runtimeStarted || !ENV_OK || !consentAccepted) return;
    runtimeStarted = true;
    setPendingAdShells(false);
    scheduleGALoad();
    initAds();
    initRakutenLazy();
    setTimeout(maybeInsertDynamicAds, 600);
  }

  syncConsentState();
  window.NegiLabConsent = {
    hasConsent,
    accept: () => acceptConsent(document.getElementById("consent-banner")),
    storageKey: CONSENT_STORAGE_KEY
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureBaseAdCSS();
    setupNoVignetteLinks();
    if (googleVignetteHashActive()) {
      safeSessionSet(GOOGLE_ADS_SESSION_OFF_KEY, "1");
      clearGoogleVignetteHash();
    }
    setPendingAdShells(!consentAccepted);
    injectConsentBanner();
    if (isMobile() && document.body) {
      document.body.setAttribute("data-mobile-device", "true");
      if (mobileGoogleAdsDisabled()) {
        disableGoogleAdSlots("mobile");
      }
    }
    if (consentAccepted) {
      startRuntimeAfterConsent();
    } else if (ENV_OK) {
      document.addEventListener("cookieConsentAccepted", startRuntimeAfterConsent, { once: true });
    }
    log("[ads-consent-loader] ready", { ENV_OK, consentAccepted, adCap: computeAdaptiveCap() });
  });
})();
