import { ReportStatus, Sector } from 'shared/constants';

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

export type ExcludedReason =
  | 'excluded_sector'
  | 'below_threshold'
  | 'manual_override'
  | null;

export interface IReport {
  year: number;
  status: ReportStatus | string;
  page: number;
}

export interface ICompany {
  id: string;
  name: string;
  sector: Sector | string;
  country: string;
  weight: number;
  mcap: number;
  stage: Stage;
  conviction: number | null;
  manuallyAdded?: boolean;
  excluded: boolean;
  excludedReason: ExcludedReason;
  website: string;
  sourceListing: string;
  reports: IReport[];
  deleted?: boolean;
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

export interface IScreeningRules {
  excludedSectors: (Sector | string)[];
  minMcap: number;
  threshold: number;
}

export interface ITemplateField {
  id: string;
  label: string;
  section: string;
  synonyms: string[];
  hint: string;
  rules: string[];
}

export type ReviewFlag = 'outlier' | 'low_confidence' | 'missing';

export interface IReviewItem {
  id: string;
  company: string;
  field: string;
  year: number;
  value: string;
  currency: string;
  flag: ReviewFlag;
  reason: string;
  page: number | null;
  evidence: string;
}
