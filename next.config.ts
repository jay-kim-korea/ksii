import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 회원가입 시 사업자등록증(최대 5MB)을 Server Action으로 받기 위해 한도 확장.
    serverActions: {
      bodySizeLimit: "7mb",
    },
  },
};

export default nextConfig;
