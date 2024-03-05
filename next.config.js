/** @types {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: "nextjs-node-loader",
          options: {
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
