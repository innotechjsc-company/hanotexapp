@echo off
echo ========================================
echo    HANOTEX Quick Data Check
echo ========================================

echo.
echo Checking if containers are running...
docker ps --filter "name=hanotex" --format "table {{.Names}}\t{{.Status}}"

echo.
echo Testing database connection...
docker exec hanotex-postgres psql -U postgres -d hanotex -c "SELECT 'Database connected successfully!' as status;"

echo.
echo Checking sample data...
echo.
echo === USERS ===
docker exec hanotex-postgres psql -U postgres -d hanotex -c "SELECT email, user_type, role FROM users LIMIT 5;"

echo.
echo === TECHNOLOGIES ===
docker exec hanotex-postgres psql -U postgres -d hanotex -c "SELECT title, trl_level, status FROM technologies LIMIT 5;"

echo.
echo === CATEGORIES ===
docker exec hanotex-postgres psql -U postgres -d hanotex -c "SELECT name, code, level FROM categories;"

echo.
echo === SUMMARY ===
docker exec hanotex-postgres psql -U postgres -d hanotex -c "SELECT 'Users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'Technologies', COUNT(*) FROM technologies UNION ALL SELECT 'Categories', COUNT(*) FROM categories;"

echo.
echo ========================================
echo    Data Check Complete!
echo ========================================
echo.
echo If you see data above, everything is working!
echo.
pause

