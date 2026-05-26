'use client';

/* eslint-disable no-magic-numbers */
import { useMemo, useState } from 'react';

import { buildMockWorkbook, MOCK_COMPANIES, MOCK_RUN } from 'shared/api';
import { DownloadIcon } from 'shared/icons';
import { cn } from 'shared/lib';
import {
  Conviction,
  ReExtractionBanner,
  useToast,
  XlsxViewer,
} from 'shared/ui';

const DEFAULT_CONVICTION = 80;

export const CompanyWorkbooks = () => {
  const run = MOCK_RUN;
  const companies = MOCK_COMPANIES;
  const done = useMemo(
    () => companies.filter(company => company.stage === 'done'),
    [companies],
  );
  const [selected, setSelected] = useState(done[0] ?? companies[0]);
  const toast = useToast();

  const workbookBuffer = useMemo(
    () => (selected ? buildMockWorkbook(selected) : null),
    [selected],
  );

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Company Workbooks</div>
          <div className="page-sub">
            One Excel workbook per processed company. Input cells are populated
            by the system; formulas and Iron Blue scoring rows are preserved.
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={run?.reExtraction?.inProgress}
          >
            <DownloadIcon width={13} height={13} />
            Download All (.zip)
          </button>
        </div>
      </div>

      <ReExtractionBanner run={run} />

      <div className="grid-2 grid-cols-[320px_1fr] items-start">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Processed companies</div>
            <span className="badge badge-neutral">{done.length}</span>
          </div>
          <div className="max-h-[560px] overflow-auto">
            {done.map(company => {
              const isSelected = selected?.id === company.id;

              return (
                <div
                  key={company.id}
                  onClick={() => setSelected(company)}
                  className={cn(
                    'cursor-pointer border-b border-line px-4 py-2.5',
                    isSelected
                      ? 'border-l-[3px] border-l-accent bg-accent-50'
                      : 'border-l-[3px] border-l-transparent',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-7 place-items-center rounded-[5px] bg-accent-50 text-[10px] font-bold text-accent">
                      {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">
                        {company.name}
                      </div>
                      <div className="text-[11px] text-ink-400">
                        FY25 &middot; FY24 &middot; FY23
                      </div>
                    </div>
                    <Conviction
                      value={company.conviction ?? DEFAULT_CONVICTION}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && workbookBuffer && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  {selected.name} &middot; workbook.xlsx
                </div>
                <div className="card-sub">
                  Input cells populated &middot; formulas preserved &middot;
                  source comments embedded
                </div>
              </div>
              <div className="spacer" />
              <Conviction value={selected.conviction ?? DEFAULT_CONVICTION} />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={run?.reExtraction?.inProgress}
                onClick={() =>
                  toast('Workbook downloaded', { tone: 'success' })
                }
              >
                <DownloadIcon width={12} height={12} />
                Download .xlsx
              </button>
            </div>
            <div className="bg-surface-2 p-4">
              <XlsxViewer data={workbookBuffer} />
              <div className="row mt-3 flex-wrap gap-3 text-[11.5px] text-ink-500">
                <span>
                  <span className="mr-1 inline-block size-2.5 border border-[#D4D4D4] bg-white align-middle" />
                  Input cell (AI-populated)
                </span>
                <span>
                  <span className="mr-1 inline-block size-2.5 border border-[#D4D4D4] bg-[#F4F8FF] align-middle" />
                  Formula cell (untouched)
                </span>
                <span>
                  <span className="mr-1 inline-block size-0 border-l-8 border-t-8 border-l-transparent border-t-[#C2185B] align-middle" />
                  Cell comment with source reference
                </span>
                <span>
                  <code className="mono">ND</code> = value not found in report
                </span>
                <span>
                  <strong>Column F</strong> &mdash; AI explanations for
                  non-trivial extractions (left empty for direct extractions)
                </span>
              </div>
              <div className="mt-3 rounded-md border border-line bg-white px-3 py-2.5 font-mono text-xs text-ink-700">
                <strong>C5 comment:</strong> Source: Annual Report 2025, p. 87,
                Income Statement table &mdash; &ldquo;Operating EBITDA before
                non-recurring items reached &euro;8,420m&rdquo;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
