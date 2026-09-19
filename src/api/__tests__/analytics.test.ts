import { describe, expect, it, vi } from 'vitest';

import {
  getAnalytics,
  getLanguageName,
  LANGUAGE_MAP,
  normalizeAnalytics,
  type RawAnalyticsResponse,
} from '../analytics';
import api from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
  },
  api: {
    get: vi.fn(),
  },
}));

describe('getLanguageName', () => {
  it('maps known language IDs to their human-readable names', () => {
    expect(getLanguageName(71)).toBe('Python 3');
    expect(getLanguageName(54)).toBe('C++ (GCC)');
    expect(getLanguageName(63)).toBe('JavaScript (Node.js)');
    expect(getLanguageName(62)).toBe('Java');
  });

  it('handles string-formatted numbers correctly', () => {
    expect(getLanguageName('71')).toBe('Python 3');
    expect(getLanguageName('50')).toBe('C (GCC)');
  });

  it('falls back to "Language <id>" for unknown IDs', () => {
    expect(getLanguageName(999)).toBe('Language 999');
    expect(getLanguageName('unknown')).toBe('Language unknown');
  });
});

describe('normalizeAnalytics', () => {
  it('correctly maps raw snake_case backend fields to camelCase AnalyticsData', () => {
    const raw: RawAnalyticsResponse = {
      active_users: 42,
      total_users: 150,
      banned_users: 3,
      total_submissions: 500,
      successful_submissions: 350,
      failed_submissions: 150,
      overall_pass_rate: 70.0,
      recent_submissions_count: 25,
      submission_rate_per_min: 2.5,
      total_testcases_passed: 1200,
      total_testcases_failed: 300,
      testcase_pass_rate: 80.0,
      language_distribution: {
        '71': 200,
        '54': 150,
      },
    };

    const result = normalizeAnalytics(raw);

    expect(result.activeUsers).toBe(42);
    expect(result.totalUsers).toBe(150);
    expect(result.bannedUsers).toBe(3);
    expect(result.totalSubmissions).toBe(500);
    expect(result.successfulSubmissions).toBe(350);
    expect(result.failedSubmissions).toBe(150);
    expect(result.overallPassRate).toBe(70.0);
    expect(result.recentSubmissionsCount).toBe(25);
    expect(result.submissionRatePerMin).toBe(2.5);
    expect(result.totalTestcasesPassed).toBe(1200);
    expect(result.totalTestcasesFailed).toBe(300);
    expect(result.testcasePassRate).toBe(80.0);
    expect(result.languageDistribution).toEqual({
      'Python 3': 200,
      'C++ (GCC)': 150,
    });
  });

  it('handles empty or missing language distribution gracefully', () => {
    const raw = {
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
    } as unknown as RawAnalyticsResponse;

    const result = normalizeAnalytics(raw);
    expect(result.languageDistribution).toEqual({});
  });
});

describe('getAnalytics', () => {
  it('unwraps wrapped { data: RawAnalyticsResponse } payload', async () => {
    const rawData: RawAnalyticsResponse = {
      active_users: 10,
      total_users: 100,
      banned_users: 1,
      total_submissions: 40,
      successful_submissions: 30,
      failed_submissions: 10,
      overall_pass_rate: 75,
      recent_submissions_count: 5,
      submission_rate_per_min: 0.5,
      total_testcases_passed: 90,
      total_testcases_failed: 10,
      testcase_pass_rate: 90,
      language_distribution: { '71': 40 },
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        message: 'Analytics fetched successfully',
        data: rawData,
      },
    });

    const data = await getAnalytics();
    expect(api.get).toHaveBeenCalledWith('/admin/analytics');
    expect(data.totalUsers).toBe(100);
    expect(data.activeUsers).toBe(10);
    expect(data.languageDistribution['Python 3']).toBe(40);
  });

  it('handles direct RawAnalyticsResponse payload without wrapper', async () => {
    const rawData: RawAnalyticsResponse = {
      active_users: 5,
      total_users: 50,
      banned_users: 0,
      total_submissions: 20,
      successful_submissions: 15,
      failed_submissions: 5,
      overall_pass_rate: 75,
      recent_submissions_count: 2,
      submission_rate_per_min: 0.2,
      total_testcases_passed: 45,
      total_testcases_failed: 5,
      testcase_pass_rate: 90,
      language_distribution: { '54': 20 },
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: rawData,
    });

    const data = await getAnalytics();
    expect(data.totalUsers).toBe(50);
    expect(data.languageDistribution['C++ (GCC)']).toBe(20);
  });
});
