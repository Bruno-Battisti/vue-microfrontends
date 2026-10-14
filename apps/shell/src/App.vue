<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { eventBus } from '@vue-mf/utils';
import { ToastHost, pushToast } from '@vue-mf/ui';

/**
 * O shell é o único consumidor destes eventos neste projeto (poderia haver outros,
 * ex.: um módulo de auditoria). Clientes e Vendas apenas emitem — nunca importam
 * um do outro nem o estado interno do shell.
 */
const unsubscribers: Array<() => void> = [];

onMounted(() => {
  unsubscribers.push(
    eventBus.on('customer:created', (customer) =>
      pushToast(`Cliente "${customer.name}" cadastrado.`, 'success'),
    ),
    eventBus.on('customer:updated', (customer) =>
      pushToast(`Cliente "${customer.name}" atualizado.`, 'info'),
    ),
    eventBus.on('customer:deleted', () => pushToast('Cliente removido.', 'info')),
    eventBus.on('sale:created', (sale) =>
      pushToast(`Nova venda registrada para ${sale.customerName}.`, 'success'),
    ),
  );
});

onUnmounted(() => {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
});
</script>

<template>
  <RouterView />
  <ToastHost />
</template>
