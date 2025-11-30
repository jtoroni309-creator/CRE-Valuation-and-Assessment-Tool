'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { clsx } from 'clsx';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ className, size = 'md', showLabel = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={toggleTheme}
        className={clsx(
          sizes[size],
          'flex items-center justify-center rounded-xl',
          'bg-surface-container hover:bg-surface-container-high',
          'text-foreground',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:scale-95'
        )}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="relative">
          {/* Sun Icon */}
          <svg
            className={clsx(
              iconSizes[size],
              'absolute inset-0 transition-all duration-300',
              resolvedTheme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          {/* Moon Icon */}
          <svg
            className={clsx(
              iconSizes[size],
              'transition-all duration-300',
              resolvedTheme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
      </button>

      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {resolvedTheme}
        </span>
      )}
    </div>
  );
}

// Full Theme Selector with system option
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerIcon },
  ] as const;

  return (
    <div className={clsx('flex rounded-xl bg-muted p-1', className)}>
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            theme === value
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
