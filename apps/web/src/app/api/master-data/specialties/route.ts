import { NextResponse } from 'next/server';

// Master data cho các chuyên ngành
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: specialties
  });
}
