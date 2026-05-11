import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { ResetPasswordFormData, resetPasswordSchema } from '../lib';

interface IUseResetPasswordFormParams {
  resetPasswordToken: string;
}

export const useResetPasswordForm = ({
  resetPasswordToken,
}: IUseResetPasswordFormParams) => {
  const router = useRouter();
  const [resetError, setResetError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationKey: [QueryKeys.AUTH_RESET_PASSWORD],
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      router.replace('/sign-in?reset=1');
    },
    onError: () => {
      setResetError('Reset link is invalid or has expired');
    },
  });

  const clearResetError = () => {
    if (resetError) {
      setResetError(null);
    }
  };

  const onSubmit = form.handleSubmit(async data => {
    setResetError(null);
    await mutation
      .mutateAsync({
        resetPasswordToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      .catch(() => {});
  });

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    resetError,
    clearResetError,
  };
};
