'use client';

import {
  CSSProperties,
  ReactNode,
  ReactPortal,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const DROPDOWN_GAP = 6;

interface IFilterDropdownPortalProps {
  anchorRef: RefObject<HTMLButtonElement>;
  align?: 'left' | 'right';
  onClose: () => void;
  children: ReactNode;
}

interface IPosition {
  top: number;
  left: number;
  right: number;
}

export const FilterDropdownPortal = ({
  anchorRef,
  align = 'left',
  onClose,
  children,
}: IFilterDropdownPortalProps): ReactPortal | null => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<IPosition | null>(null);

  const updatePosition = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setPosition({
      top: rect.bottom + DROPDOWN_GAP,
      left: rect.left,
      right: window.innerWidth - rect.right,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    const scrollParent = anchorRef.current?.closest('.content');
    const targets = [window, scrollParent].filter(Boolean) as EventTarget[];

    targets.forEach(target =>
      target.addEventListener('scroll', updatePosition, true),
    );
    window.addEventListener('resize', updatePosition);

    return () => {
      targets.forEach(target =>
        target.removeEventListener('scroll', updatePosition, true),
      );
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, updatePosition]);

  useEffect(() => {
    const observer = new MutationObserver(updatePosition);

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [anchorRef, onClose]);

  if (typeof document === 'undefined' || !position) {
    return null;
  }

  const style: CSSProperties = {
    position: 'fixed',
    top: position.top,
    zIndex: 1000,
    ...(align === 'left' ? { left: position.left } : { right: position.right }),
  };

  return createPortal(
    <div ref={contentRef} style={style}>
      {children}
    </div>,
    document.body,
  );
};
