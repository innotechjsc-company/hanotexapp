import { NextResponse } from 'next/server';

// Master data cho hình thức chuyển quyền
const transferMethods = [
  { value: 'Chuyển nhượng toàn bộ', tooltip: 'Bán hoàn toàn quyền sở hữu' },
  { value: 'Chuyển nhượng một phần', tooltip: 'Bán một phần quyền sở hữu' },
  { value: 'License độc quyền', tooltip: 'Cấp phép độc quyền cho một bên' },
  { value: 'License không độc quyền', tooltip: 'Cấp phép cho nhiều bên' },
  { value: 'Sub-license', tooltip: 'Cho phép bên được cấp phép cấp lại' },
  { value: 'Kèm dịch vụ kỹ thuật', tooltip: 'Bao gồm hỗ trợ kỹ thuật, training' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: transferMethods
  });
}
