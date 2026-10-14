import { ref } from 'vue';
import { eventBus } from '@vue-mf/utils';
import type { Customer, Sale, SaleItem } from '@vue-mf/types';
import { calculateSaleTotal } from '@vue-mf/types';
import { salesApi } from '../api/salesApi';
import { customersApi } from '../api/customersApi';

export function useSales() {
  const sales = ref<Sale[]>([]);
  const customers = ref<Customer[]>([]);
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const errorMessage = ref<string | null>(null);

  async function fetchAll() {
    status.value = 'loading';
    errorMessage.value = null;
    try {
      const [salesList, customersList] = await Promise.all([salesApi.list(), customersApi.list()]);
      sales.value = salesList;
      customers.value = customersList;
      status.value = 'success';
    } catch (err) {
      errorMessage.value = (err as Error).message;
      status.value = 'error';
    }
  }

  async function createSale(customerId: string, items: SaleItem[]) {
    const customer = customers.value.find((c) => c.id === customerId);
    if (!customer) throw new Error('Selecione um cliente válido.');

    const created = await salesApi.create({
      customerId,
      customerName: customer.name,
      items,
      total: calculateSaleTotal(items),
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    sales.value.unshift(created);
    eventBus.emit('sale:created', created);
    return created;
  }

  return { sales, customers, status, errorMessage, fetchAll, createSale };
}
