import { IReviewFlag } from 'shared/api';
import { cn } from 'shared/lib';
import { Badge } from 'shared/ui';

import { flagBadgeTone, flagLabel, formatValue, ND_VALUE } from './utils';

interface Props {
  flag: IReviewFlag;
  isSelected: boolean;
  onClick: () => void;
}

export const FlagListItem = ({ flag, isSelected, onClick }: Props) => {
  const value = formatValue(flag.valueNumeric, flag.valueText);

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer border-b border-line px-4 py-3',
        isSelected
          ? 'border-l-[3px] border-l-accent bg-accent-50'
          : 'border-l-[3px] border-l-transparent',
      )}
    >
      <div className="row between mb-1">
        <Badge tone={flagBadgeTone(flag.flagType)}>
          {flagLabel(flag.flagType)}
        </Badge>
        <span className="text-[11px] text-ink-400">FY{flag.reportingYear}</span>
      </div>
      <div className="text-[13px] font-medium">{flag.companyName}</div>
      <div className="text-xs text-ink-500">
        {flag.fieldDisplayName} &middot;{' '}
        <span className="tnum">
          {value === ND_VALUE
            ? 'ND'
            : `${flag.originalCurrency ?? ''} ${value}m`}
        </span>
      </div>
      {flag.confidenceScore !== null && (
        <div className="mt-1 text-[11.5px] leading-snug text-ink-400">
          Confidence: {flag.confidenceScore}%
        </div>
      )}
    </div>
  );
};
