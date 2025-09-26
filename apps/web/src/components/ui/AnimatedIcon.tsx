"use client";

import { ReactNode, useEffect, useState } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  animation?: "bounce" | "pulse" | "float" | "rotate" | "spin" | "wiggle" | "shake";
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function AnimatedIcon({
  children,
  animation = "bounce",
  delay = 0,
  duration = 2000,
  size = "md",
  className = "",
}: AnimatedIconProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const animationClasses = {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    float: "animate-float",
    rotate: "animate-spin",
    spin: "animate-spin",
    wiggle: "animate-wiggle",
    shake: "animate-shake",
  };

  const animationStyle = {
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${isVisible ? animationClasses[animation] : ""}
        ${className}
      `}
      style={animationStyle}
    >
      {children}
    </div>
  );
}
