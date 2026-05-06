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
