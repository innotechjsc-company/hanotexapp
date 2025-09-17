import { NextResponse } from 'next/server';

// Master data cho các lĩnh vực
const fields = [
  { value: 'SCI_NAT', label: 'Khoa học tự nhiên' },
  { value: 'SCI_ENG', label: 'Khoa học kỹ thuật & công nghệ' },
  { value: 'SCI_MED', label: 'Khoa học y, dược' },
  { value: 'SCI_AGR', label: 'Khoa học nông nghiệp' },
  { value: 'SCI_SOC', label: 'Khoa học xã hội' },
  { value: 'SCI_HUM', label: 'Khoa học nhân văn' },
  { value: 'SCI_INT', label: 'Khoa học liên ngành' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: fields
  });
}
