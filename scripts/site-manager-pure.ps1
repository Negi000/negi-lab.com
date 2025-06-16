# Node.jsに依存しないPowerShell版サイト管理スクリプト

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("update", "check", "generate", "help")]
    [string]$Command,
    
    [string]$ToolName,
    [string]$ToolKey,
    [string]$ToolDescription
)

# 設定ファイルパス
$configPath = "config\site-config.json"
$templatePath = "templates\tool-template.html"

# 設定ファイルを読み込む関数
function Get-SiteConfig {
    if (-not (Test-Path $configPath)) {
        Write-Error "設定ファイルが見つかりません: $configPath"
        exit 1
    }
    
    try {
        $configContent = Get-Content $configPath -Raw -Encoding UTF8
        return $configContent | ConvertFrom-Json
    }
    catch {
        Write-Error "設定ファイルの読み込みエラー: $_"
        exit 1
    }
}

# テンプレートファイルを読み込む関数
function Get-Template {
    if (-not (Test-Path $templatePath)) {
        Write-Error "テンプレートファイルが見つかりません: $templatePath"
        exit 1
    }
    
    return Get-Content $templatePath -Raw -Encoding UTF8
}

# プレースホルダーを置換する関数
function Replace-Placeholders {
    param(
        [string]$Content,
        [hashtable]$Replacements
    )
    
    foreach ($key in $Replacements.Keys) {
        $Content = $Content -replace [regex]::Escape($key), $Replacements[$key]
    }
    
    return $Content
}

# 設定を適用する関数
function Apply-Config {
    param(
        [string]$Content,
        [object]$Config
    )
    
    # フッターリンクを生成
    $footerLinks = @()
    foreach ($link in $Config.footer_links) {
        $footerLinks += "<a href=`"$($link.url)`" class=`"underline hover:text-accent mx-2`">$($link.text)</a>"
    }
    $footerLinksHtml = $footerLinks -join "`n      "
    
    # Analytics スクリプトを生成
    $analyticsScript = @"
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=$($Config.site.adsense_client)" crossorigin="anonymous"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=$($Config.site.analytics_id)"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '$($Config.site.analytics_id)');
  </script>
"@

    # プレースホルダーの置換辞書
    $replacements = @{
        '{{CSP_CONTENT}}' = $Config.security.csp
        '{{SITE_NAME}}' = $Config.site.name
        '{{SITE_YEAR}}' = $Config.site.year
        '{{NEGI_COLOR}}' = $Config.theme.colors.negi
        '{{ACCENT_COLOR}}' = $Config.theme.colors.accent
        '{{FORM_INPUT_STYLE}}' = $Config.styles.form_input
        '{{FORM_INPUT_FOCUS_STYLE}}' = $Config.styles.form_input_focus
        '{{FORM_BUTTON_STYLE}}' = $Config.styles.form_button
        '{{FORM_BUTTON_HOVER_STYLE}}' = $Config.styles.form_button_hover
        '{{FORM_BUTTON_DISABLED_STYLE}}' = $Config.styles.form_button_disabled
        '{{DROP_AREA_STYLE}}' = $Config.styles.drop_area
        '{{DROP_AREA_DRAGOVER_STYLE}}' = $Config.styles.drop_area_dragover
        '{{PREVIEW_IMAGE_STYLE}}' = $Config.styles.preview_image
        '{{UNIQUENESS_TEXT}}' = $Config.common_sections.uniqueness
        '{{POLICY_TEXT}}' = $Config.common_sections.policy
        '{{DISCLAIMER_TEXT}}' = $Config.common_sections.disclaimer
        '{{FOOTER_LINKS}}' = $footerLinksHtml
        '{{ANALYTICS_SCRIPT}}' = $analyticsScript
    }
    
    return Replace-Placeholders -Content $Content -Replacements $replacements
}

# フッターを更新する関数
function Update-Footer {
    param(
        [string]$Content,
        [object]$Config
    )
    
    $footerLinks = @()
    foreach ($link in $Config.footer_links) {
        $footerLinks += "      <a href=`"$($link.url)`" class=`"underline hover:text-accent mx-2`">$($link.text)</a>"
    }
    $footerLinksHtml = $footerLinks -join "`n"
    
    $newFooter = @"
  <footer class="bg-gray-800 text-gray-300 py-8 text-center text-sm">
    <nav class="mb-2">
$footerLinksHtml
    </nav>
    <div>&copy; $($Config.site.year) $($Config.site.name)</div>
  </footer>
"@
    
    $footerPattern = '<footer class="bg-gray-800[^>]*>[\s\S]*?</footer>'
    if ($Content -match $footerPattern) {
        $Content = $Content -replace $footerPattern, $newFooter
    }
    
    return $Content
}

# 独自性・運営方針・免責事項セクションを更新する関数
function Update-PolicySection {
    param(
        [string]$Content,
        [object]$Config
    )
    
    $newSection = @"
  <section class="mt-12 mb-8 text-sm text-gray-700 bg-white rounded-lg p-4 border border-gray-200 max-w-xl mx-auto" aria-label="このツールについて">
    <h2 class="font-bold text-base mb-2">negi-lab.comの独自性・運営方針・免責事項</h2>
    <ul class="list-disc ml-5 mb-2">
      <li>$($Config.common_sections.uniqueness)</li>
      <li>$($Config.common_sections.policy)</li>
      <li>$($Config.common_sections.disclaimer)</li>
    </ul>
    <p class="text-xs text-gray-500">&copy; $($Config.site.year) $($Config.site.name)</p>
  </section>
"@
    
    $sectionPattern = '<section[^>]*aria-label="このツールについて"[^>]*>[\s\S]*?</section>'
    if ($Content -match $sectionPattern) {
        $Content = $Content -replace $sectionPattern, $newSection
    }
    
    return $Content
}

# 一貫性チェック関数
function Test-Consistency {
    $config = Get-SiteConfig
    $issues = @()
    
    Write-Host "🔍 サイト一貫性チェック中..." -ForegroundColor Yellow
    
    $toolFiles = Get-ChildItem "tools\*.html" -ErrorAction SilentlyContinue
    
    if (-not $toolFiles) {
        Write-Host "⚠️  toolsディレクトリにHTMLファイルが見つかりません" -ForegroundColor Yellow
        return
    }
    
    foreach ($file in $toolFiles) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # セキュリティヘッダーのチェック
        if ($content -notmatch 'Content-Security-Policy') {
            $issues += "$($file.Name): CSPヘッダーが見つかりません"
        }
        
        # フッターのチェック
        if ($content -notmatch "&copy; $($config.site.year)") {
            $issues += "$($file.Name): フッターのコピーライト年が一致しません"
        }
        
        # 共通セクションのチェック
        if ($content -notmatch 'negi-lab\.comの独自性・運営方針・免責事項') {
            $issues += "$($file.Name): 独自性・運営方針・免責事項セクションが見つかりません"
        }
          # Tailwind設定のチェック
        if ($content -notmatch 'tailwind\.config') {
            $issues += "$($file.Name): Tailwind設定が見つかりません"
        }
    }
    
    if ($issues.Count -eq 0) {
        Write-Host "✅ 一貫性チェック完了: 問題は見つかりませんでした" -ForegroundColor Green
    } else {
        Write-Host "⚠️  一貫性の問題が見つかりました:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Red
        }
    }
}

# 全ツール更新関数
function Update-AllTools {
    $config = Get-SiteConfig
    
    Write-Host "🔄 全ツールファイルを更新中..." -ForegroundColor Yellow
    
    $toolFiles = Get-ChildItem "tools\*.html" -ErrorAction SilentlyContinue
    
    if (-not $toolFiles) {
        Write-Host "⚠️  toolsディレクトリにHTMLファイルが見つかりません" -ForegroundColor Yellow
        return
    }
    
    foreach ($file in $toolFiles) {
        Write-Host "📝 $($file.Name)を更新中..." -ForegroundColor Cyan
        
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            # フッターを更新
            $content = Update-Footer -Content $content -Config $config
            
            # 独自性・運営方針・免責事項セクションを更新
            $content = Update-PolicySection -Content $content -Config $config
            
            # CSPを更新
            $cspPattern = '<meta http-equiv="Content-Security-Policy" content="[^"]*" />'
            $newCSP = "<meta http-equiv=`"Content-Security-Policy`" content=`"$($config.security.csp)`" />"
            if ($content -match $cspPattern) {
                $content = $content -replace $cspPattern, $newCSP
            }
            
            # カラーテーマを更新
            $content = $content -replace 'negi:\s*"[^"]*"', "negi: `"$($config.theme.colors.negi)`""
            $content = $content -replace 'accent:\s*"[^"]*"', "accent: `"$($config.theme.colors.accent)`""
            
            # ファイルに書き戻し
            $content | Set-Content $file.FullName -Encoding UTF8
            
            Write-Host "  ✅ $($file.Name) 更新完了" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ $($file.Name) 更新エラー: $_" -ForegroundColor Red
        }
    }
    
    Write-Host "✅ 全ツールファイルの更新が完了しました" -ForegroundColor Green
}

# メイン処理
switch ($Command) {
    "update" {
        Update-AllTools
    }
    
    "check" {
        Test-Consistency
    }
    
    "generate" {
        if (-not $ToolName -or -not $ToolKey -or -not $ToolDescription) {
            Write-Host "❌ 新ツール生成には名前、キー、説明が必要です" -ForegroundColor Red
            Write-Host "使用例: .\scripts\site-manager-pure.ps1 generate -ToolName 'Image Resizer' -ToolKey 'image-resizer' -ToolDescription 'Resize images easily'" -ForegroundColor Cyan
            exit 1
        }
        
        $config = Get-SiteConfig
        $template = Get-Template
        
        Write-Host "🔧 新ツール生成中..." -ForegroundColor Yellow
        
        # デフォルトガイドデータ
        $guideData = @{
            ja = @{
                title = "$($ToolName)の使い方"
                list = @(
                    'ファイルまたはテキストを入力',
                    '必要に応じて設定を調整',
                    '実行ボタンをクリック',
                    '結果をダウンロードまたはコピー',
                    '右上メニューで日本語・英語切替可能'
                )
                tipsTitle = '活用例・ヒント'
                tips = @(
                    '効率的な作業のために',
                    'ブックマークして頻繁に使用'
                )
            }
            en = @{
                title = "How to Use $ToolName"
                list = @(
                    'Input file or text',
                    'Adjust settings as needed',
                    'Click the execute button',
                    'Download or copy the result',
                    'Switch language from the top menu'
                )
                tipsTitle = 'Tips & Examples'
                tips = @(
                    'For efficient work',
                    'Bookmark for frequent use'
                )
            }
        }
        
        # プレースホルダー置換
        $replacements = @{
            '{{TOOL_NAME}}' = $ToolName
            '{{TOOL_KEY}}' = $ToolKey
            '{{TOOL_DESCRIPTION}}' = $ToolDescription
            '{{TOOL_CONTENT}}' = '<div class="text-center text-gray-500">ツール内容をここに追加してください</div>'
            '{{TOOL_EXTERNAL_SCRIPTS}}' = ''
            '{{TOOL_CUSTOM_STYLES}}' = ''
            '{{TOOL_SCRIPTS}}' = ''
            '{{GUIDE_DATA}}' = ($guideData | ConvertTo-Json -Depth 10)
        }
        
        $html = Replace-Placeholders -Content $template -Replacements $replacements
        $html = Apply-Config -Content $html -Config $config
        
        # ファイル出力
        $outputPath = "tools\$ToolKey.html"
        $html | Set-Content $outputPath -Encoding UTF8
        
        Write-Host "✅ ツール生成完了: $outputPath" -ForegroundColor Green
    }
    
    "help" {
        Write-Host @"
🛠️  サイト管理スクリプト (PowerShell版)

使用方法:
  .\scripts\site-manager-pure.ps1 update
    - 全ツールファイルを設定に基づいて更新

  .\scripts\site-manager-pure.ps1 check  
    - サイト全体の一貫性をチェック

  .\scripts\site-manager-pure.ps1 generate -ToolName '<名前>' -ToolKey '<キー>' -ToolDescription '<説明>'
    - 新しいツールファイルを生成

例:
  .\scripts\site-manager-pure.ps1 update
  .\scripts\site-manager-pure.ps1 check
  .\scripts\site-manager-pure.ps1 generate -ToolName 'QR Code Generator' -ToolKey 'qr-generator' -ToolDescription 'Generate QR codes easily'

注意:
  - この版はNode.jsに依存せず、PowerShellのみで動作します
  - 設定ファイル: config\site-config.json
  - テンプレート: templates\tool-template.html

"@ -ForegroundColor Cyan
    }
}

Write-Host "実行完了: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
