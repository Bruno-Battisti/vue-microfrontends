import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean;
  }
}
import { useAuthStore } from '../stores/auth';
import { remoteModules } from '../remotes/registry';
import { loadRemoteComponent } from '../remotes/loadRemote';
import AppLayout from '../layout/AppLayout.vue';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const moduleRoutes: RouteRecordRaw[] = remoteModules.map((mod) => ({
  path: mod.routeBase,
  name: mod.name,
  component: loadRemoteComponent(mod.name, mod.navLabel),
}));

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      ...moduleRoutes,
      { path: ':pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { path: '/dashboard' };
  }
  return true;
});
