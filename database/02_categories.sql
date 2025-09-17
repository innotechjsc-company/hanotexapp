-- HANOTEX Database Schema - Categories
-- Sàn Giao dịch Công nghệ Hà Nội

-- Technology categories (taxonomy)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    level INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);