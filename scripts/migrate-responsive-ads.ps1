# Responsive Ads Migration Script (PowerShell版)
# 全てのHTMLファイルに対してレスポンシブ広告システムを適用
# 2025-01-11 作成

param(
    [string]$RootPath = ".",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# 設定
$Config = @{
    AdClient = "ca-pub-1835873052239386"
    OldClients = @("ca-pub-6234639838467127")
    MobileSlots = @("8916646342", "3205934910", "6430083800")
    RequiredAssets = @(
        '<link rel="stylesheet" href="/js/responsive-ads.css">',
        '<script src="/js/responsive-ads-controller.js"></script>'
    )
    ExcludePatterns = @("*.backup", "*.min.html", "node_modules", ".git")
}

function Write-Progress-Custom {
    param($Message, $Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-ShouldSkipFile {
    param($FilePath)
    
    foreach ($pattern in $Config.ExcludePatterns) {
        if ($FilePath -like "*$pattern*") {
            return $true
        }
    }
    return $false
}

function Get-DeviceClass {
    param($SlotId)
    
    if ($Config.MobileSlots -contains $SlotId) {
        return " ad-sp"
    } else {
        return " ad-pc"
    }
}

function Update-HtmlFile {
    param($FilePath)
    
    if (Test-ShouldSkipFile $FilePath) {
        if ($Verbose) {
            Write-Progress-Custom "  ⚪ Skipped (excluded): $($FilePath | Split-Path -Leaf)" "Gray"
        }
        return $false
    }
    
    Write-Progress-Custom "Processing: $($FilePath | Split-Path -Leaf)"
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $originalContent = $content
        $hasChanges = $false
        
        # 1. 古いクライアントIDを置換
        foreach ($oldClient in $Config.OldClients) {
            if ($content -match [regex]::Escape($oldClient)) {
                $content = $content -replace [regex]::Escape($oldClient), $Config.AdClient
                $hasChanges = $true
                Write-Progress-Custom "  ✓ Updated client ID: $oldClient → $($Config.AdClient)" "Green"
            }
        }
        
        # 2. レスポンシブ広告アセットを追加
        $hasAssets = $false
        foreach ($asset in $Config.RequiredAssets) {
            if ($content -match [regex]::Escape($asset)) {
                $hasAssets = $true
                break
            }
        }
        
        if (-not $hasAssets) {
            # 挿入ポイントを検索
            $insertionMarkers = @(
                '<link rel="preconnect" href="https://pagead2.googlesyndication.com">',
                '<script src="https://cdn.tailwindcss.com"></script>',
                '</head>'
            )
            
            foreach ($marker in $insertionMarkers) {
                if ($content -match [regex]::Escape($marker)) {
                    $assetsText = "`n" + ($Config.RequiredAssets -join "`n")
                    $content = $content -replace [regex]::Escape($marker), "$marker$assetsText"
                    $hasChanges = $true
                    Write-Progress-Custom "  ✓ Added responsive ads assets after: $marker" "Green"
                    break
                }
            }
        }
        
        # 3. 広告要素のクラス修正
        $adPattern = '<ins\s+class="adsbygoogle"([^>]*?)data-ad-slot="([^"]*?)"([^>]*?)>'
        $matches = [regex]::Matches($content, $adPattern)
        
        foreach ($match in $matches) {
            $fullMatch = $match.Value
            $slotId = $match.Groups[2].Value
            
            # すでに適切なクラスが付いているかチェック
            if ($fullMatch -match '\s+ad-(pc|sp)\b') {
                continue
            }
            
            $deviceClass = Get-DeviceClass $slotId
            $updatedMatch = $fullMatch -replace 'class="adsbygoogle"', "class=`"adsbygoogle$deviceClass`""
            
            if ($updatedMatch -ne $fullMatch) {
                $content = $content -replace [regex]::Escape($fullMatch), $updatedMatch
                $hasChanges = $true
                Write-Progress-Custom "  ✓ Added device class$deviceClass to slot $slotId" "Green"
            }
        }
        
        # ファイルを更新
        if ($hasChanges) {
            if (-not $DryRun) {
                Set-Content $FilePath -Value $content -Encoding UTF8
                Write-Progress-Custom "  ✅ File updated: $($FilePath | Split-Path -Leaf)" "Cyan"
            } else {
                Write-Progress-Custom "  📝 Would update: $($FilePath | Split-Path -Leaf)" "Yellow"
            }
            return $true
        } else {
            Write-Progress-Custom "  ⚪ No changes needed: $($FilePath | Split-Path -Leaf)" "Gray"
            return $false
        }
        
    } catch {
        Write-Progress-Custom "  ❌ Error processing: $($_.Exception.Message)" "Red"
        return $false
    }
}

# メイン処理
function Main {
    Write-Progress-Custom "🚀 Starting Responsive Ads Migration..." "Magenta"
    
    if ($DryRun) {
        Write-Progress-Custom "⚠️  DRY RUN MODE - No files will be modified" "Yellow"
    }
    
    Write-Progress-Custom ""
    
    # HTMLファイルを検索
    $htmlFiles = Get-ChildItem -Path $RootPath -Filter "*.html" -Recurse | Where-Object { 
        -not (Test-ShouldSkipFile $_.FullName) 
    }
    
    Write-Progress-Custom "Found $($htmlFiles.Count) HTML files`n" "White"
    
    $processedCount = 0
    $updatedCount = 0
    
    foreach ($file in $htmlFiles) {
        $processedCount++
        if (Update-HtmlFile $file.FullName) {
            $updatedCount++
        }
        Write-Progress-Custom ""
    }
    
    Write-Progress-Custom "📊 Migration Summary:" "Magenta"
    Write-Progress-Custom "  Total files processed: $processedCount"
    Write-Progress-Custom "  Files updated: $updatedCount"
    Write-Progress-Custom "  Files unchanged: $($processedCount - $updatedCount)"
    Write-Progress-Custom "`n✅ Migration completed!" "Green"
}

# 実行
Main
