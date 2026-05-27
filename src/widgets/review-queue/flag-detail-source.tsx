import { IReviewFlag } from 'shared/api';
import { ExternalIcon } from 'shared/icons';

import { formatValue, ND_VALUE } from './utils';

interface Props {
  flag: IReviewFlag;
  pdfPath?: string | null;
}

export const FlagDetailSource = ({ flag, pdfPath }: Props) => {
  const value = formatValue(flag.valueNumeric, flag.valueText);

  if (!flag.sourcePage) {
    return (
      <div className="empty">
        <div className="empty-title">No source page available</div>
        <div>
          The AI could not find this field in the annual report. The field has
          been marked as <code className="mono">ND</code> in the workbook.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="row between mb-3.5">
        <div className="text-xs text-ink-500">Source reference</div>
        {pdfPath && (
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalIcon width={11} height={11} />
            Open Full PDF
          </a>
        )}
        {!pdfPath && (
          <button type="button" className="btn btn-secondary btn-sm" disabled>
            <ExternalIcon width={11} height={11} />
            Open Full PDF
          </button>
        )}
      </div>

      <div className="mb-3 rounded-lg border border-line bg-white px-4 py-3.5">
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-ink-500">
          Location
        </div>
        <div className="text-[13px] leading-relaxed">
          <strong>Annual Report {flag.reportingYear}</strong>
          <br />
          Page {flag.sourcePage} &middot; {flag.fieldDisplayName}
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-line bg-white px-4 py-3.5">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-ink-500">
          Extracted value
        </div>
        <div className="text-[13px] leading-loose text-ink-700">
          {value === ND_VALUE ? (
            <span className="italic text-ink-400">
              (value not found in source)
            </span>
          ) : (
            <span className="rounded bg-[#FFF7E0] px-1.5 py-0.5 font-semibold text-ink-900">
              {value} {flag.originalCurrency ?? ''} millions
            </span>
          )}
        </div>
      </div>

      {flag.evidenceText && (
        <div className="rounded-lg border border-line bg-white px-4 py-3.5">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-ink-500">
            AI evidence
          </div>
          <div className="text-[12.5px] italic leading-relaxed text-ink-700">
            &ldquo;{flag.evidenceText}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
};
