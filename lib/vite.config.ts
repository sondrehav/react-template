import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, '.') };
  return defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'lib/script.ts'),
        name: 'MyLib',
        // the proper extensions will be added
        fileName: 'script',
      },
      minify: true,
    },
  });
};
