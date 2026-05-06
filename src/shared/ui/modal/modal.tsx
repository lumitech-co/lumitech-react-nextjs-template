'use client';

import { ReactNode, useCallback, useEffect } from 'react';

import { XIcon } from 'shared/icons';
import { cn } from 'shared/lib';

type ModalSize = 'sm' | 'lg' | 'xl';

interface IModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: ModalSize;
  footer?: ReactNode;
  children: ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: '',
  lg: 'modal-lg',
  xl: 'modal-xl',
};

export const Modal = ({
  open,
  onClose,
  title,
  size = 'sm',
  footer,
  children,
}: IModalProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={cn('modal', SIZE_CLASS[size])}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <div className="spacer" />
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
