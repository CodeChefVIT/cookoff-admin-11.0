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

export interface CreateTestCaseParams {
  expected_output: string;
  input: string;
  memory: number;
  runtime?: number | null;
  hidden: boolean;
  question_id: string;
}

// The backend returns snake_case testcases (memory/runtime as numeric
// strings) inside a {success, message, data} envelope.
interface RawTestCase {
  id: string;
  question_id: string;
  expected_output: string;
  input: string;
  memory: string;
  runtime: string;
  hidden: boolean;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function normalizeTestCase(t: RawTestCase): TestCaseResponse {
  return {
    ID: t.id,
    QuestionID: t.question_id,
    ExpectedOutput: t.expected_output,
    Input: t.input,
    Memory: Number(t.memory) || 0,
    Runtime: Number(t.runtime) || 0,
    Hidden: t.hidden,
  };
}

function toUpdateRequest(d: TestCaseUpdateParams) {
  return {
    expected_output: d.ExpectedOutput,
    input: d.Input,
    memory: d.Memory,
    runtime: d.Runtime,
    hidden: d.Hidden,
    question_id: d.QuestionID,
  };
}

export async function CreateTestCase(data: CreateTestCaseParams) {
  try {
    const response = await api.post<Envelope<RawTestCase>>('/testcase', data);
    return normalizeTestCase(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

async function listTestCases(path: string) {
  try {
    const response = await api.get<Envelope<RawTestCase[] | null>>(path);
    return (response.data.data ?? []).map(normalizeTestCase);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export function getTestCasesByQuestion(questionID: string) {
  return listTestCases(`/question/${questionID}/testcases`);
}

export function getPublicTestCasesByQuestion(questionID: string) {
  return listTestCases(`/question/${questionID}/testcases/public`);
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
    const response = await api.put<Envelope<RawTestCase>>(
      `/testcase/${testCaseID}`,
      toUpdateRequest(data)
    );
    return normalizeTestCase(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}
