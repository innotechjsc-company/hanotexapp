import { NextResponse } from 'next/server';

// Mock categories data - in real app, this would come from database
const categories = [
  { id: '1', name: 'Điện – Điện tử – CNTT', code: 'EEICT' },
  { id: '2', name: 'Vật liệu & Công nghệ vật liệu', code: 'MTRL' },
  { id: '3', name: 'Cơ khí – Động lực', code: 'MECH' },
  { id: '4', name: 'Công nghệ sinh học y dược', code: 'BIOTECH' },
  { id: '5', name: 'Năng lượng & Môi trường', code: 'ENERGY' },
  { id: '6', name: 'Nông nghiệp & Thực phẩm', code: 'AGRI' },
  { id: '7', name: 'Xây dựng & Kiến trúc', code: 'CONSTR' },
  { id: '8', name: 'Giao thông vận tải', code: 'TRANSPORT' }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
