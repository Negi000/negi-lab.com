@echo off
chcp 65001 >nul
echo 🆕 新規ツール作成ウィザード
powershell -ExecutionPolicy Bypass -File site-manager.ps1 new-tool
pause
