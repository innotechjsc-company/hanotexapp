// Load environment variables from .env files
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: [
      "localhost", 
      "hanotex.com", 
      "127.0.0.1", 
      "images.unsplash.com",
      "commondatastorage.googleapis.com",
      "cdnjs.cloudflare.com",
      "images.pexels.com"
    ],
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.hanotex.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdnjs.cloudflare.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tile.openstreetmap.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["@heroui/react", "@heroui/theme", "@heroui/system"],
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_PAYLOAD_API_URL:
      process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:4000/api",
  },
  async rewrites() {
    // Only proxy non-auth API routes to backend
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
