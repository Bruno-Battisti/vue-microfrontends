# Decisões de arquitetura

## Monorepo
- **npm workspaces** (não pnpm): pnpm não estava disponível no ambiente de desenvolvimento;
  npm workspaces atende aos mesmos requisitos do documento de especificação (compartilhar
  `packages/*` entre `apps/*` sem exigir ciclo de build único).
- Estrutura: `apps/{shell,dashboard,customers,sales,settings}` e `packages/{ui,types,utils}`,
  exatamente como sugerido no documento de especificação.

## Versões fixadas
- **Vite 4.5.x** (não a última major) em todos os apps: `@originjs/vite-plugin-federation`
  (última release pública, 1.4.1) não foi atualizado para as mudanças internas de
  Rollup/Vite 5+. A combinação Vue 3 + Vite 4 + federation 1.4.1 é a referência estável
  usada pela comunidade para Module Federation neste stack. Caso o plugin seja atualizado
  no futuro, revisitar essa fixação.
- **Vitest 1.x**: compatível com Vite 4 (Vitest 2+ exige Vite 5+).

## Module Federation
- Cada microfrontend (`dashboard`, `customers`, `sales`, `settings`) é um **remote** que expõe
  seu componente de rotas/app via `@originjs/vite-plugin-federation`.
- O **shell** é o **host**: consome os remotes via `import()` dinâmico do `remoteEntry.js` de
  cada um, montado em rotas Vue Router preguiçosas (`defineAsyncComponent` + fallback de erro).
- Dependências compartilhadas (`vue`, `vue-router`, `pinia`) são declaradas como `shared` na
  configuração de federation dos remotes e do host, para evitar múltiplas instâncias do Vue.
- Em desenvolvimento, cada remoto roda seu próprio `vite dev` (porta própria) e o shell aponta
  para essas URLs locais. Em produção, cada remoto publica sua própria build
  (`dist/assets/remoteEntry.js`) atrás de uma URL estável (CDN/serviço estático), e o shell lê
  essa URL de variável de ambiente — nenhum remote é importado estaticamente pelo shell.

## Comunicação entre módulos
- **Sem estado global compartilhado.** Contratos de dados ficam em `packages/types` (ex.:
  `Customer`, `Sale`, `DashboardSummary`).
- **Sem API real** (fora de escopo para um projeto de prática): `packages/utils/apiClient.ts`
  implementa um client REST mock, com latência simulada e persistência em `localStorage`,
  atrás da mesma interface (`list/get/create/update/remove`) que um client HTTP real teria.
  Trocar por uma API real é isolado a esse arquivo.
- **Eventos entre shell e microfrontends** (ex.: cliente criado, logout) trafegam por um
  event bus tipado (`packages/utils/eventBus.ts`), usando os nomes de evento definidos em
  `packages/types/events.ts`. Nenhum módulo importa a store interna de outro.

## Resiliência
- O shell carrega cada remoto dentro de um boundary de erro (`try/catch` assíncrono em torno do
  `import()` + componente de fallback de `@vue-mf/ui`); falha em um módulo não derruba os demais
  nem o shell.
- Autorização de rotas é feita no shell (nível de UX); a regra de arquitetura do documento de
  especificação é explícita que isso **não substitui** autorização no backend — como não há
  backend real neste projeto de prática, isso fica registrado aqui como lacuna conhecida.
