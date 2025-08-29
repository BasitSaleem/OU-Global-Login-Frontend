import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],  // <-- SVGR loader
    });

    return config; // 👈 must return config
  },
};

export default nextConfig;
