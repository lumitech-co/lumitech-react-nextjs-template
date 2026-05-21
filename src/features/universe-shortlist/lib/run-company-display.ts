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

const isSectorExclusion = (normalized: string): boolean =>
  normalized.includes('sector') || normalized.includes('excludedsector');

const isMarketCapExclusion = (normalized: string): boolean =>
  normalized.includes('threshold') ||
  normalized.includes('marketcap') ||
  normalized.includes('market_cap') ||
  normalized.includes('belowthreshold');

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

  if (isSectorExclusion(normalized) && isMarketCapExclusion(normalized)) {
    return 'Excluded · sector / market cap';
  }

  if (isSectorExclusion(normalized)) {
    return 'Excluded · sector';
  }

  if (isMarketCapExclusion(normalized)) {
    return 'Excluded · market cap';
  }

  if (normalized.includes('manual')) {
    return 'Manual override';
  }

  return `Excluded · ${reason}`;
};
