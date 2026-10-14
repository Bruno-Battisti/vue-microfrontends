# vue-microfrontends

Sistema de gestão empresarial construído como prática de arquitetura de **microfrontends**
com **Vue 3**, **TypeScript**, **Vite** e **Module Federation**, organizado como monorepo.

> Status: em construção, seguindo as etapas do documento de especificação.
> Veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para as decisões técnicas.

## Estrutura

```
vue-microfrontends/
├── apps/
│   ├── shell/        # Aplicação principal (host)
│   ├── dashboard/     # Indicadores e gráficos (remote)
│   ├── customers/     # Gestão de clientes (remote)
│   ├── sales/          # Gestão de vendas (remote)
│   └── settings/       # Configurações (remote)
└── packages/
    ├── ui/      # Componentes visuais e tokens compartilhados
    ├── types/   # Contratos de dados (TypeScript)
    └── utils/   # Event bus e client de API mock compartilhados
```

## Pré-requisitos

- Node.js >= 18
- npm >= 9 (workspaces)

## Instalação

```bash
npm install
```

(mais instruções de execução, build e deploy serão adicionadas ao final de cada etapa)
