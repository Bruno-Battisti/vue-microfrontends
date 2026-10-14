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

## Por que `@vue-mf/utils` e `@vue-mf/types` estão em `shared`
- Inicialmente só `vue`, `vue-router` e `pinia` eram compartilhados entre shell e remotes.
  Resultado: o event bus (`eventBus`) não funcionava entre módulos — cada remote recebia
  sua própria cópia bundlada de `packages/utils`, com seu próprio `Map` de handlers em
  memória, isolado do `Map` do shell. `customers.emit('customer:created', …)` nunca
  chegava ao `eventBus.on(...)` registrado no shell, porque eram instâncias de módulo
  diferentes, não a mesma.
- Correção: adicionar `'@vue-mf/utils'` (e, por consistência, `'@vue-mf/types'`) ao array
  `shared` da configuração de federation em **todos** os apps (shell e os 4 remotes). Com
  isso, o runtime de federation deduplica o módulo em tempo de execução — o remote passa
  a usar a mesma instância do `eventBus` que o host já carregou, e os eventos cruzam a
  fronteira do module federation corretamente. Validado em browser: criar um cliente no
  remote `customers` dispara um toast no shell.
- Isso não é um detalhe cosmético: qualquer estado em nível de módulo (singletons, buses,
  caches) que precise ser **o mesmo objeto** entre host e remotes precisa estar em
  `shared` — caso contrário, Vite bundla uma cópia por app e o estado nunca se encontra.

## CSS nos remotes
- `vite-plugin-css-injected-by-js` é usado em todos os remotes (não no shell). Sem ele, o
  CSS scoped de um componente Vue exposto via federation é extraído para um arquivo `.css`
  separado que só é referenciado pelo `index.html` standalone daquele app — o shell, ao
  importar só o JS do módulo remoto, nunca carregaria esse CSS. O plugin injeta o CSS como
  `<style>` via JS no próprio chunk exposto, resolvendo isso automaticamente.

## "API" compartilhada entre microfrontends sem acoplamento de código
- `packages/utils/seeds.ts` centraliza os dados iniciais (`seedCustomers`, `seedSales`).
  Tanto `customers` quanto `sales`/`dashboard` criam sua própria instância de
  `createRestResource` apontando para as mesmas chaves de `localStorage`
  (`mf-customers`, `mf-sales`) — exatamente como dois frontends chamando os mesmos
  endpoints de uma API real. Nenhum microfrontend importa store, componente ou lógica
  interna de outro; o único acoplamento é o contrato de dados em `packages/types`.
- O microfrontend de Configurações lê/grava o mesmo registro de perfil que o shell usa
  para autenticação (`mf-auth-user`), pelo mesmo motivo: é a mesma "entidade" vista por
  dois módulos diferentes, não uma dependência direta entre eles.
- O tema (claro/escuro) escolhido em Configurações é aplicado via
  `document.documentElement.dataset.theme`, lido pelos tokens CSS globais em
  `packages/ui/src/tokens.css` — por isso a troca de tema se reflete em qualquer módulo
  montado na página (inclusive o shell), sem nenhuma comunicação direta entre eles.

## Resiliência
- O shell carrega cada remoto dentro de um boundary de erro (`try/catch` assíncrono em torno do
  `import()` + componente de fallback de `@vue-mf/ui`); falha em um módulo não derruba os demais
  nem o shell.
- Autorização de rotas é feita no shell (nível de UX); a regra de arquitetura do documento de
  especificação é explícita que isso **não substitui** autorização no backend — como não há
  backend real neste projeto de prática, isso fica registrado aqui como lacuna conhecida.
