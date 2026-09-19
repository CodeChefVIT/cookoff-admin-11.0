import { handleAPIError } from '@/lib/error';

import api from '.';

export interface RawAnalyticsResponse {
  active_users: number;
  total_users: number;
  banned_users: number;
  total_submissions: number;
  successful_submissions: number;
  failed_submissions: number;
  overall_pass_rate: number;
  recent_submissions_count: number;
  submission_rate_per_min: number;
  total_testcases_passed: number;
  total_testcases_failed: number;
  testcase_pass_rate: number;
  language_distribution: Record<string | number, number>;
}

export interface AnalyticsData {
  activeUsers: number;
  totalUsers: number;
  bannedUsers: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  failedSubmissions: number;
  overallPassRate: number;
  recentSubmissionsCount: number;
  submissionRatePerMin: number;
  totalTestcasesPassed: number;
  totalTestcasesFailed: number;
  testcasePassRate: number;
  languageDistribution: Record<string, number>;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export const LANGUAGE_MAP: Record<number, string> = {
  50: 'C (GCC)',
  54: 'C++ (GCC)',
  60: 'Go',
  62: 'Java',
  63: 'JavaScript (Node.js)',
  71: 'Python 3',
  73: 'Rust',
  74: 'TypeScript',
};

export function getLanguageName(id: number | string): string {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return LANGUAGE_MAP[numId] || `Language ${id}`;
}

export function normalizeAnalytics(raw: RawAnalyticsResponse): AnalyticsData {
  const languageDistribution: Record<string, number> = {};
  if (raw.language_distribution) {
    Object.entries(raw.language_distribution).forEach(([key, count]) => {
      const name = getLanguageName(key);
      languageDistribution[name] = (languageDistribution[name] || 0) + count;
    });
  }

  return {
    activeUsers: raw.active_users ?? 0,
    totalUsers: raw.total_users ?? 0,
    bannedUsers: raw.banned_users ?? 0,
    totalSubmissions: raw.total_submissions ?? 0,
    successfulSubmissions: raw.successful_submissions ?? 0,
    failedSubmissions: raw.failed_submissions ?? 0,
    overallPassRate: raw.overall_pass_rate ?? 0,
    recentSubmissionsCount: raw.recent_submissions_count ?? 0,
    submissionRatePerMin: raw.submission_rate_per_min ?? 0,
    totalTestcasesPassed: Number(raw.total_testcases_passed ?? 0),
    totalTestcasesFailed: Number(raw.total_testcases_failed ?? 0),
    testcasePassRate: raw.testcase_pass_rate ?? 0,
    languageDistribution,
  };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const response = await api.get<ApiResponse<RawAnalyticsResponse> | RawAnalyticsResponse>(
      '/admin/analytics'
    );

    if (response.data && 'data' in response.data && response.data.data) {
      return normalizeAnalytics(response.data.data);
    }

    if (response.data && 'total_users' in response.data) {
      return normalizeAnalytics(response.data as RawAnalyticsResponse);
    }

    return normalizeAnalytics({
      active_users: 0,
      total_users: 0,
      banned_users: 0,
      total_submissions: 0,
      successful_submissions: 0,
      failed_submissions: 0,
      overall_pass_rate: 0,
      recent_submissions_count: 0,
      submission_rate_per_min: 0,
      total_testcases_passed: 0,
      total_testcases_failed: 0,
      testcase_pass_rate: 0,
      language_distribution: {},
    });
  } catch (error) {
    throw handleAPIError(error);
  }
}
