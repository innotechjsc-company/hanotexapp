"use client";

import React, { useEffect, useState } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: Check,
    bgColor: "bg-green-500",
    textColor: "text-white",
  },
  error: {
    icon: X,
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500",
    textColor: "text-white",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
};

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const config = toastConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg
          transform transition-all duration-300 ease-in-out
          ${config.bgColor} ${config.textColor}
          ${
            isAnimating && isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
        `}
      >
        <IconComponent className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Hook for using toast
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
