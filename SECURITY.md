# セキュリティ改善実装ガイド

このドキュメントは、negi-lab.comに実装されたセキュリティ改善について説明します。

## 実装済みセキュリティ機能

### 1. Content Security Policy (CSP)
全てのHTMLファイルに以下のCSPヘッダーを設定：

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://cdn.tailwindcss.com 
    https://cdn.jsdelivr.net 
    https://unpkg.com; 
  style-src 'self' 'unsafe-inline' 
    https://fonts.googleapis.com 
    https://cdn.tailwindcss.com; 
  font-src 'self' 
    https://fonts.gstatic.com; 
  img-src 'self' data: blob:; 
  connect-src 'self'; 
  object-src 'none'; 
  base-uri 'self';
" />
```

**効果**: XSS攻撃、データ注入攻撃を防止

### 2. Subresource Integrity (SRI)
外部CDNから読み込むリソースにintegrity属性を追加：

```html
<script src="https://cdn.tailwindcss.com" 
        integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" 
        crossorigin="anonymous"></script>
```

**効果**: 改ざんされたライブラリの読み込みを防止

### 3. セキュリティヘッダー
以下のヘッダーを全ページに設定：

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
```

**効果**: MIME型スニッフィング、クリックジャッキング、XSS攻撃を防止

### 4. 入力値検証とサニタイズ
#### SecurityUtils.js
- `escapeHtml()`: HTMLエスケープ
- `sanitizeInput()`: 入力値のサニタイズ
- `validateFileType()`: ファイルタイプ検証
- `validateFileSize()`: ファイルサイズ検証
- `validateUrl()`: URL検証

#### 使用例:
```javascript
// 安全な入力値取得
const userInput = CommonUtils.getFormValue('inputId', true, 1000);
const sanitized = SecurityUtils.sanitizeInput(userInput);

// ファイル検証
if (!SecurityUtils.validateFileType(file, ['image/jpeg', 'image/png'])) {
  SecurityUtils.showUserError('無効なファイル形式です');
  return;
}
```

### 5. エラーハンドリング強化
#### ユーザー向けメッセージ
```javascript
SecurityUtils.showUserError('分かりやすいエラーメッセージ');
SecurityUtils.showSuccessMessage('操作が完了しました');
```

#### 開発者向けログ
```javascript
SecurityUtils.showUserError('ユーザー向けメッセージ', technicalError);
```

### 6. GitHub Actions セキュリティ
アクションのバージョンを特定のコミットハッシュに固定：

```yaml
- uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7
- uses: actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b # v4.0.3
```

## コード品質改善

### 1. セマンティックHTML
```html
<main role="main">
  <section role="banner">
    <h1>メインタイトル</h1>
  </section>
  <aside aria-label="スポンサー広告">
    <!-- 広告コンテンツ -->
  </aside>
</main>
```

### 2. 共通ユーティリティ関数
#### CommonUtils.js
- `showLoading()` / `hideLoading()`: ローディング表示制御
- `downloadFile()`: セキュアなファイルダウンロード
- `previewImage()`: 安全な画像プレビュー
- `copyToClipboard()`: クリップボード操作
- `localStorage`: 安全なローカルストレージ操作

### 3. パフォーマンス監視
```javascript
CommonUtils.measurePerformance('処理名', () => {
  // 処理コード
});
```

## 新しいツール追加時のチェックリスト

### HTML テンプレート
1. ✅ セキュリティヘッダーの追加 (`/templates/security-headers.html`を参照)
2. ✅ CSPの設定
3. ✅ SRIの実装
4. ✅ セマンティックHTMLの使用

### JavaScript セキュリティ
1. ✅ `SecurityUtils.js`を読み込み
2. ✅ 入力値の検証とサニタイズ
3. ✅ ファイルアップロード検証
4. ✅ エラーハンドリングの実装

### アクセシビリティ
1. ✅ ARIA属性の適切な使用
2. ✅ キーボードナビゲーション対応
3. ✅ スクリーンリーダー対応

## セキュリティ定期チェック項目

### 月次チェック
- [ ] 依存ライブラリの脆弱性チェック
- [ ] CSPログの確認
- [ ] アクセスログの異常検知

### 四半期チェック
- [ ] SRIハッシュの更新
- [ ] GitHub Actionsのバージョン確認
- [ ] セキュリティヘッダーの見直し

## 追加推奨セキュリティ対策

### 1. サーバーサイド
- HTTPSの強制
- HSTS (HTTP Strict Transport Security)
- セキュリティヘッダーのサーバー設定

### 2. 監視
- セキュリティログの監視
- 異常なアクセスパターンの検知
- 定期的なセキュリティスキャン

### 3. バックアップ
- 定期的なコードバックアップ
- 設定ファイルのバージョン管理
- 災害復旧計画

## 連絡先
セキュリティに関する問題を発見した場合は、以下まで連絡してください：
- GitHub Issues: [リポジトリURL]/issues
- メール: security@negi-lab.com

---
最終更新: 2025年6月16日
