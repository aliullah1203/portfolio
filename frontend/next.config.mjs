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
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
};

export default nextConfig;
