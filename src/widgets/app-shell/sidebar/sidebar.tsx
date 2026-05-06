'use client';

import { useAuthStore } from 'features';
import { LogoutIcon } from 'shared/icons';
import { cn } from 'shared/lib';

import { INavItem, NAV_GROUPS, RouteId } from './nav-config';

interface ISidebarProps {
  activeRoute: RouteId;
  onRouteChange: (route: RouteId) => void;
  reviewCount?: number;
  runStatus?: 'idle' | 'running' | 'complete' | 'cancelled';
  runStartedAt?: string;
}

const RUN_DOT_COLOR: Record<NonNullable<ISidebarProps['runStatus']>, string> = {
  running: '#6CA3FF',
  complete: '#5DD39E',
  cancelled: '#98AED1',
  idle: '#98AED1',
};

const RUN_LABEL: Record<NonNullable<ISidebarProps['runStatus']>, string> = {
  running: 'Run in progress',
  complete: 'Last run complete',
  cancelled: 'Run cancelled',
  idle: 'No active run',
};

export const Sidebar = ({
  activeRoute,
  onRouteChange,
  reviewCount,
  runStatus = 'idle',
  runStartedAt = '—',
}: ISidebarProps) => {
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  const renderItem = (entry: INavItem) => {
    const Icon = entry.icon;
    const badge =
      entry.id === 'review' && reviewCount ? reviewCount : entry.badge;
    const isActive = activeRoute === entry.id;

    return (
      <div
        key={entry.id}
        className={cn('nav-item', isActive && 'active')}
        onClick={() => onRouteChange(entry.id)}
      >
        <Icon className="nav-ico" />
        <span>{entry.label}</span>
        {badge ? (
          <span className={cn('nav-badge', entry.alert && 'alert')}>
            {badge}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">IB</div>
        <div>
          <div className="sidebar-brand-name">Iron Blue</div>
          <div className="sidebar-brand-sub">Equity Research Platform</div>
        </div>
      </div>
      <nav className="flex flex-col gap-px">
        {NAV_GROUPS.map(groupEntry => (
          <div key={groupEntry.group} className="flex flex-col gap-px">
            <div className="sidebar-section">{groupEntry.group}</div>
            {groupEntry.items.map(renderItem)}
          </div>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div
        className="px-2 py-2.5 text-[11.5px]"
        style={{ color: 'var(--sidebar-muted)' }}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <span
            className="badge-dot"
            style={{ background: RUN_DOT_COLOR[runStatus] }}
          />
          <span style={{ color: '#E8EEF8', fontWeight: 500 }}>
            {RUN_LABEL[runStatus]}
          </span>
        </div>
        <div className="[font-variant-numeric:tabular-nums]">
          {runStartedAt}
        </div>
      </div>
      <div
        className="sidebar-user cursor-pointer"
        onClick={() => onRouteChange('profile')}
        title="Open profile"
      >
        <div className="sidebar-user-avatar">{user?.initials ?? 'IB'}</div>
        <div className="min-w-0 flex-1">
          <div className="sidebar-user-name truncate">
            {user?.name ?? 'Iron Blue User'}
          </div>
          <div className="sidebar-user-role">{user?.role ?? 'Member'}</div>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          className="btn btn-icon btn-ghost"
          title="Sign out"
          style={{
            color: 'var(--sidebar-muted)',
            background: 'transparent',
          }}
          onClick={event => {
            event.stopPropagation();
            signOut();
          }}
        >
          <LogoutIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};
