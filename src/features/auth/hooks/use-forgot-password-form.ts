import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { ForgotPasswordFormData, forgotPasswordSchema } from '../lib';

interface IUseForgotPasswordFormParams {
  defaultEmail?: string;
  onSent: (email: string) => void;
}

export const useForgotPasswordForm = ({
  defaultEmail = '',
  onSent,
}: IUseForgotPasswordFormParams) => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    defaultValues: { email: defaultEmail },
  });

  const mutation = useMutation({
    mutationKey: [QueryKeys.AUTH_RESET_PASSWORD],
    mutationFn: authApi.requestPasswordReset,
    onSuccess: (_, variables) => {
      onSent(variables.email);
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    await mutation.mutateAsync(data).catch(() => {});
  });

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  };
};
