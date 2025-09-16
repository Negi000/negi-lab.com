// Firebase コメント機能 (キャラ/ロム共通) v0.1
// 想定 Firestore セキュリティルール (例):
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     function validId(id) { return id.size() >= 1 && id.size() <= 80; }
//     match /pages/{pageId}/comments/{commentId} {
//       allow read: if true; // 公開読み取り
//       allow create: if request.time < timestamp.date(2100,1,1) &&
//         validId(pageId) &&
//         request.resource.data.keys().hasOnly(['name','body','created','hash']) &&
//         request.resource.data.name is string && request.resource.data.name.size() <= 24 &&
//         request.resource.data.body is string && request.resource.data.body.size() > 0 && request.resource.data.body.size() <= 500 &&
//         request.resource.data.created is timestamp &&
//         request.resource.data.hash is string && request.resource.data.hash.size() == 64;
//     }
//   }
// }

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app-check.js';

// ---- 設定 ----
const firebaseConfig = {
  apiKey: 'AIzaSyADMzBGgMaYciQjgRySQk4PMxE3OPhjs4E',
  authDomain: 'my-game-wiki-comments.firebaseapp.com',
  projectId: 'my-game-wiki-comments',
  storageBucket: 'my-game-wiki-comments.firebasestorage.app',
  messagingSenderId: '1056686376406',
  appId: '1:1056686376406:web:ce66e9c5795e7010161077'
};

// ページID推定ロジック
function resolvePageId(){
  // 優先: data-char-id
  const meta=document.getElementById('charMeta');
  // ROM: data-rom-id (chars と区別)
  const romMeta=document.getElementById('romMeta');
  if(romMeta && romMeta.getAttribute('data-rom-id')){
    return 'rom_' + romMeta.getAttribute('data-rom-id');
  }
  if(meta && meta.getAttribute('data-char-id')) return 'char_' + meta.getAttribute('data-char-id');
  // URL から (例: /gamewiki/FellowMoon/site/chars/ABC123.html)
  const m=location.pathname.match(/([^\/]+)\.html$/);
  if(m) return 'page_' + m[1].substring(0,70);
  return 'page_unknown';
}
const PAGE_ID = resolvePageId();

// ---- 初期化 ----
const app = initializeApp(firebaseConfig);
// App Check (reCAPTCHA v3) - 必ず管理画面で site key を発行して置換してください
// 環境変数化できない静的配信環境では『公開しても差し支えない key 』ですが Domain 制限を必須に
// 発行された reCAPTCHA v3 (App Check) Site Key
// 本番ドメインが Firebase コンソール App Check の Allowed Domains に含まれていることを確認
const APP_CHECK_SITE_KEY = '6LcKi8srAAAAAFbinPBIWJKeuLJXaT6eOVPbLPbJ';
let appCheckTokenValid = false;
try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
  // App Check JS SDK は内部的にトークンを管理するため、ここでは投稿時にも検査 (fallbackで flag) を行う
  appCheckTokenValid = true; // 初期化成功とみなす（実トークン失敗時 Firestore 書込がルールで拒否される）
} catch(e){
  console.warn('[comments] AppCheck init failed (fallback anon gating):', e);
}
const db = getFirestore(app);
const auth = getAuth(app);

// ---- DOM ----
const root = document.querySelector('[data-comments-root]');
if(!root){
  console.warn('[comments] root not found');
}
const form = document.getElementById('commentForm');
const listEl = document.getElementById('commentList');
const infoEl = document.getElementById('commentInfo');
const statusEl = document.getElementById('commentStatus');
const reloadBtn = document.getElementById('commentReload');
const submitBtn = document.getElementById('commentSubmit');
const lengthEl = document.getElementById('commentLength');
const noCommentsEl = document.getElementById('noComments');
const tpl = document.getElementById('commentItemTemplate');
// ハニーポット (後でテンプレに hidden 追加予定) が無ければ null
const honey = document.getElementById('hp_field');
// 認証操作UI (後でテンプレに追加される前提要素を取得; 存在しなくても安全)
let authBar, btnGoogle, btnLogout, btnAnon, authStateLabel, anonToggle;
function bindAuthElements(){
  authBar = document.getElementById('commentAuthBar');
  btnGoogle = document.getElementById('btnGoogleSignIn');
  btnLogout = document.getElementById('btnLogout');
  btnAnon = document.getElementById('btnForceAnon');
  authStateLabel = document.getElementById('authStateLabel');
  anonToggle = document.getElementById('anonModeToggle');
}
bindAuthElements();

// ---- ユーティリティ ----
function sanitize(str){
  return str.replace(/[&<>\"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\'':'&#39;' }[c]));
}
function formatDate(ts){
  const d = ts instanceof Date ? ts : new Date(ts);
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0');
  const hh=String(d.getHours()).padStart(2,'0'); const mm=String(d.getMinutes()).padStart(2,'0');
  return `${y}/${m}/${da} ${hh}:${mm}`;
}
function hashString(str){
  // 簡易 SHA-256 生成 (SubtleCrypto) -> hex
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buf=>{
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  });
}
function setStatus(msg, ok=false){
  if(!statusEl) return; statusEl.textContent = msg; statusEl.style.color = ok? '#7ecfff':'#ffb37e';
}
function setAuthInfo(text){ if(infoEl){ infoEl.textContent = text; } }
function renderAuthState(user){
  bindAuthElements();
  if(!authBar) return;
  if(!user){
    if(authStateLabel) authStateLabel.textContent = '未ログイン (匿名モード)';
    if(btnGoogle) btnGoogle.style.display='inline-flex';
    if(btnLogout) btnLogout.style.display='none';
    if(btnAnon) btnAnon.style.display='none';
    return;
  }
  const isAnon = user.isAnonymous || (anonToggle && anonToggle.checked);
  const name = isAnon? '匿名' : (user.displayName || 'ユーザー');
  if(authStateLabel) authStateLabel.textContent = `ログイン: ${name}`;
  if(btnGoogle) btnGoogle.style.display = isAnon? 'inline-flex':'none';
  if(btnLogout) btnLogout.style.display = user.isAnonymous? 'none':'inline-flex';
  if(btnAnon) btnAnon.style.display = user.isAnonymous? 'none':'inline-flex';
}
function canSubmitNow(){
  const last = Number(localStorage.getItem('comment:lastTime')||'0');
  const diff = Date.now() - last;
  return diff > 30_000; // 30秒
}
function remainSeconds(){
  const last = Number(localStorage.getItem('comment:lastTime')||'0');
  const diff = Date.now() - last; return Math.max(0, 30 - Math.floor(diff/1000));
}
function updateSubmitState(){
  if(!submitBtn) return;
  submitBtn.disabled = !canSubmitNow();
  if(!canSubmitNow()) submitBtn.innerText = `あと${remainSeconds()}秒`; else submitBtn.innerText='送信';
}
let countdownTimer=null;
function startCountdown(){
  if(countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(()=>{
    updateSubmitState();
    if(canSubmitNow()){ clearInterval(countdownTimer); }
  },1000);
}

// ---- 認証 ----
infoEl && (infoEl.textContent = '認証初期化中...');
// まず現在の状態を捕捉 (セッションが残っている可能性)
// 未ログインであれば匿名にサインイン
onAuthStateChanged(auth, user=>{
  if(user){
    setAuthInfo(user.isAnonymous? '匿名で投稿できます。':'Googleログイン中');
    attachListenersOnce();
    renderAuthState(user);
  } else {
    signInAnonymously(auth).catch(e=>{
      console.error('anon auth error', e); setAuthInfo('匿名認証失敗');
    });
  }
});

// Googleログイン処理
async function doGoogleSignIn(){
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
    setStatus('Googleログイン成功', true);
  } catch(e){
    console.error(e); setStatus('Googleログイン失敗');
  }
}
async function doLogout(){
  try {
    await signOut(auth);
    await signInAnonymously(auth); // すぐ匿名へ戻す
    setStatus('ログアウトしました', true);
  }catch(e){ console.error(e); setStatus('ログアウト失敗'); }
}
function forceAnonMode(){
  // 実際には匿名再サインイン (既に匿名でなければ)
  const user = auth.currentUser;
  if(user && !user.isAnonymous){
    doLogout();
  } else {
    setStatus('既に匿名モード', true);
  }
}

// attachListeners を一度だけ実行 (認証状態変化で複数回つかないよう保護)
let listenersAttached=false;
function attachListenersOnce(){
  if(listenersAttached) return; listenersAttached=true; attachListeners();
  // ボタンイベント
  bindAuthElements();
  btnGoogle && btnGoogle.addEventListener('click', e=>{ e.preventDefault(); doGoogleSignIn(); });
  btnLogout && btnLogout.addEventListener('click', e=>{ e.preventDefault(); doLogout(); });
  btnAnon && btnAnon.addEventListener('click', e=>{ e.preventDefault(); forceAnonMode(); });
  // 匿名モードトグル (Googleログイン中のみ意味)
  if(anonToggle){
    anonToggle.addEventListener('change', ()=>{
      const user = auth.currentUser;
      if(!user || user.isAnonymous){ return; }
      // チェックON -> 匿名表示扱い (サーバーに匿名化せず表示名だけ匿名)
      renderAuthState(user);
    });
  }
}

// ---- Firestore リスナー ----
let unsubscribe = null;
function attachListeners(){
  if(!db) return;
  if(unsubscribe) unsubscribe();
  const q = query(collection(db, 'pages', PAGE_ID, 'comments'), orderBy('created','desc'), limit(100));
  unsubscribe = onSnapshot(q, snap=>{
    listEl.innerHTML='';
    if(snap.empty){
      noCommentsEl.style.display='block';
    } else {
      noCommentsEl.style.display='none';
      snap.forEach(doc=>{
        const d = doc.data();
        const node = tpl.content.cloneNode(true);
        const nEl = node.querySelector('.c-name');
        const tEl = node.querySelector('.c-time');
        const bEl = node.querySelector('.c-body');
        nEl.textContent = (d.name || '匿名');
        tEl.textContent = d.created && d.created.toDate? formatDate(d.created.toDate()) : '';
        bEl.innerHTML = sanitize(d.body||'');
        listEl.appendChild(node);
      });
    }
  }, err=>{
    console.error(err); setStatus('読み込みエラー', false);
  });
}

// ---- 入力監視 ----
if(form){
  const ta = form.querySelector('textarea[name="comment"]');
  ta && ta.addEventListener('input', ()=>{
    if(lengthEl){ lengthEl.textContent = `${ta.value.length} / 500`; }
    submitBtn.disabled = ta.value.trim().length===0 || !canSubmitNow();
  });
  const nameInput = form.querySelector('input[name="displayName"]');
  nameInput && nameInput.addEventListener('input', ()=>{
    nameInput.value = nameInput.value.replace(/[\r\n]/g,'');
  });
  updateSubmitState();
  startCountdown();

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const taEl = form.comment;
    const nameEl = form.displayName;
    const bodyRaw = (taEl.value||'').trim();
    // ---- BOT / スパム 追加バリデーション ----
    // 1) App Check / Google ログインのいずれも無い & AppCheck失敗時は拒否
    const user = auth.currentUser;
    if(!user){ setStatus('認証未完了'); return; }
    if(user.isAnonymous && !appCheckTokenValid){
      setStatus('reCAPTCHA 検証未完了 (後で再読み込み)'); return;
    }
    // 2) ハニーポット (値が入っていたら BOT 判定)
    if(honey && honey.value.trim() !== ''){
      setStatus('BOT検出: 投稿拒否'); return; }
    // 3) URL / リンク過多 (単純 http/https 個数 > 3 で拒否)
    const linkCount = (bodyRaw.match(/https?:\/\//gi)||[]).length;
    if(linkCount > 3){ setStatus('リンク数が多すぎます (最大3)'); return; }
    // 4) 同一本文連投 (直前 localStorage 保存)
    const lastBody = localStorage.getItem('comment:lastBody');
    if(lastBody && lastBody === bodyRaw){ setStatus('同一内容の連続投稿はできません'); return; }
    if(!bodyRaw){ setStatus('コメントを入力してください'); return; }
    if(bodyRaw.length > 500){ setStatus('文字数超過'); return; }
    if(!canSubmitNow()){ setStatus(`連投規制: ${remainSeconds()}秒後`); return; }
    submitBtn.disabled = true; submitBtn.textContent='送信中...';
    setStatus('送信中...', true);
    try {
      const isForceAnon = (anonToggle && anonToggle.checked);
      let nameCandidate = (nameEl.value||'').trim().slice(0,24);
      if(!nameCandidate){
        if(user && !user.isAnonymous && !isForceAnon){
          nameCandidate = (user.displayName || 'ユーザー').slice(0,24);
        } else {
          nameCandidate = '匿名';
        }
      }
      const name = nameCandidate;
      // 簡易 NG ワードフィルタ (最低限) -> 伏字
      const NG = ['死ね','殺す','バカ'];
      let body = bodyRaw; NG.forEach(w=>{ const re=new RegExp(w,'gi'); body = body.replace(re, '＊'.repeat(w.length)); });
      // 連続改行制限 (4行以上連続を2行に)
      body = body.replace(/(\n{3,})/g,'\n\n');
      const fingerprint = PAGE_ID + '|' + name + '|' + body.slice(0,32) + '|' + Date.now();
      const hash = await hashString(fingerprint);
      await addDoc(collection(db, 'pages', PAGE_ID, 'comments'), {
        name,
        body,
        created: serverTimestamp(),
        hash
      });
      taEl.value=''; if(lengthEl) lengthEl.textContent='0 / 500';
      localStorage.setItem('comment:lastTime', String(Date.now()));
      localStorage.setItem('comment:lastBody', bodyRaw);
      updateSubmitState(); startCountdown();
      setStatus('投稿しました', true);
    } catch(err){
      console.error(err); setStatus('送信失敗');
    } finally {
      submitBtn.disabled=false; updateSubmitState();
    }
  });
}

reloadBtn && reloadBtn.addEventListener('click', ()=>{
  setStatus('再読込...', true); attachListeners();
});

// ページ離脱時クリーンアップ
window.addEventListener('beforeunload',()=>{ if(unsubscribe) unsubscribe(); });

console.log('[comments] initialized for', PAGE_ID);
