@echo off
chcp 65001 >nul
echo ========================================
echo   negi-lab.com クイック管理ツール
echo ========================================
echo.

REM PowerShell実行ポリシーを一時的に設定
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force"

REM 引数チェック
if "%1"=="" (
    echo 使用方法:
    echo   quick-check.bat          - 一貫性チェック
    echo   quick-fix.bat            - 自動修正
    echo   quick-new.bat            - 新規ツール作成
    echo   quick-menu.bat           - メニュー表示
    echo.
    echo または、メインスクリプトを実行:
    powershell -ExecutionPolicy Bypass -File site-manager.ps1
    goto :end
)

if "%1"=="check" (
    echo 🔍 一貫性チェックを実行中...
    powershell -ExecutionPolicy Bypass -File scripts\simple-consistency.ps1 -action validate
    goto :end
)

if "%1"=="fix" (
    echo 🔧 自動修正を実行中...
    powershell -ExecutionPolicy Bypass -File scripts\simple-consistency.ps1 -action update
    goto :end
)

if "%1"=="new" (
    echo 🆕 新規ツール作成...
    powershell -ExecutionPolicy Bypass -File site-manager.ps1 new-tool
    goto :end
)

if "%1"=="menu" (
    powershell -ExecutionPolicy Bypass -File site-manager.ps1
    goto :end
)

echo ❌ 未知のコマンド: %1
echo 利用可能: check, fix, new, menu

:end
pause
