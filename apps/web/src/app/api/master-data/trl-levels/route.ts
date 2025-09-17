import { NextResponse } from 'next/server';

// Master data cho các mức độ TRL
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: trlLevels
  });
}
