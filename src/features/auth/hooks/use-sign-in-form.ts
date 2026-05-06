import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { SignInFormData, signInSchema } from '../lib';
import { useAuthStore } from '../model';

const DEFAULT_EMAIL = 'eleanor.hartwell@ironblue.co';

export const useSignInForm = () => {
  const signIn = useAuthStore(state => state.signIn);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onSubmit',
    defaultValues: { email: DEFAULT_EMAIL, password: '' },
  });

  const mutation = useMutation({
    mutationKey: [QueryKeys.AUTH_LOGIN],
    mutationFn: authApi.signIn,
    onSuccess: user => {
      signIn(user);
    },
    onError: () => {
      setAuthError('Invalid email or password');
    },
  });

  const clearAuthError = () => {
    if (authError) {
      setAuthError(null);
    }
  };

  const onSubmit = form.handleSubmit(async data => {
    setAuthError(null);
    await mutation.mutateAsync(data).catch(() => {});
  });

  const hasError = Boolean(
    authError || form.formState.errors.email || form.formState.errors.password,
  );

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    authError,
    clearAuthError,
    hasError,
  };
};
