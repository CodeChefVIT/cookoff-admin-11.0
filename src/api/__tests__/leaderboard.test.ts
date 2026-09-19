import { describe, expect, it, vi } from 'vitest';

import api from '../client';
import { getLeaderboard, normalizeLeaderboardUser } from '../users';

describe('normalizeLeaderboardUser', () => {
  it('maps raw backend leaderboard entry to frontend LeaderboardUser model', () => {
    const raw = {
      rank: 1,
      id: 'lead-1',
      name: 'Charlie',
      email: 'charlie@vit.ac.in',
      reg_no: '21BCE3000',
      score: 500,
      round_qualified: 3,
      total_runtime: 1.25,
      last_submission_time: '2026-09-18T12:00:00Z',
      total_submissions: 6,
      solved_count: 3,
      is_banned: false,
    };

    const normalized = normalizeLeaderboardUser(raw);

    expect(normalized).toEqual({
      Rank: 1,
      ID: 'lead-1',
      Name: 'Charlie',
      Email: 'charlie@vit.ac.in',
      RegNo: '21BCE3000',
      Score: 500,
      RoundQualified: 3,
      TotalRuntime: 1.25,
      LastSubmissionTime: '2026-09-18T12:00:00Z',
      TotalSubmissions: 6,
      SolvedCount: 3,
      IsBanned: false,
    });
  });

  it('preserves existing normalized LeaderboardUser objects', () => {
    const user = {
      Rank: 2,
      ID: 'lead-2',
      Name: 'Dave',
      Email: 'dave@vit.ac.in',
      RegNo: '21BCE4000',
      Score: 400,
      RoundQualified: 2,
      IsBanned: false,
    };

    expect(normalizeLeaderboardUser(user)).toEqual(user);
  });
});

describe('getLeaderboard', () => {
  it('unwraps backend envelope data array and maps scores', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        message: 'Leaderboard fetched successfully',
        data: [
          {
            rank: 1,
            id: 'u-top-1',
            name: 'Top Scorer',
            email: 'top@vit.ac.in',
            reg_no: '21BCE9999',
            score: 750,
            round_qualified: 3,
            is_banned: false,
          },
        ],
      },
    });

    const leaderboard = await getLeaderboard();
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]?.Rank).toBe(1);
    expect(leaderboard[0]?.ID).toBe('u-top-1');
    expect(leaderboard[0]?.Name).toBe('Top Scorer');
    expect(leaderboard[0]?.Score).toBe(750);
  });

  it('handles empty leaderboard array gracefully', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        message: 'Leaderboard fetched successfully',
        data: [],
      },
    });

    const leaderboard = await getLeaderboard();
    expect(leaderboard).toEqual([]);
  });
});
