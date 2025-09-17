import { NextResponse } from 'next/server';

// Master data cho phạm vi bảo hộ/chứng nhận
const protectionTerritories = [
  { value: 'VN (Cục SHTT)', tooltip: 'Bảo hộ trong lãnh thổ Việt Nam' },
  { value: 'PCT (đơn quốc tế)', tooltip: 'Đơn quốc tế, chưa phải bằng sáng chế' },
  { value: 'EP/EPO (Châu Âu)', tooltip: 'Văn phòng sáng chế châu Âu' },
  { value: 'US/USPTO (Hoa Kỳ)', tooltip: 'Cơ quan sáng chế và nhãn hiệu Hoa Kỳ' },
  { value: 'CN/CNIPA (Trung Quốc)', tooltip: 'Cơ quan sở hữu trí tuệ Trung Quốc' },
  { value: 'JP/JPO (Nhật Bản)', tooltip: 'Cơ quan sáng chế Nhật Bản' },
  { value: 'WO khác...', tooltip: 'Các tổ chức quốc tế khác' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: protectionTerritories
  });
}
