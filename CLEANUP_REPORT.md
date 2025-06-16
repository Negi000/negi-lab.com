# 🧹 negi-lab.com ファイル整理レポート

## ❌ 削除すべき無駄なファイル

### scripts/ ディレクトリ内の試作版・重複ファイル
- `site-manager-basic.ps1` - 試作版（削除推奨）
- `site-manager-pure.ps1` - 試作版（削除推奨）
- `site-manager-simple.ps1` - 試作版（削除推奨）
- `site-manager-working.ps1` - 試作版（削除推奨）
- `site-consistency.ps1` - 古いバージョン（削除推奨）
- `site-manager.ps1` - 文字化け版（削除推奨）

### ルートディレクトリ内の重複・不要ファイル
- `SITE_MANAGEMENT.md` - 重複（SITE_MANAGEMENT_GUIDE.mdと統合済み）
- `SECURITY_COMPLETION_REPORT.md` - 作業完了報告（削除推奨）
- `test.html` - テストファイル（削除推奨）
- `index.js` - 未使用（削除推奨）
- `tsconfig.json` - TypeScript未使用（削除推奨）
- `cleanup.ps1` - 一時ファイル（作業完了後削除可）

### tools/ ディレクトリ内の誤作成ファイル
- `site-manager.ps1 status.html` - 誤作成（削除推奨）

### バッチファイルの整理
- `quick-manager.bat` - 機能重複（他のquick-*.batで代替可能）

## ✅ 保持すべき重要ファイル

### 🔧 実行スクリプト（必須）
- `scripts/simple-consistency.ps1` - **メイン管理スクリプト**
- `scripts/new-tool.ps1` - **新規ツール作成**
- `site-manager.ps1` - **統合管理スクリプト**（文字化け修正版）

### 🚀 ワンクリック実行ファイル（便利）
- `quick-check.bat` - 一貫性チェック
- `quick-fix.bat` - 自動修正  
- `quick-new.bat` - 新規ツール作成
- `quick-menu.bat` - メニュー表示

### 📁 設定・テンプレート（必須）
- `config/site-config.json` - サイト設定
- `templates/tool-template.html` - ツールテンプレート
- `.github/workflows/site-consistency.yml` - CI/CD設定

### 📖 ドキュメント（重要）
- `README_FINAL.md` - **メイン使用ガイド**
- `QUICK_START.md` - クイックスタート
- `SITE_MANAGEMENT_GUIDE.md` - 詳細ガイド

### 🌐 Webサイトファイル（必須）
- `index.html` - メインページ
- `tools/*.html` - 各ツール（13個）
- `privacy-policy.html`, `terms.html` 等 - 法的ページ

## 🎯 推奨削除コマンド

```cmd
# scripts内の試作版を削除
del scripts\site-manager-basic.ps1
del scripts\site-manager-pure.ps1
del scripts\site-manager-simple.ps1
del scripts\site-manager-working.ps1
del scripts\site-consistency.ps1

# 重複・不要ファイルを削除
del SITE_MANAGEMENT.md
del SECURITY_COMPLETION_REPORT.md
del test.html
del index.js
del tsconfig.json
del cleanup.ps1

# 誤作成ファイルを削除
del "tools\site-manager.ps1 status.html"

# バッチファイル整理
del quick-manager.bat
```

## 📊 削除後の理想的なファイル構成

```
negi-lab.com/
├── scripts/
│   ├── simple-consistency.ps1    ✅ メイン
│   └── new-tool.ps1              ✅ 新規作成
├── config/
│   └── site-config.json          ✅ 設定
├── templates/
│   └── tool-template.html        ✅ テンプレート
├── .github/workflows/
│   └── site-consistency.yml      ✅ CI/CD
├── tools/                        ✅ 13個のツール
├── quick-check.bat               ✅ ワンクリック
├── quick-fix.bat                 ✅ ワンクリック
├── quick-new.bat                 ✅ ワンクリック
├── README_FINAL.md               ✅ メインガイド
├── QUICK_START.md                ✅ 簡単ガイド
└── (その他Webサイトファイル)      ✅ 必要
```

## 💾 削除予定ファイルサイズ削減

- **削除ファイル数**: 約12個
- **推定サイズ削減**: 数百KB〜数MB
- **管理しやすさ**: 大幅改善

---

**結論**: 上記の削除を実行することで、リポジトリが大幅にクリーンアップされ、管理しやすくなります。
