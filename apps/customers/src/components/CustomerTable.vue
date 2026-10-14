<script setup lang="ts">
import { AppButton } from '@vue-mf/ui';
import type { Customer } from '@vue-mf/types';

defineProps<{ customers: Customer[] }>();
const emit = defineEmits<{ edit: [Customer]; remove: [Customer] }>();

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(iso));
}
</script>

<template>
  <table class="customer-table">
    <thead>
      <tr>
        <th>Nome</th>
        <th>E-mail</th>
        <th>Telefone</th>
        <th>Cadastrado em</th>
        <th aria-label="Ações" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{ customer.name }}</td>
        <td>{{ customer.email }}</td>
        <td>{{ customer.phone }}</td>
        <td>{{ formatDate(customer.createdAt) }}</td>
        <td class="customer-table__actions">
          <AppButton variant="ghost" @click="emit('edit', customer)">Editar</AppButton>
          <AppButton variant="danger" @click="emit('remove', customer)">Excluir</AppButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.customer-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-md);
  overflow: hidden;
}

.customer-table th,
.customer-table td {
  text-align: left;
  padding: var(--mf-space-3) var(--mf-space-4);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--mf-color-border);
}

.customer-table th {
  color: var(--mf-color-text-muted);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.customer-table tbody tr:last-child td {
  border-bottom: none;
}

.customer-table__actions {
  display: flex;
  gap: var(--mf-space-2);
  justify-content: flex-end;
}
</style>
