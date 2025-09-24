"use client";

import React, { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center";

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc = DEFAULT_FALLBACK,
  onLoad,
  onError,
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", currentSrc);
    
    if (!hasError && currentSrc !== fallbackSrc) {
      console.log("Switching to fallback image:", fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
    
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = () => {
    console.log("Image loaded successfully:", currentSrc);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
