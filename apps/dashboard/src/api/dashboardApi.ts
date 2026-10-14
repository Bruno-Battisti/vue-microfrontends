import { createRestResource, seedCustomers, seedSales } from '@vue-mf/utils';
import type { Customer, DashboardSummary, Sale } from '@vue-mf/types';

const customersApi = createRestResource<Customer>('mf-customers', seedCustomers);
const salesApi = createRestResource<Sale>('mf-sales', seedSales);

const MONTH_FORMATTER = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const [customers, sales] = await Promise.all([customersApi.list(), salesApi.list()]);

  const byMonth = new Map<string, number>();
  for (const sale of sales) {
    const label = MONTH_FORMATTER.format(new Date(sale.createdAt));
    byMonth.set(label, (byMonth.get(label) ?? 0) + sale.total);
  }

  return {
    customersCount: customers.length,
    salesCount: sales.length,
    salesTotal: sales.reduce((sum, sale) => sum + sale.total, 0),
    monthlySales: Array.from(byMonth, ([month, total]) => ({ month, total })),
  };
}
