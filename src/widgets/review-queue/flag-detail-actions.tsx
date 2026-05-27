import { IReviewFlag } from 'shared/api';
import { CheckIcon, ExternalIcon, RefreshIcon } from 'shared/icons';

import { formatValue, ND_VALUE } from './utils';

interface Props {
  flag: IReviewFlag;
  manualValue: string;
  isAccepting: boolean;
  isSavingManual: boolean;
  isReExtracting: boolean;
  onManualValueChange: (value: string) => void;
  onAccept: () => void;
  onManualSave: () => void;
  onReExtract: () => void;
}

export const FlagDetailActions = ({
  flag,
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
    <div className="shrink-0 border-t border-line bg-white px-5 py-3.5">
      <div className="col gap-12">
        <div className="row gap-12">
          <div className="field flex-1">
            <label className="label">
              Manual value (in millions
              {flag.originalCurrency ? `, ${flag.originalCurrency}` : ''})
            </label>
            <input
              className="input"
              value={manualValue}
              onChange={event => onManualValueChange(event.target.value)}
              placeholder={value === ND_VALUE ? 'Enter value...' : value}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary self-end"
            disabled={!manualValue || isSavingManual}
            onClick={onManualSave}
          >
            <CheckIcon width={13} height={13} />
            Save Manual Value
          </button>
        </div>
        <div className="row gap-8">
          {value !== ND_VALUE && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={isAccepting}
              onClick={onAccept}
            >
              <CheckIcon width={13} height={13} />
              Accept Extracted Value
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isReExtracting}
            onClick={onReExtract}
          >
            <RefreshIcon width={13} height={13} />
            Re-extract Company
          </button>
          <div className="spacer" />
          <button type="button" className="btn btn-ghost">
            <ExternalIcon width={13} height={13} />
            Open in Workbook
          </button>
        </div>
      </div>
    </div>
  );
};
