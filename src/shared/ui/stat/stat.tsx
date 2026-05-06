import { ReactNode } from 'react';

import { cn } from 'shared/lib';

interface IStatProps {
  label: string;
  children: ReactNode;
  delta?: ReactNode;
  className?: string;
}

export const Stat = ({ label, children, delta, className }: IStatProps) => (
  <div className={cn('stat', className)}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{children}</div>
    {delta && <div className="stat-delta">{delta}</div>}
  </div>
);

interface IStatGridProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StatGrid = ({ children, className, style }: IStatGridProps) => (
  <div className={cn('stat-grid', className)} style={style}>
    {children}
  </div>
);
