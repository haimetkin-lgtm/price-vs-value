import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: "/price-vs-value",
  assetPrefix: "/price-vs-value",
};

export default nextConfig;
