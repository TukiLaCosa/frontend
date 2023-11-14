/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
    
        return config;
      },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    env: {
      BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/",
      WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://127.0.0.1:8000/ws"
    }
}

module.exports = nextConfig
