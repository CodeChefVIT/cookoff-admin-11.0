'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Code, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getAnalytics } from '@/api/analytics';

const ACCENT_GREEN = '#1ba94c';
const PRIMARY_BG = 'bg-[#0E150F]';
const CARD_BG = 'bg-[#182319]';
const CHART_GRID_COLOR = '#303a31';
const ACCENT_COLOR = 'text-[#1ba94c]';
const INPUT_BG = 'bg-[#253026]';

const PIE_COLORS = [ACCENT_GREEN, '#98FB98', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'];
const BAR_COLOR = ACCENT_GREEN;
const TOTALS_COLOR = {
  submissions: `from-[${ACCENT_GREEN}] to-[#15803d] shadow-lg shadow-[${ACCENT_GREEN}]/30`,

  users: 'from-blue-600 to-indigo-700 shadow-lg shadow-blue-800/30',
};

type AnalyticsResponse = {
  language_wise: Record<string, number>;
  round_wise: Record<string, { question_id: string; submissions_made: number }[]>;
  total_submissions: number;
  total_users: number;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: keyof typeof TOTALS_COLOR;
}) => (
  <div
    className={`flex transform flex-col items-start justify-between rounded-xl border border-white/5 bg-gradient-to-br p-6 transition duration-300 ease-in-out hover:scale-[1.02] ${TOTALS_COLOR[color]}`}
  >
    <div className="flex items-center text-white/90">
      <Icon className="mr-3 h-7 w-7 text-white/80" />
      <h2 className="text-lg font-medium uppercase tracking-wider">{title}</h2>
    </div>
    <p className="mt-4 text-5xl font-extrabold text-white">{value}</p>
  </div>
);

export default function AnalyticsSection() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);

        const firstRound = Object.keys(data.round_wise).sort()[0];
        setSelectedRound(firstRound ?? null);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('❌ Failed to fetch analytics.');
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className={`flex h-64 items-center justify-center text-xl text-gray-400 ${PRIMARY_BG}`}>
        Loading analytics dashboard...
      </div>
    );
  }

  const languageData = Object.entries(analytics.language_wise).map(([name, value]) => ({
    name,
    value,
  }));

  const rounds = Object.keys(analytics.round_wise).sort();

  const roundSubmissionsData =
    analytics.round_wise[selectedRound ?? '']?.map((q, index) => ({
      name: `Q${index + 1} (${q.question_id})`,
      Submissions: q.submissions_made,
    })) ?? [];

  return (
    <div className={`min-h-screen p-6 text-white md:p-10`}>
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Total Registered Users"
          value={analytics.total_users}
          icon={Users}
          color="users"
        />
        <StatCard
          title="Total Submissions Made"
          value={analytics.total_submissions}
          icon={Send}
          color="submissions"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div
          className={`flex h-full flex-col rounded-xl border border-gray-700 ${CARD_BG} p-6 shadow-2xl lg:col-span-1`}
        >
          <h2 className="mb-4 flex items-center text-xl font-bold uppercase tracking-wider">
            <Code className={`mr-3 h-6 w-6 ${ACCENT_COLOR}`} />
            Submissions by Language
          </h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={3}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  stroke="none"
                >
                  {languageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Submissions`, name]}
                  contentStyle={{
                    backgroundColor: CARD_BG,
                    border: `1px solid ${ACCENT_GREEN}`,
                    borderRadius: 6,
                    color: 'white',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: 10, color: '#9ca3af' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`flex flex-col rounded-xl border border-gray-700 ${CARD_BG} p-6 shadow-2xl lg:col-span-2`}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Question Submissions by Round
            </h2>

            <div className="relative">
              <select
                value={selectedRound ?? ''}
                onChange={e => setSelectedRound(e.target.value)}
                className={`cursor-pointer appearance-none rounded-lg bg-[${INPUT_BG}] px-4 py-2 pr-10 font-semibold text-[#1ba94c] transition focus:outline-none focus:ring-2 focus:ring-[${ACCENT_GREEN}] border border-gray-600`}
              >
                {rounds.map(round => (
                  <option key={round} value={round} className="bg-[#182319">
                    ROUND {round}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${ACCENT_COLOR}`}
              />
            </div>
          </div>

          <div className="flex-grow">
            {roundSubmissionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={roundSubmissionsData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: CARD_BG,
                      border: `1px solid ${ACCENT_GREEN}`,
                      borderRadius: 6,
                      color: 'white',
                    }}
                    labelStyle={{ color: ACCENT_GREEN, fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Legend iconType="square" wrapperStyle={{ paddingTop: 10, color: '#9ca3af' }} />
                  <Bar dataKey="Submissions" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No submission data for the selected round.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
