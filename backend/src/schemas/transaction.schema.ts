import { z } from 'zod';

const VALID_SORT_FIELDS = ['date', 'amount', 'category', 'status', 'user_id', 'id'] as const;
const VALID_SORT_ORDERS = ['asc', 'desc'] as const;
const VALID_CATEGORIES = ['Revenue', 'Expense'] as const;
const VALID_STATUSES = ['Paid', 'Pending'] as const;

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(VALID_SORT_FIELDS).default('date'),
  sortOrder: z.enum(VALID_SORT_ORDERS).default('desc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  status: z.enum(VALID_STATUSES).optional(),
  userId: z.string().optional(),
});

export const dashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  status: z.enum(VALID_STATUSES).optional(),
  userId: z.string().optional(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
