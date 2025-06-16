@echo off
chcp 65001 >nul
echo 🔧 自動修正を実行中...
powershell -ExecutionPolicy Bypass -File scripts\simple-consistency.ps1 -action update
pause
