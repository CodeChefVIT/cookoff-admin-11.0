'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Code,
  Send,
  Users,
  Zap,
} from 'lucide-react';
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

import { getAnalytics, type AnalyticsData } from '@/api/analytics';

const ACCENT_GREEN = '#1ba94c';
const CARD_BG = 'bg-[#182319]';
const PRIMARY_BG = 'bg-[#0f1710]';
const CHART_GRID_COLOR = '#2e3830';
const ACCENT_COLOR = 'text-[#1ba94c]';

const PIE_COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}) => (
  <div
    className={`flex transform flex-col justify-between rounded-xl border border-white/5 bg-gradient-to-br ${gradient} p-5 shadow-lg transition duration-200 hover:scale-[1.02]`}
  >
    <div className="flex items-center justify-between text-white/90">
      <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">{title}</h3>
      <Icon className="h-5 w-5 text-white/90" />
    </div>
    <div className="mt-3">
      <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-white/70 font-medium">{subtitle}</p>}
    </div>
  </div>
);

export function AnalyticsSection() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        if (active) setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to fetch analytics.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchAnalytics();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={`flex h-48 items-center justify-center text-base text-gray-400 ${PRIMARY_BG}`}>
        Loading analytics dashboard...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`flex h-48 items-center justify-center text-base text-red-400 ${PRIMARY_BG}`}>
        Unable to load contest analytics.
      </div>
    );
  }

  const languageData = Object.entries(analytics.languageDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const outcomesData = [
    {
      name: 'Successful',
      count: analytics.successfulSubmissions,
      fill: ACCENT_GREEN,
    },
    {
      name: 'Failed',
      count: analytics.failedSubmissions,
      fill: '#ef4444',
    },
    {
      name: 'TC Passed',
      count: analytics.totalTestcasesPassed,
      fill: '#3b82f6',
    },
    {
      name: 'TC Failed',
      count: analytics.totalTestcasesFailed,
      fill: '#f59e0b',
    },
  ];

  return (
    <div className="w-full space-y-8 p-4 text-white md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          subtitle={`${analytics.activeUsers} active now · ${analytics.bannedUsers} banned`}
          icon={Users}
          gradient="from-blue-700 to-indigo-900 shadow-blue-900/30"
        />
        <StatCard
          title="Submissions"
          value={analytics.totalSubmissions}
          subtitle={`${analytics.successfulSubmissions} accepted · ${analytics.failedSubmissions} failed`}
          icon={Send}
          gradient="from-emerald-700 to-green-900 shadow-green-900/30"
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${analytics.overallPassRate.toFixed(1)}%`}
          subtitle={`${analytics.testcasePassRate.toFixed(1)}% testcase pass rate`}
          icon={CheckCircle2}
          gradient="from-teal-700 to-cyan-900 shadow-teal-900/30"
        />
        <StatCard
          title="Velocity"
          value={`${analytics.submissionRatePerMin.toFixed(1)}/min`}
          subtitle={`${analytics.recentSubmissionsCount} submissions in last 10m`}
          icon={Zap}
          gradient="from-amber-700 to-orange-900 shadow-orange-900/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={`flex flex-col rounded-xl border border-gray-700/80 ${CARD_BG} p-6 shadow-xl`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center text-lg font-bold uppercase tracking-wider">
              <Code className={`mr-2.5 h-5 w-5 ${ACCENT_COLOR}`} />
              Submissions by Language
            </h3>
            <span className="text-xs text-gray-400">
              {languageData.reduce((acc, curr) => acc + curr.value, 0)} total
            </span>
          </div>
          <div className="h-72 w-full">
            {languageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    innerRadius={50}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(Number(percent) * 100).toFixed(0)}%`
                    }
                    stroke="none"
                  >
                    {languageData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${String(value)} Submissions`, name]}
                    contentStyle={{
                      backgroundColor: '#182319',
                      border: `1px solid ${ACCENT_GREEN}`,
                      borderRadius: 8,
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
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                No language submission data recorded yet.
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col rounded-xl border border-gray-700/80 ${CARD_BG} p-6 shadow-xl`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center text-lg font-bold uppercase tracking-wider">
              <Activity className={`mr-2.5 h-5 w-5 ${ACCENT_COLOR}`} />
              Outcomes & Testcases
            </h3>
            <span className="text-xs text-gray-400">Platform Overview</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={outcomesData}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#182319',
                    border: `1px solid ${ACCENT_GREEN}`,
                    borderRadius: 8,
                    color: 'white',
                  }}
                  labelStyle={{ color: ACCENT_GREEN, fontWeight: 'bold' }}
                  formatter={(value, name) => [value ?? 0, name ?? 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {outcomesData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSection;
