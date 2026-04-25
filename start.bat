@echo off
setlocal enabledelayedexpansion

REM Sequence — local launcher
REM   - verifies Node.js is installed
REM   - installs dependencies if node_modules is missing or out of date
REM   - starts the Vite dev server (default http://localhost:5173/)

cd /d "%~dp0"

echo.
echo  ============================================
echo   Sequence  -  Pilates planning tool
echo  ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo  [error] Node.js was not found in PATH.
    echo          Download and install Node 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo  [error] npm was not found in PATH.
    echo          Reinstall Node.js to restore npm.
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node -v') do set NODE_VERSION=%%v
for /f "delims=" %%v in ('npm -v') do set NPM_VERSION=%%v
echo  Node !NODE_VERSION!   npm !NPM_VERSION!
echo.

set NEED_INSTALL=0
if not exist "node_modules" set NEED_INSTALL=1
if not exist "node_modules\.package-lock.json" set NEED_INSTALL=1

if "!NEED_INSTALL!"=="1" (
    echo  [install] Installing dependencies. This can take a minute on first run...
    echo.
    call npm install --no-fund --no-audit
    if errorlevel 1 (
        echo.
        echo  [error] npm install failed. Resolve the issue above and re-run start.bat
        echo.
        pause
        exit /b 1
    )
    echo.
)

echo  [run] Starting Vite dev server...
echo        Press Ctrl+C in this window to stop the server.
echo        The app will be available at http://localhost:5173/
echo.

call npm run dev

endlocal
