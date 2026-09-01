'use client';

import { useQuery } from '@tanstack/react-query';

import { getLeaderboard, type LeaderboardUser } from '@/api/users';
import NotificationsSender from '@/components/NotificationsSender';
import useAuth from '@/hooks/use-auth';

function Dashboard() {
  const { isLoading, isAuthenticated } = useAuth();

  useQuery<LeaderboardUser[], Error>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await getLeaderboard();
      return res;
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen text-white">
      {/* <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">
        Analytics
      </div>
      <div className="flex w-full justify-center text-black">
        <AnalyticsCard />
      </div> */}

      {isLoading || !isAuthenticated ? null : (
        <>
          <div className="s-sling m-3 mt-10 text-center text-xl font-semibold">Notifications</div>
          <div className="flex w-full justify-center text-black">
            <NotificationsSender />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
