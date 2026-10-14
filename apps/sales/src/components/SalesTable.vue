<script setup lang="ts">
import type { Sale, SaleStatus } from '@vue-mf/types';

defineProps<{ sales: Sale[] }>();

const statusLabel: Record<SaleStatus, string> = {
  pending: 'Pendente',
  paid: 'Paga',
  cancelled: 'Cancelada',
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(iso));
}
</script>

<template>
  <table class="sales-table">
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Itens</th>
        <th>Total</th>
        <th>Status</th>
        <th>Data</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="sale in sales" :key="sale.id">
        <td>{{ sale.customerName }}</td>
        <td>{{ sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ') }}</td>
        <td>{{ formatCurrency(sale.total) }}</td>
        <td><span class="badge" :class="`badge--${sale.status}`">{{ statusLabel[sale.status] }}</span></td>
        <td>{{ formatDate(sale.createdAt) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.sales-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-md);
  overflow: hidden;
}

.sales-table th,
.sales-table td {
  text-align: left;
  padding: var(--mf-space-3) var(--mf-space-4);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--mf-color-border);
}

.sales-table th {
  color: var(--mf-color-text-muted);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sales-table tbody tr:last-child td {
  border-bottom: none;
}

.badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--paid {
  background: rgba(34, 197, 94, 0.15);
  color: var(--mf-color-success);
}

.badge--pending {
  background: rgba(234, 179, 8, 0.15);
  color: var(--mf-color-warning);
}

.badge--cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: var(--mf-color-danger);
}
</style>
