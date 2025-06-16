# 🚀 negi-lab.com サイト管理システム - クイックスタートガイド

## 📖 5分で理解する使い方

### 🎯 このシステムでできること

- ✅ **一貫性チェック**: 全ツールファイルが統一された形式になっているか確認
- 🔧 **自動修正**: 不足している要素（フッター、ガイドモーダル等）を自動追加
- 🆕 **新規ツール作成**: テンプレートから新しいツールを簡単作成

---

## 🎮 超簡単！ワンクリック操作

### 💻 Windows用 (.batファイル)

| ファイル | 機能 | 使用タイミング |
|---------|------|---------------|
| `quick-check.bat` | 一貫性チェック | 編集後の確認時 |
| `quick-fix.bat` | 自動修正 | 問題発見時 |
| `quick-new.bat` | 新規ツール作成 | 新しいツール追加時 |
| `quick-menu.bat` | メニュー表示 | すべての機能にアクセス |

**使い方**: ダブルクリックするだけ！

---

## ⌨️ PowerShell / コマンドライン操作

### 🔍 一貫性チェック（最重要！）
```powershell
# 方法1: メインスクリプト
.\site-manager.ps1 validate

# 方法2: 直接実行
.\scripts\simple-consistency.ps1 -action validate

# 方法3: バッチファイル
.\quick-check.bat
```

### 🔧 自動修正
```powershell
# 方法1: メインスクリプト
.\site-manager.ps1 update

# 方法2: 直接実行
.\scripts\simple-consistency.ps1 -action update

# 方法3: バッチファイル
.\quick-fix.bat
```

### 🆕 新規ツール作成
```powershell
# 方法1: ウィザード形式
.\site-manager.ps1 new-tool

# 方法2: 直接指定
.\scripts\new-tool.ps1 -toolName "ツール名" -toolDescription "説明"

# 方法3: バッチファイル
.\quick-new.bat
```

### 📊 インタラクティブメニュー
```powershell
# メニュー表示
.\site-manager.ps1

# または
.\quick-menu.bat
```

---

## 📋 日常的な作業フロー

### 🔄 ツール編集後の確認（推奨）
1. ツールファイルを編集
2. `quick-check.bat` をダブルクリック
3. 問題があれば `quick-fix.bat` をダブルクリック

### 🆕 新しいツール作成
1. `quick-new.bat` をダブルクリック
2. ツール名と説明を入力
3. 作成された `tools/ツール名.html` を編集
4. `index.html` にリンクを追加

### 🚨 トラブル時
1. `quick-fix.bat` を実行
2. まだ問題があれば `quick-check.bat` で詳細確認
3. 手動で修正後、再度チェック

---

## 📝 チェック項目一覧

システムが自動確認・修正する要素：

- ✅ **TailwindCSS**: デザインフレームワーク
- ✅ **セキュリティヘッダー**: XSS対策等
- ✅ **フッター**: サイト下部の統一フッター
- ✅ **ガイドモーダル**: 使い方説明ポップアップ
- ✅ **独自性セクション**: サイト方針・免責事項
- ✅ **メタディスクリプション**: SEO対策

---

## 🎨 新規ツール作成時のカスタマイズ

作成されたテンプレートの編集ポイント：

```html
<!-- TOOL_CONTENT_START -->
<!-- ここにツール固有のHTMLを追加 -->
<!-- TOOL_CONTENT_END -->
```

```javascript
// processInput()関数をカスタマイズ
function processInput() {
    // ツール固有の処理をここに実装
}
```

---

## 🔧 設定ファイル

- `config/site-config.json`: サイト全体設定
- `templates/tool-template.html`: 新規ツールテンプレート
- `SITE_MANAGEMENT_GUIDE.md`: 詳細ドキュメント

---

## 💡 使用例

```powershell
# 例1: 毎日の作業開始時
.\quick-check.bat

# 例2: ツール編集後
# ファイル編集 → quick-check.bat → (問題があれば) quick-fix.bat

# 例3: 新機能追加
.\quick-new.bat
# → "パスワード生成ツール" と入力
# → "強力なパスワードを自動生成" と入力
# → tools/パスワード生成ツール.html が作成される
```

---

## ⚡ 最短ルート

**❓ とりあえず確認したい**
→ `quick-check.bat` をダブルクリック

**🔧 問題を直したい**
→ `quick-fix.bat` をダブルクリック

**🆕 新しいツールを作りたい**
→ `quick-new.bat` をダブルクリック

**❓ 詳しく操作したい**
→ `quick-menu.bat` をダブルクリック

---

**🎉 これだけで、サイト全体の一貫性が保たれます！**
