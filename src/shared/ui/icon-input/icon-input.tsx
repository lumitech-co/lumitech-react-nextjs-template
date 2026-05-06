import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

import { cn } from 'shared/lib';

interface IIconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  hasError?: boolean;
}

export const IconInput = forwardRef<HTMLInputElement, IIconInputProps>(
  ({ icon, className, hasError, ...rest }, ref) => (
    <div className="input-with-icon">
      <span className="input-icon">{icon}</span>
      <input
        ref={ref}
        className={cn('input', hasError && 'is-error', className)}
        {...rest}
      />
    </div>
  ),
);

IconInput.displayName = 'IconInput';
