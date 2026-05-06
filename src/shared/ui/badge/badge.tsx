import { CSSProperties, ReactNode } from 'react';

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
  style?: CSSProperties;
  children: ReactNode;
}

export const Badge = ({
  tone = 'neutral',
  withDot = true,
  className,
  style,
  children,
}: IBadgeProps) => (
  <span className={cn('badge', `badge-${tone}`, className)} style={style}>
    {withDot && <span className="badge-dot" />}
    {children}
  </span>
);
