<script setup lang="ts">
defineProps<{
  kind: 'loading' | 'empty' | 'error';
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="mf-state" :class="`mf-state--${kind}`">
    <div class="mf-state__icon" aria-hidden="true">
      <span v-if="kind === 'loading'">⏳</span>
      <span v-else-if="kind === 'empty'">🗂️</span>
      <span v-else>⚠️</span>
    </div>
    <p class="mf-state__title">{{ title }}</p>
    <p v-if="description" class="mf-state__description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.mf-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--mf-space-2);
  padding: var(--mf-space-6);
  text-align: center;
  color: var(--mf-color-text-muted);
}

.mf-state__icon {
  font-size: 2rem;
}

.mf-state__title {
  margin: 0;
  color: var(--mf-color-text);
  font-weight: 600;
}

.mf-state__description {
  margin: 0;
  font-size: 0.875rem;
}

.mf-state--error .mf-state__title {
  color: var(--mf-color-danger);
}
</style>
