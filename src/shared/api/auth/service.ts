import axios from 'axios';
import { env } from 'env';

import {
  IAuthTokenResponse,
  IRequestPasswordResetRequest,
  ISignInRequest,
} from './types';

const authAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const RESET_DELAY_MS = 400;

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const authApi = {
  signIn: async (data: ISignInRequest): Promise<IAuthTokenResponse> => {
    const response = await authAxios.post<IAuthTokenResponse>(
      '/api/auth/login',
      data,
    );

    return response.data;
  },

  refresh: async (): Promise<IAuthTokenResponse> => {
    const response =
      await authAxios.post<IAuthTokenResponse>('/api/auth/refresh');

    return response.data;
  },

  logout: async (): Promise<void> => {
    await authAxios.post('/api/auth/logout');
  },

  requestPasswordReset: async (
    _data: IRequestPasswordResetRequest,
  ): Promise<void> => {
    await wait(RESET_DELAY_MS);
  },
};
