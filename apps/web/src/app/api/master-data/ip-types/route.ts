import { NextResponse } from 'next/server';

// Master data cho các loại hình IP
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ipTypes
  });
}
