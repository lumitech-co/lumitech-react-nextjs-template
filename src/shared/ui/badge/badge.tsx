import { ReactNode } from 'react';

import { cn } from 'shared/lib';

type BadgeTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent';

interface IBadgeProps {
  tone?: BadgeTone;
  withDot?: boolean;
  className?: string;
  children: ReactNode;
}

export const Badge = ({
  tone = 'neutral',
  withDot = true,
  className,
  children,
}: IBadgeProps) => (
  <span className={cn('badge', `badge-${tone}`, className)}>
    {withDot && <span className="badge-dot" />}
    {children}
  </span>
);
