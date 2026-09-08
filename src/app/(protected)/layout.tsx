import type { Metadata } from 'next';

import AuthGuard from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'Cookoff Admin',
};

// Guards every admin route in this group. Unauthenticated users are redirected
// to / by useAuth once mount.
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Sidebar is fixed w-52; pad content so it clears the nav on desktop.
  return (
    <AuthGuard>
      <div className="md:pl-52">{children}</div>
    </AuthGuard>
  );
}
