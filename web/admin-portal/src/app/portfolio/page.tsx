'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';

// Mock portfolio data
const mockPortfolios = [
  {
    id: 'PORT-001',
    name: 'Manhattan Office Core',
    description: 'Trophy office buildings in Manhattan CBD',
    propertyCount: 12,
    totalValue: 4500000000,
    totalSqft: 8750000,
    avgCapRate: 5.2,
    avgOccupancy: 94.5,
    yoyChange: 8.3,
    properties: ['350 Fifth Ave', '200 Park Ave', '1 World Trade'],
    lastValuation: '2024-01-15',
    status: 'active',
  },
  {
    id: 'PORT-002',
    name: 'Industrial Logistics Fund',
    description: 'Distribution and logistics facilities',
    propertyCount: 28,
    totalValue: 1200000000,
    totalSqft: 12500000,
    avgCapRate: 6.8,
    avgOccupancy: 98.2,
    yoyChange: 12.5,
    properties: ['LAX Logistics Center', 'Chicago O\'Hare Hub'],
    lastValuation: '2024-01-12',
    status: 'active',
  },
  {
    id: 'PORT-003',
    name: 'Sunbelt Multifamily',
    description: 'Class A apartments in growth markets',
    propertyCount: 45,
    totalValue: 2800000000,
    totalSqft: 18500000,
    avgCapRate: 4.9,
    avgOccupancy: 96.1,
    yoyChange: 6.7,
    properties: ['Austin Towers', 'Phoenix Gardens', 'Dallas Heights'],
    lastValuation: '2024-01-10',
    status: 'active',
  },
  {
    id: 'PORT-004',
    name: 'Retail Recovery Fund',
    description: 'Value-add retail repositioning',
    propertyCount: 18,
    totalValue: 650000000,
    totalSqft: 4200000,
    avgCapRate: 7.5,
    avgOccupancy: 82.3,
    yoyChange: -2.1,
    properties: ['Metro Mall', 'Gateway Plaza'],
    lastValuation: '2024-01-08',
    status: 'under_review',
  },
];

// Property type distribution
const propertyDistribution = [
  { type: 'Office', value: 45, color: 'hsl(var(--chart-1))' },
  { type: 'Industrial', value: 25, color: 'hsl(var(--chart-2))' },
  { type: 'Multifamily', value: 20, color: 'hsl(var(--chart-3))' },
  { type: 'Retail', value: 10, color: 'hsl(var(--chart-4))' },
];

export default function PortfolioPage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof mockPortfolios[0] | null>(null);
  const [newPortfolioModal, setNewPortfolioModal] = useState(false);
  const { success } = useToast();

  const handleCreatePortfolio = () => {
    success('Portfolio Created', 'Your new portfolio has been created successfully.');
    setNewPortfolioModal(false);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatSqft = (sqft: number) => {
    if (sqft >= 1000000) return `${(sqft / 1000000).toFixed(1)}M SF`;
    return `${(sqft / 1000).toFixed(0)}K SF`;
  };

  const totalPortfolioValue = mockPortfolios.reduce((sum, p) => sum + p.totalValue, 0);
  const totalProperties = mockPortfolios.reduce((sum, p) => sum + p.propertyCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Track and analyze your commercial real estate portfolios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<DownloadIcon className="h-4 w-4" />}>
            Export All
          </Button>
          <Button onClick={() => setNewPortfolioModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
            New Portfolio
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total AUM"
          value={formatValue(totalPortfolioValue)}
          change={{ value: 7.8, label: 'vs last quarter' }}
          trend="up"
          icon={<DollarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Properties"
          value={totalProperties.toLocaleString()}
          change={{ value: 8, label: 'new this year' }}
          trend="up"
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Cap Rate"
          value="5.8%"
          change={{ value: -0.3 }}
          trend="down"
          icon={<PercentIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Occupancy"
          value="93.2%"
          change={{ value: 1.5 }}
          trend="up"
          icon={<UsersIcon className="h-5 w-5" />}
        />
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Type Distribution */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle size="sm">Property Type Allocation</CardTitle>
            <CardDescription>By market value</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {propertyDistribution.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.value} className="w-24 h-2" />
                    <span className="text-sm text-muted-foreground w-10 text-right">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader>
            <CardTitle size="sm">Geographic Distribution</CardTitle>
            <CardDescription>Portfolio presence by region</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { region: 'Northeast', value: 38, markets: ['NYC', 'Boston'] },
                { region: 'Southeast', value: 28, markets: ['Miami', 'Atlanta'] },
                { region: 'West', value: 22, markets: ['LA', 'Seattle'] },
                { region: 'Central', value: 12, markets: ['Chicago', 'Dallas'] },
              ].map((region) => (
                <div key={region.region} className="text-center p-4 rounded-lg bg-muted/50">
                  <CircularProgress
                    value={region.value}
                    size={60}
                    strokeWidth={5}
                    className="mx-auto"
                  />
                  <p className="font-medium mt-2">{region.region}</p>
                  <p className="text-xs text-muted-foreground">{region.markets.join(', ')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolios List */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">Your Portfolios</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search portfolios..."
                className="w-64"
                leftIcon={<SearchIcon className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'under_review', label: 'Under Review' },
                ]}
                placeholder="Status"
                className="w-36"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {mockPortfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{portfolio.name}</h3>
                    <StatusBadge
                      status={portfolio.status === 'active' ? 'success' : 'warning'}
                      label={portfolio.status.replace('_', ' ')}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{portfolio.propertyCount} properties</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RulerIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatSqft(portfolio.totalSqft)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PercentIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{portfolio.avgCapRate}% cap rate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{portfolio.avgOccupancy}% occupied</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">{formatValue(portfolio.totalValue)}</p>
                  <p className={`text-sm ${portfolio.yoyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {portfolio.yoyChange >= 0 ? '+' : ''}{portfolio.yoyChange}% YoY
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valued {new Date(portfolio.lastValuation).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* New Portfolio Modal */}
      <Modal isOpen={newPortfolioModal} onClose={() => setNewPortfolioModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Create New Portfolio</ModalTitle>
          <ModalDescription>
            Set up a new portfolio to track your commercial real estate investments
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Portfolio Name" placeholder="Enter portfolio name" />
            <Input label="Description" placeholder="Brief description of the portfolio strategy" />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Investment Strategy"
                options={[
                  { value: 'core', label: 'Core' },
                  { value: 'core-plus', label: 'Core-Plus' },
                  { value: 'value-add', label: 'Value-Add' },
                  { value: 'opportunistic', label: 'Opportunistic' },
                ]}
                placeholder="Select strategy"
              />
              <Select
                label="Primary Property Type"
                options={[
                  { value: 'office', label: 'Office' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'industrial', label: 'Industrial' },
                  { value: 'multifamily', label: 'Multifamily' },
                  { value: 'mixed', label: 'Mixed Use' },
                ]}
                placeholder="Select type"
              />
            </div>
            <Select
              label="Target Markets"
              options={[
                { value: 'nyc', label: 'New York' },
                { value: 'la', label: 'Los Angeles' },
                { value: 'chicago', label: 'Chicago' },
                { value: 'miami', label: 'Miami' },
                { value: 'dallas', label: 'Dallas' },
              ]}
              placeholder="Select markets"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setNewPortfolioModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePortfolio}>
            Create Portfolio
          </Button>
        </ModalFooter>
      </Modal>

      {/* Portfolio Detail Modal */}
      {selectedPortfolio && (
        <Modal isOpen={!!selectedPortfolio} onClose={() => setSelectedPortfolio(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedPortfolio.name}</ModalTitle>
            <ModalDescription>{selectedPortfolio.description}</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">{formatValue(selectedPortfolio.totalValue)}</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Properties</p>
                  <p className="text-xl font-bold">{selectedPortfolio.propertyCount}</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Cap Rate</p>
                  <p className="text-xl font-bold">{selectedPortfolio.avgCapRate}%</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="text-xl font-bold">{selectedPortfolio.avgOccupancy}%</p>
                </Card>
              </div>

              {/* Performance */}
              <Card variant="outline" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Year-over-Year Performance</h4>
                    <p className="text-sm text-muted-foreground">Value change since last year</p>
                  </div>
                  <div className={`text-2xl font-bold ${selectedPortfolio.yoyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {selectedPortfolio.yoyChange >= 0 ? '+' : ''}{selectedPortfolio.yoyChange}%
                  </div>
                </div>
                <Progress
                  value={50 + selectedPortfolio.yoyChange * 2}
                  className="mt-4"
                  variant={selectedPortfolio.yoyChange >= 0 ? 'success' : 'destructive'}
                />
              </Card>

              {/* Top Properties */}
              <div>
                <h4 className="font-medium mb-3">Featured Properties</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedPortfolio.properties.map((property, i) => (
                    <Card key={i} variant="outline" padding="sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BuildingIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{property}</p>
                          <p className="text-xs text-muted-foreground">Top performer</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" leftIcon={<SparklesIcon className="h-4 w-4" />}>
                  AI Analysis
                </Button>
                <Button variant="outline" size="sm" leftIcon={<DocumentIcon className="h-4 w-4" />}>
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" leftIcon={<RefreshIcon className="h-4 w-4" />}>
                  Revalue All
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedPortfolio(null)}>
              Close
            </Button>
            <Button>
              View Full Details
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function PercentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

function RulerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
