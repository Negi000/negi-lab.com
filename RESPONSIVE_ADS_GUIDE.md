# レスポンシブ広告システム導入ガイド

## 概要

PC用とスマホ用の広告が重複表示される問題を解決し、デバイスに応じて適切な広告のみを表示するレスポンシブ広告システムを導入しました。

## 変更内容

### 1. 新規ファイル

- `/js/responsive-ads-controller.js` - メイン制御スクリプト
- `/js/responsive-ads.css` - レスポンシブ広告専用スタイル
- `/scripts/migrate-responsive-ads.js` - Node.js版移行スクリプト  
- `/scripts/migrate-responsive-ads.ps1` - PowerShell版移行スクリプト
- `/test-responsive-ads.html` - テスト用ページ

### 2. 更新されたファイル

- `/js/ads-consent-loader.js` - レスポンシブ対応
- 全HTMLファイル（135ファイル） - アセット追加・広告クラス修正

## 広告スロットID一覧

### スマホ用
- **ボトム**: 8916646342
- **ミドル**: 3205934910  
- **トップ**: 6430083800

### PC用
- **ミドル**: 9898319477
- **ボトム**: 7843001775
- **トップ**: 4837564489

### 統一クライアントID
- **ca-pub-1835873052239386**

## システムの仕組み

### 1. デバイス判定
```javascript
function isMobileDevice() {
  const userAgent = navigator.userAgent || '';
  const screenWidth = window.innerWidth || screen.width || 1024;
  
  // ユーザーエージェントベースの判定
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // 画面幅ベースの判定（768px以下をモバイル）
  const mobileWidth = screenWidth <= 768;
  
  return mobileUA || mobileWidth;
}
```

### 2. 広告要素の制御
- PC環境：`.ad-sp` クラスの広告を非表示
- モバイル環境：`.ad-pc` クラスの広告を非表示

### 3. CSS制御
```css
/* モバイル時：PC用広告を非表示 */
@media (max-width: 768px) {
  .ad-pc {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* PC時：モバイル用広告を非表示 */
@media (min-width: 769px) {
  .ad-sp {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
```

## HTMLテンプレートの使用方法

### 広告の設置例
```html
<!-- HEAD内にアセットを追加 -->
<link rel="stylesheet" href="/js/responsive-ads.css">
<script src="/js/responsive-ads-controller.js"></script>

<!-- 広告ブロックの設置 -->
<div class="ad-block">
  <div class="ad-label">スポンサーリンク</div>
  <ins class="adsbygoogle ad-pc" 
       data-ad-client="ca-pub-1835873052239386" 
       data-ad-slot="4837564489" 
       data-ad-format="auto" 
       data-full-width-responsive="true" 
       data-ad-lazy="1"></ins>
  <ins class="adsbygoogle ad-sp" 
       data-ad-client="ca-pub-1835873052239386" 
       data-ad-slot="6430083800" 
       data-ad-format="auto" 
       data-full-width-responsive="true" 
       data-ad-lazy="1"></ins>
</div>
```

## 動的広告作成API

### 広告要素の動的作成
```javascript
// トップ広告の作成
const adElement = window.ResponsiveAds.createAdElement('top', true);

// 現在のデバイス判定
const isMobile = window.ResponsiveAds.isMobileDevice();

// 重複広告の修正
window.ResponsiveAds.fixDuplicateAds();
```

## テスト方法

### 1. 基本テスト
1. `/test-responsive-ads.html` にアクセス
2. デバッグ情報でデバイス判定を確認
3. PC用・スマホ用広告が適切に表示されることを確認

### 2. レスポンシブテスト
1. ブラウザの開発者ツールでデバイス表示を切り替え
2. 画面幅を変更して広告の切り替わりを確認
3. 実機でのテスト

### 3. デバッグモード
```javascript
// デバッグモードの有効化（ブラウザコンソール）
localStorage.setItem('adsDebug', '1');
location.reload();
```

## トラブルシューティング

### よくある問題

#### 1. 広告が2行で表示される
**原因**: 古いHTMLファイルが残っている  
**解決**: 移行スクリプトを再実行

#### 2. 広告が表示されない
**原因**: アセットファイルの読み込み失敗  
**解決**: ファイルパスとサーバー設定を確認

#### 3. モバイル判定が不正確
**原因**: デバイス判定ロジックの調整が必要  
**解決**: `isMobileDevice()` 関数の条件を調整

### ログの確認
```javascript
// ブラウザコンソールでの確認
console.log('Device Type:', document.body.getAttribute('data-device-type'));
console.log('Screen Width:', window.innerWidth);
console.log('Mobile Device:', window.ResponsiveAds?.isMobileDevice());
```

## 更新履歴

### 2025-01-11
- レスポンシブ広告システム導入
- 全HTMLファイルに自動適用
- テスト環境構築完了

## メンテナンス

### 定期チェック項目
1. 新規HTMLファイル作成時のアセット追加
2. 広告スロットIDの変更時の一括更新
3. デバイス判定ロジックの精度確認

### アップデート方法
1. 新しいスロットIDを `responsive-ads-controller.js` の `AD_SLOTS` オブジェクトで更新
2. 必要に応じて移行スクリプトを実行
3. テストページで動作確認

## サポート

問題や質問がある場合は、以下を確認してください：

1. ブラウザコンソールのエラーメッセージ
2. ネットワークタブでのアセット読み込み状況
3. デバッグ情報の出力内容

技術的な詳細や高度な設定については、ソースコードのコメントを参照してください。
