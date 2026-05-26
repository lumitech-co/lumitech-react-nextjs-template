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

const sourceFieldHeading = (field: string) => {
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

  return 'Financial highlights';
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
    <div className="content flex h-[calc(100vh-56px)] flex-col pb-0">
      <div className="page-header between shrink-0">
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

      <div className="card mb-6 grid min-h-0 flex-1 grid-cols-[400px_1fr]">
        {/* Queue list */}
        <div className="flex min-h-0 flex-col border-r border-line">
          <div className="tabs px-2">
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
          <div className="flex-1 overflow-auto">
            {filtered.length === 0 ? (
              <div className="empty">
                <CheckIcon
                  width={28}
                  height={28}
                  className="mb-2 text-success"
                />
                <div className="empty-title">All clear</div>
                <div>No flagged items in this view.</div>
              </div>
            ) : (
              filtered.map(reviewItem => (
                <div
                  key={reviewItem.id}
                  onClick={() => setSelectedId(reviewItem.id)}
                  className={cn(
                    'cursor-pointer border-b border-line px-4 py-3',
                    selected?.id === reviewItem.id
                      ? 'border-l-[3px] border-l-accent bg-accent-50'
                      : 'border-l-[3px] border-l-transparent',
                  )}
                >
                  <div className="row between mb-1">
                    <Badge tone={flagBadgeTone(reviewItem.flag)}>
                      {flagLabel(reviewItem.flag)}
                    </Badge>
                    <span className="text-[11px] text-ink-400">
                      FY{reviewItem.year}
                    </span>
                  </div>
                  <div className="text-[13px] font-medium">
                    {reviewItem.company}
                  </div>
                  <div className="text-xs text-ink-500">
                    {reviewItem.field} &middot;{' '}
                    <span className="tnum">
                      {reviewItem.value === ND_VALUE
                        ? 'ND'
                        : `${reviewItem.currency} ${reviewItem.value}m`}
                    </span>
                  </div>
                  <div className="mt-1 text-[11.5px] leading-snug text-ink-400">
                    {reviewItem.reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail / source */}
        <div className="flex min-h-0 flex-col">
          {selected ? (
            <>
              {/* Detail header */}
              <div className="shrink-0 border-b border-line px-5 py-3.5">
                <div className="row mb-1.5 gap-8">
                  <Badge tone={flagBadgeTone(selected.flag)}>
                    {flagLabel(selected.flag)}
                  </Badge>
                  <span className="text-xs text-ink-500">
                    {selected.company} &middot; {selected.field} &middot; FY
                    {selected.year}
                  </span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {selected.value === ND_VALUE ? (
                    <span className="text-ink-400">No value extracted</span>
                  ) : (
                    <>
                      <span className="tnum">{selected.value}</span>{' '}
                      <span className="text-sm font-medium text-ink-500">
                        {selected.currency} (millions)
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1 text-[12.5px] text-ink-500">
                  {selected.reason}
                </div>
              </div>

              {/* Source reference (text-based) */}
              <div className="min-h-0 flex-1 overflow-auto bg-surface-2 px-5 py-4">
                {selected.page ? (
                  <div className="mx-auto max-w-[560px]">
                    <div className="row between mb-3.5">
                      <div className="text-xs text-ink-500">
                        Source reference
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                      >
                        <ExternalIcon width={11} height={11} />
                        Open Full PDF
                      </button>
                    </div>

                    <div className="mb-3 rounded-lg border border-line bg-white px-4 py-3.5">
                      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-ink-500">
                        Location
                      </div>
                      <div className="text-[13px] leading-relaxed">
                        <strong>Annual Report {selected.year}</strong>
                        <br />
                        Page {selected.page} &middot;{' '}
                        {sourceFieldHeading(selected.field)} table
                      </div>
                    </div>

                    <div className="mb-3 rounded-lg border border-line bg-white px-4 py-3.5">
                      <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-ink-500">
                        Extracted value in context
                      </div>
                      <div className="text-[13px] leading-loose text-ink-700">
                        <span className="text-ink-400">
                          &hellip; {selected.field} for the year was{' '}
                        </span>
                        {selected.value === ND_VALUE ? (
                          <span className="italic text-ink-400">
                            (value not found in source)
                          </span>
                        ) : (
                          <span className="rounded bg-[#FFF7E0] px-1.5 py-0.5 font-semibold text-ink-900">
                            {selected.value} {selected.currency} millions
                          </span>
                        )}
                        <span className="text-ink-400">
                          , compared with the prior year. Changes were driven by
                          organic growth across all divisions, partially offset
                          by input cost inflation in the first quarter&hellip;
                        </span>
                      </div>
                    </div>

                    {selected.evidence && (
                      <div className="rounded-lg border border-line bg-white px-4 py-3.5">
                        <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-ink-500">
                          AI evidence
                        </div>
                        <div className="text-[12.5px] italic leading-relaxed text-ink-700">
                          &ldquo;{selected.evidence}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
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
              <div className="shrink-0 border-t border-line bg-white px-5 py-3.5">
                <div className="col gap-12">
                  <div className="row gap-12">
                    <div className="field flex-1">
                      <label className="label">
                        Manual value (in millions, {selected.currency})
                      </label>
                      <input
                        className="input"
                        value={manualValue}
                        onChange={event => setManualValue(event.target.value)}
                        placeholder={
                          selected.value === ND_VALUE
                            ? 'Enter value...'
                            : selected.value
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary self-end"
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
            <div className="empty m-auto">
              <CheckIcon width={40} height={40} className="mb-3 text-success" />
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
