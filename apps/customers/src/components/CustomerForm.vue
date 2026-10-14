<script setup lang="ts">
import { reactive, watch } from 'vue';
import { AppButton } from '@vue-mf/ui';
import type { Customer, CustomerInput } from '@vue-mf/types';

const props = defineProps<{
  open: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{ submit: [CustomerInput]; cancel: [] }>();

const form = reactive<CustomerInput>({ name: '', email: '', phone: '' });
const errors = reactive<Partial<Record<keyof CustomerInput, string>>>({});

watch(
  () => [props.open, props.customer],
  () => {
    form.name = props.customer?.name ?? '';
    form.email = props.customer?.email ?? '';
    form.phone = props.customer?.phone ?? '';
    errors.name = undefined;
    errors.email = undefined;
    errors.phone = undefined;
  },
  { immediate: true },
);

function validate(): boolean {
  errors.name = form.name.trim().length < 2 ? 'Informe ao menos 2 caracteres.' : undefined;
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? undefined : 'E-mail inválido.';
  errors.phone = form.phone.trim().length < 8 ? 'Informe um telefone válido.' : undefined;
  return !errors.name && !errors.email && !errors.phone;
}

function handleSubmit() {
  if (!validate()) return;
  emit('submit', { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
}
</script>

<template>
  <div v-if="open" class="form-overlay" @click.self="emit('cancel')">
    <form class="form-card" @submit.prevent="handleSubmit">
      <h2 class="form-card__title">{{ customer ? 'Editar cliente' : 'Novo cliente' }}</h2>

      <label class="form-field">
        <span>Nome</span>
        <input v-model="form.name" type="text" placeholder="Nome completo" />
        <span v-if="errors.name" class="form-field__error">{{ errors.name }}</span>
      </label>

      <label class="form-field">
        <span>E-mail</span>
        <input v-model="form.email" type="email" placeholder="email@empresa.com" />
        <span v-if="errors.email" class="form-field__error">{{ errors.email }}</span>
      </label>

      <label class="form-field">
        <span>Telefone</span>
        <input v-model="form.phone" type="tel" placeholder="(11) 90000-0000" />
        <span v-if="errors.phone" class="form-field__error">{{ errors.phone }}</span>
      </label>

      <div class="form-card__actions">
        <AppButton variant="ghost" type="button" @click="emit('cancel')">Cancelar</AppButton>
        <AppButton type="submit">Salvar</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.form-card {
  width: min(400px, 90vw);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-lg);
  padding: var(--mf-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-3);
}

.form-card__title {
  margin: 0 0 var(--mf-space-2);
  font-size: 1.1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-1);
  font-size: 0.85rem;
}

.form-field input {
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  border: 1px solid var(--mf-color-border);
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-size: 0.9rem;
}

.form-field__error {
  color: var(--mf-color-danger);
  font-size: 0.78rem;
}

.form-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--mf-space-2);
  margin-top: var(--mf-space-2);
}
</style>
