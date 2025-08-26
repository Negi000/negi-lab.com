(function(){
  // Simple consent + environment gated loader for GA & AdSense
  var ENV_OK = typeof location !== 'undefined' && /(^|\.)negi-lab\.com$/i.test(location.hostname);
  var CONSENT_OK = false;
  try { CONSENT_OK = localStorage.getItem('cookieConsent') === 'accepted'; } catch(_) {}

  // Don't run on 404 or noindex pages
  var isNoIndex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
  if (isNoIndex) return;
  // Optional per-page disable flag for ads (GAは有効のまま)
  var ADS_DISABLED = (document.documentElement && document.documentElement.hasAttribute('data-ads-disabled')) || !!document.querySelector('meta[name="ads"][content="off"]');
  var DEBUG = false; try { DEBUG = localStorage.getItem('adsDebug') === '1'; } catch(_) {}

  function loadScript(src, attrs){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');
      s.src=src; s.async=true; if(attrs){Object.keys(attrs).forEach(function(k){s.setAttribute(k, attrs[k]);});}
      s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
    });
  }

  // GA event queue (fire after GA ready)
  var GA_EVENT_QUEUE = [];
  function track(event, params){
    try {
      if (window.gtag) {
        window.gtag('event', event, params || {});
      } else {
        GA_EVENT_QUEUE.push({event: event, params: params});
      }
    } catch(e){ /* no-op */ }
  }

  function initGA(){
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    loadScript('https://www.googletagmanager.com/gtag/js?id=G-N9X3N0RY0H')
      .then(function(){
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} // eslint-disable-line no-inner-declarations
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-N9X3N0RY0H');
        // Flush queued events
        if (GA_EVENT_QUEUE.length){
          GA_EVENT_QUEUE.forEach(function(item){ try { gtag('event', item.event, item.params || {}); } catch(_e){} });
          GA_EVENT_QUEUE.length = 0;
        }
      })
      .catch(function(e){ console.warn('GA load failed', e); });
  }

  // Push a single ad slot safely (avoid duplicate push)
  function pushAdSlot(el){
    try {
      if (!el || el.getAttribute('data-ads-pushed') === '1') return;
      // Lazy slot: defer until visible
      if (el.getAttribute('data-ad-lazy') === '1' && !isElementInViewport(el)) {
        // Will be handled by IntersectionObserver
        return;
      }
      if (adCapReached()) {
        if (DEBUG) console.log('[ads-consent-loader] ad cap reached, skip push');
        el.setAttribute('data-ads-pushed','cap');
        return;
      }
      if (el.getAttribute('data-adsbygoogle-status')) { el.setAttribute('data-ads-pushed','1'); return; }
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      el.setAttribute('data-ads-pushed','1');
      if (DEBUG) console.log('[ads-consent-loader] pushed slot', el);
      incrementAdPushCount();
      track('ad_slot_pushed', {
        slot: el.getAttribute('data-ad-slot') || 'auto',
        variant: window.__adsVariant || 'U',
        position_index: currentAdPushCount
      });
    } catch(e){ if (DEBUG) console.warn('Ad slot push failed', e); }
  }

  function pushAllSlots(){
    try {
      var slots = document.querySelectorAll('ins.adsbygoogle');
      for (var i=0; i<slots.length; i++) pushAdSlot(slots[i]);
    } catch(e){ if (DEBUG) console.warn('Push all slots failed', e); }
  }

  function startAdSlotObserver(){
    if (window.__adSlotObserverStarted) return;
    if (!('MutationObserver' in window)) return;
    try {
      var observer = new MutationObserver(function(mutations){
        if (!window.__adsLoaded) return;
        mutations.forEach(function(m){
          for (var i=0; i<m.addedNodes.length; i++){
            var node = m.addedNodes[i];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches('ins.adsbygoogle')) {
              pushAdSlot(node);
            } else if (node.querySelectorAll) {
              var found = node.querySelectorAll('ins.adsbygoogle');
              for (var j=0; j<found.length; j++) pushAdSlot(found[j]);
            }
          }
        });
        observeLazySlots();
      });
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
      window.__adSlotObserverStarted = true;
      if (DEBUG) console.log('[ads-consent-loader] MutationObserver started');
    } catch(e){ if (DEBUG) console.warn('Observer init failed', e); }
  }

  function isElementInViewport(el){
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 0.95 && rect.bottom > 0; // 5% margin
  }

  function observeLazySlots(){
    if (!('IntersectionObserver' in window)) {
      // Fallback: push immediately when ads loaded
      var fallback = document.querySelectorAll('ins.adsbygoogle[data-ad-lazy="1"]:not([data-ads-pushed="1"])');
      for (var i=0;i<fallback.length;i++) pushAdSlot(fallback[i]);
      return;
    }
    if (!window.__lazyAdObserver) {
      window.__lazyAdObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            var el = entry.target;
            window.__lazyAdObserver.unobserve(el);
            pushAdSlot(el);
            // Visibility track (first intersection)
            track('ad_viewport_enter', {
              slot: el.getAttribute('data-ad-slot') || 'auto',
              variant: window.__adsVariant || 'U'
            });
          }
        });
      }, { root: null, rootMargin: '120px 0px 120px 0px', threshold: 0.1 });
    }
    var lazySlots = document.querySelectorAll('ins.adsbygoogle[data-ad-lazy="1"]:not([data-ads-pushed="1"])');
    for (var k=0;k<lazySlots.length;k++) {
      // If already in viewport, push now, else observe
      if (isElementInViewport(lazySlots[k])) pushAdSlot(lazySlots[k]);
      else window.__lazyAdObserver.observe(lazySlots[k]);
    }
  }

  // Ad cap logic
  var currentAdPushCount = 0;
  function getAdCap(){
    var w = (window.innerWidth || 1024);
    return w < 768 ? 3 : 4; // mobile / desktop
  }
  function incrementAdPushCount(){ currentAdPushCount++; if (adCapReached()) track('ad_cap_reached', {count: currentAdPushCount, variant: window.__adsVariant || 'U'}); }
  function adCapReached(){ return currentAdPushCount >= getAdCap(); }

  // AB test variant assignment (A/B) stored in localStorage
  (function assignVariant(){
    try {
      var v = localStorage.getItem('adsVariant');
      if (!v || (v !== 'A' && v !== 'B')) {
        v = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('adsVariant', v);
      }
      window.__adsVariant = v;
    } catch(_) {
      window.__adsVariant = 'U';
    }
  })();

  // Central dynamic mid-content insertion fallback (if page hasn\'t defined its own)
  function maybeInsertDynamicAds(){
    if (!ENV_OK || adCapReached()) return;
    if (document.querySelector('[data-dynamic-ads-managed="1"]')) return; // already managed
    // Skip short content pages
    try {
      var textLen = (document.body.innerText || '').length;
      if (textLen < 3000) return; // too short for mid insertion
    } catch(_){}

    var variant = window.__adsVariant || 'A';
    var timeThreshold = variant === 'B' ? 15000 : 20000; // B faster
    var depthThreshold = variant === 'B' ? 0.35 : 0.45;
    var inserted = 0, maxDynamic = 2;
    var startTime = Date.now();

    function chooseAnchor(){
      // Prefer first main section after 1st h2
      var h2s = document.querySelectorAll('h2');
      if (h2s.length > 1) return h2s[1];
      return document.querySelector('main') || document.body;
    }
    var anchor = chooseAnchor();
    if (!anchor) return;

    var templateExists = document.getElementById('dynamic-ad-template');
    function createAdNode(slotId){
      var wrapper = document.createElement('aside');
      wrapper.className = 'max-w-3xl mx-auto my-10';
      wrapper.setAttribute('aria-label','スポンサー広告');
      var label = document.createElement('div');
      label.className = 'text-xs text-gray-400 mb-1';
      label.textContent = 'スポンサーリンク';
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.minHeight = '250px';
      ins.setAttribute('data-ad-client','ca-pub-1835873052239386');
      ins.setAttribute('data-ad-format','auto');
      ins.setAttribute('data-full-width-responsive','true');
      ins.setAttribute('data-ad-lazy','1');
      if (slotId) ins.setAttribute('data-ad-slot', slotId);
      wrapper.appendChild(label); wrapper.appendChild(ins);
      return wrapper;
    }

    function tryInsert(){
      if (inserted >= maxDynamic || adCapReached()) return;
      var seconds = (Date.now() - startTime)/1000;
      var scrollDepth = (window.scrollY + window.innerHeight) / Math.max(1, document.documentElement.scrollHeight);
      if (seconds * 1000 < timeThreshold || scrollDepth < depthThreshold) return;
      var slots = ['7843001775','9898319477','4837564489'];
      var slot = slots[inserted % slots.length];
      var node = createAdNode(slot);
      anchor.parentNode.insertBefore(node, anchor.nextSibling);
      inserted++;
      track('ads_dynamic_insert', {slot: slot, index: inserted, variant: variant});
      if (window.__adsLoaded) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(_){}
      }
      if (inserted >= maxDynamic) {
        window.removeEventListener('scroll', onScroll, { passive: true });
      }
    }
    function onScroll(){ tryInsert(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    // fallback timers
    setTimeout(tryInsert, timeThreshold + 1000);
    setTimeout(tryInsert, timeThreshold + 10000);
    document.addEventListener('adsReady', tryInsert, { once: false });
    document.body.setAttribute('data-dynamic-ads-managed','1');
  }

  // Inject base CSS once (CLS guards) if not present
  function ensureBaseAdCSS(){
    if (document.getElementById('ad-slot-base-style')) return;
    var st = document.createElement('style');
    st.id = 'ad-slot-base-style';
    st.textContent = '.adsbygoogle{contain:content;} .ad-slot{display:block;min-height:250px;}';
    document.head.appendChild(st);
  }

  function initAds(){
    if (window.__adsLoaded) { startAdSlotObserver(); pushAllSlots(); return; }
    window.__adsLoaded = true;
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1835873052239386', { crossorigin: 'anonymous' })
      .then(function(){
        startAdSlotObserver();
        pushAllSlots();
        observeLazySlots();
        try {
          var evt = new Event('adsReady');
          document.dispatchEvent(evt);
        } catch(e){
          try {
            var evtLegacy = document.createEvent('Event');
            evtLegacy.initEvent('adsReady', true, true);
            document.dispatchEvent(evtLegacy);
          } catch(_e){}
        }
      })
      .catch(function(e){ console.warn('Ads load failed', e); });
  }

  // Minimal consent banner injection for pages without their own banner
  function injectConsentBanner(){
    if (document.getElementById('consent-banner')) return; // already present
    try {
      var lang = (document.documentElement && document.documentElement.lang || 'ja').toLowerCase();
      var isJa = lang.indexOf('ja') === 0;
      var text = isJa
        ? '本サイトはCookie等を利用し、広告・アフィリエイト収益のため、一部ツールやサービスで広告表示やCookie等の埋め込みを行う場合があります。プライバシーポリシーをご確認のうえ、同意いただける場合のみ「OK」を押してください。'
        : 'This site uses cookies and may include advertisements and cookie integration for advertising/affiliate revenue in some tools. Please review our Privacy Policy and click "OK" only if you agree.';

      var banner = document.createElement('div');
      banner.id = 'consent-banner';
      banner.setAttribute('role', 'alertdialog');
      banner.style.position = 'fixed';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.bottom = '0';
      banner.style.zIndex = '9999';
      banner.style.background = '#ffffff';
      banner.style.borderTop = '1px solid rgba(101,193,85,0.4)';
      banner.style.boxShadow = '0 -6px 20px rgba(0,0,0,0.06)';
      banner.style.padding = '10px 12px';
      banner.style.display = 'flex';
      banner.style.flexWrap = 'wrap';
      banner.style.alignItems = 'center';
      banner.style.justifyContent = 'space-between';
      banner.style.gap = '8px';

  var span = document.createElement('span');
  span.textContent = text + ' ';
      span.style.fontSize = '12px';
      span.style.color = '#374151';
      span.style.lineHeight = '1.4';
      span.style.flex = '1 1 auto';

  var link = document.createElement('a');
  link.href = '/privacy-policy-unified.html';
  link.textContent = isJa ? 'プライバシーポリシー' : 'Privacy Policy';
  link.style.textDecoration = 'underline';
  link.style.color = '#2563EB';
  link.style.marginLeft = '6px';

      var btn = document.createElement('button');
      btn.id = 'consent-accept';
      btn.textContent = 'OK';
      btn.style.background = '#4ADE80';
      btn.style.color = '#ffffff';
      btn.style.border = 'none';
      btn.style.borderRadius = '6px';
      btn.style.padding = '6px 10px';
      btn.style.fontSize = '12px';
      btn.style.fontWeight = '600';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', function(){
        try { localStorage.setItem('cookieConsent', 'accepted'); } catch(_) {}
        // Dispatch modern and legacy events for maximum compatibility
        try {
          var evt = new Event('cookieConsentAccepted');
          document.dispatchEvent(evt);
        } catch(_) {
          var evtLegacy = document.createEvent('Event');
          evtLegacy.initEvent('cookieConsentAccepted', true, true);
          document.dispatchEvent(evtLegacy);
        }
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      });

  var textWrap = document.createElement('div');
  textWrap.style.display = 'flex';
  textWrap.style.alignItems = 'center';
  textWrap.style.flex = '1 1 auto';
  textWrap.appendChild(span);
  textWrap.appendChild(link);

  banner.appendChild(textWrap);
      banner.appendChild(btn);
      document.body.appendChild(banner);
    } catch(e){ /* no-op */ }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Lightweight heuristic: if there is at least one ad slot, we consider initializing ads when allowed
    var hasAdSlot = !!document.querySelector('ins.adsbygoogle');

    if (ENV_OK && CONSENT_OK) {
      initGA();
      if (hasAdSlot && !ADS_DISABLED) initAds();
      else if (!ADS_DISABLED) startAdSlotObserver();
    ensureBaseAdCSS();
    setTimeout(maybeInsertDynamicAds, 1500);
    } else {
      // Provide a minimal consent UI if running on production and not on noindex pages
      if (ENV_OK && !isNoIndex && !CONSENT_OK) {
        injectConsentBanner();
      }
      // If consent arrives later, listen for acceptance and then init
      document.addEventListener('cookieConsentAccepted', function(){
        if (ENV_OK) {
          initGA();
          if (!ADS_DISABLED) initAds();
      ensureBaseAdCSS();
      setTimeout(maybeInsertDynamicAds, 1500);
        }
      }, { once: true });
    }
  });
})();
