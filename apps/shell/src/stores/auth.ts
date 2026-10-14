import { defineStore } from 'pinia';
import type { UserProfile } from '@vue-mf/types';

const STORAGE_KEY = 'mf-auth-user';

function readPersistedUser(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readPersistedUser() as UserProfile | null,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    /**
     * Autenticação mock: qualquer e-mail válido + senha com 4+ caracteres.
     * Centralizada no shell — os microfrontends apenas leem `isAuthenticated`.
     */
    async login(email: string, password: string): Promise<void> {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail || password.length < 4) {
        throw new Error('Credenciais inválidas. Informe um e-mail válido e uma senha com 4+ caracteres.');
      }
      const user: UserProfile = { name: email.split('@')[0], email, role: 'admin' };
      this.user = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    },
    logout(): void {
      this.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
