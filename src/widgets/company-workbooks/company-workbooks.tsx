'use client';

/* eslint-disable no-magic-numbers */
import { useMemo, useState } from 'react';

import { buildMockWorkbook, MOCK_COMPANIES, MOCK_RUN } from 'shared/api';
import { DownloadIcon } from 'shared/icons';
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

      <div
        className="grid-2"
        style={{ gridTemplateColumns: '320px 1fr', alignItems: 'flex-start' }}
      >
        <div className="card">
          <div className="card-header">
            <div className="card-title">Processed companies</div>
            <span className="badge badge-neutral">{done.length}</span>
          </div>
          <div style={{ maxHeight: 560, overflow: 'auto' }}>
            {done.map(company => (
              <div
                key={company.id}
                onClick={() => setSelected(company)}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--line)',
                  background:
                    selected?.id === company.id
                      ? 'var(--accent-50)'
                      : 'transparent',
                  borderLeft:
                    selected?.id === company.id
                      ? '3px solid var(--accent)'
                      : '3px solid transparent',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 5,
                      background: 'var(--accent-50)',
                      color: 'var(--accent)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 500 }}
                      className="truncate"
                    >
                      {company.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                      FY25 &middot; FY24 &middot; FY23
                    </div>
                  </div>
                  <Conviction
                    value={company.conviction ?? DEFAULT_CONVICTION}
                  />
                </div>
              </div>
            ))}
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
            <div style={{ padding: 16, background: 'var(--surface-2)' }}>
              <XlsxViewer data={workbookBuffer} />
              <div
                className="row gap-12"
                style={{
                  marginTop: 12,
                  fontSize: 11.5,
                  color: 'var(--ink-500)',
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      background: '#fff',
                      border: '1px solid #D4D4D4',
                      verticalAlign: 'middle',
                      marginRight: 4,
                    }}
                  />
                  Input cell (AI-populated)
                </span>
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      background: '#F4F8FF',
                      border: '1px solid #D4D4D4',
                      verticalAlign: 'middle',
                      marginRight: 4,
                    }}
                  />
                  Formula cell (untouched)
                </span>
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 0,
                      height: 0,
                      borderTop: '8px solid #C2185B',
                      borderLeft: '8px solid transparent',
                      verticalAlign: 'middle',
                      marginRight: 4,
                    }}
                  />
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
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 12px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-700)',
                }}
              >
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
