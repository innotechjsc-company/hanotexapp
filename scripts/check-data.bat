@echo off
echo ========================================
echo    HANOTEX Database Data Check
echo ========================================

echo.
echo Checking database connection and data...
echo.

REM Check if containers are running
docker ps --filter "name=hanotex-postgres" --format "table {{.Names}}\t{{.Status}}"

echo.
echo Running data check script...
docker exec hanotex-postgres psql -U postgres -d hanotex -f /docker-entrypoint-initdb.d/../scripts/check-data.sql

echo.
echo ========================================
echo    Data Check Complete!
echo ========================================
echo.
echo If you see data above, the database is working correctly.
echo If you see errors, please check the setup.
echo.
pause

