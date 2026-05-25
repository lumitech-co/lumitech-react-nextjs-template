import { IActivityItemResponse } from '../runs/types';

export interface IListGlobalActivitiesParams {
  cursor?: string;
  limit?: number;
}

export interface IListGlobalActivitiesResponse {
  data: IActivityItemResponse[];
  nextCursor: string | null;
  total: number;
}
