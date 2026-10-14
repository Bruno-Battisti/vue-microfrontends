import { createRestResource, seedSales } from '@vue-mf/utils';
import type { Sale } from '@vue-mf/types';

export const salesApi = createRestResource<Sale>('mf-sales', seedSales);
