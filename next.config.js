const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["cdn.jsdelivr.net", "yourdomain.com"], // Add more as needed
    unoptimized: true,
  },
  i18n,
};

module.exports = nextConfig;
