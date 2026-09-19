import { useEffect, useState } from 'react';

// Returns true once mounted — guards against hydration mismatches on client-only values.
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
