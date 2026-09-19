'use client';

import AnalyticsSection from '@/components/Analytics';
import NotificationsSender from '@/components/NotificationsSender';

function Dashboard() {
  return (
    <div className="min-h-screen text-white">
      <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">Analytics</div>
      <div className="flex w-full justify-center">
        <AnalyticsSection />
      </div>

      <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">Notifications</div>
      <div className="flex w-full justify-center text-black">
        <NotificationsSender />
      </div>
    </div>
  );
}

export default Dashboard;
