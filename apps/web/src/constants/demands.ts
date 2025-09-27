export const demandStatuses = [
  { value: "ACTIVE", label: "Đang tìm kiếm" },
  { value: "FULFILLED", label: "Đã tìm thấy" },
  { value: "EXPIRED", label: "Hết hạn" },
];

export const cooperationTypes = [
  { value: "Hợp tác", label: "Hợp tác" },
  { value: "Tư vấn", label: "Tư vấn" },
  { value: "Chuyển giao", label: "Chuyển giao" },
  { value: "Licensing", label: "Licensing" },
  { value: "Joint Venture", label: "Joint Venture" },
  { value: "Outsourcing", label: "Outsourcing" },
];

export const sortOptions = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "updatedAt", label: "Cập nhật" },
  { value: "title", label: "Tên" },
  { value: "from_price", label: "Giá từ thấp đến cao" },
  { value: "-from_price", label: "Giá từ cao đến thấp" },
];

// Helper function to get status text and color
export const getStatusInfo = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return { text: "Đang tìm kiếm", color: "processing" };
    case "FULFILLED":
      return { text: "Đã tìm thấy", color: "success" };
    case "EXPIRED":
      return { text: "Hết hạn", color: "default" };
    default:
      return { text: status, color: "default" };
  }
};

// Helper function to format price range
export const formatPriceRange = (fromPrice?: number, toPrice?: number): string => {
  if (fromPrice && toPrice) {
    return `${fromPrice.toLocaleString()} - ${toPrice.toLocaleString()} VNĐ`;
  }
  if (fromPrice) {
    return `Từ ${fromPrice.toLocaleString()} VNĐ`;
  }
  if (toPrice) {
    return `Đến ${toPrice.toLocaleString()} VNĐ`;
  }
  return "Thỏa thuận";
};