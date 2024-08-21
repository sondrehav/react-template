import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

import injectCSPPoliciesPlugin from './plugin/injectCSPPoliciesPlugin';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, '.') };
  return defineConfig({
    plugins: [
      react({
        include: './src',
        babel: {
          plugins: ['macros'],
        },
      }),
      svgr({
        svgrOptions: { icon: true, dimensions: false },
        include: '**/*.svg',
      }),
      injectCSPPoliciesPlugin({
        content:
          mode === 'production'
            ? "default-src 'self'; connect-src %VITE_API%"
            : undefined,
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
        { find: './runtimeConfig', replacement: './runtimeConfig.browser' },
      ],
    },
    define: {
      global: {},
    },
    server: {
      port: 8385,
      strictPort: true,
    },
    preview: {
      port: 8385,
      strictPort: true,
    },
    build: {
      sourcemap: true,
      copyPublicDir: true,
      minify: true,
      cssMinify: true,
    },
  });
};
