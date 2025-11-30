'use client';

import React, { createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (!value) {
      setInternalValue(tab);
    }
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function TabsList({ children, className, variant = 'default' }: TabsListProps) {
  const variants = {
    default: 'inline-flex items-center gap-1 p-1 rounded-xl bg-muted',
    pills: 'inline-flex items-center gap-2',
    underline: 'inline-flex items-center gap-4 border-b border-border',
  };

  return (
    <div className={clsx(variants[variant], className)} role="tablist">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { variant });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'pills' | 'underline';
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
  icon,
  variant = 'default',
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = 'inline-flex items-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: clsx(
      'px-3 py-1.5 rounded-lg text-sm',
      isActive
        ? 'bg-surface text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    ),
    pills: clsx(
      'px-4 py-2 rounded-full text-sm',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    ),
    underline: clsx(
      'px-1 py-2 text-sm relative',
      isActive
        ? 'text-primary'
        : 'text-muted-foreground hover:text-foreground',
      isActive && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
    ),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabsContent({
  value,
  children,
  className,
  forceMount,
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      className={clsx(
        'mt-4 focus-visible:outline-none',
        isActive && 'animate-in fade-in duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

// Vertical Tabs
interface VerticalTabsProps {
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function VerticalTabs({
  defaultValue,
  value,
  onChange,
  children,
  className,
}: VerticalTabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (!value) {
      setInternalValue(tab);
    }
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx('flex gap-6', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function VerticalTabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx('flex flex-col gap-1 w-48 shrink-0', className)}
      role="tablist"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
}

export function VerticalTabsTrigger({
  value,
  children,
  className,
  icon,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={clsx(
        'flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-left',
        'transition-colors duration-200',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function VerticalTabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      className={clsx(
        'flex-1 focus-visible:outline-none animate-in fade-in duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
