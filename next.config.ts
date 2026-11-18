import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * - User site repo  (<username>.github.io)  → leave NEXT_PUBLIC_BASE_PATH empty.
 * - Project site repo (<username>.github.io/<repo>) → set NEXT_PUBLIC_BASE_PATH=/<repo>
 *   (the GitHub Actions workflow does this automatically).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
