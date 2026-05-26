'use client';

import { ChevronLeftIcon } from 'shared/icons';
import { Button, Field, Input } from 'shared/ui';

import { useForgotPasswordForm } from '../../hooks';

interface IForgotPasswordFormProps {
  defaultEmail?: string;
  onBack: () => void;
  onSent: (email: string) => void;
}

export const ForgotPasswordForm = ({
  defaultEmail,
  onBack,
  onSent,
}: IForgotPasswordFormProps) => {
  const { form, onSubmit, isLoading } = useForgotPasswordForm({
    defaultEmail,
    onSent,
  });
  const { register, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate>
      <button
        type="button"
        className="link mb-3.5 inline-flex items-center gap-1 text-xs"
        onClick={onBack}
      >
        <ChevronLeftIcon className="h-3 w-3" /> Back to sign in
      </button>
      <h1>Reset your password</h1>
      <p className="signin-sub">
        Enter the email associated with your account and we&apos;ll send you a
        secure reset link.
      </p>

      <Field label="Email" error={formState.errors.email?.message}>
        <Input
          type="email"
          hasError={Boolean(formState.errors.email)}
          {...register('email')}
        />
      </Field>

      <Button
        variant="primary"
        size="lg"
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
};
