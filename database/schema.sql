-- HANOTEX Database Schema
-- Sàn Giao dịch Công nghệ Hà Nội

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'SUPPORT');
CREATE TYPE technology_status AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE');
CREATE TYPE auction_status AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED');
CREATE TYPE auction_type AS ENUM ('ENGLISH', 'DUTCH', 'SEALED_BID');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE pricing_type AS ENUM ('APPRAISAL', 'ASK', 'AUCTION', 'OFFER');
CREATE TYPE ip_type AS ENUM ('PATENT', 'UTILITY_MODEL', 'INDUSTRIAL_DESIGN', 'TRADEMARK', 'SOFTWARE_COPYRIGHT', 'TRADE_SECRET');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL,
    role user_role DEFAULT 'USER',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual users profile
CREATE TABLE individual_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(20),
    phone VARCHAR(20),
    profession VARCHAR(255),
    bank_account VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company profiles
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(20),
    business_license VARCHAR(50),
    legal_representative VARCHAR(255),
    contact_email VARCHAR(255),
    production_capacity TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Research institution profiles
CREATE TABLE research_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    institution_code VARCHAR(50),
    governing_body VARCHAR(255),
    research_task_code VARCHAR(50),
    acceptance_report TEXT,
    research_group VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Technologies table
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    public_summary TEXT,
    confidential_detail TEXT,
    trl_level INTEGER CHECK (trl_level >= 1 AND trl_level <= 9),
    category_id UUID REFERENCES categories(id),
    submitter_id UUID REFERENCES users(id) NOT NULL,
    status technology_status DEFAULT 'DRAFT',
    visibility_mode VARCHAR(50) DEFAULT 'PUBLIC_SUMMARY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Technology owners (for co-ownership)
CREATE TABLE technology_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    owner_type user_type NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    ownership_percentage DECIMAL(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Intellectual Property
CREATE TABLE intellectual_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    ip_type ip_type NOT NULL,
    ip_number VARCHAR(100),
    status VARCHAR(100),
    territory VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Legal certifications
CREATE TABLE legal_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    protection_scope TEXT[], -- Array of protection territories
    standard_certifications TEXT[], -- Array of certifications
    local_certification_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pricing information
CREATE TABLE pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    pricing_type pricing_type NOT NULL,
    asking_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'VND',
    price_type VARCHAR(50), -- Indicative, Floor, Firm
    appraisal_purpose TEXT,
    appraisal_scope TEXT,
    appraisal_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Investment and transfer preferences
CREATE TABLE investment_transfer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    investment_stage VARCHAR(100),
    commercialization_methods TEXT[],
    transfer_methods TEXT[],
    territory_scope VARCHAR(100),
    financial_methods TEXT[],
    usage_limitations TEXT,
    current_partners TEXT,
    potential_partners TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Auctions
CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    auction_type auction_type NOT NULL,
    start_price DECIMAL(15,2),
    reserve_price DECIMAL(15,2),
    current_price DECIMAL(15,2),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status auction_status DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bids
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES users(id) NOT NULL,
    bid_amount DECIMAL(15,2) NOT NULL,
    bid_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_winning BOOLEAN DEFAULT FALSE
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    status transaction_status DEFAULT 'PENDING',
    payment_method VARCHAR(100),
    transaction_fee DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Additional data (optional fields)
CREATE TABLE additional_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    test_results TEXT,
    economic_social_impact TEXT,
    financial_support_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_technologies_status ON technologies(status);
CREATE INDEX idx_technologies_category ON technologies(category_id);
CREATE INDEX idx_technologies_submitter ON technologies(submitter_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_individual_profiles_updated_at BEFORE UPDATE ON individual_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_profiles_updated_at BEFORE UPDATE ON research_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON technologies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
