/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = { ...config.experiments, asyncWebAssembly: true, topLevelAwait: true }
    return config
  },
}

module.exports = nextConfig
