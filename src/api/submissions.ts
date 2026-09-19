import { handleAPIError } from '@/lib/error';

import api from '.';
import { getUsers } from './users';

export interface Submission {
  ID: string;
  QuestionID: string;
  QuestionTitle?: string;
  QuestionRound?: number;
  TestcasesPassed?: number;
  TestcasesFailed?: number;
  Runtime?: number;
  SubmissionTime: string;
  SourceCode: string;
  LanguageID: number;
  Description?: string;
  Memory?: number;
  Status?: string;
}

export interface SubmissionUser {
  Name: string;
  Email: string;
  RegNo: string;
  Role: string;
  Score: number;
  RoundQualified: number;
}

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

export async function getUserSubmissions(
  userID: string,
): Promise<{ user: SubmissionUser; submissions: Submission[] }> {
  try {
    const [response, users] = await Promise.all([
      api.get<{ data: RawUserSubmission[] | null }>(
        `/admin/users/${userID}/submissions`,
      ),
      getUsers(),
    ]);
    const found = users.users.find(u => u.ID === userID);
    const user: SubmissionUser = found
      ? {
          Name: found.Name,
          Email: found.Email,
          RegNo: found.RegNo,
          Role: found.Role,
          Score: found.Score ?? 0,
          RoundQualified: found.RoundQualified,
        }
      : {
          Name: 'Unknown',
          Email: '',
          RegNo: '',
          Role: '',
          Score: 0,
          RoundQualified: 0,
        };
    const submissions = (response.data.data ?? []).map(s => ({
      ID: s.id,
      QuestionID: s.question_id,
      QuestionTitle: s.question_title,
      QuestionRound: s.question_round,
      TestcasesPassed: s.testcases_passed,
      TestcasesFailed: s.testcases_failed,
      Runtime: s.runtime,
      Memory: s.memory,
      SubmissionTime: s.submission_time,
      SourceCode: s.source_code,
      LanguageID: s.language_id,
      Description: s.description,
      Status: s.status,
    }));
    return { user, submissions };
  } catch (error) {
    throw handleAPIError(error);
  }
}
