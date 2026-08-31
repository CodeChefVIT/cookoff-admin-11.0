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

export interface GetUsersResponse {
  status: string;
  users: User[];
  next_cursor?: string;
}

export async function getUsers(limit?: number, cursor?: string) {
  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (cursor) params.cursor = cursor;

    const response = await api.get<GetUsersResponse>('/admin/users', {
      params,
    });

    const data = response.data;
    return {
      ...data,
      next_cursor: data.next_cursor ?? undefined,
    };
  } catch (error) {
    console.error(error);
    return { status: 'error', users: [], next_cursor: undefined };
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
    const results = await Promise.all(user_ids.map(id => upgradeUserToRound(id)));
    return results;
  } catch (error) {
    throw handleAPIError(error);
  }
}
