'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { Tooltip } from '@/components/ui/Tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
  },
  {
    name: 'Properties',
    href: '/properties',
    icon: BuildingIcon,
    children: [
      { name: 'All Properties', href: '/properties', icon: ListIcon },
      { name: 'Map View', href: '/properties/map', icon: MapIcon },
      { name: 'Add Property', href: '/properties/new', icon: PlusIcon },
    ],
  },
  {
    name: 'Valuations',
    href: '/valuations',
    icon: ChartIcon,
    badge: 'New',
  },
  {
    name: 'Comparables',
    href: '/comparables',
    icon: CompareIcon,
  },
  {
    name: 'Assessments',
    href: '/assessments',
    icon: ClipboardIcon,
  },
  {
    name: 'Appeals',
    href: '/appeals',
    icon: ScaleIcon,
    badge: 3,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: DocumentIcon,
  },
  {
    name: 'AI Suite',
    href: '/ai',
    icon: SparklesIcon,
    badge: 'Pro',
    children: [
      { name: 'AI Hub', href: '/ai', icon: SparklesIcon },
      { name: 'Valuation Engine', href: '/ai/valuation', icon: DiamondIcon },
      { name: 'Market Intelligence', href: '/ai/market', icon: ChartIcon },
      { name: 'Document AI', href: '/ai/documents', icon: DocumentIcon },
      { name: 'Vision Analyzer', href: '/ai/vision', icon: EyeIcon },
      { name: 'Predictions', href: '/ai/predictions', icon: CrystalBallIcon },
      { name: 'Investment Advisor', href: '/ai/investment', icon: BriefcaseIcon },
    ],
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: BriefcaseIcon,
  },
];

const adminNavigation: NavItem[] = [
  {
    name: 'Administration',
    href: '/admin',
    icon: AdminIcon,
    children: [
      { name: 'Users', href: '/admin/users', icon: UsersIcon },
      { name: 'Roles & Permissions', href: '/admin/roles', icon: ShieldIcon },
      { name: 'Organizations', href: '/admin/organizations', icon: OrganizationIcon },
      { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
      { name: 'Billing', href: '/admin/billing', icon: BillingIcon },
      { name: 'Audit Logs', href: '/admin/audit', icon: AuditIcon },
      { name: 'API Keys', href: '/admin/api-keys', icon: KeyIcon },
    ],
  },
];

const bottomNavigation: NavItem[] = [
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
  {
    name: 'Help & Support',
    href: '/support',
    icon: HelpIcon,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'bg-surface-container-low border-r border-border',
        'transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-gradient">Axxiom</span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              expanded={expandedItems.includes(item.name)}
              onToggle={() => toggleExpanded(item.name)}
              pathname={pathname}
            />
          ))}
        </ul>

        {/* Admin Section Separator */}
        <div className="my-4">
          <div className={clsx(
            'flex items-center gap-2',
            collapsed ? 'justify-center' : 'px-3'
          )}>
            <div className="flex-1 h-px bg-border" />
            {!collapsed && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Admin
              </span>
            )}
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        {/* Admin Navigation */}
        <ul className="space-y-1">
          {adminNavigation.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              expanded={expandedItems.includes(item.name)}
              onToggle={() => toggleExpanded(item.name)}
              pathname={pathname}
            />
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border py-4 px-3">
        <ul className="space-y-1">
          {bottomNavigation.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              pathname={pathname}
            />
          ))}
        </ul>

        {/* Theme Toggle */}
        <div className={clsx('mt-4', collapsed ? 'flex justify-center' : 'px-2')}>
          <ThemeToggle size="sm" showLabel={!collapsed} />
        </div>

        {/* User Menu */}
        <div className={clsx('mt-4', collapsed ? 'flex justify-center' : 'px-2')}>
          <UserMenu collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}

function NavItemComponent({
  item,
  collapsed,
  isActive,
  expanded,
  onToggle,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  pathname: string;
}) {
  const hasChildren = item.children && item.children.length > 0;

  const content = (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm',
        'transition-all duration-200',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center'
      )}
    >
      <item.icon className={clsx('h-5 w-5 shrink-0', isActive && 'text-primary')} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                typeof item.badge === 'number'
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRightIcon
              className={clsx(
                'h-4 w-4 transition-transform',
                expanded && 'rotate-90'
              )}
            />
          )}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip content={item.name} side="right">
          <Link href={hasChildren ? '#' : item.href}>{content}</Link>
        </Tooltip>
      </li>
    );
  }

  if (hasChildren) {
    return (
      <li>
        <button type="button" onClick={onToggle} className="w-full text-left">
          {content}
        </button>
        {expanded && (
          <ul className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
            {item.children?.map((child) => (
              <li key={child.name}>
                <Link
                  href={child.href}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    'transition-colors',
                    pathname === child.href
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <child.icon className="h-4 w-4" />
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link href={item.href}>{content}</Link>
    </li>
  );
}

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const trigger = (
    <div
      className={clsx(
        'flex items-center gap-3 p-2 rounded-xl cursor-pointer',
        'hover:bg-muted transition-colors',
        collapsed && 'justify-center'
      )}
    >
      <Avatar
        src="https://i.pravatar.cc/150?u=admin"
        alt="Admin User"
        size="sm"
        status="online"
      />
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Admin User</p>
          <p className="text-xs text-muted-foreground truncate">admin@axxiom.app</p>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="start" side="top">
      <DropdownItem icon={<UserIcon className="h-4 w-4" />}>
        Profile
      </DropdownItem>
      <DropdownItem icon={<SettingsIcon className="h-4 w-4" />}>
        Account Settings
      </DropdownItem>
      <DropdownItem icon={<BillingIcon className="h-4 w-4" />}>
        Billing
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={<LogoutIcon className="h-4 w-4" />} destructive>
        Sign Out
      </DropdownItem>
    </Dropdown>
  );
}

// Icons
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BillingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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

function AdminIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function OrganizationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function AuditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 6-9 12-9-12 9-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function CrystalBallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="10" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8M10 17h4" />
    </svg>
  );
}
