'use client';

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-transparent px-3 py-2',
    'text-sm placeholder:text-muted-foreground',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'hover:border-muted-foreground/50',
          'focus-visible:border-primary',
        ],
        filled: [
          'border-transparent bg-muted',
          'hover:bg-muted/80',
          'focus-visible:bg-transparent focus-visible:border-primary',
        ],
        outline: [
          'border-border',
          'hover:border-primary/50',
          'focus-visible:border-primary',
        ],
        ghost: [
          'border-transparent',
          'hover:bg-muted',
          'focus-visible:bg-muted',
        ],
      },
      inputSize: {
        sm: 'h-8 text-xs px-2.5',
        md: 'h-10',
        lg: 'h-12 text-base px-4',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      error,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-stretch">
          {leftAddon && (
            <div className="flex items-center px-3 border border-r-0 border-input rounded-l-lg bg-muted text-muted-foreground text-sm">
              {leftAddon}
            </div>
          )}

          <div className="relative flex-1">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              className={clsx(
                inputVariants({ variant, inputSize, error: hasError }),
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                leftAddon && 'rounded-l-none',
                rightAddon && 'rounded-r-none',
                className
              )}
              {...props}
            />

            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>

          {rightAddon && (
            <div className="flex items-center px-3 border border-l-0 border-input rounded-r-lg bg-muted text-muted-foreground text-sm">
              {rightAddon}
            </div>
          )}
        </div>

        {(helperText || errorMessage) && (
          <p
            className={clsx(
              'mt-1.5 text-xs',
              hasError ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
