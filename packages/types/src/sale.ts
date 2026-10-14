export type SaleStatus = 'pending' | 'paid' | 'cancelled';

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  status: SaleStatus;
  createdAt: string;
}

export type SaleInput = Pick<Sale, 'customerId' | 'items'>;

export function calculateSaleTotal(items: SaleItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}
