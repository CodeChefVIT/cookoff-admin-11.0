import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as usersApi from '@/api/users';

import { useAuth } from '../use-auth';

const mockRouter = {
  replace: vi.fn(),
  push: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

vi.mock('@/api/users', () => ({
  getAdminSession: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets isAuthenticated to true when session is valid', async () => {
    vi.mocked(usersApi.getAdminSession).mockResolvedValue({
      status: 'success',
      user_id: 'admin-123',
      role: 'admin',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('redirects to / and remains unauthenticated when session validation fails', async () => {
    vi.mocked(usersApi.getAdminSession).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });
});
