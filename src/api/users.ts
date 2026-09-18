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

export interface LeaderboardUser {
  ID: string;
  Email: string;
  RegNo: string;
  Role: string;
  RoundQualified: number;
  Name: string;
  IsBanned: boolean;
  Score?: number;
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
    const response = await api.post<ApiResponse<RawBackendUser> | { status: string; message: string }>(
      `/admin/users/${id}/ban`
    );
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
    const response = await api.post<ApiResponse<RawBackendUser> | { status: string; message: string }>(
      `/admin/users/${id}/unban`
    );
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
    const response = await api.post<ApiResponse<RawBackendUser> | { status: string; message: string }>(
      `/admin/users/${id}/upgrade`,
      payload ?? {}
    );
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
    const response = await api.get<ApiResponse<{ user_id: string; role: string }> | AdminSessionResponse>(
      '/admin/session'
    );
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

export async function getLeaderboard() {
  try {
    const response = await api.get<{
      status: string;
      leaderboard: LeaderboardUser[];
    }>('/admin/leaderboard');
    return response.data.leaderboard;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function SetUserRound({ user_ids, round }: SetUserRoundProps) {
  try {
    const results = await Promise.all(
      user_ids.map(id => upgradeUserToRound(id, round ? { round_qualified: round } : undefined))
    );
    return results;
  } catch (error) {
    throw handleAPIError(error);
  }
}
