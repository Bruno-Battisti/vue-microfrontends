import type { Customer } from './customer';
import type { Sale } from './sale';

/**
 * Eventos trocados entre o shell e os microfrontends via EventBus (@vue-mf/utils).
 * Nenhum microfrontend deve importar o estado interno de outro — apenas estes contratos.
 */
export interface AppEvents {
  'customer:created': Customer;
  'customer:updated': Customer;
  'customer:deleted': { id: string };
  'sale:created': Sale;
  'auth:unauthorized': void;
  [key: string]: unknown;
}

export type AppEventName = keyof AppEvents;

export interface RemoteModuleDescriptor {
  name: string;
  routeBase: string;
  remoteEntry: string;
  scope: string;
  module: string;
  navLabel: string;
  icon: string;
}
