# Site Consistency Checker
# Simple PowerShell script to check site consistency

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("validate", "update", "generate")]
    [string]$action,
    
    [string]$toolName = ""
)

function Test-SiteConsistency {
    Write-Host "Checking site consistency..." -ForegroundColor Green
    
    $toolsDir = "tools"
    $inconsistencies = @()
    
    if (Test-Path $toolsDir) {
        $htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html" -File
        
        foreach ($file in $htmlFiles) {
            Write-Host "Checking: $($file.Name)" -ForegroundColor Yellow
            
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            # Check for required elements
            $missingElements = @()
            
            if (-not ($content -match 'tailwindcss')) {
                $missingElements += "TailwindCSS"
            }
            if (-not ($content -match 'Content-Security-Policy')) {
                $missingElements += "CSP Header"
            }
            if (-not ($content -match 'X-Content-Type-Options')) {
                $missingElements += "Security Headers"
            }
            if (-not ($content -match '<footer')) {
                $missingElements += "Footer Section"
            }
            if (-not ($content -match 'name="description"')) {
                $missingElements += "Meta Description"
            }
            if (-not ($content -match 'id="guideModal"')) {
                $missingElements += "Guide Modal"
            }
            if (-not ($content -match '独自性・運営方針・免責事項')) {
                $missingElements += "Uniqueness Section"
            }
            
            foreach ($missing in $missingElements) {
                $inconsistencies += "File: $($file.Name) - Missing: $missing"
            }
        }
    }
    
    if ($inconsistencies.Count -eq 0) {
        Write-Host "All files are consistent!" -ForegroundColor Green
    } else {
        Write-Host "Found inconsistencies:" -ForegroundColor Red
        $inconsistencies | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    }
    
    return $inconsistencies.Count
}

function Update-AllTools {
    Write-Host "Starting mass update of all tool files..." -ForegroundColor Green
    
    # 共通のセキュリティヘッダーとフッター要素を定義
    $commonHeaders = @'
  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self'; 
    script-src 'self' 'unsafe-inline' 'unsafe-eval' 
      https://cdn.tailwindcss.com 
      https://cdn.jsdelivr.net 
      https://unpkg.com; 
    style-src 'self' 'unsafe-inline' 
      https://fonts.googleapis.com 
      https://cdn.tailwindcss.com; 
    font-src 'self' 
      https://fonts.gstatic.com; 
    img-src 'self' data: blob:; 
    connect-src 'self'; 
    object-src 'none'; 
    base-uri 'self';
  " />
  
  <!-- Security Headers -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
  <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
'@

    $commonFooter = @'
  <footer class="bg-gray-800 text-gray-300 py-8 text-center text-sm">
    <div class="container mx-auto">
      <p>&copy; 2024 negi-lab.com All rights reserved.</p>
      <p class="mt-2 text-xs text-gray-400">Powered by negi-lab.com</p>
    </div>
  </footer>
'@

    $uniquenessSection = @'
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
'@

    $guideModal = @'
    <!-- ガイドモーダル -->
    <div id="guideModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">使い方ガイド</h2>
            <button onclick="closeGuide()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>
          <div class="space-y-3 text-sm text-gray-600">
            <p>このツールの基本的な使い方をご説明します。</p>
            <ol class="list-decimal list-inside space-y-2">
              <li>必要な情報を入力してください</li>
              <li>設定を調整してください</li>
              <li>実行ボタンをクリックしてください</li>
              <li>結果を確認・ダウンロードしてください</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
'@

    $toolsDir = "tools"
    if (Test-Path $toolsDir) {
        $htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html" -File
        
        foreach ($file in $htmlFiles) {
            Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
            
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            # セキュリティヘッダーを追加/更新
            if (-not ($content -match 'Content-Security-Policy')) {
                $content = $content -replace '(<meta name="viewport"[^>]*>)', "`$1`n$commonHeaders"
                Write-Host "  Added security headers" -ForegroundColor Green
            }
            
            # フッターを追加（まだない場合）
            if (-not ($content -match '<footer')) {
                $content = $content -replace '(</body>)', "$commonFooter`n`$1"
                Write-Host "  Added footer" -ForegroundColor Green
            }
            
            # 独自性セクションを追加（まだない場合）
            if (-not ($content -match '独自性・運営方針・免責事項')) {
                $content = $content -replace '(<footer)', "$uniquenessSection`n`$1"
                Write-Host "  Added uniqueness section" -ForegroundColor Green
            }
            
            # ガイドモーダルを追加（まだない場合）
            if (-not ($content -match 'id="guideModal"')) {
                $content = $content -replace '(</body>)', "$guideModal`n`$1"
                Write-Host "  Added guide modal" -ForegroundColor Green
            }
            
            # ファイルを保存
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        }
    }
    
    Write-Host "Mass update completed!" -ForegroundColor Green
}

# Main execution
$startTime = Get-Date
Write-Host "Site Manager started at $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray

switch ($action) {
    "validate" {
        $errors = Test-SiteConsistency
        if ($errors -gt 0) {
            exit $errors
        }
    }
    "update" {
        Update-AllTools
    }
    "generate" {
        Write-Host "Generate functionality coming soon..." -ForegroundColor Yellow
    }
    default {
        Write-Error "Invalid action: $action"
        exit 1
    }
}

$endTime = Get-Date
Write-Host "Completed at $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
