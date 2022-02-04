/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    CHAIN_ID: process.env.CHAIN_ID || 80001,
    WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'http://localhost:8545',
    IPFS_HOST: process.env.IPFS_HOST || 'http://localhost:5001',
    IPFS_GATEWAY: process.env.IPFS_GATEWAY || 'http://localhost:8080',
    GRAPH_PROVIDER: process.env.GRAPH_PROVIDER || 'http://localhost:8000/subgraphs/name/valist-io/valist',
    MAGIC_PUBKEY: 'pk_live_B577A4A7B11805D0',
    METATX_ENABLED: process.env.METATX_ENABLED || true,
  },
  webpack: function (config, options) {
    if (!options.isServer) {
      // polyfill events on browser. since webpack5, polyfills are not automatically included
      config.resolve.fallback.events = require.resolve('events/');
    }
    config.plugins.push(new options.webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }));
    return config;
  }
};

module.exports = nextConfig;
