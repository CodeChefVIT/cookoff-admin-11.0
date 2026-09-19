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
