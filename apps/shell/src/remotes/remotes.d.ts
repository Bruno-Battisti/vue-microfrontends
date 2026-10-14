// Módulos remotos resolvidos em runtime pelo @originjs/vite-plugin-federation.
// Não existem no disco — declarados aqui só para o type-checker.
declare module 'dashboard/DashboardApp' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
declare module 'customers/CustomersApp' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
declare module 'sales/SalesApp' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
declare module 'settings/SettingsApp' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
