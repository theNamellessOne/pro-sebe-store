/** @types {import('next').NextConfig} */

const os = require("os");
const path = require("path");

const nextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    console.log(__dirname);
    config.module.rules.push({
      test: /recommender.node/,
      use: [
        {
          loader: path.resolve(__dirname, 'node-loader/loader.js'),
          options: {
            flags: os.constants.dlopen.RTLD_NOW,
            outputPath: config.output.path,
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
