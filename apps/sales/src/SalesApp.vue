<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppButton, StateMessage } from '@vue-mf/ui';
import type { SaleItem } from '@vue-mf/types';
import { useSales } from './composables/useSales';
import SalesTable from './components/SalesTable.vue';
import SaleForm from './components/SaleForm.vue';

const { sales, customers, status, errorMessage, fetchAll, createSale } = useSales();

const formOpen = ref(false);
const feedback = ref<string | null>(null);

onMounted(fetchAll);

async function handleSubmit(customerId: string, items: SaleItem[]) {
  try {
    await createSale(customerId, items);
    formOpen.value = false;
    feedback.value = 'Venda registrada com sucesso.';
    setTimeout(() => (feedback.value = null), 4000);
  } catch (err) {
    feedback.value = (err as Error).message;
  }
}
</script>

<template>
  <section class="sales">
    <header class="sales__header">
      <h2 class="sales__title">Vendas</h2>
      <AppButton :disabled="customers.length === 0" @click="formOpen = true">+ Nova venda</AppButton>
    </header>

    <p v-if="feedback" class="sales__feedback">{{ feedback }}</p>

    <StateMessage v-if="status === 'loading'" kind="loading" title="Carregando vendas…" />

    <StateMessage
      v-else-if="status === 'error'"
      kind="error"
      title="Não foi possível carregar as vendas"
      :description="errorMessage ?? undefined"
    >
      <AppButton variant="ghost" @click="fetchAll">Tentar novamente</AppButton>
    </StateMessage>

    <StateMessage
      v-else-if="sales.length === 0"
      kind="empty"
      title="Nenhuma venda registrada"
      description="Registre a primeira venda vinculando um cliente."
    />

    <SalesTable v-else :sales="sales" />

    <SaleForm :open="formOpen" :customers="customers" @submit="handleSubmit" @cancel="formOpen = false" />
  </section>
</template>

<style scoped>
.sales {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-4);
}

.sales__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sales__title {
  margin: 0;
}

.sales__feedback {
  margin: 0;
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  background: rgba(34, 197, 94, 0.12);
  color: var(--mf-color-success);
  font-size: 0.875rem;
}
</style>
