/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // API rewrites for development
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
