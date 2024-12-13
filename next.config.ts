import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:  {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'scontent.cdninstagram.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'graph.instagram.com',
      port: '',
      pathname: '/**',
    }],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [320, 480, 640], // Reduced sizes for thumbnails
    imageSizes: [16, 32, 64, 96], // Smaller image sizes
    formats: ['image/webp'], // Prefer WebP for better compression
  },
};

export default nextConfig;

 