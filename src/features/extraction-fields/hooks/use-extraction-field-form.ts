import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetExtractionField, useUpdateExtractionField } from 'entities';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from 'shared/ui';

const extractionFieldSchema = z.object({
  aiHint: z.string(),
  validationRules: z.string(),
});

type ExtractionFieldFormData = z.infer<typeof extractionFieldSchema>;

export const useExtractionFieldForm = (selectedId: string | null) => {
  const { data: field, isLoading } = useGetExtractionField(selectedId);
  const updateMutation = useUpdateExtractionField();
  const toast = useToast();

  const [synonyms, setSynonyms] = useState<string[]>([]);

  const form = useForm<ExtractionFieldFormData>({
    resolver: zodResolver(extractionFieldSchema),
    defaultValues: { aiHint: '', validationRules: '' },
  });

  useEffect(() => {
    if (field) {
      form.reset({
        aiHint: field.aiHint ?? '',
        validationRules: field.fieldValidationRules
          .sort((ruleA, ruleB) => ruleA.displayOrder - ruleB.displayOrder)
          .map(rule => rule.ruleText)
          .join('\n'),
      });
      setSynonyms(field.fieldSynonyms.map(synonym => synonym.synonymText));
    }
  }, [field, form]);

  const addSynonym = (synonym: string) => {
    const trimmed = synonym.trim();

    if (!trimmed || synonyms.includes(trimmed)) {
      return;
    }

    setSynonyms(current => [...current, trimmed]);
  };

  const removeSynonym = (synonym: string) => {
    setSynonyms(current => current.filter(existing => existing !== synonym));
  };

  const onSubmit = form.handleSubmit(async (data: ExtractionFieldFormData) => {
    if (!selectedId) {
      return;
    }

    const validationRules = data.validationRules
      .split('\n')
      .map(rule => rule.trim())
      .filter(Boolean);

    await updateMutation.mutateAsync({
      id: selectedId,
      data: {
        aiHint: data.aiHint || null,
        synonyms,
        validationRules,
      },
    });

    toast('Saved \u00B7 applies to next extraction', { tone: 'success' });
  });

  return {
    form,
    field,
    isLoading,
    synonyms,
    addSynonym,
    removeSynonym,
    onSubmit,
    isSaving: updateMutation.isPending,
  };
};
