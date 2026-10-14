<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'danger';
    type?: 'button' | 'submit';
    disabled?: boolean;
  }>(),
  { variant: 'primary', type: 'button', disabled: false },
);
</script>

<template>
  <button :type="type" class="mf-button" :class="`mf-button--${variant}`" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.mf-button {
  font-family: var(--mf-font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  padding: var(--mf-space-2) var(--mf-space-4);
  border-radius: var(--mf-radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.mf-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mf-button--primary {
  background: var(--mf-color-primary);
  color: white;
}
.mf-button--primary:hover:not(:disabled) {
  background: var(--mf-color-primary-hover);
}

.mf-button--ghost {
  background: transparent;
  color: var(--mf-color-text);
  border-color: var(--mf-color-border);
}
.mf-button--ghost:hover:not(:disabled) {
  background: var(--mf-color-surface-alt);
}

.mf-button--danger {
  background: var(--mf-color-danger);
  color: white;
}
</style>
