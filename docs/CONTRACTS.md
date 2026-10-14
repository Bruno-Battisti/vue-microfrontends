# Contratos compartilhados

Documentação dos contratos de dados e comunicação usados entre o shell e os
microfrontends. Ver também [ARCHITECTURE.md](ARCHITECTURE.md) para o raciocínio por trás
de cada decisão.

## Tipos de dados (`packages/types`)

| Tipo | Arquivo | Usado por |
| --- | --- | --- |
| `Customer`, `CustomerInput` | `customer.ts` | customers, sales, dashboard |
| `Sale`, `SaleItem`, `SaleStatus`, `SaleInput`, `calculateSaleTotal` | `sale.ts` | sales, dashboard |
| `DashboardSummary` | `dashboard.ts` | dashboard |
| `UserProfile`, `AppPreferences` | `settings.ts` | shell (auth), settings |
| `AppEvents`, `RemoteModuleDescriptor` | `events.ts` | shell, event bus |

Nenhum desses tipos tem lógica — são apenas contratos. Regras de negócio (ex.:
`calculateSaleTotal`) que precisam ser idênticas em mais de um módulo (sales calcula o
total ao criar a venda, o shell/dashboard recalculam para exibir) também vivem aqui, não
duplicadas em cada app.

## "API" mock (`packages/utils/apiClient.ts` + `packages/utils/seeds.ts`)

`createRestResource<T>(storageKey, seed)` simula um client REST (`list/get/create/update/
remove`, com latência) sobre `localStorage`. Cada app cria sua própria instância apontando
para a mesma `storageKey` (`mf-customers`, `mf-sales`) — o equivalente a dois serviços
chamando os mesmos endpoints. **Nenhum app importa a instância de outro.**

Isso significa que trocar por uma API HTTP real é uma mudança isolada a este arquivo: a
assinatura (`list/get/create/update/remove`) já é a mesma que um client Axios/fetch teria.

## Eventos (`packages/types/events.ts` + `packages/utils/eventBus.ts`)

| Evento | Payload | Emitido por | Consumido por |
| --- | --- | --- | --- |
| `customer:created` | `Customer` | customers | shell (toast) |
| `customer:updated` | `Customer` | customers | shell (toast) |
| `customer:deleted` | `{ id: string }` | customers | shell (toast) |
| `sale:created` | `Sale` | sales | shell (toast) |
| `auth:unauthorized` | `void` | *(reservado)* | *(reservado)* |

`auth:unauthorized` está no contrato mas não é emitido neste projeto: não existe uma API
real que retorne 401. Fica documentado para o caso de uma integração futura com backend —
o client HTTP real emitiria esse evento no lugar de lançar a exceção genérica, e o shell
o usaria para forçar logout/redirecionamento, sem qualquer microfrontend precisar saber
dos detalhes de autenticação.

O event bus (`eventBus.on/off/emit`) é importado como pacote compartilhado
(`@vue-mf/utils`), nunca como estado entre módulos — cada lado só conhece os nomes de
evento e o tipo do payload, definidos uma única vez em `AppEvents`.

## Estado "compartilhado" que na verdade não é

- **Perfil do usuário** (`mf-auth-user`): o shell grava no login; o microfrontend de
  Configurações lê/edita o mesmo registro. Mesma entidade, dois consumidores — não há
  import direto entre shell e settings.
- **Tema** (`mf-settings-preferences` → `document.documentElement.dataset.theme`): lido
  pelos tokens CSS globais (`packages/ui/src/tokens.css`), que todo app importa. A
  propagação visual acontece pelo CSS compartilhado, não por comunicação entre JS de
  módulos diferentes.
