'use client';

import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
  MailIcon,
} from 'shared/icons';
import { Button, Field, IconInput } from 'shared/ui';

import { useSignInForm } from '../../hooks';

interface ISignInFormProps {
  onForgotPassword: () => void;
  sessionExpired?: boolean;
  passwordReset?: boolean;
}

export const SignInForm = ({
  onForgotPassword,
  sessionExpired,
  passwordReset,
}: ISignInFormProps) => {
  const { form, onSubmit, isLoading, authError, clearAuthError, hasError } =
    useSignInForm();
  const { register } = form;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1>Sign in to your workspace</h1>
      <p className="signin-sub">
        Enter the credentials provided by your administrator.
      </p>

      {passwordReset && (
        <div
          className="mb-4 flex items-center gap-2 rounded-md px-3 py-2.5 text-[12.5px]"
          style={{
            background: 'var(--success-bg)',
            color: 'var(--success)',
          }}
        >
          <CheckIcon className="h-3.5 w-3.5 shrink-0" />
          <span>Password has been updated. Please sign in.</span>
        </div>
      )}

      {sessionExpired && (
        <div
          className="mb-4 flex items-center gap-2 rounded-md px-3 py-2.5 text-[12.5px]"
          style={{
            background: 'var(--warning-bg)',
            color: 'var(--warning)',
          }}
        >
          <ClockIcon className="h-3.5 w-3.5 shrink-0" />
          <span>
            Your session expired after 30 minutes of inactivity. Please sign in
            again.
          </span>
        </div>
      )}

      <div className="col gap-3">
        <Field label="Email">
          <IconInput
            icon={<MailIcon className="h-3.5 w-3.5" />}
            type="email"
            placeholder="you@ironblue.co"
            autoFocus
            hasError={hasError}
            {...register('email', { onChange: clearAuthError })}
          />
        </Field>

        <Field
          label="Password"
          labelAside={
            <button
              type="button"
              className="link text-xs"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          }
          error={authError ?? undefined}
        >
          <IconInput
            icon={<LockIcon className="h-3.5 w-3.5" />}
            type="password"
            placeholder="••••••••"
            hasError={hasError}
            {...register('password', { onChange: clearAuthError })}
          />
        </Field>

        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div
        className="mt-6 border-t pt-5 text-xs"
        style={{
          borderColor: 'var(--line)',
          color: 'var(--ink-500)',
        }}
      >
        Sessions expire after 30 minutes of inactivity. Iron Blue does not offer
        self-service registration — accounts are provisioned by the project
        team.
      </div>
    </form>
  );
};
