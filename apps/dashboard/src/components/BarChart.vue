<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: { month: string; total: number }[] }>();

const max = computed(() => Math.max(1, ...props.data.map((d) => d.total)));

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
</script>

<template>
  <div class="bar-chart">
    <div v-for="item in data" :key="item.month" class="bar-chart__column">
      <div
        class="bar-chart__bar"
        :style="{ height: `${Math.max(4, (item.total / max) * 160)}px` }"
        :title="formatCurrency(item.total)"
      />
      <span class="bar-chart__label">{{ item.month }}</span>
    </div>
  </div>
</template>

<style scoped>
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: var(--mf-space-4);
  height: 200px;
  padding: var(--mf-space-4);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-md);
}

.bar-chart__column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mf-space-2);
}

.bar-chart__bar {
  width: 32px;
  background: var(--mf-color-primary);
  border-radius: var(--mf-radius-sm) var(--mf-radius-sm) 0 0;
}

.bar-chart__label {
  font-size: 0.75rem;
  color: var(--mf-color-text-muted);
}
</style>
