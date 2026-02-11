import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable optimization for better performance
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Supported formats for modern browsers
    formats: ['image/webp', 'image/avif'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Enable compression
  compress: true,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Remove powered by header
  poweredByHeader: false,
};

export default nextConfig;
