<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div class="summary-card">
    <p class="summary-card__label">{{ label }}</p>
    <p class="summary-card__value">{{ value }}</p>
  </div>
</template>

<style scoped>
.summary-card {
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-md);
  padding: var(--mf-space-4);
  flex: 1;
  min-width: 160px;
}

.summary-card__label {
  margin: 0 0 var(--mf-space-1);
  color: var(--mf-color-text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-card__value {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}
</style>
