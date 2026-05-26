import { useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetScreeningConfig, useUpdateScreeningConfig } from 'entities';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  DEFAULT_SCREENING,
  IScreeningConfigData,
  IScreeningRules,
} from 'shared/api';
import { GBP_PER_BILLION } from 'shared/lib';
import { useToast } from 'shared/ui';

import { useStartRun } from './use-start-run';

const mcapNumberSchema = z.number().min(0);
const mcapSchema = mcapNumberSchema.nullable();

const screeningRulesSchema = z
  .object({
    excludedSectors: z.array(z.string()),
    minMcap: mcapSchema,
    maxMcap: mcapSchema,
  })
  .refine(
    data =>
      data.maxMcap == null ||
      data.minMcap == null ||
      data.maxMcap >= data.minMcap,
    { message: 'Max market cap must be greater than min', path: ['maxMcap'] },
  );

type ScreeningRulesFormData = z.infer<typeof screeningRulesSchema>;

const emptyFormValues: ScreeningRulesFormData = {
  excludedSectors: [],
  minMcap: null,
  maxMcap: null,
};

const defaultFormValues: ScreeningRulesFormData = {
  excludedSectors: DEFAULT_SCREENING.excludedSectors.map(String),
  minMcap: DEFAULT_SCREENING.minMcap,
  maxMcap: DEFAULT_SCREENING.maxMcap,
};

const isUnconfiguredConfig = (data: IScreeningConfigData): boolean =>
  data.marketCapThresholdMinGbp === 0 && data.excludedSectors.length === 0;

const mapApiToForm = (
  data: IScreeningConfigData,
  maxMcap: number | null = null,
): ScreeningRulesFormData => {
  if (isUnconfiguredConfig(data)) {
    return defaultFormValues;
  }

  return {
    excludedSectors: data.excludedSectors,
    minMcap: data.marketCapThresholdMinGbp / GBP_PER_BILLION,
    maxMcap,
  };
};

export const useScreeningRules = () => {
  const toast = useToast();
  const { data: configResponse, isPending, isError } = useGetScreeningConfig();
  const updateMutation = useUpdateScreeningConfig();
  const { startRun, isStarting } = useStartRun();

  const form = useForm<ScreeningRulesFormData>({
    resolver: zodResolver(screeningRulesSchema),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (configResponse?.data && !form.formState.isDirty) {
      form.reset(mapApiToForm(configResponse.data, form.getValues('maxMcap')));
    }
  }, [configResponse, form]);

  useEffect(() => {
    if (isError) {
      toast('Failed to load screening rules', { tone: 'error' });
    }
  }, [isError, toast]);

  const toggle = useCallback(
    (sector: string) => {
      const current = form.getValues('excludedSectors');
      const next = current.includes(sector)
        ? current.filter(existing => existing !== sector)
        : [...current, sector];

      form.setValue('excludedSectors', next, { shouldDirty: true });
    },
    [form],
  );

  const onSave = form.handleSubmit(async (formData: ScreeningRulesFormData) => {
    if (formData.minMcap == null) {
      toast('Min market cap is required', { tone: 'error' });

      return;
    }

    try {
      const response = await updateMutation.mutateAsync({
        excludedSectors: formData.excludedSectors,
        marketCapThresholdMinGbp: formData.minMcap * GBP_PER_BILLION,
      });

      form.reset(mapApiToForm(response.data, formData.maxMcap));
      toast('Screening rules saved · applied on next run', { tone: 'success' });
    } catch {
      toast('Failed to save screening rules', { tone: 'error' });
    }
  });

  const onStartRun = useCallback(async () => {
    const values = form.getValues();

    if (values.minMcap == null) {
      toast('Min market cap is required', { tone: 'error' });

      return;
    }

    if (values.maxMcap != null && values.maxMcap < values.minMcap) {
      toast('Max market cap must be greater than min', { tone: 'error' });

      return;
    }

    const runRules: IScreeningRules = {
      excludedSectors: values.excludedSectors,
      minMcap: values.minMcap,
      maxMcap: values.maxMcap,
    };

    await startRun(runRules);
  }, [form, startRun, toast]);

  return {
    form,
    onSave,
    onStartRun,
    toggle,
    isSaving: updateMutation.isPending,
    isStarting,
    isLoading: isPending,
  };
};
