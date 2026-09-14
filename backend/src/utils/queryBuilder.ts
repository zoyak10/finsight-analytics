import { FilterQuery } from 'mongoose';
import { ITransaction } from '../models/Transaction';

interface FilterParams {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  status?: string;
  userId?: string;
  search?: string;
}

export function buildTransactionFilter(params: FilterParams): FilterQuery<ITransaction> {
  const filter: FilterQuery<ITransaction> = {};

  // Date range
  if (params.startDate || params.endDate) {
    filter.date = {};
    if (params.startDate) {
      filter.date.$gte = new Date(params.startDate);
    }
    if (params.endDate) {
      const endDate = new Date(params.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.date.$lte = endDate;
    }
  }

  // Amount range
  if (params.minAmount !== undefined || params.maxAmount !== undefined) {
    filter.amount = {};
    if (params.minAmount !== undefined) {
      filter.amount.$gte = params.minAmount;
    }
    if (params.maxAmount !== undefined) {
      filter.amount.$lte = params.maxAmount;
    }
  }

  // Category
  if (params.category) {
    filter.category = params.category;
  }

  // Status
  if (params.status) {
    filter.status = params.status;
  }

  // User ID
  if (params.userId) {
    filter.user_id = params.userId;
  }

  // Search across multiple fields
  if (params.search) {
    const searchTerm = params.search.trim();
    const searchNum = parseInt(searchTerm, 10);

    const orConditions: FilterQuery<ITransaction>[] = [
      { user_id: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { status: { $regex: searchTerm, $options: 'i' } },
    ];

    if (!isNaN(searchNum)) {
      orConditions.push({ id: searchNum });
    }

    filter.$or = orConditions;
  }

  return filter;
}
