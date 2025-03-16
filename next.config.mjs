/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dqy38fnwh4fqs.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tabler.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
  swcMinify: false, // Disable SWC minification

  compiler: {
    removeConsole: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable Terser in production builds temporarily for debugging
    if (!dev && !isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;