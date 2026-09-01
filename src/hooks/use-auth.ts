'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Redirects unauthenticated users to the login page. Verifies the session by
// calling a protected admin endpoint with credentials; any non-2xx response is
// treated as unauthenticated. Uses fetch directly to read the real status code,
// bypassing the axios interceptor that would otherwise mask a 401.
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/admin/leaderboard`, {
          credentials: 'include',
        });
        if (active) {
          setIsAuthenticated(res.ok);
          if (!res.ok) router.replace('/');
        }
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
