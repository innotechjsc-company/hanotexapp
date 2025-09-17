-- HANOTEX Database Setup Script
-- This script will be executed when PostgreSQL container starts

-- Create database if not exists
SELECT 'CREATE DATABASE hanotex'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hanotex')\gexec

-- Connect to hanotex database
\c hanotex;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'SUPPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE technology_status AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auction_status AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auction_type AS ENUM ('ENGLISH', 'DUTCH', 'SEALED_BID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pricing_type AS ENUM ('APPRAISAL', 'ASK', 'AUCTION', 'OFFER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ip_type AS ENUM ('PATENT', 'UTILITY_MODEL', 'INDUSTRIAL_DESIGN', 'TRADEMARK', 'SOFTWARE_COPYRIGHT', 'TRADE_SECRET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
