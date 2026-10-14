import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

/**
 * Config separada do vite.config.ts de propósito: misturar os plugins de
 * federation com o tipo de `defineConfig` do vitest/config gera conflito de
 * tipos (vitest embute sua própria cópia do vite). Como este arquivo não entra
 * no `include` do tsconfig.json, não é type-checado por `vue-tsc` — só o
 * vitest o executa (via esbuild), então o conflito de tipos não se aplica aqui.
 *
 * O plugin de federation precisa estar aqui também: router/index.ts importa
 * literais como `import('dashboard/DashboardApp')`, que só são especificadores
 * válidos depois de reescritos por este plugin. Os testes nunca resolvem esses
 * imports de verdade (defineAsyncComponent é preguiçoso), só precisam que o
 * transform não quebre ao carregar o módulo.
 */
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {
        dashboard: 'http://localhost:5002/assets/remoteEntry.js',
        customers: 'http://localhost:5003/assets/remoteEntry.js',
        sales: 'http://localhost:5004/assets/remoteEntry.js',
        settings: 'http://localhost:5005/assets/remoteEntry.js',
      },
      shared: ['vue', 'vue-router', 'pinia', '@vue-mf/utils', '@vue-mf/types'],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
