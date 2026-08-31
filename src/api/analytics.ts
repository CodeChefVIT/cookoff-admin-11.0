import { handleAPIError } from '@/lib/error';

import api from '.';

export interface AnalyticsResponse {
  status: string;
  total_users: number;
  total_submissions: number;
  round_wise: Record<
    string,
    Array<{
      question_id: string;
      submissions_made: number;
    }>
  >;
  language_wise: Record<string, number>;
}

export async function getAnalytics() {
  try {
    const response = await api.get<AnalyticsResponse>('/admin/analytics');
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}
