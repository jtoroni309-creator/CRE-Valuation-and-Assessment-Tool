'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '@/components/ui/Dropdown';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const getPageTitle = () => {
    const routes: Record<string, { title: string; description: string }> = {
      '/': { title: 'Dashboard', description: 'Overview of your CRE portfolio' },
      '/dashboard': { title: 'Dashboard', description: 'Overview of your CRE portfolio' },
      '/properties': { title: 'Properties', description: 'Manage your property inventory' },
      '/properties/map': { title: 'Property Map', description: 'Interactive 3D property visualization' },
      '/valuations': { title: 'Valuations', description: 'AI-powered property valuations' },
      '/comparables': { title: 'Comparables', description: 'Find and analyze comparable sales' },
      '/assessments': { title: 'Assessments', description: 'Property tax assessments' },
      '/appeals': { title: 'Appeals', description: 'Manage tax appeal cases' },
      '/reports': { title: 'Reports', description: 'Generate professional reports' },
      '/ai': { title: 'AI Assistant', description: 'Intelligent CRE analysis' },
      '/portfolio': { title: 'Portfolio', description: 'Portfolio analytics and insights' },
      '/settings': { title: 'Settings', description: 'Configure your account' },
    };

    for (const [route, info] of Object.entries(routes)) {
      if (pathname.startsWith(route) && route !== '/') {
        return info;
      }
    }
    return routes[pathname] || routes['/'];
  };

  const pageInfo = getPageTitle();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {pageInfo.description}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Input
              placeholder="Search properties, valuations..."
              className="w-64 pl-10"
              leftIcon={<SearchIcon className="h-4 w-4" />}
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>

          {/* Quick Actions */}
          <Dropdown
            trigger={
              <Button variant="ghost" size="icon-sm">
                <PlusIcon className="h-5 w-5" />
              </Button>
            }
          >
            <DropdownLabel>Quick Actions</DropdownLabel>
            <DropdownItem icon={<BuildingIcon className="h-4 w-4" />}>
              Add Property
            </DropdownItem>
            <DropdownItem icon={<ChartIcon className="h-4 w-4" />}>
              New Valuation
            </DropdownItem>
            <DropdownItem icon={<ScaleIcon className="h-4 w-4" />}>
              Start Appeal
            </DropdownItem>
            <DropdownItem icon={<DocumentIcon className="h-4 w-4" />}>
              Generate Report
            </DropdownItem>
          </Dropdown>

          {/* Notifications */}
          <Dropdown
            trigger={
              <div className="relative">
                <Button variant="ghost" size="icon-sm">
                  <BellIcon className="h-5 w-5" />
                </Button>
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  3
                </span>
              </div>
            }
          >
            <DropdownLabel>Notifications</DropdownLabel>
            <div className="max-h-80 overflow-y-auto">
              <NotificationItem
                title="Valuation Complete"
                description="123 Main St valuation has been completed"
                time="5 min ago"
                type="success"
              />
              <NotificationItem
                title="Appeal Deadline"
                description="Appeal for 456 Oak Ave is due in 3 days"
                time="1 hour ago"
                type="warning"
              />
              <NotificationItem
                title="New Market Data"
                description="Updated comp data available for Downtown"
                time="2 hours ago"
                type="info"
              />
            </div>
            <DropdownSeparator />
            <DropdownItem>View All Notifications</DropdownItem>
          </Dropdown>

          {/* Help */}
          <Button variant="ghost" size="icon-sm">
            <HelpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-16 p-4 bg-surface border-b border-border md:hidden">
          <Input
            placeholder="Search properties, valuations..."
            leftIcon={<SearchIcon className="h-4 w-4" />}
            autoFocus
          />
        </div>
      )}
    </header>
  );
}

function NotificationItem({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
}) {
  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-success" />,
    warning: <WarningIcon className="h-5 w-5 text-warning" />,
    info: <InfoIcon className="h-5 w-5 text-info" />,
    error: <ErrorIcon className="h-5 w-5 text-destructive" />,
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer">
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}

// Icons
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
