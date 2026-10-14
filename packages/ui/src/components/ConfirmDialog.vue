<script setup lang="ts">
import AppButton from './AppButton.vue';

defineProps<{
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
}>();

const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <div v-if="open" class="mf-dialog-overlay" @click.self="emit('cancel')">
    <div class="mf-dialog" role="dialog" aria-modal="true">
      <p class="mf-dialog__title">{{ title }}</p>
      <p v-if="description" class="mf-dialog__description">{{ description }}</p>
      <div class="mf-dialog__actions">
        <AppButton variant="ghost" @click="emit('cancel')">Cancelar</AppButton>
        <AppButton variant="danger" @click="emit('confirm')">
          {{ confirmLabel ?? 'Confirmar' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mf-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.mf-dialog {
  width: min(360px, 90vw);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-lg);
  padding: var(--mf-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-3);
}

.mf-dialog__title {
  margin: 0;
  font-weight: 600;
}

.mf-dialog__description {
  margin: 0;
  color: var(--mf-color-text-muted);
  font-size: 0.875rem;
}

.mf-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--mf-space-2);
}
</style>
