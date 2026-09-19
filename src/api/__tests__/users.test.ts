import { beforeAll, describe, expect, it, vi } from 'vitest';

import api from '../client';
import {
  banUser,
  getAdminSession,
  getUsers,
  logout,
  normalizeUser,
  unbanUser,
  upgradeUserToRound,
} from '../users';

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';

describe('normalizeUser', () => {
  it('maps snake_case backend user response to frontend User model', () => {
    const raw = {
      id: 'user-123',
      name: 'Alice',
      email: 'alice@vit.ac.in',
      reg_no: '21BCE1000',
      role: 'participant',
      round_qualified: 2,
      balance: 100,
      score: 250,
      is_banned: false,
    };

    const normalized = normalizeUser(raw);

    expect(normalized).toEqual({
      ID: 'user-123',
      Name: 'Alice',
      Email: 'alice@vit.ac.in',
      RegNo: '21BCE1000',
      Role: 'participant',
      RoundQualified: 2,
      Balance: 100,
      Score: 250,
      IsBanned: false,
    });
  });

  it('preserves existing User objects unchanged', () => {
    const user = {
      ID: 'user-456',
      Name: 'Bob',
      Email: 'bob@vit.ac.in',
      RegNo: '21BCE2000',
      Role: 'admin',
      RoundQualified: 3,
      IsBanned: false,
    };

    expect(normalizeUser(user)).toEqual(user);
  });
});

describe('users API endpoints', () => {
  it('getUsers unwraps backend envelope data', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        message: 'Users fetched successfully',
        data: [
          {
            id: 'u1',
            name: 'User One',
            email: 'one@vit.ac.in',
            reg_no: '21BCE0001',
            role: 'participant',
            round_qualified: 1,
            is_banned: false,
          },
        ],
      },
    });

    const res = await getUsers();
    expect(res.status).toBe('success');
    expect(res.users).toHaveLength(1);
    expect(res.users[0]?.ID).toBe('u1');
    expect(res.users[0]?.Name).toBe('User One');
    expect(res.users[0]?.RegNo).toBe('21BCE0001');
  });

  it('banUser and unbanUser handle response envelopes', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        message: 'User banned successfully',
        data: { id: 'u1', is_banned: true },
      },
    });

    const banRes = await banUser('u1');
    expect(banRes.status).toBe('success');
    expect(banRes.message).toBe('User banned successfully');

    vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        message: 'User unbanned successfully',
        data: { id: 'u1', is_banned: false },
      },
    });

    const unbanRes = await unbanUser('u1');
    expect(unbanRes.status).toBe('success');
    expect(unbanRes.message).toBe('User unbanned successfully');
  });

  it('upgradeUserToRound sends payload and unwraps response', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        message: 'User upgraded successfully',
        data: { id: 'u1', round_qualified: 2 },
      },
    });

    const res = await upgradeUserToRound('u1', { round_qualified: 2 });
    expect(postSpy).toHaveBeenCalledWith('/admin/users/u1/upgrade', { round_qualified: 2 });
    expect(res.status).toBe('success');
  });

  it('getAdminSession unwraps session object from data wrapper', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        message: 'Admin session validated',
        data: {
          user_id: 'admin-uuid',
          role: 'admin',
        },
      },
    });

    const session = await getAdminSession();
    expect(session.status).toBe('success');
    expect(session.user_id).toBe('admin-uuid');
    expect(session.role).toBe('admin');
  });
});
