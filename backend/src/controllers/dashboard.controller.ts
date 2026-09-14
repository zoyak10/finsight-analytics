import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { buildTransactionFilter } from '../utils/queryBuilder';

export const getSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query as any);

    const [result] = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] },
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] },
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] },
          },
          totalTransactions: { $sum: 1 },
          avgTransactionAmount: { $avg: '$amount' },
        },
      },
    ]);

    const summary = result || {
      totalRevenue: 0,
      totalExpenses: 0,
      pendingCount: 0,
      pendingAmount: 0,
      paidCount: 0,
      totalTransactions: 0,
      avgTransactionAmount: 0,
    };

    res.json({
      success: true,
      data: {
        totalRevenue: summary.totalRevenue,
        totalExpenses: summary.totalExpenses,
        netCashFlow: summary.totalRevenue - summary.totalExpenses,
        pendingCount: summary.pendingCount,
        pendingAmount: summary.pendingAmount,
        paidCount: summary.paidCount,
        totalTransactions: summary.totalTransactions,
        avgTransactionAmount: Math.round(summary.avgTransactionAmount * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard summary' });
  }
};

export const getTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query as any);

    const trends = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Reshape into monthly data
    const monthlyMap = new Map<string, { month: string; revenue: number; expenses: number; revenueCount: number; expenseCount: number }>();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    trends.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      const monthLabel = `${monthNames[item._id.month - 1]} ${item._id.year}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { month: monthLabel, revenue: 0, expenses: 0, revenueCount: 0, expenseCount: 0 });
      }

      const entry = monthlyMap.get(key)!;
      if (item._id.category === 'Revenue') {
        entry.revenue = item.total;
        entry.revenueCount = item.count;
      } else {
        entry.expenses = item.total;
        entry.expenseCount = item.count;
      }
    });

    const data = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);

    res.json({ success: true, data });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve trend data' });
  }
};

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query as any);

    const categories = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const data = categories.map((cat) => ({
      category: cat._id,
      totalAmount: cat.totalAmount,
      count: cat.count,
      avgAmount: Math.round(cat.avgAmount * 100) / 100,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve category data' });
  }
};
