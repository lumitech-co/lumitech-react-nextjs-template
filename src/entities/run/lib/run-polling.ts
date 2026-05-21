import { RunItemStatus } from 'shared/api';

const POLL_INTERVAL_MS = 60_000;

export const getDashboardPollInterval = (
  runStatus?: RunItemStatus | null,
): number | false => {
  if (!runStatus || runStatus === 'completed' || runStatus === 'cancelled') {
    return false;
  }

  return POLL_INTERVAL_MS;
};
