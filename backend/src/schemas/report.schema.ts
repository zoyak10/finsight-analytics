import { z } from 'zod';

const VALID_EXPORT_FIELDS = ['id', 'date', 'amount', 'category', 'status', 'user_id', 'user_profile'] as const;

export const reportExportSchema = z.object({
  columns: z
    .array(z.enum(VALID_EXPORT_FIELDS))
    .min(1, 'At least one column must be selected'),
  filters: z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      minAmount: z.number().min(0).optional(),
      maxAmount: z.number().min(0).optional(),
      category: z.enum(['Revenue', 'Expense']).optional(),
      status: z.enum(['Paid', 'Pending']).optional(),
      userId: z.string().optional(),
      search: z.string().optional(),
    })
    .optional(),
});

export type ReportExportInput = z.infer<typeof reportExportSchema>;
export { VALID_EXPORT_FIELDS };
