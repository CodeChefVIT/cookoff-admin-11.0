import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_TIMEOUT_MS } from '@/constants';
import { env } from '@/env';

import { toApiError } from './errors';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
  });

  client.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      config.withCredentials = true;

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    response => response,
    async (err: AxiosError) => {
      const originalRequest = err.config as CustomAxiosRequestConfig | undefined;

      // On 401, try to refresh the session once and replay the request. Reject
      // on refresh failure so the caller (useAuth) decides how to log out.
      if (originalRequest && err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (originalRequest.url?.includes('/refreshToken')) {
          return Promise.reject(toApiError(err));
        }

        try {
          await client.post('/refreshToken', {}, { withCredentials: true });
          return client(originalRequest);
        } catch {
          return Promise.reject(toApiError(err));
        }
      }

      return Promise.reject(toApiError(err));
    }
  );

  return client;
}

export const api = createApiClient(env.NEXT_PUBLIC_API_URL);

export default api;
