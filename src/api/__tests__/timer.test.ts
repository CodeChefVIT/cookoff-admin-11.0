import { beforeEach, describe, expect, it, vi } from 'vitest';

import api from '../client';
import { getTime, resetRound, setTime, startRound, updateTime, type TimerState } from '../timer';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('timer API', () => {
  const mockTimerState: TimerState = {
    round: 1,
    is_running: true,
    duration: 3600,
    start_time: '2026-09-19T10:00:00Z',
    end_time: '2026-09-19T11:00:00Z',
    time_left: 1800,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTime', () => {
    it('returns TimerState on success', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, message: 'ok', data: mockTimerState },
      });

      const result = await getTime();
      expect(result).toEqual(mockTimerState);
      expect(api.get).toHaveBeenCalledWith('/getTime');
    });

    it('returns null on failure', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

      const result = await getTime();
      expect(result).toBeNull();
    });
  });

  describe('setTime', () => {
    it('posts duration configuration and returns state', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { success: true, message: 'ok', data: mockTimerState },
      });

      const result = await setTime({ round: 2, duration_seconds: 1800 });
      expect(result).toEqual(mockTimerState);
      expect(api.post).toHaveBeenCalledWith('/admin/setTime', {
        round: 2,
        duration_seconds: 1800,
      });
    });
  });

  describe('updateTime', () => {
    it('posts additional seconds and returns updated state', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { success: true, message: 'ok', data: mockTimerState },
      });

      const result = await updateTime({ additional_seconds: 300 });
      expect(result).toEqual(mockTimerState);
      expect(api.post).toHaveBeenCalledWith('/admin/updateTime', {
        additional_seconds: 300,
      });
    });
  });

  describe('resetRound', () => {
    it('posts reset request and returns state', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { success: true, message: 'ok', data: mockTimerState },
      });

      const result = await resetRound();
      expect(result).toEqual(mockTimerState);
      expect(api.post).toHaveBeenCalledWith('/admin/resetRound');
    });
  });

  describe('startRound', () => {
    it('posts startRound with round query parameter', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { success: true, message: 'ok', data: mockTimerState },
      });

      const result = await startRound(1);
      expect(result).toEqual(mockTimerState);
      expect(api.post).toHaveBeenCalledWith('/admin/startRound', null, {
        params: { round: 1 },
      });
    });
  });
});
