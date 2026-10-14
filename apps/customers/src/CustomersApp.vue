<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppButton, ConfirmDialog, StateMessage } from '@vue-mf/ui';
import type { Customer } from '@vue-mf/types';
import { useCustomers } from './composables/useCustomers';
import CustomerTable from './components/CustomerTable.vue';
import CustomerForm from './components/CustomerForm.vue';

const {
  filtered,
  search,
  status,
  errorMessage,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  removeCustomer,
} = useCustomers();

const formOpen = ref(false);
const editingCustomer = ref<Customer | null>(null);
const confirmOpen = ref(false);
const customerToDelete = ref<Customer | null>(null);

onMounted(fetchCustomers);

function openCreateForm() {
  editingCustomer.value = null;
  formOpen.value = true;
}

function openEditForm(customer: Customer) {
  editingCustomer.value = customer;
  formOpen.value = true;
}

async function handleFormSubmit(input: { name: string; email: string; phone: string }) {
  if (editingCustomer.value) {
    await updateCustomer(editingCustomer.value.id, input);
  } else {
    await createCustomer(input);
  }
  formOpen.value = false;
}

function askRemove(customer: Customer) {
  customerToDelete.value = customer;
  confirmOpen.value = true;
}

async function confirmRemove() {
  if (customerToDelete.value) {
    await removeCustomer(customerToDelete.value.id);
  }
  confirmOpen.value = false;
  customerToDelete.value = null;
}
</script>

<template>
  <section class="customers">
    <header class="customers__header">
      <h2 class="customers__title">Clientes</h2>
      <AppButton @click="openCreateForm">+ Novo cliente</AppButton>
    </header>

    <input
      v-model="search"
      class="customers__search"
      type="search"
      placeholder="Pesquisar por nome ou e-mail…"
    />

    <StateMessage v-if="status === 'loading'" kind="loading" title="Carregando clientes…" />

    <StateMessage
      v-else-if="status === 'error'"
      kind="error"
      title="Não foi possível carregar os clientes"
      :description="errorMessage ?? undefined"
    >
      <AppButton variant="ghost" @click="fetchCustomers">Tentar novamente</AppButton>
    </StateMessage>

    <StateMessage
      v-else-if="filtered.length === 0"
      kind="empty"
      title="Nenhum cliente encontrado"
      description="Ajuste a pesquisa ou cadastre um novo cliente."
    />

    <CustomerTable v-else :customers="filtered" @edit="openEditForm" @remove="askRemove" />

    <CustomerForm
      :open="formOpen"
      :customer="editingCustomer"
      @submit="handleFormSubmit"
      @cancel="formOpen = false"
    />

    <ConfirmDialog
      :open="confirmOpen"
      title="Excluir cliente?"
      :description="customerToDelete ? `Esta ação remove ${customerToDelete.name} permanentemente.` : ''"
      confirm-label="Excluir"
      @confirm="confirmRemove"
      @cancel="confirmOpen = false"
    />
  </section>
</template>

<style scoped>
.customers {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-4);
}

.customers__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.customers__title {
  margin: 0;
}

.customers__search {
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  border: 1px solid var(--mf-color-border);
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-size: 0.9rem;
  max-width: 320px;
}
</style>
