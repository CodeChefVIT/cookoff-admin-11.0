import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as useAuthHook from '@/hooks/use-auth';

import { AuthGuard } from '../AuthGuard';

vi.mock('@/hooks/use-auth');

describe('AuthGuard', () => {
  it('renders nothing when authentication is loading', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    const { container } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when user is not authenticated', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    const { container } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders children when authenticated and loaded', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
