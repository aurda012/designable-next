/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com", "task.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    serverComponentsExternalPackages: ["cloudinary", "mongoose"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
