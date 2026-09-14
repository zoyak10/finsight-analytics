import api from '../../lib/api';
import type { ApiResponse, DashboardSummary, TrendData, CategoryData } from '../../types';

export async function getSummary(params?: Record<string, string>): Promise<DashboardSummary> {
  const { data } = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
  return data.data;
}

export async function getTrends(params?: Record<string, string>): Promise<TrendData[]> {
  const { data } = await api.get<ApiResponse<TrendData[]>>('/dashboard/trends', { params });
  return data.data;
}

export async function getCategories(params?: Record<string, string>): Promise<CategoryData[]> {
  const { data } = await api.get<ApiResponse<CategoryData[]>>('/dashboard/categories', { params });
  return data.data;
}
