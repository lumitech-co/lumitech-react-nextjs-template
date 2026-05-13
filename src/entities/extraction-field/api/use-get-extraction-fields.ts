import { useQuery } from '@tanstack/react-query';

import { extractionFieldsApi, IExtractionFieldListParams } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useGetExtractionFields = (params?: IExtractionFieldListParams) =>
  useQuery({
    queryKey: [QueryKeys.EXTRACTION_FIELDS_LIST, params],
    queryFn: () => extractionFieldsApi.getExtractionFields(params),
  });
