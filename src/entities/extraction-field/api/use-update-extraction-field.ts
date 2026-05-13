import { useMutation, useQueryClient } from '@tanstack/react-query';

import { extractionFieldsApi, IUpdateExtractionFieldRequest } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface IUseUpdateExtractionFieldParams {
  id: string;
  data: IUpdateExtractionFieldRequest;
}

export const useUpdateExtractionField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: IUseUpdateExtractionFieldParams) =>
      extractionFieldsApi.updateExtractionField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.EXTRACTION_FIELDS_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.EXTRACTION_FIELD_DETAIL],
      });
    },
  });
};
