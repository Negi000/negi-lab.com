# negi-lab.com Site Management System
# Main control script - Clean version

param(
    [string]$action = ""
)

Write-Host "======================================" -ForegroundColor Green
Write-Host "  negi-lab.com Site Management System" -ForegroundColor Green  
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

function Show-Menu {
    Write-Host "Available Commands:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. validate  - Check site consistency" -ForegroundColor Cyan
    Write-Host "2. update    - Auto-fix missing elements" -ForegroundColor Cyan
    Write-Host "3. new-tool  - Create new tool" -ForegroundColor Cyan
    Write-Host "4. status    - Show current status" -ForegroundColor Cyan
    Write-Host "5. help      - Show detailed help" -ForegroundColor Cyan
    Write-Host "6. exit      - Exit program" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Status {
    Write-Host "Current Status:" -ForegroundColor Yellow
    $toolCount = (Get-ChildItem -Path "tools" -Filter "*.html" -File).Count
    Write-Host "  Total Tools: $toolCount files" -ForegroundColor Gray
    Write-Host ""
}

if ($action -eq "") {
    Show-Status
    do {
        Show-Menu
        $choice = Read-Host "Select option (1-6)"
        Write-Host ""
        
        switch ($choice) {
            "1" { & ".\scripts\simple-consistency.ps1" -action validate }
            "2" { & ".\scripts\simple-consistency.ps1" -action update }
            "3" { 
                $name = Read-Host "Tool name"
                $desc = Read-Host "Tool description"
                & ".\scripts\new-tool.ps1" -toolName $name -toolDescription $desc
            }
            "4" { Show-Status }
            "5" { 
                Write-Host "See README_FINAL.md for detailed instructions" -ForegroundColor Cyan
            }
            "6" { break }
        }
        if ($choice -ne "6") { Read-Host "Press Enter to continue" }
    } while ($choice -ne "6")
} else {
    switch ($action.ToLower()) {
        "validate" { & ".\scripts\simple-consistency.ps1" -action validate }
        "update" { & ".\scripts\simple-consistency.ps1" -action update }
        "status" { Show-Status }
        default { Write-Host "Unknown command: $action" -ForegroundColor Red }
    }
}

# Detailed help
function Show-Help {
    Write-Host "Detailed Help:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "validate (Consistency Check):" -ForegroundColor Cyan
    Write-Host "   Checks if all tool files contain required elements"
    Write-Host "   Check items: TailwindCSS, Security Headers, Footer, Guide Modal, Uniqueness Section"
    Write-Host ""
    Write-Host "update (Auto-Fix):" -ForegroundColor Cyan  
    Write-Host "   Automatically adds missing elements"
    Write-Host "   * Existing content is preserved"
    Write-Host ""
    Write-Host "new-tool (Create New Tool):" -ForegroundColor Cyan
    Write-Host "   Creates new tool from template"
    Write-Host "   Usage: .\site-manager.ps1 new-tool"
    Write-Host ""
    Write-Host "Files:" -ForegroundColor Cyan
    Write-Host "   Detailed Guide: SITE_MANAGEMENT_GUIDE.md"
    Write-Host "   Config File: config/site-config.json"
    Write-Host "   Template: templates/tool-template.html"
    Write-Host ""
}

# New tool creation wizard
function New-ToolWizard {
    Write-Host "New Tool Creation Wizard" -ForegroundColor Green
    Write-Host ""
    
    $toolName = Read-Host "Enter tool name"
    if ([string]::IsNullOrWhiteSpace($toolName)) {
        Write-Host "Error: Tool name is required" -ForegroundColor Red
        return
    }
    
    $toolDescription = Read-Host "Enter tool description"
    if ([string]::IsNullOrWhiteSpace($toolDescription)) {
        Write-Host "Error: Tool description is required" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "Creating..." -ForegroundColor Yellow
    
    try {
        & ".\scripts\new-tool.ps1" -toolName $toolName -toolDescription $toolDescription
        Write-Host ""
        Write-Host "Tool created successfully!" -ForegroundColor Green
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "   1. Edit tools/$toolName.html to implement functionality"
        Write-Host "   2. Add link to index.html"
        Write-Host "   3. Run validate command to check consistency"
    }
    catch {
        Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main processing
if ($action -eq "") {
    # Interactive mode
    Show-Status
    
    do {
        Show-Menu
        $choice = Read-Host "Select option (1-6)"
        Write-Host ""
        
        switch ($choice) {
            "1" { 
                Write-Host "Running consistency check..." -ForegroundColor Yellow
                & ".\scripts\simple-consistency.ps1" -action validate
            }
            "2" { 
                Write-Host "Running auto-fix..." -ForegroundColor Yellow
                & ".\scripts\simple-consistency.ps1" -action update
            }
            "3" { 
                New-ToolWizard
            }
            "4" { 
                Show-Status
            }
            "5" { 
                Show-Help
            }
            "6" { 
                Write-Host "Goodbye!" -ForegroundColor Green
                break
            }
            default { 
                Write-Host "Invalid selection. Please enter 1-6." -ForegroundColor Red
            }
        }
        
        if ($choice -ne "6") {
            Write-Host ""
            Write-Host "Press Enter to continue..." -ForegroundColor Gray
            Read-Host
            Clear-Host
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "  negi-lab.com Site Management System" -ForegroundColor Green  
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
        }
    } while ($choice -ne "6")
    
} else {
    # Command line mode
    switch ($action.ToLower()) {
        "validate" { 
            & ".\scripts\simple-consistency.ps1" -action validate
        }
        "update" { 
            & ".\scripts\simple-consistency.ps1" -action update
        }
        "new-tool" { 
            New-ToolWizard
        }
        "status" { 
            Show-Status
        }
        "help" { 
            Show-Help
        }
        default { 
            Write-Host "Unknown command: $action" -ForegroundColor Red
            Write-Host "Available commands: validate, update, new-tool, status, help" -ForegroundColor Yellow
        }
    }
}
