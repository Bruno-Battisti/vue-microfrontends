import { createRestResource } from '@vue-mf/utils';
import type { Customer } from '@vue-mf/types';

const seed: Customer[] = [
  {
    id: crypto.randomUUID(),
    name: 'Ana Souza',
    email: 'ana.souza@example.com',
    phone: '(11) 98888-1234',
    createdAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Carlos Pereira',
    email: 'carlos.pereira@example.com',
    phone: '(21) 97777-5678',
    createdAt: new Date('2026-03-22').toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Fernanda Lima',
    email: 'fernanda.lima@example.com',
    phone: '(31) 96666-9012',
    createdAt: new Date('2026-06-05').toISOString(),
  },
];

export const customersApi = createRestResource<Customer>('mf-customers', seed);
