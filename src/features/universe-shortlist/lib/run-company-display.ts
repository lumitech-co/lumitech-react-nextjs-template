import { IRunCompanyItem, RunCompanyStatus } from 'shared/api';

const GBP_PER_BILLION = 1_000_000_000;

export const formatMarketCapBillions = (
  marketCapGbp: string | null,
): string => {
  if (!marketCapGbp) {
    return '—';
  }

  const billions = Number(marketCapGbp) / GBP_PER_BILLION;

  if (Number.isNaN(billions)) {
    return '—';
  }

  return `£${billions.toFixed(1)}bn`;
};

export const getExclusionBadgeLabel = (
  company: IRunCompanyItem,
): string | null => {
  if (company.status !== RunCompanyStatus.Excluded) {
    return null;
  }

  const reason = company.screeningResult?.exclusionReason;

  if (!reason) {
    return 'Excluded';
  }

  const normalized = reason.toLowerCase();

  if (normalized.includes('sector')) {
    return 'Excluded · sector';
  }

  if (
    normalized.includes('threshold') ||
    normalized.includes('marketcap') ||
    normalized.includes('market_cap')
  ) {
    return 'Excluded · market cap';
  }

  if (normalized.includes('manual')) {
    return 'Manual override';
  }

  return `Excluded · ${reason}`;
};
