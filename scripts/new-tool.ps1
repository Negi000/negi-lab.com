# New Tool Generator
param(
    [Parameter(Mandatory=$true)]
    [string]$toolName,
    
    [Parameter(Mandatory=$true)]
    [string]$toolDescription,
    
    [string]$toolCategory = "utility"
)

function New-ToolFromTemplate {
    param(
        [string]$name,
        [string]$description,
        [string]$category
    )
    
    Write-Host "Creating new tool: $name" -ForegroundColor Green
    
    # Template configuration
    $config = @{
        "site" = @{
            "name" = "negi-lab.com"
            "url" = "https://negi-lab.com"
            "title" = "negi-lab.com - 便利ツール＆ゲーム情報ポータル"
        }
        "security" = @{
            "csp" = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self';"
        }
    }
    
    $templateContent = @"
<!DOCTYPE html>
<html lang="ja" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" content="$($config.security.csp)" />
  
  <!-- Security Headers -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
  <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
  
  <title>$name - $($config.site.name)</title>
  <meta name="description" content="$description" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="$($config.site.name)" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="$name - $($config.site.name)" />
  <meta property="og:description" content="$description" />
  <meta property="og:url" content="$($config.site.url)" />
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" crossorigin="anonymous" />
  
  <!-- CSS Framework -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Tailwind Configuration -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            negi: "#65c155",
            accent: "#4ADE80"
          },
          fontFamily: { 
            inter: ["Inter", "sans-serif"] 
          }
        }
      }
    }
  </script>
  
  <!-- Custom Styles -->
  <style>
    .form-input, .form-select, .form-button {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition: box-shadow 0.2s;
    }
    
    .form-input:focus, .form-select:focus, .form-button:focus {
      outline: none;
      box-shadow: 0 0 0 2px #4ADE80;
      border-color: #4ADE80;
    }
    
    .form-button {
      background: #4ADE80;
      color: #fff;
      transition: background 0.15s, color 0.15s;
    }
    
    .form-button:hover:not(:disabled) {
      background: #10b981;
    }
    
    .form-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  </style>
</head>

<body class="bg-gray-50 font-inter">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a href="/" class="text-2xl font-bold text-negi hover:text-accent transition-colors">
            $($config.site.name)
          </a>
          <span class="text-gray-400">|</span>
          <h1 class="text-lg font-semibold text-gray-700">$name</h1>
        </div>
        <button onclick="showGuide()" class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
          使い方ガイド
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Tool Description -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-3">$name</h2>
        <p class="text-gray-600 mb-4">$description</p>
        
        <!-- TOOL_CONTENT_START -->
        <!-- TODO: Add your tool-specific content here -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">入力</label>
            <input type="text" id="toolInput" class="form-input w-full" placeholder="ここに入力してください" />
          </div>
          
          <button onclick="processInput()" class="form-button px-6 py-2 rounded-lg">
            実行
          </button>
          
          <div id="result" class="hidden bg-gray-50 p-4 rounded-lg border">
            <h3 class="font-semibold text-gray-800 mb-2">結果</h3>
            <div id="resultContent" class="text-gray-600"></div>
          </div>
        </div>
        <!-- TOOL_CONTENT_END -->
      </div>
    </div>
  </main>

  <!-- 独自性・運営方針・免責事項 -->
  <section class="bg-gray-50 border-t border-gray-200 py-12" id="uniqueness">
    <div class="container mx-auto px-4 max-w-4xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">独自性・運営方針・免責事項</h2>
      
      <div class="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div class="bg-white p-4 rounded-lg border">
          <h3 class="font-semibold text-gray-800 mb-2">🎯 独自性</h3>
          <p>negi-lab.comは、実用性と使いやすさを重視したオリジナルツールを提供します。ユーザーの日常業務や学習をサポートする独自機能を開発しています。</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <h3 class="font-semibold text-gray-800 mb-2">📋 運営方針</h3>
          <p>無料で安全に利用できるWebツールの提供を目指します。プライバシー保護を徹底し、広告やトラッキングを最小限に抑えた環境を維持します。</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <h3 class="font-semibold text-gray-800 mb-2">⚠️ 免責事項</h3>
          <p>本ツールの利用は自己責任でお願いします。データの紛失や誤動作による損害について、運営者は責任を負いかねます。重要なデータは事前にバックアップを推奨します。</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-800 text-gray-300 py-8 text-center text-sm">
    <div class="container mx-auto px-4">
      <p>&copy; 2024 $($config.site.name) All rights reserved.</p>
      <div class="flex justify-center space-x-6 mt-4">
        <a href="/" class="hover:text-white transition-colors">ホーム</a>
        <a href="/privacy-policy.html" class="hover:text-white transition-colors">プライバシーポリシー</a>
        <a href="/terms.html" class="hover:text-white transition-colors">利用規約</a>
      </div>
      <p class="mt-2 text-xs text-gray-400">Powered by $($config.site.name)</p>
    </div>
  </footer>

  <!-- ガイドモーダル -->
  <div id="guideModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">使い方ガイド</h2>
          <button onclick="closeGuide()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>$nameの基本的な使い方をご説明します。</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>入力フィールドに必要な情報を入力してください</li>
            <li>設定を調整してください（必要に応じて）</li>
            <li>「実行」ボタンをクリックしてください</li>
            <li>結果を確認し、必要に応じてダウンロードしてください</li>
          </ol>
          <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
            <p class="text-blue-800 text-xs">💡 ヒント: このツールはブラウザ上で動作し、データはサーバーに送信されません。</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- JavaScript -->
  <script>
    // Common utility functions
    function showGuide() {
      document.getElementById('guideModal').classList.remove('hidden');
    }
    
    function closeGuide() {
      document.getElementById('guideModal').classList.add('hidden');
    }
    
    // Close modal when clicking outside
    document.getElementById('guideModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeGuide();
      }
    });
    
    // Tool-specific functions
    function processInput() {
      const input = document.getElementById('toolInput').value;
      const resultDiv = document.getElementById('result');
      const resultContent = document.getElementById('resultContent');
      
      if (!input.trim()) {
        alert('入力が必要です。');
        return;
      }
      
      // TODO: Add your tool-specific processing logic here
      resultContent.textContent = `入力された内容: `$input`;
      resultDiv.classList.remove('hidden');
    }
    
    // Security: Prevent XSS
    function sanitizeHTML(str) {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    }
    
    // Error handling
    window.addEventListener('error', function(e) {
      console.error('Error occurred:', e.error);
    });
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      console.log('$name ツールが読み込まれました');
    });
  </script>
</body>
</html>
"@

    $fileName = "$name.html"
    $filePath = "tools\$fileName"
    
    Set-Content -Path $filePath -Value $templateContent -Encoding UTF8
    
    Write-Host "✅ Created: $filePath" -ForegroundColor Green
    Write-Host "📝 Tool Name: $name" -ForegroundColor Cyan
    Write-Host "📄 Description: $description" -ForegroundColor Cyan
    Write-Host "🏷️ Category: $category" -ForegroundColor Cyan
    
    # Update index page with new tool link
    $indexPath = "index.html"
    if (Test-Path $indexPath) {
        Write-Host "📌 Add the following link to your index.html manually:" -ForegroundColor Yellow
        Write-Host "<a href=`"tools/$fileName`" class=`"tool-link`">$name</a>" -ForegroundColor White
    }
    
    Write-Host "`n🎉 New tool created successfully!" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Edit tools/$fileName to add your specific functionality" -ForegroundColor Gray
    Write-Host "2. Replace the TODO comments with your tool logic" -ForegroundColor Gray
    Write-Host "3. Test the tool functionality" -ForegroundColor Gray
    Write-Host "4. Run consistency check: .\scripts\simple-consistency.ps1 -action validate" -ForegroundColor Gray
}

# Main execution
New-ToolFromTemplate -name $toolName -description $toolDescription -category $toolCategory
