export type FlagType = 'LowConfidence' | 'Outlier' | 'Missing';
export type FlagStatus =
  | 'Open'
  | 'Accepted'
  | 'ManualOverride'
  | 'ReExtractQueued';

export interface IReviewFlag {
  id: string;
  flagType: FlagType;
  flagStatus: FlagStatus;
  fieldName: string;
  fieldDisplayName: string;
  companyName: string;
  reportingYear: number;
  valueText: string | null;
  valueNumeric: number | null;
  originalCurrency: string | null;
  confidenceScore: number | null;
  sourcePage: number | null;
  evidenceText: string | null;
  createdAt: string;
}

export interface IReviewFlagDetail extends IReviewFlag {
  resolvedValue: number | null;
  pdfPath: string | null;
}

export interface IListReviewFlagsParams {
  runId: string;
  tab?: 'all' | 'low-confidence' | 'outlier' | 'missing';
  cursor?: string;
  limit?: number;
}

export interface IListReviewFlagsResponse {
  data: IReviewFlag[];
  nextCursor: string | null;
  totalCount: number;
}

export interface IManualInputRequest {
  resolvedValue: number;
}
