import axios from 'axios';

import { ApiError, toApiError } from '@/api/errors';

import { toSentenceCase } from './utils';

export function handleAPIError(err: unknown): ApiError | Error {
  console.error('[API Error]', err);

  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) {
      return new ApiError({
        message: toSentenceCase(data.error),
        status: err.response?.status,
      });
    }
  }

  return toApiError(err);
}
