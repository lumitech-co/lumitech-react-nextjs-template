import { IReviewFlag } from 'shared/api';
import { Badge } from 'shared/ui';

import { FlagDetailActions } from './flag-detail-actions';
import { FlagDetailSource } from './flag-detail-source';
import { flagBadgeTone, flagLabel, formatValue, ND_VALUE } from './utils';

interface Props {
  flag: IReviewFlag;
  pdfPath?: string | null;
  manualValue: string;
  isAccepting: boolean;
  isSavingManual: boolean;
  isReExtracting: boolean;
  onManualValueChange: (value: string) => void;
  onAccept: () => void;
  onManualSave: () => void;
  onReExtract: () => void;
}

export const FlagDetail = ({
  flag,
  pdfPath,
  manualValue,
  isAccepting,
  isSavingManual,
  isReExtracting,
  onManualValueChange,
  onAccept,
  onManualSave,
  onReExtract,
}: Props) => {
  const value = formatValue(flag.valueNumeric, flag.valueText);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 border-b border-line px-5 py-3.5">
        <div className="row mb-1.5 gap-8">
          <Badge tone={flagBadgeTone(flag.flagType)}>
            {flagLabel(flag.flagType)}
          </Badge>
          <span className="text-xs text-ink-500">
            {flag.companyName} &middot; {flag.fieldDisplayName} &middot; FY
            {flag.reportingYear}
          </span>
        </div>
        <div className="text-lg font-semibold tracking-tight">
          {value === ND_VALUE ? (
            <span className="text-ink-400">No value extracted</span>
          ) : (
            <>
              <span className="tnum">{value}</span>{' '}
              <span className="text-sm font-medium text-ink-500">
                {flag.originalCurrency ?? ''} (millions)
              </span>
            </>
          )}
        </div>
        {flag.confidenceScore !== null && (
          <div className="mt-1 text-[12.5px] text-ink-500">
            Confidence score: {flag.confidenceScore}%
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-surface-2 px-5 py-4">
        <FlagDetailSource flag={flag} pdfPath={pdfPath} />
      </div>

      <FlagDetailActions
        flag={flag}
        manualValue={manualValue}
        isAccepting={isAccepting}
        isSavingManual={isSavingManual}
        isReExtracting={isReExtracting}
        onManualValueChange={onManualValueChange}
        onAccept={onAccept}
        onManualSave={onManualSave}
        onReExtract={onReExtract}
      />
    </div>
  );
};
