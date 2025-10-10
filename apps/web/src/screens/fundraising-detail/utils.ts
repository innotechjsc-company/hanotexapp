import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { ReactElement } from "react";

interface StatusConfig {
  color: string;
  icon: ReactElement | null;
}

/**
 * Format a date string to Vietnamese locale
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "Chưa xác định";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa xác định";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Chưa xác định";
  }
}

/**
 * Format number as VND currency with abbreviations (B for billion, M for million)
 */
export function formatCurrencyAbbr(value?: number): string {
  if (typeof value !== "number") return "";
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}B ₫`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}M ₫`;
  }
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")} ₫`;
  }
}

/**
 * Get status label in Vietnamese
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "active":
      return "Đang hoạt động";
    case "rejected":
      return "Từ chối";
    default:
      return status || "Chưa xác định";
  }
}

/**
 * Get status configuration with color and icon
 */
export function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "pending":
      return {
        color: "processing",
        icon: React.createElement(ClockCircleOutlined),
      };
    case "active":
      return {
        color: "success",
        icon: React.createElement(CheckCircleOutlined),
      };
    case "rejected":
      return { color: "error", icon: React.createElement(CloseCircleOutlined) };
    default:
      return { color: "default", icon: null };
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  if (!filename) return "file";
  try {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext || "file";
  } catch {
    return "file";
  }
}

/**
 * Get file icon color based on extension
 */
export function getFileIconColor(filename: string): string {
  if (!filename) return "#722ed1";
  try {
    const ext = getFileExtension(filename);
    const colorMap: Record<string, string> = {
      pdf: "#ff4d4f",
      doc: "#1890ff",
      docx: "#1890ff",
      xls: "#52c41a",
      xlsx: "#52c41a",
      ppt: "#fa8c16",
      pptx: "#fa8c16",
      txt: "#8c8c8c",
    };
    return colorMap[ext] || "#722ed1";
  } catch {
    return "#722ed1";
  }
}

/**
 * Calculate days remaining until end date
 */
export function getDaysRemaining(endDate: string): number {
  if (!endDate) return 0;
  try {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0;
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  } catch {
    return 0;
  }
}
