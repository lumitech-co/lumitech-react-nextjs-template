'use client';

import { usePathname, useRouter } from 'next/navigation';

import { formatRunDateTime, useGetLatestRun } from 'entities';

import { useAuthStore } from 'features';
import { IRunItem, isActiveRunStatus } from 'shared/api';
import { LogoutIcon } from 'shared/icons';
import { cn } from 'shared/lib';

import {
  getRouteIdFromPath,
  INavItem,
  NAV_GROUPS,
  ROUTE_PATHS,
} from './nav-config';

type SidebarRunStatus = 'idle' | 'running' | 'completed' | 'cancelled';

const getSidebarRunStatus = (activeRun: IRunItem | null): SidebarRunStatus => {
  if (!activeRun) {
    return 'idle';
  }

  if (isActiveRunStatus(activeRun.status)) {
    return 'running';
  }

  if (activeRun.status === 'completed') {
    return 'completed';
  }

  return 'cancelled';
};

const RUN_DOT_CLASS: Record<SidebarRunStatus, string> = {
  running: 'bg-[#6CA3FF]',
  completed: 'bg-[#5DD39E]',
  cancelled: 'bg-sidebar-muted',
  idle: 'bg-sidebar-muted',
};

const RUN_LABEL: Record<SidebarRunStatus, string> = {
  running: 'Run in progress',
  completed: 'Last run complete',
  cancelled: 'Run cancelled',
  idle: 'No active run',
};

const getRunStartedAtLabel = (
  isLoadingRun: boolean,
  run: IRunItem | null,
): string => {
  if (isLoadingRun) {
    return 'Loading...';
  }

  if (run) {
    return formatRunDateTime(run.startedAt);
  }

  return '—';
};

interface ISidebarProps {
  reviewCount?: number;
}

export const Sidebar = ({ reviewCount }: ISidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeRoute = getRouteIdFromPath(pathname);
  const signOut = useAuthStore(state => state.signOut);
  const user = useAuthStore(state => state.user);
  const { data: latestRunResponse, isLoading } = useGetLatestRun();
  const activeRun = latestRunResponse?.data ?? null;
  const runStatus = getSidebarRunStatus(activeRun);
  const runStartedAt = getRunStartedAtLabel(isLoading, activeRun);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : 'IB';
  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Iron Blue User';
  const roleName = user?.role ?? 'Member';

  const renderItem = (entry: INavItem) => {
    const Icon = entry.icon;
    const badge =
      entry.id === 'review' && reviewCount ? reviewCount : entry.badge;
    const isActive = activeRoute === entry.id;

    return (
      <div
        key={entry.id}
        className={cn('nav-item', isActive && 'active')}
        onClick={() => router.push(ROUTE_PATHS[entry.id])}
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
      <div className="px-2 py-2.5 text-[11.5px] text-sidebar-muted">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className={cn('badge-dot', RUN_DOT_CLASS[runStatus])} />
          <span className="font-medium text-sidebar-fg">
            {RUN_LABEL[runStatus]}
          </span>
        </div>
        <div className="[font-variant-numeric:tabular-nums]">
          {runStartedAt}
        </div>
      </div>
      <div
        className="sidebar-user cursor-pointer"
        onClick={() => router.push(ROUTE_PATHS.profile)}
        title="Open profile"
      >
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="min-w-0 flex-1">
          <div className="sidebar-user-name truncate">{fullName}</div>
          <div className="sidebar-user-role">{roleName}</div>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          className="btn btn-icon btn-ghost bg-transparent text-sidebar-muted"
          title="Sign out"
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
