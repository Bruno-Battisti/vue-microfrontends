import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { router } from './index';

describe('shell router guard', () => {
  beforeEach(async () => {
    localStorage.clear();
    setActivePinia(createPinia());
    await router.push('/');
  });

  it('redirects unauthenticated users to /login preserving the intended route', async () => {
    await router.push('/dashboard');
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.redirect).toBe('/dashboard');
  });

  it('allows an authenticated user to reach a module route', async () => {
    const auth = useAuthStore();
    await auth.login('bruno@redrive.com.br', 'segredo');
    await router.push('/dashboard');
    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('redirects an authenticated user away from /login', async () => {
    const auth = useAuthStore();
    await auth.login('bruno@redrive.com.br', 'segredo');
    await router.push('/login');
    expect(router.currentRoute.value.path).toBe('/dashboard');
  });

  it('falls back to the not-found view for unknown routes', async () => {
    const auth = useAuthStore();
    await auth.login('bruno@redrive.com.br', 'segredo');
    await router.push('/rota-que-nao-existe');
    expect(router.currentRoute.value.name).toBe('not-found');
  });
});
