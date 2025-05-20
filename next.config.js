/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname, 
        // hostname: 'dgcwfrolmumumjxbrwsf.supabase.co', 
      },
    ],
  },
}
const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA(nextConfig)
