'use client';

import { useQuery } from '@tanstack/react-query';

import { getLeaderboard, type LeaderboardUser } from '@/api/users';
import NotificationsSender from '@/components/NotificationsSender';

function Dashboard() {
  const { data, error, isLoading } = useQuery<LeaderboardUser[], Error>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await getLeaderboard();
      return res;
    },
  });

  return (
    <div className="min-h-screen text-white">
      {/* <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">
        Analytics
      </div>
      <div className="flex w-full justify-center text-black">
        <AnalyticsCard />
      </div> */}

      <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">Notifications</div>
      <div className="flex w-full justify-center text-black">
        <NotificationsSender />
      </div>
    </div>
  );
}

export default Dashboard;
