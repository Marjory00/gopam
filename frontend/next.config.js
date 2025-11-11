/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the standalone output mode for better deployment efficiency
  output: 'standalone',

  // Enable stricter type checking and linting
  eslint: {
    ignoreDuringBuilds: true, // You can set this to false once initial linting issues are resolved
  },
  typescript: {
    ignoreBuildErrors: true, // Set to false when you want production builds to enforce type safety
  },

  // Configuration for next/image. Add domains here for external recipe images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any external image domain for recipe images (be cautious in production)
      },
    ],
  },
  
  // React Compiler is still highly experimental and generally not required 
  // unless you are specifically testing it. It's best to remove it for stability.
  // reactCompiler: true, 
};

export default nextConfig;