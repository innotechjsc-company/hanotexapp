import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const extension = getFileExtension(filename).toLowerCase();
  return documentExtensions.includes(extension);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Technology statuses
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    ACTIVE: 'bg-blue-100 text-blue-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    
    // Auction statuses
    SCHEDULED: 'bg-blue-100 text-blue-800',
    ENDED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    
    // Transaction statuses
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-yellow-100 text-yellow-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    // Technology statuses
    DRAFT: 'Bản nháp',
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    
    // Auction statuses
    SCHEDULED: 'Đã lên lịch',
    ACTIVE: 'Đang diễn ra',
    ENDED: 'Đã kết thúc',
    CANCELLED: 'Đã hủy',
    
    // Transaction statuses
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
  };
  
  return statusTexts[status] || status;
}

export function getTRLLabel(level: number): string {
  const trlLabels: Record<number, string> = {
    1: 'Nguyên lý cơ bản được quan sát và báo cáo',
    2: 'Khái niệm công nghệ và/hoặc ứng dụng được xây dựng',
    3: 'Bằng chứng phân tích và thực nghiệm về khái niệm',
    4: 'Thành phần và/hoặc breadboard được xác thực trong môi trường phòng thí nghiệm',
    5: 'Thành phần và/hoặc breadboard được xác thực trong môi trường có liên quan',
    6: 'Hệ thống/mô hình được xác thực trong môi trường có liên quan',
    7: 'Nguyên mẫu hệ thống được chứng minh trong môi trường hoạt động',
    8: 'Hệ thống hoàn chỉnh và đủ điều kiện thông qua thử nghiệm và chứng minh',
    9: 'Hệ thống thực tế được chứng minh thông qua hoạt động thành công',
  };
  
  return trlLabels[level] || `TRL ${level}`;
}

export function getTRLColor(level: number): string {
  if (level <= 3) return 'bg-red-100 text-red-800';
  if (level <= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

export function getUserTypeLabel(userType: string): string {
  const userTypeLabels: Record<string, string> = {
    INDIVIDUAL: 'Cá nhân',
    COMPANY: 'Doanh nghiệp',
    RESEARCH_INSTITUTION: 'Viện/Trường',
  };
  
  return userTypeLabels[userType] || userType;
}

export function getPricingTypeLabel(pricingType: string): string {
  const pricingTypeLabels: Record<string, string> = {
    APPRAISAL: 'Định giá',
    ASK: 'Giá yêu cầu',
    AUCTION: 'Đấu giá',
    OFFER: 'Mở cho đề xuất',
  };
  
  return pricingTypeLabels[pricingType] || pricingType;
}

export function getAuctionTypeLabel(auctionType: string): string {
  const auctionTypeLabels: Record<string, string> = {
    ENGLISH: 'Đấu giá tăng dần',
    DUTCH: 'Đấu giá giảm dần',
    SEALED_BID: 'Đấu giá kín',
  };
  
  return auctionTypeLabels[auctionType] || auctionType;
}

export function getIPTypeLabel(ipType: string): string {
  const ipTypeLabels: Record<string, string> = {
    PATENT: 'Bằng sáng chế',
    UTILITY_MODEL: 'Giải pháp hữu ích',
    INDUSTRIAL_DESIGN: 'Kiểu dáng công nghiệp',
    TRADEMARK: 'Nhãn hiệu',
    SOFTWARE_COPYRIGHT: 'Bản quyền phần mềm',
    TRADE_SECRET: 'Bí mật kinh doanh',
  };
  
  return ipTypeLabels[ipType] || ipType;
}

