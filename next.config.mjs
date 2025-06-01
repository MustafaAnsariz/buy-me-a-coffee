/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',  // For GitHub avatar images
      'images.unsplash.com',           // If using Unsplash images
      'i.imgur.com'                    // If using Imgur for profile/cover pictures
    ],
  },
  experimental: {
    serverActions: true,  // Enable server actions
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
