import type { Customer, Sale } from '@vue-mf/types';
import { calculateSaleTotal } from '@vue-mf/types';

/**
 * Dados iniciais compartilhados pela "API" mock. Clientes e Vendas criam suas
 * próprias instâncias de `createRestResource` apontando para as mesmas chaves de
 * armazenamento — simulando dois frontends consumindo o mesmo endpoint REST, sem
 * nenhuma dependência de código entre os microfrontends.
 */
export const seedCustomers: Customer[] = [
  {
    id: 'c1a1a1a1-0000-4000-8000-000000000001',
    name: 'Ana Souza',
    email: 'ana.souza@example.com',
    phone: '(11) 98888-1234',
    createdAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'c2b2b2b2-0000-4000-8000-000000000002',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@example.com',
    phone: '(21) 97777-5678',
    createdAt: new Date('2026-03-22').toISOString(),
  },
  {
    id: 'c3c3c3c3-0000-4000-8000-000000000003',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@example.com',
    phone: '(31) 96666-9012',
    createdAt: new Date('2026-06-05').toISOString(),
  },
];

const salesItems1 = [{ productName: 'Plano Premium', quantity: 1, unitPrice: 299 }];
const salesItems2 = [
  { productName: 'Consultoria', quantity: 3, unitPrice: 150 },
  { productName: 'Suporte estendido', quantity: 1, unitPrice: 80 },
];
const salesItems3 = [{ productName: 'Licença básica', quantity: 2, unitPrice: 99 }];

export const seedSales: Sale[] = [
  {
    id: 's1a1a1a1-0000-4000-8000-000000000001',
    customerId: seedCustomers[0].id,
    customerName: seedCustomers[0].name,
    items: salesItems1,
    total: calculateSaleTotal(salesItems1),
    status: 'paid',
    createdAt: new Date('2026-07-02').toISOString(),
  },
  {
    id: 's2b2b2b2-0000-4000-8000-000000000002',
    customerId: seedCustomers[1].id,
    customerName: seedCustomers[1].name,
    items: salesItems2,
    total: calculateSaleTotal(salesItems2),
    status: 'pending',
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 's3c3c3c3-0000-4000-8000-000000000003',
    customerId: seedCustomers[2].id,
    customerName: seedCustomers[2].name,
    items: salesItems3,
    total: calculateSaleTotal(salesItems3),
    status: 'cancelled',
    createdAt: new Date('2026-09-28').toISOString(),
  },
];
