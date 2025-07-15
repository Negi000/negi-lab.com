# カラーコードツール - ローカル開発サーバー起動方法

## ローカル開発サーバーの起動

### Python 3を使用（推奨）
```bash
# プロジェクトルートディレクトリで実行
cd "C:\Users\241822\Desktop\新しいフォルダー (2)\negi-lab.com"
python -m http.server 8000
```

### Node.jsを使用
```bash
# npx（Node.js 5.2.0以降）
npx http-server -p 8000

# または
npm install -g http-server
http-server -p 8000
```

### Visual Studio Code Live Server拡張機能
1. VS Codeで「Live Server」拡張機能をインストール
2. HTMLファイルを右クリック → "Open with Live Server"

## アクセス方法
- ブラウザで `http://localhost:8000/tools/color-code-tool.html` にアクセス

## CORS問題の解決
- ローカルHTTPサーバーを使用することで、file://プロトコルでのCORS制限を回避
- 全ての外部スクリプトとモジュールが正常に読み込まれます
- 本格的な機能テストが可能になります

## 注意事項
- 本番環境では適切なWebサーバー（Apache、Nginx等）を使用
- Tailwind CSS CDNは開発専用（本番では事前ビルド推奨）
- セキュリティ機能も完全に動作します
