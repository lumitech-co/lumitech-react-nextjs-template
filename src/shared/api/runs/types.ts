export type RunItemStatus =
  | 'in_progress'
  | 'shortlist_pending'
  | 'shortlist_confirmed'
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
}

export interface IGetLatestRunResponse {
  message: string;
  data: IRunItem | null;
}

export const isActiveRunStatus = (status: RunItemStatus): boolean =>
  status === 'in_progress' ||
  status === 'shortlist_pending' ||
  status === 'shortlist_confirmed';
