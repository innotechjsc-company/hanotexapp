"use client";

import Head from "next/head";

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
}

export default function SEOOptimizer({
  title = "HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội",
  description = "Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội - Kết nối doanh nghiệp, viện nghiên cứu và cá nhân trong lĩnh vực khoa học công nghệ",
  keywords = ["HANOTEX", "sàn giao dịch công nghệ", "Hà Nội", "khoa học công nghệ", "đấu giá công nghệ"],
  canonical,
  noIndex = false,
  ogImage = "/og-image.jpg",
  ogType = "website",
  structuredData,
}: SEOOptimizerProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

// Helper function để tạo structured data cho types khác nhau
export const createStructuredData = {
  technology: (tech: any) => ({
    "@context": "https://schema.org",
    "@type": "Technology",
    "name": tech.title,
    "description": tech.description,
    "category": tech.category,
    "provider": {
      "@type": "Organization",
      "name": tech.organization?.name,
    },
    "dateCreated": tech.createdAt,
  }),
  
  auction: (auction: any) => ({
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": auction.title,
    "description": auction.description,
    "price": auction.currentBid,
    "priceCurrency": "VND",
    "seller": {
      "@type": "Organization",
      "name": auction.organizer?.name,
    },
    "validThrough": auction.endTime,
  }),
  
  event: (event: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "location": {
      "@type": "Place",
      "name": event.location,
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer,
    },
  }),
};
