/**
 * Media URL utilities
 * Utilities for handling media URLs from PayloadCMS
 */

import { PAYLOAD_API_BASE_URL } from "@/api/config";

/**
 * Convert relative media URL to full URL with CMS domain
 * @param url - The media URL (can be relative or absolute)
 * @returns Full URL with CMS domain
 */
export const getFullMediaUrl = (url: string): string => {
  if (!url) return "";

  // If URL already has protocol (http/https), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Get base URL without /api suffix
  const baseUrl = PAYLOAD_API_BASE_URL.replace("/api", "");

  // If URL starts with /, it's a relative path from CMS root
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // If it's just a filename or relative path, prepend CMS base URL
  return `${baseUrl}/${url}`;
};

/**
 * Get media URL with debug logging
 * @param url - The media URL
 * @param context - Context for debugging (optional)
 * @returns Full URL with CMS domain
 */
export const getMediaUrlWithDebug = (url: string, context?: string): string => {
  const fullUrl = getFullMediaUrl(url);
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[Media URL${context ? ` - ${context}` : ""}] ${url} -> ${fullUrl}`);
  }
  
  return fullUrl;
};

/**
 * Check if URL is a valid media URL
 * @param url - The URL to check
 * @returns True if URL is valid
 */
export const isValidMediaUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(getFullMediaUrl(url));
    return true;
  } catch {
    return false;
  }
};
