import { describe, expect, it, vi } from 'vitest';

import api from '../client';
import { getUserSubmissions } from '../submissions';
import * as usersApi from '../users';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
  },
  api: {
    get: vi.fn(),
  },
}));

vi.mock('../users', () => ({
  getUsers: vi.fn(),
}));

describe('submissions API', () => {
  it('getUserSubmissions fetches and normalizes user submissions', async () => {
    const rawSub = {
      id: 'sub-1',
      user_id: 'u-1',
      question_id: 'q-1',
      question_title: 'Fibonacci',
      question_round: 1,
      language_id: 71,
      status: 'accepted',
      points_awarded: 100,
      testcases_passed: 5,
      testcases_failed: 0,
      runtime: 0.05,
      memory: 24.2,
      description: 'Done',
      source_code: 'print(1)',
      submission_time: '2026-09-18T12:00:00Z',
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: [rawSub],
      },
    });

    vi.mocked(usersApi.getUsers).mockResolvedValueOnce({
      status: 'success',
      users: [
        {
          ID: 'u-1',
          Name: 'John Doe',
          Email: 'john@example.com',
          RegNo: '21BCE0001',
          Role: 'participant',
          RoundQualified: 1,
          Score: 100,
          IsBanned: false,
        },
      ],
    });

    const res = await getUserSubmissions('u-1');
    expect(api.get).toHaveBeenCalledWith('/admin/users/u-1/submissions');
    expect(res.user.Name).toBe('John Doe');
    expect(res.submissions).toHaveLength(1);
    expect(res.submissions[0]!.submission.ID).toBe('sub-1');
    expect(res.submissions[0]!.submission.QuestionTitle).toBe('Fibonacci');
    expect(res.submissions[0]!.submission.Status).toBe('accepted');
    expect(res.submissions[0]!.submission.Runtime).toBe(0.05);
  });
});
