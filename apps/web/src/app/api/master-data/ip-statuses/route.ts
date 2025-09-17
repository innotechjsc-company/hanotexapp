import { NextResponse } from 'next/server';

// Master data cho các tình trạng IP
const ipStatuses = [
  { value: 'PENDING', label: 'Đang nộp' },
  { value: 'GRANTED', label: 'Đã được cấp' },
  { value: 'EXPIRED', label: 'Hết hiệu lực' },
  { value: 'REJECTED', label: 'Bị từ chối' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ipStatuses
  });
}
