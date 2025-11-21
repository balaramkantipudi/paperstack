/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // Bypass Node.js version check
  env: {
    NEXT_IGNORE_NODE_VERSION: 'true',
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle .mjs files for dependencies like framer-motion
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Fallback for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        process: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        os: false,
        child_process: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }

    // Define path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@heroui/react': path.resolve(__dirname, 'src/stubs/heroui-react.tsx'),
      '@iconify/react': path.resolve(__dirname, 'src/stubs/iconify-react.tsx'),
      'framer-motion': path.resolve(__dirname, 'src/stubs/framer-motion.tsx'),
      'react-intersection-observer': path.resolve(__dirname, 'src/stubs/react-intersection-observer.tsx'),
      '@supabase/supabase-js': path.resolve(__dirname, 'src/stubs/supabase-js.js'),
      'formidable': path.resolve(__dirname, 'src/stubs/formidable.js'),
      'intuit-oauth': path.resolve(__dirname, 'src/stubs/intuit-oauth.js'),
      '@azure/ai-form-recognizer': path.resolve(__dirname, 'src/stubs/azure-form-recognizer.js'),
    };

    return config;
  },
};

module.exports = nextConfig;
