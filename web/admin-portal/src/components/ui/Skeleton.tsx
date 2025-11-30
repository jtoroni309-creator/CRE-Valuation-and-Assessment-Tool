'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variants = {
    default: 'rounded-md',
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-muted',
        variants[variant],
        className
      )}
    />
  );
}

// Skeleton Card
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx('p-4 rounded-xl border border-border bg-card', className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0" variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

// Skeleton Table Row
export function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <tr className={clsx('border-b border-border/50', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[150px]" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton List Item
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-3 p-3', className)}>
      <Skeleton className="h-10 w-10" variant="circle" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

// Skeleton Stats Card
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={clsx('p-4 rounded-xl border border-border bg-card', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton Chart
export function SkeletonChart({
  height = 200,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={clsx('rounded-xl border border-border bg-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-around gap-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-8"
              style={{ height: `${Math.random() * 60 + 20}%` }}
              variant="rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton Form
export function SkeletonForm({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={clsx('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton Avatar Group
export function SkeletonAvatarGroup({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={clsx('flex -space-x-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-8 ring-2 ring-background"
          variant="circle"
        />
      ))}
    </div>
  );
}

// Full Page Skeleton
export function SkeletonPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonChart height={300} />
        </div>
        <div className="space-y-3">
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </div>
      </div>
    </div>
  );
}
