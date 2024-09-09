//import react from '@vitejs/plugin-react';
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, '.') };
  return defineConfig({
    plugins: [
      remix({
        ignoredRouteFiles: ['**/*.css'],
      }),
      svgr({
        svgrOptions: { icon: true, dimensions: false },
        include: '**/*.svg',
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: '/app' },
        //{ find: './runtimeConfig', replacement: './runtimeConfig.browser' },
      ],
    },
    define: {
      global: {},
    },
    // server: {
    //   port: 8385,
    //   strictPort: true,
    // },
    // preview: {
    //   port: 8385,
    //   strictPort: true,
    // },
    // build: {
    //   sourcemap: true,
    //   copyPublicDir: true,
    //   minify: true,
    //   cssMinify: true,
    // },
  });
};
