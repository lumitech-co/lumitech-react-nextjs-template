'use client';

import { ReactNode, useState } from 'react';

import { ForgotPasswordForm } from '../forgot-password-form';
import { ResetSentPanel } from '../reset-sent-panel';
import { SignInForm } from '../sign-in-form';

type SignInView = 'signin' | 'forgot' | 'sent';

interface ISignInScreenProps {
  leftPanel: ReactNode;
  sessionExpired?: boolean;
  passwordReset?: boolean;
}

export const SignInScreen = ({
  leftPanel,
  sessionExpired,
  passwordReset,
}: ISignInScreenProps) => {
  const [view, setView] = useState<SignInView>('signin');
  const [resetEmail, setResetEmail] = useState<string>('');

  const showSignIn = () => setView('signin');
  const showForgot = () => setView('forgot');

  const handleSent = (email: string) => {
    setResetEmail(email);
    setView('sent');
  };

  return (
    <div className="signin-page">
      {leftPanel}
      <div className="signin-right">
        <div className="signin-form">
          {view === 'signin' && (
            <SignInForm
              onForgotPassword={showForgot}
              sessionExpired={sessionExpired}
              passwordReset={passwordReset}
            />
          )}
          {view === 'forgot' && (
            <ForgotPasswordForm onBack={showSignIn} onSent={handleSent} />
          )}
          {view === 'sent' && (
            <ResetSentPanel
              email={resetEmail}
              onBack={() => {
                setResetEmail('');
                showSignIn();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
