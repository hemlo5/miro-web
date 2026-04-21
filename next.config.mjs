/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Three.js and other ESM-only packages to be bundled correctly
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Next.js 16 uses Turbopack by default — no webpack config needed.
  // Set an empty turbopack config to suppress the "no turbopack config" warning.
  turbopack: {},
};

export default nextConfig;
