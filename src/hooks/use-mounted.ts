import { useEffect, useRef } from 'react';

// Returns true once mounted — guards against hydration mismatches on client-only values.
export function useMounted() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return mounted.current;
}
