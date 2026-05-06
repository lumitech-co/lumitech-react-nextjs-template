export type Stage =
  | 'queued'
  | 'screening'
  | 'retrieval'
  | 'parsing'
  | 'extraction'
  | 'review'
  | 'output'
  | 'done'
  | 'failed'
  | 'excluded'
  | 'pending_retrieval';

export type RunStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'cancelled'
  | 'error';

export interface IRunTotals {
  universe: number;
  screened: number;
  shortlisted: number;
  processed: number;
  needsReview: number;
  missing: number;
}

export interface IRunReExtraction {
  inProgress: boolean;
  startedAt: string;
  processed: number;
  total: number;
}

export interface IRun {
  status: RunStatus;
  startedAt: string;
  completedAt: string;
  progressPct: number;
  currentStage: Stage;
  totals: IRunTotals;
  overallConviction: number;
  reExtraction?: IRunReExtraction;
}

export interface ICompany {
  id: string;
  name: string;
  sector: string;
  country: string;
  weight: number;
  mcap: number;
  stage: Stage;
  conviction: number | null;
  manuallyAdded?: boolean;
}

export type ActivityTone = 'default' | 'success' | 'warning' | 'danger';

export interface IActivityItem {
  id: string;
  iconName: 'sparkle' | 'alert' | 'check' | 'upload' | 'play';
  text: string;
  time: string;
  tone?: ActivityTone;
}

export interface IArchivedRun {
  id: string;
  label: string;
  period: string;
  companies: number;
  conviction: number;
  flags: number;
}

export interface IWorkbookRow {
  company: string;
  ric: string;
  conviction: number;
}

export interface ISummaryRow {
  company: string;
  ric: string;
  total: number;
  conviction: number;
}
