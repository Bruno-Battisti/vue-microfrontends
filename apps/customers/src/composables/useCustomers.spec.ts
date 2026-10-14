import { describe, it, expect, vi, beforeEach } from 'vitest';
import { eventBus } from '@vue-mf/utils';
import { useCustomers } from './useCustomers';
import { customersApi } from '../api/customersApi';

vi.mock('../api/customersApi', () => ({
  customersApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('useCustomers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the customer list and exposes a success status', async () => {
    vi.mocked(customersApi.list).mockResolvedValue([
      { id: '1', name: 'Ana', email: 'ana@example.com', phone: '111', createdAt: '2026-01-01' },
    ]);
    const { customers, status, fetchCustomers } = useCustomers();
    await fetchCustomers();
    expect(status.value).toBe('success');
    expect(customers.value).toHaveLength(1);
  });

  it('exposes an error status when the API fails', async () => {
    vi.mocked(customersApi.list).mockRejectedValue(new Error('offline'));
    const { status, errorMessage, fetchCustomers } = useCustomers();
    await fetchCustomers();
    expect(status.value).toBe('error');
    expect(errorMessage.value).toBe('offline');
  });

  it('creates a customer, adds it locally, and emits customer:created', async () => {
    vi.mocked(customersApi.create).mockResolvedValue({
      id: '1',
      name: 'Ana',
      email: 'ana@example.com',
      phone: '111',
      createdAt: '2026-01-01',
    });
    const handler = vi.fn();
    const off = eventBus.on('customer:created', handler);

    const { customers, createCustomer } = useCustomers();
    await createCustomer({ name: 'Ana', email: 'ana@example.com', phone: '111' });

    expect(customers.value).toHaveLength(1);
    expect(handler).toHaveBeenCalledTimes(1);
    off();
  });

  it('filters the list by name or email', () => {
    const { customers, filtered, search } = useCustomers();
    customers.value = [
      { id: '1', name: 'Ana Souza', email: 'ana@example.com', phone: '1', createdAt: '' },
      { id: '2', name: 'Carlos Pereira', email: 'carlos@example.com', phone: '2', createdAt: '' },
    ];
    search.value = 'ana';
    expect(filtered.value).toHaveLength(1);
    expect(filtered.value[0].name).toBe('Ana Souza');
  });

  it('removes a customer and emits customer:deleted', async () => {
    vi.mocked(customersApi.remove).mockResolvedValue(undefined);
    const handler = vi.fn();
    const off = eventBus.on('customer:deleted', handler);

    const { customers, removeCustomer } = useCustomers();
    customers.value = [{ id: '1', name: 'Ana', email: 'a@example.com', phone: '1', createdAt: '' }];

    await removeCustomer('1');

    expect(customers.value).toHaveLength(0);
    expect(handler).toHaveBeenCalledWith({ id: '1' });
    off();
  });
});
