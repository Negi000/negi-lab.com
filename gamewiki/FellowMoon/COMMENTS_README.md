# コメント機能導入ガイド (FellowMoon Wiki)

このガイドは `firebase-comments.js` を利用してキャラページやロムページにコメント欄を追加する手順です。

## 1. 仕組み概要
- Firebase Anonymous Auth でユーザー識別 (UID は DB へ直接保存しない設計)
- Firestore コレクション構造: `pages/{PAGE_ID}/comments/{autoId}`
- `PAGE_ID` は以下優先順で決定
  1. キャラテンプレート内の `#charMeta[data-char-id]` → `char_〇〇`
  2. URL のファイル名 (例: `xxx.html` → `page_xxx`)
- 1ページ最大 100 件を新しい順でリアルタイム取得

## 2. 必要ファイル
- `gamewiki/FellowMoon/js/firebase-comments.js`
- キャラテンプレート `generator/template.html` には既に組込み済

## 3. 他 (ROM など) の静的 HTML に組み込むには
1. コメントを置きたい位置に以下 HTML ブロックを追加:
```html
<section id="comments" class="card comment-section" data-comments-root>
  <h2>コメント</h2>
  <div id="commentInfo" style="font-size:.6rem;color:#789;margin:-.35rem 0 .6rem">読み込み中...</div>
  <form id="commentForm" style="display:flex;flex-direction:column;gap:.55rem" autocomplete="off">
    <label style="font-size:.65rem;color:#bcd;display:flex;flex-direction:column;gap:.25rem">名前 (任意 / 12文字以内)
      <input type="text" name="displayName" maxlength="12" placeholder="匿名" style="background:#141d24;border:1px solid #24323c;color:#e6edf3;padding:.5rem .6rem;font-size:.7rem;border-radius:6px" />
    </label>
    <label style="font-size:.65rem;color:#bcd;display:flex;flex-direction:column;gap:.25rem">コメント (最大500文字)
      <textarea name="comment" required maxlength="500" rows="4" placeholder="自由にどうぞ" style="resize:vertical;min-height:120px;background:#141d24;border:1px solid #24323c;color:#e6edf3;padding:.6rem .7rem;font-size:.72rem;line-height:1.5;border-radius:8px"></textarea>
    </label>
    <div style="display:flex;align-items:center;justify-content:space-between;font-size:.55rem;color:#789">
      <span id="commentLength">0 / 500</span>
      <span>荒らしは削除されます</span>
    </div>
    <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-top:.4rem">
      <button type="submit" id="commentSubmit" style="background:#2d4f63;border:1px solid #40697c;color:#cfe9ff;font-size:.7rem;font-weight:600;padding:.55rem 1.1rem;border-radius:8px;cursor:pointer;letter-spacing:.5px" disabled>送信</button>
      <button type="button" id="commentReload" style="background:#1d2831;border:1px solid #31424d;color:#9fc5dd;font-size:.65rem;padding:.5rem .9rem;border-radius:8px;cursor:pointer">再読み込み</button>
      <span id="commentStatus" style="font-size:.6rem;color:#789"></span>
    </div>
  </form>
  <div id="commentList" class="comment-list" style="margin:1rem 0 0;display:flex;flex-direction:column;gap:.65rem"></div>
  <template id="commentItemTemplate">
    <div class="comment-item" style="background:#151e25;border:1px solid #24323c;padding:.6rem .75rem;border-radius:10px;font-size:.7rem;line-height:1.45;position:relative">
      <div class="c-head" style="display:flex;align-items:center;gap:.5rem;margin:0 0 .25rem">
        <strong class="c-name" style="color:#9ec5ff;font-size:.68rem"></strong>
        <time class="c-time" style="font-size:.55rem;color:#678"></time>
      </div>
      <div class="c-body" style="white-space:pre-wrap"></div>
    </div>
  </template>
  <div id="noComments" style="display:none;font-size:.62rem;color:#567">まだコメントはありません。</div>
</section>
```
2. `<body>` 終了付近 (他スクリプトの後でOK) に以下行を追加:
```html
<script type="module" src="/gamewiki/FellowMoon/js/firebase-comments.js" defer></script>
```
3. キャラや ROM に固有 ID を与えたい場合は、任意で: 
```html
<span id="charMeta" data-char-id="ABC123" hidden></span>
<!-- ROM の場合 -->
<span id="romMeta" data-rom-id="R001" hidden></span>
```

## 4. Firestore セキュリティルール例
上部コメントのテンプレを `Firestore ルール` に設定してください。悪用防止のため:
- 読み取りは公開
- 作成のみ許可 (更新/削除は管理ツールから)
- フィールド・文字長を厳格チェック

## 5. 簡易スパム / XSS 対策
- `firebase-comments.js` 内で HTML エスケープ
- 30 秒間隔レート制限 (localStorage)
- 一部 NG ワード伏字 (必要に応じ強化)
- 連続空行制限
- App Check (reCAPTCHA v3) 初期化: 匿名投稿時は実質 reCAPTCHA トークンを要求 (Site Key を `firebase-comments.js` の `APP_CHECK_SITE_KEY` に設定)
- ハニーポット hidden input (`#hp_field`) で単純BOT排除
- リンク数 > 3 の投稿拒否 / 直前本文重複拒否

## 6. 将来の改善案
- reCAPTCHA Enterprise / Cloud Functions の IP レート制御
- 通報ボタン + ステータス フィールド追加
- ページ毎の総数キャッシュ (Cloud Functions onCreate trigger)

## 7. 既知の制限
### (追加) Google ログイン / 匿名切替について
実装済み UI 要素:
- `Googleでログイン` ボタン: ポップアップで Google アカウント認証
- `ログアウト`: Firebase セッションを破棄し即座に匿名へ再ログイン
- `匿名に戻す`: Google ログイン中でも完全に匿名セッションに切替 (再び匿名 UID)
- `投稿名を匿名化` チェック: Google ログイン状態を保持したまま、投稿時表示名のみ「匿名」にする（データベースへは `name` = 匿名で保存）

表示名決定優先順位:
1. 名前入力欄に文字があればその値 (最大24文字)
2. Google ログイン中で匿名化チェック OFF → Google DisplayName
3. それ以外 → `匿名`

保守メモ:
- 既存の匿名コメントとの区別は `name` だけでは困難（必要なら今後 `uidType: 'google'|'anon'` などフィールド追加）
- 追加フィールドを Firestore ルールで許可する場合は `keys().hasOnly([...])` のリスト拡張が必要

### App Check / reCAPTCHA 導入手順
1. Firebase Console > App Check > Web App に reCAPTCHA v3 の Site Key を登録
2. 得られた Site Key を `firebase-comments.js` 内 `APP_CHECK_SITE_KEY` に置換
3. ドメイン (negi-lab.com) を許可リストへ追加
4. 本番有効化後 Firestore ルールで `request.auth.token.firebase.app_id` / App Check enforcement を有効に検討

### さらに強化したい場合
- Cloud Functions で onCreate トリガーし IP ハッシュ + UID ごとの頻度制御
- Perspective API / OpenAI moderation 等による内容スコアリング (キューイング)
- URL ドメイン whitelist 制御 (現在は単純カウントのみ)
- 指紋 (User-Agent + 端末ヒント) を SHA-256 で匿名化保存し多重投稿分析

- Firestore 書き込みはユーザー側時計に依存せず `serverTimestamp` を利用
- 100 件以上は現状読み込まない (ページャ未実装)
- 削除 UI なし (管理専用ツール別途)

---
最小限の導入で動作するようにしてありますが、負荷や不正利用傾向を見て追加対策を検討してください。
