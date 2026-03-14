/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // hide X-Powered-By: Next.js
  compress: true, // enable gzip/brotli compression

  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // cache optimised images for 24 hours
    deviceSizes: [640, 768, 1024, 1280, 1600],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Production-grade HTTP security headers
  async headers() {
    return [
      // ── Static asset long-term caching ──────────────────────────────
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ── Public image/font assets ─────────────────────────────────────
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // ── All routes – security headers ───────────────────────────────
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content Security Policy – prevents XSS and data injection
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + inline (for Next.js hydration) + Google Fonts/Maps
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com",
              // Styles: self + inline (Tailwind etc.) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com data:",
              // Images: self + data URIs + blob + CDNs
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://maps.gstatic.com https://maps.googleapis.com https://*.googleusercontent.com",
              // Frames: self + Google Maps (for contact page iframe)
              "frame-src 'self' https://maps.google.com https://www.google.com",
              // Media: self
              "media-src 'self'",
              // API calls: self + external services used by the app
              "connect-src 'self' https://api.cloudinary.com https://maps.googleapis.com",
              // Workers: self + blob (Next.js)
              "worker-src 'self' blob:",
              // Form submissions: self only
              "form-action 'self'",
              // Base URI: self only (prevent base-tag hijacking)
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
