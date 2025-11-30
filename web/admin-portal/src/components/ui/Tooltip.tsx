'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    // Calculate position based on side
    switch (side) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
        left = triggerRect.left - tooltipRect.width - offset;
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        left = triggerRect.right + offset;
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Calculate alignment for top/bottom
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left;
          break;
        case 'center':
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'end':
          left = triggerRect.right - tooltipRect.width;
          break;
      }
    }

    // Calculate alignment for left/right
    if (side === 'left' || side === 'right') {
      switch (align) {
        case 'start':
          top = triggerRect.top;
          break;
        case 'center':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'end':
          top = triggerRect.bottom - tooltipRect.height;
          break;
      }
    }

    // Keep tooltip within viewport
    const padding = 8;
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={clsx(
              'fixed z-50 px-3 py-1.5 text-sm rounded-lg',
              'bg-inverse-surface text-inverse-on-surface',
              'shadow-lg animate-in fade-in zoom-in-95 duration-100',
              className
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

// Info Tooltip with icon
interface InfoTooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function InfoTooltip({ content, side = 'top', className }: InfoTooltipProps) {
  return (
    <Tooltip content={content} side={side} className={className}>
      <button
        type="button"
        className="inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </Tooltip>
  );
}
