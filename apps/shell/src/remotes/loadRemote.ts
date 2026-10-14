import { defineAsyncComponent, h, type Component } from 'vue';
import { StateMessage } from '@vue-mf/ui';

/**
 * Loaders estáticos por remote. O plugin de federation reescreve estes `import()`
 * literais em build/dev — por isso não dá para genericizar com uma string dinâmica.
 */
const loaders: Record<string, () => Promise<{ default: Component }>> = {
  dashboard: () => import('dashboard/DashboardApp'),
  customers: () => import('customers/CustomersApp'),
  sales: () => import('sales/SalesApp'),
  settings: () => import('settings/SettingsApp'),
};

function loadingFallback(navLabel: string): Component {
  return {
    name: 'RemoteLoading',
    render: () => h(StateMessage, { kind: 'loading', title: `Carregando ${navLabel}…` }),
  };
}

function errorFallback(navLabel: string): Component {
  return {
    name: 'RemoteError',
    render: () =>
      h(StateMessage, {
        kind: 'error',
        title: `Não foi possível carregar o módulo "${navLabel}"`,
        description:
          'O módulo remoto está indisponível no momento. Verifique se o microfrontend ' +
          'está em execução e tente novamente em instantes.',
      }),
  };
}

export function loadRemoteComponent(remoteName: string, navLabel: string): Component {
  const loader = loaders[remoteName];
  if (!loader) {
    throw new Error(`Remote desconhecido: ${remoteName}`);
  }

  return defineAsyncComponent({
    loader,
    loadingComponent: loadingFallback(navLabel),
    errorComponent: errorFallback(navLabel),
    delay: 150,
    timeout: 8000,
    onError(error, _retry, fail) {
      console.error(`[shell] falha ao carregar o módulo remoto "${remoteName}"`, error);
      fail();
    },
  });
}
