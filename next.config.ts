import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://klyroback.onrender.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.klyroo.online" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
