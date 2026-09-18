import { handleAPIError } from '@/lib/error';

import { toSnake, fromSnakeAs } from '@/utils';

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

export interface CreateTestCaseParams {
  expected_output: string;
  input: string;
  memory: number;
  runtime?: number | null;
  hidden: boolean;
  question_id: string;
}

// --- API functions ---

export async function CreateTestCase(data: CreateTestCaseParams) {
  try {
    const response = await api.post<{ data: TestCaseResponse }>('/testcase', data);
    return fromSnakeAs<TestCaseResponse>(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function getTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<{ data: TestCaseResponse[] }>(`/question/${questionID}/testcases`);
    return response.data.data.map(d => fromSnakeAs<TestCaseResponse>(d));
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function getPublicTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<{ data: TestCaseResponse[] }>(`/question/${questionID}/testcases/public`);
    return response.data.data.map(d => fromSnakeAs<TestCaseResponse>(d));
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function DeleteTestCase(testCaseID: string) {
  try {
    const response = await api.delete<{ data: TestCaseResponse }>(`/testcase/${testCaseID}`);
    return response.data.data as TestCaseResponse;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function UpdateTestCase(testCaseID: string, data: TestCaseUpdateParams) {
  try {
    const response = await api.put<{ data: TestCaseResponse }>(`/testcase/${testCaseID}`, toSnake(data));
    return fromSnakeAs<TestCaseResponse>(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function GetAllTestCases() {
  try {
    const response = await api.get<{ data: TestCaseResponse[] }>('/testcases');
    return response.data.data.map(d => fromSnakeAs<TestCaseResponse>(d));
  } catch (e) {
    throw handleAPIError(e);
  }
}
