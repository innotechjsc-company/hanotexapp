import { NextResponse } from 'next/server';

// Master data cho phương án thương mại hóa
const commercializationMethods = [
  { value: 'B2B', tooltip: 'Bán cho doanh nghiệp khác' },
  { value: 'B2C', tooltip: 'Bán trực tiếp cho người tiêu dùng' },
  { value: 'Licensing', tooltip: 'Cấp phép sử dụng công nghệ' },
  { value: 'OEM/ODM', tooltip: 'Sản xuất theo đơn đặt hàng' },
  { value: 'Joint Venture', tooltip: 'Liên doanh với đối tác' },
  { value: 'Spin-off', tooltip: 'Tách ra thành công ty riêng' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: commercializationMethods
  });
}
