'use client';

import { IRun } from 'shared/api';
import { RefreshIcon } from 'shared/icons';

const PERCENT = 100;

interface IReExtractionBannerProps {
  run: IRun;
}

export const ReExtractionBanner = ({ run }: IReExtractionBannerProps) => {
  if (!run.reExtraction?.inProgress) {
    return null;
  }

  const { processed, total, startedAt } = run.reExtraction;
  const pct = total > 0 ? Math.round((processed / total) * PERCENT) : 0;

  return (
    <div className="card mb-3.5 border-[#F0B73C] bg-[#FFF7E0]">
      <div className="card-body flex items-center gap-3.5 px-4 py-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F0B73C] text-white">
          <RefreshIcon width={16} height={16} className="spin" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-ink-900">
            Re-extraction in progress &middot; {processed} of {total} companies
            ({pct}%)
          </div>
          <div className="mt-0.5 text-xs text-ink-700">
            Started {startedAt}. Showing previous results &mdash; they will be
            replaced when re-extraction completes. Downloads and
            &ldquo;Accept&rdquo; actions are temporarily disabled.
          </div>
        </div>
      </div>
    </div>
  );
};
