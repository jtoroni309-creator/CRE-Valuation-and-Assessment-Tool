'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={clsx(
          'w-full caption-bottom text-sm',
          variant === 'striped' && '[&_tbody_tr:nth-child(even)]:bg-muted/30',
          variant === 'bordered' && 'border border-border',
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx('[&_tr]:border-b border-border', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={clsx(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx(
      'border-b border-border/50 transition-colors',
      'hover:bg-muted/30',
      selected && 'bg-primary/5',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={clsx(
      'h-11 px-4 text-left align-middle font-semibold text-muted-foreground',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      'bg-muted/30',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={clsx(
      'px-4 py-3 align-middle',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={clsx('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

// Empty State
interface TableEmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function TableEmpty({ icon, title, description, action }: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={100} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          {icon && (
            <div className="mb-4 p-3 rounded-full bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
          <h3 className="font-medium text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  );
}

// Loading State
function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 w-full max-w-[200px] skeleton rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// Pagination
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}: TablePaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-4">
        {totalItems !== undefined && (
          <span className="text-sm text-muted-foreground">
            {totalItems.toLocaleString()} total items
          </span>
        )}

        {onPageSizeChange && pageSize && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 px-2 text-sm rounded-md border border-input bg-transparent focus:ring-2 focus:ring-ring"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            aria-label="First page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Previous page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Next page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Last page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
  TableSkeleton,
  TablePagination,
};
