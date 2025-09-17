import { NextResponse } from 'next/server';

// Master data definitions
const fields = [
  { value: 'SCI_NAT', label: 'Khoa học tự nhiên' },
  { value: 'SCI_ENG', label: 'Khoa học kỹ thuật & công nghệ' },
  { value: 'SCI_MED', label: 'Khoa học y, dược' },
  { value: 'SCI_AGR', label: 'Khoa học nông nghiệp' },
  { value: 'SCI_SOC', label: 'Khoa học xã hội' },
  { value: 'SCI_HUM', label: 'Khoa học nhân văn' },
  { value: 'SCI_INT', label: 'Khoa học liên ngành' }
];

const industries = [
  { value: 'MECH', label: 'Cơ khí – Động lực' },
  { value: 'EEICT', label: 'Điện – Điện tử – CNTT' },
  { value: 'MTRL', label: 'Vật liệu & Công nghệ vật liệu' },
  { value: 'ENV', label: 'Công nghệ môi trường' },
  { value: 'AUTO', label: 'Tự động hóa & Robot' },
  { value: 'BIOTECH', label: 'Công nghệ sinh học y dược' },
  { value: 'MEDDEV', label: 'Thiết bị y tế' },
  { value: 'PHARMA', label: 'Dược học' },
  { value: 'AGRI', label: 'Nông nghiệp' },
  { value: 'FOOD', label: 'Công nghệ thực phẩm' },
  { value: 'AQUA', label: 'Thủy sản' },
  { value: 'AI', label: 'Trí tuệ nhân tạo' },
  { value: 'NANO', label: 'Công nghệ nano' },
  { value: 'SPACE', label: 'Công nghệ vũ trụ' }
];

const specialties = [
  { value: 'ENGINE_INTERNAL', label: 'Động cơ đốt trong' },
  { value: 'PRECISION_MECHANICS', label: 'Cơ khí chính xác' },
  { value: 'TRANSPORTATION', label: 'Phương tiện giao thông' },
  { value: 'SEMICONDUCTOR', label: 'Bán dẫn' },
  { value: 'TELECOMMUNICATIONS', label: 'Viễn thông' },
  { value: 'SYSTEM_SOFTWARE', label: 'Phần mềm hệ thống' },
  { value: 'POLYMER_COMPOSITE', label: 'Polyme/Compozit' },
  { value: 'NANO_MATERIALS', label: 'Vật liệu nano' },
  { value: 'BATTERY_FUEL', label: 'Pin & Nhiên liệu' },
  { value: 'WATER_TREATMENT', label: 'Xử lý nước thải' },
  { value: 'WASTE_RECYCLING', label: 'Tái chế chất thải' },
  { value: 'EMISSION_REDUCTION', label: 'Giảm phát thải' },
  { value: 'INDUSTRIAL_ROBOT', label: 'Robot công nghiệp' },
  { value: 'INDUSTRIAL_IOT', label: 'IoT công nghiệp' },
  { value: 'SMART_CONTROL', label: 'Điều khiển thông minh' }
];

const trlLevels = [
  { value: '1', label: 'TRL 1 - Nguyên lý cơ bản' },
  { value: '2', label: 'TRL 2 - Khái niệm công nghệ' },
  { value: '3', label: 'TRL 3 - Bằng chứng khái niệm' },
  { value: '4', label: 'TRL 4 - Xác thực trong phòng thí nghiệm' },
  { value: '5', label: 'TRL 5 - Xác thực trong môi trường liên quan' },
  { value: '6', label: 'TRL 6 - Trình diễn trong môi trường liên quan' },
  { value: '7', label: 'TRL 7 - Trình diễn trong môi trường vận hành' },
  { value: '8', label: 'TRL 8 - Hệ thống hoàn chỉnh và đủ điều kiện' },
  { value: '9', label: 'TRL 9 - Hệ thống thực tế được chứng minh' }
];

const categories = [
  { value: '550e8400-e29b-41d4-a716-446655440001', label: 'Công nghệ thông tin & Truyền thông' },
  { value: '550e8400-e29b-41d4-a716-446655440002', label: 'Công nghệ sinh học & Y dược' },
  { value: '550e8400-e29b-41d4-a716-446655440003', label: 'Vật liệu mới & Công nghệ vật liệu' },
  { value: '550e8400-e29b-41d4-a716-446655440004', label: 'Cơ khí & Tự động hóa' },
  { value: '550e8400-e29b-41d4-a716-446655440005', label: 'Năng lượng & Môi trường' },
  { value: '550e8400-e29b-41d4-a716-446655440006', label: 'Nông nghiệp & Thực phẩm' },
  { value: '550e8400-e29b-41d4-a716-446655440007', label: 'Giao thông vận tải' },
  { value: '550e8400-e29b-41d4-a716-446655440008', label: 'Xây dựng & Kiến trúc' },
  { value: '550e8400-e29b-41d4-a716-446655440009', label: 'Khoa học xã hội & Nhân văn' },
  { value: '550e8400-e29b-41d4-a716-446655440010', label: 'Liên ngành & Khác' }
];

const ipTypes = [
  { 
    value: 'PATENT', 
    label: 'Sáng chế (Patent)',
    description: 'Giải pháp kỹ thuật mới, sáng tạo, áp dụng công nghiệp. Bảo hộ 20 năm.'
  },
  { 
    value: 'UTILITY_MODEL', 
    label: 'Giải pháp hữu ích',
    description: 'Giải pháp kỹ thuật mới so với hiện tại. Bảo hộ 10 năm.'
  },
  { 
    value: 'INDUSTRIAL_DESIGN', 
    label: 'Kiểu dáng công nghiệp',
    description: 'Hình dáng bên ngoài sản phẩm. Bảo hộ 15 năm.'
  },
  { 
    value: 'TRADEMARK', 
    label: 'Nhãn hiệu',
    description: 'Dấu hiệu phân biệt hàng hóa/dịch vụ. Bảo hộ 10 năm, có thể gia hạn.'
  },
  { 
    value: 'COPYRIGHT', 
    label: 'Quyền tác giả',
    description: 'Bảo hộ mã nguồn, thuật toán. Bảo hộ suốt đời + 50 năm.'
  },
  { 
    value: 'TRADE_SECRET', 
    label: 'Bí mật kinh doanh',
    description: 'Thông tin có giá trị thương mại, bảo mật. Không có thời hạn.'
  }
];

const ipStatuses = [
  { value: 'PENDING', label: 'Đang nộp' },
  { value: 'GRANTED', label: 'Đã được cấp' },
  { value: 'EXPIRED', label: 'Hết hiệu lực' },
  { value: 'REJECTED', label: 'Bị từ chối' }
];

const protectionTerritories = [
  { value: 'VN (Cục SHTT)', tooltip: 'Bảo hộ trong lãnh thổ Việt Nam' },
  { value: 'PCT (đơn quốc tế)', tooltip: 'Đơn quốc tế, chưa phải bằng sáng chế' },
  { value: 'EP/EPO (Châu Âu)', tooltip: 'Văn phòng sáng chế châu Âu' },
  { value: 'US/USPTO (Hoa Kỳ)', tooltip: 'Cơ quan sáng chế và nhãn hiệu Hoa Kỳ' },
  { value: 'CN/CNIPA (Trung Quốc)', tooltip: 'Cơ quan sở hữu trí tuệ Trung Quốc' },
  { value: 'JP/JPO (Nhật Bản)', tooltip: 'Cơ quan sáng chế Nhật Bản' },
  { value: 'WO khác...', tooltip: 'Các tổ chức quốc tế khác' }
];

const certifications = [
  { value: 'CE Marking (EU)', tooltip: 'Chứng nhận tuân thủ quy định châu Âu' },
  { value: 'FDA Approval (US)', tooltip: 'Phê duyệt của Cơ quan Quản lý Thực phẩm và Dược phẩm Mỹ' },
  { value: 'ISO 9001 (QMS)', tooltip: 'Hệ thống quản lý chất lượng quốc tế' },
  { value: 'ISO/IEC 27001 (ISMS)', tooltip: 'Hệ thống quản lý an ninh thông tin' },
  { value: 'ISO 13485 (Thiết bị y tế)', tooltip: 'Hệ thống quản lý chất lượng thiết bị y tế' },
  { value: 'IEC/EN (thiết bị điện – điện tử)', tooltip: 'Tiêu chuẩn quốc tế về thiết bị điện tử' },
  { value: 'Khác...', tooltip: 'Các chứng nhận tiêu chuẩn khác' }
];

const commercializationMethods = [
  { value: 'B2B', tooltip: 'Bán cho doanh nghiệp khác' },
  { value: 'B2C', tooltip: 'Bán trực tiếp cho người tiêu dùng' },
  { value: 'Licensing', tooltip: 'Cấp phép sử dụng công nghệ' },
  { value: 'OEM/ODM', tooltip: 'Sản xuất theo đơn đặt hàng' },
  { value: 'Joint Venture', tooltip: 'Liên doanh với đối tác' },
  { value: 'Spin-off', tooltip: 'Tách ra thành công ty riêng' }
];

const transferMethods = [
  { value: 'Chuyển nhượng toàn bộ', tooltip: 'Bán hoàn toàn quyền sở hữu' },
  { value: 'Chuyển nhượng một phần', tooltip: 'Bán một phần quyền sở hữu' },
  { value: 'License độc quyền', tooltip: 'Cấp phép độc quyền cho một bên' },
  { value: 'License không độc quyền', tooltip: 'Cấp phép cho nhiều bên' },
  { value: 'Sub-license', tooltip: 'Cho phép bên được cấp phép cấp lại' },
  { value: 'Kèm dịch vụ kỹ thuật', tooltip: 'Bao gồm hỗ trợ kỹ thuật, training' }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        fields,
        industries,
        specialties,
        trlLevels,
        categories,
        ipTypes,
        ipStatuses,
        protectionTerritories,
        certifications,
        commercializationMethods,
        transferMethods
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load master data' },
      { status: 500 }
    );
  }
}
