export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface IRequestPasswordResetRequest {
  email: string;
}

export interface IResetPasswordRequest {
  resetPasswordToken: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthTokenResponse {
  message: string;
  data: {
    accessToken: string;
  };
}
