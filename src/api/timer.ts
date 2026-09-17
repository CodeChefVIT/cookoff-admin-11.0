import { handleAPIError } from '@/lib/error';

import api from '.';

/** `dto.TimerResponse` from `cookoff-11.0-be`. Times are RFC3339 and only present while a round has run. */
export interface TimerState {
  round: number;
  is_running: boolean;
  /** Configured round length in seconds. */
  duration: number;
  start_time: string | null;
  end_time: string | null;
  /** Seconds left in the running round; 0 when stopped. */
  time_left: number;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SetTimeParams {
  round: number;
  duration_seconds: number;
}

export interface UpdateTimeParams {
  additional_seconds: number;
}

/**
 * Fetch the contest timer: current round, whether it is running and the time left.
 */
export async function getTime(): Promise<TimerState | null> {
  try {
    const response = await api.get<Envelope<TimerState>>('/getTime');
    return response.data.data;
  } catch {
    return null;
  }
}

/**
 * Select the round and set its duration. Stops the timer until the round is started.
 */
export async function setTime(data: SetTimeParams): Promise<TimerState> {
  try {
    const response = await api.post<Envelope<TimerState>>('/admin/setTime', data);
    return response.data.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Add time to the running round (or to the configured duration if it has not started).
 */
export async function updateTime(data: UpdateTimeParams): Promise<TimerState> {
  try {
    const response = await api.post<Envelope<TimerState>>('/admin/updateTime', data);
    return response.data.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Stop the running round and clear its start/end times.
 */
export async function resetRound(): Promise<TimerState> {
  try {
    const response = await api.post<Envelope<TimerState>>('/admin/resetRound');
    return response.data.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

/**
 * Start the given round now, running for its configured duration.
 */
export async function startRound(round: number): Promise<TimerState> {
  try {
    const response = await api.post<Envelope<TimerState>>('/admin/startRound', null, {
      params: { round },
    });
    return response.data.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}
