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
  Solutions?: number[][];
  SolutionPoints?: number[];
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
  Solutions?: number[][];
  SolutionPoints?: number[];
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
  Solutions?: number[][];
  SolutionPoints?: number[];
}

// The backend speaks snake_case inside a {success, message, data} envelope;
// these adapters keep the PascalCase shape the pages already use.
interface RawQuestion {
  id: string;
  description: string;
  title: string;
  type: string;
  input_format?: string[];
  buy_in?: string;
  reward?: string;
  points: number;
  round: number;
  constraints?: string[];
  output_format?: string[];
  sample_test_input?: string[];
  sample_test_output?: string[];
  explanation?: string[];
  bounty_active: boolean;
  scratch_blocks?: string[];
  solutions?: number[][];
  solution_points?: number[];
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DeleteQuestionResponse {
  success: boolean;
  message: string;
}

function toNumber(v?: string): number | undefined {
  if (v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function normalizeQuestion(q: RawQuestion): QuestionResponse {
  return {
    ID: q.id,
    Description: q.description,
    Title: q.title,
    Qtype: q.type,
    Isbountyactive: q.bounty_active,
    InputFormat: q.input_format ?? [],
    Points: q.points,
    Round: q.round,
    Constraints: q.constraints ?? null,
    OutputFormat: q.output_format ?? [],
    SampleTestInput: q.sample_test_input ?? [],
    SampleTestOutput: q.sample_test_output ?? [],
    Explanation: q.explanation ?? [],
    BuyIn: toNumber(q.buy_in),
    Reward: toNumber(q.reward),
    ScratchBlocks: q.scratch_blocks ?? [],
    Solutions: q.solutions ?? [],
    SolutionPoints: q.solution_points ?? [],
  };
}

function toRequest(d: CreateQuestionParams | UpdateQuestionParams) {
  return {
    description: d.Description,
    title: d.Title,
    type: d.Qtype,
    input_format: d.InputFormat,
    buy_in: d.BuyIn,
    reward: d.Reward,
    points: d.Points,
    round: d.Round,
    constraints: d.Constraints,
    output_format: d.OutputFormat,
    sample_test_input: d.SampleTestInput,
    sample_test_output: d.SampleTestOutput,
    explanation: d.Explanation,
    bounty_active: d.Isbountyactive ?? false,
    scratch_blocks: d.ScratchBlocks ?? [],
    solutions: d.Solutions ?? [],
    solution_points: d.SolutionPoints ?? [],
  };
}

export async function GetAllQuestions(): Promise<QuestionResponse[]> {
  try {
    const response = await api.get<Envelope<RawQuestion[] | null>>('/question');
    return (response.data.data ?? []).map(normalizeQuestion);
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function CreateQuestion(data: CreateQuestionParams) {
  try {
    const response = await api.post<Envelope<RawQuestion>>('/question', toRequest(data));
    return normalizeQuestion(response.data.data);
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

export async function GetQuestionById(id: string): Promise<QuestionResponse> {
  try {
    const response = await api.get<Envelope<RawQuestion>>(`/question/${id}`);
    return normalizeQuestion(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function UpdateQuestion(data: UpdateQuestionParams) {
  try {
    const response = await api.put<Envelope<RawQuestion>>(`/question/${data.ID}`, toRequest(data));
    return normalizeQuestion(response.data.data);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export interface VisualBlockPayload {
  question_id: string;
  content: string;
}

export interface VisualSolutionPayload {
  question_id: string;
  solution: string[];
  points: number;
}

export async function CreateVisualBlock(questionId: string, data: VisualBlockPayload) {
  try {
    const response = await api.post<Envelope<unknown>>(`/question/${questionId}/blocks`, data);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function CreateVisualSolution(questionId: string, data: VisualSolutionPayload) {
  try {
    const response = await api.post<Envelope<unknown>>(`/question/${questionId}/solutions`, data);
    return response.data;
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function DeleteVisualBlock(blockId: string) {
  try {
    return await api.delete<Envelope<unknown>>(`/question/blocks/${blockId}`);
  } catch (e) {
    throw handleAPIError(e);
  }
}

export async function DeleteVisualSolution(solutionId: string) {
  try {
    return await api.delete<Envelope<unknown>>(`/question/solutions/${solutionId}`);
  } catch (e) {
    throw handleAPIError(e);
  }
}
