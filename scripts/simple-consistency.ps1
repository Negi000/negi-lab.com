# Simple Site Consistency Checker
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("validate", "update")]
    [string]$action
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
            
            if (-not ($content -like "*tailwindcss*")) {
                $missingElements += "TailwindCSS"
            }
            if (-not ($content -like "*Content-Security-Policy*")) {
                $missingElements += "CSP Header"
            }
            if (-not ($content -like "*X-Content-Type-Options*")) {
                $missingElements += "Security Headers"
            }
            if (-not ($content -like "*<footer*")) {
                $missingElements += "Footer Section"
            }
            if (-not ($content -like "*description*")) {
                $missingElements += "Meta Description"
            }
            if (-not ($content -like "*guideModal*")) {
                $missingElements += "Guide Modal"
            }            if (-not ($content -like "*独自性*")) {
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

function Add-MissingElements {
    Write-Host "Adding missing elements to tool files..." -ForegroundColor Green
    
    $toolsDir = "tools"
    if (Test-Path $toolsDir) {
        $htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html" -File
        
        foreach ($file in $htmlFiles) {
            Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
            
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            $modified = $false
            
            # Add guide modal if missing
            if (-not ($content -like "*guideModal*")) {
                $guideModal = "`n    <!-- ガイドモーダル -->`n    <div id=`"guideModal`" class=`"hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4`">`n      <div class=`"bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto`">`n        <div class=`"p-6`">`n          <div class=`"flex justify-between items-center mb-4`">`n            <h2 class=`"text-xl font-bold text-gray-800`">使い方ガイド</h2>`n            <button onclick=`"closeGuide()`" class=`"text-gray-500 hover:text-gray-700 text-xl`">&times;</button>`n          </div>`n          <div class=`"space-y-3 text-sm text-gray-600`">`n            <p>このツールの基本的な使い方をご説明します。</p>`n          </div>`n        </div>`n      </div>`n    </div>`n"
                $content = $content -replace "</body>", "$guideModal`n  </body>"
                $modified = $true
                Write-Host "  Added guide modal" -ForegroundColor Green
            }
              # Add uniqueness section if missing
            if (-not ($content -like "*独自性*")) {
                $uniquenessSection = "`n    <!-- 独自性・運営方針・免責事項 -->`n    <section class=`"bg-gray-50 border-t border-gray-200 py-12`" id=`"uniqueness`">`n      <div class=`"container mx-auto px-4 max-w-4xl`">`n        <h2 class=`"text-2xl font-bold text-gray-800 mb-6 text-center`">独自性・運営方針・免責事項</h2>`n        <div class=`"grid md:grid-cols-3 gap-6 text-sm text-gray-600`">`n          <div class=`"bg-white p-4 rounded-lg border`">`n            <h3 class=`"font-semibold text-gray-800 mb-2`">🎯 独自性</h3>`n            <p>negi-lab.comは、実用性と使いやすさを重視したオリジナルツールを提供します。</p>`n          </div>`n          <div class=`"bg-white p-4 rounded-lg border`">`n            <h3 class=`"font-semibold text-gray-800 mb-2`">📋 運営方針</h3>`n            <p>無料で安全に利用できるWebツールの提供を目指します。</p>`n          </div>`n          <div class=`"bg-white p-4 rounded-lg border`">`n            <h3 class=`"font-semibold text-gray-800 mb-2`">⚠️ 免責事項</h3>`n            <p>本ツールの利用は自己責任でお願いします。</p>`n          </div>`n        </div>`n      </div>`n    </section>`n"
                $content = $content -replace "<footer", "$uniquenessSection`n  <footer"
                $modified = $true
                Write-Host "  Added uniqueness section" -ForegroundColor Green
            }
            
            if ($modified) {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8
                Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
            } else {
                Write-Host "  No changes needed for: $($file.Name)" -ForegroundColor Gray
            }
        }
    }
}

# Main execution
$startTime = Get-Date
Write-Host "Site Manager started at $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray

switch ($action) {
    "validate" {
        $errors = Test-SiteConsistency
        if ($errors -gt 0) {
            Write-Host "`nTo fix these issues, run: .\scripts\site-consistency.ps1 -action update" -ForegroundColor Yellow
        }
    }
    "update" {
        Add-MissingElements
        Write-Host "`nRunning validation after update..." -ForegroundColor Blue
        Test-SiteConsistency | Out-Null
    }
    default {
        Write-Error "Invalid action: $action"
        exit 1
    }
}

$endTime = Get-Date
Write-Host "Completed at $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
