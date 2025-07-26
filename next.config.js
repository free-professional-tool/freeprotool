/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib', 'pdfjs-dist']
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  }
}

module.exports = nextConfig
