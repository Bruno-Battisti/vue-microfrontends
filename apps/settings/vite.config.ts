import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    federation({
      name: 'settings',
      filename: 'remoteEntry.js',
      exposes: {
        './SettingsApp': './src/SettingsApp.vue',
      },
      shared: ['vue', 'vue-router', 'pinia'],
    }),
  ],
  server: {
    port: 5005,
    strictPort: true,
  },
  preview: {
    port: 5005,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
});
