import api from '../lib/api';
import type { LoginRes } from '../types';
import { AxiosError } from 'axios';

export async function login(body: { email: string; password: string }): Promise<LoginRes> {
  const { data } = await api.post<LoginRes>('/api/auth/login', body);
  return data;
}

export async function register(body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post('/api/auth/register', body);
  return data;
}

export type ChangePasswordRes = { token: string };

export async function changePassword(
  payload: { email: string; newPassword: string }
): Promise<ChangePasswordRes> {
  try {
    const { data } = await api.post<ChangePasswordRes>('/api/auth/change-password', payload);
    return data;
  } catch (err) {
    const e = err as AxiosError<any>;
    const msg =
      e.response?.data?.message ??
      (typeof e.response?.data === 'string' ? e.response?.data : undefined) ??
      'Password change failed';
    throw new Error(msg);
  }
}

export async function logout() {
  try {
    await api.post('/api/auth/logout');
  } catch {}
  localStorage.removeItem('jwt');
}
