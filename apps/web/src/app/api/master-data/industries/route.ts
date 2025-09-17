import { NextResponse } from 'next/server';

// Master data cho các ngành
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: industries
  });
}
