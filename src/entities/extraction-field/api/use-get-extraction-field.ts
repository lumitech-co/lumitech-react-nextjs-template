import { useQuery } from '@tanstack/react-query';

import { extractionFieldsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useGetExtractionField = (id: string | null) =>
  useQuery({
    queryKey: [QueryKeys.EXTRACTION_FIELD_DETAIL, id],
    queryFn: () => extractionFieldsApi.getExtractionFieldById(id!),
    enabled: !!id,
  });
