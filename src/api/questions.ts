import { handleAPIError } from '@/lib/error';

import api from '.';

export interface CreateQuestionParams {
  ID?: string;
  Description: string;
  Title: string;
  Qtype: string;
  Isbountyactive?: boolean;
  InputFormat: string[];
  Points: number;
  Round: number;
  Constraints: string[];
  OutputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
  ScratchBlocks?: string[];
  BuyIn?: number;
  Reward?: number;
}

export interface UpdateQuestionParams {
  ID: string;
  Description: string;
  Title: string;
  Qtype: string;
  Isbountyactive: boolean;
  InputFormat: string[];
  Points: number;
  Round: number;
  Constraints: string[];
  OutputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
  ScratchBlocks?: string[];
  BuyIn?: number;
  Reward?: number;
}

export interface QuestionResponse {
  ID: string;
  Description: string;
  Title: string;
  Qtype: string;
  Isbountyactive: boolean;
  InputFormat: string[];
  Points: number;
  Round: number;
  Constraints: string[] | null;
  OutputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
  ScratchBlocks?: string[];
  BuyIn?: number;
  Reward?: number;
}

export interface DeleteQuestionResponse {
  status: string;
  message: string;
}

// --- snake_case ↔ PascalCase mappers ---

type SnakeQuestion = Record<string, unknown>;

function toSnake(data: CreateQuestionParams | UpdateQuestionParams): SnakeQuestion {
  return {
    title: data.Title,
    description: data.Description,
    type: data.Qtype,
    input_format: data.InputFormat,
    buy_in: data.BuyIn ?? null,
    reward: data.Reward ?? null,
    points: data.Points,
    round: data.Round,
    constraints: data.Constraints,
    output_format: data.OutputFormat,
    sample_test_input: data.SampleTestInput,
    sample_test_output: data.SampleTestOutput,
    explanation: data.Explanation,
    bounty_active: 'Isbountyactive' in data ? data.Isbountyactive : false,
  };
}

function fromSnake(data: SnakeQuestion): QuestionResponse {
  return {
    ID: data.id as string,
    Title: data.title as string,
    Description: data.description as string,
    Qtype: data.type as string,
    Isbountyactive: data.bounty_active as boolean,
    InputFormat: (data.input_format as string[]) ?? [],
    Points: data.points as number,
    Round: data.round as number,
    Constraints: (data.constraints as string[]) ?? null,
    OutputFormat: (data.output_format as string[]) ?? [],
    SampleTestInput: (data.sample_test_input as string[]) ?? [],
    SampleTestOutput: (data.sample_test_output as string[]) ?? [],
    Explanation: (data.explanation as string[]) ?? [],
    BuyIn: data.buy_in ? Number(data.buy_in) : undefined,
    Reward: data.reward ? Number(data.reward) : undefined,
  };
}

// ponytail: backend wraps all responses in { success, message, data }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(response: any): T {
  return response.data.data as T;
}

// --- API functions ---

export async function GetAllQuestions() {
  try {
    const response = await api.get<unknown>('/question');
    const rows = unwrap<SnakeQuestion[]>(response);
    return rows.map(fromSnake);
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function CreateQuestion(data: CreateQuestionParams) {
  try {
    const response = await api.post<unknown>('/question', toSnake(data));
    return fromSnake(unwrap<SnakeQuestion>(response));
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function DeleteQuestion(id: string) {
  try {
    const response = await api.delete<DeleteQuestionResponse>(`/question/${id}`);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function GetQuestionById(id: string) {
  const response = await api.get<unknown>(`/question/${id}`);
  return fromSnake(unwrap<SnakeQuestion>(response));
}

export async function UpdateQuestion(data: UpdateQuestionParams) {
  try {
    const { ID, ...body } = data;
    const response = await api.put<unknown>(`/question/${ID}`, toSnake(data));
    return fromSnake(unwrap<SnakeQuestion>(response));
  } catch (e) {
    throw handleAPIError(e);
  }
}
