'use client';

import { CheckIcon } from 'shared/icons';
import { Button } from 'shared/ui';

interface IResetSentPanelProps {
  email: string;
  onBack: () => void;
}

export const ResetSentPanel = ({ email, onBack }: IResetSentPanelProps) => (
  <div>
    <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-success-bg text-success">
      <CheckIcon className="h-[22px] w-[22px]" />
    </div>
    <h1>Check your email</h1>
    <p className="signin-sub">
      If <strong>{email}</strong> is registered, a reset link has been sent. The
      link expires in 1 hour.
    </p>
    <Button variant="secondary" onClick={onBack}>
      Back to Sign In
    </Button>
  </div>
);
