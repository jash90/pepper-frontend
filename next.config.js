/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    domains: [
      'pepper.pl', 
      'www.pepper.pl', 
      'static.pepper.pl',
      'example.com',
      'www.example.com',
      'cdn.pepper.pl',
      'img.pepper.pl',
      'a.allegroimg.com',
      'assets.allegrostatic.com',
      'prod-dcdn.mrgugu.com',
      'media.x-kom.pl',
      'images.morele.net',
      'f00.esfr.pl',
      'apollo-ireland.akamaized.net',
      'media.komputronik.pl',
      'mm.eu.audio-technica.com',
      'www.mediaexpert.pl',
      'www.neo24.pl',
      'mediamarkt.pl',
      'www.mediamarkt.pl',
      'saturn.pl',
      'www.saturn.pl'
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*).(jpg|jpeg|png|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*).(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      'react-icons',
      'lodash',
    ],
  },
};

module.exports = nextConfig; 