import { IPStatus, IPType } from "@/types/IntellectualProperty";

export const trlLevels = [
  { value: 1, label: "TRL 1 - Nguyên lý cơ bản" },
  { value: 2, label: "TRL 2 - Khái niệm công nghệ" },
  { value: 3, label: "TRL 3 - Bằng chứng khái niệm" },
  { value: 4, label: "TRL 4 - Xác thực trong phòng thí nghiệm" },
  { value: 5, label: "TRL 5 - Xác thực trong môi trường liên quan" },
  { value: 6, label: "TRL 6 - Trình diễn trong môi trường liên quan" },
  { value: 7, label: "TRL 7 - Trình diễn trong môi trường vận hành" },
  { value: 8, label: "TRL 8 - Hệ thống hoàn chỉnh và đủ điều kiện" },
  { value: 9, label: "TRL 9 - Hệ thống thực tế được chứng minh" },
];

export const ipTypes: { value: IPType; label: string; description: string }[] = [
  {
    value: "patent",
    label: "Sáng chế (Patent)",
    description:
      "Giải pháp kỹ thuật mới, sáng tạo, áp dụng công nghiệp. Bảo hộ 20 năm.",
  },
  {
    value: "utility_solution",
    label: "Giải pháp hữu ích",
    description: "Giải pháp kỹ thuật mới so với hiện tại. Bảo hộ 10 năm.",
  },
  {
    value: "industrial_design",
    label: "Kiểu dáng công nghiệp",
    description: "Hình dáng bên ngoài sản phẩm. Bảo hộ 15 năm.",
  },
  {
    value: "trademark",
    label: "Nhãn hiệu",
    description:
      "Dấu hiệu phân biệt hàng hóa/dịch vụ. Bảo hộ 10 năm, có thể gia hạn.",
  },
  {
    value: "copyright",
    label: "Quyền tác giả",
    description: "Bảo hộ mã nguồn, thuật toán. Bảo hộ suốt đời + 50 năm.",
  },
  {
    value: "trade_secret",
    label: "Bí mật kinh doanh",
    description: "Thông tin có giá trị thương mại, bảo mật. Không có thời hạn.",
  },
];

export const ipStatuses: { value: IPStatus; label: string }[] = [
  { value: "pending", label: "Đang nộp" },
  { value: "granted", label: "Đã được cấp" },
  { value: "expired", label: "Hết hiệu lực" },
  { value: "rejected", label: "Bị từ chối" },
];

export const protectionTerritories = [
  { value: "VN (Cục SHTT)", tooltip: "Bảo hộ trong lãnh thổ Việt Nam" },
  {
    value: "PCT (đơn quốc tế)",
    tooltip: "Đơn quốc tế, chưa phải bằng sáng chế",
  },
  { value: "EP/EPO (Châu Âu)", tooltip: "Văn phòng sáng chế châu Âu" },
  {
    value: "US/USPTO (Hoa Kỳ)",
    tooltip: "Cơ quan sáng chế và nhãn hiệu Hoa Kỳ",
  },
  {
    value: "CN/CNIPA (Trung Quốc)",
    tooltip: "Cơ quan sở hữu trí tuệ Trung Quốc",
  },
  { value: "JP/JPO (Nhật Bản)", tooltip: "Cơ quan sáng chế Nhật Bản" },
  { value: "WO khác...", tooltip: "Các tổ chức quốc tế khác" },
];

export const certifications = [
  { value: "CE Marking (EU)", tooltip: "Chứng nhận tuân thủ quy định châu Âu" },
  {
    value: "FDA Approval (US)",
    tooltip: "Phê duyệt của Cơ quan Quản lý Thực phẩm và Dược phẩm Mỹ",
  },
  { value: "ISO 9001 (QMS)", tooltip: "Hệ thống quản lý chất lượng quốc tế" },
  {
    value: "ISO/IEC 27001 (ISMS)",
    tooltip: "Hệ thống quản lý an ninh thông tin",
  },
  {
    value: "ISO 13485 (Thiết bị y tế)",
    tooltip: "Hệ thống quản lý chất lượng thiết bị y tế",
  },
  {
    value: "IEC/EN (thiết bị điện – điện tử)",
    tooltip: "Tiêu chuẩn quốc tế về thiết bị điện tử",
  },
  { value: "Khác...", tooltip: "Các chứng nhận tiêu chuẩn khác" },
];

export const commercializationMethods = [
  { value: "B2B", tooltip: "Bán cho doanh nghiệp khác" },
  { value: "B2C", tooltip: "Bán trực tiếp cho người tiêu dùng" },
  { value: "Licensing", tooltip: "Cấp phép sử dụng công nghệ" },
  { value: "OEM/ODM", tooltip: "Sản xuất theo đơn đặt hàng" },
  { value: "Joint Venture", tooltip: "Liên doanh với đối tác" },
  { value: "Spin-off", tooltip: "Tách ra thành công ty riêng" },
];

export const transferMethods = [
  { value: "Chuyển nhượng toàn bộ", tooltip: "Bán hoàn toàn quyền sở hữu" },
  { value: "Chuyển nhượng một phần", tooltip: "Bán một phần quyền sở hữu" },
  { value: "License độc quyền", tooltip: "Cấp phép độc quyền cho một bên" },
  { value: "License không độc quyền", tooltip: "Cấp phép cho nhiều bên" },
  { value: "Sub-license", tooltip: "Cho phép bên được cấp phép cấp lại" },
  {
    value: "Kèm dịch vụ kỹ thuật",
    tooltip: "Bao gồm hỗ trợ kỹ thuật, training",
  },
];
