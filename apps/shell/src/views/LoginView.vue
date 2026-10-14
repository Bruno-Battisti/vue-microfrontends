<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AppButton } from '@vue-mf/ui';
import { useAuthStore } from '../stores/auth';

const email = ref('bruno@redrive.com.br');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/dashboard';
    await router.replace(redirect);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login">
    <form class="login__card" @submit.prevent="handleSubmit">
      <h1 class="login__title">Entrar</h1>
      <p class="login__subtitle">Sistema de gestão — microfrontends Vue 3</p>

      <label class="login__field">
        <span>E-mail</span>
        <input v-model="email" type="email" required placeholder="voce@empresa.com" />
      </label>

      <label class="login__field">
        <span>Senha</span>
        <input v-model="password" type="password" required minlength="4" placeholder="••••••" />
      </label>

      <p v-if="error" class="login__error">{{ error }}</p>

      <AppButton type="submit" :disabled="loading">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login__card {
  width: min(360px, 90vw);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-lg);
  padding: var(--mf-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-3);
}

.login__title {
  margin: 0;
}

.login__subtitle {
  margin: 0 0 var(--mf-space-3);
  color: var(--mf-color-text-muted);
  font-size: 0.875rem;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-1);
  font-size: 0.875rem;
}

.login__field input {
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  border: 1px solid var(--mf-color-border);
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-size: 0.9rem;
}

.login__error {
  color: var(--mf-color-danger);
  font-size: 0.85rem;
  margin: 0;
}
</style>
