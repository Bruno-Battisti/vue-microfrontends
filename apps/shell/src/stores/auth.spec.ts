import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('starts unauthenticated when there is no persisted user', () => {
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(false);
  });

  it('rejects invalid credentials', async () => {
    const auth = useAuthStore();
    await expect(auth.login('not-an-email', '123')).rejects.toThrow();
    expect(auth.isAuthenticated).toBe(false);
  });

  it('logs in with valid credentials and persists the user', async () => {
    const auth = useAuthStore();
    await auth.login('bruno@redrive.com.br', 'segredo');
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user?.email).toBe('bruno@redrive.com.br');
    expect(localStorage.getItem('mf-auth-user')).toContain('bruno@redrive.com.br');
  });

  it('logs out and clears the persisted user', async () => {
    const auth = useAuthStore();
    await auth.login('bruno@redrive.com.br', 'segredo');
    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem('mf-auth-user')).toBeNull();
  });
});
