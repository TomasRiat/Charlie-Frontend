import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/workspace-*/image/**',
      },
      { 
        protocol: 'https', 
        hostname: 'replicate.delivery', 
        pathname: '/**', 
      },
    ],
  },

    serverExternalPackages: [
      'discord.js', 
      '@discordjs/voice', 
      'spotify-web-api-node', 
      '@snazzah/davey', 
      'ffmpeg-static',
      'yt-search',
      'youtube-dl-exec',
      'libsodium-wrappers', 
      'opusscript'         
    ],
      
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals.push({
        'bufferutil': 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }

    // Forzamos a Webpack a ignorar zlib-sync
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^zlib-sync$/ })
    );

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    return config;
  }
}

export default nextConfig