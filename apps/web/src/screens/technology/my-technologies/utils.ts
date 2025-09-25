import type {
  TechnologyStatus,
  Currency,
  PricingType,
} from "@/types/technologies";

/**
 * Helper function to format currency
 */
export const formatCurrency = (amount: number, currency: Currency = "vnd") => {
  if (currency === "vnd") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  } else if (currency === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  } else if (currency === "eur") {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }
  return amount.toString();
};

/**
 * Helper function to format date
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
};

/**
 * Helper function to get status color for UI components
 */
export const getStatusColor = (status: TechnologyStatus) => {
  switch (status) {
    case "draft":
      return "default";
    case "pending":
      return "warning";
    case "approved":
    case "active":
      return "success";
    case "rejected":
    case "inactive":
      return "danger";
    default:
      return "default";
  }
};

/**
 * Helper function to get status label in Vietnamese
 */
export const getStatusLabel = (status: TechnologyStatus) => {
  switch (status) {
    case "draft":
      return "Bản nháp";
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return status;
  }
};

/**
 * Helper function to get pricing type label
 */
export const getPricingTypeLabel = (type: PricingType) => {
  switch (type) {
    case "grant_seed":
      return "Grant/Seed (TRL 1–3)";
    case "vc_joint_venture":
      return "VC/Joint Venture (TRL 4–6)";
    case "growth_strategic":
      return "Growth/Strategic (TRL 7–9)";
    default:
      return type;
  }
};

/**
 * Helper function to check user authentication
 */
export const checkUserAuth = (user: any, router: any) => {
  if (!user) {
    const toast = require("react-hot-toast").default;
    toast.error("Vui lòng đăng nhập để tiếp tục");
    router.push("/auth/login");
    return false;
  }
  return true;
};

/**
 * Helper function to get visibility mode label
 */
export const getVisibilityModeLabel = (mode: string) => {
  switch (mode) {
    case "public":
      return "Công khai";
    case "private":
      return "Riêng tư";
    case "restricted":
      return "Hạn chế";
    default:
      return mode;
  }
};
