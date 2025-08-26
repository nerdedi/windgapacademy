import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { vitePluginNode } from 'vite-plugin-node';
import { vitePluginReact } from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [vitePluginReact(), viteStaticCopy(), viteSingleFile(), vitePluginNode()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['components/__tests__/**/*.js'],
  },
});
