"use client";

import { ReactNode } from "react";
import { Sparkles, Star, TrendingUp } from "lucide-react";

interface BannerProps {
  title?: string;
  subtitle?: string;
  background?: 'gradient' | 'pattern' | 'solid';
  theme?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  floating?: boolean;
  animated?: boolean;
  children?: ReactNode;
  className?: string;
}

function Banner({
  title,
  subtitle,
  background = "gradient",
  theme = "primary",
  size = "md",
  icon,
  floating = false,
  animated = true,
  children,
  className = "",
}: BannerProps) {
  const sizeClasses = {
    sm: "py-6 px-4",
    md: "py-12 px-6",
    lg: "py-20 px-8",
  };

  const backgroundClasses = {
    gradient: {
      primary: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
      secondary: "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800",
      success: "bg-gradient-to-r from-green-600 via-green-700 to-green-800",
      warning: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
    },
    pattern: {
      primary: "bg-blue-600 relative overflow-hidden",
      secondary: "bg-gray-600 relative overflow-hidden",
      success: "bg-green-600 relative overflow-hidden",
      warning: "bg-orange-500 relative overflow-hidden",
    },
    solid: {
      primary: "bg-blue-600",
      secondary: "bg-gray-600",
      success: "bg-green-600",
      warning: "bg-orange-500",
    },
  };

  const bgClass = backgroundClasses[background][theme];

  return (
    <div className={`relative ${floating ? "rounded-xl shadow-xl" : ""} ${bgClass} ${sizeClasses[size]} ${className}`}>
      {/* Pattern overlay for pattern background */}
      {background === "pattern" && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          {animated && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse" />
              <div className="absolute top-12 right-8 w-12 h-12 bg-white rounded-full opacity-20 animate-pulse animation-delay-200" />
              <div className="absolute bottom-8 left-1/4 w-8 h-8 bg-white rounded-full opacity-20 animate-pulse animation-delay-400" />
              <div className="absolute bottom-4 right-1/3 w-20 h-20 bg-white rounded-full opacity-20 animate-pulse animation-delay-600" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center text-white">
          {/* Icon */}
          {icon && (
            <div className="flex justify-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full ${animated ? "animate-bounce" : ""}`}>
                {icon}
              </div>
            </div>
          )}

          {/* Title and Subtitle */}
          {title && (
            <h2 className={`font-bold mb-4 ${
              size === "lg" ? "text-4xl md:text-5xl" : 
              size === "md" ? "text-3xl md:text-4xl" : 
              "text-2xl md:text-3xl"
            }`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`max-w-3xl mx-auto ${
              size === "lg" ? "text-lg md:text-xl" : 
              size === "md" ? "text-base md:text-lg" : 
              "text-sm md:text-base"
            } opacity-90`}>
              {subtitle}
            </p>
          )}

          {/* Children content */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>

      {/* Floating decorations */}
      {animated && !floating && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-4 h-4 bg-white opacity-30 rounded-full animate-pulse" />
          <div className="absolute top-12 right-8 w-2 h-2 bg-white opacity-40 rounded-full animate-pulse animation-delay-200" />
          <div className="absolute bottom-8 left-1/4 w-3 h-3 bg-white opacity-25 rounded-full animate-pulse animation-delay-400" />
          <div className="absolute bottom-4 right-1/3 w-5 h-5 bg-white opacity-20 rounded-full animate-pulse animation-delay-600" />
        </div>
      )}
    </div>
  );
}

export { Banner };
export default Banner;

// Icon Presets
export const BannerIcons = {
  sparkles: <Sparkles className="h-8 w-8 text-white" />,
  star: <Star className="h-8 w-8 text-white" />,
  trending: <TrendingUp className="h-8 w-8 text-white" />,
};
