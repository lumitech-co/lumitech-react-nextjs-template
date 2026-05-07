import axios from 'axios';
import { env } from 'env';

import {
  IAuthTokenResponse,
  IRequestPasswordResetRequest,
  IResetPasswordRequest,
  ISignInRequest,
} from './types';

const authAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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
    data: IRequestPasswordResetRequest,
  ): Promise<void> => {
    await authAxios.post('/api/auth/forgot-password', data);
  },

  resetPassword: async (data: IResetPasswordRequest): Promise<void> => {
    await authAxios.post('/api/auth/reset-password', data);
  },
};
