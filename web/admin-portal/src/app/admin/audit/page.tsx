'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@/components/ui/Table';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';

// Mock audit log entries
const mockAuditLogs = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-15T14:30:00Z',
    user: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    action: 'user.login',
    category: 'authentication',
    resource: 'Auth System',
    details: 'Successful login via Google SSO',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0 / macOS',
    status: 'success',
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-15T14:25:00Z',
    user: { name: 'Michael Chen', email: 'michael.chen@company.com' },
    action: 'valuation.create',
    category: 'valuations',
    resource: 'Property: 350 Fifth Avenue',
    details: 'Created new valuation VAL-001',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 121.0 / Windows',
    status: 'success',
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-15T14:20:00Z',
    user: { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com' },
    action: 'report.generate',
    category: 'reports',
    resource: 'Report: Q4 Portfolio Summary',
    details: 'Generated PDF report using AI',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari 17.0 / macOS',
    status: 'success',
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-15T14:15:00Z',
    user: { name: 'James Wilson', email: 'james.wilson@company.com' },
    action: 'user.update',
    category: 'users',
    resource: 'User: Lisa Thompson',
    details: 'Changed role from Viewer to Analyst',
    ipAddress: '192.168.1.103',
    userAgent: 'Chrome 120.0 / Windows',
    status: 'success',
  },
  {
    id: 'LOG-005',
    timestamp: '2024-01-15T14:10:00Z',
    user: { name: 'System', email: 'system@platform.com' },
    action: 'api.rate_limit',
    category: 'security',
    resource: 'API Gateway',
    details: 'Rate limit exceeded for API key: ak_prod_xxx',
    ipAddress: '45.33.128.100',
    userAgent: 'API Client v2.1',
    status: 'warning',
  },
  {
    id: 'LOG-006',
    timestamp: '2024-01-15T14:05:00Z',
    user: { name: 'Unknown', email: 'unknown' },
    action: 'user.login_failed',
    category: 'security',
    resource: 'Auth System',
    details: 'Failed login attempt for admin@company.com',
    ipAddress: '103.45.67.89',
    userAgent: 'curl/7.88.0',
    status: 'error',
  },
  {
    id: 'LOG-007',
    timestamp: '2024-01-15T14:00:00Z',
    user: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    action: 'settings.update',
    category: 'settings',
    resource: 'Organization Settings',
    details: 'Updated password policy: minimum length changed to 12',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0 / macOS',
    status: 'success',
  },
  {
    id: 'LOG-008',
    timestamp: '2024-01-15T13:55:00Z',
    user: { name: 'Michael Chen', email: 'michael.chen@company.com' },
    action: 'property.delete',
    category: 'properties',
    resource: 'Property: 123 Test Street',
    details: 'Archived property PROP-999',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 121.0 / Windows',
    status: 'success',
  },
];

const actionCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'users', label: 'Users' },
  { value: 'valuations', label: 'Valuations' },
  { value: 'properties', label: 'Properties' },
  { value: 'reports', label: 'Reports' },
  { value: 'settings', label: 'Settings' },
  { value: 'security', label: 'Security' },
];

export default function AuditPage() {
  const [logs] = useState(mockAuditLogs);
  const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">{status}</Badge>;
      case 'warning':
        return <Badge variant="warning">{status}</Badge>;
      case 'error':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="ghost">{status}</Badge>;
    }
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <LoginIcon className="h-4 w-4" />;
      case 'users':
        return <UserIcon className="h-4 w-4" />;
      case 'valuations':
        return <ChartIcon className="h-4 w-4" />;
      case 'properties':
        return <BuildingIcon className="h-4 w-4" />;
      case 'reports':
        return <DocumentIcon className="h-4 w-4" />;
      case 'settings':
        return <SettingsIcon className="h-4 w-4" />;
      case 'security':
        return <ShieldIcon className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const totalEvents = logs.length;
  const securityEvents = logs.filter(l => l.category === 'security').length;
  const errorEvents = logs.filter(l => l.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all system activities and security events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<DownloadIcon className="h-4 w-4" />}>
            Export Logs
          </Button>
          <Button variant="outline" leftIcon={<RefreshIcon className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents.toString()}
          change={{ value: 245, label: 'today' }}
          trend="up"
          icon={<ActivityIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Security Events"
          value={securityEvents.toString()}
          icon={<ShieldIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Errors"
          value={errorEvents.toString()}
          trend={errorEvents > 0 ? 'up' : undefined}
          icon={<AlertIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Active Sessions"
          value="42"
          change={{ value: 5, label: 'new today' }}
          trend="up"
          icon={<UsersIcon className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card variant="outline" padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search logs..."
            className="w-64"
            leftIcon={<SearchIcon className="h-4 w-4" />}
          />
          <Select
            options={actionCategories}
            placeholder="Category"
            className="w-40"
          />
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'success', label: 'Success' },
              { value: 'warning', label: 'Warning' },
              { value: 'error', label: 'Error' },
            ]}
            placeholder="Status"
            className="w-32"
          />
          <Select
            options={[
              { value: '1h', label: 'Last hour' },
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: 'custom', label: 'Custom range' },
            ]}
            defaultValue="24h"
            className="w-36"
          />
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card variant="elevated" padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} onClick={() => setSelectedLog(log)}>
                <TableCell>
                  <div>
                    <p className="font-medium">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar name={log.user.name} size="sm" />
                    <div>
                      <p className="font-medium text-sm">{log.user.name}</p>
                      <p className="text-xs text-muted-foreground">{log.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-muted">
                      {getActionIcon(log.category)}
                    </div>
                    <div>
                      <p className="font-mono text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground capitalize">{log.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm truncate max-w-[200px]">{log.resource}</p>
                </TableCell>
                <TableCell>
                  <p className="font-mono text-sm">{log.ipAddress}</p>
                </TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={currentPage}
          totalPages={50}
          onPageChange={setCurrentPage}
          totalItems={500}
          pageSize={10}
          onPageSizeChange={() => {}}
        />
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} size="lg">
          <ModalHeader>
            <ModalTitle>Event Details</ModalTitle>
            <ModalDescription>
              {selectedLog.id} • {new Date(selectedLog.timestamp).toLocaleString()}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(selectedLog.status)}
              </div>

              {/* User Info */}
              <div>
                <h4 className="font-medium mb-2">User</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar name={selectedLog.user.name} size="md" />
                  <div>
                    <p className="font-medium">{selectedLog.user.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Action Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Action</h4>
                  <p className="font-mono bg-muted/50 p-2 rounded">{selectedLog.action}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <p className="capitalize bg-muted/50 p-2 rounded">{selectedLog.category}</p>
                </div>
              </div>

              {/* Resource */}
              <div>
                <h4 className="font-medium mb-2">Resource</h4>
                <p className="bg-muted/50 p-2 rounded">{selectedLog.resource}</p>
              </div>

              {/* Details */}
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <p className="bg-muted/50 p-2 rounded">{selectedLog.details}</p>
              </div>

              {/* Technical Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">IP Address</h4>
                  <p className="font-mono bg-muted/50 p-2 rounded">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Agent</h4>
                  <p className="text-sm bg-muted/50 p-2 rounded">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
            <Button variant="outline" leftIcon={<CopyIcon className="h-4 w-4" />}>
              Copy Details
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
