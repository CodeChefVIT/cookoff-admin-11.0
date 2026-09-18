import { handleAPIError } from '@/lib/error';

import api from '.';
import { getUsers } from './users';

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
  QuestionTitle?: string;
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

// The backend returns a flat snake_case submission list (no user, no
// per-testcase results) inside a {success, message, data} envelope, so the
// user is looked up from the users list.
interface RawUserSubmission {
  id: string;
  question_id: string;
  question_title: string;
  question_round: number;
  testcases_passed: number;
  testcases_failed: number;
  runtime: number;
  memory: number;
  language_id: number;
  status: string;
  description: string;
  source_code: string;
  submission_time: string;
}

export async function getUserSubmissions(userID: string): Promise<UserWithSubmissions> {
  try {
    const [response, users] = await Promise.all([
      api.get<{ data: RawUserSubmission[] | null }>(`/admin/users/${userID}/submissions`),
      getUsers(),
    ]);
    const found = users.users.find(u => u.ID === userID);
    const user: User = found
      ? { ...found, Score: found.Score ?? 0 }
      : {
          ID: userID,
          Email: '',
          RegNo: '',
          Role: '',
          RoundQualified: 0,
          Score: 0,
          Name: 'Unknown',
          IsBanned: false,
        };
    const submissions = (response.data.data ?? []).map(s => ({
      submission: {
        ID: s.id,
        QuestionID: s.question_id,
        QuestionTitle: s.question_title,
        TestcasesPassed: s.testcases_passed,
        TestcasesFailed: s.testcases_failed,
        Runtime: s.runtime,
        Memory: s.memory,
        SubmissionTime: s.submission_time,
        SourceCode: s.source_code,
        LanguageID: s.language_id,
        Description: s.description,
        UserID: userID,
        Status: s.status,
      },
      results: [],
    }));
    return { user, submissions };
  } catch (error) {
    throw handleAPIError(error);
  }
}
