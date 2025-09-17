-- HANOTEX Database Schema - Indexes
-- Sàn Giao dịch Công nghệ Hà Nội

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