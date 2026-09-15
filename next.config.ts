import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { env } from "./lib/env";

const isProd = env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  turbopack: {},
  reactStrictMode: true,
  reactCompiler: isProd,

  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],

  experimental: {
    inlineCss: isProd,
    optimizePackageImports: [
      "@phosphor-icons/react",
      "motion",
      "class-variance-authority",
    ],
  },

  ...(isProd && {
    compiler: {
      removeConsole: {
        exclude: ["error"],
      },
    },
  }),
  logging: {
    fetches: {},
    // browserToTerminal: true,
  },

  async headers() {
    const immutableAsset = {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    };
    return [
      { source: "/bg.mp4", headers: [immutableAsset] },
      { source: "/bg-poster.jpg", headers: [immutableAsset] },
      { source: "/flower-icon.png", headers: [immutableAsset] },
      { source: "/leaf-icon.png", headers: [immutableAsset] },
      { source: "/sounds/:path*", headers: [immutableAsset] },
    ];
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  reloadOnOnline: true,
});

export default withSerwist(nextConfig);
