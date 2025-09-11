# Wiki Text Length Analyzer (PowerShell版)
# Wikiページの文字数を分析して適切な広告制御値を設定
# 2025-01-11 作成

param(
    [string]$RootPath = ".",
    [switch]$Verbose = $false
)

# 設定
$Config = @{
    WikiPaths = @(
        "gamewiki\FellowMoon\site\characters",
        "gamewiki\FellowMoon\site\roms", 
        "gamewiki\FellowMoon\site"
    )
    ExcludePatterns = @("*template*.html", "*index.html", "*search.html")
}

function Get-HtmlTextContent {
    param($FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # HTMLタグを除去
        $textOnly = $content -replace '<script[^>]*>.*?</script>', '' `
                              -replace '<style[^>]*>.*?</style>', '' `
                              -replace '<[^>]+>', ' ' `
                              -replace '&[^;]+;', ' ' `
                              -replace '\s+', ' '
        
        # ナビゲーション等のノイズを除去（簡易版）
        $cleanText = $textOnly -replace 'スポンサーリンク', '' `
                               -replace 'プライバシーポリシー', '' `
                               -replace '利用規約', '' `
                               -replace '運営者情報', '' `
                               -replace 'サイトマップ', ''
        
        return @{
            TotalLength = $textOnly.Trim().Length
            CleanLength = $cleanText.Trim().Length
            JapaneseLength = ([regex]::Matches($cleanText, '[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]')).Count
            AlphanumericLength = ([regex]::Matches($cleanText, '[a-zA-Z0-9]')).Count
        }
    }
    catch {
        Write-Warning "Error analyzing $FilePath`: $($_.Exception.Message)"
        return $null
    }
}

function Get-Statistics {
    param($Values)
    
    $sorted = $Values | Sort-Object
    $count = $sorted.Count
    
    if ($count -eq 0) { return $null }
    
    return @{
        Min = $sorted[0]
        Max = $sorted[-1]
        Mean = [math]::Round(($sorted | Measure-Object -Sum).Sum / $count)
        Median = $sorted[[math]::Floor($count / 2)]
        Q1 = $sorted[[math]::Floor($count * 0.25)]
        Q3 = $sorted[[math]::Floor($count * 0.75)]
        P90 = $sorted[[math]::Floor($count * 0.9)]
    }
}

function Generate-Recommendations {
    param($Stats)
    
    $cleanStats = $Stats.CleanLength
    
    return @{
        MinTextLength = [math]::Max(300, $cleanStats.Q1)
        TextLengthPerExtraSlot = [math]::Round($cleanStats.Median * 0.8)
        BaseDesktopAds = [math]::Min(8, [math]::Ceiling($cleanStats.Median / 1000 * 2))
        BaseMobileAds = [math]::Min(5, [math]::Ceiling($cleanStats.Median / 1000 * 1.5))
        MaxDesktopAds = [math]::Min(12, [math]::Ceiling($cleanStats.Max / $cleanStats.Median * 3))
        MaxMobileAds = [math]::Min(8, [math]::Ceiling($cleanStats.Max / $cleanStats.Median * 2))
    }
}

# メイン処理
function Main {
    Write-Host "🔍 Starting Wiki pages text length analysis..." -ForegroundColor Magenta
    Write-Host ""
    
    $allFiles = @()
    
    # 各Wikiパスからファイルを収集
    foreach ($wikiPath in $Config.WikiPaths) {
        $fullPath = Join-Path $RootPath $wikiPath
        Write-Host "Scanning: $fullPath"
        
        if (Test-Path $fullPath) {
            $files = Get-ChildItem -Path $fullPath -Filter "*.html" -Recurse | Where-Object {
                $shouldExclude = $false
                foreach ($pattern in $Config.ExcludePatterns) {
                    if ($_.Name -like $pattern) {
                        $shouldExclude = $true
                        break
                    }
                }
                return -not $shouldExclude
            }
            
            Write-Host "  Found $($files.Count) HTML files" -ForegroundColor Green
            $allFiles += $files
        }
        else {
            Write-Host "  ⚠️  Path not found: $fullPath" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Total files to analyze: $($allFiles.Count)" -ForegroundColor Cyan
    Write-Host ""
    
    # 各ファイルを分析
    $analyses = @()
    $processed = 0
    
    foreach ($file in $allFiles) {
        $processed++
        $analysis = Get-HtmlTextContent $file.FullName
        
        if ($analysis) {
            $analysis.FileName = $file.Name
            $analysis.FilePath = $file.FullName
            $analyses += $analysis
            
            if ($processed % 10 -eq 0 -or $processed -eq $allFiles.Count) {
                Write-Host "Progress: $processed/$($allFiles.Count) files processed"
            }
        }
    }
    
    if ($analyses.Count -eq 0) {
        Write-Host "❌ No files could be analyzed" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "📊 Calculating statistics..." -ForegroundColor Cyan
    
    # 統計計算
    $stats = @{
        TotalLength = Get-Statistics ($analyses | ForEach-Object { $_.TotalLength })
        CleanLength = Get-Statistics ($analyses | ForEach-Object { $_.CleanLength })
        JapaneseLength = Get-Statistics ($analyses | ForEach-Object { $_.JapaneseLength })
    }
    
    $recommendations = Generate-Recommendations $stats
    
    # レポート生成
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    $report = @"
# Wiki Pages Text Length Analysis Report
Generated: $timestamp

## Summary
- Total analyzed files: $($analyses.Count)
- Analysis metric: Clean text length (excluding navigation, ads, etc.)

## Text Length Statistics (characters)

### Clean Text Length
- MIN: $($stats.CleanLength.Min.ToString("N0"))
- MAX: $($stats.CleanLength.Max.ToString("N0"))
- MEAN: $($stats.CleanLength.Mean.ToString("N0"))
- MEDIAN: $($stats.CleanLength.Median.ToString("N0"))
- Q1 (25%): $($stats.CleanLength.Q1.ToString("N0"))
- Q3 (75%): $($stats.CleanLength.Q3.ToString("N0"))
- P90 (90%): $($stats.CleanLength.P90.ToString("N0"))

## Current vs Recommended Settings

### Current Settings (ads-consent-loader.js)
- textLengthPerExtraSlot: 1400
- baseDesktopCap: 8
- baseMobileCap: 5
- dynamicMaxDesktop: 12
- dynamicMaxMobile: 8

### Recommended Settings
- minTextLength: $($recommendations.MinTextLength) (for dynamic ads insertion)
- textLengthPerExtraSlot: $($recommendations.TextLengthPerExtraSlot)
- baseDesktopCap: $($recommendations.BaseDesktopAds)
- baseMobileCap: $($recommendations.BaseMobileAds)
- dynamicMaxDesktop: $($recommendations.MaxDesktopAds)
- dynamicMaxMobile: $($recommendations.MaxMobileAds)

## Top 20 Longest Pages
"@

    $topPages = $analyses | Sort-Object CleanLength -Descending | Select-Object -First 20
    $rank = 1
    foreach ($page in $topPages) {
        $report += "`n$rank. $($page.FileName) - $($page.CleanLength.ToString("N0")) chars"
        $rank++
    }

    $report += @"

## Recommendations for ads-consent-loader.js

Based on the analysis, here are the suggested configuration updates:

``````javascript
var CONFIG = {
  // ... other settings ...
  
  // Text-based thresholds
  minTextLengthForDynamicAds: $($recommendations.MinTextLength),
  textLengthPerExtraSlot: $($recommendations.TextLengthPerExtraSlot),
  
  // Ad caps
  baseDesktopCap: $($recommendations.BaseDesktopAds),
  baseMobileCap: $($recommendations.BaseMobileAds),
  dynamicMaxDesktop: $($recommendations.MaxDesktopAds),
  dynamicMaxMobile: $($recommendations.MaxMobileAds),
  
  // ... other settings ...
};
``````

## Implementation Notes

1. **minTextLengthForDynamicAds**: Pages shorter than this should not receive dynamic ads
2. **textLengthPerExtraSlot**: Every X characters allows one additional ad slot
3. **baseDesktopCap/baseMobileCap**: Minimum ad slots for average-length pages
4. **dynamicMax**: Maximum ad slots even for very long pages

These values are calculated based on the actual content length distribution of your wiki pages.
"@

    # レポート保存
    $reportPath = "WIKI_TEXT_ANALYSIS_REPORT.md"
    Set-Content -Path $reportPath -Value $report -Encoding UTF8
    
    # 画面に要約表示
    Write-Host ""
    Write-Host "📊 Analysis Results:" -ForegroundColor Magenta
    Write-Host "  Total files analyzed: $($analyses.Count)"
    Write-Host "  Average page length: $($stats.CleanLength.Mean.ToString("N0")) characters"
    Write-Host "  Median page length: $($stats.CleanLength.Median.ToString("N0")) characters"
    Write-Host ""
    Write-Host "🎯 Key Recommendations:" -ForegroundColor Green
    Write-Host "  Current textLengthPerExtraSlot: 1400 → Recommended: $($recommendations.TextLengthPerExtraSlot)"
    Write-Host "  Current baseDesktopCap: 8 → Recommended: $($recommendations.BaseDesktopAds)"
    Write-Host "  Current baseMobileCap: 5 → Recommended: $($recommendations.BaseMobileAds)"
    Write-Host ""
    Write-Host "📄 Detailed report saved to: $reportPath" -ForegroundColor Cyan
}

# 実行
Main
