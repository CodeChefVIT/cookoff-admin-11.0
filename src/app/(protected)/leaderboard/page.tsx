'use client';

import { useQuery } from '@tanstack/react-query';
import { Copy, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

import { getLeaderboard, type LeaderboardUser } from '@/api/users';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';

function Leaderboard() {
  const { data, error, isLoading } = useQuery<LeaderboardUser[], Error>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await getLeaderboard();
      return res;
    },
  });

  const handleCopy = (id: string) => {
    navigator.clipboard
      .writeText(id ?? '')
      .then(() => {
        toast.success('User ID copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy User ID.');
      });
  };

  const topThree = data?.slice(0, 3) ?? [];
  const otherUsers = data?.slice(3) ?? [];

  const getRankClasses = (rank: number) => {
    switch (rank) {
      case 1:
        return `${ACCENT_COLOR} border-4 border-yellow-500 shadow-[0_0_15px_rgba(253,224,71,0.5)]`;
      case 2:
        return 'border-4 border-gray-400 text-gray-300';
      case 3:
        return 'border-4 border-yellow-700 text-yellow-600';
      default:
        return 'border border-gray-700 text-white';
    }
  };

  const orderedTopThree = [];
  if (topThree[1]) orderedTopThree.push({ user: topThree[1], rank: 2 });
  if (topThree[0]) orderedTopThree.push({ user: topThree[0], rank: 1 });
  if (topThree[2]) orderedTopThree.push({ user: topThree[2], rank: 3 });

  return (
    <div className={`min-h-screen p-5 text-white`}>
      <h1
        className={`mb-8 pb-2 text-center text-3xl font-extrabold uppercase tracking-widest sm:text-4xl ${ACCENT_COLOR} border-b border-[${ACCENT_GREEN}]/50`}
      >
        Leaderboard
      </h1>

      {isLoading && (
        <div className="mt-10 text-center">
          <p className={ACCENT_COLOR}>Loading leaderboard...</p>
        </div>
      )}
      {error && (
        <div className="mt-10 text-center text-red-500">
          <p>Error loading leaderboard: {error?.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 flex items-end justify-center gap-2 sm:gap-4">
            {orderedTopThree.map(({ user, rank }) => (
              <div
                key={user?.ID}
                className={`flex transform cursor-pointer flex-col justify-between rounded-lg p-2 transition-transform duration-300 hover:scale-[1.03] bg-[${ACCENT_GREEN}]/10 shadow-lg backdrop-blur-sm border-[${ACCENT_GREEN}]/50 w-full max-w-[100px] sm:max-w-[150px] ${getRankClasses(rank)} `}
                style={{
                  minHeight: '180px',
                  flexGrow: rank === 1 ? 1.2 : rank === 2 ? 1.1 : 1,
                }}
                onClick={() => handleCopy(user?.ID ?? '')}
              >
                <div className="flex flex-col items-center p-1">
                  <Trophy
                    className={`mb-1 h-5 w-5 sm:h-8 sm:w-8 ${
                      rank === 1
                        ? 'fill-yellow-500'
                        : rank === 2
                          ? 'fill-gray-400'
                          : 'fill-yellow-700'
                    }`}
                  />
                  <p className="mb-0 text-xl font-black sm:text-3xl">{`#${rank}`}</p>
                  <p className="w-full truncate text-center text-xs font-semibold sm:text-sm">
                    {user?.Name ?? 'Unknown'}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold sm:text-xl ${
                      rank === 1 ? ACCENT_COLOR : ''
                    }`}
                  >
                    {user?.Score ?? 0}
                  </p>
                  <Copy className="mt-1 h-3 w-3 opacity-30 transition-opacity hover:opacity-100" />
                </div>

                <div
                  className={`mt-2 rounded-b-lg p-1 text-center text-xs font-bold sm:text-sm bg-[${ACCENT_GREEN}]/30 border-t border-[${ACCENT_GREEN}]/50 `}
                >
                  RANK {rank}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-xl border border-[${ACCENT_GREEN}]/30 ${CARD_BG} p-4 shadow-inner sm:p-6`}
          >
            <h2 className={`mb-4 text-xl font-bold uppercase tracking-wider ${ACCENT_COLOR}`}>
              The Rest of the Field
            </h2>
            <div className="flex flex-col gap-1">
              {otherUsers.length > 0 ? (
                otherUsers.slice(0, 17).map((user, index) => {
                  const rank = index + 4;
                  return (
                    <div
                      key={user?.ID}
                      className={`flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors duration-200 hover:bg-[${ACCENT_GREEN}]/10`}
                      onClick={() => handleCopy(user?.ID ?? '')}
                    >
                      <div className="flex items-center space-x-4">
                        <span
                          className={`w-6 text-right text-lg font-bold ${ACCENT_COLOR}`}
                        >{`${rank}.`}</span>

                        <span className="text-sm font-medium text-white sm:text-base">
                          {user?.Name ?? 'Unknown'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-extrabold sm:text-xl ${ACCENT_COLOR}`}>
                          {user?.Score ?? 0}
                        </span>
                        <Copy className="h-4 w-4 text-gray-500 opacity-50 transition-opacity hover:opacity-100" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-4 text-center text-gray-500">No other participants yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
