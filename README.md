# negi-lab.com

多機能なWebツール集 - 完全静的サイト（GitHub Pages + GitHub Actions）

## 🚀 特徴

- **完全静的**: 外部CDN依存なし、GitHub Pages/GitHub Actions のみで動作
- **超多機能QRコード生成ツール**: 15種類以上のデータ形式に対応
- **一括生成**: CSV/JSON対応、ZIP形式エクスポート
- **GitHub Actions連携**: 自動QRコード生成ワークフロー
- **プライバシー重視**: ASP規約準拠、明確な同意システム

## 🛠️ ツール一覧

### QRコード生成ツール (`/tools/qr-code-generator.html`)

**対応データ形式:**
- 📝 テキスト/URL
- 📧 メールアドレス（件名・本文付き）
- 📞 電話番号・SMS
- 👤 vCard（連絡先）
- 📱 MeCard（名刺）
- 🌐 Wi-Fi接続情報
- 📅 カレンダーイベント
- 📍 位置情報（GPS座標）
- 💰 暗号通貨アドレス（BTC, ETH, LTC, DOGE）
- 🎵 YouTube・Spotify URL
- 📺 Zoom会議・PayPal決済

**高度な機能:**
- 🎨 カスタムカラー・グラデーション
- 🖼️ ロゴ合成（サイズ・影・縁取り調整）
- 📦 一括生成（最大100件、ZIP出力）
- 📊 生成統計・履歴管理
- 🔗 URL短縮機能
- 🎯 テンプレート保存・管理
- 🔌 Webhook連携
- 🤖 GitHub Actions YAML自動生成

## 🚀 GitHub Actions 自動化

### セットアップ

1. `.github/workflows/qr-generator.yml` を配置
2. `data/` フォルダにデータファイル作成
3. リポジトリにプッシュ

### 使用方法

**テキストファイル方式:**
```
data/qr-data.txt に1行1データで記述
```

**JSON バッチ方式:**
```json
{
  "files": [
    {
      "filename": "website-qr.png",
      "data": "https://negi-lab.com"
    },
    {
      "filename": "contact-qr.png", 
      "data": "mailto:contact@example.com"
    }
  ]
}
```

**手動実行:**
GitHub Actions タブから「workflow_dispatch」で手動実行可能

### 生成物

- `output/` フォルダに PNG ファイル生成
- `generation-summary.json` で生成ログ確認
- GitHub Artifacts で一括ダウンロード

## 📁 プロジェクト構成

```
negi-lab.com/
├── .github/workflows/
│   └── qr-generator.yml      # GitHub Actions ワークフロー
├── data/
│   ├── qr-data.txt          # テキスト形式データ
│   └── qr-batch.json        # JSON バッチデータ
├── tools/
│   ├── qr-code-generator.html # QRコード生成ツール
│   ├── color-code-tool.html   # カラーコードツール
│   └── other-tools.html       # その他ツール
├── output/                   # 自動生成QRコード（Actions）
└── README.md
```

## 🔒 プライバシー・規約

- **ASP規約準拠**: Amazon・楽天アフィリエイト適切運用
- **同意システム**: Cookie使用の明確な同意取得
- **透明性**: 運営方針・免責事項明記
- **データ保護**: ローカルストレージ活用、外部送信最小限

## 🌐 デプロイ

GitHub Pages で自動デプロイ:
1. リポジトリ設定 → Pages → Source: GitHub Actions
2. 自動ビルド・デプロイ実行
3. `https://yourusername.github.io/reponame/` でアクセス

## ⚡ 技術的特徴

- **ゼロ依存**: 外部CDN・npm パッケージ不要
- **Progressive Enhancement**: 基本機能 → 高度機能の段階的実装
- **レスポンシブ**: Tailwind CSS でモバイル対応
- **アクセシビリティ**: ARIA対応、キーボードナビゲーション
- **SEO最適化**: 構造化データ、メタタグ、サイトマップ

## 📈 パフォーマンス

- ⚡ 高速読み込み（CDN依存なし）
- 📱 モバイルファースト設計
- 🔄 Service Worker 対応（PWA化可能）
- 📊 Core Web Vitals 最適化

## 🤝 コントリビューション

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📜 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 📞 お問い合わせ

- Website: [negi-lab.com](https://negi-lab.com)
- Email: negilab.com@gmail.com
- GitHub Issues: バグ報告・機能要求

---

**🌟 完全静的サイトで実現する最高のQRコード生成体験をお楽しみください！**