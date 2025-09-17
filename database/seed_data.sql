-- HANOTEX Sample Data
-- Insert sample data for development and testing

-- Insert sample categories (taxonomy)
INSERT INTO categories (id, name, code, parent_id, level, description) VALUES
(uuid_generate_v4(), 'Khoa học tự nhiên', 'SCI_NAT', NULL, 1, 'Các lĩnh vực khoa học tự nhiên'),
(uuid_generate_v4(), 'Khoa học kỹ thuật & công nghệ', 'SCI_ENG', NULL, 1, 'Các lĩnh vực kỹ thuật và công nghệ'),
(uuid_generate_v4(), 'Khoa học y, dược', 'SCI_MED', NULL, 1, 'Các lĩnh vực y học và dược học'),
(uuid_generate_v4(), 'Khoa học nông nghiệp', 'SCI_AGR', NULL, 1, 'Các lĩnh vực nông nghiệp'),
(uuid_generate_v4(), 'Cơ khí – Động lực', 'MECH', (SELECT id FROM categories WHERE code = 'SCI_ENG'), 2, 'Cơ khí và động lực học'),
(uuid_generate_v4(), 'Điện – Điện tử – CNTT', 'EEICT', (SELECT id FROM categories WHERE code = 'SCI_ENG'), 2, 'Điện, điện tử và công nghệ thông tin'),
(uuid_generate_v4(), 'Vật liệu & Công nghệ vật liệu', 'MTRL', (SELECT id FROM categories WHERE code = 'SCI_ENG'), 2, 'Vật liệu và công nghệ vật liệu'),
(uuid_generate_v4(), 'Công nghệ sinh học y dược', 'BIOTECH', (SELECT id FROM categories WHERE code = 'SCI_MED'), 2, 'Công nghệ sinh học trong y dược');

-- Insert sample users
INSERT INTO users (id, email, password_hash, user_type, role, is_verified, is_active) VALUES
(uuid_generate_v4(), 'admin@hanotex.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'ADMIN', true, true),
(uuid_generate_v4(), 'nguyen.van.a@email.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'USER', true, true),
(uuid_generate_v4(), 'tran.thi.b@email.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'USER', true, true),
(uuid_generate_v4(), 'contact@techcorp.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true),
(uuid_generate_v4(), 'info@innovation.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true),
(uuid_generate_v4(), 'rd@hust.edu.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'RESEARCH_INSTITUTION', 'USER', true, true),
(uuid_generate_v4(), 'research@vnu.edu.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'RESEARCH_INSTITUTION', 'USER', true, true);

-- Insert individual profiles
INSERT INTO individual_profiles (user_id, full_name, id_number, phone, profession, bank_account) VALUES
((SELECT id FROM users WHERE email = 'nguyen.van.a@email.com'), 'Nguyễn Văn A', '0123456789', '0912345678', 'Nhà nghiên cứu', 'Vietcombank - 1234567890'),
((SELECT id FROM users WHERE email = 'tran.thi.b@email.com'), 'Trần Thị B', '0987654321', '0987654321', 'Kỹ sư phần mềm', 'BIDV - 0987654321');

-- Insert company profiles
INSERT INTO company_profiles (user_id, company_name, tax_code, business_license, legal_representative, contact_email, production_capacity) VALUES
((SELECT id FROM users WHERE email = 'contact@techcorp.vn'), 'Công ty TNHH Công nghệ TechCorp', '0101234567', 'GP-001/2024', 'Nguyễn Văn C', 'ceo@techcorp.vn', 'Nhà xưởng 5000m2, 50 nhân viên R&D, công suất 1000 sản phẩm/tháng'),
((SELECT id FROM users WHERE email = 'info@innovation.vn'), 'Công ty Cổ phần Đổi mới Sáng tạo', '0107654321', 'GP-002/2024', 'Trần Thị D', 'director@innovation.vn', 'Văn phòng R&D 2000m2, 30 kỹ sư, chuyên về AI và IoT');

-- Insert research institution profiles
INSERT INTO research_profiles (user_id, institution_name, institution_code, governing_body, research_task_code, acceptance_report, research_group) VALUES
((SELECT id FROM users WHERE email = 'rd@hust.edu.vn'), 'Trường Đại học Bách khoa Hà Nội', 'HUST-001', 'Bộ Giáo dục và Đào tạo', 'KC.01.01/2024', 'Báo cáo nghiệm thu dự án KC.01.01/2024', 'Nhóm nghiên cứu Công nghệ Thông tin'),
((SELECT id FROM users WHERE email = 'research@vnu.edu.vn'), 'Đại học Quốc gia Hà Nội', 'VNU-001', 'Bộ Giáo dục và Đào tạo', 'KC.02.01/2024', 'Báo cáo nghiệm thu dự án KC.02.01/2024', 'Viện Công nghệ Thông tin');

-- Insert sample technologies
INSERT INTO technologies (id, title, public_summary, confidential_detail, trl_level, category_id, submitter_id, status, visibility_mode) VALUES
(uuid_generate_v4(), 'Hệ thống đốt LPG cho động cơ ô tô', 'Công nghệ chuyển đổi động cơ xăng sang sử dụng LPG, giảm 30% chi phí nhiên liệu và giảm phát thải CO2', 'Chi tiết kỹ thuật: Tỷ lệ nén 10:1, áp suất phun 200 bar, ECU điều khiển thông minh...', 7, (SELECT id FROM categories WHERE code = 'MECH'), (SELECT id FROM users WHERE email = 'nguyen.van.a@email.com'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế', 'Ứng dụng trí tuệ nhân tạo để chẩn đoán bệnh từ hình ảnh X-quang, CT, MRI với độ chính xác 95%', 'Thuật toán deep learning CNN-ResNet50, dataset 100,000 hình ảnh, accuracy 95.2%...', 6, (SELECT id FROM categories WHERE code = 'BIOTECH'), (SELECT id FROM users WHERE email = 'rd@hust.edu.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Vật liệu composite từ sợi tre', 'Vật liệu composite mới từ sợi tre tự nhiên, có độ bền cao và thân thiện môi trường', 'Quy trình xử lý sợi tre, tỷ lệ pha trộn 60% sợi tre + 40% nhựa epoxy...', 5, (SELECT id FROM categories WHERE code = 'MTRL'), (SELECT id FROM users WHERE email = 'contact@techcorp.vn'), 'PENDING', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống IoT giám sát chất lượng nước', 'Hệ thống cảm biến IoT để giám sát chất lượng nước thời gian thực, gửi cảnh báo qua app mobile', 'Cảm biến pH, DO, TDS, kết nối LoRaWAN, battery 5 năm...', 8, (SELECT id FROM categories WHERE code = 'EEICT'), (SELECT id FROM users WHERE email = 'info@innovation.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Thuốc điều trị ung thư từ cây dược liệu', 'Chiết xuất hoạt chất từ cây dược liệu Việt Nam để điều trị ung thư, đã thử nghiệm lâm sàng giai đoạn II', 'Hoạt chất curcuminoid, liều lượng 200mg/ngày, hiệu quả 78%...', 4, (SELECT id FROM categories WHERE code = 'BIOTECH'), (SELECT id FROM users WHERE email = 'research@vnu.edu.vn'), 'DRAFT', 'PUBLIC_SUMMARY');

-- Insert technology owners
INSERT INTO technology_owners (technology_id, owner_type, owner_name, ownership_percentage) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống đốt LPG cho động cơ ô tô'), 'INDIVIDUAL', 'Nguyễn Văn A', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế'), 'RESEARCH_INSTITUTION', 'Trường Đại học Bách khoa Hà Nội', 100.00),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite từ sợi tre'), 'COMPANY', 'Công ty TNHH Công nghệ TechCorp', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát chất lượng nước'), 'COMPANY', 'Công ty Cổ phần Đổi mới Sáng tạo', 100.00),
((SELECT id FROM technologies WHERE title = 'Thuốc điều trị ung thư từ cây dược liệu'), 'RESEARCH_INSTITUTION', 'Đại học Quốc gia Hà Nội', 100.00);

-- Insert intellectual properties
INSERT INTO intellectual_properties (technology_id, ip_type, ip_number, status, territory) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống đốt LPG cho động cơ ô tô'), 'PATENT', 'VN1-2024001', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế'), 'PATENT', 'VN1-2024002', 'Đang nộp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite từ sợi tre'), 'UTILITY_MODEL', 'VN2-2024001', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát chất lượng nước'), 'SOFTWARE_COPYRIGHT', 'SW-2024001', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Thuốc điều trị ung thư từ cây dược liệu'), 'PATENT', 'PCT/VN2024/000001', 'Đang nộp', 'PCT');

-- Insert pricing information
INSERT INTO pricing (technology_id, pricing_type, asking_price, currency, price_type) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống đốt LPG cho động cơ ô tô'), 'ASK', 500000000, 'VND', 'Indicative'),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế'), 'APPRAISAL', NULL, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite từ sợi tre'), 'AUCTION', 200000000, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát chất lượng nước'), 'ASK', 300000000, 'VND', 'Floor'),
((SELECT id FROM technologies WHERE title = 'Thuốc điều trị ung thư từ cây dược liệu'), 'OFFER', NULL, 'VND', NULL);

-- Insert investment and transfer preferences
INSERT INTO investment_transfer (technology_id, investment_stage, commercialization_methods, transfer_methods, territory_scope, financial_methods) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống đốt LPG cho động cơ ô tô'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'Licensing (độc quyền/không độc quyền)'], ARRAY['License độc quyền', 'Kèm dịch vụ kỹ thuật'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế'), 'VC/Joint Venture (TRL 4-6)', ARRAY['B2B', 'JV/Hợp tác chiến lược'], ARRAY['License không độc quyền'], 'Khu vực (ASEAN/EU/US)', ARRAY['Theo doanh thu (% Royalty)']),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite từ sợi tre'), 'VC/Joint Venture (TRL 4-6)', ARRAY['B2B', 'OEM/ODM'], ARRAY['Chuyển nhượng một phần'], 'Trong nước (VN)', ARRAY['Phí cố định (Lump sum)']),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát chất lượng nước'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'B2C'], ARRAY['License độc quyền', 'Sub-license'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']),
((SELECT id FROM technologies WHERE title = 'Thuốc điều trị ung thư từ cây dược liệu'), 'Grant/Seed (TRL 1-3)', ARRAY['B2B', 'JV/Hợp tác chiến lược'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Góp vốn bằng công nghệ']);

-- Insert sample auctions
INSERT INTO auctions (technology_id, auction_type, start_price, reserve_price, current_price, start_time, end_time, status) VALUES
((SELECT id FROM technologies WHERE title = 'Vật liệu composite từ sợi tre'), 'ENGLISH', 200000000, 150000000, 200000000, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '7 days', 'SCHEDULED'),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát chất lượng nước'), 'DUTCH', 300000000, 200000000, 300000000, CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '5 days', 'SCHEDULED');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email = 'nguyen.van.a@email.com'), 'Công nghệ đã được duyệt', 'Công nghệ "Hệ thống đốt LPG cho động cơ ô tô" đã được phê duyệt và hiển thị trên sàn', 'APPROVAL'),
((SELECT id FROM users WHERE email = 'contact@techcorp.vn'), 'Có người quan tâm', 'Có 3 người dùng quan tâm đến công nghệ "Vật liệu composite từ sợi tre"', 'INTEREST'),
((SELECT id FROM users WHERE email = 'rd@hust.edu.vn'), 'Đấu giá sắp bắt đầu', 'Đấu giá cho công nghệ "Vật liệu composite từ sợi tre" sẽ bắt đầu vào ngày mai', 'AUCTION');
