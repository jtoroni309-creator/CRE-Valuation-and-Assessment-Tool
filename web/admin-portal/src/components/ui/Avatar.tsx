'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export function Avatar({
  className,
  size,
  src,
  alt,
  fallback,
  status,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const getFallbackInitials = () => {
    if (fallback) return fallback.substring(0, 2).toUpperCase();
    if (alt) {
      return alt
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return '?';
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted-foreground',
    away: 'bg-warning',
    busy: 'bg-destructive',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5 border',
    sm: 'h-2 w-2 border',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-3.5 w-3.5 border-2',
    '2xl': 'h-4 w-4 border-2',
  };

  return (
    <div className={clsx('relative inline-block', className)} {...props}>
      <div className={avatarVariants({ size })}>
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="font-medium text-muted-foreground select-none">
            {getFallbackInitials()}
          </span>
        )}
      </div>

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-background',
            statusColors[status],
            statusSizes[size || 'md']
          )}
        />
      )}
    </div>
  );
}

// Avatar Group for displaying multiple avatars
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapSpacing = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-5',
  };

  return (
    <div className={clsx('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={clsx(
            'ring-2 ring-background rounded-full',
            index > 0 && overlapSpacing[size || 'md']
          )}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.isValidElement(avatar)
            ? React.cloneElement(avatar as React.ReactElement<any>, { size })
            : avatar}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={clsx(
            avatarVariants({ size }),
            'ring-2 ring-background bg-muted',
            overlapSpacing[size || 'md']
          )}
          style={{ zIndex: 0 }}
        >
          <span className="font-medium text-muted-foreground">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

export { avatarVariants };
