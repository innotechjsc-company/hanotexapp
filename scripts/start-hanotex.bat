@echo off
echo ========================================
echo    HANOTEX - Complete Startup Script
echo ========================================
echo.

:: Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Check if Docker is running
echo.
echo [2/6] Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    echo Please start Docker Desktop and wait for it to fully load.
    echo.
    pause
    exit /b 1
)
echo ✅ Docker is running

:: Start database services
echo.
echo [3/6] Starting database services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start database services!
    echo.
    pause
    exit /b 1
)
echo ✅ Database services started

:: Wait for database to be ready
echo.
echo [4/6] Waiting for database to be ready...
timeout /t 10 /nobreak >nul
echo ✅ Database is ready

:: Install backend dependencies and start
echo.
echo [5/6] Starting backend API...
cd apps\api
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)
echo Starting backend server...
start "HANOTEX Backend" cmd /k "npm run dev"
cd ..\..

:: Install frontend dependencies and start
echo.
echo [6/6] Starting frontend application...
cd apps\web
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)
echo Starting frontend server...
start "HANOTEX Frontend" cmd /k "npm run dev"
cd ..\..

echo.
echo ========================================
echo    🎉 HANOTEX is starting up!
echo ========================================
echo.
echo Backend API:  http://localhost:3001
echo Frontend:     http://localhost:3000
echo Database:     localhost:5432 (postgres/123456)
echo pgAdmin:      http://localhost:5050 (admin@hanotex.com/admin123)
echo.
echo Please wait for both servers to start...
echo You can close this window once everything is running.
echo.
pause

