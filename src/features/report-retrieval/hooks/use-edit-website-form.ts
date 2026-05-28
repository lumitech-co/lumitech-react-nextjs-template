import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePatchRunCompany } from 'entities';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { IReportCompanyItem } from 'shared/api';
import { normalizeDomain } from 'shared/lib';
import { useToast } from 'shared/ui';

const editWebsiteSchema = z.object({
  domain: z.string().min(1, 'Website is required'),
});

type EditWebsiteFormData = z.infer<typeof editWebsiteSchema>;

interface IUseEditWebsiteFormParams {
  runId: string | null;
  company: IReportCompanyItem | null;
  onSuccess: () => void;
}

export const useEditWebsiteForm = ({
  runId,
  company,
  onSuccess,
}: IUseEditWebsiteFormParams) => {
  const patchMutation = usePatchRunCompany();
  const toast = useToast();

  const form = useForm<EditWebsiteFormData>({
    resolver: zodResolver(editWebsiteSchema),
    defaultValues: { domain: '' },
  });

  useEffect(() => {
    if (company) {
      const domain = company.companyProfile.domain ?? '';

      form.reset({
        domain: domain || '',
      });
    }
  }, [company, form]);

  const onSubmit = form.handleSubmit(async (data: EditWebsiteFormData) => {
    if (!runId || !company) {
      return;
    }

    try {
      await patchMutation.mutateAsync({
        runId,
        runCompanyId: company.id,
        data: { domain: normalizeDomain(data.domain) },
      });

      form.reset(data);
      toast('Website updated · will be reused on future runs', {
        tone: 'success',
      });
      onSuccess();
    } catch {
      toast('Failed to update website', { tone: 'error' });
    }
  });

  return {
    form,
    onSubmit,
    isSaving: patchMutation.isPending,
  };
};
