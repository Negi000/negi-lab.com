# Build FellowMoon wiki pages and sitemap, plus search index
# Usage: powershell -ExecutionPolicy Bypass -File scripts/build-fellowmoon.ps1

$ErrorActionPreference = 'Stop'

# Resolve repo root
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT = Resolve-Path (Join-Path $PSScriptRoot '..')
$WIKI = Join-Path $ROOT 'gamewiki/FellowMoon'
$GEN = Join-Path $WIKI 'generator'
$SITE = Join-Path $WIKI 'site'

# Ensure Python is available
function AssertPython {
  $script:PYTHON = $null
  $py = Get-Command python -ErrorAction SilentlyContinue
  if ($py) { $script:PYTHON = $py.Source } else {
    $py2 = Get-Command py -ErrorAction SilentlyContinue
    if ($py2) { $script:PYTHON = $py2.Source }
  }
  if (-not $script:PYTHON) {
  Write-Error 'Python not found. Install Python 3 or add to PATH.'
    exit 1
  }
}

AssertPython

# Create site directory
New-Item -ItemType Directory -Path $SITE -Force | Out-Null

Write-Host '[1/5] Build home ...'
& $PYTHON (Join-Path $GEN 'build_home.py')

Write-Host '[2/5] Build characters ...'
& $PYTHON (Join-Path $GEN 'build.py')

Write-Host '[3/5] Build roms index ...'
& $PYTHON (Join-Path $GEN 'build_roms_index.py')
Write-Host '[3/5] Build rom pages ...'
& $PYTHON (Join-Path $GEN 'rom_build.py')

Write-Host '[4/5] Build sitemap ...'
& $PYTHON (Join-Path $GEN 'build_sitemap.py')

Write-Host '[5/5] Generate search index (Node) ...'
$NODE = Get-Command node -ErrorAction SilentlyContinue
if ($NODE) {
  & node (Join-Path $ROOT 'scripts/build-wiki-search-index.js')
} else {
  Write-Host 'Node not found. Skip Node-based search index (Python already generated site/search-index.json).'
}

Write-Host 'FellowMoon build completed.'