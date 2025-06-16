param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("update", "check", "help")]
    [string]$Command
)

$configPath = "config\site-config.json"

function Get-SiteConfig {
    if (-not (Test-Path $configPath)) {
        Write-Error "Configuration file not found: $configPath"
        exit 1
    }
    
    $configContent = Get-Content $configPath -Raw -Encoding UTF8
    return $configContent | ConvertFrom-Json
}

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
        
        if ($content -notmatch 'Content-Security-Policy') {
            $issues += "$($file.Name): CSP header not found"
        }
        
        if ($content -notmatch $config.site.year) {
            $issues += "$($file.Name): Footer copyright year mismatch"
        }
        
        if ($content -notmatch 'tailwind.config') {
            $issues += "$($file.Name): Tailwind config not found"
        }
    }
    
    if ($issues.Count -eq 0) {
        Write-Host "SUCCESS: No consistency issues found" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Consistency issues found:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Red
        }
    }
}

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
            
            # Update footer copyright year
            $content = $content -replace '&copy; \d{4}', "&copy; $($config.site.year)"
            
            # Update site name
            $content = $content -replace 'negi-lab\.com', $config.site.name
            
            # Save the file
            $content | Set-Content $file.FullName -Encoding UTF8
            
            Write-Host "  SUCCESS: Updated $($file.Name)" -ForegroundColor Green
        }
        catch {
            Write-Host "  ERROR: Failed to update $($file.Name) - $_" -ForegroundColor Red
        }
    }
    
    Write-Host "All tool files processed" -ForegroundColor Green
}

switch ($Command) {
    "update" {
        Update-AllTools
    }
    
    "check" {
        Test-Consistency
    }
    
    "help" {
        Write-Host "Site Management Script" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor White
        Write-Host "  .\scripts\site-manager-basic.ps1 update" -ForegroundColor Yellow
        Write-Host "  .\scripts\site-manager-basic.ps1 check" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  update  - Update all tool files" -ForegroundColor Gray
        Write-Host "  check   - Check consistency" -ForegroundColor Gray
        Write-Host "  help    - Show this help" -ForegroundColor Gray
    }
}

Write-Host "Completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
