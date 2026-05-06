import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

import { cn } from 'shared/lib';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon',
};

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ variant = 'primary', size = 'md', className, type, ...rest }, ref) => (
    <button
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type === 'submit' || type === 'reset' ? type : 'button'}
      className={cn('btn', VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      {...rest}
    />
  ),
);

Button.displayName = 'Button';
