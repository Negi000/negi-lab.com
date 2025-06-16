# 🧹 最終クリーンアップ指示書

## 📋 クリーンアップ実行手順

### 1. 自動クリーンアップ実行
```
final-cleanup.bat をダブルクリック
```

### 2. 手動確認（必要に応じて）
```cmd
# scripts内の確認
dir scripts

# 以下のファイルのみ残るべき:
# - simple-consistency.ps1
# - new-tool.ps1

# 不要ファイルがあれば手動削除:
del scripts\site-manager.js
```

## ✅ クリーンアップ後の最終構成

### 📁 必須ディレクトリ
```
negi-lab.com/
├── .github/workflows/     ✅ CI/CD設定
├── config/               ✅ サイト設定  
├── templates/            ✅ テンプレート
├── scripts/              ✅ 管理スクリプト（2個のみ）
├── tools/                ✅ ツールHTML（14個）
└── data/                 ✅ データファイル
```

### 🚀 実行ファイル（ルート）
```
quick-check.bat           ✅ 一貫性チェック
quick-fix.bat             ✅ 自動修正
quick-new.bat             ✅ 新規ツール作成
site-manager.ps1          ✅ 統合管理（修正版）
```

### 📖 ドキュメント（ルート）
```
README_FINAL.md           ✅ メイン使用ガイド
QUICK_START.md            ✅ クイックスタート
SITE_MANAGEMENT_GUIDE.md  ✅ 詳細ガイド
CLEANUP_REPORT.md         ✅ 今回の整理レポート
```

### 🌐 Webサイトファイル
```
index.html                ✅ メインページ
about.html, terms.html等  ✅ 法的ページ
robots.txt, sitemap.xml   ✅ SEO
package.json             ✅ NPM設定
```

## ❌ 削除されるファイル（計12個）

### scripts/ 内の試作版（6個）
- site-manager-basic.ps1
- site-manager-pure.ps1  
- site-manager-simple.ps1
- site-manager-working.ps1
- site-consistency.ps1
- site-manager.js

### ルート内の不要ファイル（5個）
- SITE_MANAGEMENT.md
- SECURITY_COMPLETION_REPORT.md
- test.html
- index.js
- tsconfig.json

### その他（1個）
- tools/site-manager.ps1 status.html

## 📊 効果

- **ファイル数削減**: 12個削除
- **容量削減**: 数百KB
- **管理性向上**: 大幅改善
- **混乱回避**: 重複ファイル除去

---

**実行後は `final-cleanup.bat` と `CLEANUP_REPORT.md` も削除可能です。**
