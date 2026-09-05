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

export interface QuestionsIdApiResponse {
  question: QuestionResponse[];
  status: string;
}

export interface QuestionsApiResponse {
  questions: QuestionResponse[];
  status: string;
}

export interface DeleteQuestionResponse {
  status: string;
  message: string;
}

export async function GetAllQuestions() {
  try {
    const response = await api.get<QuestionsApiResponse>('/question');
    return response.data.questions;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function CreateQuestion(data: CreateQuestionParams) {
  try {
    const response = await api.post<QuestionResponse>('/question', data);
    return response.data;
  } catch (e) {
    console.log(e);
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
  const response = await api.get<QuestionsIdApiResponse>(`/question/${id}`);
  return response.data;
}

export async function UpdateQuestion(data: UpdateQuestionParams) {
  try {
    const response = await api.put<QuestionResponse>(`/question/${data.ID}`, data);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}
