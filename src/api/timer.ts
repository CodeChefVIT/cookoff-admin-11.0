import { handleAPIError } from '@/lib/error';

import api from '.';

export interface GetTimeResponse {
  server_time: string;
  round_start_time: string;
  round_end_time: string;
}

export interface SetTimeParams {
  round_id: string;
  time: string;
}

export interface UpdateTimeParams {
  round_id: string;
  duration: string;
}

export interface StartRoundResponse {
  success: boolean;
  round_id: number;
}

/**
 * Fetch the current round and server times.
 */
export async function getTime(): Promise<GetTimeResponse | null> {
  try {
    const response = await api.get<GetTimeResponse>('/getTime');
    return response.data;
  } catch (e) {
    return null;
  }
}

/**
 * Set the end time for a specific round.
 */
export async function setTime(data: SetTimeParams): Promise<{ success: boolean }> {
  try {
    const response = await api.post<{ success: boolean }>('/admin/setTime', data);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Update the remaining time of the current round.
 */
export async function updateTime(data: UpdateTimeParams): Promise<void> {
  try {
    await api.post('/admin/updateTime', data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Reset the round.
 */
export async function resetRound(): Promise<void> {
  try {
    await api.get('/admin/resetRound');
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Start a new round. Increments internal round counter and sets start times.
 */
export async function startRound(): Promise<StartRoundResponse> {
  try {
    const response = await api.get<StartRoundResponse>('/admin/startRound');
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}
