# vue-microfrontends

Sistema de gestão empresarial construído como prática de arquitetura de **microfrontends**
com **Vue 3**, **TypeScript**, **Vite** e **Module Federation**, organizado como monorepo
(npm workspaces).

Veja também:
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — decisões técnicas e por que foram tomadas.
- [docs/CONTRACTS.md](docs/CONTRACTS.md) — contratos de dados, "API" mock e eventos
  compartilhados entre o shell e os microfrontends.

## Estrutura

```
vue-microfrontends/
├── apps/
│   ├── shell/        # Aplicação principal (host): layout, rotas, autenticação
│   ├── dashboard/     # Indicadores e gráficos (remote)
│   ├── customers/     # CRUD de clientes (remote)
│   ├── sales/          # Registro de vendas (remote)
│   └── settings/       # Perfil e preferências (remote)
└── packages/
    ├── ui/      # Componentes visuais, tokens de design e sistema de toasts
    ├── types/   # Contratos de dados (TypeScript)
    └── utils/   # Event bus, client de API mock e seeds compartilhados
```

Cada microfrontend é uma SPA Vue independente, com seu próprio `package.json`, build e
porta — pode ser desenvolvido, testado e compilado isoladamente (`npm run dev -w
@vue-mf/customers`, por exemplo), sem depender do shell estar rodando.

## Pré-requisitos

- Node.js >= 18 (desenvolvido com Node 25; em Node 22+ os scripts de teste desabilitam a
  API experimental `localStorage` nativa do Node para não conflitar com o jsdom — ver
  `cross-env NODE_OPTIONS=--no-experimental-webstorage` nos `package.json` dos apps)
- npm >= 9 (usa npm workspaces)

## Instalação

```bash
npm install
```

## Rodando em desenvolvimento

> **Importante:** `@originjs/vite-plugin-federation` (a versão pública mais recente, fixada
> nesta stack) não suporta de forma confiável consumir módulos remotos em modo `vite dev`
> no host. Para ver a integração completa (shell carregando os remotes de verdade via
> Module Federation), use o fluxo de **build + preview** abaixo. Ver
> [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para detalhes.

### Fluxo recomendado: build + preview de tudo

```bash
# 1. Builda os 4 microfrontends remotos
npm run build:remotes

# 2. Sobe os 4 remotes em paralelo (portas 5002-5005)
npm run preview:remotes

# 3. Em outro terminal: builda e sobe o shell (porta 5000)
npm run build -w @vue-mf/shell
npm run preview -w @vue-mf/shell
```

Acesse **http://localhost:5000** — faça login com qualquer e-mail válido e senha com 4+
caracteres (autenticação mock, ver `apps/shell/src/stores/auth.ts`).

Portas de cada remote:

| App | Porta | URL do remoteEntry |
| --- | --- | --- |
| shell | 5000 | — (host) |
| dashboard | 5002 | `http://localhost:5002/assets/remoteEntry.js` |
| customers | 5003 | `http://localhost:5003/assets/remoteEntry.js` |
| sales | 5004 | `http://localhost:5004/assets/remoteEntry.js` |
| settings | 5005 | `http://localhost:5005/assets/remoteEntry.js` |

### Desenvolver um microfrontend isoladamente

Cada remote também roda sozinho, fora do contexto de federation, útil para
desenvolver/testar sua UI sem precisar do shell nem dos outros módulos:

```bash
npm run dev:customers   # ou dev:dashboard, dev:sales, dev:settings, dev:shell
```

Isso abre o app em `http://localhost:<porta>/` renderizando seu componente raiz
diretamente (`src/main.ts`), com hot-reload normal do Vite.

## Build

```bash
# Builda todos os apps e pacotes (usa o script "build" de cada workspace)
npm run build

# Ou individualmente:
npm run build -w @vue-mf/shell
npm run build -w @vue-mf/customers
```

Cada build roda `vue-tsc --noEmit` antes do `vite build` — a build falha se houver erro
de tipos.

## Testes

```bash
npm run test
```

Roda `vitest run` em cada workspace. Suítes dedicadas existem para **shell** (store de
autenticação, guarda de rotas, comportamento de falha ao carregar um remote desconhecido)
e **customers** (composable de CRUD com API mockada, validação do formulário) — os módulos
priorizados pelo escopo inicial do projeto. `dashboard`, `sales` e `settings` ainda não têm
suíte própria (`passWithNoTests: true` evita que isso quebre o `npm run test` do monorepo).

## Lint e formatação

```bash
npm run lint      # ESLint (Vue 3 + TypeScript) em todo o monorepo
npm run format     # Prettier
```

## Deploy (conceitual)

Como é um projeto de prática sem backend real, não há deploy configurado para produção,
mas a estratégia seria:

1. Publicar o `dist/` de cada microfrontend remoto em uma URL estática estável (CDN, bucket
   com hosting estático, etc.) — cada um com seu próprio pipeline de CI/CD, independente dos
   demais.
2. Configurar as URLs de `remoteEntry.js` de produção via variável de ambiente lida em
   `apps/shell/vite.config.ts` (hoje fixas em `localhost` para desenvolvimento/preview).
3. Publicar o `dist/` do shell apontando para essas URLs de produção.

## Credenciais e dados

Não há backend real: a "API" é mockada em `localStorage` do navegador (ver
[docs/CONTRACTS.md](docs/CONTRACTS.md)). Para resetar os dados de exemplo, limpe o
localStorage do site (`localhost:5000` ou a porta do remote que estiver testando
isoladamente).

Login: qualquer e-mail válido + senha com 4 ou mais caracteres.

## Critérios de conclusão (checklist)

- [x] Shell carrega todos os 4 microfrontends configurados via Module Federation.
- [x] Cada módulo é iniciado e compilado individualmente (`npm run dev:<app>` /
      `npm run build -w @vue-mf/<app>`).
- [x] Navegação entre módulos sem recarregar a página (Vue Router no shell).
- [x] CRUD de clientes funcionando (listar, pesquisar, criar, editar, excluir com
      confirmação, estados de loading/vazio/erro).
- [x] Módulo de vendas associa vendas a clientes e calcula totais.
- [x] Tipos e contratos compartilhados centralizados em `packages/types` e
      `packages/utils`.
- [x] Testes principais passando (`npm run test`).
- [x] Fallback visual quando um módulo está indisponível (testado manualmente: sobe o
      shell sem os remotes rodando).
