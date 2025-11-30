'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-success-container text-success-container-foreground',
        warning: 'bg-warning-container text-warning-container-foreground',
        destructive: 'bg-destructive-container text-destructive-container-foreground',
        info: 'bg-info-container text-info-container-foreground',
        outline: 'border border-border text-foreground',
        ghost: 'bg-muted text-muted-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded',
        md: 'px-2.5 py-0.5 text-xs rounded-md',
        lg: 'px-3 py-1 text-sm rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export function Badge({
  className,
  variant,
  size,
  icon,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Status Badge with dot indicator
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'success';
  label?: string;
  className?: string;
}

const statusConfig = {
  active: { color: 'bg-success', label: 'Active' },
  inactive: { color: 'bg-muted-foreground', label: 'Inactive' },
  pending: { color: 'bg-warning', label: 'Pending' },
  error: { color: 'bg-destructive', label: 'Error' },
  warning: { color: 'bg-warning', label: 'Warning' },
  success: { color: 'bg-success', label: 'Success' },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 text-sm text-foreground',
        className
      )}
    >
      <span className={clsx('h-2 w-2 rounded-full', config.color)} />
      {label || config.label}
    </span>
  );
}

export { badgeVariants };
