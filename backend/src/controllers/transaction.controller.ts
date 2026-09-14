import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { buildTransactionFilter } from '../utils/queryBuilder';
import { TransactionQuery } from '../schemas/transaction.schema';

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query as unknown as TransactionQuery;
    const { page, limit, sortBy, sortOrder, ...filterParams } = query;

    const filter = buildTransactionFilter(filterParams);

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions' });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transactionId = parseInt(id, 10);

    if (isNaN(transactionId)) {
      res.status(400).json({ success: false, message: 'Invalid transaction ID' });
      return;
    }

    const transaction = await Transaction.findOne({ id: transactionId }).lean();

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve transaction' });
  }
};

export const getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await Transaction.distinct('user_id');
    res.json({ success: true, data: users.sort() });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};
