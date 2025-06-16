# サイト管理用PowerShellスクリプト

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("update", "check", "generate", "help")]
    [string]$Command,
    
    [string]$ToolName,
    [string]$ToolKey,
    [string]$ToolDescription
)

# Node.jsが利用可能かチェック
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.jsが見つかりません。Node.jsをインストールしてください。"
    exit 1
}

# スクリプトディレクトリに移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

switch ($Command) {
    "update" {
        Write-Host "🔄 全ツールファイルを更新中..." -ForegroundColor Yellow
        node scripts/site-manager.js update
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 更新完了" -ForegroundColor Green
        } else {
            Write-Host "❌ 更新失敗" -ForegroundColor Red
        }
    }
    
    "check" {
        Write-Host "🔍 サイト一貫性チェック中..." -ForegroundColor Yellow
        node scripts/site-manager.js check
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ チェック完了" -ForegroundColor Green
        } else {
            Write-Host "❌ チェック中にエラーが発生しました" -ForegroundColor Red
        }
    }
    
    "generate" {
        if (-not $ToolName -or -not $ToolKey -or -not $ToolDescription) {
            Write-Host "❌ 新ツール生成には名前、キー、説明が必要です" -ForegroundColor Red
            Write-Host "使用例: .\scripts\site-manager.ps1 generate -ToolName 'Image Resizer' -ToolKey 'image-resizer' -ToolDescription 'Resize images easily'"
            exit 1
        }
        
        Write-Host "🔧 新ツール生成中..." -ForegroundColor Yellow
        node scripts/site-manager.js generate "$ToolName" "$ToolKey" "$ToolDescription"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ ツール生成完了" -ForegroundColor Green
        } else {
            Write-Host "❌ ツール生成失敗" -ForegroundColor Red
        }
    }
    
    "help" {
        Write-Host @"
🛠️  サイト管理スクリプト

使用方法:
  .\scripts\site-manager.ps1 update
    - 全ツールファイルを設定に基づいて更新

  .\scripts\site-manager.ps1 check  
    - サイト全体の一貫性をチェック

  .\scripts\site-manager.ps1 generate -ToolName '<名前>' -ToolKey '<キー>' -ToolDescription '<説明>'
    - 新しいツールファイルを生成

例:
  .\scripts\site-manager.ps1 update
  .\scripts\site-manager.ps1 check
  .\scripts\site-manager.ps1 generate -ToolName 'QR Code Generator' -ToolKey 'qr-generator' -ToolDescription 'Generate QR codes easily'

"@ -ForegroundColor Cyan
    }
}

# 実行時間を表示
$endTime = Get-Date
Write-Host "実行完了: $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
