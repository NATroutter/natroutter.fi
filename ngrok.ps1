# Configuration
$ngrokExePath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\ngrok.exe"
$port = 3000

# ============================================
# Script Start
# ============================================

Write-Host "Checking for running ngrok processes..." -ForegroundColor Cyan

# Stop all ngrok processes
$ngrokProcesses = Get-Process -Name "ngrok" -ErrorAction SilentlyContinue

if ($ngrokProcesses) {
    Write-Host "Found $($ngrokProcesses.Count) ngrok process(es). Stopping them..." -ForegroundColor Yellow
    $ngrokProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force
        Write-Host "Stopped process ID: $($_.Id)" -ForegroundColor Green
    }
    # Give it a moment to fully terminate
    Start-Sleep -Seconds 2
} else {
    Write-Host "No ngrok processes found." -ForegroundColor Green
}

# Verify ngrok executable exists
if (-Not (Test-Path $ngrokExePath)) {
    Write-Host "Error: ngrok executable not found at: $ngrokExePath" -ForegroundColor Red
    Write-Host "Please update the `$ngrokExePath variable in the script." -ForegroundColor Yellow
    exit 1
}

# Start new ngrok process
Write-Host "Starting new ngrok process on port $port..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop ngrok" -ForegroundColor Yellow
Write-Host ""

# Run ngrok directly (it will run in the current terminal)
& $ngrokExePath http $port