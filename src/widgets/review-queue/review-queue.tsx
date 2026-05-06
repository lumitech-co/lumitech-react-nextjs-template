'use client';

import { useMemo, useState } from 'react';

import {
  IReviewItem,
  MOCK_COMPANIES,
  MOCK_REVIEW_ITEMS,
  MOCK_RUN,
} from 'shared/api';
import { AlertIcon, CheckIcon, ExternalIcon, RefreshIcon } from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, ReExtractionBanner, useToast } from 'shared/ui';

import { FlagValueModal } from './flag-value-modal';

const ND_VALUE = '\u2014';

type Filter = 'all' | 'outlier' | 'low_confidence' | 'missing';

const flagBadgeTone = (flag: string) => {
  if (flag === 'outlier') {
    return 'danger' as const;
  }
  if (flag === 'low_confidence') {
    return 'warning' as const;
  }

  return 'neutral' as const;
};

const flagLabel = (flag: string) => {
  if (flag === 'outlier') {
    return 'Outlier';
  }
  if (flag === 'low_confidence') {
    return 'Low confidence';
  }

  return 'Missing';
};

const pdfFieldHeading = (field: string) => {
  if (field === 'EBITDA') {
    return 'Group EBITDA';
  }
  if (field === 'EBIT') {
    return 'Operating result';
  }
  if (field === 'Net Income') {
    return 'Profit attributable to owners';
  }
  if (field === 'Free Cash Flow') {
    return 'Free cash flow';
  }
  if (field === 'Total Debt') {
    return 'Borrowings';
  }

  return field;
};

export const ReviewQueue = () => {
  const [items, setItems] = useState<IReviewItem[]>(MOCK_REVIEW_ITEMS);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(MOCK_REVIEW_ITEMS[0]?.id);
  const [manualValue, setManualValue] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const toast = useToast();

  const run = MOCK_RUN;

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return items;
    }

    return items.filter(reviewItem => reviewItem.flag === filter);
  }, [items, filter]);

  const selected =
    items.find(reviewItem => reviewItem.id === selectedId) ??
    filtered[0] ??
    null;

  const counts = useMemo(
    () => ({
      all: items.length,
      outlier: items.filter(reviewItem => reviewItem.flag === 'outlier').length,
      low_confidence: items.filter(
        reviewItem => reviewItem.flag === 'low_confidence',
      ).length,
      missing: items.filter(reviewItem => reviewItem.flag === 'missing').length,
    }),
    [items],
  );

  const handleAction = (kind: 'accept' | 'manual' | 'reextract') => {
    if (!selected) {
      return;
    }

    if (kind === 'accept') {
      toast('Value accepted \u00B7 flag closed', { tone: 'success' });
    } else if (kind === 'manual') {
      toast('Manual value saved \u00B7 flag closed', { tone: 'success' });
    } else {
      toast('Company queued for re-extraction', { tone: 'success' });
    }

    setItems(current =>
      current.filter(reviewItem => reviewItem.id !== selected.id),
    );

    const nextItem = filtered.filter(
      reviewItem => reviewItem.id !== selected.id,
    )[0];

    setSelectedId(nextItem?.id);
    setManualValue('');
  };

  return (
    <div
      className="content"
      style={{
        paddingBottom: 0,
        height: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="page-header between" style={{ flexShrink: 0 }}>
        <div>
          <div className="page-title">Review Queue</div>
          <div className="page-sub">
            Flagged values from AI extraction &middot; accept, correct, or
            trigger re-extraction. Use the button on the right to flag a value
            the AI did not catch.
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowFlagModal(true)}
          >
            <AlertIcon width={13} height={13} />
            Flag value not caught by AI
          </button>
        </div>
      </div>

      <ReExtractionBanner run={run} />

      <div
        className="card"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          minHeight: 0,
          marginBottom: 24,
        }}
      >
        {/* Queue list */}
        <div
          style={{
            borderRight: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div className="tabs" style={{ padding: '0 8px' }}>
            <div
              className={cn('tab', filter === 'all' && 'active')}
              onClick={() => setFilter('all')}
            >
              All <span className="count">{counts.all}</span>
            </div>
            <div
              className={cn('tab', filter === 'outlier' && 'active')}
              onClick={() => setFilter('outlier')}
            >
              Outlier <span className="count">{counts.outlier}</span>
            </div>
            <div
              className={cn('tab', filter === 'low_confidence' && 'active')}
              onClick={() => setFilter('low_confidence')}
            >
              Low conf. <span className="count">{counts.low_confidence}</span>
            </div>
            <div
              className={cn('tab', filter === 'missing' && 'active')}
              onClick={() => setFilter('missing')}
            >
              Missing <span className="count">{counts.missing}</span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.length === 0 ? (
              <div className="empty">
                <CheckIcon
                  width={28}
                  height={28}
                  style={{ color: 'var(--success)', marginBottom: 8 }}
                />
                <div className="empty-title">All clear</div>
                <div>No flagged items in this view.</div>
              </div>
            ) : (
              filtered.map(reviewItem => (
                <div
                  key={reviewItem.id}
                  onClick={() => setSelectedId(reviewItem.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--line)',
                    cursor: 'pointer',
                    background:
                      selected?.id === reviewItem.id
                        ? 'var(--accent-50)'
                        : 'transparent',
                    borderLeft:
                      selected?.id === reviewItem.id
                        ? '3px solid var(--accent)'
                        : '3px solid transparent',
                  }}
                >
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <Badge tone={flagBadgeTone(reviewItem.flag)}>
                      {flagLabel(reviewItem.flag)}
                    </Badge>
                    <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                      FY{reviewItem.year}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {reviewItem.company}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
                    {reviewItem.field} &middot;{' '}
                    <span className="tnum">
                      {reviewItem.value === ND_VALUE
                        ? 'ND'
                        : `${reviewItem.currency} ${reviewItem.value}m`}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--ink-400)',
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {reviewItem.reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail / source */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {selected ? (
            <>
              {/* Detail header */}
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--line)',
                  flexShrink: 0,
                }}
              >
                <div className="row gap-8" style={{ marginBottom: 6 }}>
                  <Badge tone={flagBadgeTone(selected.flag)}>
                    {flagLabel(selected.flag)}
                  </Badge>
                  <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>
                    {selected.company} &middot; {selected.field} &middot; FY
                    {selected.year}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {selected.value === ND_VALUE ? (
                    <span style={{ color: 'var(--ink-400)' }}>
                      No value extracted
                    </span>
                  ) : (
                    <>
                      <span className="tnum">{selected.value}</span>{' '}
                      <span
                        style={{
                          color: 'var(--ink-500)',
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        {selected.currency} (millions)
                      </span>
                    </>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--ink-500)',
                    marginTop: 4,
                  }}
                >
                  {selected.reason}
                </div>
              </div>

              {/* PDF mock */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px 20px',
                  background: 'var(--surface-2)',
                  minHeight: 0,
                }}
              >
                {selected.page ? (
                  <>
                    <div className="row between" style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ink-500)',
                        }}
                      >
                        Source: <strong>Annual Report {selected.year}</strong>{' '}
                        &middot; Page {selected.page}
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                      >
                        <ExternalIcon width={11} height={11} />
                        Open Full PDF
                      </button>
                    </div>
                    <div
                      className="pdf-page"
                      style={{ maxWidth: 540, margin: '0 auto' }}
                    >
                      <h2>{pdfFieldHeading(selected.field)}</h2>
                      <p>
                        The Group continued to deliver strong financial
                        performance in {selected.year}, supported by sustained
                        organic growth across all divisions and disciplined cost
                        management. Underlying margin expansion in the second
                        half offset transitory headwinds from input cost
                        inflation in the first quarter.
                      </p>
                      <h3>Financial highlights</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>{selected.currency} millions</th>
                            <th style={{ textAlign: 'right' }}>
                              FY{selected.year}
                            </th>
                            <th style={{ textAlign: 'right' }}>
                              FY{selected.year - 1}
                            </th>
                            <th style={{ textAlign: 'right' }}>Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Revenue</td>
                            <td style={{ textAlign: 'right' }}>43,480</td>
                            <td style={{ textAlign: 'right' }}>40,612</td>
                            <td style={{ textAlign: 'right' }}>+7.1%</td>
                          </tr>
                          <tr>
                            <td>Gross profit</td>
                            <td style={{ textAlign: 'right' }}>32,180</td>
                            <td style={{ textAlign: 'right' }}>29,840</td>
                            <td style={{ textAlign: 'right' }}>+7.8%</td>
                          </tr>
                          <tr style={{ background: '#FFF8DC' }}>
                            <td>
                              <strong>{selected.field}</strong>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className="pdf-highlight">
                                {selected.value}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>7,820</td>
                            <td style={{ textAlign: 'right' }}>+7.7%</td>
                          </tr>
                          <tr>
                            <td>Net income</td>
                            <td style={{ textAlign: 'right' }}>6,420</td>
                            <td style={{ textAlign: 'right' }}>5,840</td>
                            <td style={{ textAlign: 'right' }}>+9.9%</td>
                          </tr>
                        </tbody>
                      </table>
                      <h3>Commentary</h3>
                      <p>{selected.evidence || '\u2014'}</p>
                      <p
                        style={{
                          color: '#888',
                          fontSize: 9,
                          marginTop: 24,
                          textAlign: 'center',
                        }}
                      >
                        {selected.page} | {selected.company} Annual Report{' '}
                        {selected.year}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="empty">
                    <div className="empty-title">No source page available</div>
                    <div>
                      The AI could not find this field in the annual report. The
                      field has been marked as <code className="mono">ND</code>{' '}
                      in the workbook.
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div
                style={{
                  padding: '14px 20px',
                  borderTop: '1px solid var(--line)',
                  background: '#fff',
                  flexShrink: 0,
                }}
              >
                <div className="col gap-12">
                  <div className="row gap-12">
                    <div className="field" style={{ flex: 1 }}>
                      <label className="label">
                        Manual value (in millions, {selected.currency})
                      </label>
                      <input
                        className="input"
                        value={manualValue}
                        onChange={event => setManualValue(event.target.value)}
                        placeholder={
                          selected.value === ND_VALUE
                            ? 'Enter value\u2026'
                            : selected.value
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ alignSelf: 'flex-end' }}
                      disabled={!manualValue}
                      onClick={() => handleAction('manual')}
                    >
                      <CheckIcon width={13} height={13} />
                      Save Manual Value
                    </button>
                  </div>
                  <div className="row gap-8">
                    {selected.value !== ND_VALUE && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={run.reExtraction?.inProgress}
                        onClick={() => handleAction('accept')}
                      >
                        <CheckIcon width={13} height={13} />
                        Accept Extracted Value
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleAction('reextract')}
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
            </>
          ) : (
            <div className="empty" style={{ margin: 'auto' }}>
              <CheckIcon
                width={40}
                height={40}
                style={{
                  color: 'var(--success)',
                  marginBottom: 12,
                }}
              />
              <div className="empty-title">Review queue is empty</div>
              <div>All flagged values have been reviewed.</div>
            </div>
          )}
        </div>
      </div>

      <FlagValueModal
        open={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        companies={MOCK_COMPANIES}
      />
    </div>
  );
};
