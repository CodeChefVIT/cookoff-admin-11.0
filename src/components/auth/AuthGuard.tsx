'use client';

import type { ReactNode } from 'react';

import useAuth from '@/hooks/use-auth';

// Renders children only once the session is verified; otherwise shows nothing
// while useAuth redirects unauthenticated users to the login page.
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  return isLoading || !isAuthenticated ? null : <>{children}</>;
}

export default AuthGuard;
