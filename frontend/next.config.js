/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3001",
    "localhost:3002",
    "192.168.56.1:3000",
    "192.168.56.1:3002"
  ]
};

module.exports = nextConfig;
