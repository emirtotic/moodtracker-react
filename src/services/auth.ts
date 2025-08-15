import api from '../lib/api';
import type { LoginRes } from '../types';
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
export async function changePassword(body:{oldPassword:string; newPassword:string}){
  await api.post('/api/auth/change-password', body);
}
export async function logout(){
  try{ await api.post('/api/auth/logout'); }catch{}
  localStorage.removeItem('jwt');
}