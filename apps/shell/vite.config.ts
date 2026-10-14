import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

// Portas dos remotes em desenvolvimento/preview — ver docs/ARCHITECTURE.md
const REMOTES = {
  dashboard: 'http://localhost:5002/remoteEntry.js',
  customers: 'http://localhost:5003/remoteEntry.js',
  sales: 'http://localhost:5004/remoteEntry.js',
  settings: 'http://localhost:5005/remoteEntry.js',
};

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: REMOTES,
      shared: ['vue', 'vue-router', 'pinia'],
    }),
  ],
  server: {
    port: 5000,
    strictPort: true,
  },
  preview: {
    port: 5000,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
  },
});
