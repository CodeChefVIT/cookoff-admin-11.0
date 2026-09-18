import { handleAPIError } from '@/lib/error';

import api from '.';

export interface User {
  ID: string;
  Email: string;
  RegNo: string;
  Role: string;
  RoundQualified: number;
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

export interface GetUsersResponse {
  status: string;
  users: User[];
  next_cursor?: string;
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

export async function getUsers(limit?: number, cursor?: string) {
  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (cursor) params.cursor = cursor;

    const response = await api.get<GetUsersResponse>('/admin/users', {
      params,
    });

    return {
      ...response.data,
      next_cursor: response.data.next_cursor ?? undefined,
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function banUser(id: string) {
  try {
    const response = await api.post<{ status: string; message: string }>(`/admin/users/${id}/ban`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function unbanUser(id: string) {
  try {
    const response = await api.post<{ status: string; message: string }>(
      `/admin/users/${id}/unban`
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function upgradeUserToRound(id: string) {
  try {
    const response = await api.post<{ status: string; message: string }>(
      `/admin/users/${id}/upgrade`
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function getSubmissionsByUser(id: string) {
  try {
    const response = await api.get<{
      status: string;
      submissions: Submission[];
    }>(`/admin/users/${id}/submissions`);
    return response.data.submissions;
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
    const response = await api.get<AdminSessionResponse>('/admin/session');
    return response.data;
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

export async function SetUserRound({ user_ids }: SetUserRoundProps) {
  try {
    const results = await Promise.all(user_ids.map(id => upgradeUserToRound(id)));
    return results;
  } catch (error) {
    throw handleAPIError(error);
  }
}
