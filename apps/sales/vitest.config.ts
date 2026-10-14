import { defineConfig } from 'vitest/config';

// Sem suíte de testes dedicada ainda (ver README) — passWithNoTests evita que
// `npm run test` falhe o monorepo inteiro por este app não ter specs.
export default defineConfig({
  test: {
    passWithNoTests: true,
  },
});
