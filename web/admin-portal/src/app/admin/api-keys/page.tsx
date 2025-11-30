'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';

// Mock API keys
const mockApiKeys = [
  {
    id: 'KEY-001',
    name: 'Production API',
    keyPrefix: 'ak_prod_xxx...xxx',
    fullKey: null, // Only shown once on creation
    environment: 'production',
    status: 'active',
    permissions: ['read', 'write'],
    usageLimit: 500000,
    usageCount: 125000,
    lastUsed: '2024-01-15T14:30:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    expiresAt: '2024-06-01T00:00:00Z',
    createdBy: 'Sarah Johnson',
  },
  {
    id: 'KEY-002',
    name: 'Development API',
    keyPrefix: 'ak_dev_xxx...xxx',
    fullKey: null,
    environment: 'development',
    status: 'active',
    permissions: ['read', 'write'],
    usageLimit: 100000,
    usageCount: 45000,
    lastUsed: '2024-01-15T10:15:00Z',
    createdAt: '2023-09-15T00:00:00Z',
    expiresAt: null,
    createdBy: 'Michael Chen',
  },
  {
    id: 'KEY-003',
    name: 'Analytics Integration',
    keyPrefix: 'ak_prod_yyy...yyy',
    fullKey: null,
    environment: 'production',
    status: 'active',
    permissions: ['read'],
    usageLimit: 1000000,
    usageCount: 750000,
    lastUsed: '2024-01-15T14:28:00Z',
    createdAt: '2023-07-20T00:00:00Z',
    expiresAt: '2024-07-20T00:00:00Z',
    createdBy: 'Sarah Johnson',
  },
  {
    id: 'KEY-004',
    name: 'Old Integration (Deprecated)',
    keyPrefix: 'ak_prod_zzz...zzz',
    fullKey: null,
    environment: 'production',
    status: 'revoked',
    permissions: ['read'],
    usageLimit: 100000,
    usageCount: 98500,
    lastUsed: '2024-01-10T08:00:00Z',
    createdAt: '2023-03-01T00:00:00Z',
    expiresAt: '2024-01-10T00:00:00Z',
    createdBy: 'James Wilson',
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [createModal, setCreateModal] = useState(false);
  const [newKeyModal, setNewKeyModal] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<typeof mockApiKeys[0] | null>(null);
  const { success, error } = useToast();

  const [form, setForm] = useState({
    name: '',
    environment: '',
    permissions: [] as string[],
    expiresIn: '',
    usageLimit: '',
  });

  const handleCreateKey = () => {
    if (!form.name || !form.environment) {
      error('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Generate mock key
    const generatedKey = `ak_${form.environment.substring(0, 4)}_${Array(32).fill(0).map(() =>
      'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))
    ).join('')}`;

    setNewKey(generatedKey);
    setCreateModal(false);
    setNewKeyModal(true);
    setForm({ name: '', environment: '', permissions: [], expiresIn: '', usageLimit: '' });
  };

  const handleCopyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      success('Copied', 'API key copied to clipboard');
    }
  };

  const handleRevokeKey = (key: typeof mockApiKeys[0]) => {
    setApiKeys(apiKeys.map(k => k.id === key.id ? { ...k, status: 'revoked' } : k));
    success('Key Revoked', `"${key.name}" has been revoked`);
    setSelectedKey(null);
  };

  const activeKeys = apiKeys.filter(k => k.status === 'active').length;
  const totalRequests = apiKeys.reduce((sum, k) => sum + k.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for external integrations
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
          Create API Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Keys"
          value={apiKeys.length.toString()}
          icon={<KeyIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Active Keys"
          value={activeKeys.toString()}
          icon={<CheckIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total Requests"
          value={`${(totalRequests / 1000).toFixed(0)}K`}
          change={{ value: 12, label: 'this month' }}
          trend="up"
          icon={<ApiIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Usage"
          value={`${Math.round((apiKeys.filter(k => k.status === 'active').reduce((sum, k) => sum + (k.usageCount / k.usageLimit) * 100, 0) / activeKeys))}%`}
          icon={<ChartIcon className="h-5 w-5" />}
        />
      </div>

      {/* Security Notice */}
      <Card variant="outline" padding="md" className="border-warning/50 bg-warning/5">
        <div className="flex items-start gap-3">
          <AlertIcon className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning">Security Notice</p>
            <p className="text-sm text-muted-foreground mt-1">
              API keys provide full access to your account's data. Never share your API keys or commit them to version control.
              Use environment variables to store keys securely.
            </p>
          </div>
        </div>
      </Card>

      {/* API Keys Table */}
      <Card variant="elevated" padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created by {key.createdBy}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{key.keyPrefix}</code>
                </TableCell>
                <TableCell>
                  <Badge variant={key.environment === 'production' ? 'destructive' : 'secondary'}>
                    {key.environment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-32">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{(key.usageCount / 1000).toFixed(0)}K</span>
                      <span className="text-muted-foreground">/ {(key.usageLimit / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress
                      value={(key.usageCount / key.usageLimit) * 100}
                      variant={key.usageCount / key.usageLimit > 0.9 ? 'destructive' : 'default'}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(key.lastUsed).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={key.status === 'active' ? 'success' : 'inactive'}
                    label={key.status}
                  />
                </TableCell>
                <TableCell>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <DotsIcon className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem
                      icon={<EyeIcon className="h-4 w-4" />}
                      onClick={() => setSelectedKey(key)}
                    >
                      View Details
                    </DropdownItem>
                    <DropdownItem icon={<CopyIcon className="h-4 w-4" />}>
                      Copy Key Prefix
                    </DropdownItem>
                    <DropdownItem icon={<RefreshIcon className="h-4 w-4" />}>
                      Regenerate
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      icon={<TrashIcon className="h-4 w-4" />}
                      destructive
                      onClick={() => handleRevokeKey(key)}
                      disabled={key.status === 'revoked'}
                    >
                      Revoke Key
                    </DropdownItem>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create API Key Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Create API Key</ModalTitle>
          <ModalDescription>
            Generate a new API key for external integrations
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Key Name"
              placeholder="e.g., Production API"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              helperText="A descriptive name to identify this key"
            />
            <Select
              label="Environment"
              options={[
                { value: 'production', label: 'Production' },
                { value: 'development', label: 'Development' },
                { value: 'staging', label: 'Staging' },
              ]}
              placeholder="Select environment"
              value={form.environment}
              onChange={(value) => setForm({ ...form, environment: value })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Permissions</label>
              <div className="space-y-2">
                {[
                  { id: 'read', label: 'Read', description: 'View data and generate reports' },
                  { id: 'write', label: 'Write', description: 'Create and modify data' },
                  { id: 'delete', label: 'Delete', description: 'Remove data (use with caution)' },
                ].map((perm) => (
                  <label key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 rounded"
                      checked={form.permissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, permissions: [...form.permissions, perm.id] });
                        } else {
                          setForm({ ...form, permissions: form.permissions.filter(p => p !== perm.id) });
                        }
                      }}
                    />
                    <div>
                      <p className="font-medium">{perm.label}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Expiration"
                options={[
                  { value: 'never', label: 'Never expires' },
                  { value: '30d', label: '30 days' },
                  { value: '90d', label: '90 days' },
                  { value: '1y', label: '1 year' },
                ]}
                placeholder="Select expiration"
                value={form.expiresIn}
                onChange={(value) => setForm({ ...form, expiresIn: value })}
              />
              <Input
                label="Usage Limit (requests/month)"
                type="number"
                placeholder="e.g., 100000"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateKey}>
            Create Key
          </Button>
        </ModalFooter>
      </Modal>

      {/* New Key Display Modal */}
      <Modal isOpen={newKeyModal} onClose={() => { setNewKeyModal(false); setNewKey(null); }} size="lg">
        <ModalHeader>
          <ModalTitle>API Key Created</ModalTitle>
          <ModalDescription>
            Copy your API key now. You won't be able to see it again!
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertIcon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Important</p>
                  <p className="text-sm mt-1">
                    This is the only time you'll see your API key. Copy it now and store it securely.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your API Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {newKey}
                </code>
                <Button variant="outline" onClick={handleCopyKey} leftIcon={<CopyIcon className="h-4 w-4" />}>
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { setNewKeyModal(false); setNewKey(null); success('Key Saved', 'Make sure to store your API key securely'); }}>
            I've Saved My Key
          </Button>
        </ModalFooter>
      </Modal>

      {/* Key Details Modal */}
      {selectedKey && (
        <Modal isOpen={!!selectedKey} onClose={() => setSelectedKey(null)} size="lg">
          <ModalHeader>
            <ModalTitle>{selectedKey.name}</ModalTitle>
            <ModalDescription>API Key Details</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Key Prefix</label>
                  <p className="font-mono">{selectedKey.keyPrefix}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Environment</label>
                  <p className="capitalize">{selectedKey.environment}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <p className="capitalize">{selectedKey.status}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Created By</label>
                  <p>{selectedKey.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Created</label>
                  <p>{new Date(selectedKey.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Expires</label>
                  <p>{selectedKey.expiresAt ? new Date(selectedKey.expiresAt).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Permissions</label>
                <div className="flex gap-2 mt-1">
                  {selectedKey.permissions.map(p => (
                    <Badge key={p} variant="secondary">{p}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Usage This Month</label>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{selectedKey.usageCount.toLocaleString()} requests</span>
                    <span className="text-muted-foreground">{selectedKey.usageLimit.toLocaleString()} limit</span>
                  </div>
                  <Progress value={(selectedKey.usageCount / selectedKey.usageLimit) * 100} />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedKey(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRevokeKey(selectedKey)}
              disabled={selectedKey.status === 'revoked'}
            >
              Revoke Key
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ApiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
