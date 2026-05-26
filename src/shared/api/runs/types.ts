export type RunItemStatus =
  | 'initializing'
  | 'screening'
  | 'retrieval'
  | 'parsing'
  | 'extraction'
  | 'review'
  | 'completed'
  | 'cancelled';

export interface IRunItem {
  id: string;
  label: string | null;
  status: RunItemStatus;
  startedAt: string;
  completedAt: string | null;
  overallConvictionPct: string | null;
  companyCount: number;
  flaggedCount: number;
}

export interface IGetLatestRunResponse {
  message: string;
  data: IRunItem | null;
}

export interface IRunStats {
  screening: number;
  retrieval: number;
  parsing: number;
  extraction: number;
  review: number;
  output: number;
  shortlisted: number;
  processedDone: number;
  needsReviewFlagCount: number;
  avgConvictionPct: string | null;
}

export interface IGetRunStatsResponse {
  message: string;
  data: IRunStats;
}

export type ActivityType =
  | 'run_started'
  | 'report_uploaded'
  | 'extraction_completed'
  | 'flag_raised'
  | 'workbook_generated';

export interface IActivityItemResponse {
  id: string;
  type: ActivityType;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface IListActivitiesParams {
  cursor?: string;
  limit?: number;
}

export interface IListActivitiesResponse {
  data: IActivityItemResponse[];
  nextCursor: string | null;
  total: number;
}

export interface ICreateRunRequest {
  excludedSectors: string[];
  marketCapThresholdMinGbp: number;
  marketCapThresholdMaxGbp: number | null;
}

export interface ICreateRunResponse {
  data: IRunItem;
}

export interface IListRunsParams {
  cursor?: string;
  limit?: number;
}

export interface IListRunsResponse {
  data: IRunItem[];
  nextCursor: string | null;
  total: number;
}

export const isActiveRunStatus = (status: RunItemStatus): boolean =>
  status !== 'completed' && status !== 'cancelled';

export const isCompletedRunStatus = (status: RunItemStatus): boolean =>
  status === 'completed';
