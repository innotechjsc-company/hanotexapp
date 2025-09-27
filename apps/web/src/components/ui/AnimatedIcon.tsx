"use client";

import { ReactNode } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  animation?: 'bounce' | 'pulse' | 'rotate' | 'float' | 'spin' | 'shake' | 'heartbeat';
  delay?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function AnimatedIcon({
  children,
  animation = 'bounce',
  delay = 0,
  className = "",
  size = 'md'
}: AnimatedIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const animationClasses = {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    rotate: "animate-spin",
    float: "animate-bounce",
    spin: "animate-spin",
    shake: "animate-bounce",
    heartbeat: "animate-pulse",
  };

  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (
    <div 
      className={`${sizeClasses[size]} ${animationClasses[animation]} ${className} inline-flex items-center justify-center`}
      style={delayStyle}
    >
      {children}
    </div>
  );
}

export { AnimatedIcon };
export default AnimatedIcon;
