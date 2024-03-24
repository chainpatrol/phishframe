import analyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: true,
  transpilePackages: ["@farcaster/core", "frames.js"],
  experimental: {
    optimizePackageImports: ["@farcaster/core", "frames.js"],
  },
};

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
