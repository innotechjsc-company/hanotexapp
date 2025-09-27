"use client";

import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

interface SEOParams {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  structuredData?: any;
}

export const useSEO = ({
  title = "HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội",
  description = "Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội",
  keywords = ["HANOTEX", "sàn giao dịch công nghệ"],
  canonical,
  noIndex = false,
  ogImage = "/og-image.jpg",
  structuredData,
}: SEOParams) => {
  const router = useRouter();
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    
    // Update canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    
    updateOGTag("og:title", title);
    updateOGTag("og:description", description);
    updateOGTag("og:image", ogImage);
    updateOGTag("og:url", router.asPath);
    
    // Structured data
    if (structuredData) {
      let script = document.getElementById("structured-data") as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "structured-data";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, canonical, ogImage, structuredData, router.asPath]);
};
