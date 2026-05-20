import { RefreshIcon } from 'shared/icons';

export const ShellLoader = () => (
  <div className="app app-shell-loader">
    <div className="app-shell-loader-content">
      <RefreshIcon width={28} height={28} className="spin text-accent" />
      <div className="app-shell-loader-label">Loading workspace&hellip;</div>
    </div>
  </div>
);
