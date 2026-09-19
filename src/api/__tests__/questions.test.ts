import { describe, expect, it, vi } from 'vitest';

import api from '../client';
import {
  CreateQuestion,
  DeleteQuestion,
  GetAllQuestions,
  GetQuestionById,
  UpdateQuestion,
  type CreateQuestionParams,
  type UpdateQuestionParams,
} from '../questions';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('questions API', () => {
  const sampleRaw = {
    id: 'q-123',
    title: 'Two Sum',
    description: 'Find two numbers',
    type: 'code',
    bounty_active: false,
    input_format: ['n', 'array'],
    points: 100,
    round: 1,
    constraints: ['n <= 10^5'],
    output_format: ['indices'],
    sample_test_input: ['4\n2 7 11 15'],
    sample_test_output: ['0 1'],
    explanation: ['2 + 7 = 9'],
    buy_in: '10.5',
    reward: '50.0',
  };

  it('GetAllQuestions retrieves and normalizes question list', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Questions retrieved',
        data: [sampleRaw],
      },
    });

    const result = await GetAllQuestions();
    expect(api.get).toHaveBeenCalledWith('/question');
    expect(result).toHaveLength(1);
    expect(result[0]!.ID).toBe('q-123');
    expect(result[0]!.Title).toBe('Two Sum');
    expect(result[0]!.Points).toBe(100);
    expect(result[0]!.BuyIn).toBe(10.5);
    expect(result[0]!.Reward).toBe(50);
  });

  it('GetQuestionById retrieves single question by ID', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Question retrieved',
        data: sampleRaw,
      },
    });

    const q = await GetQuestionById('q-123');
    expect(api.get).toHaveBeenCalledWith('/question/q-123');
    expect(q.ID).toBe('q-123');
    expect(q.Title).toBe('Two Sum');
    expect(q.Constraints).toEqual(['n <= 10^5']);
  });

  it('CreateQuestion posts snake_case params and normalizes response', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Question created',
        data: sampleRaw,
      },
    });

    const params: CreateQuestionParams = {
      Title: 'Two Sum',
      Description: 'Find two numbers',
      Qtype: 'code',
      Points: 100,
      Round: 1,
      InputFormat: ['n'],
      OutputFormat: ['indices'],
      Constraints: ['n <= 10^5'],
      SampleTestInput: ['4'],
      SampleTestOutput: ['0 1'],
      Explanation: ['Test'],
      BuyIn: 10.5,
      Reward: 50.0,
      Isbountyactive: false,
    };

    const res = await CreateQuestion(params);
    expect(api.post).toHaveBeenCalledWith(
      '/question',
      expect.objectContaining({
        title: 'Two Sum',
        type: 'code',
        points: 100,
        buy_in: 10.5,
        reward: 50.0,
      })
    );
    expect(res.ID).toBe('q-123');
  });

  it('UpdateQuestion puts snake_case params to /question/:id', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Question updated',
        data: sampleRaw,
      },
    });

    const updateParams: UpdateQuestionParams = {
      ID: 'q-123',
      Title: 'Two Sum Updated',
      Description: 'Updated desc',
      Qtype: 'code',
      Points: 150,
      Round: 1,
      InputFormat: ['n'],
      OutputFormat: ['indices'],
      Constraints: ['none'],
      SampleTestInput: ['4'],
      SampleTestOutput: ['0 1'],
      Explanation: ['Test'],
      Isbountyactive: false,
    };

    const res = await UpdateQuestion(updateParams);
    expect(api.put).toHaveBeenCalledWith(
      '/question/q-123',
      expect.objectContaining({
        title: 'Two Sum Updated',
        points: 150,
      })
    );
    expect(res.ID).toBe('q-123');
  });

  it('DeleteQuestion sends delete to /question/:id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({
      data: { status: 'success', message: 'Question deleted' },
    });

    const res = await DeleteQuestion('q-123');
    expect(api.delete).toHaveBeenCalledWith('/question/q-123');
    expect(res).toEqual({ status: 'success', message: 'Question deleted' });
  });
});
