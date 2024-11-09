// next.config.js

module.exports = {
  reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allows all HTTPS domains
          // Optionally, you can specify pathname patterns if needed
        },
        {
          protocol: 'http',
          hostname: '**', // Allows all HTTP domains (use with caution)
        },
      ],
    },
    // Other Next.js configurations...
  };
  