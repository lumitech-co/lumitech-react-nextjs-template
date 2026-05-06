'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

import { AlertIcon, CheckIcon } from 'shared/icons';

type ToastTone = 'default' | 'success' | 'error';

interface IToastOptions {
  tone?: ToastTone;
  duration?: number;
}

interface IToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

type ToastFn = (message: string, options?: IToastOptions) => void;

const AUTO_DISMISS_MS = 3200;
const ID_RADIX = 36;

const ToastContext = createContext<ToastFn | null>(null);

export const useToast = (): ToastFn => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

interface IToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: IToastProviderProps) => {
  const [items, setItems] = useState<IToastItem[]>([]);

  const push = useCallback<ToastFn>((message, options = {}) => {
    const raw = Math.random().toString(ID_RADIX);
    const id = raw.slice(2); // eslint-disable-line no-magic-numbers
    const tone = options.tone || 'default';

    setItems(prev => [...prev, { id, message, tone }]);

    setTimeout(
      () => setItems(prev => prev.filter(toastItem => toastItem.id !== id)),
      options.duration || AUTO_DISMISS_MS,
    );
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack">
        {items.map(toastItem => (
          <div key={toastItem.id} className={`toast ${toastItem.tone}`}>
            {toastItem.tone === 'success' && (
              <CheckIcon width={14} height={14} />
            )}
            {toastItem.tone === 'error' && <AlertIcon width={14} height={14} />}
            <span>{toastItem.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
