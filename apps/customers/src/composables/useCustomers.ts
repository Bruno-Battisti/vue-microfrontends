import { computed, ref } from 'vue';
import { eventBus } from '@vue-mf/utils';
import type { Customer, CustomerInput } from '@vue-mf/types';
import { customersApi } from '../api/customersApi';

export function useCustomers() {
  const customers = ref<Customer[]>([]);
  const search = ref('');
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const errorMessage = ref<string | null>(null);

  const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) return customers.value;
    return customers.value.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term),
    );
  });

  async function fetchCustomers() {
    status.value = 'loading';
    errorMessage.value = null;
    try {
      customers.value = await customersApi.list();
      status.value = 'success';
    } catch (err) {
      errorMessage.value = (err as Error).message;
      status.value = 'error';
    }
  }

  async function createCustomer(input: CustomerInput) {
    const created = await customersApi.create({ ...input, createdAt: new Date().toISOString() });
    customers.value.push(created);
    eventBus.emit('customer:created', created);
  }

  async function updateCustomer(id: string, input: CustomerInput) {
    const updated = await customersApi.update(id, input);
    const index = customers.value.findIndex((c) => c.id === id);
    if (index !== -1) customers.value[index] = updated;
    eventBus.emit('customer:updated', updated);
  }

  async function removeCustomer(id: string) {
    await customersApi.remove(id);
    customers.value = customers.value.filter((c) => c.id !== id);
    eventBus.emit('customer:deleted', { id });
  }

  return {
    customers,
    filtered,
    search,
    status,
    errorMessage,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    removeCustomer,
  };
}
