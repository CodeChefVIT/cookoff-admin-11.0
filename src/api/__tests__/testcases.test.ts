import { describe, expect, it, vi } from 'vitest';

import api from '../client';
import {
  CreateTestCase,
  DeleteTestCase,
  getPublicTestCasesByQuestion,
  getTestCasesByQuestion,
  UpdateTestCase,
  type CreateTestCaseParams,
  type TestCaseUpdateParams,
} from '../testcases';

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

describe('testcases API', () => {
  const rawTestcase = {
    id: 'tc-1',
    question_id: 'q-100',
    expected_output: '10',
    input: '5 5',
    memory: '128.5',
    runtime: '0.04',
    hidden: false,
  };

  it('CreateTestCase posts payload and returns normalized TestCaseResponse', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Testcase created',
        data: rawTestcase,
      },
    });

    const params: CreateTestCaseParams = {
      question_id: 'q-100',
      input: '5 5',
      expected_output: '10',
      memory: 128.5,
      runtime: 0.04,
      hidden: false,
    };

    const tc = await CreateTestCase(params);
    expect(api.post).toHaveBeenCalledWith('/testcase', params);
    expect(tc.ID).toBe('tc-1');
    expect(tc.Memory).toBe(128.5);
    expect(tc.Runtime).toBe(0.04);
    expect(tc.Hidden).toBe(false);
  });

  it('getTestCasesByQuestion fetches testcases for a question', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Testcases retrieved',
        data: [rawTestcase],
      },
    });

    const list = await getTestCasesByQuestion('q-100');
    expect(api.get).toHaveBeenCalledWith('/question/q-100/testcases');
    expect(list).toHaveLength(1);
    expect(list[0]!.QuestionID).toBe('q-100');
  });

  it('getPublicTestCasesByQuestion fetches public testcases for a question', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Public testcases retrieved',
        data: [rawTestcase],
      },
    });

    const list = await getPublicTestCasesByQuestion('q-100');
    expect(api.get).toHaveBeenCalledWith('/question/q-100/testcases/public');
    expect(list).toHaveLength(1);
  });

  it('UpdateTestCase maps update params to snake_case and sends PUT', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Testcase updated',
        data: { ...rawTestcase, expected_output: '20' },
      },
    });

    const updateParams: TestCaseUpdateParams = {
      ExpectedOutput: '20',
      Input: '10 10',
      Memory: 256,
      Runtime: 0.05,
      Hidden: true,
    };

    const res = await UpdateTestCase('tc-1', updateParams);
    expect(api.put).toHaveBeenCalledWith('/testcase/tc-1', {
      expected_output: '20',
      input: '10 10',
      memory: 256,
      runtime: 0.05,
      hidden: true,
      question_id: undefined,
    });
    expect(res.ExpectedOutput).toBe('20');
  });

  it('DeleteTestCase sends delete to /testcase/:id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({
      data: { message: 'Testcase deleted' },
    });

    const res = await DeleteTestCase('tc-1');
    expect(api.delete).toHaveBeenCalledWith('/testcase/tc-1');
    expect(res).toEqual({ message: 'Testcase deleted' });
  });
});
