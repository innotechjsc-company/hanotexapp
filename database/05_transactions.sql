-- HANOTEX Database Schema - Transactions
-- Sàn Giao dịch Công nghệ Hà Nội

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