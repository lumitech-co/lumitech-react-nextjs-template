import { cn } from 'shared/lib';

type ProgressTone = 'success' | 'warning' | 'danger';

interface IProgressProps {
  value: number;
  tone?: ProgressTone;
  className?: string;
  style?: React.CSSProperties;
}

export const Progress = ({ value, tone, className, style }: IProgressProps) => (
  <div className={cn('progress', tone, className)} style={style}>
    <span style={{ width: `${value}%` }} />
  </div>
);
