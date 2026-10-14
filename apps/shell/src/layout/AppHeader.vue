<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppButton } from '@vue-mf/ui';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  auth.logout();
  await router.replace('/login');
}
</script>

<template>
  <header class="header">
    <h1 class="header__title">Gestão empresarial</h1>
    <div v-if="auth.user" class="header__user">
      <span class="header__name">{{ auth.user.name }}</span>
      <AppButton variant="ghost" @click="handleLogout">Sair</AppButton>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--mf-space-5);
  border-bottom: 1px solid var(--mf-color-border);
}

.header__title {
  font-size: 1rem;
  margin: 0;
}

.header__user {
  display: flex;
  align-items: center;
  gap: var(--mf-space-3);
}

.header__name {
  font-size: 0.875rem;
  color: var(--mf-color-text-muted);
}
</style>
