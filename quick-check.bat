@echo off
chcp 65001 >nul
echo 🔍 サイト一貫性チェックを実行中...
powershell -ExecutionPolicy Bypass -File scripts\simple-consistency.ps1 -action validate
pause
