# negi-lab.com サイト管理システム - 実用ガイド

## 🎯 簡単操作方法

### ✅ 最も重要！一貫性チェック
```powershell
.\scripts\simple-consistency.ps1 -action validate
```

### 🔧 問題があった場合の自動修正
```powershell
.\scripts\simple-consistency.ps1 -action update
```

### 🆕 新しいツール作成
```powershell
.\scripts\new-tool.ps1 -toolName "ツール名" -toolDescription "説明"
```

## 📁 作成されたファイル

### 🚀 実行ファイル
- `quick-check.bat` - 一貫性チェック（ダブルクリック）
- `quick-fix.bat` - 自動修正（ダブルクリック）
- `quick-new.bat` - 新規ツール作成（ダブルクリック）
- `quick-menu.bat` - メニュー表示（ダブルクリック）

### ⚙️ 管理スクリプト
- `scripts/simple-consistency.ps1` - 一貫性チェック・修正（メイン）
- `scripts/new-tool.ps1` - 新規ツール作成
- `site-manager.ps1` - 統合管理スクリプト

### 📋 設定・テンプレート
- `config/site-config.json` - サイト設定
- `templates/tool-template.html` - ツールテンプレート
- `.github/workflows/site-consistency.yml` - CI/CD設定

### 📖 ドキュメント
- `QUICK_START.md` - 簡単使用方法
- `SITE_MANAGEMENT_GUIDE.md` - 詳細ガイド

## 🔄 日常の使い方

### 毎日の確認（推奨）
1. `quick-check.bat` をダブルクリック
2. 「All files are consistent!」が表示されればOK
3. 問題があれば `quick-fix.bat` で修正

### ツール編集後
1. HTMLファイルを編集
2. `quick-check.bat` で確認
3. 必要に応じて `quick-fix.bat` で修正

### 新規ツール追加
1. `quick-new.bat` をダブルクリック
2. ツール名と説明を入力
3. 作成されたHTMLファイルを編集
4. `index.html` にリンクを追加

## ✅ システムが保証する要素

全ツールファイルに以下が統一されています：

- ✅ **TailwindCSS** - 統一デザインシステム
- ✅ **セキュリティヘッダー** - XSS対策等
- ✅ **フッター** - サイト統一フッター
- ✅ **ガイドモーダル** - 使い方説明
- ✅ **独自性セクション** - 運営方針・免責事項
- ✅ **メタタグ** - SEO対策

## 🚨 トラブル時

### 「Missing」エラーが出る場合
```powershell
.\scripts\simple-consistency.ps1 -action update
```

### PowerShell実行エラー
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ファイルが見つからない
- ワーキングディレクトリがプロジェクトルートか確認
- `cd "c:\Users\241822\Desktop\新しいフォルダー (2)\negi-lab.com"`

## 📊 現在の状況

- **総ツール数**: 13個 + α
- **一貫性**: ✅ 全ファイル統一済み
- **自動化**: ✅ チェック・修正・作成すべて自動化
- **CI/CD**: ✅ GitHub Actions設定済み

---

**🎉 これで negi-lab.com は完全に一貫性が保たれた状態で運用できます！**

---

最終更新: 2025年6月16日  
システムバージョン: 1.0 完成版
