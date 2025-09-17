import { NextResponse } from 'next/server';

// Master data cho các danh mục
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: categories
  });
}
