import { HTMLAttributes, ReactNode } from 'react';

import { cn } from 'shared/lib';

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card', className)} {...rest}>
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card-header', className)} {...rest}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card-title', className)} {...rest}>
    {children}
  </div>
);

export const CardSub = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card-sub', className)} {...rest}>
    {children}
  </div>
);

export const CardBody = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card-body', className)} {...rest}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...rest }: ICardProps) => (
  <div className={cn('card-footer', className)} {...rest}>
    {children}
  </div>
);
