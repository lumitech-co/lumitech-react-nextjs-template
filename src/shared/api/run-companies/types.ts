export enum CompanyTab {
  Shortlist = 'Shortlist',
  Excluded = 'Excluded',
  All = 'All',
  Deleted = 'Deleted',
}

export enum RunCompanyStatus {
  Passed = 'Passed',
  PendingRetrieval = 'Pending Retrieval',
  Excluded = 'Excluded',
  Deleted = 'Deleted',
}

export enum CompanyReportTab {
  All = 'All',
  NotRetrieved = 'NotRetrieved',
  NotPublished = 'NotPublished',
  ManualUploads = 'ManualUploads',
}

export type AnnualReportStatus =
  | 'Retrieved'
  | 'NotRetrieved'
  | 'ManuallyUploaded'
  | 'Unreadable';

export interface IRunCompanyProfile {
  id: string;
  name: string | null;
  ric: string | null;
  supersector: string | null;
  country: string | null;
  domain: string | null;
  status: 'Active' | 'LeftIndex';
}

export interface IScreeningResult {
  passedScreening: boolean;
  exclusionReason: string | null;
}

export interface IRunCompanyItem {
  id: string;
  marketCapGbp: string | null;
  isManuallyAdded: boolean;
  deletedAt: string | null;
  status: RunCompanyStatus;
  companyProfile: IRunCompanyProfile;
  screeningResult: IScreeningResult | null;
}

export interface IListRunCompaniesParams {
  tab?: CompanyTab;
  search?: string;
  cursor?: string;
  limit?: number;
  isManuallyAdded?: boolean;
  supersectors?: string[];
  countries?: string[];
  marketCapMin?: number;
  marketCapMax?: number;
  statuses?: RunCompanyStatus[];
}

export interface IListRunCompaniesResponse {
  data: IRunCompanyItem[];
  nextCursor: string | null;
  total: number;
}

export interface IRunCompanyCountsResponse {
  shortlist: number;
  excluded: number;
  all: number;
  deleted: number;
  pendingRetrieval: number;
}

export interface IRunCompanyFilterOptionsResponse {
  supersectors: string[];
  countries: string[];
  statuses: RunCompanyStatus[];
}

export interface ISearchCompanyParams {
  name: string;
  domain?: string;
}

export interface ISearchCompanyResult {
  name: string;
  ric: string | null;
  country: string | null;
  supersector: string | null;
  domain: string | null;
  marketCapGbp: string | null;
}

export interface ISearchCompanyResponse {
  data: ISearchCompanyResult;
}

export interface IAddRunCompanyRequest {
  name: string;
  domain: string;
  ric?: string;
  country?: string;
  supersector?: string;
  marketCapGbp?: number;
}

export interface IAddRunCompanyResponse {
  data: IRunCompanyItem;
}

export interface IMessageResponse {
  message: string;
}

export interface IAnnualReportItem {
  id: string | null;
  year: number;
  status: AnnualReportStatus | null;
  filePath: string | null;
}

export interface IReportCompanyProfile {
  id: string;
  name: string | null;
  ric: string | null;
  country: string | null;
  supersector: string | null;
  domain: string | null;
}

export interface IReportCompanyItem {
  id: string;
  isManuallyAdded: boolean;
  companyProfile: IReportCompanyProfile;
  reports: IAnnualReportItem[];
}

export interface IListRunReportsParams {
  tab?: CompanyReportTab;
  search?: string;
  cursor?: string;
  limit?: number;
  fromYear?: number;
  toYear?: number;
}

export interface IListRunReportsResponse {
  data: IReportCompanyItem[];
  nextCursor: string | null;
  total: number;
}

export interface IReportCountsResponse {
  all: number;
  notRetrieved: number;
  notPublished: number;
  manualUploads: number;
}

export interface IUploadReportResponse {
  data: IAnnualReportItem;
}

export interface IListPipelineCompaniesParams {
  cursor?: string;
  limit?: number;
}

export interface IListPipelineCompaniesResponse {
  data: IRunCompanyItem[];
  nextCursor: string | null;
  total: number;
}
