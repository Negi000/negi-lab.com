(function(){
  // Simple consent + environment gated loader for GA & AdSense
  // Allow production domain + localhost for development preview.
  var host = (typeof location !== 'undefined') ? location.hostname : '';
  // Allow primary domain + related wiki domains + localhost
  var ENV_OK = /(^|\.)negi-lab\.com$/i.test(host)
    || /(^|\.)gamewiki\.jp$/i.test(host)
    || /^(localhost|127\.0\.0\.1)$/.test(host);
  // Manual override: add ?forceAds=1 to URL to force enable in any environment (for quick design QA)
  try {
    if(!ENV_OK && /[?&]forceAds=1/.test(location.search)) {
      ENV_OK = true; host += ' (forced)';
    }
  } catch(_){}
  // 収益最適化：同意を常にtrueに設定してバナー表示を回避
  var CONSENT_OK = true;

  // Don't run on 404 or noindex pages
  var isNoIndex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
  if (isNoIndex) return;
  // Optional per-page disable flag for ads (GAは有効のまま)
  var ADS_DISABLED = (document.documentElement && document.documentElement.hasAttribute('data-ads-disabled')) || !!document.querySelector('meta[name="ads"][content="off"]');
  // Per-page flag to disable dynamic auto insertion while keeping static slots
  var DYNAMIC_ADS_DISABLED = (document.documentElement && document.documentElement.hasAttribute('data-no-dynamic-ads'))
    || !!document.querySelector('meta[name="ads-dynamic"][content="off"]');
  var DEBUG = true; // デバッグ情報を有効化 try { DEBUG = localStorage.getItem('adsDebug') === '1'; } catch(_) {}
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
        // Flush queued events
        if (GA_EVENT_QUEUE.length){
          GA_EVENT_QUEUE.forEach(function(item){ try { gtag('event', item.event, item.params || {}); } catch(_e){} });
          GA_EVENT_QUEUE.length = 0;
        }
  if (DEBUG) console.log('[ads-consent-loader] GA ready');
      })
      .catch(function(e){ console.warn('GA load failed', e); });
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
      }, { root: null, rootMargin: '300px 0px 300px 0px', threshold: 0.01 }); // マージン120px→300px、閾値0.1→0.01に緩和
    }
    var lazySlots = document.querySelectorAll('ins.adsbygoogle[data-ad-lazy="1"]:not([data-ads-pushed="1"])');
    for (var k=0;k<lazySlots.length;k++) {
      // If already in viewport, push now, else observe
      if (isElementInViewport(lazySlots[k])) pushAdSlot(lazySlots[k]);
      else window.__lazyAdObserver.observe(lazySlots[k]);
    }
  }

  // Ad cap logic - 収益最適化：上限を大幅に緩和
  var currentAdPushCount = 0;
  function getAdCap(){
    var w = (window.innerWidth || 1024);
    return w < 768 ? 8 : 12; // mobile: 3→8, desktop: 4→12に増加
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
    
    // モバイルデバイスでは自動広告を無効化
    var isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
      var wrapper = document.createElement('aside');
      wrapper.className = 'max-w-3xl mx-auto my-10 dynamic-ad-container';
      wrapper.setAttribute('aria-label','スポンサー広告');
      wrapper.setAttribute('data-dynamic-ad', 'true');
      wrapper.setAttribute('data-main-content-ad', 'true'); // メインコンテンツ内広告マーク
      var label = document.createElement('div');
      label.className = 'text-xs text-gray-400 mb-1';
      label.textContent = 'スポンサーリンク';
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.minHeight = '100px'; // 250px→100pxに縮小
      ins.style.maxHeight = '200px'; // 最大高さ200px制限
      ins.style.height = '200px'; // 固定高さで縦長防止
      ins.style.overflow = 'hidden'; // はみ出し防止
      ins.setAttribute('data-ad-client','ca-pub-1835873052239386');
      ins.setAttribute('data-ad-format','rectangle'); // auto→rectangleに変更（縦長防止）
      ins.setAttribute('data-ad-layout',''); // レスポンシブレイアウト無効化
      ins.setAttribute('data-full-width-responsive','true');
      ins.setAttribute('data-ad-lazy','1');
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
      
      var slots = ['7843001775','9898319477','4837564489'];
      var slot = slots[inserted % slots.length];
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
                // メインコンテンツ内での縦長自動広告を検出・削除
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
      
      // 初期状態：広告未表示として設定
      block.setAttribute('data-ad-empty','true');
      var section = block.closest('.section, .card, .col');
      if(section) section.setAttribute('data-ad-empty','true');
      
      var ins = block.querySelector('ins.adsbygoogle');
      if(!ins) return;
      
      var filled = false;
      var checkTimeout = null;
      
      // MutationObserverで広告の動的な変化を監視
      var obs = new MutationObserver(function(mutations){
        if(filled) return;
        
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(function(){
          // より厳密な広告表示チェック
          var hasContent = ins.querySelector('iframe') || 
                          ins.querySelector('[data-adsbygoogle-status]') ||
                          ins.offsetHeight > 50 ||
                          ins.childNodes.length > 0;
          
          if(hasContent) {
            filled = true;
            block.setAttribute('data-ad-empty','false');
            if(section) section.setAttribute('data-ad-empty','false');
            obs.disconnect();
            if (DEBUG) console.log('[ads-consent-loader] ad filled:', block);
          }
        }, 300);
      });
      
      // 広告要素とその子要素の変化を監視
      obs.observe(ins, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-adsbygoogle-status', 'style']
      });
      
      // フォールバック：5秒後にもう一度チェック
      setTimeout(function(){
        if(!filled) {
          var hasContent = ins.querySelector('iframe') || 
                          ins.querySelector('[data-adsbygoogle-status]') ||
                          ins.offsetHeight > 50;
          if(hasContent) {
            filled = true;
            block.setAttribute('data-ad-empty','false');
            if(section) section.setAttribute('data-ad-empty','false');
            obs.disconnect();
          }
        }
      }, 5000);
    }
    
    // 全ての広告ブロックを監視対象に追加
    function monitorAllAdBlocks(){
      document.querySelectorAll('.ad-block, .dynamic-ad-container, [class*="ad-"], aside[aria-label*="広告"], aside[aria-label*="スポンサー"]').forEach(watchAdBlock);
    }
    
    // 初期監視設定
    monitorAllAdBlocks();
    
    // 新しく追加される広告ブロックも監視（動的コンテンツ対応）
    var mainObserver = new MutationObserver(function(mutations){
      mutations.forEach(function(mutation){
        mutation.addedNodes.forEach(function(node){
          if(node.nodeType === 1) { // Element node
            if(node.matches && node.matches('.ad-block, .dynamic-ad-container, [class*="ad-"], aside[aria-label*="広告"], aside[aria-label*="スポンサー"]')) {
              watchAdBlock(node);
            }
            // 子要素もチェック
            var adBlocks = node.querySelectorAll && node.querySelectorAll('.ad-block, .dynamic-ad-container, [class*="ad-"], aside[aria-label*="広告"], aside[aria-label*="スポンサー"]');
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

  // Cookieバナー機能を完全に無効化（収益最適化のため）
  function injectConsentBanner(){
    // バナー表示を無効化
    return;
  }

  document.addEventListener('DOMContentLoaded', function(){
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

    // 収益最優先：環境チェックのみで広告を常時有効化
    if (ENV_OK) {
      initGA();
      if (hasAdSlot && !ADS_DISABLED) {
        initAds();
        // Wiki専用の高度な広告監視を初期化
        setTimeout(initAdvancedAdMonitoring, 1000);
      }
      else if (!ADS_DISABLED) startAdSlotObserver();
      ensureBaseAdCSS();
      if (!DYNAMIC_ADS_DISABLED) setTimeout(maybeInsertDynamicAds, 500); // 1500ms→500msに短縮
    }
  });
})();
