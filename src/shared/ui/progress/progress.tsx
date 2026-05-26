import { cn } from 'shared/lib';

type ProgressTone = 'success' | 'warning' | 'danger';

interface IProgressProps {
  value: number;
  tone?: ProgressTone;
  className?: string;
}

export const Progress = ({ value, tone, className }: IProgressProps) => (
  <div className={cn('progress', tone, className)}>
    <span style={{ width: `${value}%` }} />
  </div>
);
