import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Disable type checking during build (handled by CI/CD)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Disable ESLint during build (handled by CI/CD)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
