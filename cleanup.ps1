# 無駄ファイル削除スクリプト
# Remove unnecessary files from the repository

Write-Host "Cleaning up unnecessary files..." -ForegroundColor Yellow

$filesToDelete = @(
    # 試作版スクリプト
    "scripts\site-manager-working.ps1",
    "scripts\site-manager-simple.ps1", 
    "scripts\site-manager-pure.ps1",
    "scripts\site-manager-basic.ps1",
    "scripts\site-consistency.ps1",
    
    # 誤って作成されたファイル
    "tools\site-manager.ps1 status.html",
    
    # 重複ドキュメント
    "SITE_MANAGEMENT.md",
    "SECURITY_COMPLETION_REPORT.md",
    
    # 不要なファイル
    "test.html",
    "index.js",
    "tsconfig.json"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Red
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
    }
}

Write-Host "Cleanup completed!" -ForegroundColor Green
