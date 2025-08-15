(function(){
  // Simple consent + environment gated loader for GA & AdSense
  var ENV_OK = typeof location !== 'undefined' && /(^|\.)negi-lab\.com$/i.test(location.hostname);
  var CONSENT_OK = false;
  try { CONSENT_OK = localStorage.getItem('cookieConsent') === 'accepted'; } catch(_) {}

  // Don't run on 404 or noindex pages
  var isNoIndex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
  if (isNoIndex) return;

  function loadScript(src, attrs){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');
      s.src=src; s.async=true; if(attrs){Object.keys(attrs).forEach(function(k){s.setAttribute(k, attrs[k]);});}
      s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
    });
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
      })
      .catch(function(e){ console.warn('GA load failed', e); });
  }

  function initAds(){
    if (window.__adsLoaded) return;
    window.__adsLoaded = true;
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1835873052239386', { crossorigin: 'anonymous' })
      .then(function(){
        try {
          var slots = document.querySelectorAll('ins.adsbygoogle');
          for (var i=0; i<slots.length; i++) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch(e){ console.warn('Ads push failed', e); }
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
      span.textContent = text;
      span.style.fontSize = '12px';
      span.style.color = '#374151';
      span.style.lineHeight = '1.4';
      span.style.flex = '1 1 auto';

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

      banner.appendChild(span);
      banner.appendChild(btn);
      document.body.appendChild(banner);
    } catch(e){ /* no-op */ }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Lightweight heuristic: if there is at least one ad slot, we consider initializing ads when allowed
    var hasAdSlot = !!document.querySelector('ins.adsbygoogle');

    if (ENV_OK && CONSENT_OK) {
      initGA();
      if (hasAdSlot) initAds();
    } else {
      // Provide a minimal consent UI if running on production and not on noindex pages
      if (ENV_OK && !isNoIndex && !CONSENT_OK) {
        injectConsentBanner();
      }
      // If consent arrives later, listen for acceptance and then init
      document.addEventListener('cookieConsentAccepted', function(){
        if (ENV_OK) {
          initGA();
          if (hasAdSlot) initAds();
        }
      }, { once: true });
    }
  });
})();
