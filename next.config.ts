import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzmykhkriehznltaitqa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  redirects: async () => [
    // Legacy locale URLs → new market slugs
    { source: "/zh-MY/:path*", destination: "/cn/:path*", permanent: true },
    { source: "/ms/:path*", destination: "/my/:path*", permanent: true },
    { source: "/zh-TW/:path*", destination: "/tw/:path*", permanent: true },
    { source: "/en/:path*", destination: "/cn/:path*", permanent: true },
  ],
};

export default nextConfig;
