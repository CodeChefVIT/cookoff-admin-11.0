import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as usersApi from '@/api/users';

import Sidebar from '../sidebar';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard',
}));

vi.mock('@/api/users', () => ({
  logout: vi.fn(),
}));

describe('Sidebar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links and logout button', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Leader')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout and redirects to / on logout click', async () => {
    vi.mocked(usersApi.logout).mockResolvedValueOnce();

    render(<Sidebar />);
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    expect(usersApi.logout).toHaveBeenCalled();
  });
});
