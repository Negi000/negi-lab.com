# Site Management PowerShell Script

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("update", "check", "generate", "help")]
    [string]$Command,
    
    [string]$ToolName,
    [string]$ToolKey,
    [string]$ToolDescription
)

# Configuration file path
$configPath = "config\site-config.json"

# Load site configuration
function Get-SiteConfig {
    if (-not (Test-Path $configPath)) {
        Write-Error "Configuration file not found: $configPath"
        exit 1
    }
    
    try {
        $configContent = Get-Content $configPath -Raw -Encoding UTF8
        return $configContent | ConvertFrom-Json
    }
    catch {
        Write-Error "Configuration file read error: $_"
        exit 1
    }
}

# Update footer in content
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

# Update policy section in content
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

# Check site consistency
function Test-Consistency {
    $config = Get-SiteConfig
    $issues = @()
    
    Write-Host "Checking site consistency..." -ForegroundColor Yellow
    
    $toolFiles = Get-ChildItem "tools\*.html" -ErrorAction SilentlyContinue
    
    if (-not $toolFiles) {
        Write-Host "No HTML files found in tools directory" -ForegroundColor Yellow
        return
    }
    
    foreach ($file in $toolFiles) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Check security headers
        if ($content -notmatch 'Content-Security-Policy') {
            $issues += "$($file.Name): CSP header not found"
        }
        
        # Check footer
        if ($content -notmatch "&copy; $($config.site.year)") {
            $issues += "$($file.Name): Footer copyright year mismatch"
        }
        
        # Check common section
        if ($content -notmatch 'negi-lab\.com.*独自性.*運営方針.*免責事項') {
            $issues += "$($file.Name): Policy section not found"
        }
          # Check Tailwind config
        if ($content -notmatch 'tailwind\.config') {
            $issues += "$($file.Name): Tailwind config not found"
        }
    }
    
    if ($issues.Count -eq 0) {
        Write-Host "Consistency check completed: No issues found" -ForegroundColor Green
    } else {
        Write-Host "Consistency issues found:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Red
        }
    }
}

# Update all tools
function Update-AllTools {
    $config = Get-SiteConfig
    
    Write-Host "Updating all tool files..." -ForegroundColor Yellow
    
    $toolFiles = Get-ChildItem "tools\*.html" -ErrorAction SilentlyContinue
    
    if (-not $toolFiles) {
        Write-Host "No HTML files found in tools directory" -ForegroundColor Yellow
        return
    }
    
    foreach ($file in $toolFiles) {
        Write-Host "Updating $($file.Name)..." -ForegroundColor Cyan
        
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            # Update footer
            $content = Update-Footer -Content $content -Config $config
            
            # Update policy section
            $content = Update-PolicySection -Content $content -Config $config
            
            # Update CSP
            $cspPattern = '<meta http-equiv="Content-Security-Policy" content="[^"]*" />'
            $newCSP = "<meta http-equiv=`"Content-Security-Policy`" content=`"$($config.security.csp)`" />"
            if ($content -match $cspPattern) {
                $content = $content -replace $cspPattern, $newCSP
            }
            
            # Update color theme
            $content = $content -replace 'negi:\s*"[^"]*"', "negi: `"$($config.theme.colors.negi)`""
            $content = $content -replace 'accent:\s*"[^"]*"', "accent: `"$($config.theme.colors.accent)`""
            
            # Write back to file
            $content | Set-Content $file.FullName -Encoding UTF8
            
            Write-Host "  Updated $($file.Name) successfully" -ForegroundColor Green
        }
        catch {
            Write-Host "  Error updating $($file.Name): $_" -ForegroundColor Red
        }
    }
    
    Write-Host "All tool files updated successfully" -ForegroundColor Green
}

# Main execution
switch ($Command) {
    "update" {
        Update-AllTools
    }
    
    "check" {
        Test-Consistency
    }
    
    "generate" {
        Write-Host "Tool generation feature will be available in future versions" -ForegroundColor Yellow
        Write-Host "For now, please use the template file directly" -ForegroundColor Cyan
    }
    
    "help" {
        Write-Host @"
Site Management Script (PowerShell Edition)

Usage:
  .\scripts\site-manager-simple.ps1 update
    - Update all tool files based on configuration

  .\scripts\site-manager-simple.ps1 check  
    - Check site-wide consistency

Examples:
  .\scripts\site-manager-simple.ps1 update
  .\scripts\site-manager-simple.ps1 check

Notes:
  - This version runs on PowerShell only (no Node.js required)
  - Configuration file: config\site-config.json
  - Template file: templates\tool-template.html

"@ -ForegroundColor Cyan
    }
}

Write-Host "Execution completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
