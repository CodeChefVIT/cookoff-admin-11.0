import type { Metadata } from 'next';

import AuthGuard from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'Cookoff Admin',
};

// Guards every admin route in this group. Unauthenticated users are redirected
// to / by useAuth once mount.
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
