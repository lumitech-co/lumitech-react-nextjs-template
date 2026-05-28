import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getApiBaseUrl } from './api-base-url';
import { tokenStorage } from './token';

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RefreshFn = () => Promise<string>;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(promise => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

let responseInterceptorId: number | null = null;

export const setupResponseInterceptor = (refreshFn: RefreshFn) => {
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  responseInterceptorId = api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        retried?: boolean;
      };

      if (error.response?.status !== 401 || originalRequest.retried) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      originalRequest.retried = true;
      isRefreshing = true;

      try {
        const newToken = await refreshFn();

        tokenStorage.set(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return await api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();

        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in?expired=1';
        }

        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    },
  );
};
