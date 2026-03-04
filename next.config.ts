import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // lint 由 pre-commit hook（pnpm lint）負責，build 時略過避免重複執行
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
