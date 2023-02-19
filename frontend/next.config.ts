/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    /* config options here */
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config
      },
  }
  
  export default nextConfig