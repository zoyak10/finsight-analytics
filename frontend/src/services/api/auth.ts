import api from '../../lib/api';
import type { ApiResponse, LoginResponse, AuthUser } from '../../types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
  return data.data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
  return data.data;
}
