'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const selectVariants = cva(
  [
    'flex w-full items-center justify-between rounded-lg border px-3 py-2',
    'text-sm bg-transparent cursor-pointer',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'hover:border-muted-foreground/50',
        ],
        filled: [
          'border-transparent bg-muted',
          'hover:bg-muted/80',
        ],
      },
      selectSize: {
        sm: 'h-8 text-xs',
        md: 'h-10',
        lg: 'h-12 text-base',
      },
      error: {
        true: 'border-destructive focus:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      variant,
      selectSize,
      error,
      options,
      value,
      defaultValue,
      onChange,
      placeholder = 'Select an option',
      label,
      helperText,
      errorMessage,
      disabled,
      searchable,
      clearable,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasError = error || !!errorMessage;

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearch('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        )
      : options;

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValue('');
      onChange?.('');
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}

        <div ref={ref} className="relative" {...props}>
          <div
            className={clsx(
              selectVariants({ variant, selectSize, error: hasError }),
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                if (searchable && !isOpen) {
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }
            }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption?.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}
              {searchable && isOpen ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={selectedOption?.label || placeholder}
                  className="flex-1 bg-transparent outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className={clsx(
                    'truncate',
                    !selectedOption && 'text-muted-foreground'
                  )}
                >
                  {selectedOption?.label || placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {clearable && selectedValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted rounded"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg
                className={clsx(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 cursor-pointer',
                      'hover:bg-accent transition-colors',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      option.value === selectedValue && 'bg-accent'
                    )}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.value === selectedValue && (
                      <svg className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))
              )}
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

Select.displayName = 'Select';

export { selectVariants };
