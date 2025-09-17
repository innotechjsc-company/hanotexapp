-- HANOTEX Sample Data
-- Insert sample categories
INSERT INTO categories (id, name, code, level, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Khoa học tự nhiên', 'SCI_NAT', 1, 'Các lĩnh vực khoa học tự nhiên'),
('550e8400-e29b-41d4-a716-446655440002', 'Khoa học kỹ thuật & công nghệ', 'SCI_ENG', 1, 'Các lĩnh vực kỹ thuật và công nghệ'),
('550e8400-e29b-41d4-a716-446655440003', 'Khoa học y, dược', 'SCI_MED', 1, 'Các lĩnh vực y học và dược phẩm'),
('550e8400-e29b-41d4-a716-446655440004', 'Trí tuệ nhân tạo', 'AI', 2, 'Công nghệ AI và machine learning'),
('550e8400-e29b-41d4-a716-446655440005', 'Vật liệu mới', 'MATERIALS', 2, 'Vật liệu tiên tiến và composite'),
('550e8400-e29b-41d4-a716-446655440006', 'Y tế', 'MEDICAL', 2, 'Công nghệ y tế và chẩn đoán'),
('550e8400-e29b-41d4-a716-446655440007', 'Nông nghiệp CNC', 'AGRI_TECH', 2, 'Nông nghiệp công nghệ cao'),
('550e8400-e29b-41d4-a716-446655440008', 'Năng lượng sạch', 'CLEAN_ENERGY', 2, 'Năng lượng tái tạo và sạch');

-- Insert sample users
INSERT INTO users (id, email, password_hash, user_type, role, is_verified, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'admin@hanotex.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'INDIVIDUAL', 'ADMIN', true, true),
('650e8400-e29b-41d4-a716-446655440002', 'company1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'COMPANY', 'USER', true, true),
('650e8400-e29b-41d4-a716-446655440003', 'institute1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'RESEARCH_INSTITUTION', 'USER', true, true),
('650e8400-e29b-41d4-a716-446655440004', 'individual1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'INDIVIDUAL', 'USER', true, true);

-- Insert individual profile
INSERT INTO individual_profiles (user_id, full_name, id_number, phone, profession) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Nguyễn Văn Admin', '123456789', '0123456789', 'Quản trị hệ thống'),
('650e8400-e29b-41d4-a716-446655440004', 'Trần Thị Nghiên cứu', '987654321', '0987654321', 'Nhà nghiên cứu');

-- Insert company profile
INSERT INTO company_profiles (user_id, company_name, tax_code, business_license, legal_representative, contact_email) VALUES
('650e8400-e29b-41d4-a716-446655440002', 'Công ty Công nghệ ABC', '0123456789', 'BL123456', 'Nguyễn Văn Giám đốc', 'contact@abc.com');

-- Insert research institution profile
INSERT INTO research_profiles (user_id, institution_name, institution_code, governing_body, research_group) VALUES
('650e8400-e29b-41d4-a716-446655440003', 'Viện Công nghệ Y tế Hà Nội', 'VCTYTHN001', 'Sở KH&CN Hà Nội', 'Nhóm nghiên cứu AI Y tế');

-- Insert sample technologies
INSERT INTO technologies (id, title, public_summary, trl_level, category_id, submitter_id, status, visibility_mode) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Hệ thống đốt LPG cho động cơ ô tô', 'Công nghệ đốt LPG tiên tiến cho động cơ ô tô, giúp giảm chi phí nhiên liệu và bảo vệ môi trường', 7, '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'ACTIVE', 'PUBLIC'),
('750e8400-e29b-41d4-a716-446655440002', 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế', 'Công nghệ AI tiên tiến có khả năng nhận diện và phân tích hình ảnh y tế với độ chính xác cao, hỗ trợ chẩn đoán bệnh lý', 6, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'ACTIVE', 'PUBLIC'),
('750e8400-e29b-41d4-a716-446655440003', 'Vật liệu composite từ sợi tre', 'Vật liệu composite mới được chế tạo từ sợi tre, có độ bền cao và thân thiện với môi trường', 5, '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'ACTIVE', 'PUBLIC'),
('750e8400-e29b-41d4-a716-446655440004', 'Hệ thống tưới tiêu thông minh cho nông nghiệp', 'Hệ thống tưới tiêu tự động sử dụng IoT và AI để tối ưu hóa lượng nước tưới', 6, '550e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440003', 'ACTIVE', 'PUBLIC'),
('750e8400-e29b-41d4-a716-446655440005', 'Pin năng lượng mặt trời hiệu suất cao', 'Công nghệ pin mặt trời mới với hiệu suất chuyển đổi năng lượng cao hơn 25% so với công nghệ hiện tại', 7, '550e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', 'ACTIVE', 'PUBLIC'),
('750e8400-e29b-41d4-a716-446655440006', 'Robot phẫu thuật điều khiển từ xa', 'Robot phẫu thuật có thể điều khiển từ xa với độ chính xác cao, hỗ trợ các ca phẫu thuật phức tạp', 4, '550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', 'PENDING', 'PUBLIC');

-- Insert technology owners
INSERT INTO technology_owners (technology_id, owner_type, owner_name, ownership_percentage) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'COMPANY', 'Công ty Công nghệ ABC', 100.00),
('750e8400-e29b-41d4-a716-446655440002', 'RESEARCH_INSTITUTION', 'Viện Công nghệ Y tế Hà Nội', 100.00),
('750e8400-e29b-41d4-a716-446655440003', 'COMPANY', 'Công ty Công nghệ ABC', 100.00),
('750e8400-e29b-41d4-a716-446655440004', 'RESEARCH_INSTITUTION', 'Viện Công nghệ Y tế Hà Nội', 100.00),
('750e8400-e29b-41d4-a716-446655440005', 'COMPANY', 'Công ty Công nghệ ABC', 100.00),
('750e8400-e29b-41d4-a716-446655440006', 'RESEARCH_INSTITUTION', 'Viện Công nghệ Y tế Hà Nội', 100.00);

-- Insert pricing information
INSERT INTO pricing (technology_id, pricing_type, asking_price, currency, price_type) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'ASK', 1000000000, 'VND', 'Giá niêm yết'),
('750e8400-e29b-41d4-a716-446655440002', 'ASK', 2000000000, 'VND', 'Giá niêm yết'),
('750e8400-e29b-41d4-a716-446655440003', 'ASK', 500000000, 'VND', 'Giá niêm yết'),
('750e8400-e29b-41d4-a716-446655440004', 'ASK', 800000000, 'VND', 'Giá niêm yết'),
('750e8400-e29b-41d4-a716-446655440005', 'ASK', 1500000000, 'VND', 'Giá niêm yết'),
('750e8400-e29b-41d4-a716-446655440006', 'ASK', 3000000000, 'VND', 'Giá niêm yết');

-- Insert intellectual properties
INSERT INTO intellectual_properties (technology_id, ip_type, ip_number, status, territory) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'PATENT', 'VN123456', 'Đã cấp', 'Việt Nam'),
('750e8400-e29b-41d4-a716-446655440002', 'PATENT', 'VN123457', 'Đang xem xét', 'Việt Nam'),
('750e8400-e29b-41d4-a716-446655440003', 'UTILITY_MODEL', 'VN123458', 'Đã cấp', 'Việt Nam'),
('750e8400-e29b-41d4-a716-446655440004', 'PATENT', 'VN123459', 'Đang xem xét', 'Việt Nam'),
('750e8400-e29b-41d4-a716-446655440005', 'PATENT', 'VN123460', 'Đã cấp', 'Việt Nam'),
('750e8400-e29b-41d4-a716-446655440006', 'PATENT', 'VN123461', 'Đang nộp đơn', 'Việt Nam');

-- Insert sample auctions
INSERT INTO auctions (id, technology_id, auction_type, start_price, reserve_price, current_price, start_time, end_time, status) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'ENGLISH', 800000000, 1000000000, 900000000, '2025-01-15 09:00:00', '2025-01-20 17:00:00', 'ACTIVE'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'ENGLISH', 1500000000, 2000000000, 1500000000, '2025-01-25 09:00:00', '2025-01-30 17:00:00', 'SCHEDULED'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'DUTCH', 400000000, 500000000, 400000000, '2025-02-01 09:00:00', '2025-02-05 17:00:00', 'SCHEDULED');

-- Insert sample bids
INSERT INTO bids (auction_id, bidder_id, bid_amount, bid_time, is_winning) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 900000000, '2025-01-15 10:30:00', true),
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 850000000, '2025-01-15 10:15:00', false);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
('650e8400-e29b-41d4-a716-446655440002', 'Công nghệ đã được duyệt', 'Công nghệ "Hệ thống đốt LPG cho động cơ ô tô" đã được duyệt và đang hoạt động', 'APPROVAL', false),
('650e8400-e29b-41d4-a716-446655440003', 'Đấu giá mới', 'Có đấu giá mới cho công nghệ "Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế"', 'AUCTION', false),
('650e8400-e29b-41d4-a716-446655440004', 'Đấu giá thắng', 'Bạn đã thắng đấu giá cho công nghệ "Hệ thống đốt LPG cho động cơ ô tô"', 'BID_WIN', false);
