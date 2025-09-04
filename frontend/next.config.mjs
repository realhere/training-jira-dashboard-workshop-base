/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // 忽略 Grammarly 等瀏覽器擴充功能造成的 hydration mismatch
    suppressHydrationWarning: true,
  },
}

export default nextConfig
