export interface DashboardSummary {
  customersCount: number;
  salesCount: number;
  salesTotal: number;
  monthlySales: { month: string; total: number }[];
}
