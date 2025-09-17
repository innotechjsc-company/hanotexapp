-- HANOTEX Database Data Check Script
-- Kiểm tra dữ liệu đã được insert đúng chưa

\c hanotex;

-- Kiểm tra số lượng bản ghi trong các bảng chính
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Individual Profiles', COUNT(*) FROM individual_profiles
UNION ALL
SELECT 'Company Profiles', COUNT(*) FROM company_profiles
UNION ALL
SELECT 'Research Profiles', COUNT(*) FROM research_profiles
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Technologies', COUNT(*) FROM technologies
UNION ALL
SELECT 'Technology Owners', COUNT(*) FROM technology_owners
UNION ALL
SELECT 'Intellectual Properties', COUNT(*) FROM intellectual_properties
UNION ALL
SELECT 'Pricing', COUNT(*) FROM pricing
UNION ALL
SELECT 'Investment Transfer', COUNT(*) FROM investment_transfer
UNION ALL
SELECT 'Auctions', COUNT(*) FROM auctions
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- Kiểm tra chi tiết users
SELECT '=== USERS ===' as info;
SELECT id, email, user_type, role, is_verified, is_active, created_at 
FROM users 
ORDER BY created_at;

-- Kiểm tra chi tiết technologies
SELECT '=== TECHNOLOGIES ===' as info;
SELECT t.id, t.title, t.trl_level, t.status, c.name as category, u.email as submitter
FROM technologies t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN users u ON t.submitter_id = u.id
ORDER BY t.created_at;

-- Kiểm tra categories
SELECT '=== CATEGORIES ===' as info;
SELECT name, code, level, 
       CASE WHEN parent_id IS NULL THEN 'Root' ELSE 'Child' END as type
FROM categories 
ORDER BY level, name;

-- Kiểm tra technology owners
SELECT '=== TECHNOLOGY OWNERS ===' as info;
SELECT t.title, to.owner_type, to.owner_name, to.ownership_percentage
FROM technology_owners to
JOIN technologies t ON to.technology_id = t.id
ORDER BY t.title;

-- Kiểm tra intellectual properties
SELECT '=== INTELLECTUAL PROPERTIES ===' as info;
SELECT t.title, ip.ip_type, ip.ip_number, ip.status, ip.territory
FROM intellectual_properties ip
JOIN technologies t ON ip.technology_id = t.id
ORDER BY t.title;

-- Kiểm tra pricing
SELECT '=== PRICING ===' as info;
SELECT t.title, p.pricing_type, p.asking_price, p.currency, p.price_type
FROM pricing p
JOIN technologies t ON p.technology_id = t.id
ORDER BY t.title;

-- Kiểm tra auctions
SELECT '=== AUCTIONS ===' as info;
SELECT t.title, a.auction_type, a.start_price, a.reserve_price, a.status, a.start_time, a.end_time
FROM auctions a
JOIN technologies t ON a.technology_id = t.id
ORDER BY a.start_time;

-- Kiểm tra notifications
SELECT '=== NOTIFICATIONS ===' as info;
SELECT u.email, n.title, n.message, n.type, n.is_read, n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
ORDER BY n.created_at DESC;

-- Tổng kết
SELECT '=== SUMMARY ===' as info;
SELECT 
    'Total Users' as metric,
    COUNT(*) as count
FROM users
UNION ALL
SELECT 
    'Total Technologies',
    COUNT(*)
FROM technologies
UNION ALL
SELECT 
    'Active Technologies',
    COUNT(*)
FROM technologies 
WHERE status = 'APPROVED'
UNION ALL
SELECT 
    'Pending Technologies',
    COUNT(*)
FROM technologies 
WHERE status = 'PENDING'
UNION ALL
SELECT 
    'Total Auctions',
    COUNT(*)
FROM auctions
UNION ALL
SELECT 
    'Scheduled Auctions',
    COUNT(*)
FROM auctions 
WHERE status = 'SCHEDULED';

