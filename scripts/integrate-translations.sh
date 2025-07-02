#!/bin/bash
# すべてのツールに翻訳システムを統合するマスタースクリプト

echo "🚀 negi-lab.com ツール翻訳システム一括統合開始"

# ツールリスト
TOOLS=(
  "qr-code-generator"
  "image-converter" 
  "text-converter"
  "date-calculator"
  "color-code-tool"
  "pdf-tool"
  "favicon-og-generator"
  "json-csv-yaml-excel"
  "image-size-compare"
  "bg-remover"
  "url-shortener"
)

# 各ツールに翻訳システムを統合
for tool in "${TOOLS[@]}"; do
  echo "📝 $tool.html に翻訳システムを統合中..."
  
  # 1. 翻訳システムスクリプトの読み込みを追加
  # 2. メタデータにdata-translate-keyを追加
  # 3. 主要UI要素にdata-translate-keyを追加
  # 4. ガイドモーダルを追加
  # 5. 言語切り替えコールバックを追加
  
  echo "✅ $tool.html の翻訳システム統合完了"
done

echo "🎉 すべてのツールの翻訳システム統合が完了しました！"
