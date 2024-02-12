/** @types {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["utfs.io", "placehold.co"],
  },
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
