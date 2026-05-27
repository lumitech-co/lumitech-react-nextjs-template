'use client';

import { useMemo, useState } from 'react';

import {
  selectLatestRun,
  useAcceptReviewFlag,
  useGetLatestRun,
  useGetReviewFlag,
  useListReviewFlags,
  useManualInputReviewFlag,
  useReExtractReviewFlag,
} from 'entities';

import { MOCK_COMPANIES } from 'shared/api';
import { AlertIcon } from 'shared/icons';
import { useToast } from 'shared/ui';

import { FlagDetail } from './flag-detail';
import { FlagList, UiFilter } from './flag-list';
import { FlagValueModal } from './flag-value-modal';

const filterToTab = (
  filter: UiFilter,
): 'all' | 'low-confidence' | 'outlier' | 'missing' => {
  if (filter === 'low_confidence') {
    return 'low-confidence';
  }

  return filter;
};

export const ReviewQueue = () => {
  const [filter, setFilter] = useState<UiFilter>('all');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [manualValue, setManualValue] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const toast = useToast();

  const runQuery = useGetLatestRun();
  const run = selectLatestRun(runQuery.data ?? undefined);

  const flagsQuery = useListReviewFlags({
    runId: run?.id ?? '',
    tab: filterToTab(filter),
  });

  const flags = useMemo(
    () =>
      (flagsQuery.data?.pages.flatMap(page => page.data) ?? []).filter(
        flag => flag.flagStatus === 'Open',
      ),
    [flagsQuery.data],
  );

  const selected =
    flags.find(flag => flag.id === selectedId) ?? flags[0] ?? null;

  const detailQuery = useGetReviewFlag(selected?.id);
  const pdfPath = detailQuery.data?.pdfPath;

  const counts = useMemo(
    () => ({
      all: flags.length,
      outlier: flags.filter(flag => flag.flagType === 'Outlier').length,
      low_confidence: flags.filter(flag => flag.flagType === 'LowConfidence')
        .length,
      missing: flags.filter(flag => flag.flagType === 'Missing').length,
    }),
    [flags],
  );

  const acceptMutation = useAcceptReviewFlag();
  const manualMutation = useManualInputReviewFlag();
  const reExtractMutation = useReExtractReviewFlag();

  const handleAccept = async () => {
    if (!selected) {
      return;
    }

    await acceptMutation.mutateAsync(selected.id);
    toast('Value accepted · flag closed', { tone: 'success' });
    setManualValue('');
  };

  const handleManualSave = async () => {
    if (!selected || !manualValue) {
      return;
    }

    await manualMutation.mutateAsync({
      id: selected.id,
      resolvedValue: parseFloat(manualValue),
    });
    toast('Manual value saved · flag closed', { tone: 'success' });
    setManualValue('');
  };

  const handleReExtract = async () => {
    if (!selected) {
      return;
    }

    await reExtractMutation.mutateAsync(selected.id);
    toast('Company queued for re-extraction', { tone: 'success' });
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

      <div className="card mb-6 grid min-h-0 flex-1 grid-cols-[400px_1fr]">
        <FlagList
          flags={flags}
          filter={filter}
          counts={counts}
          selectedId={selected?.id}
          hasNextPage={flagsQuery.hasNextPage}
          isFetchingNextPage={flagsQuery.isFetchingNextPage}
          onFilterChange={newFilter => {
            setFilter(newFilter);
            setSelectedId(undefined);
            setManualValue('');
          }}
          onSelectFlag={id => {
            setSelectedId(id);
            setManualValue('');
          }}
          onLoadMore={() => flagsQuery.fetchNextPage()}
        />

        {selected ? (
          <FlagDetail
            flag={selected}
            pdfPath={pdfPath}
            manualValue={manualValue}
            isAccepting={acceptMutation.isPending}
            isSavingManual={manualMutation.isPending}
            isReExtracting={reExtractMutation.isPending}
            onManualValueChange={setManualValue}
            onAccept={handleAccept}
            onManualSave={handleManualSave}
            onReExtract={handleReExtract}
          />
        ) : (
          <div className="empty m-auto">
            <div className="empty-title">Review queue is empty</div>
            <div>All flagged values have been reviewed.</div>
          </div>
        )}
      </div>

      <FlagValueModal
        open={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        companies={MOCK_COMPANIES}
      />
    </div>
  );
};
