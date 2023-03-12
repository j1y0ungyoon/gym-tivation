// /** @type {import('next').NextConfig} */
nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },

  compiler: { styledComponents: true },

  reactStrictMode: false,
};

module.exports = nextConfig;
