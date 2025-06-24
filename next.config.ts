import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
