// ── Transaction ──
export interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

// ── Pagination ──
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── API Response ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// ── Dashboard ──
export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netCashFlow: number;
  pendingCount: number;
  pendingAmount: number;
  paidCount: number;
  totalTransactions: number;
  avgTransactionAmount: number;
}

export interface TrendData {
  month: string;
  revenue: number;
  expenses: number;
  revenueCount: number;
  expenseCount: number;
}

export interface CategoryData {
  category: string;
  totalAmount: number;
  count: number;
  avgAmount: number;
}

// ── Auth ──
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ── Filters ──
export interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  category: string;
  status: string;
  userId: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// ── Export ──
export interface ExportField {
  field: string;
  label: string;
}

export interface ExportPreview {
  recordCount: number;
  availableFields: ExportField[];
}
