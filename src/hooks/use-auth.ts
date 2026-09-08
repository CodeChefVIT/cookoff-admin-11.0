'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getAdminSession } from '@/api/users';

// Redirects unauthenticated users to the login page. Verifies the session by
// calling a protected admin endpoint through the axios client so the
// token-refresh interceptor runs first — an expired access token with a valid
// refresh token is silently refreshed rather than logged out. Only a genuine
// refresh failure (rejected request) redirects to login.
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        await getAdminSession();
        if (active) setIsAuthenticated(true);
      } catch {
        if (active) router.replace('/');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  return { isLoading, isAuthenticated };
}

export default useAuth;
