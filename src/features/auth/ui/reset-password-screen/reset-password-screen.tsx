'use client';

import { ReactNode } from 'react';

import { ResetPasswordForm } from '../reset-password-form';

interface IResetPasswordScreenProps {
  leftPanel: ReactNode;
  resetPasswordToken: string;
}

export const ResetPasswordScreen = ({
  leftPanel,
  resetPasswordToken,
}: IResetPasswordScreenProps) => (
  <div className="signin-page">
    {leftPanel}
    <div className="signin-right">
      <div className="signin-form">
        <ResetPasswordForm resetPasswordToken={resetPasswordToken} />
      </div>
    </div>
  </div>
);
