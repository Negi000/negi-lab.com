/* wiki-side-lane.js  v1
 * 全Wikiページ共通のサイドレーン (誕生日 / イベント / 応援) を動的挿入
 * 使い方: <script src="/gamewiki/FellowMoon/js/wiki-side-lane.js" defer></script>
 * (ルートからの相対パスは環境に合わせて変更)
 */
(function(){
  if(window.__FM_SIDELANE_LOADED){ return; }
  window.__FM_SIDELANE_LOADED = true;
  const __SL_QP = new URLSearchParams(location.search);
  // ===== パス検出 =====
  function computePaths(){
    const href = location.href.replace(/\\/g,'/');
    const marker = 'gamewiki/FellowMoon/';
    const idx = href.indexOf(marker);
    if(idx>=0){
      const root = href.substring(0, idx + marker.length); // 末尾含む
      return {
        root,               // .../gamewiki/FellowMoon/
        site: root + 'site/',
        assets: root + 'site/assets/left_side_lane/',
        birthdayDir: root + 'site/assets/left_side_lane/誕生日/'
      };
    }
    return { root:'', site:'site/', assets:'site/assets/left_side_lane/', birthdayDir:'site/assets/left_side_lane/誕生日/' };
  }
  window.__FM_PATHS = window.__FM_PATHS || computePaths();
  const PATHS = window.__FM_PATHS;

  // ===== CSS 挿入 (既存テンプレCSSと同等の必要最低限) =====
  if(!document.getElementById('fm-sidelane-css')){
  const css = `/* injected side-lane (enhanced styling & scrollbar theme) */
/* --- Added v1.1: base style for mobile toggle outside media query as fallback (in case media query CSS fails to load) --- */
.side-lane-toggle{position:fixed;bottom:16px;left:16px;z-index:1300;width:54px;height:54px;border-radius:16px;background:linear-gradient(140deg,#172531,#1f3644);border:1px solid #2c4656;display:flex;align-items:center;justify-content:center;color:#cfe2ff;font-size:1.35rem;box-shadow:0 6px 18px -6px #000c,0 0 0 1px #2e4b5d80;cursor:pointer}
.side-lane-toggle[aria-expanded=true]{background:#2b4657;color:#fff;box-shadow:0 0 0 1px #3a8bff88,0 8px 26px -6px #000c}
@media(min-width:1180px){.side-lane-toggle{display:none!important}}
.wiki-side-lane{display:none}
@media(min-width:1180px){.wiki-side-lane{position:fixed;z-index:40;top:70px;left:12px;width:280px;display:flex;flex-direction:column;gap:1rem;max-height:calc(100vh - 80px);overflow:auto;padding:4px 4px 20px;scrollbar-width:thin;scrollbar-color:#31556a #142029}}
.birthday-list-original-note{display:none}
/* 誕生日セクションを旧レイアウト寄せに微調整 */
#sideBirthdays .birthday-list li{padding:.6rem .6rem .6rem .6rem;border-radius:8px;gap:2px;min-height:74px}
#sideBirthdays .birthday-list li .thumb-row{align-items:flex-start}
#sideBirthdays .birthday-thumb{width:64px;height:64px;border-radius:14px}
#sideBirthdays .birthday-thumb img{object-fit:cover}
#sideBirthdays .birthday-list li .thumb-row>div:nth-child(2){padding-left:.15rem}
#sideBirthdays .birthday-list li time{display:inline-block;margin-top:2px;font-size:.55rem;letter-spacing:.5px;color:#c2d9e8}
#sideBirthdays .next-birthdays{margin-top:.55rem;padding-top:.5rem}
#sideBirthdays .birthday-list li:hover{background:#20313c}
/* scrollbar (webkit) */
.wiki-side-lane::-webkit-scrollbar{width:10px}
.wiki-side-lane::-webkit-scrollbar-track{background:#142029;border-radius:10px}
.wiki-side-lane::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#2a4454,#325f73);border:2px solid #142029;border-radius:10px;box-shadow:0 0 0 1px #28506a66 inset}
.wiki-side-lane::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#33596c,#3e6f85)}
.side-box{background:#162129;border:1px solid #253541;border-radius:14px;padding:.85rem .9rem .9rem;box-shadow:0 4px 10px -4px #0009;position:relative;transition:.25s}
.side-box h3{margin:.1rem 0 .55rem;font-size:.75rem;letter-spacing:.55px;font-weight:700;color:#b8d9ff;display:flex;align-items:center;gap:.4rem;position:relative;padding-right:30px;cursor:pointer}
.side-box h3:hover{color:#d2ecff}
.side-box h3 button.sl-collapse-btn{position:absolute;top:50%;right:4px;transform:translateY(-50%);width:22px;height:22px;border:1px solid #2d4a5b;background:linear-gradient(140deg,#1c2d38,#18252e);border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ec5ff;font-size:.7rem;font-weight:700;padding:0;line-height:1;transition:.25s}
.side-box h3 button.sl-collapse-btn:hover{background:#234150;color:#fff}
.side-box h3 button.sl-collapse-btn:before{content:'−';}
.side-box.collapsed h3 button.sl-collapse-btn:before{content:'+';}
.side-box.collapsed{padding-bottom:.55rem}
.side-box.collapsed > :not(h3){display:none !important}
.side-box h3 button.sl-collapse-btn:focus-visible{outline:2px solid #3a8bff;outline-offset:2px}
.side-box h3 .icon{width:22px;height:22px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#274054,#172630);border:1px solid #2b4658;border-radius:8px;box-shadow:0 0 0 1px #2d4a5b80,0 4px 10px -4px #000c;padding:3px}
.birthday-list,.event-timer-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.45rem}
.birthday-list li,.event-timer-list li{font-size:.68rem;line-height:1.35;background:#1c2a34;border:1px solid #284152;border-radius:9px;padding:.5rem .55rem .5rem .55rem;display:flex;flex-direction:column;gap:4px;position:relative;transition:.25s}
.birthday-list li.today{border-color:#3a8bff;background:#203344}
.birthday-list li:hover{background:#223340}
.birthday-list a{color:#afe1ff;text-decoration:none;font-weight:600}
.birthday-empty,.event-empty{font-size:.6rem;color:#678;padding:.2rem 0}
.next-birthdays{margin-top:.6rem;padding-top:.55rem;border-top:1px solid #233542}
.next-birthdays h4{margin:0 0 .45rem;font-size:.58rem;letter-spacing:.55px;color:#9ec5ff;font-weight:700;display:flex;align-items:center;gap:.35rem}
.next-birthdays h4:before{content:"";width:14px;height:14px;border-radius:5px;background:linear-gradient(140deg,#27495c,#1d3442);border:1px solid #32586d;box-shadow:0 0 0 1px #2d4f6680 inset}
.next-birthdays ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.next-birthdays ul li{display:flex;align-items:center;justify-content:space-between;padding:4px 6px 4px 8px;background:#1a2d37;border:1px solid #254152;border-radius:7px;font-size:.6rem;line-height:1.35;letter-spacing:.4px;position:relative;overflow:hidden}
.next-birthdays ul li:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,#274454,#1b2d37);opacity:.6;pointer-events:none}
.next-birthdays ul li span.date{font-family:ui-monospace,monospace;font-weight:600;color:#ffd59a;font-size:.62rem;letter-spacing:.5px;text-shadow:0 0 4px #ffb86455}
.next-birthdays ul li span:first-child{color:#d2ecff;font-weight:600}
.birthday-list li .thumb-row{display:flex;align-items:center;gap:.55rem}
.birthday-thumb{width:46px;height:46px;border-radius:12px;overflow:hidden;flex:0 0 auto;background:linear-gradient(160deg,#223642,#17262f);border:1px solid #2c4a5a;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1px #2b495980,0 4px 10px -5px #000c}
.birthday-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.event-timer-list li strong{font-weight:600;color:#d2ecff}
.timer-remaining{font-family:ui-monospace,monospace;font-size:.65rem;color:#9fe1b7;letter-spacing:.5px}
.timer-ended{color:#f59f9f;font-size:.6rem;font-weight:600}
/* birthday effects */
.birthday-message{position:absolute;top:2px;left:8px;right:8px;z-index:1000;text-align:center;pointer-events:none;animation:birthdayMessageFade 8s ease-in-out}
.birthday-text{font-size:1.18rem;font-weight:800;color:#fff;text-shadow:0 0 16px rgba(255,200,120,.7),0 0 30px rgba(255,200,120,.5);margin:0 auto .4rem;white-space:nowrap;position:relative}
.birthday-text span{display:inline-block;will-change:transform}
.birthday-sparkles{display:flex;justify-content:center;gap:.65rem;margin-top:.25rem}
.birthday-sparkles span{font-size:1.3rem;animation:sparkleFloat 3s ease-in-out infinite;opacity:.9}
.birthday-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:9}
.birthday-confetti span{position:absolute;top:-12%;left:0;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:600;opacity:0;animation:birthdayConfettiFall 9s linear infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}
.birthday-confetti span.emoji{font-size:1.25rem;background:transparent!important}
@keyframes birthdayConfettiFall{0%{top:-12%;opacity:0;transform:translateX(0) rotate(0deg) scale(var(--scale,1))}8%{opacity:1}60%{transform:translateX(calc(var(--driftX,0px)*0.6)) rotate(calc(var(--rot,720deg)*0.6)) scale(var(--scale,1))}100%{top:110%;opacity:0;transform:translateX(var(--driftX,0px)) rotate(var(--rot,720deg)) scale(var(--scale,1))}}
@keyframes birthdayMessageFade{0%,10%{opacity:0;transform:scale(.85)}15%,85%{opacity:1;transform:scale(1)}90%,100%{opacity:0;transform:scale(1.1)}}
@keyframes sparkleFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(180deg)}}
.birthday-list li .birthday-bubble{position:absolute;top:-12px;right:-8px;width:38px;height:38px;animation:bubbleBlink 1s ease-in-out infinite;filter:drop-shadow(0 0 4px rgba(255,200,120,.7))}
@keyframes bubbleBlink{0%,60%{opacity:1;transform:scale(1)}70%{opacity:.35;transform:scale(.85)}100%{opacity:1;transform:scale(1)}}
/* replay button */
.birthday-replay-btn{position:absolute;right:6px;bottom:6px;width:28px;height:28px;background:linear-gradient(140deg,#1d2e39,#233d4b);border:1px solid #34576b;border-radius:8px;color:#ffce7d;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.25s;box-shadow:0 2px 6px -2px #000c}
.birthday-replay-btn:hover{background:#2c4a5c;color:#ffe3b5}
.birthday-replay-btn:active{transform:translateY(1px)}
body.birthday-day #sideBirthdays{background:linear-gradient(150deg,#1c2f3b,#214254 68%,#1c2f3b);box-shadow:0 0 0 1px #4ca9ff55,0 0 0 3px #ffa94d22,0 6px 20px -6px #000c;position:relative}
body.birthday-day #sideBirthdays:before{content:"";position:absolute;inset:0;border-radius:14px;padding:1px;background:linear-gradient(120deg,#ffcf7d,#6fbfff,#ffcf7d);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.4;animation:birthGlow 6s linear infinite}
@keyframes birthGlow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
/* mobile panel */
@media(max-width:1179px){.wiki-side-lane{position:fixed;top:56px;left:0;width:85%;max-width:360px;background:#111b23f2;border-right:1px solid #243541;backdrop-filter:blur(6px);padding:1rem .9rem 110px 1rem;display:flex;flex-direction:column;gap:.95rem;transform:translateX(-105%);transition:transform .35s cubic-bezier(.4,.0,.2,1);height:calc(100vh - 56px);overflow:auto;z-index:1200;box-shadow:0 10px 32px -8px #000c,0 0 0 1px #24354180;border-top-right-radius:18px;border-bottom-right-radius:18px;scrollbar-width:thin;scrollbar-color:#31556a #111b23}.wiki-side-lane::-webkit-scrollbar{width:10px}.wiki-side-lane::-webkit-scrollbar-track{background:#111b23}.wiki-side-lane::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#2a4454,#325f73);border:2px solid #111b23;border-radius:10px}.wiki-side-lane.open{transform:translateX(0)}.side-lane-toggle{position:fixed;bottom:16px;left:16px;z-index:1300;width:54px;height:54px;border-radius:16px;background:linear-gradient(140deg,#172531,#1f3644);border:1px solid #2c4656;display:flex;align-items:center;justify-content:center;color:#cfe2ff;font-size:1.35rem;box-shadow:0 6px 18px -6px #000c,0 0 0 1px #2e4b5d80;cursor:pointer}.side-lane-toggle[aria-expanded=true]{background:#2b4657;color:#fff;box-shadow:0 0 0 1px #3a8bff88,0 8px 26px -6px #000c}.side-lane-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);z-index:1100;opacity:0;pointer-events:none;transition:.3s}.side-lane-overlay.active{opacity:1;pointer-events:auto}}
/* mobile hint & birthday badge */
.side-lane-hint{position:fixed;bottom:82px;left:16px;z-index:1400;background:#1d2b36eb;border:1px solid #2e4858;color:#cfe2ff;padding:.6rem .7rem;font-size:.6rem;line-height:1.5;border-radius:10px;max-width:220px;box-shadow:0 8px 26px -8px #000c,0 0 0 1px #2e485880;animation:sideHintFade .35s ease;backdrop-filter:blur(4px)}
.side-lane-hint:after{content:"";position:absolute;bottom:-6px;left:14px;width:10px;height:10px;background:#1d2b36eb;border-left:1px solid #2e4858;border-bottom:1px solid #2e4858;transform:rotate(45deg)}
.side-lane-hint button{all:unset;cursor:pointer;color:#63b7ff;font-weight:600;font-size:.65rem;margin-left:.25rem}
@keyframes sideHintFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.side-lane-toggle .birthday-ping{position:absolute;top:-6px;right:-6px;width:30px;height:30px;border-radius:12px;background:#1e3140;border:1px solid #3a8bff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1px #3a8bff55,0 0 14px -2px #3a8bffaa;animation:bdPulse 2s ease-in-out infinite}
.side-lane-toggle .birthday-ping img{width:70%;height:70%;object-fit:contain;filter:drop-shadow(0 0 4px #3a8bffcc)}
@keyframes bdPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 1px #3a8bff55,0 0 14px -2px #3a8bffaa}50%{transform:scale(1.15);box-shadow:0 0 0 8px rgba(58,139,255,0),0 0 18px 0 #63b7ffcc}}
/* event banners & support */
.event-banner{position:relative;overflow:hidden;border:1px solid #2c4250;border-radius:10px;background:#11202a;margin:0 0 .55rem}
.event-banner img{display:block;width:100%;height:auto;object-fit:cover}
.event-banner .event-timer{display:flex;align-items:center;gap:.35rem;padding:.35rem .5rem .55rem;font-size:.62rem;font-weight:600;letter-spacing:.5px;color:#ffcf9d}
.event-banner .event-timer .time-icon{width:16px;height:16px;flex:0 0 auto;filter:drop-shadow(0 0 4px #ffb76b55)}
.event-banner .event-remaining{font-family:ui-monospace,monospace;color:#ffb869;display:inline-flex;gap:.25rem}
.event-banner .event-remaining span{min-width:2ch;text-align:right;position:relative;font-size:.72rem;font-weight:700;padding:0 .15rem;color:#ffc98a;text-shadow:0 0 6px #ffae5f55,0 0 14px #ffae5f33}
.event-banner .event-remaining span:after{content:attr(data-label);font-size:.45rem;display:block;letter-spacing:.5px;font-weight:600;color:#b77d55;margin-top:2px;text-align:center}
.event-banner[data-state=ended]{opacity:.35;filter:grayscale(.5)}
.event-banner[data-state=upcoming]{opacity:.55}
.event-banner .badge-state{position:absolute;top:6px;left:6px;background:#1f3442bd;border:1px solid #315367;color:#bfe6ff;font-size:.5rem;font-weight:700;padding:2px 6px;border-radius:8px;letter-spacing:.5px}
#sideSupport .support-note{font-size:.55rem;line-height:1.4;color:#89a;margin:.2rem 0 .4rem}
#sideSupport .ofuse-wrap,#sideSupport .kofi-wrap{background:#1a2a33;border:1px solid #2c4250;padding:.55rem .6rem;border-radius:10px;display:flex;flex-direction:column;gap:.45rem}
#sideSupport .ofuse-wrap h4,#sideSupport .kofi-wrap h4{margin:0;font-size:.6rem;letter-spacing:.5px;color:#9ec5ff;font-weight:700;display:flex;align-items:center;gap:.35rem}
#sideSupport a.kofi-inline-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:10px;overflow:hidden;line-height:0;background:#223544;border:1px solid #35526a;padding:0;transition:.25s}
#sideSupport a.kofi-inline-btn img{display:block;max-width:100%;height:auto}
#sideSupport a.kofi-inline-btn:hover{background:#2d4761;border-color:#467090}
#sideSupport a.kofi-inline-btn:active{transform:translateY(1px)}
/* === v1.2 event simple list compact === */
body.fm-ev-simple-collapsed #sideEvents .event-timer-list.fm-simple-collapsible{display:none}
#sideEvents .ev-simple-toggle-wrap{margin:.2rem 0 .15rem;display:flex;justify-content:flex-end}
#sideEvents .ev-simple-toggle{background:#1c2d37;border:1px solid #2e4657;color:#9ec5ff;font-size:.55rem;letter-spacing:.5px;font-weight:600;cursor:pointer;border-radius:8px;padding:4px 8px;display:inline-flex;align-items:center;gap:.35rem;transition:.25s}
#sideEvents .ev-simple-toggle:hover{background:#254152;color:#d2ecff}
#sideEvents .ev-simple-toggle:active{transform:translateY(1px)}
#sideEvents .ev-simple-toggle svg{width:12px;height:12px;fill:currentColor;transition:.25s}
/* 表示条件の修正: 折りたたみ時は『開く』ボタンのみ / 展開時は『閉じる』ボタンのみ */
body.fm-ev-simple-collapsed #sideEvents .ev-simple-toggle[data-state=closed]{display:none}
body:not(.fm-ev-simple-collapsed) #sideEvents .ev-simple-toggle[data-state=open]{display:none}
/* accessibility focus */
#sideEvents .ev-simple-toggle:focus-visible{outline:2px solid #3a8bff;outline-offset:2px}
/* subtle animation */
#sideEvents .event-timer-list.fm-simple-collapsible{animation:evListFade .3s ease}
@keyframes evListFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
/* === end v1.2 === */
`;
    const st=document.createElement('style'); st.id='fm-sidelane-css'; st.textContent=css; document.head.appendChild(st);
  }
  // ===== HTML 挿入 =====
  if(document.querySelector('.wiki-side-lane')) return; // 既存なら何もしない
  const aside = document.createElement('aside');
  aside.className='wiki-side-lane';
  aside.setAttribute('aria-label','サイド情報パネル');
  aside.innerHTML = `\n    <section class="side-box" id="sideBirthdays" aria-labelledby="sideBirthdaysTitle">\n      <h3 id="sideBirthdaysTitle"><span class="icon"><img data-side-asset="カレンダー" alt="カレンダー" loading="lazy" style="width:100%;height:100%;object-fit:contain"></span>今日の誕生日<button type="button" class="sl-collapse-btn" aria-expanded="true" aria-label="今日の誕生日 折りたたみ"></button></h3>\n      <ul class="birthday-list" data-birthday-list></ul>\n      <div class="birthday-empty" data-birthday-empty style="display:none">今日の誕生日はありません</div>\n      <div class="birthday-empty" data-birthday-file-warn style="display:none;color:#f6b37b">file:// では読み込めません。ローカルサーバを起動してください。</div>\n      <div class="next-birthdays" data-next-birthdays style="display:none">\n        <h4>次の誕生日</h4><ul data-next-birthday-list></ul>\n      </div>\n    </section>\n    <section class="side-box" id="sideEvents" aria-labelledby="sideEventsTitle">\n      <h3 id="sideEventsTitle"><span class="icon"><img data-side-asset="イベント" alt="イベント" loading="lazy" style="width:100%;height:100%;object-fit:contain"></span>イベント/ガチャ<button type="button" class="sl-collapse-btn" aria-expanded="true" aria-label="イベント/ガチャ 折りたたみ"></button></h3>\n      <ul class="event-timer-list" data-event-timer-list></ul><div class="event-empty" data-event-empty style="display:none">開催中イベントなし</div>\n    </section>\n    <section class="side-box" id="sideSupport" aria-labelledby="sideSupportTitle">\n      <h3 id="sideSupportTitle"><span class="icon"><img data-side-asset="follow_icon" alt="応援" loading="lazy" style="width:100%;height:100%;object-fit:contain"></span>応援<button type="button" class="sl-collapse-btn" aria-expanded="true" aria-label="応援 折りたたみ"></button></h3>\n      <p class="support-note">応援いただけると更新の励みになります。</p>\n      <div class="support-links">\n        <div class="ofuse-wrap"><h4>OFUSE</h4><a data-ofuse-widget-button href="https://ofuse.me/o?uid=116462" data-ofuse-id="116462" data-ofuse-style="rectangle">OFUSEで応援を送る</a></div>\n        <div class="kofi-wrap"><h4>Ko-fi</h4><a class="kofi-inline-btn" href="https://ko-fi.com/X8X11KVU5K" data-kofi-launch target="_blank" rel="noopener" aria-label="Support me on Ko-fi"><img data-kofi-img alt="Support me on Ko-fi" loading="lazy"></a></div>\n      </div>\n    </section>`;
  document.body.appendChild(aside);
  // モバイルトグル/オーバーレイ
  const toggle = document.createElement('button');
  toggle.className='side-lane-toggle'; toggle.id='sideLaneToggle'; toggle.type='button'; toggle.setAttribute('aria-label','サイド情報'); toggle.setAttribute('aria-expanded','false'); toggle.innerHTML='<span aria-hidden="true">★</span>';
  const overlay = document.createElement('div'); overlay.className='side-lane-overlay'; overlay.id='sideLaneOverlay'; overlay.setAttribute('aria-hidden','true');
  document.body.appendChild(toggle); document.body.appendChild(overlay);
  // ---- Runtime guard: ensure toggle is fixed (some mobile browsers may delay style application or trimmed CSS) ----
  setTimeout(()=>{
    try{
      const cs = window.getComputedStyle(toggle);
      // if position not fixed OR width==0 (not styled yet), enforce minimal inline fallback
      if(cs.position !== 'fixed' || parseInt(cs.width,10) < 10){
        toggle.style.position='fixed';
        toggle.style.bottom='16px';
        toggle.style.left='16px';
        toggle.style.zIndex='1300';
        toggle.style.width='54px';
        toggle.style.height='54px';
        toggle.style.borderRadius='16px';
        toggle.style.background='linear-gradient(140deg,#172531,#1f3644)';
        toggle.style.border='1px solid #2c4656';
        toggle.style.display='flex';
        toggle.style.alignItems='center';
        toggle.style.justifyContent='center';
        toggle.style.color='#cfe2ff';
        toggle.style.fontSize='1.35rem';
        toggle.style.boxShadow='0 6px 18px -6px #000c,0 0 0 1px #2e4b5d80';
      }
    }catch(e){}
  }, 120);
  function setOpen(v){ if(v){ aside.classList.add('open'); toggle.setAttribute('aria-expanded','true'); overlay.classList.add('active'); } else { aside.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); overlay.classList.remove('active'); } }
  toggle.addEventListener('click',()=> setOpen(!aside.classList.contains('open')));
  overlay.addEventListener('click',()=> setOpen(false));

  // モバイル初回ヒント表示 (日次)
  function showMobileHint(){
    if(window.innerWidth >= 1180) return; // PC時は不要
    const hintKey = 'fm_mobile_hint_shown';
    const today = getJSTDate().key;
    const lastShown = localStorage.getItem(hintKey);
    if(lastShown === today) return; // 今日既に表示済み
    
    const hint = document.createElement('div');
    hint.className = 'side-lane-hint';
    hint.innerHTML = '★ボタンで誕生日・イベント情報を確認できます<button>OK</button>';
    document.body.appendChild(hint);
    
    const closeHint = () => {
      hint.remove();
      try { localStorage.setItem(hintKey, today); } catch(e) {}
    };
    
    hint.querySelector('button').addEventListener('click', closeHint);
    setTimeout(closeHint, 8000); // 8秒後自動消去
  }
  
  // 初回ヒント表示 (少し遅延)
  setTimeout(showMobileHint, 2000);

  // 誕生日バッジ表示 (モバイル用)
  async function showBirthdayBadge(){
    if(window.innerWidth >= 1180) return; // PC時は不要
    const data = await loadBirthdayData();
    const jst = getJSTDate();
    let todayKey = jst.key;
  // testBirthday 機能は無効化
    
    const todays = data.filter(b => b.date === todayKey);
    if(!todays.length) return; // 今日誕生日なし
    
    const badgeKey = 'fm_birthday_badge_shown';
    const lastShown = localStorage.getItem(badgeKey);
    if(lastShown === todayKey) return; // 今日既に表示済み
    
    const ping = document.createElement('div');
    ping.className = 'birthday-ping';
    const iconCandidates = [
      PATHS.assets + 'birthday_icon.webp',
      PATHS.assets + 'birthday_icon.png', 
      PATHS.root + 'birthday_icon.webp',
      PATHS.root + 'birthday_icon.png'
    ];
    ping.innerHTML = `<img src="${iconCandidates[0]}" alt="誕生日" loading="lazy">`;
    
    const img = ping.querySelector('img');
    let i = 0;
    img.onerror = () => {
      if(i < iconCandidates.length - 1) {
        i++;
        img.src = iconCandidates[i];
      }
    };
    
    toggle.appendChild(ping);
    
    // 10秒後に消去 & 記録
    setTimeout(() => {
      ping.remove();
      try { localStorage.setItem(badgeKey, todayKey); } catch(e) {}
    }, 10000);
  }
  
  // 誕生日バッジ表示 (ヒント後)
  setTimeout(showBirthdayBadge, 3000);

  // ===== 画像フォールバック =====
  function applySideAssetFallback(){
    document.querySelectorAll('img[data-side-asset]').forEach(img=>{
      const token = img.getAttribute('data-side-asset') || '';
      // 拡張子判定（未指定なら拡張子可変で候補生成）
      const hasExt = /\.[a-zA-Z0-9]+$/.test(token);
      const base = hasExt ? token.replace(/\.[^.]+$/, '') : token; // 末尾拡張子のみ除去
      let exts;
      if(!hasExt){
        exts = ['.png','.webp','.jpg','.jpeg','.gif'];
      }else{
        const lower = token.toLowerCase();
        if(lower.endsWith('.png')) exts = ['.png','.webp'];
        else if(lower.endsWith('.webp')) exts = ['.webp','.png'];
        else if(lower.endsWith('.jpg')) exts = ['.jpg','.webp'];
        else if(lower.endsWith('.jpeg')) exts = ['.jpeg','.webp'];
        else if(lower.endsWith('.gif')) exts = ['.gif','.webp'];
        else exts = [token.substring(token.lastIndexOf('.'))];
      }
      const prefixes = [
        PATHS.assets,
        PATHS.assets + 'icons/',
        PATHS.assets + 'バナー/',
        PATHS.assets + '誕生日/',
        PATHS.root + 'assets/left_side_lane/',
        PATHS.root + 'assets/icons/',
        PATHS.root
      ];
      const candidates = [];
      for(const pre of prefixes){
        for(const ext of exts){
          candidates.push(pre + base + ext);
        }
      }
      if(candidates.length === 0) return;
      let i=0; img.src=candidates[i];
      img.onerror=()=>{ if(i<candidates.length-1){ i++; img.src=candidates[i]; } };
    });
    // Ko-fi 画像（WebP優先 → PNG）
    const kImg=document.querySelector('[data-kofi-img]');
    if(kImg){
      const kBase='support_me_on_kofi_blue';
      const prefixes=[PATHS.assets, PATHS.assets+'バナー/', PATHS.root];
      const kCandidates=[];
      for(const pre of prefixes){ kCandidates.push(pre+kBase+'.webp', pre+kBase+'.png'); }
      let j=0; if(kCandidates.length){ kImg.src=kCandidates[j]; kImg.onerror=()=>{ if(j<kCandidates.length-1){ j++; kImg.src=kCandidates[j]; } }; }
    }
  }
  applySideAssetFallback();

  // ===== セクション折りたたみ初期化 =====
  function initCollapsers(){
    document.querySelectorAll('.side-box').forEach(sec=>{
      const id = sec.id || '';
      const btn = sec.querySelector('button.sl-collapse-btn');
      if(!btn) return;
      const key = 'fm_sl_collapse_'+id;
      // 復元
      try{
        const saved = localStorage.getItem(key);
        if(saved === '1'){
          sec.classList.add('collapsed');
          btn.setAttribute('aria-expanded','false');
        }
      }catch(e){}
      const h3 = sec.querySelector('h3');
      function toggle(){
        const collapsed = sec.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', String(!collapsed));
        try{ localStorage.setItem(key, collapsed?'1':'0'); }catch(e){}
      }
      btn.addEventListener('click', e=>{ e.stopPropagation(); toggle(); });
      if(h3){ h3.addEventListener('click', e=>{ if(e.target === btn) return; toggle(); }); }
    });
  }
  initCollapsers();

  // ===== JST 日付ユーティリティ =====
  function getJSTDate(){
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset()*60000;
    const jst = new Date(utc + 9*3600000);
    const yyyy = jst.getFullYear();
    const mm = String(jst.getMonth()+1).padStart(2,'0');
    const dd = String(jst.getDate()).padStart(2,'0');
    return {date:jst, yyyy, mm, dd, key: mm+'-'+dd};
  }
  // ===== 誕生日データ =====
  async function loadBirthdayData(){
    const cacheKey='fm_birthdays_cache_v1'; const cacheMetaKey='fm_birthdays_cache_v1_meta';
    const jst = getJSTDate();
    if(__SL_QP.has('refreshBirth')){ try{ localStorage.removeItem(cacheKey); localStorage.removeItem(cacheMetaKey);}catch(e){} }
    try{ const meta=JSON.parse(localStorage.getItem(cacheMetaKey)||'{}'); if(meta.day===jst.key){ const c=JSON.parse(localStorage.getItem(cacheKey)||'[]'); if(Array.isArray(c)&&c.length) return c; } }catch(e){}
    const tryFiles=['character.json','../character.json','../../character.json'];
    let json=null;
    for(const rel of tryFiles){
      const candidates=[PATHS.site+rel, PATHS.root+rel];
      for(const p of candidates){
        try{ const res=await fetch(p,{cache:'no-store'}); if(res.ok){ json=await res.json(); break; } }catch(e){}
        if(json) break;
      }
      if(json) break;
    }
    if(!json) return [];
    function toHalf(n){return n.replace(/[０-９]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xFEE0));}
    function parseDate(str){ if(!str) return null; str=toHalf(str.trim()); let m=str.match(/^(\d{1,2})月(\d{1,2})日$/); if(!m) m=str.match(/^(\d{1,2})[\/\-](\d{1,2})$/); if(!m) return null; return m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0'); }
    const out=[]; Object.keys(json).forEach(id=>{ const info=json[id]&&json[id]['基本情報']; if(!info) return; const bd=parseDate(info['誕生日']); if(!bd) return; // 個別キャラページは site/chars/{id}.html
      out.push({id,name:info['名前']||id,date:bd,link:`site/chars/${id}.html`}); });
    out.sort((a,b)=>a.date.localeCompare(b.date));
  try{ localStorage.setItem(cacheKey,JSON.stringify(out)); localStorage.setItem(cacheMetaKey,JSON.stringify({day:jst.key, ts:Date.now()})); }catch(e){}
    return out;
  }
  function resolveBirthdayThumb(id){ const num=parseInt(id,10); if(isNaN(num)) return null; return PATHS.birthdayDir + '11'+String(num).padStart(3,'0')+'.webp'; }
  async function renderBirthdays(){
    const data=await loadBirthdayData();
    const list=document.querySelector('[data-birthday-list]'); const empty=document.querySelector('[data-birthday-empty]'); const nextWrap=document.querySelector('[data-next-birthdays]'); const nextList=document.querySelector('[data-next-birthday-list]');
    if(!list) return; const jst=getJSTDate(); let todayKey=jst.key; const mm=jst.mm; const dd=jst.dd; const baseYear=jst.yyyy;
    // テスト用クエリ (?testBirthday=MM-DD)
  // testBirthday 機能は無効化 (残骸保持)
  const tb = null; // __SL_QP.get('testBirthday');
    const todays=data.filter(b=>b.date===todayKey);
    if(todays.length){
      // ===== 日次演出ゲート (JST) =====
      const realDayKey = jst.key; // テストパラメータを無視した実際のJST日付
  const hasTestOverride = false; // テスト上書き無効化
      let showEffects = true;
      try {
        const seen = localStorage.getItem('fm_birthday_fx_seen');
        if(seen === realDayKey && !hasTestOverride) showEffects = false;
      } catch(e){}
      document.body.classList.add('birthday-day');
      todays.forEach(b=>{ const li=document.createElement('li'); li.className='today'; const thumb=resolveBirthdayThumb(b.id); const bubbleCandidates=[PATHS.assets+'birthday_icon.webp',PATHS.assets+'birthday_icon.png',PATHS.root+'birthday_icon.webp',PATHS.root+'birthday_icon.png']; const bubbleInit=bubbleCandidates[0]; const charHref = PATHS.site + 'chars/' + b.id + '.html'; const bubbleMarkup = showEffects ? `<img class="birthday-bubble" src="${bubbleInit}" alt="誕生日アイコン" loading="lazy">` : '';
        li.innerHTML=`<div class="thumb-row"><div class="birthday-thumb">${thumb?`<img src="${thumb}" alt="${b.name}" loading="lazy">`:''}</div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:.35rem;flex-wrap:wrap"><a href="${charHref}" aria-label="${b.name}">${b.name}</a></div><time datetime="--${b.date}">${b.date}</time></div></div>${bubbleMarkup}`; list.appendChild(li); if(showEffects){ const bubble=li.querySelector('.birthday-bubble'); if(bubble){ let bi=0; bubble.onerror=()=>{ if(bi<bubbleCandidates.length-1){ bi++; bubble.src=bubbleCandidates[bi]; } }; setTimeout(()=>bubble.remove(),5000);} } });
      // リプレイボタン (今日キャラあり時に常設)
      if(!document.querySelector('.birthday-replay-btn')){
        const host=document.getElementById('sideBirthdays');
        if(host){
          const btn=document.createElement('button');
          btn.type='button';
          btn.className='birthday-replay-btn';
          btn.title='誕生日演出をもう一度再生';
          btn.setAttribute('aria-label','誕生日演出をもう一度再生');
          btn.textContent='↻';
          btn.addEventListener('click',()=>{
            // フラグをクリアして再レンダリング (演出のみ再生)
            try{ localStorage.removeItem('fm_birthday_fx_seen'); }catch(e){}
            // 既存の演出DOM除去
            document.querySelectorAll('.birthday-message,.birthday-confetti,.birthday-bubble').forEach(n=>n.remove());
            // 再生フラグをfalseにして再構築
            triggerBirthdayEffectsReplay();
          });
          host.appendChild(btn);
        }
      }
      // 豪華メッセージ (一度だけ) - アーチ状配置
      if(showEffects && !document.querySelector('.birthday-message')){
        const msg=document.createElement('div'); msg.className='birthday-message';
        const chars=['🎉',' ','H','a','p','p','y',' ','B','i','r','t','h','d','a','y','!',' ','🎉'];
  // 緩い「丘型」カーブ: y = -peak*(1 - t^2)  (t:-1..1)
  const isMobile = window.innerWidth < 1180;
  const peak=28; // 丘高さ
  const xStep = isMobile ? 16 : 14; // PC側は文字間隔を詰める
  const shiftX = isMobile ? -24 : -36; // PCをさらに少し右へ
  const letterSize = isMobile ? '.95rem' : '.86rem';
        const total = chars.length;
        const mid = (total-1)/2;
        let width = (total-1)*xStep + 60; // 余白
        let inner='';
        for(let i=0;i<total;i++){
          const t = (i - mid)/mid; // -1..1
            // 丘型カーブ (端 0, 中央 -peak)
          const y = -(1 - t*t)*peak;
          const x = (i - mid)*xStep + shiftX;
          // 緩やかな傾きによる回転 (微分 dy/dx = 2*peak*t/(mid*xStep) *? ここは比例で十分)
          const rot = t * 10; // 最大10度回転
          inner += `<span style="position:absolute;left:50%;top:55%;transform:translate(-50%,-50%) translate(${x}px,${y}px) rotate(${rot}deg);font-size:${letterSize}">${chars[i]}</span>`;
        }
        msg.innerHTML=`<div class="birthday-text" style="position:relative;height:110px;width:${width}px;">${inner}</div><div class="birthday-sparkles"><span>✨</span><span>🎂</span><span>🎈</span><span>🎁</span><span>⭐</span></div>`;
        const host=document.getElementById('sideBirthdays'); if(host){ host.style.position='relative'; host.appendChild(msg); setTimeout(()=>msg.remove(),8000); }
      }
      // コンフェッティ
  if(showEffects && !document.querySelector('.birthday-confetti')){
        const holder=document.createElement('div'); holder.className='birthday-confetti';
        const colors=['#ffcf7d','#ffa94d','#6fbfff','#9ad8ff','#ffd6a3','#ff6b9d','#a855f7','#34d399'];
        const emojis=['🎉','🎂','🎈','🎁','⭐','✨','💫','🌟'];
        const total=42;
        for(let i=0;i<total;i++){
          const sp=document.createElement('span'); const isEmoji=Math.random()>0.63; const delay=(Math.random()*5).toFixed(2)+'s'; const dur=(8+Math.random()*5).toFixed(2)+'s'; const left=(Math.random()*100).toFixed(2)+'%'; const driftX=(Math.random()*160-80).toFixed(1)+'px'; const rot=(360+Math.random()*1080).toFixed(0)+'deg'; const scale=(0.55+Math.random()*0.9).toFixed(2); sp.style.left=left; if(!isEmoji){ sp.style.width='18px'; sp.style.height='18px'; sp.style.borderRadius='4px'; sp.style.background=colors[i%colors.length]; } else { sp.classList.add('emoji'); sp.textContent=emojis[Math.floor(Math.random()*emojis.length)]; } sp.style.setProperty('--driftX',driftX); sp.style.setProperty('--rot',rot); sp.style.setProperty('--scale',scale); sp.style.animationDuration=dur; sp.style.animationDelay=delay; holder.appendChild(sp); }
        const host=document.getElementById('sideBirthdays'); if(host){ host.appendChild(holder); setTimeout(()=>holder.remove(),12000); }
      }
  // 表示した日を記録（テスト上書き時は記録しない）
  if(showEffects && !hasTestOverride){ try{ localStorage.setItem('fm_birthday_fx_seen', realDayKey); }catch(e){} }
    } else if(empty) {
      empty.style.display='block';
    }
    const todayOrdinal=parseInt(mm+dd,10);
    const upcoming=data.filter(b=>b.date!==todayKey).map(b=>{ const ord=parseInt(b.date.replace('-',''),10); const yearOffset = ord < todayOrdinal ? 1 : 0; const d=new Date(baseYear+yearOffset+'-'+b.date+'T00:00:00'); return {...b,nextDate:d}; }).sort((a,b)=>a.nextDate-b.nextDate).slice(0,5);
    if(upcoming.length && nextWrap){ nextWrap.style.display='block'; upcoming.forEach(b=>{ const m2=String(b.nextDate.getMonth()+1).padStart(2,'0'); const d2=String(b.nextDate.getDate()).padStart(2,'0'); const li=document.createElement('li'); li.innerHTML=`<span>${b.name}</span><span class="date">${m2}/${d2}</span>`; nextList.appendChild(li); }); }
  }
  function triggerBirthdayEffectsReplay(){
    // 再演出用: 一旦リストを維持したまま演出だけを生成
    const fxSeenKey='fm_birthday_fx_seen';
    try{ localStorage.removeItem(fxSeenKey); }catch(e){}
    // 最低限必要な処理: 今日の誕生日が存在するかチェックし、showEffects=true扱いで再度演出DOMだけ差し込む
    (async()=>{
      const data=await loadBirthdayData();
      const jst=getJSTDate();
      const todayKey=jst.key;
      const todays=data.filter(b=>b.date===todayKey);
      if(!todays.length) return;
      // メッセージ
      if(!document.querySelector('.birthday-message')){
        const msg=document.createElement('div'); msg.className='birthday-message';
        const chars=['🎉',' ','H','a','p','p','y',' ','B','i','r','t','h','d','a','y','!',' ','🎉'];
        const isMobile = window.innerWidth < 1180;
        const peak=28; const xStep = isMobile ? 16 : 14; const shiftX = isMobile ? -24 : -36; const letterSize = isMobile ? '.95rem' : '.86rem';
        const total = chars.length; const mid=(total-1)/2; let width=(total-1)*xStep + 60; let inner='';
        for(let i=0;i<total;i++){ const t=(i-mid)/mid; const y=-(1 - t*t)*peak; const x=(i-mid)*xStep + shiftX; const rot=t*10; inner += `<span style="position:absolute;left:50%;top:55%;transform:translate(-50%,-50%) translate(${x}px,${y}px) rotate(${rot}deg);font-size:${letterSize}">${chars[i]}</span>`; }
        msg.innerHTML=`<div class="birthday-text" style="position:relative;height:110px;width:${width}px;">${inner}</div><div class="birthday-sparkles"><span>✨</span><span>🎂</span><span>🎈</span><span>🎁</span><span>⭐</span></div>`;
        const host=document.getElementById('sideBirthdays'); if(host){ host.style.position='relative'; host.appendChild(msg); setTimeout(()=>msg.remove(),8000); }
      }
      if(!document.querySelector('.birthday-confetti')){
        const holder=document.createElement('div'); holder.className='birthday-confetti';
        const colors=['#ffcf7d','#ffa94d','#6fbfff','#9ad8ff','#ffd6a3','#ff6b9d','#a855f7','#34d399'];
        const emojis=['🎉','🎂','🎈','🎁','⭐','✨','💫','🌟'];
        const total=42;
        for(let i=0;i<total;i++){
          const sp=document.createElement('span'); const isEmoji=Math.random()>0.63; const delay=(Math.random()*5).toFixed(2)+'s'; const dur=(8+Math.random()*5).toFixed(2)+'s'; const left=(Math.random()*100).toFixed(2)+'%'; const driftX=(Math.random()*160-80).toFixed(1)+'px'; const rot=(360+Math.random()*1080).toFixed(0)+'deg'; const scale=(0.55+Math.random()*0.9).toFixed(2); sp.style.left=left; if(!isEmoji){ sp.style.width='18px'; sp.style.height='18px'; sp.style.borderRadius='4px'; sp.style.background=colors[i%colors.length]; } else { sp.classList.add('emoji'); sp.textContent=emojis[Math.floor(Math.random()*emojis.length)]; } sp.style.setProperty('--driftX',driftX); sp.style.setProperty('--rot',rot); sp.style.setProperty('--scale',scale); sp.style.animationDuration=dur; sp.style.animationDelay=delay; holder.appendChild(sp); }
        const host=document.getElementById('sideBirthdays'); if(host){ host.appendChild(holder); setTimeout(()=>holder.remove(),12000); }
      }
      try{ localStorage.setItem(fxSeenKey, todayKey); }catch(e){}
    })();
  }

  renderBirthdays();

  // ===== イベント & バナー =====
  let eventData=[];
  async function loadEventData(){ if(eventData.length) return eventData; const paths=[PATHS.site+'events.json', PATHS.assets+'events.json', PATHS.root+'events.json']; for(const p of paths){ try{ const r=await fetch(p,{cache:'no-store'}); if(r.ok){ const js=await r.json(); if(Array.isArray(js)){ eventData=js; break; } } }catch(e){} } return eventData; }
  const timerItems=[];
  function formatRemain(ms){ if(ms<=0) return '終了'; const t=Math.floor(ms/1000); const d=Math.floor(t/86400); const h=Math.floor((t%86400)/3600); const m=Math.floor((t%3600)/60); const s=t%60; if(d>3) return `${d}日 ${h}時間`; if(d>0) return `${d}日 ${h}時間${m}分`; if(h>0) return `${h}時間${m}分`; if(m>0) return `${m}分${s}秒`; return `${s}秒`; }
  function startEventTimerLoop(){ function tick(){ const now=Date.now(); timerItems.forEach(el=>{ const end=new Date(el.getAttribute('data-end')).getTime(); const remain=end-now; if(remain<=0){ el.textContent='終了'; el.classList.add('timer-ended'); } else { el.textContent=formatRemain(remain); } }); requestAnimationFrame(()=>setTimeout(tick,1000)); } tick(); }
  (async function initEvents(){ await loadEventData(); const list=document.querySelector('[data-event-timer-list]'); const empty=document.querySelector('[data-event-empty]'); if(!list) return; if(eventData.length){ eventData.forEach(ev=>{ const endISO = ev.ends ? ev.ends : new Date(ev.end+'T18:59:59Z').toISOString(); const li=document.createElement('li'); li.innerHTML=`<strong>${ev.link?`<a href="${ev.link}" style="color:#9ec5ff;text-decoration:none">${ev.name||ev.title||ev.id}</a>`:(ev.name||ev.title||ev.id)}</strong><span class="timer-remaining" data-end="${endISO}"></span>`; list.appendChild(li); timerItems.push(li.querySelector('[data-end]')); }); } else { if(empty) empty.style.display='block'; } startEventTimerLoop(); // banners
    const sideBox=document.getElementById('sideEvents'); if(!sideBox) return; const bannerRoot=document.createElement('div'); bannerRoot.setAttribute('data-event-banners',''); sideBox.insertBefore(bannerRoot, list); const today=new Date(); const banners=(eventData||[]).map(ev=>{ const startJST=new Date(ev.start+'T07:00:00Z'); const endJST=new Date(ev.end+'T18:59:59Z'); return {...ev,startJST,endJST}; }); const active=banners.filter(b=> today>=b.startJST && today<=b.endJST); const upcoming=banners.filter(b=> today<b.startJST).sort((a,b)=>a.startJST-b.startJST).slice(0,2); function makeBanner(ev,state){ const wrap=document.createElement('div'); wrap.className='event-banner'; wrap.dataset.state=state; const badge= state==='active' ? '開催中':'予告'; let candidates=[]; const raw=ev.banner||''; const hasExt=/\.(png|jpe?g|webp)$/i.test(raw); const laneDir=PATHS.assets+'バナー/'; const laneDirRoot=PATHS.site+'assets/left_side_lane/バナー/'; function push(base,ext){ candidates.push(laneDir+base+ext,laneDirRoot+base+ext,PATHS.assets+base+ext, PATHS.root+base+ext); }
      if(!hasExt){ ['.webp','.png','.jpg'].forEach(ext=>push(raw,ext)); } else { const base=raw.replace(/\.(png|jpe?g|webp)$/i,''); if(/\.(png|jpe?g)$/i.test(raw)) push(base,'.webp'); candidates.push(laneDir+raw,laneDirRoot+raw,PATHS.assets+raw,PATHS.root+raw); if(/\.webp$/i.test(raw)) ['.png','.jpg'].forEach(ext=>push(base,ext)); }
  candidates=[...new Set(candidates)]; const imgSrc=candidates[0]; wrap.innerHTML=`<div class="badge-state">${badge}</div><img src="${imgSrc}" alt="${ev.name}" loading="lazy" data-banner><div class="event-timer"><img class="time-icon" alt="残り時間" loading="lazy" data-time-icon><div class="event-remaining" data-countdown data-start="${ev.startJST.toISOString()}" data-end="${ev.endJST.toISOString()}"></div></div>`; const bImg=wrap.querySelector('[data-banner]'); if(bImg){ let bi=0; bImg.onerror=()=>{ if(bi<candidates.length-1){ bi++; bImg.src=candidates[bi]; } }; } const tIcon=wrap.querySelector('[data-time-icon]'); if(tIcon){ const ic=[PATHS.assets+'time_icon.webp',PATHS.assets+'time_icon.png',PATHS.root+'time_icon.webp',PATHS.root+'time_icon.png']; let ii=0; tIcon.src=ic[ii]; tIcon.onerror=()=>{ if(ii<ic.length-1){ ii++; tIcon.src=ic[ii]; } }; } bannerRoot.appendChild(wrap); return wrap.querySelector('[data-countdown]'); }
    const countdownTargets=[]; active.forEach(ev=> countdownTargets.push(makeBanner(ev,'active'))); if(!active.length) upcoming.slice(0,1).forEach(ev=> countdownTargets.push(makeBanner(ev,'upcoming'))); function renderCountdown(){ const now=Date.now(); countdownTargets.forEach(el=>{ if(!el) return; const end=new Date(el.getAttribute('data-end')).getTime(); const start=new Date(el.getAttribute('data-start')).getTime(); const parent=el.closest('.event-banner'); if(now<start) parent.dataset.state='upcoming'; else if(now>end){ parent.dataset.state='ended'; el.textContent='終了'; return; } const remain=end-now; const t=Math.max(0,Math.floor(remain/1000)); const d=Math.floor(t/86400),h=Math.floor((t%86400)/3600),m=Math.floor((t%3600)/60),s=t%60; el.innerHTML=`<span data-label="日">${d}</span><span data-label="時間">${h.toString().padStart(2,'0')}</span><span data-label="分">${m.toString().padStart(2,'0')}</span><span data-label="秒">${s.toString().padStart(2,'0')}</span>`; }); } renderCountdown(); setInterval(renderCountdown,1000);

    // === v1.2 simple event list collapsible (only affects the ul list, banners always visible) ===
    (function(){
      // デフォルト常に「閉じた状態」から開始し、リロードで毎回リセット（localStorage非使用）
      list.classList.add('fm-simple-collapsible');
      const wrap=document.createElement('div');
      wrap.className='ev-simple-toggle-wrap';
      const btnOpen=document.createElement('button');
      btnOpen.type='button'; btnOpen.className='ev-simple-toggle'; btnOpen.dataset.state='open'; btnOpen.setAttribute('aria-controls','evSimpleList'); btnOpen.setAttribute('aria-expanded','false'); btnOpen.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5 5 8.5l1.4-1.4L12 12.7l5.6-5.6L19 8.5z"/></svg>イベント一覧';
      const btnClose=document.createElement('button');
      btnClose.type='button'; btnClose.className='ev-simple-toggle'; btnClose.dataset.state='closed'; btnClose.setAttribute('aria-controls','evSimpleList'); btnClose.setAttribute('aria-expanded','true'); btnClose.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(180deg)"><path d="M12 15.5 5 8.5l1.4-1.4L12 12.7l5.6-5.6L19 8.5z"/></svg>閉じる';
      wrap.appendChild(btnOpen); wrap.appendChild(btnClose);
      bannerRoot.after(wrap);
      list.id='evSimpleList';
      function applyState(open){
        if(open){
          document.body.classList.remove('fm-ev-simple-collapsed');
          btnOpen.setAttribute('aria-expanded','true');
          btnClose.setAttribute('aria-expanded','true');
        } else {
          document.body.classList.add('fm-ev-simple-collapsed');
          btnOpen.setAttribute('aria-expanded','false');
          btnClose.setAttribute('aria-expanded','false');
        }
      }
      applyState(false); // 強制閉じ状態で開始
      btnOpen.addEventListener('click',()=> applyState(true));
      btnClose.addEventListener('click',()=> applyState(false));
    })();
    // === end v1.2 ===
  })();

  // ===== Support (OFUSE lazy) =====
  (function(){ const ofuseSel='[data-ofuse-widget-button]'; function loadOfuse(){ if(document.querySelector('script[data-ofuse-loaded]')) return; const s=document.createElement('script'); s.src='https://ofuse.me/assets/platform/widget.js'; s.async=true; s.charset='utf-8'; s.setAttribute('data-ofuse-loaded','1'); document.head.appendChild(s);} let loaded=false; function ensure(){ if(loaded) return; loaded=true; loadOfuse(); } ['scroll','pointerdown','keydown'].forEach(ev=>window.addEventListener(ev,ensure,{once:true,passive:true})); setTimeout(()=>{ if(document.querySelector(ofuseSel)){ const r=document.getElementById('sideSupport'); if(r){ const rect=r.getBoundingClientRect(); if(rect.top < innerHeight) ensure(); } } },1200); })();

})();
