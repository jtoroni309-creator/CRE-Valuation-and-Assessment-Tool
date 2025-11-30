'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const offset = 4;

    let top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - menuRect.height - offset;
    let left: number;

    switch (align) {
      case 'start':
        left = triggerRect.left;
        break;
      case 'center':
        left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case 'end':
      default:
        left = triggerRect.right - menuRect.width;
        break;
    }

    // Keep within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + menuRect.width > window.innerWidth - padding) {
      left = window.innerWidth - menuRect.width - padding;
    }

    if (side === 'bottom' && top + menuRect.height > window.innerHeight - padding) {
      top = triggerRect.top - menuRect.height - offset;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={clsx(
              'fixed z-50 min-w-[180px] py-1 rounded-xl bg-popover border border-border shadow-lg',
              'animate-in fade-in zoom-in-95 duration-100',
              className
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  onClose: () => setIsOpen(false),
                });
              }
              return child;
            })}
          </div>,
          document.body
        )}
    </>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  icon,
  onClick,
  onClose,
  disabled,
  destructive,
  className,
}: DropdownItemProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      onClose?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'flex items-center gap-2 w-full px-3 py-2 text-sm text-left',
        'transition-colors',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'hover:bg-accent',
        className
      )}
    >
      {icon && <span className="shrink-0 w-4 h-4">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function DropdownLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div className={clsx('my-1 h-px bg-border', className)} />;
}

// Shortcut badge for menu items
export function DropdownShortcut({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'ml-auto text-xs text-muted-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
