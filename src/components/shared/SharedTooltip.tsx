import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SharedTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onTriggerClick?: (
    event:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>
  ) => void;
}

export default function SharedTooltip({
  content,
  children,
  className,
  contentClassName,
  disabled = false,
  onTriggerClick,
}: SharedTooltipProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [touchLike, setTouchLike] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouchLike(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  const child = React.Children.only(children) as React.ReactElement<any>;

  const mergedChild = React.cloneElement(child, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      if (!onTriggerClick && touchLike) {
        setOpen((prev: boolean) => !prev);
      } else {
        setOpen(false);
      }

      child.props.onClick?.(event);
      onTriggerClick?.(event);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();

        if (!onTriggerClick && touchLike) {
          setOpen((prev: boolean) => !prev);
        } else {
          setOpen(false);
        }

        onTriggerClick?.(event);
      }

      child.props.onKeyDown?.(event);
    },
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      if (!touchLike) setOpen(true);
      child.props.onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      if (!touchLike) setOpen(false);
      child.props.onMouseLeave?.(event);
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (!touchLike) setOpen(true);
      child.props.onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      if (!touchLike) setOpen(false);
      child.props.onBlur?.(event);
    },
  });

  return (
    <span ref={containerRef} className={cn('relative inline-flex', className)}>
      {mergedChild}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-50 min-w-max rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-2xl',
              contentClassName
            )}
          >
            {content}
            <span className="absolute right-3 top-full h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-slate-950" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}