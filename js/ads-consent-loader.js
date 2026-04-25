(function(){
  /* ======================================================
   * ads-consent-loader.js (optimized incremental refactor)
   * 改善ポイント追加版 (2025-09-10)
   *  - 設定オブジェクト化 / GA 遅延ロード
   *  - スクロールリスナー節約 (rAF + 1度だけ実行)
   *  - 動的広告キャップをページテキスト長/画面幅で調整
   *  - IntersectionObserver の rootMargin 調整 (過剰プリロード抑制)
   *  - 高負荷 MutationObserver の不要実行回避 (Wiki判定)
   *  - 既存挙動は後方互換を維持
   * ====================================================== */

  var CONFIG = {
    lazyRootMargin: '220px 0px 220px 0px', // 300px→220px: 早すぎるプリロードを軽減
    dynamicTimeThresholdMs: 3000,          // 既存値(コメント)を保持
    dynamicScrollDepth: 0.15,
    dynamicMaxDesktop: 10,                 // 12→10: 上限を適度に調整
    dynamicMaxMobile: 7,                   // 8→7: モバイル上限を抑制
    baseDesktopCap: 6,                     // 8→6: 基本広告数を減少
    baseMobileCap: 3,                      // 5→3: モバイル基本数を大幅減少
    textLengthPerExtraSlot: 500,          // 1400→2500: Wikiページ実測に基づく最適化
    gaIdleDelay: 3000,                     // 初期操作が無い場合の GA フォールバック遅延
    enableAdaptiveCap: true
  };
  // Consent + environment gated loader for GA & AdSense.
  // Ads and analytics are loaded only after the user explicitly accepts.
  var host = (typeof location !== 'undefined') ? location.hostname : '';
  // Allow primary domain + related wiki domains + localhost
  var ENV_OK = /(^|\.)negi-lab\.com$/i.test(host)
    || /(^|\.)gamewiki\.jp$/i.test(host)
    || /^(localhost|127\.0\.0\.1)$/.test(host);
  // No URL override is supported: consent must be explicit.
  // Consent is read from storage; ads and analytics stay off until accepted.
  var CONSENT_STORAGE_KEY = 'cookieConsent';
  function hasConsent(){
    try { return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted'; }
    catch(_) { return false; }
  }
  var CONSENT_OK = hasConsent();
  function syncConsentState(){
    try {
      document.documentElement.setAttribute('data-ads-consent', CONSENT_OK ? 'accepted' : 'pending');
    } catch(_) {}
  }
  syncConsentState();
  window.NegiLabConsent = window.NegiLabConsent || {
    hasConsent: hasConsent,
    storageKey: CONSENT_STORAGE_KEY
  };

  // Don't run on 404 or noindex pages
  var isNoIndex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
  if (isNoIndex) return;
  // Optional per-page disable flag for ads (GAは有効のまま)
  var ADS_DISABLED = (document.documentElement && document.documentElement.hasAttribute('data-ads-disabled')) || !!document.querySelector('meta[name="ads"][content="off"]');
  // Per-page flag to disable dynamic auto insertion while keeping static slots
  var DYNAMIC_ADS_DISABLED = (document.documentElement && document.documentElement.hasAttribute('data-no-dynamic-ads'))
    || !!document.querySelector('meta[name="ads-dynamic"][content="off"]');
  var DEBUG = false; // パフォーマンス最適化：デバッグ無効化 try { DEBUG = localStorage.getItem('adsDebug') === '1'; } catch(_) {}
  if (DEBUG) console.log('[ads-consent-loader] init', {host: host, ENV_OK: ENV_OK, CONSENT_OK: CONSENT_OK});

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
    if (DEBUG) console.log('[ads-consent-loader] loading GA');
    loadScript('https://www.googletagmanager.com/gtag/js?id=G-N9X3N0RY0H')
      .then(function(){
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} // eslint-disable-line no-inner-declarations
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-N9X3N0RY0H');
        if (GA_EVENT_QUEUE.length){
          GA_EVENT_QUEUE.forEach(function(item){ try { gtag('event', item.event, item.params || {}); } catch(_e){} });
          GA_EVENT_QUEUE.length = 0;
        }
        if (DEBUG) console.log('[ads-consent-loader] GA ready');
      })
      .catch(function(e){ console.warn('GA load failed', e); });
  }

  // 初期ユーザ操作または遅延で GA をロード (Largest Contentful Paint への影響低減)
  function scheduleGALoad(){
    if(!ENV_OK) return; // 不要環境では実行しない
    if(window.__gaScheduled) return; window.__gaScheduled = true;
    var fired = false;
    function fire(){ if(fired) return; fired=true; initGA(); cleanup(); }
    function cleanup(){ ['scroll','keydown','pointerdown','click','touchstart','visibilitychange'].forEach(function(ev){ window.removeEventListener(ev,firePassive,true); }); }
    function firePassive(){ fire(); }
    ['scroll','keydown','pointerdown','click','touchstart','visibilitychange'].forEach(function(ev){ window.addEventListener(ev, firePassive, {passive:true, capture:true}); });
    setTimeout(fire, CONFIG.gaIdleDelay); // 3秒フォールバック
  }

  // Push a single ad slot safely (avoid duplicate push)
  function pushAdSlot(el){
    try {
      if (!el || el.getAttribute('data-ads-pushed') === '1') return;
      // Lazy slot handling:
      // A: 最初の1枠は即時表示ポリシーに変更。最初の lazy 枠なら強制 push。
      if (el.getAttribute('data-ad-lazy') === '1') {
        if (!window.__firstAdForced) {
          window.__firstAdForced = true;
          el.removeAttribute('data-ad-lazy');
          if (DEBUG) console.log('[ads-consent-loader] force first ad immediate', el.getAttribute('data-ad-slot'));
          // 続行して即時 push
        } else if (!isElementInViewport(el)) {
          // 2枠目以降は従来どおりビューポート進入まで遅延
          if (DEBUG) console.log('[ads-consent-loader] defer lazy slot until viewport', el.getAttribute('data-ad-slot'));
          return;
        }
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
  if (DEBUG) console.log('[ads-consent-loader] found slots', slots.length);
      for (var i=0; i<slots.length; i++) pushAdSlot(slots[i]);
    } catch(e){ if (DEBUG) console.warn('Push all slots failed', e); }
  }

  function startAdSlotObserver(){
    if (window.__adSlotObserverStarted) return;
    if (!('MutationObserver' in window)) return;
    try {
      var observer = new MutationObserver(function(mutations){
        if (!window.__adsLoaded) return;
        // パフォーマンス最適化：バッチ処理とrequestAnimationFrame使用
        var nodesToCheck = [];
        mutations.forEach(function(m){
          for (var i=0; i<m.addedNodes.length; i++){
            var node = m.addedNodes[i];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches('ins.adsbygoogle')) {
              nodesToCheck.push(node);
            } else if (node.querySelectorAll) {
              var found = node.querySelectorAll('ins.adsbygoogle');
              for (var j=0; j<found.length; j++) nodesToCheck.push(found[j]);
            }
          }
        });
        if (nodesToCheck.length > 0) {
          requestAnimationFrame(function() {
            nodesToCheck.forEach(function(node) { pushAdSlot(node); });
            observeLazySlots();
          });
        }
      });
      // パフォーマンス最適化：監視範囲を制限
      var observeTarget = document.querySelector('main') || document.body || document.documentElement;
      observer.observe(observeTarget, { childList: true, subtree: true });
      window.__adSlotObserverStarted = true;
      if (DEBUG) console.log('[ads-consent-loader] MutationObserver started');
    } catch(e){ if (DEBUG) console.warn('Observer init failed', e); }
  }

  function isElementInViewport(el){
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 1.5 && rect.bottom > -vh * 0.5; // 大幅に緩和：95%→150%、0→-50%
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
  }, { root: null, rootMargin: CONFIG.lazyRootMargin, threshold: 0.01 });
    }
    var lazySlots = document.querySelectorAll('ins.adsbygoogle[data-ad-lazy="1"]:not([data-ads-pushed="1"])');
    for (var k=0;k<lazySlots.length;k++) {
      // If already in viewport, push now, else observe
      if (isElementInViewport(lazySlots[k])) pushAdSlot(lazySlots[k]);
      else window.__lazyAdObserver.observe(lazySlots[k]);
    }
  }

  // Ad cap logic - keep density adaptive to page length and viewport.
  var currentAdPushCount = 0;
  function computeAdaptiveCap(){
    if(!CONFIG.enableAdaptiveCap) return (window.innerWidth||1024) < 768 ? CONFIG.dynamicMaxMobile : CONFIG.dynamicMaxDesktop;
    var w = window.innerWidth||1024;
    var textLen = window.__pageTextLen || 0;
    var base = w < 768 ? CONFIG.baseMobileCap : CONFIG.baseDesktopCap;
    if(textLen>0){
      var extra = Math.floor(textLen / CONFIG.textLengthPerExtraSlot); // 1400文字ごとに+1
      base += extra;
    }
    var maxCap = w < 768 ? CONFIG.dynamicMaxMobile : CONFIG.dynamicMaxDesktop;
    if(base > maxCap) base = maxCap;
    if(base < 1) base = 1;
    return base;
  }
  function getAdCap(){
    if(typeof window.__dynamicAdCap === 'number') return window.__dynamicAdCap;
    window.__dynamicAdCap = computeAdaptiveCap();
    return window.__dynamicAdCap;
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

    // Wiki専用：動的広告挿入の完全無効化
    // data-no-dynamic-ads属性またはwiki-専用クラスがある場合は動的挿入を行わない
    // 注意：data-wiki-contentは設置型広告には影響しないように条件を調整
    if (DYNAMIC_ADS_DISABLED || document.querySelector('.wiki-hero, .wiki-header')) {
      if (DEBUG) console.log('[ads-consent-loader] dynamic ads disabled for wiki content');
      document.body.setAttribute('data-dynamic-ads-managed','1');
      return;
    }

    // レスポンシブ広告システムのデバイス判定を使用
    var isMobile = window.ResponsiveAds ? window.ResponsiveAds.isMobileDevice() :
                   (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    if (isMobile) {
      if (DEBUG) console.log('[ads-consent-loader] dynamic ads disabled on mobile devices');
      document.body.setAttribute('data-dynamic-ads-managed','1');
      return;
    }

    // 既存の設置広告が多数ある場合は動的広告を控える
    try {
      // 楽天アフィリエイトは除外してカウント
      var existingAds = document.querySelectorAll('ins.adsbygoogle, .ad-block:not([aria-label*="楽天"]):not([aria-label*="アフィリエイト"])').length;
      if (existingAds >= 3) { // 2→3に緩和（楽天除外により実質同じ）
        if (DEBUG) console.log('[ads-consent-loader] too many existing ads (' + existingAds + '), skipping dynamic insertion');
        document.body.setAttribute('data-dynamic-ads-managed','1');
        return;
      }
    } catch(_){}

    // Skip short content pages
    try {
      var textLen = (document.body.innerText || '').length;
  if (DEBUG) console.log('[ads-consent-loader] page text length', textLen);
      if (textLen < 300) return; // threshold大幅緩和: 3000→1500→1000→300に短縮
    } catch(_){}

  // ハイブリッド方針: 動的挿入条件を大幅に緩和して収益性向上
  var variant = window.__adsVariant || 'A';
  var timeThreshold = 3000; // 15秒→3秒に短縮
  var depthThreshold = 0.15; // 45%→15%に緩和
  var inserted = 0, maxDynamic = 1; // 3枠→1枠に削減（くどさ回避）
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
      // レスポンシブ広告システムを使用して適切なデバイス用広告を作成
      var isMobile = window.ResponsiveAds ? window.ResponsiveAds.isMobileDevice() :
                     (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

      var wrapper = document.createElement('aside');
      wrapper.className = 'max-w-3xl mx-auto my-10 dynamic-ad-container';
      wrapper.setAttribute('aria-label','スポンサー広告');
      wrapper.setAttribute('data-dynamic-ad', 'true');
      wrapper.setAttribute('data-main-content-ad', 'true'); // メインコンテンツ内広告マーク
      var label = document.createElement('div');
      label.className = 'text-xs text-gray-400 mb-1';
      label.textContent = 'スポンサーリンク';

      var ins = document.createElement('ins');
      ins.className = isMobile ? 'adsbygoogle ad-sp' : 'adsbygoogle ad-pc';
      ins.style.display = 'block';
      ins.style.minHeight = '100px'; // 250px→100pxに縮小
      ins.style.maxHeight = '200px'; // 最大高さ200px制限
      ins.style.height = '200px'; // 固定高さで縦長防止
      ins.style.overflow = 'hidden'; // はみ出し防止
      ins.setAttribute('data-ad-client', window.ResponsiveAds ? window.ResponsiveAds.AD_CLIENT : 'ca-pub-1835873052239386');
      ins.setAttribute('data-ad-format','rectangle'); // auto→rectangleに変更（縦長防止）
      ins.setAttribute('data-ad-layout',''); // レスポンシブレイアウト無効化
      ins.setAttribute('data-full-width-responsive','true');
      ins.setAttribute('data-ad-lazy','1');
      ins.setAttribute('data-device-type', isMobile ? 'mobile' : 'pc');
      // 縦長広告の明示的な禁止
      ins.setAttribute('data-ad-layout', 'in-article');
      ins.setAttribute('data-ad-layout-key', '-fb+5w+4e-db+86');
      if (slotId) ins.setAttribute('data-ad-slot', slotId);
      wrapper.appendChild(label); wrapper.appendChild(ins);
      return wrapper;
    }

    // 設置広告との距離をチェックする関数（楽天アフィリエイト除外）
    function isSafeDistanceFromExistingAds(targetElement) {
      var existingAds = document.querySelectorAll('.ad-block:not([aria-label*="楽天"]):not([aria-label*="アフィリエイト"]), ins.adsbygoogle, [data-dynamic-ad="true"]');
      var minDistance = 800; // 最小距離（ピクセル）

      for (var i = 0; i < existingAds.length; i++) {
        var adRect = existingAds[i].getBoundingClientRect();
        var targetRect = targetElement.getBoundingClientRect();
        var distance = Math.abs(adRect.top - targetRect.top);

        if (distance < minDistance) {
          if (DEBUG) console.log('[ads-consent-loader] too close to existing ad:', distance, 'px');
          return false;
        }
      }
      return true;
    }

  function tryInsert(){
      if (inserted >= maxDynamic || adCapReached()) return;

      // 設置広告が既にある場合の制限強化（楽天アフィリエイト除外）
      try {
        var existingStatic = document.querySelectorAll('ins.adsbygoogle, .ad-block:not([aria-label*="楽天"]):not([aria-label*="アフィリエイト"])').length;
        if (existingStatic >= 3) { // 2→3に緩和
          if (DEBUG) console.log('[ads-consent-loader] existing ads limit reached:', existingStatic);
          return;
        }
      } catch(_){ }

      var seconds = (Date.now() - startTime)/1000;
      var scrollDepth = (window.scrollY + window.innerHeight) / Math.max(1, document.documentElement.scrollHeight);
      if (seconds * 1000 < timeThreshold || scrollDepth < depthThreshold) return;

      // レスポンシブ広告システムからスロットIDを取得
      var isMobile = window.ResponsiveAds ? window.ResponsiveAds.isMobileDevice() :
                     (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

      var slots, slot;
      if (window.ResponsiveAds && window.ResponsiveAds.AD_SLOTS) {
        var deviceSlots = isMobile ? window.ResponsiveAds.AD_SLOTS.mobile : window.ResponsiveAds.AD_SLOTS.pc;
        slots = [deviceSlots.bottom, deviceSlots.middle, deviceSlots.top];
        slot = slots[inserted % slots.length];
      } else {
        // フォールバック
        slots = isMobile ? ['8916646342','3205934910','6430083800'] : ['7843001775','9898319477','4837564489'];
        slot = slots[inserted % slots.length];
      }

      var node = createAdNode(slot);

      // 設置広告との距離チェック
      var tempNode = document.createElement('div');
      tempNode.style.position = 'absolute';
      tempNode.style.visibility = 'hidden';
      anchor.parentNode.insertBefore(tempNode, anchor.nextSibling);

      if (!isSafeDistanceFromExistingAds(tempNode)) {
        anchor.parentNode.removeChild(tempNode);
        if (DEBUG) console.log('[ads-consent-loader] skipping insertion due to proximity to existing ads');
        return;
      }

      anchor.parentNode.removeChild(tempNode);
      anchor.parentNode.insertBefore(node, anchor.nextSibling);
      inserted++;
      track('ads_dynamic_insert', {slot: slot, index: inserted, variant: variant, device: isMobile ? 'mobile' : 'pc'});
      if (window.__adsLoaded) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(_){}
      }
      if (inserted >= maxDynamic) {
        window.removeEventListener('scroll', onScroll, { passive: true });
      }
    }
  var scrollTicking = false; // rAF節約
    function onScroll(){
      if(scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(function(){ scrollTicking=false; tryInsert(); });
    }
    window.addEventListener('scroll', onScroll, { passive: true, capture: false });
  // fallback timer (一度のみ)
  setTimeout(tryInsert, timeThreshold + 1000);
    document.addEventListener('adsReady', tryInsert, { once: false });
    document.body.setAttribute('data-dynamic-ads-managed','1');
  }

  // Inject base CSS once (CLS guards) if not present
  function ensureBaseAdCSS(){
    if (document.getElementById('ad-slot-base-style')) return;
    var st = document.createElement('style');
    st.id = 'ad-slot-base-style';
    st.textContent = '.adsbygoogle{contain:content;} .ad-slot{display:block;min-height:250px;}' +
      '.ad-block[data-ad-empty="true"]{position:relative}' +
      // 空枠は完全に非表示（ユーザー要望）: ラッパー要素のみに限定
      '.ad-block[data-ad-empty="true"], .dynamic-ad-container[data-ad-empty="true"], aside[aria-label*="広告"][data-ad-empty="true"], aside[aria-label*="スポンサー"][data-ad-empty="true"]{display:none !important;visibility:hidden !important;height:0 !important;margin:0 !important;padding:0 !important;border:0 !important;}' +
      '.ad-skeleton{animation:pulse 1.4s ease-in-out infinite; background:linear-gradient(90deg,#1a2530,#1f2e3a 50%,#1a2530);background-size:200% 100%;border:1px solid #23313c;border-radius:10px;height:110px;display:flex;align-items:center;justify-content:center;font-size:.55rem;color:#5d7486;letter-spacing:.5px}' +
      '@keyframes pulse{0%{background-position:0 0}100%{background-position:-200% 0}}' +
      '.rakuten-widget-placeholder{min-height:120px;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#678;background:#142028;border:1px dashed #2c3a46;border-radius:10px;position:relative;overflow:hidden}' +
      '.rakuten-widget-placeholder[data-loading="1"]::after{content:"Loading…";opacity:.8}' +
      '.rakuten-widget-placeholder[data-loaded="1"]{min-height:0;border:0;background:transparent;padding:0}';
    document.head.appendChild(st);
  }

  /* =============================
     Rakuten widget lazy loader
     ============================= */
  function initRakutenLazy(){
    var nodes = document.querySelectorAll('.rakuten-widget-placeholder[data-rakuten-widget]');
    if(!nodes.length) return;
    if(!('IntersectionObserver' in window)) {
      // Fallback: immediate load
      nodes.forEach(loadRakutenFor);
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          io.unobserve(entry.target);
          loadRakutenFor(entry.target);
        }
      });
    }, {root:null, rootMargin:'160px 0px', threshold:0.01});
    nodes.forEach(function(n){ io.observe(n); });
  }

  function loadRakutenFor(placeholder){
    if(placeholder.getAttribute('data-loaded')==='1') return;
    placeholder.setAttribute('data-loading','1');
    var design = placeholder.getAttribute('data-rakuten-widget') || 'slide';
    var aff = placeholder.getAttribute('data-rakuten-affiliate');
    var ts = placeholder.getAttribute('data-rakuten-ts');
    var sizeMobile = placeholder.getAttribute('data-rakuten-size-mobile') || '300x250';
    var sizeDesktop = placeholder.getAttribute('data-rakuten-size-desktop') || '468x160';
    var scriptWrap = document.createElement('div');
    // Inline config script
    var cfg = document.createElement('script');
    cfg.type = 'text/javascript';
    cfg.text = 'rakuten_design="'+design+'";rakuten_affiliateId="'+aff+'";rakuten_items="ctsmatch";rakuten_genreId="0";rakuten_size=(window.innerWidth<768?"'+sizeMobile+'":"'+sizeDesktop+'" );rakuten_target="_blank";rakuten_theme="gray";rakuten_border="off";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_ts="'+ts+'";';
    // External script
    var ext = document.createElement('script');
    ext.type='text/javascript';
    ext.src='https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106';
    ext.defer = true;
    ext.onload = function(){
      placeholder.setAttribute('data-loaded','1');
      placeholder.removeAttribute('data-loading');
      try {
        // 親のスポンサー枠を可視状態に（監視ロジックでも検知するが、早期反映）
        var blk = placeholder.closest('.ad-block, aside[aria-label*="楽天"], aside[aria-label*="スポンサー"]');
        if(blk){ blk.setAttribute('data-ad-empty','false'); blk.removeAttribute('hidden'); }
      } catch(_){ }
    };
    ext.onerror = function(){
      // 読み込み失敗時は親枠を非表示に
      try {
        placeholder.removeAttribute('data-loading');
        var blk = placeholder.closest('.ad-block, aside[aria-label*="楽天"], aside[aria-label*="スポンサー"]');
  if(blk){ blk.setAttribute('data-ad-empty','true'); }
      } catch(_){ }
    };
    scriptWrap.appendChild(cfg);
    scriptWrap.appendChild(ext);
    placeholder.appendChild(scriptWrap);
    // 7秒経過しても描画が無い場合は空扱い（安全側）
    setTimeout(function(){
      if(placeholder.getAttribute('data-loaded')==='1') return;
      var hasIframe = !!placeholder.querySelector('iframe');
      if(!hasIframe){
        try{
          var blk = placeholder.closest('.ad-block, aside[aria-label*="楽天"], aside[aria-label*="スポンサー"]');
          if(blk){ blk.setAttribute('data-ad-empty','true'); }
        }catch(_){ }
      }
    }, 7000);
  }

  function initAds(){
    if (window.__adsLoaded) { startAdSlotObserver(); pushAllSlots(); return; }
    window.__adsLoaded = true;
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1835873052239386', { crossorigin: 'anonymous' })
      .then(function(){
        startAdSlotObserver();
        pushAllSlots();
        observeLazySlots();
        if (DEBUG) console.log('[ads-consent-loader] ads script loaded, current pushed', currentAdPushCount);
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

    // Fail-safe: after 6s if ads script not present / no push happened, attempt a manual push of visible slots
    setTimeout(function(){
      if (!window.adsbygoogle || typeof window.adsbygoogle.push !== 'function') {
        if (DEBUG) console.warn('[ads-consent-loader] adsbygoogle object missing after timeout');
      }
      if (currentAdPushCount === 0) {
        if (DEBUG) console.warn('[ads-consent-loader] no ads pushed yet, forcing immediate attempt');
        pushAllSlots();
        observeLazySlots();
      }
    }, 6000);
  }

  // Wiki専用：高度な広告状態監視システム
  function initAdvancedAdMonitoring(){
    if (DEBUG) console.log('[ads-consent-loader] initializing advanced ad monitoring for wiki');

    // 💡 Wiki コンテンツ保護を強化
    const protectedSelectors = [
      '[data-wiki-content="true"]',
      '[data-no-dynamic-ads="true"]',
      '.skill-section',
      '.skill',
      '.skill-bonus',
      '.gate-section',
      '.character-section',
      '.rom-section',
      '.card[data-wiki-content]',
      'section.card',
      '.content-section'
    ];

    protectedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // 自動広告のみに保護属性を設定（設置型広告の動作は保持）
        element.setAttribute('data-no-auto-ads', 'true');
        element.style.setProperty('--google-ads-blocked', 'true');

        // 既存の自動広告要素を除去（設置型広告は保持）
        const existingAds = element.querySelectorAll('.google-auto-placed, ins[class*="adsbygoogle"]:not([data-ad-slot])');
        existingAds.forEach(ad => {
          ad.style.display = 'none';
          ad.style.visibility = 'hidden';
          ad.style.height = '0';
          ad.style.margin = '0';
          ad.style.padding = '0';
          ad.remove();
        });
      });
    });

    // 💡 縦長広告対策：メインコンテンツエリアでの縦長広告完全禁止
    const adObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const ads = node.querySelectorAll ? node.querySelectorAll('ins[class*="adsbygoogle"], .google-auto-placed') : [];
            if (ads.length || (node.classList && (node.classList.contains('google-auto-placed') || node.tagName === 'INS'))) {
              const adElement = ads.length ? ads[0] : node;

              // 明示ホワイトリスト: アンカー/サイドレール系の自動広告は許可
              try {
                const isAutoAd = adElement.classList && adElement.classList.contains('google-auto-placed');
                if (isAutoAd) {
                  const cs = window.getComputedStyle(adElement);
                  const posFixed = cs && cs.position === 'fixed';
                  const right = cs && cs.right && cs.right !== 'auto' ? parseInt(cs.right, 10) : 9999;
                  const left = cs && cs.left && cs.left !== 'auto' ? parseInt(cs.left, 10) : 9999;
                  const nearEdge = posFixed && (right <= 48 || left <= 48);
                  const reasonableSiderail = posFixed && nearEdge && (adElement.offsetHeight > 80) && (adElement.offsetWidth <= 400);
                  const anchorStatus = adElement.getAttribute && adElement.getAttribute('data-anchor-status');
                  if (reasonableSiderail || (anchorStatus && anchorStatus !== 'none')) {
                    if (DEBUG) console.log('[ads-consent-loader] whitelist anchored/siderail auto ad');
                    return; // 一切の制限を適用しない
                  }
                }
              } catch(_) { /* no-op */ }

              // 設置型広告（data-ad-slot属性付き）は制限対象外
              if (adElement.hasAttribute && adElement.hasAttribute('data-ad-slot')) {
                if (DEBUG) console.log('[ads-consent-loader] 設置型広告を検出、制限をスキップ');
                return;
              }

              // 保護されたエリア内の自動広告は完全削除（設置型広告は除外）
              const parentProtected = adElement.closest('[data-no-dynamic-ads], .skill-section, .gate-section');
              if (parentProtected && !adElement.hasAttribute('data-ad-slot')) {
                adElement.remove();
                return;
              }

              // サイドレーン判定：aside要素またはサイドバー系クラス内の広告は制限しない
              const isInSidebar = adElement.closest('aside, .sidebar, .side-panel, [class*="sidebar"], [class*="side"]');
              if (isInSidebar) {
                if (DEBUG) console.log('[ads-consent-loader] サイドレーン内の広告をスキップ');
                return;
              }

              // メインコンテンツエリア判定（自動広告のみ対象）
              const isInMainContent = adElement.closest('main, .main-content, section.card, .content-section, .top-layout, [data-wiki-content]') &&
                                    !adElement.closest('.ad-block, aside');

              if (isInMainContent) {
                // パフォーマンス最適化：遅延時間短縮
                setTimeout(() => {
                  const height = adElement.offsetHeight;
                  const width = adElement.offsetWidth;

                  // 縦長広告判定：高さ200px以上、または高さが幅の1.5倍以上
                  const isTallAd = height > 200 || (height > width * 1.5);

                  if (isTallAd) {
                    adElement.remove();
                    console.warn('メインコンテンツ内の縦長自動広告を削除しました:', {
                      height: height + 'px',
                      width: width + 'px',
                      location: 'main content',
                      hasAdSlot: adElement.hasAttribute('data-ad-slot')
                    });
                  }
                }, 1000);
              } else {
                // サイドレーン以外の一般的な場所での高さ制限（自動広告のみ）
                adElement.style.maxHeight = '600px';
                adElement.style.overflow = 'hidden';

                // 異常に高い自動広告を検出・制限
                setTimeout(() => {
                  const height = adElement.offsetHeight;
                  if (height > 800) {
                    adElement.style.height = '400px';
                    adElement.style.maxHeight = '400px';
                    console.warn('異常に高い自動広告を制限しました:', height, 'px → 400px');
                  }
                }, 1000);
              }
            }
          }
        });
      });
    });

    adObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 既存の広告もチェック（初期化時）
    setTimeout(() => {
      const existingAds = document.querySelectorAll('ins[class*="adsbygoogle"], .google-auto-placed');
      existingAds.forEach(adElement => {
        // 明示ホワイトリスト: アンカー/サイドレールの自動広告は常に許可
        try {
          const isAutoAd = adElement.classList && adElement.classList.contains('google-auto-placed');
          if (isAutoAd) {
            const cs = window.getComputedStyle(adElement);
            const posFixed = cs && cs.position === 'fixed';
            const right = cs && cs.right && cs.right !== 'auto' ? parseInt(cs.right, 10) : 9999;
            const left = cs && cs.left && cs.left !== 'auto' ? parseInt(cs.left, 10) : 9999;
            const nearEdge = posFixed && (right <= 48 || left <= 48);
            const reasonableSiderail = posFixed && nearEdge && (adElement.offsetHeight > 80) && (adElement.offsetWidth <= 400);
            const anchorStatus = adElement.getAttribute && adElement.getAttribute('data-anchor-status');
            if (reasonableSiderail || (anchorStatus && anchorStatus !== 'none')) {
              return; // この広告には一切の制限を適用しない
            }
          }
        } catch(_) { /* no-op */ }

        // 設置型広告（data-ad-slot属性付き）は制限対象外
        if (adElement.hasAttribute && adElement.hasAttribute('data-ad-slot')) {
          if (DEBUG) console.log('[ads-consent-loader] 既存の設置型広告を検出、制限をスキップ');
          return;
        }

        // 保護されたエリア内の自動広告は削除（設置型広告は除外）
        const parentProtected = adElement.closest('[data-no-dynamic-ads], .skill-section, .gate-section');
        if (parentProtected && !adElement.hasAttribute('data-ad-slot')) {
          adElement.remove();
          return;
        }

        // サイドレーン判定
        const isInSidebar = adElement.closest('aside, .sidebar, .side-panel, [class*="sidebar"], [class*="side"]');
        if (isInSidebar) return;

        // メインコンテンツエリア判定（自動広告のみ対象）
        const isInMainContent = adElement.closest('main, .main-content, section.card, .content-section, .top-layout') &&
                              !adElement.closest('.ad-block, aside');

        if (isInMainContent) {
          const height = adElement.offsetHeight;
          const width = adElement.offsetWidth;
          const isTallAd = height > 200 || (height > width * 1.5);

          if (isTallAd) {
            adElement.remove();
            console.warn('初期化時にメインコンテンツ内の縦長自動広告を削除:', {
              height: height + 'px',
              width: width + 'px',
              hasAdSlot: adElement.hasAttribute('data-ad-slot')
            });
          }
        }
      });
    }, 2000); // 2秒後に既存広告をチェック

    // 広告ブロック要素の状態を監視する関数
    function watchAdBlock(block){
      if(!block) return;
      // 子要素（例: ins.adsbygoogle や .rakuten-widget-placeholder）が直接渡ってきた場合は、親のラッパー要素に昇格させる
      if (block.matches && (block.matches('ins.adsbygoogle') || block.matches('.rakuten-widget-placeholder'))) {
        var parentWrap = block.closest('.ad-block, .dynamic-ad-container, aside[aria-label*="広告"], aside[aria-label*="スポンサー"]');
        if (parentWrap) block = parentWrap; else return; // ラッパーが無ければ監視しない
      }

      // 初期状態では非表示フラグを付けない（広告読み込み前に枠が消えるのを防止）
      // 実際に「空」と判定された場合のみ data-ad-empty="true" を付与する

      var ins = block.querySelector('ins.adsbygoogle');
      var rak = block.querySelector('.rakuten-widget-placeholder');
      if(!ins && !rak) return;

      var filled = false;
      var checkTimeout = null;

      function markFilled(){
        if(filled) return;
        filled = true;
        block.setAttribute('data-ad-empty','false');
        if (DEBUG) console.log('[ads-consent-loader] ad filled:', block);
      }

      // AdSense: MutationObserver で検知
      if(ins){
        var obsAds = new MutationObserver(function(){
          if(filled) return;
          clearTimeout(checkTimeout);
          checkTimeout = setTimeout(function(){
            var hasContent = ins.querySelector('iframe') ||
                             ins.querySelector('[data-adsbygoogle-status]') ||
                             ins.offsetHeight > 50 ||
                             ins.childNodes.length > 0;
            if(hasContent) markFilled();
          }, 300);
        });
        obsAds.observe(ins, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-adsbygoogle-status','style'] });
        // 5秒フォールバック
        setTimeout(function(){ if(!filled){ var hc = ins.querySelector('iframe') || ins.querySelector('[data-adsbygoogle-status]') || ins.offsetHeight > 50; if(hc) markFilled(); else { try { block.setAttribute('data-ad-empty','true'); } catch(_){} } } }, 5000);
      }

      // Rakuten: data-loaded or iframe出現で検知
      if(rak){
        var obsRak = new MutationObserver(function(){
          if(filled) return;
          clearTimeout(checkTimeout);
          checkTimeout = setTimeout(function(){
            var loaded = rak.getAttribute('data-loaded') === '1';
            var hasIframe = !!rak.querySelector('iframe');
            if(loaded || hasIframe) markFilled();
          }, 300);
        });
        obsRak.observe(rak, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-loaded','style'] });
        // 7秒フォールバック
        setTimeout(function(){ if(!filled){ var loaded = rak.getAttribute('data-loaded')==='1'; var hasIframe = !!rak.querySelector('iframe'); if(loaded || hasIframe) markFilled(); else { try { block.setAttribute('data-ad-empty','true'); } catch(_){} } } }, 7000);
      }
    }

    // 全ての広告ブロックを監視対象に追加
    function monitorAllAdBlocks(){
      // ラッパー要素のみに限定（子の ins.ad-pc/ad-sp などは除外）
      document.querySelectorAll('.ad-block, .dynamic-ad-container, aside[aria-label*="広告"], aside[aria-label*="スポンサー"]').forEach(watchAdBlock);
    }

    // 初期監視設定
    monitorAllAdBlocks();

    // 新しく追加される広告ブロックも監視（動的コンテンツ対応）
    var mainObserver = new MutationObserver(function(mutations){
      mutations.forEach(function(mutation){
        mutation.addedNodes.forEach(function(node){
          if(node.nodeType === 1) { // Element node
            // 監視対象はラッパー要素のみに限定
            if(node.matches && node.matches('.ad-block, .dynamic-ad-container, aside[aria-label*="広告"], aside[aria-label*="スポンサー"]')) {
              watchAdBlock(node);
            }
            // 子要素もチェック
            var adBlocks = node.querySelectorAll && node.querySelectorAll('.ad-block, .dynamic-ad-container, aside[aria-label*="広告"], aside[aria-label*="スポンサー"]');
            if(adBlocks) adBlocks.forEach(watchAdBlock);
          }
        });
      });
    });

    mainObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function dispatchConsentAccepted(){
    try {
      document.dispatchEvent(new Event('cookieConsentAccepted'));
    } catch (e) {
      var evtLegacy = document.createEvent('Event');
      evtLegacy.initEvent('cookieConsentAccepted', true, true);
      document.dispatchEvent(evtLegacy);
    }
  }

  function acceptConsent(banner){
    try { localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted'); } catch(_) {}
    CONSENT_OK = true;
    syncConsentState();
    if (banner) {
      banner.classList.add('hidden');
      banner.style.display = 'none';
    }
    dispatchConsentAccepted();
  }

  function injectConsentBanner(){
    var banner = document.getElementById('consent-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'consent-banner';
      banner.className = 'hidden';
      banner.setAttribute('role', 'alertdialog');
      banner.setAttribute('aria-modal', 'true');
      banner.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:12px;align-items:center;justify-content:space-between;box-sizing:border-box;width:100%;padding:12px 16px;background:#fff;border-top:1px solid rgba(74,222,128,.45);box-shadow:0 -8px 24px rgba(15,23,42,.12);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';
      banner.innerHTML = '<span style="font-size:13px;line-height:1.7;color:#374151;">広告・アクセス解析はCookie等を利用します。詳細は <a href="/privacy-policy.html" style="color:#16a34a;text-decoration:underline;">プライバシーポリシー</a> をご確認ください。</span><button id="consent-accept" type="button" data-consent-accept="1" style="flex:0 0 auto;border:0;border-radius:6px;background:#22c55e;color:#fff;font-weight:700;padding:7px 14px;cursor:pointer;">OK</button>';
      document.body.appendChild(banner);
    }
    var accept = document.getElementById('consent-accept') || banner.querySelector('[data-consent-accept]');
    if (CONSENT_OK) {
      banner.classList.add('hidden');
      banner.style.display = 'none';
      return;
    }
    banner.classList.remove('hidden');
    banner.style.display = 'flex';
    if (accept && accept.getAttribute('data-consent-bound') !== '1') {
      accept.setAttribute('data-consent-bound', '1');
      accept.addEventListener('click', function(){ acceptConsent(banner); });
    }
  }

  function startRuntimeAfterConsent(){
    if (window.__adsConsentRuntimeStarted || !ENV_OK || !CONSENT_OK) return;
    window.__adsConsentRuntimeStarted = true;
    var hasAdSlot = !!document.querySelector('ins.adsbygoogle');
    scheduleGALoad();
    if (hasAdSlot && !ADS_DISABLED) {
      initAds();
      if(document.querySelector('[data-wiki-content="true"]')){
        setTimeout(initAdvancedAdMonitoring, 600);
      }
    }
    else if (!ADS_DISABLED) startAdSlotObserver();
    ensureBaseAdCSS();
    if (!DYNAMIC_ADS_DISABLED) setTimeout(maybeInsertDynamicAds, 500);
    try {
      window.__pageTextLen = (document.body.innerText||'').length;
      window.__dynamicAdCap = computeAdaptiveCap();
      if(DEBUG) console.log('[ads-consent-loader] adaptive ad cap', window.__dynamicAdCap, 'textLen', window.__pageTextLen);
    } catch(_){ }
    initRakutenLazy();
  }

  document.addEventListener('DOMContentLoaded', function(){
    // 防御的サニタイズ: 誤って main/section/body に hidden が残っていた場合は削除する
    try {
      ['body','main','section'].forEach(function(sel){
        document.querySelectorAll(sel+'[hidden]').forEach(function(el){ el.removeAttribute('hidden'); });
      });
    } catch(_) {}
    injectConsentBanner();
    // Lightweight heuristic: if there is at least one ad slot, we consider initializing ads when allowed
    var hasAdSlot = !!document.querySelector('ins.adsbygoogle');

    // モバイル検出の強化
    var isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.setAttribute('data-mobile-device', 'true');
      if (DEBUG) console.log('[ads-consent-loader] mobile device detected, dynamic ads will be disabled');
    }

    // デバッグ情報の表示
    if (DEBUG) {
      document.body.setAttribute('data-ads-debug', 'true');
      console.log('[ads-consent-loader] debug mode enabled');
      console.log('[ads-consent-loader] mobile device:', isMobile);
      console.log('[ads-consent-loader] has ad slots:', hasAdSlot);
      console.log('[ads-consent-loader] wiki content:', !!document.querySelector('[data-wiki-content="true"]'));
    }

    if (CONSENT_OK) {
      startRuntimeAfterConsent();
    } else if (ENV_OK) {
      document.addEventListener('cookieConsentAccepted', function(){
        CONSENT_OK = true;
        startRuntimeAfterConsent();
      }, { once: true });
    }
  });
})();
