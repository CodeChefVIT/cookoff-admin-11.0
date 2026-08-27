import { handleAPIError } from '@/lib/error';

import api from '.';

export interface RoundParams {
  round_id: number;
}

export interface LeaderBoardUser {
  ID: string;
  Name: string;
  Score: number | null;
}

export async function RoundEnable(data: RoundParams) {
  try {
    const response = await api.post<{ message: string }>('/round/enable', data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw handleAPIError(e);
  }
}
