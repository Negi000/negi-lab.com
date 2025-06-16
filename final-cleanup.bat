@echo off
chcp 65001 >nul
echo ========================================
echo   negi-lab.com Repository Cleanup
echo ========================================
echo.

echo Deleting unnecessary files...
echo.

REM scripts内の試作版を削除
if exist "scripts\site-manager-basic.ps1" (
    del "scripts\site-manager-basic.ps1"
    echo ✓ Deleted: scripts\site-manager-basic.ps1
)

if exist "scripts\site-manager-pure.ps1" (
    del "scripts\site-manager-pure.ps1"
    echo ✓ Deleted: scripts\site-manager-pure.ps1
)

if exist "scripts\site-manager-simple.ps1" (
    del "scripts\site-manager-simple.ps1"
    echo ✓ Deleted: scripts\site-manager-simple.ps1
)

if exist "scripts\site-manager-working.ps1" (
    del "scripts\site-manager-working.ps1"
    echo ✓ Deleted: scripts\site-manager-working.ps1
)

if exist "scripts\site-consistency.ps1" (
    del "scripts\site-consistency.ps1"
    echo ✓ Deleted: scripts\site-consistency.ps1
)

REM 重複・不要ファイルを削除
if exist "SITE_MANAGEMENT.md" (
    del "SITE_MANAGEMENT.md"
    echo ✓ Deleted: SITE_MANAGEMENT.md
)

if exist "SECURITY_COMPLETION_REPORT.md" (
    del "SECURITY_COMPLETION_REPORT.md"
    echo ✓ Deleted: SECURITY_COMPLETION_REPORT.md
)

if exist "test.html" (
    del "test.html"
    echo ✓ Deleted: test.html
)

if exist "index.js" (
    del "index.js"
    echo ✓ Deleted: index.js
)

if exist "tsconfig.json" (
    del "tsconfig.json"
    echo ✓ Deleted: tsconfig.json
)

REM 誤作成ファイルを削除
if exist "tools\site-manager.ps1 status.html" (
    del "tools\site-manager.ps1 status.html"
    echo ✓ Deleted: tools\site-manager.ps1 status.html
)

REM バッチファイル整理
if exist "quick-manager.bat" (
    del "quick-manager.bat"
    echo ✓ Deleted: quick-manager.bat
)

REM 一時ファイル削除
if exist "cleanup.ps1" (
    del "cleanup.ps1"
    echo ✓ Deleted: cleanup.ps1
)

echo.
echo ========================================
echo   Cleanup Completed Successfully!
echo ========================================
echo.
echo Remaining essential files:
echo ✓ scripts\simple-consistency.ps1
echo ✓ scripts\new-tool.ps1
echo ✓ quick-check.bat, quick-fix.bat, quick-new.bat
echo ✓ README_FINAL.md, QUICK_START.md
echo ✓ config\, templates\, .github\workflows\
echo.
pause
