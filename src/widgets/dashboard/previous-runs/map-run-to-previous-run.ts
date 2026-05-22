import { IArchivedRun, IRunItem } from 'shared/api';
import { formatRunPeriod } from 'shared/lib';

export const mapRunToPreviousRun = (run: IRunItem): IArchivedRun => ({
  id: run.id,
  label: run.label ?? 'Untitled run',
  period: formatRunPeriod(run.startedAt, run.completedAt),
  companies: run.companyCount,
  conviction:
    run.overallConvictionPct === null
      ? null
      : Math.round(Number(run.overallConvictionPct)),
  flags: null,
  status: run.status,
});
