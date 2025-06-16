# 🛠️ サイト一貫性管理システム

このシステムは、negi-lab.comの全ツールファイルの一貫性を保つために設計されました。

## 📁 ファイル構成

```
├── config/
│   └── site-config.json          # サイト全体の設定ファイル
├── templates/
│   └── tool-template.html        # ツール用ベーステンプレート
├── scripts/
│   ├── site-manager.js           # メイン管理スクリプト（Node.js）
│   └── site-manager.ps1          # PowerShell版管理スクリプト
└── package.json                  # Node.js プロジェクト設定
```

## 🚀 基本的な使い方

### 1. 全ツールファイルの一括更新
```powershell
# PowerShellの場合
.\scripts\site-manager.ps1 update

# Node.jsの場合
npm run update
```

### 2. サイト一貫性チェック
```powershell
# PowerShellの場合
.\scripts\site-manager.ps1 check

# Node.jsの場合
npm run check
```

### 3. 新しいツールの生成
```powershell
# PowerShellの場合
.\scripts\site-manager.ps1 generate -ToolName "Image Converter" -ToolKey "image-converter" -ToolDescription "Convert images between formats"

# Node.jsの場合
node scripts/site-manager.js generate "Image Converter" "image-converter" "Convert images between formats"
```

## ⚙️ 設定ファイル（config/site-config.json）

```json
{
  "site": {
    "name": "negi-lab.com",           # サイト名
    "year": "2025",                   # コピーライト年
    "contact_email": "...",           # お問い合わせメール
    "analytics_id": "...",            # Google Analytics ID
    "adsense_client": "..."           # AdSense クライアントID
  },
  "security": {
    "csp": "...",                     # Content Security Policy
    "headers": {...}                  # セキュリティヘッダー
  },
  "common_sections": {
    "uniqueness": "...",              # 独自性テキスト
    "policy": "...",                  # 運営方針テキスト
    "disclaimer": "..."               # 免責事項テキスト
  },
  "theme": {
    "colors": {
      "negi": "#65c155",             # メインカラー
      "accent": "#4ADE80"            # アクセントカラー
    }
  },
  "styles": {
    "form_input": "...",             # フォーム入力スタイル
    "form_button": "...",            # ボタンスタイル
    "drop_area": "..."               # ドロップエリアスタイル
  }
}
```

## 🎯 主な機能

### 1. 自動一貫性管理
- **ヘッダー**: 全ページで統一されたナビゲーション
- **フッター**: 同一のリンク構造とコピーライト
- **セキュリティヘッダー**: CSP、XSS保護など
- **独自性・運営方針・免責事項**: 統一されたテキスト
- **カラーテーマ**: サイト全体で一貫した色使い

### 2. テンプレートベース生成
- 新しいツール作成時は、テンプレートから自動生成
- 手動での重複作業を排除
- 設定ファイルの値が自動適用

### 3. 一括更新機能
- 設定変更時に全ツールを一括更新
- 個別のファイル編集が不要
- エラーチェック機能付き

## 🔧 カスタマイズ方法

### 1. サイト情報の変更
`config/site-config.json`の`site`セクションを編集後：
```powershell
.\scripts\site-manager.ps1 update
```

### 2. デザインテーマの変更
`config/site-config.json`の`theme`セクションを編集後：
```powershell
.\scripts\site-manager.ps1 update
```

### 3. 共通テキストの変更
`config/site-config.json`の`common_sections`セクションを編集後：
```powershell
.\scripts\site-manager.ps1 update
```

## 📝 新しいツールを作成する手順

1. **ツールを生成**
   ```powershell
   .\scripts\site-manager.ps1 generate -ToolName "My Tool" -ToolKey "my-tool" -ToolDescription "Tool description"
   ```

2. **生成されたファイルを編集**
   - `tools/my-tool.html`が作成される
   - `{{TOOL_CONTENT}}`部分にツール固有の内容を追加
   - 必要に応じて外部スクリプトやスタイルを追加

3. **一貫性をチェック**
   ```powershell
   .\scripts\site-manager.ps1 check
   ```

## 🔍 トラブルシューティング

### Node.jsが見つからない場合
```bash
# Node.jsをインストール
# https://nodejs.org/ からダウンロード
```

### 権限エラーが発生する場合
```powershell
# PowerShellの実行ポリシーを確認
Get-ExecutionPolicy

# 必要に応じて変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 一貫性チェックでエラーが出る場合
```powershell
# 詳細なエラー確認
.\scripts\site-manager.ps1 check

# エラー内容に従って修正後、再度更新
.\scripts\site-manager.ps1 update
```

## 📈 今後の拡張予定

- [ ] CI/CD統合（GitHub Actions）
- [ ] 多言語対応の自動化
- [ ] パフォーマンス最適化の自動適用
- [ ] SEO最適化の自動チェック
- [ ] アクセシビリティ検査の統合

## 📞 サポート

質問や問題がある場合は、以下にお問い合わせください：
- Email: negilab.com@gmail.com
- GitHub Issues: [リポジトリのIssuesページ]

---

**重要**: このシステムを使用することで、サイト全体の一貫性が保たれ、手動での修正作業が大幅に削減されます。新しいツールを作成する際や、サイト全体の変更を行う際は、必ずこのシステムを使用してください。
