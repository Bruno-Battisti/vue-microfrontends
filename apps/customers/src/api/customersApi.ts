import { createRestResource, seedCustomers } from '@vue-mf/utils';
import type { Customer } from '@vue-mf/types';

export const customersApi = createRestResource<Customer>('mf-customers', seedCustomers);
