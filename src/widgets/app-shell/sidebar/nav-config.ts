import { FC, SVGProps } from 'react';

import {
  CloudIcon,
  DashboardIcon,
  FilterIcon,
  InboxIcon,
  LayersIcon,
  ListIcon,
  SparkleIcon,
  XlsIcon,
} from 'shared/icons';

export type RouteId =
  | 'dashboard'
  | 'screening'
  | 'universe'
  | 'retrieval'
  | 'extraction'
  | 'review'
  | 'workbooks'
  | 'summary'
  | 'profile';

export interface INavItem {
  id: RouteId;
  label: string;
  icon: FC<SVGProps<SVGElement>>;
  badge?: number;
  alert?: boolean;
}

export interface INavGroup {
  group: string;
  items: INavItem[];
}

export const NAV_GROUPS: INavGroup[] = [
  {
    group: 'Workspace',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: DashboardIcon }],
  },
  {
    group: 'Pipeline',
    items: [
      { id: 'screening', label: 'Screening Rules', icon: FilterIcon },
      { id: 'universe', label: 'Universe & Shortlist', icon: ListIcon },
      { id: 'retrieval', label: 'Report Retrieval', icon: CloudIcon },
      { id: 'extraction', label: 'Extraction Fields', icon: SparkleIcon },
      { id: 'review', label: 'Review Queue', icon: InboxIcon, alert: true },
    ],
  },
  {
    group: 'Output',
    items: [
      { id: 'workbooks', label: 'Company Workbooks', icon: XlsIcon },
      { id: 'summary', label: 'Consolidated Summary', icon: LayersIcon },
    ],
  },
];

export const ROUTE_TITLES: Record<RouteId, string> = {
  dashboard: 'Dashboard',
  screening: 'Screening Rules',
  universe: 'Universe & Shortlist',
  retrieval: 'Report Retrieval',
  extraction: 'Extraction Fields',
  review: 'Review Queue',
  workbooks: 'Company Workbooks',
  summary: 'Consolidated Summary',
  profile: 'My Account',
};

export const ROUTE_PATHS: Record<RouteId, string> = {
  dashboard: '/dashboard',
  screening: '/screening-rules',
  universe: '/universe',
  retrieval: '/retrieval',
  extraction: '/extraction',
  review: '/review',
  workbooks: '/workbooks',
  summary: '/summary',
  profile: '/profile',
};

const PATH_TO_ROUTE: Record<string, RouteId> = Object.entries(
  ROUTE_PATHS,
).reduce<Record<string, RouteId>>((acc, [routeId, path]) => {
  acc[path] = routeId as RouteId;

  return acc;
}, {});

export const getRouteIdFromPath = (pathname: string): RouteId =>
  PATH_TO_ROUTE[pathname] || 'dashboard';
