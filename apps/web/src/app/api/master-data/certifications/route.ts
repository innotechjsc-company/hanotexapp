import { NextResponse } from 'next/server';

// Master data cho chứng nhận tiêu chuẩn/quy chuẩn
const certifications = [
  { value: 'CE Marking (EU)', tooltip: 'Chứng nhận tuân thủ quy định châu Âu' },
  { value: 'FDA Approval (US)', tooltip: 'Phê duyệt của Cơ quan Quản lý Thực phẩm và Dược phẩm Mỹ' },
  { value: 'ISO 9001 (QMS)', tooltip: 'Hệ thống quản lý chất lượng quốc tế' },
  { value: 'ISO/IEC 27001 (ISMS)', tooltip: 'Hệ thống quản lý an ninh thông tin' },
  { value: 'ISO 13485 (Thiết bị y tế)', tooltip: 'Hệ thống quản lý chất lượng thiết bị y tế' },
  { value: 'IEC/EN (thiết bị điện – điện tử)', tooltip: 'Tiêu chuẩn quốc tế về thiết bị điện tử' },
  { value: 'Khác...', tooltip: 'Các chứng nhận tiêu chuẩn khác' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: certifications
  });
}
