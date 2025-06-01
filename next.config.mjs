/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',    // GitHub avatars
      'images.unsplash.com',             // Unsplash images
      'i.imgur.com',                     // Imgur images
      'lh3.googleusercontent.com',       // Google profile pictures
      'cdn.discordapp.com',             // Discord avatars
      'res.cloudinary.com'              // If using Cloudinary
    ],
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
