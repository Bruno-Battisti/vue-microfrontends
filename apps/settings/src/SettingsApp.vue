<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { AppButton } from '@vue-mf/ui';
import { readPreferences, readProfile, writePreferences, writeProfile } from './api/settingsApi';

const profile = reactive(readProfile());
const preferences = reactive(readPreferences());
const feedback = ref<string | null>(null);

function applyTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
}

onMounted(() => applyTheme(preferences.theme));

watch(
  () => preferences.theme,
  (theme) => applyTheme(theme),
);

function saveProfile() {
  writeProfile({ ...profile });
  feedback.value = 'Perfil atualizado.';
  setTimeout(() => (feedback.value = null), 3000);
}

function savePreferences() {
  writePreferences({ ...preferences });
  feedback.value = 'Preferências salvas.';
  setTimeout(() => (feedback.value = null), 3000);
}
</script>

<template>
  <section class="settings">
    <h2 class="settings__title">Configurações</h2>

    <p v-if="feedback" class="settings__feedback">{{ feedback }}</p>

    <form class="settings__section" @submit.prevent="saveProfile">
      <h3>Perfil</h3>
      <label class="settings__field">
        <span>Nome</span>
        <input v-model="profile.name" type="text" />
      </label>
      <label class="settings__field">
        <span>E-mail</span>
        <input v-model="profile.email" type="email" disabled />
      </label>
      <label class="settings__field">
        <span>Papel</span>
        <select v-model="profile.role">
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="viewer">Visualizador</option>
        </select>
      </label>
      <AppButton type="submit">Salvar perfil</AppButton>
    </form>

    <form class="settings__section" @submit.prevent="savePreferences">
      <h3>Preferências</h3>
      <label class="settings__field">
        <span>Tema</span>
        <select v-model="preferences.theme">
          <option value="dark">Escuro</option>
          <option value="light">Claro</option>
        </select>
      </label>
      <label class="settings__field">
        <span>Idioma</span>
        <select v-model="preferences.language">
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
        </select>
      </label>
      <label class="settings__checkbox">
        <input v-model="preferences.notificationsEnabled" type="checkbox" />
        <span>Receber notificações</span>
      </label>
      <AppButton type="submit">Salvar preferências</AppButton>
    </form>
  </section>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-5);
  max-width: 420px;
}

.settings__title {
  margin: 0;
}

.settings__feedback {
  margin: 0;
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  background: rgba(34, 197, 94, 0.12);
  color: var(--mf-color-success);
  font-size: 0.875rem;
}

.settings__section {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-3);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-md);
  padding: var(--mf-space-4);
}

.settings__section h3 {
  margin: 0;
}

.settings__field {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-1);
  font-size: 0.85rem;
}

.settings__field input,
.settings__field select {
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  border: 1px solid var(--mf-color-border);
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-size: 0.9rem;
}

.settings__checkbox {
  display: flex;
  align-items: center;
  gap: var(--mf-space-2);
  font-size: 0.85rem;
}
</style>
