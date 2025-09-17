@echo off
echo ========================================
echo    HANOTEX Docker Startup Guide
echo ========================================

echo.
echo Step 1: Start Docker Desktop
echo - Open Docker Desktop application
echo - Wait for it to fully start (green icon in system tray)
echo - Then run this script again
echo.

echo Checking Docker status...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker is not running!
    echo.
    echo Please:
    echo 1. Start Docker Desktop
    echo 2. Wait for it to fully load
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo Docker is running! Starting services...
echo.

REM Remove version from docker-compose.yml to avoid warning
powershell -Command "(Get-Content docker-compose.yml) -replace '^version: .*$', '' | Set-Content docker-compose.yml"

REM Start services
docker-compose up -d

echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 15 /nobreak > nul

echo.
echo Creating database schema...
docker exec hanotex-postgres psql -U postgres -d hanotex -f /docker-entrypoint-initdb.d/schema.sql

echo.
echo Inserting sample data...
docker exec hanotex-postgres psql -U postgres -d hanotex -f /docker-entrypoint-initdb.d/seed_data.sql

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Services running:
echo - PostgreSQL: localhost:5432
echo - Redis: localhost:6379
echo - pgAdmin: http://localhost:5050
echo.
echo Database credentials:
echo - Database: hanotex
echo - Username: postgres
echo - Password: 123456
echo.
echo To check data: scripts\check-data.bat
echo To stop services: docker-compose down
echo.
pause

