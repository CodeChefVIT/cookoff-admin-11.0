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

// --- snake_case ↔ PascalCase mappers ---

type SnakeTestcase = Record<string, unknown>;

function fromSnake(data: SnakeTestcase): TestCaseResponse {
  return {
    ID: data.id as string,
    QuestionID: data.question_id as string,
    ExpectedOutput: data.expected_output as string,
    Input: data.input as string,
    Memory: data.memory ? Number(data.memory) : 0,
    Runtime: data.runtime ? Number(data.runtime) : 0,
    Hidden: data.hidden as boolean,
  };
}

function toSnakeUpdate(data: TestCaseUpdateParams): SnakeTestcase {
  const out: SnakeTestcase = {};
  if (data.ExpectedOutput !== undefined) out.expected_output = data.ExpectedOutput;
  if (data.Input !== undefined) out.input = data.Input;
  if (data.Memory !== undefined) out.memory = data.Memory;
  if (data.Runtime !== undefined) out.runtime = data.Runtime;
  if (data.Hidden !== undefined) out.hidden = data.Hidden;
  if (data.QuestionID !== undefined) out.question_id = data.QuestionID;
  return out;
}

// ponytail: backend wraps all responses in { success, message, data }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(response: any): T {
  return response.data.data as T;
}

// --- API functions ---

export async function CreateTestCase(data: CreateTestCaseParams) {
  try {
    // CreateTestCaseParams is already snake_case — matches backend
    const response = await api.post<unknown>('/testcase', data);
    return fromSnake(unwrap<SnakeTestcase>(response));
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function getTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<unknown>(`/question/${questionID}/testcases`);
    const rows = unwrap<SnakeTestcase[]>(response);
    return rows.map(fromSnake);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function getPublicTestCasesByQuestion(questionID: string) {
  try {
    const response = await api.get<unknown>(`/question/${questionID}/testcases/public`);
    const rows = unwrap<SnakeTestcase[]>(response);
    return rows.map(fromSnake);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function DeleteTestCase(testCaseID: string) {
  try {
    const response = await api.delete<unknown>(`/testcase/${testCaseID}`);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function UpdateTestCase(testCaseID: string, data: TestCaseUpdateParams) {
  try {
    const response = await api.put<unknown>(`/testcase/${testCaseID}`, toSnakeUpdate(data));
    return fromSnake(unwrap<SnakeTestcase>(response));
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function GetAllTestCases() {
  try {
    const response = await api.get<unknown>('/testcases');
    const rows = unwrap<SnakeTestcase[]>(response);
    return rows.map(fromSnake);
  } catch (e) {
    throw handleAPIError(e);
  }
}
