import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.uqni.net' },
      { protocol: 'https', hostname: 'v6.kiryuu.to' },
      { protocol: 'https', hostname: 'parachutedrone.com' },
      { protocol: 'https', hostname: 'managementstudyhq.com' },
      { protocol: 'https', hostname: 'image-v2.free-ebook.my.id' },
    ],
  },
};

export default nextConfig;
