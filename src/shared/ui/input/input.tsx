import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from 'shared/lib';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, hasError, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn('input', hasError && 'is-error', className)}
      {...rest}
    />
  ),
);

Input.displayName = 'Input';
