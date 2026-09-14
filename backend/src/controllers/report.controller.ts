import { Request, Response } from 'express';
// @ts-ignore - json2csv alpha doesn't ship full type declarations
import { Parser } from '@json2csv/plainjs';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { buildTransactionFilter } from '../utils/queryBuilder';
import { ReportExportInput, VALID_EXPORT_FIELDS } from '../schemas/report.schema';

const FIELD_LABELS: Record<string, string> = {
  id: 'Transaction ID',
  date: 'Date',
  amount: 'Amount (₹)',
  category: 'Category',
  status: 'Status',
  user_id: 'User ID',
  user_profile: 'User Profile',
};

export const exportReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { columns, filters } = req.body as ReportExportInput;

    // Build filter from request
    const dbFilter = buildTransactionFilter(filters || {});

    // Fetch matching records
    const transactions = await Transaction.find(dbFilter)
      .sort({ date: -1 })
      .lean();

    if (transactions.length === 0) {
      res.status(404).json({ success: false, message: 'No transactions match the current filters' });
      return;
    }

    // Build CSV with only selected columns
    const fields = columns.map((col) => ({
      label: FIELD_LABELS[col] || col,
      value: (row: any) => {
        if (col === 'date') {
          return new Date(row.date).toISOString().split('T')[0];
        }
        if (col === 'amount') {
          return row.amount.toFixed(2);
        }
        return row[col];
      },
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    const today = new Date().toISOString().split('T')[0];
    const filename = `finsight-report-${today}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
};

export const getExportPreview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = req.query as any;
    const dbFilter = buildTransactionFilter(filters);
    const count = await Transaction.countDocuments(dbFilter);

    res.json({
      success: true,
      data: {
        recordCount: count,
        availableFields: VALID_EXPORT_FIELDS.map((f) => ({
          field: f,
          label: FIELD_LABELS[f] || f,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get export preview' });
  }
};
