import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    // Use NEXT_PUBLIC_API_PROXY to force proxying to a specific backend (useful when local API is down).
    const apiBase = process.env.NEXT_PUBLIC_API_PROXY || process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-6i9r.onrender.com';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
};

export default nextConfig;
