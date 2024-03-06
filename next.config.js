/** @types {import('next').NextConfig} */

const os = require("os");

const nextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /recommender.node/,
      use: [
        {
          loader: "nextjs-node-loader",
          options: {
            flags: os.constants.dlopen.RTLD_NOW,
            outputPath: config.output.path,
            includeWebpackPublicPath: true,
          },
        },
      ],
    });
    return config;
  },
  reactStrictMode: false,
  images: {
    domains: ["utfs.io", "placehold.co", "dummyimage.com"],
  },
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
