import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable built-in optimization so any remote URLs (even with query params like `url=`) just load.
    unoptimized: true,
    // In case you switch back to optimized later, this keeps SVGs allowed
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Loosen remote patterns so external images load regardless of host
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
