import { vitePlugin as remix } from '@remix-run/dev';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default async ({ mode }) => {
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
      alias: [{ find: '@', replacement: '/app' }],
    },
  });
};
