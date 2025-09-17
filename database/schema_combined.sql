-- HANOTEX Database Schema - Combined Setup
-- Sàn Giao dịch Công nghệ Hà Nội
-- 
-- This file executes all schema files in the correct order
-- Run this file to create the complete database schema

-- 1. Extensions and Types
\i 00_extensions_types.sql

-- 2. Users and Profiles
\i 01_users.sql

-- 3. Categories
\i 02_categories.sql

-- 4. Technologies
\i 03_technologies.sql

-- 5. Auctions and Bids
\i 04_auctions.sql

-- 6. Transactions
\i 05_transactions.sql

-- 7. Documents
\i 06_documents.sql

-- 8. Notifications
\i 07_notifications.sql

-- 9. Indexes
\i 08_indexes.sql

-- 10. Triggers and Functions
\i 09_triggers.sql