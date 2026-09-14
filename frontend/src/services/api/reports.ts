import api from '../../lib/api';
import type { ApiResponse, ExportPreview } from '../../types';

interface ExportParams {
  columns: string[];
  filters?: Record<string, string | number | undefined>;
}

export async function exportReport(params: ExportParams): Promise<Blob> {
  const { data } = await api.post('/reports/export', params, {
    responseType: 'blob',
  });
  return data;
}

export async function getExportPreview(filters?: Record<string, string>): Promise<ExportPreview> {
  const { data } = await api.get<ApiResponse<ExportPreview>>('/reports/preview', { params: filters });
  return data.data;
}
