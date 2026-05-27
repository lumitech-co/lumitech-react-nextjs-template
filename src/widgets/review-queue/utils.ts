import { FlagType } from 'shared/api';

export const ND_VALUE = '—';

export const flagBadgeTone = (flagType: FlagType) => {
  if (flagType === 'Outlier') {
    return 'danger' as const;
  }
  if (flagType === 'LowConfidence') {
    return 'warning' as const;
  }

  return 'neutral' as const;
};

export const flagLabel = (flagType: FlagType) => {
  if (flagType === 'Outlier') {
    return 'Outlier';
  }
  if (flagType === 'LowConfidence') {
    return 'Low confidence';
  }

  return 'Missing';
};

export const formatValue = (
  valueNumeric: number | null,
  valueText: string | null,
): string => {
  if (valueNumeric !== null) {
    return valueNumeric.toLocaleString();
  }
  if (valueText) {
    return valueText;
  }

  return ND_VALUE;
};
