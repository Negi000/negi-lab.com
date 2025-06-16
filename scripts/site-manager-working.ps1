# Site Manager - PowerShell Script
# UTF-8 encoding with BOM

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("validate", "update", "generate")]
    [string]$action,
    
    [string]$toolName = ""
)

# Configuration file path
$configPath = "config\site-config.json"

# Read configuration
function Get-SiteConfig {
    if (Test-Path $configPath) {
        return Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
    } else {
        Write-Error "Configuration file not found: $configPath"
        exit 1
    }
}

# Validate HTML files for consistency
function Test-SiteConsistency {
    Write-Host "Checking site consistency..." -ForegroundColor Green
    
    $config = Get-SiteConfig
    $toolsDir = "tools"
    $inconsistencies = @()
    
    if (Test-Path $toolsDir) {
        $htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html" -File
        
        foreach ($file in $htmlFiles) {
            Write-Host "Checking: $($file.Name)" -ForegroundColor Yellow
            
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
              # Check for required elements
            $checks = @{
                "TailwindCSS" = $content -match 'tailwindcss'
                "CSP Header" = $content -match 'Content-Security-Policy'
                "Security Headers" = $content -match 'X-Content-Type-Options'
                "Footer Section" = $content -match '<footer'
                "Meta Description" = $content -match 'name="description"'
                "Guide Modal" = $content -match 'id="guideModal"'
                "Uniqueness Section" = $content -match '独自性・運営方針・免責事項'
            }
            
            foreach ($check in $checks.GetEnumerator()) {
                if (-not $check.Value) {
                    $inconsistencies += "File: $($file.Name) - Missing: $($check.Key)"
                }
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

# Update existing tool files
function Update-ToolFiles {
    Write-Host "Updating tool files..." -ForegroundColor Green
    
    $config = Get-SiteConfig
    $templatePath = "templates\tool-template.html"
    
    if (-not (Test-Path $templatePath)) {
        Write-Error "Template file not found: $templatePath"
        return
    }
    
    $template = Get-Content $templatePath -Raw -Encoding UTF8
    $toolsDir = "tools"
    
    if (Test-Path $toolsDir) {
        $htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html" -File
        
        foreach ($file in $htmlFiles) {
            Write-Host "Updating: $($file.Name)" -ForegroundColor Yellow
            
            # Extract tool-specific content (between <!-- TOOL_CONTENT --> markers)
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            if ($content -match '<!-- TOOL_CONTENT_START -->(.*?)<!-- TOOL_CONTENT_END -->') {
                $toolContent = $matches[1]
                
                # Replace placeholders in template
                $newContent = $template
                $newContent = $newContent -replace '{{TOOL_CONTENT}}', $toolContent
                $newContent = $newContent -replace '{{SITE_NAME}}', $config.site.name
                $newContent = $newContent -replace '{{SITE_URL}}', $config.site.url
                
                # Save updated file
                Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
                Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
            } else {
                Write-Host "  Skipped: $($file.Name) (no content markers found)" -ForegroundColor Yellow
            }
        }
    }
}

# Generate new tool file
function New-ToolFile {
    param([string]$name)
    
    if ([string]::IsNullOrEmpty($name)) {
        Write-Error "Tool name is required for generation"
        return
    }
    
    Write-Host "Generating new tool: $name" -ForegroundColor Green
    
    $config = Get-SiteConfig
    $templatePath = "templates\tool-template.html"
    
    if (-not (Test-Path $templatePath)) {
        Write-Error "Template file not found: $templatePath"
        return
    }
    
    $template = Get-Content $templatePath -Raw -Encoding UTF8
    $toolPath = "tools\$name.html"
    
    # Replace placeholders
    $newContent = $template
    $newContent = $newContent -replace '{{TOOL_CONTENT}}', "<!-- Tool content for $name goes here -->"
    $newContent = $newContent -replace '{{SITE_NAME}}', $config.site.name
    $newContent = $newContent -replace '{{SITE_URL}}', $config.site.url
    
    # Save new file
    Set-Content -Path $toolPath -Value $newContent -Encoding UTF8
    Write-Host "Generated: $toolPath" -ForegroundColor Green
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
        Update-ToolFiles
    }
    "generate" {
        if ([string]::IsNullOrEmpty($toolName)) {
            Write-Error "Tool name required for generate action. Use: -toolName 'your-tool-name'"
            exit 1
        }
        New-ToolFile -name $toolName
    }
    default {
        Write-Error "Invalid action: $action"
        exit 1
    }
}

$endTime = Get-Date
Write-Host "Completed at $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
Write-Host "Duration: $(($endTime - $startTime).TotalSeconds) seconds" -ForegroundColor Gray
