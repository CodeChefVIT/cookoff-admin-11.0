import { handleAPIError } from '@/lib/error';

import api from '.';

export interface User {
  ID: string;
  Email: string;
  RegNo: string;
  Role: string;
  RoundQualified: number;
  Score: number;
  Name: string;
  IsBanned: boolean;
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

export interface Testcase {
  ID: string;
  Input: string;
  ExpectedOutput: string;
  Hidden: boolean;
}

export type SubmissionWithResultsAndTestcases = {
  submission: Submission;
  results: (SubmissionResult & { testcase?: Testcase })[];
};

export type UserWithSubmissions = {
  user: User;
  submissions: SubmissionWithResultsAndTestcases[];
};

export async function getUserSubmissions(userID: string): Promise<UserWithSubmissions> {
  try {
    const response = await api.get<UserWithSubmissions>(`/admin/users/${userID}/submissions`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}
