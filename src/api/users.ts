import { handleAPIError } from '@/lib/error';

import api from '.';

export interface RawBackendUser {
  id: string;
  email: string;
  reg_no: string;
  role: string;
  round_qualified: number;
  balance?: number;
  score?: number;
  name: string;
  is_banned: boolean;
}

export interface User {
  ID: string;
  Email: string;
  RegNo: string;
  Role: string;
  RoundQualified: number;
  Balance?: number;
  Score?: number;
  Name: string;
  IsBanned: boolean;
}

export interface RawLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  email: string;
  reg_no: string;
  score: number;
  round_qualified: number;
  total_runtime?: number;
  last_submission_time?: string | null;
  total_submissions?: number;
  solved_count?: number;
  is_banned?: boolean;
}

export interface LeaderboardUser {
  Rank?: number;
  ID: string;
  Email: string;
  RegNo: string;
  Role?: string;
  RoundQualified: number;
  Name: string;
  IsBanned: boolean;
  Score: number;
  TotalRuntime?: number;
  LastSubmissionTime?: string | null;
  TotalSubmissions?: number;
  SolvedCount?: number;
}

export interface Submission {
  ID: string;
  QuestionID: string;
  TestcasesPassed?: number;
  TestcasesFailed?: number;
  Runtime?: number;
  SubmissionTime: string;
  SourceCode: string;
  LanguageID: number;
  Description?: string;
  Memory?: number;
  UserID?: string;
  Status?: string;
}

export interface SubmissionResult {
  ID: string;
  TestcaseID?: string;
  SubmissionID: string;
  Runtime?: number;
  Memory?: number;
  PointsAwarded: number;
  Status: string;
  Description?: string;
}

export interface SetUserRoundProps {
  user_ids: string[];
  round?: number;
}

export interface UpgradeAllUsersPayload {
  target_round?: number;
  round?: number;
}

export interface UpgradeUserPayload {
  round?: number;
  round_qualified?: number;
  role?: string;
}

export interface GetUsersResponse {
  status: string;
  users: User[];
  next_cursor?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export function normalizeLeaderboardUser(
  raw: RawLeaderboardEntry | LeaderboardUser
): LeaderboardUser {
  if ('ID' in raw && raw.ID && 'Score' in raw) {
    return raw as LeaderboardUser;
  }
  const r = raw as RawLeaderboardEntry;
  return {
    Rank: r.rank,
    ID: r.id,
    Name: r.name,
    Email: r.email,
    RegNo: r.reg_no,
    Score: r.score ?? 0,
    RoundQualified: r.round_qualified ?? 1,
    TotalRuntime: r.total_runtime,
    LastSubmissionTime: r.last_submission_time,
    TotalSubmissions: r.total_submissions,
    SolvedCount: r.solved_count,
    IsBanned: r.is_banned ?? false,
  };
}

export function normalizeUser(raw: RawBackendUser | User): User {
  if ('ID' in raw && raw.ID) {
    return raw as User;
  }
  const u = raw as RawBackendUser;
  return {
    ID: u.id,
    Email: u.email,
    RegNo: u.reg_no,
    Role: u.role,
    RoundQualified: u.round_qualified,
    Balance: u.balance,
    Score: u.score,
    Name: u.name,
    IsBanned: u.is_banned,
  };
}

export async function getUsers(limit?: number, cursor?: string): Promise<GetUsersResponse> {
  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (cursor) params.cursor = cursor;

    const response = await api.get<
      ApiResponse<RawBackendUser[]> | { status: string; users: User[]; next_cursor?: string }
    >('/admin/users', { params });

    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return {
        status: 'success',
        users: response.data.data.map(normalizeUser),
        next_cursor: undefined,
      };
    }

    if (response.data && 'users' in response.data && Array.isArray(response.data.users)) {
      return {
        status: response.data.status ?? 'success',
        users: response.data.users.map(normalizeUser),
        next_cursor: response.data.next_cursor ?? undefined,
      };
    }

    return {
      status: 'success',
      users: [],
      next_cursor: undefined,
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function banUser(id: string) {
  try {
    const response = await api.post<
      ApiResponse<RawBackendUser> | { status: string; message: string }
    >(`/admin/users/${id}/ban`);
    return {
      status: 'success',
      message: response.data?.message ?? 'User banned successfully',
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function unbanUser(id: string) {
  try {
    const response = await api.post<
      ApiResponse<RawBackendUser> | { status: string; message: string }
    >(`/admin/users/${id}/unban`);
    return {
      status: 'success',
      message: response.data?.message ?? 'User unbanned successfully',
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function upgradeUserToRound(id: string, payload?: UpgradeUserPayload) {
  try {
    const response = await api.post<
      ApiResponse<RawBackendUser> | { status: string; message: string }
    >(`/admin/users/${id}/upgrade`, payload ?? {});
    return {
      status: 'success',
      message: response.data?.message ?? 'User upgraded successfully',
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function getSubmissionsByUser(id: string) {
  try {
    const response = await api.get<
      ApiResponse<Submission[]> | { status: string; submissions: Submission[] }
    >(`/admin/users/${id}/submissions`);

    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return (response.data as { submissions: Submission[] }).submissions ?? [];
  } catch (error) {
    throw handleAPIError(error);
  }
}

export interface AdminSessionResponse {
  status: string;
  user_id: string;
  role: string;
}

export async function getAdminSession() {
  try {
    const response = await api.get<
      ApiResponse<{ user_id: string; role: string }> | AdminSessionResponse
    >('/admin/session');
    if (response.data && 'data' in response.data && response.data.data) {
      return {
        status: 'success',
        user_id: response.data.data.user_id,
        role: response.data.data.role,
      };
    }
    return response.data as AdminSessionResponse;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  try {
    const response = await api.get<
      ApiResponse<RawLeaderboardEntry[]> | { status: string; leaderboard: LeaderboardUser[] }
    >('/admin/leaderboard');

    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(normalizeLeaderboardUser);
    }

    if (
      response.data &&
      'leaderboard' in response.data &&
      Array.isArray(response.data.leaderboard)
    ) {
      return response.data.leaderboard.map(normalizeLeaderboardUser);
    }

    return [];
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function SetUserRound({ user_ids, round }: SetUserRoundProps) {
  try {
    const results = await Promise.all(
      user_ids.map(id =>
        upgradeUserToRound(id, round !== undefined ? { round_qualified: round } : undefined)
      )
    );
    return results;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function upgradeAllUsers(payload?: UpgradeAllUsersPayload | number) {
  try {
    const body: Record<string, unknown> = {};
    if (typeof payload === 'number') {
      body.target_round = payload;
    } else if (payload?.target_round !== undefined) {
      body.target_round = payload.target_round;
    } else if (payload?.round !== undefined) {
      body.target_round = payload.round;
    }

    const response = await api.post<
      ApiResponse<{ round_qualified: number; users_upgraded: number }> | { status: string; message: string; data?: unknown }
    >('/admin/users/upgrade-all', body);
    return {
      status: 'success',
      message: response.data?.message ?? 'All non-banned users upgraded successfully',
      data: response.data && 'data' in response.data ? response.data.data : undefined,
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}
