"use client";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  animation?: "spin" | "pulse" | "bounce" | "pulse-dot";
  text?: string;
  className?: string;
}

export default function EnhancedLoadingSpinner({
  size = "md",
  color = "primary",
  animation = "spin",
  text,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorClasses = {
    primary: "border-gray-300 border-t-primary-600",
    secondary: "border-gray-300 border-t-secondary-600",
    success: "border-gray-300 border-t-green-600",
    warning: "border-gray-300 border-t-yellow-600",
    danger: "border-gray-300 border-t-red-600",
  };

  const animationClasses = {
    spin: "animate-spin",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    "pulse-dot": "animate-pulse animate-bounce",
  };

  const renderSpinner = () => {
    if (animation === "pulse-dot") {
      return (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "rounded-full border-2",
          colorClasses[color],
          animationClasses[animation],
          sizeClasses[size]
        )}
      />
    );
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      {renderSpinner()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
