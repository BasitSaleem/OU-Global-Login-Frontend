import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["owners-universe.s3.us-west-2.amazonaws.com", "d3ehuwavfiyehw.cloudfront.net", 'https://owners-universe-prod.s3.ap-southeast-1.amazonaws.com', "lh3.googleusercontent.com"],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
