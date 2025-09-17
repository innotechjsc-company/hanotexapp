import { MasterData, TRLSuggestion } from "../types";

export const getIPTypeDescription = (ipType: string, masterData?: MasterData): string => {
  if (!masterData?.ipTypes) return "";
  const ipTypeData = masterData.ipTypes.find((ip) => ip.value === ipType);
  return ipTypeData?.description || "";
};

export const suggestTRLFromContent = (content: string): string => {
  const lowerContent = content.toLowerCase();

  // TRL 1-3: Nguyên lý, khái niệm, bằng chứng thực nghiệm
  if (
    lowerContent.includes("nguyên lý") ||
    lowerContent.includes("khái niệm") ||
    lowerContent.includes("lý thuyết") ||
    lowerContent.includes("giả thuyết")
  ) {
    return "1";
  }

  // TRL 4-6: Mẫu thử, nguyên mẫu
  if (
    lowerContent.includes("mẫu thử") ||
    lowerContent.includes("nguyên mẫu") ||
    lowerContent.includes("prototype") ||
    lowerContent.includes("demo")
  ) {
    return "5";
  }

  // TRL 7-9: Pilot, thương mại hóa
  if (
    lowerContent.includes("pilot") ||
    lowerContent.includes("thương mại") ||
    lowerContent.includes("sản xuất") ||
    lowerContent.includes("thị trường")
  ) {
    return "8";
  }

  return "3"; // Default
};

export const getTRLSuggestions = (trlLevel: string): TRLSuggestion | null => {
  const suggestions: Record<string, TRLSuggestion> = {
    "1": {
      title: "TRL 1 - Nguyên lý cơ bản",
      fields: [
        "Giả thuyết khoa học",
        "Khung lý thuyết",
        "Phương pháp nghiên cứu",
        "Kế hoạch R&D",
      ],
    },
    "2": {
      title: "TRL 2 - Khái niệm công nghệ",
      fields: [
        "Khái niệm công nghệ",
        "Phân tích tính khả thi",
        "Thiết kế sơ bộ",
        "Đánh giá rủi ro",
      ],
    },
    "3": {
      title: "TRL 3 - Bằng chứng thực nghiệm",
      fields: [
        "Kết quả thử nghiệm cơ sở",
        "Bằng chứng khoa học",
        "Phân tích dữ liệu",
        "Báo cáo nghiên cứu",
      ],
    },
    "4": {
      title: "TRL 4 - Mẫu thử trong lab",
      fields: [
        "Mẫu thử trong phòng thí nghiệm",
        "BOM linh kiện",
        "Sơ đồ kỹ thuật",
        "Video demo",
      ],
    },
    "5": {
      title: "TRL 5 - Mẫu thử gần điều kiện thực",
      fields: [
        "Mẫu thử trong môi trường thực tế",
        "Kết quả pilot",
        "Yêu cầu hạ tầng",
        "Đánh giá hiệu suất",
      ],
    },
    "6": {
      title: "TRL 6 - Nguyên mẫu",
      fields: [
        "Nguyên mẫu hoàn chỉnh",
        "Thử nghiệm tích hợp",
        "Đánh giá độ tin cậy",
        "Tối ưu hóa thiết kế",
      ],
    },
    "7": {
      title: "TRL 7 - Trình diễn quy mô pilot",
      fields: [
        "Hệ thống pilot",
        "Thử nghiệm quy mô lớn",
        "Đánh giá thương mại",
        "Kế hoạch sản xuất",
      ],
    },
    "8": {
      title: "TRL 8 - Hoàn thiện",
      fields: [
        "Hệ thống hoàn chỉnh",
        "Quy trình sản xuất",
        "Tiêu chuẩn chất lượng",
        "Đào tạo vận hành",
      ],
    },
    "9": {
      title: "TRL 9 - Thương mại hóa",
      fields: [
        "Sản phẩm thương mại",
        "Case study khách hàng",
        "Dữ liệu thị trường",
        "Kế hoạch mở rộng",
      ],
    },
  };

  return suggestions[trlLevel] || null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileSize = (file: File, maxSize: number = 10 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.toLowerCase().includes(type.toLowerCase());
  });
};

export const generateFileId = (): number => {
  return Date.now() + Math.random();
};

export const calculateOwnershipTotal = (owners: Array<{ ownershipPercentage: number }>): number => {
  return owners.reduce((total, owner) => total + (owner.ownershipPercentage || 0), 0);
};

export const validateOwnershipPercentages = (owners: Array<{ ownershipPercentage: number }>): boolean => {
  const total = calculateOwnershipTotal(owners);
  return total === 100;
};