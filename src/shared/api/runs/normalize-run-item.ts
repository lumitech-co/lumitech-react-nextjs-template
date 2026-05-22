import { IRunItem, RunItemStatus } from './types';

export const normalizeRunStatus = (status: string): RunItemStatus =>
  status.toLowerCase() as RunItemStatus;

export const normalizeRunItem = (run: IRunItem): IRunItem => ({
  ...run,
  status: normalizeRunStatus(run.status),
});
