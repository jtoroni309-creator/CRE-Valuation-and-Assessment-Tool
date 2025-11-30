'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { Tooltip } from '@/components/ui/Tooltip';

// Mock comparable sales data
const mockComparables = [
  {
    id: 'COMP-001',
    address: '100 Park Avenue, New York, NY',
    propertyType: 'Office',
    saleDate: '2024-01-05',
    salePrice: 45000000,
    pricePerSqft: 520,
    buildingSize: 86538,
    yearBuilt: 1998,
    capRate: 5.8,
    similarity: 94,
    adjustedPrice: 47250000,
    distance: 0.3,
  },
  {
    id: 'COMP-002',
    address: '250 Madison Avenue, New York, NY',
    propertyType: 'Office',
    saleDate: '2023-11-15',
    salePrice: 38500000,
    pricePerSqft: 485,
    buildingSize: 79381,
    yearBuilt: 2001,
    capRate: 6.1,
    similarity: 89,
    adjustedPrice: 41000000,
    distance: 0.5,
  },
  {
    id: 'COMP-003',
    address: '500 Fifth Avenue, New York, NY',
    propertyType: 'Office',
    saleDate: '2023-09-22',
    salePrice: 52000000,
    pricePerSqft: 545,
    buildingSize: 95412,
    yearBuilt: 1995,
    capRate: 5.5,
    similarity: 86,
    adjustedPrice: 54750000,
    distance: 0.8,
  },
  {
    id: 'COMP-004',
    address: '350 Lexington Avenue, New York, NY',
    propertyType: 'Office',
    saleDate: '2023-08-10',
    salePrice: 29500000,
    pricePerSqft: 415,
    buildingSize: 71084,
    yearBuilt: 1985,
    capRate: 6.5,
    similarity: 78,
    adjustedPrice: 32000000,
    distance: 1.2,
  },
];

export default function ComparablesPage() {
  const [selectedComparable, setSelectedComparable] = useState<typeof mockComparables[0] | null>(null);
  const [searchModal, setSearchModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { success } = useToast();

  const handleAISearch = () => {
    success('AI Search Started', 'Finding the best comparable properties...');
    setSearchModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Comparable Sales</h1>
          <p className="text-muted-foreground">
            AI-powered comparable property analysis and adjustments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
            {viewMode === 'grid' ? <MapIcon className="h-4 w-4 mr-2" /> : <GridIcon className="h-4 w-4 mr-2" />}
            {viewMode === 'grid' ? 'Map View' : 'Grid View'}
          </Button>
          <Button onClick={() => setSearchModal(true)} leftIcon={<SparklesIcon className="h-4 w-4" />}>
            AI Search
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Comparables"
          value="2,847"
          change={{ value: 156, label: 'this month' }}
          trend="up"
          icon={<DatabaseIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Similarity"
          value="87.3%"
          change={{ value: 3.2 }}
          trend="up"
          icon={<TargetIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Markets Covered"
          value="48"
          change={{ value: 4, label: 'new markets' }}
          trend="up"
          icon={<GlobeIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Adjustment"
          value="6.8%"
          change={{ value: -1.2 }}
          trend="down"
          icon={<AdjustmentIcon className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card variant="outline" padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search address..."
            className="w-64"
            leftIcon={<SearchIcon className="h-4 w-4" />}
          />
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'office', label: 'Office' },
              { value: 'retail', label: 'Retail' },
              { value: 'industrial', label: 'Industrial' },
              { value: 'multifamily', label: 'Multifamily' },
            ]}
            placeholder="Property Type"
            className="w-36"
          />
          <Select
            options={[
              { value: 'all', label: 'All Markets' },
              { value: 'nyc', label: 'New York' },
              { value: 'chicago', label: 'Chicago' },
              { value: 'la', label: 'Los Angeles' },
              { value: 'houston', label: 'Houston' },
            ]}
            placeholder="Market"
            className="w-36"
          />
          <Select
            options={[
              { value: '12', label: 'Last 12 months' },
              { value: '24', label: 'Last 24 months' },
              { value: '36', label: 'Last 36 months' },
            ]}
            placeholder="Time Period"
            className="w-40"
          />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select
              options={[
                { value: 'similarity', label: 'Similarity' },
                { value: 'date', label: 'Sale Date' },
                { value: 'price', label: 'Price' },
                { value: 'distance', label: 'Distance' },
              ]}
              defaultValue="similarity"
              className="w-32"
            />
          </div>
        </div>
      </Card>

      {/* Comparables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockComparables.map((comp) => (
          <Card
            key={comp.id}
            variant="elevated"
            padding="none"
            className="overflow-hidden hover:shadow-elevation-3 transition-shadow cursor-pointer"
            onClick={() => setSelectedComparable(comp)}
          >
            <div className="flex">
              {/* Map Thumbnail */}
              <div className="w-32 h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <MapPinIcon className="h-8 w-8 text-primary/50" />
              </div>

              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{comp.address.split(',')[0]}</h3>
                    <p className="text-sm text-muted-foreground">
                      {comp.address.split(',').slice(1).join(',')}
                    </p>
                  </div>
                  <Tooltip content="AI Similarity Score">
                    <div className={`
                      px-2.5 py-1 rounded-full text-sm font-medium
                      ${comp.similarity >= 90 ? 'bg-success/10 text-success' :
                        comp.similarity >= 80 ? 'bg-primary/10 text-primary' :
                        'bg-warning/10 text-warning'}
                    `}>
                      {comp.similarity}%
                    </div>
                  </Tooltip>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sale Price</p>
                    <p className="font-medium">${(comp.salePrice / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">$/SF</p>
                    <p className="font-medium">${comp.pricePerSqft}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cap Rate</p>
                    <p className="font-medium">{comp.capRate}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="ghost" size="sm">{comp.propertyType}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {comp.distance} mi away
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Sold {new Date(comp.saleDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Search Modal */}
      <Modal isOpen={searchModal} onClose={() => setSearchModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>AI Comparable Search</ModalTitle>
          <ModalDescription>
            Let Gemini AI find the most relevant comparable properties
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Subject Property Address" placeholder="Enter the property address" />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Property Type"
                options={[
                  { value: 'office', label: 'Office' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'industrial', label: 'Industrial' },
                  { value: 'multifamily', label: 'Multifamily' },
                ]}
                placeholder="Select type"
              />
              <Input label="Building Size (SF)" type="number" placeholder="0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year Built" type="number" placeholder="1990" />
              <Select
                label="Search Radius"
                options={[
                  { value: '1', label: '1 mile' },
                  { value: '3', label: '3 miles' },
                  { value: '5', label: '5 miles' },
                  { value: '10', label: '10 miles' },
                ]}
                defaultValue="3"
              />
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary">AI-Powered Search</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gemini AI will analyze market data, property characteristics, and location factors
                    to find the most relevant comparables and automatically calculate adjustments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setSearchModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAISearch} leftIcon={<SparklesIcon className="h-4 w-4" />}>
            Find Comparables
          </Button>
        </ModalFooter>
      </Modal>

      {/* Comparable Detail Modal */}
      {selectedComparable && (
        <Modal isOpen={!!selectedComparable} onClose={() => setSelectedComparable(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedComparable.address}</ModalTitle>
            <ModalDescription>
              {selectedComparable.propertyType} | {selectedComparable.buildingSize.toLocaleString()} SF
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="filled" padding="sm" className="text-center">
                  <p className="text-sm text-muted-foreground">Sale Price</p>
                  <p className="text-xl font-bold">${(selectedComparable.salePrice / 1000000).toFixed(1)}M</p>
                </Card>
                <Card variant="filled" padding="sm" className="text-center">
                  <p className="text-sm text-muted-foreground">Price/SF</p>
                  <p className="text-xl font-bold">${selectedComparable.pricePerSqft}</p>
                </Card>
                <Card variant="filled" padding="sm" className="text-center">
                  <p className="text-sm text-muted-foreground">Cap Rate</p>
                  <p className="text-xl font-bold">{selectedComparable.capRate}%</p>
                </Card>
                <Card variant="filled" padding="sm" className="text-center">
                  <p className="text-sm text-muted-foreground">Similarity</p>
                  <p className="text-xl font-bold text-primary">{selectedComparable.similarity}%</p>
                </Card>
              </div>

              {/* Adjustments */}
              <div>
                <h4 className="font-medium mb-3">AI-Calculated Adjustments</h4>
                <Card variant="outline" padding="md">
                  <div className="space-y-3">
                    {[
                      { name: 'Location', adjustment: 2.5, reason: 'Subject in superior micro-market' },
                      { name: 'Size', adjustment: -1.2, reason: 'Subject is smaller' },
                      { name: 'Age/Condition', adjustment: 3.0, reason: 'Subject is newer build' },
                      { name: 'Market Conditions', adjustment: 0.7, reason: 'Time adjustment for appreciation' },
                    ].map((adj) => (
                      <div key={adj.name} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{adj.name}</span>
                            <span className={`text-sm ${adj.adjustment >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {adj.adjustment >= 0 ? '+' : ''}{adj.adjustment}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{adj.reason}</p>
                        </div>
                        <Progress
                          value={50 + adj.adjustment * 10}
                          className="w-24 h-2"
                          variant={adj.adjustment >= 0 ? 'success' : 'destructive'}
                        />
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="font-semibold">Total Adjustment</span>
                      <span className="text-lg font-bold text-primary">+5.0%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Adjusted Sale Price</span>
                      <span className="font-semibold">${(selectedComparable.adjustedPrice / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Property Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Building Size</dt>
                      <dd className="font-medium">{selectedComparable.buildingSize.toLocaleString()} SF</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Year Built</dt>
                      <dd className="font-medium">{selectedComparable.yearBuilt}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Property Type</dt>
                      <dd className="font-medium">{selectedComparable.propertyType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Distance</dt>
                      <dd className="font-medium">{selectedComparable.distance} miles</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Transaction Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sale Date</dt>
                      <dd className="font-medium">{new Date(selectedComparable.saleDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sale Price</dt>
                      <dd className="font-medium">${selectedComparable.salePrice.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Cap Rate</dt>
                      <dd className="font-medium">{selectedComparable.capRate}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Comparable ID</dt>
                      <dd className="font-mono text-xs">{selectedComparable.id}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedComparable(null)}>
              Close
            </Button>
            <Button variant="outline" leftIcon={<DocumentIcon className="h-4 w-4" />}>
              Export Details
            </Button>
            <Button leftIcon={<CheckIcon className="h-4 w-4" />}>
              Use in Valuation
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AdjustmentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
