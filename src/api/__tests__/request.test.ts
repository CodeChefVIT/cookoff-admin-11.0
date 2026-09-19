import type { AxiosInstance } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { ApiError } from '../errors';
import { request } from '../request';

describe('request wrapper', () => {
  it('returns raw response data when no schema is provided', async () => {
    const mockClient = {
      request: vi.fn().mockResolvedValue({ data: { message: 'hello' } }),
    } as unknown as AxiosInstance;

    const result = await request({ url: '/test', client: mockClient });
    expect(result).toEqual({ message: 'hello' });
    expect(mockClient.request).toHaveBeenCalledWith({ url: '/test' });
  });

  it('parses and returns validated data when schema matches', async () => {
    const userSchema = z.object({
      id: z.string(),
      count: z.number(),
    });

    const mockClient = {
      request: vi.fn().mockResolvedValue({ data: { id: '123', count: 42 } }),
    } as unknown as AxiosInstance;

    const result = await request({
      url: '/user',
      schema: userSchema,
      client: mockClient,
    });

    expect(result).toEqual({ id: '123', count: 42 });
  });

  it('throws ApiError when response fails schema validation', async () => {
    const userSchema = z.object({
      id: z.string(),
      count: z.number(),
    });

    const mockClient = {
      request: vi.fn().mockResolvedValue({ data: { id: 123, count: 'not-a-number' } }),
    } as unknown as AxiosInstance;

    await expect(
      request({
        url: '/user',
        schema: userSchema,
        client: mockClient,
      })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
