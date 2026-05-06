import { ReactNode } from 'react';

import { cn } from 'shared/lib';

interface IFieldProps {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
  labelAside?: ReactNode;
}

export const Field = ({
  label,
  required,
  hint,
  error,
  labelAside,
  className,
  children,
}: IFieldProps) => (
  <div className={cn('field', className)}>
    {(label || labelAside) && (
      <div className="flex items-baseline justify-between">
        {label && (
          <label className="label">
            {label}
            {required ? <span className="req">*</span> : null}
          </label>
        )}
        {labelAside}
      </div>
    )}
    {children}
    {error ? <div className="error-msg">{error}</div> : null}
    {!error && hint ? <div className="hint">{hint}</div> : null}
  </div>
);
