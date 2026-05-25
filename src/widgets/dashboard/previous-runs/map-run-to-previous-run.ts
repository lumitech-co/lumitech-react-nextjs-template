import { IArchivedRun, IRunItem } from 'shared/api';
import { formatRunPeriod } from 'shared/lib';

const RUN_ID_LABEL_LENGTH = 8;

const parseConviction = (
  overallConvictionPct: string | null,
): number | null => {
  if (overallConvictionPct == null) {
    return null;
  }

  const parsed = Number.parseFloat(overallConvictionPct);

  return Number.isNaN(parsed) ? null : parsed;
};

export const mapRunToPreviousRun = (run: IRunItem): IArchivedRun => ({
  id: run.id,
  label: run.label ?? `Run ${run.id.slice(0, RUN_ID_LABEL_LENGTH)}`,
  period: formatRunPeriod(run.startedAt, run.completedAt),
  companies: run.companyCount,
  conviction: parseConviction(run.overallConvictionPct),
  flags: run.flaggedCount,
  status: run.status,
});
