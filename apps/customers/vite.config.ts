import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    vue(),
    // Injeta o CSS extraído como <style> via JS: necessário para que o estilo do
    // componente exposto acompanhe o módulo quando importado remotamente pelo shell.
    cssInjectedByJsPlugin(),
    federation({
      name: 'customers',
      filename: 'remoteEntry.js',
      exposes: {
        './CustomersApp': './src/CustomersApp.vue',
      },
      shared: ['vue', 'vue-router', 'pinia'],
    }),
  ],
  server: {
    port: 5003,
    strictPort: true,
  },
  preview: {
    port: 5003,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
});
