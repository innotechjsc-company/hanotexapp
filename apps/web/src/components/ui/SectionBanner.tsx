"use client";

import { ReactNode } from "react";
import { Banner } from "./Banner";

interface SectionBannerProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'section' | 'feature';
}

function SectionBanner({
  title,
  subtitle,
  icon,
  children,
  className = "",
  variant = 'default'
}: SectionBannerProps) {
  const variants = {
    default: {
      background: 'gradient' as const,
      theme: 'primary' as const,
      size: 'md' as const,
      floating: false
    },
    hero: {
      background: 'pattern' as const,
      theme: 'primary' as const,
      size: 'lg' as const,
      floating: false
    },
    section: {
      background: 'gradient' as const,
      theme: 'secondary' as const,
      size: 'sm' as const,
      floating: true
    },
    feature: {
      background: 'gradient' as const,
      theme: 'success' as const,
      size: 'md' as const,
      floating: true
    }
  };

  const config = variants[variant];

  return (
    <Banner
      title={title}
      subtitle={subtitle}
      icon={icon}
      background={config.background}
      theme={config.theme}
      size={config.size}
      floating={config.floating}
      animated={true}
      className={className}
    >
      {children}
    </Banner>
  );
}

export { SectionBanner };
export default SectionBanner;
