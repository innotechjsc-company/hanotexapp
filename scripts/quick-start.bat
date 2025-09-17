@echo off
echo ========================================
echo    HANOTEX - Quick Start (No Database)
echo ========================================
echo.
echo This will start only the frontend application
echo without requiring database setup.
echo.

:: Check if Node.js is installed
echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Install frontend dependencies
echo.
echo [2/3] Installing frontend dependencies...
cd apps\web
if not exist node_modules (
    echo Installing dependencies... This may take a few minutes.
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
)
echo ✅ Dependencies installed

:: Start frontend
echo.
echo [3/3] Starting frontend application...
echo Starting Next.js development server...
start "HANOTEX Frontend" cmd /k "npm run dev"
cd ..\..

echo.
echo ========================================
echo    🎉 Frontend is starting up!
echo ========================================
echo.
echo Frontend:     http://localhost:3000
echo.
echo Note: Some features may not work without backend API
echo To start full system, run: start-hanotex.bat
echo.
echo You can close this window once the server is running.
echo.
pause

