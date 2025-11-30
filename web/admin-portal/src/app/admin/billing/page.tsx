'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

// Current subscription details
const subscription = {
  plan: 'Enterprise',
  status: 'active',
  price: 799,
  billingCycle: 'monthly',
  nextBilling: '2024-02-15',
  users: { current: 45, limit: 100 },
  storage: { current: 45.2, limit: 100 },
  apiCalls: { current: 125000, limit: 500000 },
  aiTokens: { current: 450000, limit: 1000000 },
};

// Available plans
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    description: 'For small teams getting started',
    features: ['10 users', '10 GB storage', '50K API calls/mo', '100K AI tokens/mo', 'Email support'],
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    description: 'For growing organizations',
    features: ['50 users', '50 GB storage', '200K API calls/mo', '500K AI tokens/mo', 'Priority support', 'SSO'],
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    description: 'For large enterprises',
    features: ['100 users', '100 GB storage', '500K API calls/mo', '1M AI tokens/mo', '24/7 support', 'SSO', 'Custom integrations', 'SLA'],
    highlighted: true,
  },
];

// Invoice history
const invoices = [
  { id: 'INV-2024-001', date: '2024-01-15', amount: 799, status: 'paid' },
  { id: 'INV-2023-012', date: '2023-12-15', amount: 799, status: 'paid' },
  { id: 'INV-2023-011', date: '2023-11-15', amount: 799, status: 'paid' },
  { id: 'INV-2023-010', date: '2023-10-15', amount: 799, status: 'paid' },
];

export default function BillingPage() {
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { success } = useToast();

  const handleUpgrade = () => {
    success('Plan Updated', 'Your subscription has been updated successfully');
    setUpgradeModal(false);
    setSelectedPlan(null);
  };

  const formatUsage = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    return {
      percentage,
      variant: percentage > 90 ? 'destructive' : percentage > 75 ? 'warning' : 'default',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and billing details
          </p>
        </div>
        <Button onClick={() => setUpgradeModal(true)}>
          Change Plan
        </Button>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{subscription.plan}</h2>
                <Badge variant="success">{subscription.status}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                ${subscription.price}/month • Billed {subscription.billingCycle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="font-semibold">{new Date(subscription.nextBilling).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Users', current: subscription.users.current, limit: subscription.users.limit, unit: '' },
              { label: 'Storage', current: subscription.storage.current, limit: subscription.storage.limit, unit: ' GB' },
              { label: 'API Calls', current: subscription.apiCalls.current / 1000, limit: subscription.apiCalls.limit / 1000, unit: 'K' },
              { label: 'AI Tokens', current: subscription.aiTokens.current / 1000, limit: subscription.aiTokens.limit / 1000, unit: 'K' },
            ].map((item) => {
              const usage = formatUsage(item.current, item.limit);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">
                      {item.current}{item.unit} / {item.limit}{item.unit}
                    </span>
                  </div>
                  <Progress value={usage.percentage} variant={usage.variant as any} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle size="sm">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <div className="h-10 w-14 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" fullWidth>
              Update Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Invoices and Usage */}
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoice History</TabsTrigger>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6">
          <Card variant="elevated" padding="none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="elevated" padding="lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle size="sm">API Calls This Month</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold">
                  {(subscription.apiCalls.current / 1000).toFixed(0)}K
                  <span className="text-lg text-muted-foreground font-normal">
                    {' '}/ {(subscription.apiCalls.limit / 1000).toFixed(0)}K
                  </span>
                </div>
                <Progress
                  value={(subscription.apiCalls.current / subscription.apiCalls.limit) * 100}
                  className="mt-4"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {((subscription.apiCalls.limit - subscription.apiCalls.current) / 1000).toFixed(0)}K calls remaining
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle size="sm">AI Tokens This Month</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold">
                  {(subscription.aiTokens.current / 1000).toFixed(0)}K
                  <span className="text-lg text-muted-foreground font-normal">
                    {' '}/ {(subscription.aiTokens.limit / 1000).toFixed(0)}K
                  </span>
                </div>
                <Progress
                  value={(subscription.aiTokens.current / subscription.aiTokens.limit) * 100}
                  className="mt-4"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {((subscription.aiTokens.limit - subscription.aiTokens.current) / 1000).toFixed(0)}K tokens remaining
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle size="sm">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold">
                  {subscription.storage.current.toFixed(1)} GB
                  <span className="text-lg text-muted-foreground font-normal">
                    {' '}/ {subscription.storage.limit} GB
                  </span>
                </div>
                <Progress
                  value={(subscription.storage.current / subscription.storage.limit) * 100}
                  className="mt-4"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {(subscription.storage.limit - subscription.storage.current).toFixed(1)} GB available
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle size="sm">User Seats</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl font-bold">
                  {subscription.users.current}
                  <span className="text-lg text-muted-foreground font-normal">
                    {' '}/ {subscription.users.limit}
                  </span>
                </div>
                <Progress
                  value={(subscription.users.current / subscription.users.limit) * 100}
                  className="mt-4"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {subscription.users.limit - subscription.users.current} seats available
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Modal */}
      <Modal isOpen={upgradeModal} onClose={() => setUpgradeModal(false)} size="xl">
        <ModalHeader>
          <ModalTitle>Change Plan</ModalTitle>
          <ModalDescription>
            Select a plan that best fits your needs
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                variant={plan.highlighted ? 'elevated' : 'outline'}
                padding="lg"
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                } ${plan.highlighted ? 'border-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.highlighted && (
                  <Badge variant="primary" className="mb-2">Most Popular</Badge>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {subscription.plan.toLowerCase() === plan.id && (
                  <Badge variant="ghost" className="mt-4">Current Plan</Badge>
                )}
              </Card>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setUpgradeModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={!selectedPlan || selectedPlan === subscription.plan.toLowerCase()}>
            {selectedPlan && plans.find(p => p.id === selectedPlan)?.price! > subscription.price
              ? 'Upgrade Plan'
              : 'Downgrade Plan'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// Icons
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
