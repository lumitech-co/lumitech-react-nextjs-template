import { RefreshIcon } from 'shared/icons';

export const ScreeningRulesLoader = () => (
  <div className="card">
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-4 py-16">
      <RefreshIcon width={28} height={28} className="spin text-accent" />
      <div className="text-[13px] text-ink-500">Loading screening rules...</div>
    </div>
  </div>
);
