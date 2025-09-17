#!/bin/bash

echo "========================================"
echo "    HANOTEX Database Setup Script"
echo "========================================"

echo ""
echo "Starting PostgreSQL, Redis, and pgAdmin containers..."
echo ""

# Start Docker containers
docker-compose up -d

echo ""
echo "Waiting for PostgreSQL to be ready..."
sleep 10

echo ""
echo "Creating database schema..."
docker exec hanotex-postgres psql -U postgres -d hanotex -f /docker-entrypoint-initdb.d/schema.sql

echo ""
echo "Inserting sample data..."
docker exec hanotex-postgres psql -U postgres -d hanotex -f /docker-entrypoint-initdb.d/seed_data.sql

echo ""
echo "========================================"
echo "    Database Setup Complete!"
echo "========================================"
echo ""
echo "Services running:"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo "- pgAdmin: http://localhost:5050"
echo ""
echo "Database credentials:"
echo "- Database: hanotex"
echo "- Username: postgres"
echo "- Password: 123456"
echo ""
echo "pgAdmin credentials:"
echo "- Email: admin@hanotex.com"
echo "- Password: admin123"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""
