$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "GPT Dual Calendar - Fast Portable Build" -ForegroundColor Cyan
Write-Host "---------------------------------------" -ForegroundColor DarkGray

if (-not (Test-Path ".\package.json")) {
    Write-Host "Error: run this from the project root." -ForegroundColor Red
    exit 1
}

$package = Get-Content ".\package.json" -Raw | ConvertFrom-Json

if ($package.name -ne "gpt-dual-calendar") {
    Write-Host "Error: wrong project root." -ForegroundColor Red
    exit 1
}

Write-Host "1/3 Cleaning old output..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".\release" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".\dist" -ErrorAction SilentlyContinue

Write-Host "2/3 Ensuring dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "3/3 Auto-version + build portable..." -ForegroundColor Yellow
npm run build:portable
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$portable = Get-ChildItem ".\release\*Portable.exe" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

Write-Host ""

if ($portable) {
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host $portable.FullName -ForegroundColor White
} else {
    Write-Host "Portable EXE was not found." -ForegroundColor Yellow
}
