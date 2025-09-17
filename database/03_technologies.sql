-- HANOTEX Database Schema - Technologies
-- Sàn Giao dịch Công nghệ Hà Nội

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

-- Additional data (optional fields)
CREATE TABLE additional_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    test_results TEXT,
    economic_social_impact TEXT,
    financial_support_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);