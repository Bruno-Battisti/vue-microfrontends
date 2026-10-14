import { createRestResource, seedCustomers } from '@vue-mf/utils';
import type { Customer } from '@vue-mf/types';

/**
 * Mesma "API" de clientes consumida pelo microfrontend de Clientes — aqui usada
 * apenas em modo leitura, para vincular uma venda a um cliente existente. Nenhum
 * código do módulo de Clientes é importado: só o contrato de dados (@vue-mf/types)
 * e a mesma chave de armazenamento mock, como dois clientes de uma mesma API REST.
 */
export const customersApi = createRestResource<Customer>('mf-customers', seedCustomers);
