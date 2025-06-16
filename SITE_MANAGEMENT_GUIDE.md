# negi-lab.com サイト管理システム

このドキュメントでは、negi-lab.comのサイト一貫性を保つための自動化システムの使用方法を説明します。

## 📁 ファイル構成

```
negi-lab.com/
├── config/
│   └── site-config.json          # サイト設定ファイル
├── templates/
│   └── tool-template.html        # ツールテンプレート
├── scripts/
│   ├── simple-consistency.ps1    # 一貫性チェック・更新スクリプト
│   ├── new-tool.ps1              # 新規ツール作成スクリプト
│   └── site-manager.js           # Node.js管理スクリプト（予備）
├── .github/workflows/
│   └── site-consistency.yml      # CI/CD自動チェック
├── tools/                        # 各種ツール
└── package.json                  # NPMスクリプト定義
```

## 🚀 基本的な使用方法

### 1. 一貫性チェック

全ツールファイルの一貫性をチェックします：

```powershell
# PowerShellで直接実行
.\scripts\simple-consistency.ps1 -action validate

# NPMスクリプト経由
npm run validate
npm run check
```

### 2. 一括更新・修正

不足している要素を全ツールに自動追加します：

```powershell
# PowerShellで直接実行
.\scripts\simple-consistency.ps1 -action update

# NPMスクリプト経由
npm run update
npm run fix
```

### 3. 新しいツール作成

テンプレートから新しいツールを作成します：

```powershell
.\scripts\new-tool.ps1 -toolName "ツール名" -toolDescription "ツールの説明"
```

**例:**
```powershell
.\scripts\new-tool.ps1 -toolName "パスワード生成ツール" -toolDescription "安全で強力なパスワードを生成できるツールです。"
```

## 🔧 詳細設定

### 一貫性チェック項目

現在、以下の要素をチェックしています：

- ✅ **TailwindCSS**: `tailwindcss`の存在
- ✅ **CSPヘッダー**: `Content-Security-Policy`の存在
- ✅ **セキュリティヘッダー**: `X-Content-Type-Options`の存在
- ✅ **フッターセクション**: `<footer`の存在
- ✅ **メタディスクリプション**: `name="description"`の存在
- ✅ **ガイドモーダル**: `guideModal`の存在
- ✅ **独自性セクション**: `独自性`の文言の存在

### 自動追加される要素

`update`コマンドを実行すると、以下が自動的に追加されます：

1. **ガイドモーダル**: 使い方ガイドのモーダルウィンドウ
2. **独自性・運営方針・免責事項セクション**: 3カラムレイアウトの説明セクション

## 🎯 新規ツール作成時の手順

1. **テンプレート生成**
   ```powershell
   .\scripts\new-tool.ps1 -toolName "新しいツール" -toolDescription "説明"
   ```

2. **ツール機能実装**
   - `tools/新しいツール.html`を編集
   - `<!-- TOOL_CONTENT_START -->`と`<!-- TOOL_CONTENT_END -->`の間にツール固有のHTMLを実装
   - JavaScriptの`processInput()`関数をツール用にカスタマイズ

3. **一貫性チェック**
   ```powershell
   .\scripts\simple-consistency.ps1 -action validate
   ```

4. **インデックスページへのリンク追加**
   - `index.html`に新しいツールへのリンクを手動で追加

## 🔄 CI/CD自動チェック

GitHubリポジトリにプッシュすると、以下が自動実行されます：

- **トリガー**: `tools/*.html`、設定ファイル、テンプレートの変更
- **チェック内容**:
  - PowerShellによる一貫性チェック
  - HTMLの基本構文チェック
  - セキュリティヘッダーの存在確認
- **レポート**: 結果はGitHub Actionsのアーティファクトとして保存

## 📝 設定ファイル

### config/site-config.json

サイト全体の共通設定を管理：

```json
{
  "site": {
    "name": "negi-lab.com",
    "url": "https://negi-lab.com",
    "title": "negi-lab.com - 便利ツール＆ゲーム情報ポータル"
  },
  "security": {
    "csp": "default-src 'self'; ..."
  }
}
```

### package.json

NPMスクリプトの定義：

```json
{
  "scripts": {
    "validate": "powershell -ExecutionPolicy Bypass -File scripts/simple-consistency.ps1 -action validate",
    "update": "powershell -ExecutionPolicy Bypass -File scripts/simple-consistency.ps1 -action update",
    "check": "npm run validate",
    "fix": "npm run update",
    "dev": "npm run validate && npm run update",
    "test": "npm run validate"
  }
}
```

## 🛠️ トラブルシューティング

### PowerShell実行ポリシーエラー

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 文字化け問題

- すべてのスクリプトはUTF-8で保存
- PowerShellでは`-Encoding UTF8`オプションを使用

### 一貫性チェックが失敗する場合

1. 各ツールファイルの基本構造を確認
2. 必要な要素が存在するか手動チェック
3. `update`コマンドで自動修正を試行

## 🔮 今後の拡張予定

- [ ] **HTMLバリデーション**: W3C Markup Validatorとの連携
- [ ] **パフォーマンス監視**: Lighthouse スコアの自動測定
- [ ] **アクセシビリティチェック**: WCAG準拠チェック
- [ ] **SEO最適化**: メタタグやstructured dataの自動生成
- [ ] **多言語対応**: 翻訳システムとの連携

## 📞 サポート

問題が発生した場合：

1. **ログ確認**: PowerShellの出力を確認
2. **手動チェック**: 該当ファイルを直接確認
3. **再実行**: スクリプトを再度実行
4. **GitHub Issues**: 継続的な問題はIssueとして報告

---

**更新日**: 2025年6月16日  
**バージョン**: 1.0.0  
**管理者**: negi-lab.com
