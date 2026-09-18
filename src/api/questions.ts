import { handleAPIError } from '@/lib/error';

import { toSnake, fromSnakeAs } from '@/utils';

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

// --- API functions ---

export async function GetAllQuestions() {
  try {
    const response = await api.get<{ data: QuestionResponse[] }>('/question');
    return response.data.data.map(d => fromSnakeAs<QuestionResponse>(d));
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function CreateQuestion(data: CreateQuestionParams) {
  try {
    const response = await api.post<{ data: QuestionResponse }>('/question', toSnake(data));
    return fromSnakeAs<QuestionResponse>(response.data.data);
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
  try {
    const response = await api.get<{ data: QuestionResponse }>(`/question/${id}`);
    return fromSnakeAs<QuestionResponse>(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function UpdateQuestion(data: UpdateQuestionParams) {
  try {
    const { ID, ...body } = data;
    const response = await api.put<{ data: QuestionResponse }>(`/question/${ID}`, toSnake(body));
    return fromSnakeAs<QuestionResponse>(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}
