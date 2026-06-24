import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "owners-universe.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d3ehuwavfiyehw.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "owners-universe-prod.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

    ],
  },

  turbopack: {},
};

export default nextConfig;