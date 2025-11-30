'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

// Mock organizations data
const mockOrganizations = [
  {
    id: 'ORG-001',
    name: 'Apex Commercial Realty',
    domain: 'apexcommercial.com',
    plan: 'Enterprise',
    status: 'active',
    users: 45,
    maxUsers: 100,
    properties: 2500,
    storage: { used: 45.2, total: 100 },
    createdAt: '2023-01-15T00:00:00Z',
    billingContact: 'billing@apexcommercial.com',
    logo: null,
  },
  {
    id: 'ORG-002',
    name: 'Metro Assessment Group',
    domain: 'metroassess.com',
    plan: 'Professional',
    status: 'active',
    users: 22,
    maxUsers: 50,
    properties: 1200,
    storage: { used: 28.5, total: 50 },
    createdAt: '2023-04-20T00:00:00Z',
    billingContact: 'finance@metroassess.com',
    logo: null,
  },
  {
    id: 'ORG-003',
    name: 'Valley Properties Inc',
    domain: 'valleyprops.com',
    plan: 'Starter',
    status: 'trial',
    users: 5,
    maxUsers: 10,
    properties: 150,
    storage: { used: 3.2, total: 10 },
    createdAt: '2024-01-01T00:00:00Z',
    billingContact: 'admin@valleyprops.com',
    logo: null,
  },
];

const plans = [
  { id: 'starter', name: 'Starter', users: 10, storage: 10, price: 99 },
  { id: 'professional', name: 'Professional', users: 50, storage: 50, price: 299 },
  { id: 'enterprise', name: 'Enterprise', users: 100, storage: 100, price: 799 },
];

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [selectedOrg, setSelectedOrg] = useState<typeof mockOrganizations[0] | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const { success, error } = useToast();

  const [newOrg, setNewOrg] = useState({
    name: '',
    domain: '',
    plan: '',
    billingContact: '',
  });

  const handleCreateOrganization = () => {
    if (!newOrg.name || !newOrg.domain || !newOrg.plan) {
      error('Missing Information', 'Please fill in all required fields');
      return;
    }
    success('Organization Created', `"${newOrg.name}" has been created`);
    setCreateModal(false);
    setNewOrg({ name: '', domain: '', plan: '', billingContact: '' });
  };

  const getPlanBadge = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise':
        return <Badge variant="primary">{plan}</Badge>;
      case 'professional':
        return <Badge variant="secondary">{plan}</Badge>;
      default:
        return <Badge variant="ghost">{plan}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage tenants and multi-organization access
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
          Add Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organizations"
          value={organizations.length.toString()}
          change={{ value: 1, label: 'this month' }}
          trend="up"
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Active Users"
          value={organizations.reduce((sum, o) => sum + o.users, 0).toString()}
          change={{ value: 12 }}
          trend="up"
          icon={<UsersIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total Properties"
          value={(organizations.reduce((sum, o) => sum + o.properties, 0) / 1000).toFixed(1) + 'K'}
          change={{ value: 8.5 }}
          trend="up"
          icon={<HomeIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Storage Used"
          value={organizations.reduce((sum, o) => sum + o.storage.used, 0).toFixed(0) + ' GB'}
          icon={<StorageIcon className="h-5 w-5" />}
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <Card
            key={org.id}
            variant="elevated"
            padding="lg"
            className="cursor-pointer hover:shadow-elevation-3 transition-shadow"
            onClick={() => setSelectedOrg(org)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BuildingIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{org.name}</h3>
                  <p className="text-sm text-muted-foreground">{org.domain}</p>
                </div>
              </div>
              <StatusBadge
                status={org.status === 'active' ? 'success' : org.status === 'trial' ? 'warning' : 'inactive'}
                label={org.status}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{org.users}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{(org.properties / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Properties</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{org.storage.used.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">GB Used</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Storage</span>
                <span>{org.storage.used.toFixed(1)} / {org.storage.total} GB</span>
              </div>
              <Progress value={(org.storage.used / org.storage.total) * 100} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              {getPlanBadge(org.plan)}
              <span className="text-sm text-muted-foreground">
                Since {new Date(org.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <Modal isOpen={!!selectedOrg} onClose={() => setSelectedOrg(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedOrg.name}</ModalTitle>
            <ModalDescription>{selectedOrg.domain}</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card variant="filled" padding="md" className="text-center">
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="text-xl font-bold">{selectedOrg.plan}</p>
                    </Card>
                    <Card variant="filled" padding="md" className="text-center">
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="text-xl font-bold">{selectedOrg.users} / {selectedOrg.maxUsers}</p>
                    </Card>
                    <Card variant="filled" padding="md" className="text-center">
                      <p className="text-sm text-muted-foreground">Properties</p>
                      <p className="text-xl font-bold">{selectedOrg.properties.toLocaleString()}</p>
                    </Card>
                    <Card variant="filled" padding="md" className="text-center">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-xl font-bold capitalize">{selectedOrg.status}</p>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Organization Details</h4>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-muted-foreground">Organization ID</dt>
                        <dd className="font-mono text-sm">{selectedOrg.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Domain</dt>
                        <dd>{selectedOrg.domain}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Billing Contact</dt>
                        <dd>{selectedOrg.billingContact}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Created</dt>
                        <dd>{new Date(selectedOrg.createdAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="usage">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">User Seats</span>
                      <span>{selectedOrg.users} / {selectedOrg.maxUsers}</span>
                    </div>
                    <Progress value={(selectedOrg.users / selectedOrg.maxUsers) * 100} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedOrg.maxUsers - selectedOrg.users} seats available
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Storage</span>
                      <span>{selectedOrg.storage.used.toFixed(1)} / {selectedOrg.storage.total} GB</span>
                    </div>
                    <Progress
                      value={(selectedOrg.storage.used / selectedOrg.storage.total) * 100}
                      variant={selectedOrg.storage.used / selectedOrg.storage.total > 0.8 ? 'warning' : 'default'}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {(selectedOrg.storage.total - selectedOrg.storage.used).toFixed(1)} GB remaining
                    </p>
                  </div>

                  <Card variant="outline" padding="md">
                    <h4 className="font-medium mb-2">Need more resources?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to a higher plan to get more users and storage.
                    </p>
                    <Button variant="outline" size="sm">
                      Upgrade Plan
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <Input
                    label="Organization Name"
                    defaultValue={selectedOrg.name}
                  />
                  <Input
                    label="Domain"
                    defaultValue={selectedOrg.domain}
                  />
                  <Input
                    label="Billing Contact Email"
                    type="email"
                    defaultValue={selectedOrg.billingContact}
                  />
                  <Select
                    label="Subscription Plan"
                    options={plans.map(p => ({ value: p.id, label: `${p.name} - $${p.price}/mo` }))}
                    defaultValue={selectedOrg.plan.toLowerCase()}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedOrg(null)}>
              Close
            </Button>
            <Button>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Create Organization Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Add Organization</ModalTitle>
          <ModalDescription>
            Create a new organization tenant
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Organization Name"
              placeholder="Enter organization name"
              value={newOrg.name}
              onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            />
            <Input
              label="Domain"
              placeholder="company.com"
              value={newOrg.domain}
              onChange={(e) => setNewOrg({ ...newOrg, domain: e.target.value })}
            />
            <Select
              label="Subscription Plan"
              options={plans.map(p => ({
                value: p.id,
                label: `${p.name} - ${p.users} users, ${p.storage}GB - $${p.price}/mo`,
              }))}
              placeholder="Select a plan"
              value={newOrg.plan}
              onChange={(value) => setNewOrg({ ...newOrg, plan: value })}
            />
            <Input
              label="Billing Contact Email"
              type="email"
              placeholder="billing@company.com"
              value={newOrg.billingContact}
              onChange={(e) => setNewOrg({ ...newOrg, billingContact: e.target.value })}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrganization}>
            Create Organization
          </Button>
        </ModalFooter>
      </Modal>
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

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function StorageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}
