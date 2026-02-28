const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = withPWA(nextConfig)
