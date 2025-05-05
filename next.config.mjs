/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for packages that depend on 'fs' module which is not available in browsers
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    return config;
  },
  // Ensure html2pdf.js works properly
  transpilePackages: ['html2pdf.js']
};

export default nextConfig;
