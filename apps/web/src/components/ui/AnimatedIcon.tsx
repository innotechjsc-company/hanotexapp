"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type AnimatedType = "bounce" | "pulse" | "rotate" | "float";

export interface AnimatedIconProps {
  children: React.ReactNode;
  animation?: AnimatedType;
  delay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function AnimatedIcon({
  children,
  animation = "pulse",
  delay = 0,
  size = "md",
  className,
}: AnimatedIconProps) {
  const animateClass =
    animation === "bounce"
      ? "animate-bounce"
      : animation === "rotate"
      ? "animate-spin"
      : animation === "float"
      ? "animate-pulse"
      : "animate-pulse";

  const scale = size === "sm" ? 0.9 : size === "lg" ? 1.1 : 1;

  return (
    <span
      className={cn("inline-flex", animateClass, className)}
      style={{ animationDelay: `${delay}ms`, transform: `scale(${scale})` }}
      role="presentation"
    >
      {children}
    </span>
  );
}

// Support both default and named export for compatibility across files
export { AnimatedIcon };
export default AnimatedIcon;

