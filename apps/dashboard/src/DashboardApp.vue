<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppButton, StateMessage } from '@vue-mf/ui';
import type { DashboardSummary } from '@vue-mf/types';
import { fetchDashboardSummary } from './api/dashboardApi';
import SummaryCard from './components/SummaryCard.vue';
import BarChart from './components/BarChart.vue';

const summary = ref<DashboardSummary | null>(null);
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMessage = ref<string | null>(null);

async function load() {
  status.value = 'loading';
  errorMessage.value = null;
  try {
    summary.value = await fetchDashboardSummary();
    status.value = 'success';
  } catch (err) {
    errorMessage.value = (err as Error).message;
    status.value = 'error';
  }
}

onMounted(load);

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
</script>

<template>
  <section class="dashboard">
    <h2 class="dashboard__title">Dashboard</h2>

    <StateMessage v-if="status === 'loading'" kind="loading" title="Carregando indicadores…" />

    <StateMessage
      v-else-if="status === 'error'"
      kind="error"
      title="Não foi possível carregar o dashboard"
      :description="errorMessage ?? undefined"
    >
      <AppButton variant="ghost" @click="load">Tentar novamente</AppButton>
    </StateMessage>

    <template v-else-if="summary">
      <div class="dashboard__cards">
        <SummaryCard label="Clientes" :value="String(summary.customersCount)" />
        <SummaryCard label="Vendas" :value="String(summary.salesCount)" />
        <SummaryCard label="Total vendido" :value="formatCurrency(summary.salesTotal)" />
      </div>

      <StateMessage
        v-if="summary.monthlySales.length === 0"
        kind="empty"
        title="Sem vendas no período"
        description="Os gráficos aparecem aqui assim que houver vendas registradas."
      />
      <BarChart v-else :data="summary.monthlySales" />
    </template>
  </section>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-4);
}

.dashboard__title {
  margin: 0;
}

.dashboard__cards {
  display: flex;
  gap: var(--mf-space-4);
  flex-wrap: wrap;
}
</style>
