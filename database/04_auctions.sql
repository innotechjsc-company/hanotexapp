-- HANOTEX Database Schema - Auctions and Bids
-- Sàn Giao dịch Công nghệ Hà Nội

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