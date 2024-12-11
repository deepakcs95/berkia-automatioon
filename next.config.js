/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['graph.instagram.com', 'scontent.cdninstagram.com'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [320, 480, 640], // Reduced sizes for thumbnails
    imageSizes: [16, 32, 64, 96], // Smaller image sizes
    formats: ['image/webp'], // Prefer WebP for better compression
  },
}

module.exports = nextConfig
