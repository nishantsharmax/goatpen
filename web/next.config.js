/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "vercel.com",
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: '**',
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/steven-tey/precedent",
        permanent: false,
      },
      {
        source: '/',
        destination: '/deploy',
        permanent: true, // Set to `true` if this is a permanent redirect
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
