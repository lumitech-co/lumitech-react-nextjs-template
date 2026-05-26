'use client';

import { AlertIcon, ChevronLeftIcon, LockIcon } from 'shared/icons';
import { Button, Field, IconInput } from 'shared/ui';

import { useResetPasswordForm } from '../../hooks';

interface IResetPasswordFormProps {
  resetPasswordToken: string;
}

export const ResetPasswordForm = ({
  resetPasswordToken,
}: IResetPasswordFormProps) => {
  const { form, onSubmit, isLoading, resetError, clearResetError } =
    useResetPasswordForm({ resetPasswordToken });
  const { register, formState } = form;

  const hasError = Boolean(
    resetError || formState.errors.password || formState.errors.confirmPassword,
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <a
        href="/sign-in"
        className="link mb-3.5 inline-flex items-center gap-1 text-xs"
      >
        <ChevronLeftIcon className="h-3 w-3" /> Back to sign in
      </a>
      <h1>Set new password</h1>
      <p className="signin-sub">
        Enter your new password below. It must be at least 8 characters and
        include uppercase, lowercase, a number, and a special character.
      </p>

      {resetError && (
        <div
          className="mb-4 flex items-center gap-2 rounded-md px-3 py-2.5 text-[12.5px]"
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
          }}
        >
          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{resetError}</span>
        </div>
      )}

      <div className="col gap-12">
        <Field label="New password" error={formState.errors.password?.message}>
          <IconInput
            icon={<LockIcon className="h-3.5 w-3.5" />}
            type="password"
            placeholder="••••••••"
            hasError={hasError}
            {...register('password', { onChange: clearResetError })}
          />
        </Field>

        <Field
          label="Confirm password"
          error={formState.errors.confirmPassword?.message}
        >
          <IconInput
            icon={<LockIcon className="h-3.5 w-3.5" />}
            type="password"
            placeholder="••••••••"
            hasError={Boolean(formState.errors.confirmPassword)}
            {...register('confirmPassword', { onChange: clearResetError })}
          />
        </Field>

        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </form>
  );
};
