import { IRequestPasswordResetRequest, ISignInRequest, IUser } from './types';

const SIGN_IN_DELAY_MS = 600;
const RESET_DELAY_MS = 400;
const MIN_PASSWORD_LENGTH = 4;

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const authApi = {
  signIn: async (data: ISignInRequest): Promise<IUser> => {
    await wait(SIGN_IN_DELAY_MS);

    if (!data.email || data.password.length < MIN_PASSWORD_LENGTH) {
      throw new Error('Invalid email or password');
    }

    return {
      id: 'u-1',
      email: data.email,
      name: 'Eleanor Hartwell',
      role: 'Analyst',
      initials: 'EH',
    };
  },

  requestPasswordReset: async (
    _data: IRequestPasswordResetRequest,
  ): Promise<void> => {
    await wait(RESET_DELAY_MS);
  },
};
