-- HANOTEX Additional Sample Data
-- Thêm dữ liệu mẫu bổ sung cho development và testing

-- Thêm users bổ sung
INSERT INTO users (id, email, password_hash, user_type, role, is_verified, is_active) VALUES
(uuid_generate_v4(), 'admin@vietnamtech.gov.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'ADMIN', true, true),
(uuid_generate_v4(), 'le.van.c@email.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'USER', true, true),
(uuid_generate_v4(), 'pham.thi.d@email.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'USER', true, true),
(uuid_generate_v4(), 'hoang.van.e@email.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'INDIVIDUAL', 'USER', true, true),
(uuid_generate_v4(), 'contact@fpt.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true),
(uuid_generate_v4(), 'info@viettel.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true),
(uuid_generate_v4(), 'rd@vnu.edu.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'RESEARCH_INSTITUTION', 'USER', true, true),
(uuid_generate_v4(), 'research@hust.edu.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'RESEARCH_INSTITUTION', 'USER', true, true),
(uuid_generate_v4(), 'contact@vinfast.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true),
(uuid_generate_v4(), 'info@mobifone.vn', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'COMPANY', 'USER', true, true);

-- Thêm individual profiles
INSERT INTO individual_profiles (user_id, full_name, id_number, phone, profession, bank_account) VALUES
((SELECT id FROM users WHERE email = 'le.van.c@email.com'), 'Lê Văn C', '0123456789', '0912345678', 'Kỹ sư phần mềm', 'Vietcombank - 1234567890'),
((SELECT id FROM users WHERE email = 'pham.thi.d@email.com'), 'Phạm Thị D', '0987654321', '0987654321', 'Nhà nghiên cứu AI', 'BIDV - 0987654321'),
((SELECT id FROM users WHERE email = 'hoang.van.e@email.com'), 'Hoàng Văn E', '0111222333', '0911222333', 'Chuyên gia blockchain', 'Techcombank - 0111222333');

-- Thêm company profiles
INSERT INTO company_profiles (user_id, company_name, tax_code, business_license, legal_representative, contact_email, production_capacity) VALUES
((SELECT id FROM users WHERE email = 'contact@fpt.vn'), 'Tập đoàn FPT', '0101234567', 'GP-003/2024', 'Nguyễn Văn F', 'ceo@fpt.vn', 'Tập đoàn công nghệ hàng đầu Việt Nam, 50,000 nhân viên, chuyên về phần mềm và dịch vụ CNTT'),
((SELECT id FROM users WHERE email = 'info@viettel.vn'), 'Tập đoàn Viettel', '0107654321', 'GP-004/2024', 'Trần Thị G', 'director@viettel.vn', 'Tập đoàn viễn thông và công nghệ, 100,000 nhân viên, chuyên về 5G, IoT và AI'),
((SELECT id FROM users WHERE email = 'contact@vinfast.vn'), 'VinFast', '0109876543', 'GP-005/2024', 'Lê Văn H', 'ceo@vinfast.vn', 'Nhà sản xuất ô tô điện, 20,000 nhân viên, chuyên về xe điện và pin'),
((SELECT id FROM users WHERE email = 'info@mobifone.vn'), 'MobiFone', '0105555555', 'GP-006/2024', 'Phạm Thị I', 'director@mobifone.vn', 'Nhà mạng di động, 15,000 nhân viên, chuyên về 5G và dịch vụ di động');

-- Thêm research institution profiles
INSERT INTO research_profiles (user_id, institution_name, institution_code, governing_body, research_task_code, acceptance_report, research_group) VALUES
((SELECT id FROM users WHERE email = 'rd@vnu.edu.vn'), 'Đại học Quốc gia Hà Nội', 'VNU-002', 'Bộ Giáo dục và Đào tạo', 'KC.03.01/2024', 'Báo cáo nghiệm thu dự án KC.03.01/2024', 'Viện Công nghệ Thông tin'),
((SELECT id FROM users WHERE email = 'research@hust.edu.vn'), 'Trường Đại học Bách khoa Hà Nội', 'HUST-002', 'Bộ Giáo dục và Đào tạo', 'KC.04.01/2024', 'Báo cáo nghiệm thu dự án KC.04.01/2024', 'Khoa Công nghệ Thông tin');

-- Thêm technologies bổ sung
INSERT INTO technologies (id, title, public_summary, confidential_detail, trl_level, category_id, submitter_id, status, visibility_mode) VALUES
(uuid_generate_v4(), 'Hệ thống AI dự đoán thời tiết chính xác', 'Ứng dụng trí tuệ nhân tạo để dự đoán thời tiết với độ chính xác 98%, sử dụng dữ liệu vệ tinh và cảm biến IoT', 'Thuật toán deep learning LSTM, dataset 10 năm dữ liệu thời tiết, accuracy 98.5%...', 8, (SELECT id FROM categories WHERE code = 'EEICT'), (SELECT id FROM users WHERE email = 'le.van.c@email.com'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Công nghệ sản xuất pin lithium-ion từ rác thải', 'Quy trình tái chế rác thải điện tử để sản xuất pin lithium-ion, giảm 70% chi phí sản xuất', 'Quy trình xử lý rác thải, tách chiết lithium, hiệu suất 85%...', 6, (SELECT id FROM categories WHERE code = 'MTRL'), (SELECT id FROM users WHERE email = 'contact@fpt.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống blockchain cho chuỗi cung ứng nông sản', 'Ứng dụng blockchain để truy xuất nguồn gốc nông sản, đảm bảo an toàn thực phẩm', 'Smart contract, IPFS storage, consensus algorithm...', 7, (SELECT id FROM categories WHERE code = 'EEICT'), (SELECT id FROM users WHERE email = 'hoang.van.e@email.com'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Vaccine COVID-19 thế hệ mới từ tảo biển', 'Phát triển vaccine COVID-19 từ chiết xuất tảo biển, hiệu quả 95% và ít tác dụng phụ', 'Quy trình chiết xuất, thử nghiệm lâm sàng giai đoạn III, hiệu quả 95.2%...', 5, (SELECT id FROM categories WHERE code = 'BIOTECH'), (SELECT id FROM users WHERE email = 'rd@vnu.edu.vn'), 'PENDING', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Robot phẫu thuật tự động với AI', 'Robot phẫu thuật được điều khiển bởi AI, có thể thực hiện các ca phẫu thuật phức tạp', 'Computer vision, machine learning, precision 0.1mm...', 4, (SELECT id FROM categories WHERE code = 'BIOTECH'), (SELECT id FROM users WHERE email = 'research@hust.edu.vn'), 'DRAFT', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống 5G cho xe tự lái', 'Công nghệ 5G chuyên dụng cho xe tự lái, độ trễ thấp và băng thông cao', '5G NR, edge computing, latency < 1ms...', 8, (SELECT id FROM categories WHERE code = 'EEICT'), (SELECT id FROM users WHERE email = 'info@viettel.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Pin xe điện sạc nhanh 10 phút', 'Công nghệ pin xe điện có thể sạc 80% trong 10 phút, tuổi thọ 15 năm', 'Solid-state battery, fast charging, 1000 cycles...', 6, (SELECT id FROM categories WHERE code = 'MTRL'), (SELECT id FROM users WHERE email = 'contact@vinfast.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống IoT giám sát môi trường đô thị', 'Mạng lưới cảm biến IoT để giám sát chất lượng không khí, tiếng ồn và giao thông', 'LoRaWAN, edge AI, real-time monitoring...', 7, (SELECT id FROM categories WHERE code = 'EEICT'), (SELECT id FROM users WHERE email = 'info@mobifone.vn'), 'APPROVED', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Vật liệu composite siêu nhẹ cho hàng không', 'Vật liệu composite mới có trọng lượng giảm 50% nhưng độ bền tăng 200%', 'Carbon fiber, graphene, strength-to-weight ratio...', 5, (SELECT id FROM categories WHERE code = 'MTRL'), (SELECT id FROM users WHERE email = 'pham.thi.d@email.com'), 'PENDING', 'PUBLIC_SUMMARY'),
(uuid_generate_v4(), 'Hệ thống AI chẩn đoán ung thư sớm', 'Ứng dụng AI để phát hiện ung thư ở giai đoạn sớm từ hình ảnh y tế', 'Deep learning CNN, dataset 1M images, accuracy 99.1%...', 6, (SELECT id FROM categories WHERE code = 'BIOTECH'), (SELECT id FROM users WHERE email = 'le.van.c@email.com'), 'APPROVED', 'PUBLIC_SUMMARY');

-- Thêm technology owners
INSERT INTO technology_owners (technology_id, owner_type, owner_name, ownership_percentage) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống AI dự đoán thời tiết chính xác'), 'INDIVIDUAL', 'Lê Văn C', 100.00),
((SELECT id FROM technologies WHERE title = 'Công nghệ sản xuất pin lithium-ion từ rác thải'), 'COMPANY', 'Tập đoàn FPT', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống blockchain cho chuỗi cung ứng nông sản'), 'INDIVIDUAL', 'Hoàng Văn E', 100.00),
((SELECT id FROM technologies WHERE title = 'Vaccine COVID-19 thế hệ mới từ tảo biển'), 'RESEARCH_INSTITUTION', 'Đại học Quốc gia Hà Nội', 100.00),
((SELECT id FROM technologies WHERE title = 'Robot phẫu thuật tự động với AI'), 'RESEARCH_INSTITUTION', 'Trường Đại học Bách khoa Hà Nội', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống 5G cho xe tự lái'), 'COMPANY', 'Tập đoàn Viettel', 100.00),
((SELECT id FROM technologies WHERE title = 'Pin xe điện sạc nhanh 10 phút'), 'COMPANY', 'VinFast', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát môi trường đô thị'), 'COMPANY', 'MobiFone', 100.00),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite siêu nhẹ cho hàng không'), 'INDIVIDUAL', 'Phạm Thị D', 100.00),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI chẩn đoán ung thư sớm'), 'INDIVIDUAL', 'Lê Văn C', 100.00);

-- Thêm intellectual properties
INSERT INTO intellectual_properties (technology_id, ip_type, ip_number, status, territory) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống AI dự đoán thời tiết chính xác'), 'PATENT', 'VN1-2024003', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Công nghệ sản xuất pin lithium-ion từ rác thải'), 'PATENT', 'VN1-2024004', 'Đang nộp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống blockchain cho chuỗi cung ứng nông sản'), 'SOFTWARE_COPYRIGHT', 'SW-2024002', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Vaccine COVID-19 thế hệ mới từ tảo biển'), 'PATENT', 'PCT/VN2024/000002', 'Đang nộp', 'PCT'),
((SELECT id FROM technologies WHERE title = 'Robot phẫu thuật tự động với AI'), 'PATENT', 'VN1-2024005', 'Đang nộp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống 5G cho xe tự lái'), 'PATENT', 'VN1-2024006', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Pin xe điện sạc nhanh 10 phút'), 'PATENT', 'VN1-2024007', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát môi trường đô thị'), 'SOFTWARE_COPYRIGHT', 'SW-2024003', 'Đã được cấp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite siêu nhẹ cho hàng không'), 'UTILITY_MODEL', 'VN2-2024002', 'Đang nộp', 'VN'),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI chẩn đoán ung thư sớm'), 'PATENT', 'VN1-2024008', 'Đã được cấp', 'VN');

-- Thêm pricing information
INSERT INTO pricing (technology_id, pricing_type, asking_price, currency, price_type) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống AI dự đoán thời tiết chính xác'), 'ASK', 800000000, 'VND', 'Firm'),
((SELECT id FROM technologies WHERE title = 'Công nghệ sản xuất pin lithium-ion từ rác thải'), 'AUCTION', 1200000000, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Hệ thống blockchain cho chuỗi cung ứng nông sản'), 'ASK', 600000000, 'VND', 'Floor'),
((SELECT id FROM technologies WHERE title = 'Vaccine COVID-19 thế hệ mới từ tảo biển'), 'APPRAISAL', NULL, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Robot phẫu thuật tự động với AI'), 'OFFER', NULL, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Hệ thống 5G cho xe tự lái'), 'ASK', 2000000000, 'VND', 'Indicative'),
((SELECT id FROM technologies WHERE title = 'Pin xe điện sạc nhanh 10 phút'), 'ASK', 1500000000, 'VND', 'Firm'),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát môi trường đô thị'), 'ASK', 400000000, 'VND', 'Floor'),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite siêu nhẹ cho hàng không'), 'AUCTION', 900000000, 'VND', NULL),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI chẩn đoán ung thư sớm'), 'ASK', 1000000000, 'VND', 'Firm');

-- Thêm investment and transfer preferences
INSERT INTO investment_transfer (technology_id, investment_stage, commercialization_methods, transfer_methods, territory_scope, financial_methods) VALUES
((SELECT id FROM technologies WHERE title = 'Hệ thống AI dự đoán thời tiết chính xác'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'B2C'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']),
((SELECT id FROM technologies WHERE title = 'Công nghệ sản xuất pin lithium-ion từ rác thải'), 'VC/Joint Venture (TRL 4-6)', ARRAY['B2B', 'OEM/ODM'], ARRAY['Chuyển nhượng một phần'], 'Khu vực (ASEAN)', ARRAY['Phí cố định (Lump sum)']),
((SELECT id FROM technologies WHERE title = 'Hệ thống blockchain cho chuỗi cung ứng nông sản'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'SaaS'], ARRAY['License không độc quyền'], 'Toàn cầu', ARRAY['Theo doanh thu (% Royalty)']),
((SELECT id FROM technologies WHERE title = 'Vaccine COVID-19 thế hệ mới từ tảo biển'), 'Grant/Seed (TRL 1-3)', ARRAY['B2B', 'JV/Hợp tác chiến lược'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Góp vốn bằng công nghệ']),
((SELECT id FROM technologies WHERE title = 'Robot phẫu thuật tự động với AI'), 'Grant/Seed (TRL 1-3)', ARRAY['B2B', 'JV/Hợp tác chiến lược'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Góp vốn bằng công nghệ']),
((SELECT id FROM technologies WHERE title = 'Hệ thống 5G cho xe tự lái'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'B2C'], ARRAY['License độc quyền', 'Sub-license'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']),
((SELECT id FROM technologies WHERE title = 'Pin xe điện sạc nhanh 10 phút'), 'VC/Joint Venture (TRL 4-6)', ARRAY['B2B', 'OEM/ODM'], ARRAY['Chuyển nhượng một phần'], 'Toàn cầu', ARRAY['Phí cố định (Lump sum)']),
((SELECT id FROM technologies WHERE title = 'Hệ thống IoT giám sát môi trường đô thị'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'B2C'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite siêu nhẹ cho hàng không'), 'VC/Joint Venture (TRL 4-6)', ARRAY['B2B', 'OEM/ODM'], ARRAY['Chuyển nhượng một phần'], 'Toàn cầu', ARRAY['Phí cố định (Lump sum)']),
((SELECT id FROM technologies WHERE title = 'Hệ thống AI chẩn đoán ung thư sớm'), 'Growth/Strategic (TRL 7-9)', ARRAY['B2B', 'B2C'], ARRAY['License độc quyền'], 'Toàn cầu', ARRAY['Kết hợp (Fee + Royalty)']);

-- Thêm auctions bổ sung
INSERT INTO auctions (technology_id, auction_type, start_price, reserve_price, current_price, start_time, end_time, status) VALUES
((SELECT id FROM technologies WHERE title = 'Công nghệ sản xuất pin lithium-ion từ rác thải'), 'ENGLISH', 1200000000, 800000000, 1200000000, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '10 days', 'SCHEDULED'),
((SELECT id FROM technologies WHERE title = 'Vật liệu composite siêu nhẹ cho hàng không'), 'DUTCH', 900000000, 600000000, 900000000, CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '8 days', 'SCHEDULED'),
((SELECT id FROM technologies WHERE title = 'Hệ thống 5G cho xe tự lái'), 'SEALED_BID', 2000000000, 1500000000, 2000000000, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '14 days', 'SCHEDULED');

-- Thêm notifications bổ sung
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email = 'le.van.c@email.com'), 'Công nghệ đã được duyệt', 'Công nghệ "Hệ thống AI dự đoán thời tiết chính xác" đã được phê duyệt và hiển thị trên sàn', 'APPROVAL'),
((SELECT id FROM users WHERE email = 'contact@fpt.vn'), 'Có người quan tâm', 'Có 5 người dùng quan tâm đến công nghệ "Công nghệ sản xuất pin lithium-ion từ rác thải"', 'INTEREST'),
((SELECT id FROM users WHERE email = 'hoang.van.e@email.com'), 'Đấu giá sắp bắt đầu', 'Đấu giá cho công nghệ "Công nghệ sản xuất pin lithium-ion từ rác thải" sẽ bắt đầu vào ngày mai', 'AUCTION'),
((SELECT id FROM users WHERE email = 'info@viettel.vn'), 'Công nghệ đã được duyệt', 'Công nghệ "Hệ thống 5G cho xe tự lái" đã được phê duyệt và hiển thị trên sàn', 'APPROVAL'),
((SELECT id FROM users WHERE email = 'contact@vinfast.vn'), 'Có người quan tâm', 'Có 3 người dùng quan tâm đến công nghệ "Pin xe điện sạc nhanh 10 phút"', 'INTEREST'),
((SELECT id FROM users WHERE email = 'info@mobifone.vn'), 'Đấu giá sắp bắt đầu', 'Đấu giá cho công nghệ "Vật liệu composite siêu nhẹ cho hàng không" sẽ bắt đầu vào ngày mai', 'AUCTION'),
((SELECT id FROM users WHERE email = 'pham.thi.d@email.com'), 'Công nghệ đang chờ duyệt', 'Công nghệ "Vật liệu composite siêu nhẹ cho hàng không" đang chờ phê duyệt từ admin', 'PENDING'),
((SELECT id FROM users WHERE email = 'rd@vnu.edu.vn'), 'Công nghệ đang chờ duyệt', 'Công nghệ "Vaccine COVID-19 thế hệ mới từ tảo biển" đang chờ phê duyệt từ admin', 'PENDING'),
((SELECT id FROM users WHERE email = 'research@hust.edu.vn'), 'Công nghệ đang chờ duyệt', 'Công nghệ "Robot phẫu thuật tự động với AI" đang chờ phê duyệt từ admin', 'PENDING'),
((SELECT id FROM users WHERE email = 'le.van.c@email.com'), 'Công nghệ đã được duyệt', 'Công nghệ "Hệ thống AI chẩn đoán ung thư sớm" đã được phê duyệt và hiển thị trên sàn', 'APPROVAL');
