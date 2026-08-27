import { handleAPIError } from '@/lib/error';

import api from '.';

export interface TestCaseUpdateParams {
  ExpectedOutput?: string;
  Input?: string;
  Memory?: number;
  Runtime?: number;
  Hidden?: boolean;
  QuestionID?: string;
}

export interface TestCaseResponse {
  ID: string;
  ExpectedOutput: string;
  Memory: number;
  Input: string;
  Hidden: boolean;
  QuestionID: string;
  Runtime: number;
}

export interface GetTestCasesByQuestionResponse {
  status: string;
  test_cases: TestCaseResponse[];
  total_count: number;
}

export interface CreateTestCaseParams {
  expected_output: string;
  input: string;
  memory: number;
  runtime?: number | null;
  hidden: boolean;
  question_id: string;
}

export async function CreateTestCase(data: CreateTestCaseParams) {
  try {
    const response = await api.post<TestCaseResponse>('/testcase', data);
    return response.data;
  } catch (e) {
    console.error(e);
    throw handleAPIError(e);
  }
}

export async function getTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<GetTestCasesByQuestionResponse>(
      `/question/${questionID}/testcases`
    );
    return response.data.test_cases;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPublicTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<GetTestCasesByQuestionResponse>(
      `/question/${questionID}/testcases/public`
    );
    return response.data.test_cases;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function DeleteTestCase(testCaseID: string) {
  try {
    const response = await api.delete<{ message: string }>(`/testcase/${testCaseID}`);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function UpdateTestCase(testCaseID: string, data: TestCaseUpdateParams) {
  try {
    const response = await api.put<TestCaseResponse>(`/testcase/${testCaseID}`, data);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function GetAllTestCases() {
  try {
    const response = await api.get<{
      status: string;
      test_cases: TestCaseResponse[];
      total_count: number;
    }>('/testcases');
    return response.data.test_cases;
  } catch (e) {
    console.error(e);
    return [];
  }
}
