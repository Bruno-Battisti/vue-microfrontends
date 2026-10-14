import type { RemoteModuleDescriptor } from '@vue-mf/types';

export const remoteModules: RemoteModuleDescriptor[] = [
  {
    name: 'dashboard',
    routeBase: '/dashboard',
    remoteEntry: 'http://localhost:5002/remoteEntry.js',
    scope: 'dashboard',
    module: './DashboardApp',
    navLabel: 'Dashboard',
    icon: '📊',
  },
  {
    name: 'customers',
    routeBase: '/clientes',
    remoteEntry: 'http://localhost:5003/remoteEntry.js',
    scope: 'customers',
    module: './CustomersApp',
    navLabel: 'Clientes',
    icon: '👥',
  },
  {
    name: 'sales',
    routeBase: '/vendas',
    remoteEntry: 'http://localhost:5004/remoteEntry.js',
    scope: 'sales',
    module: './SalesApp',
    navLabel: 'Vendas',
    icon: '🧾',
  },
  {
    name: 'settings',
    routeBase: '/configuracoes',
    remoteEntry: 'http://localhost:5005/remoteEntry.js',
    scope: 'settings',
    module: './SettingsApp',
    navLabel: 'Configurações',
    icon: '⚙️',
  },
];
