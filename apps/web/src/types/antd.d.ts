// Type definitions for Ant Design integration

import type { ThemeConfig } from 'antd';

// Extend the global theme configuration
declare module 'antd' {
  interface ThemeConfig {
    // Add any custom theme properties if needed
    customProperties?: {
      [key: string]: any;
    };
  }
}

// Custom Ant Design component props extensions
export interface CustomAntdProps {
  className?: string;
  style?: React.CSSProperties;
}

// Table column types with Vietnamese labels
export interface VietnameseTableColumn<T = any> {
  title: string;
  dataIndex?: keyof T;
  key?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
}

// Form field types for Vietnamese forms
export interface VietnameseFormField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'daterange';
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
}

// Notification and Message types with Vietnamese content
export interface VietnameseNotification {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

// Modal configuration for Vietnamese content
export interface VietnameseModalConfig {
  title: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number;
  centered?: boolean;
}

// Upload configuration
export interface CustomUploadConfig {
  accept?: string;
  maxSize?: number; // in MB
  maxCount?: number;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onSuccess?: (response: any, file: File) => void;
  onError?: (error: any, file: File) => void;
}

// Date picker configuration for Vietnamese locale
export interface VietnameseDatePickerConfig {
  format?: string;
  placeholder?: string;
  disabledDate?: (current: any) => boolean;
  showTime?: boolean;
  locale?: any;
}

// Select configuration with Vietnamese options
export interface VietnameseSelectConfig {
  placeholder?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: boolean | ((input: string, option: any) => boolean);
  options: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;
}

// Pagination configuration with Vietnamese labels
export interface VietnamesePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  pageSizeOptions?: string[];
}

// Breadcrumb item for Vietnamese navigation
export interface VietnameseBreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

// Menu item configuration
export interface VietnameseMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: VietnameseMenuItem[];
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

// Steps configuration for Vietnamese content
export interface VietnameseStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

// Tag configuration
export interface VietnameseTag {
  label: string;
  color?: string;
  closable?: boolean;
  onClose?: () => void;
}

// Drawer configuration
export interface VietnameseDrawerConfig {
  title: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  onClose?: () => void;
}

// Popconfirm configuration
export interface VietnamesePopconfirmConfig {
  title: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  icon?: React.ReactNode;
}

// Tooltip configuration
export interface VietnameseTooltipConfig {
  title: string;
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  trigger?: 'hover' | 'focus' | 'click' | 'contextMenu';
  color?: string;
}

// Common response types for API integration
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  current: number;
  pageSize: number;
}

// Form validation rules in Vietnamese
export const vietnameseValidationRules = {
  required: { required: true, message: 'Trường này là bắt buộc!' },
  email: { type: 'email' as const, message: 'Email không hợp lệ!' },
  phone: { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
  minLength: (min: number) => ({ min, message: `Tối thiểu ${min} ký tự!` }),
  maxLength: (max: number) => ({ max, message: `Tối đa ${max} ký tự!` }),
  number: { type: 'number' as const, message: 'Vui lòng nhập số!' },
  url: { type: 'url' as const, message: 'URL không hợp lệ!' },
};

// Common Vietnamese labels and messages
export const vietnameseLabels = {
  // Common actions
  save: 'Lưu',
  cancel: 'Hủy',
  delete: 'Xóa',
  edit: 'Sửa',
  add: 'Thêm',
  search: 'Tìm kiếm',
  filter: 'Lọc',
  export: 'Xuất',
  import: 'Nhập',
  refresh: 'Làm mới',
  reset: 'Đặt lại',
  submit: 'Gửi',
  confirm: 'Xác nhận',
  
  // Common fields
  name: 'Tên',
  email: 'Email',
  phone: 'Số điện thoại',
  address: 'Địa chỉ',
  description: 'Mô tả',
  status: 'Trạng thái',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',
  
  // Messages
  success: 'Thành công!',
  error: 'Có lỗi xảy ra!',
  warning: 'Cảnh báo!',
  info: 'Thông tin',
  loading: 'Đang tải...',
  noData: 'Không có dữ liệu',
  confirmDelete: 'Bạn có chắc chắn muốn xóa?',
  
  // Pagination
  total: (total: number) => `Tổng cộng ${total} mục`,
  itemsPerPage: 'mục/trang',
  page: 'Trang',
  
  // Table
  actions: 'Hành động',
  noDataText: 'Không có dữ liệu',
  
  // Form
  pleaseSelect: 'Vui lòng chọn',
  pleaseInput: 'Vui lòng nhập',
};
