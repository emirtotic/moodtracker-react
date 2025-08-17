import api from '../lib/api';
import type { LoginRes } from '../types';
import { AxiosError } from 'axios';
export async function login(body:{email:string; password:string}):Promise<LoginRes>{
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

export async function changePassword(payload: { email: string; newPassword: string })
: Promise<{ message: string }> {
  try {
    const res = await api.post('/api/auth/change-password', payload, {
      responseType: 'text',                 // expect text, not JSON
      transformResponse: r => r,            // keep raw text
      headers: { Accept: 'text/plain' },    // hint server/axios
    });
    const message = typeof res.data === 'string'
      ? res.data
      : (res.data as any)?.message ?? 'Password has been changed.';
    return { message };
  } catch (err) {
    const e = err as AxiosError<any>;
    // Try to surface backend error message whether it's JSON or text
    const msg =
      e.response?.data?.message ??
      (typeof e.response?.data === 'string' ? e.response?.data : undefined) ??
      'Password change failed';
    throw new Error(msg);
  }
}

export async function logout(){
  try{ await api.post('/api/auth/logout'); }catch{}
  localStorage.removeItem('jwt');
}