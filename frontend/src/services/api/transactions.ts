import api from '../../lib/api';
import type { Transaction, PaginatedResponse, ApiResponse } from '../../types';

interface TransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  category?: string;
  status?: string;
  userId?: string;
}

export async function getTransactions(params: TransactionParams): Promise<PaginatedResponse<Transaction>> {
  // Remove empty string params
  const cleanParams: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      cleanParams[key] = value;
    }
  });

  const { data } = await api.get<PaginatedResponse<Transaction>>('/transactions', { params: cleanParams });
  return data;
}

export async function getTransactionById(id: number): Promise<Transaction> {
  const { data } = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
  return data.data;
}

export async function getUsers(): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>('/transactions/users');
  return data.data;
}
