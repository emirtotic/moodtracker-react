import api from '../lib/api';
import type { AnalyzeRes } from '../types';
export async function analyze():Promise<AnalyzeRes>{
  const { data } = await api.post<AnalyzeRes>('/ai/analyze');
  return data;
}

export async function createPlan(): Promise<{ response: string }> {
  const { data } = await api.post<{ response: string }>('/ai/plan'); // ← bez /api
  return data;
}