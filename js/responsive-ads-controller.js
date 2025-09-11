/**
 * Responsive Ads Controller
 * PC/モバイル環境に応じて適切な広告のみを表示する制御システム
 * 2025-01-11 作成
 */
(function() {
  'use strict';

  // 広告スロット設定
  const AD_SLOTS = {
    // スマホ用広告スロット
    mobile: {
      bottom: '8916646342',
      middle: '3205934910', 
      top: '6430083800'
    },
    // PC用広告スロット
    pc: {
      middle: '9898319477',
      bottom: '7843001775',
      top: '4837564489'
    }
  };

  // 広告クライアントID（統一）
  const AD_CLIENT = 'ca-pub-1835873052239386';

  /**
   * デバイス判定
   * @returns {boolean} モバイルデバイスの場合true
   */
  function isMobileDevice() {
    const userAgent = navigator.userAgent || '';
    const screenWidth = window.innerWidth || screen.width || 1024;
    
    // ユーザーエージェントベースの判定
    const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // 画面幅ベースの判定（768px以下をモバイル）
    const mobileWidth = screenWidth <= 768;
    
    // どちらかの条件を満たせばモバイル
    return mobileUA || mobileWidth;
  }

  /**
   * 不要な広告要素を非表示にし、適切な広告を表示
   */
  function setupResponsiveAds() {
    const isMobile = isMobileDevice();
    const targetClass = isMobile ? 'ad-pc' : 'ad-sp';
    const activeClass = isMobile ? 'ad-sp' : 'ad-pc';
    
    console.log(`[ResponsiveAds] Device detected: ${isMobile ? 'Mobile' : 'PC'}`);
    
    // 対象外のデバイス用広告を完全に削除
    const elementsToRemove = document.querySelectorAll(`.${targetClass}`);
    elementsToRemove.forEach(element => {
      element.remove();
      console.log(`[ResponsiveAds] Removed ${targetClass} ad element`);
    });

    // アクティブな広告要素を更新（クライアントIDが古い場合の対応）
    const activeAds = document.querySelectorAll(`.${activeClass}`);
    activeAds.forEach(element => {
      // クライアントIDを統一されたものに更新
      if (element.getAttribute('data-ad-client') !== AD_CLIENT) {
        element.setAttribute('data-ad-client', AD_CLIENT);
        console.log(`[ResponsiveAds] Updated ad client for ${activeClass}`);
      }
      
      // デバイス識別用の属性を追加
      element.setAttribute('data-device-type', isMobile ? 'mobile' : 'pc');
      element.style.display = 'block';
    });

    // document.bodyにデバイスタイプを設定（CSS用）
    document.body.setAttribute('data-device-type', isMobile ? 'mobile' : 'pc');
    document.body.setAttribute('data-screen-width', window.innerWidth);
  }

  /**
   * 動的に広告を作成する関数
   * @param {string} position - 'top', 'middle', 'bottom'
   * @param {boolean} lazy - 遅延読み込みするかどうか
   * @returns {HTMLElement} 作成された広告要素
   */
  function createAdElement(position, lazy = true) {
    const isMobile = isMobileDevice();
    const slots = isMobile ? AD_SLOTS.mobile : AD_SLOTS.pc;
    const slotId = slots[position];
    
    if (!slotId) {
      console.warn(`[ResponsiveAds] No slot ID found for position: ${position}`);
      return null;
    }

    // ins要素を作成
    const ins = document.createElement('ins');
    ins.className = `adsbygoogle ${isMobile ? 'ad-sp' : 'ad-pc'}`;
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', AD_CLIENT);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    ins.setAttribute('data-device-type', isMobile ? 'mobile' : 'pc');
    
    if (lazy) {
      ins.setAttribute('data-ad-lazy', '1');
    }

    console.log(`[ResponsiveAds] Created ${isMobile ? 'mobile' : 'PC'} ad for ${position}: ${slotId}`);
    
    return ins;
  }

  /**
   * 広告ブロック内の重複広告を修正
   */
  function fixDuplicateAds() {
    const adBlocks = document.querySelectorAll('.ad-block');
    
    adBlocks.forEach(block => {
      const ads = block.querySelectorAll('ins.adsbygoogle');
      
      if (ads.length > 1) {
        console.log(`[ResponsiveAds] Found ${ads.length} ads in block, fixing...`);
        
        const isMobile = isMobileDevice();
        
        // 現在のデバイスに適さない広告を削除
        ads.forEach(ad => {
          const isPcAd = ad.classList.contains('ad-pc');
          const isMobileAd = ad.classList.contains('ad-sp');
          
          if ((isMobile && isPcAd) || (!isMobile && isMobileAd)) {
            ad.remove();
            console.log(`[ResponsiveAds] Removed inappropriate ad from block`);
          }
        });
      }
    });
  }

  /**
   * 画面サイズ変更時の再調整
   */
  function handleResize() {
    // デバウンス処理
    clearTimeout(window.responsiveAdsTimeout);
    window.responsiveAdsTimeout = setTimeout(() => {
      console.log('[ResponsiveAds] Screen resized, rechecking...');
      setupResponsiveAds();
      fixDuplicateAds();
    }, 300);
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[ResponsiveAds] Initializing responsive ads controller...');
    
    // 初期設定
    setupResponsiveAds();
    fixDuplicateAds();
    
    // リサイズイベントリスナーを追加
    window.addEventListener('resize', handleResize, { passive: true });
    
    // オリエンテーション変更対応（モバイル）
    if ('orientation' in window) {
      window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
      });
    }
    
    console.log('[ResponsiveAds] Initialization complete');
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 外部からアクセス可能なAPIを提供
  window.ResponsiveAds = {
    createAdElement: createAdElement,
    isMobileDevice: isMobileDevice,
    fixDuplicateAds: fixDuplicateAds,
    AD_SLOTS: AD_SLOTS,
    AD_CLIENT: AD_CLIENT
  };

})();
