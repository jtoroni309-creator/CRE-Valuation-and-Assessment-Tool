'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@/components/ui/Table';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';

// Mock property data
const mockProperties = [
  {
    id: 'PROP-001',
    address: '350 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10118',
    propertyType: 'Office',
    subType: 'Class A',
    buildingSize: 2768591,
    landArea: 83937,
    floors: 102,
    yearBuilt: 1931,
    yearRenovated: 2010,
    occupancy: 92.5,
    currentValue: 400000000,
    lastValuation: '2024-01-15',
    owner: 'Empire State Realty Trust',
    status: 'active',
    aiScore: 96,
  },
  {
    id: 'PROP-002',
    address: '200 Park Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10166',
    propertyType: 'Office',
    subType: 'Class A',
    buildingSize: 2400000,
    landArea: 60000,
    floors: 58,
    yearBuilt: 1963,
    yearRenovated: 2018,
    occupancy: 89.3,
    currentValue: 290000000,
    lastValuation: '2024-01-12',
    owner: 'SL Green Realty Corp',
    status: 'active',
    aiScore: 91,
  },
  {
    id: 'PROP-003',
    address: '1 MetroTech Center',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    propertyType: 'Office',
    subType: 'Class A',
    buildingSize: 1000000,
    landArea: 45000,
    floors: 16,
    yearBuilt: 1992,
    yearRenovated: null,
    occupancy: 95.8,
    currentValue: 130000000,
    lastValuation: '2024-01-10',
    owner: 'Forest City Ratner',
    status: 'pending_review',
    aiScore: 88,
  },
  {
    id: 'PROP-004',
    address: '500 West Monroe',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60661',
    propertyType: 'Office',
    subType: 'Class A',
    buildingSize: 1240000,
    landArea: 55000,
    floors: 45,
    yearBuilt: 1991,
    yearRenovated: 2015,
    occupancy: 87.2,
    currentValue: 185000000,
    lastValuation: '2024-01-08',
    owner: 'JLL Income Property Trust',
    status: 'active',
    aiScore: 93,
  },
  {
    id: 'PROP-005',
    address: '725 S. Figueroa Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90017',
    propertyType: 'Office',
    subType: 'Class A',
    buildingSize: 1500000,
    landArea: 75000,
    floors: 73,
    yearBuilt: 2017,
    yearRenovated: null,
    occupancy: 91.0,
    currentValue: 425000000,
    lastValuation: '2024-01-05',
    owner: 'Brookfield Properties',
    status: 'active',
    aiScore: 98,
  },
];

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null);
  const [addPropertyModal, setAddPropertyModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const { success } = useToast();

  const handleAddProperty = () => {
    success('Property Added', 'New property has been added successfully.');
    setAddPropertyModal(false);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatSqft = (sqft: number) => {
    if (sqft >= 1000000) return `${(sqft / 1000000).toFixed(2)}M`;
    return `${(sqft / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value="2,847"
          change={{ value: 124, label: 'this year' }}
          trend="up"
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total Value"
          value="$89.4B"
          change={{ value: 6.8, label: 'vs last year' }}
          trend="up"
          icon={<DollarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total SF"
          value="245M"
          change={{ value: 12.5, label: 'sqft added' }}
          trend="up"
          icon={<RulerIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Occupancy"
          value="91.8%"
          change={{ value: 2.3 }}
          trend="up"
          icon={<UsersIcon className="h-5 w-5" />}
        />
      </div>

      {/* Main Content */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Property Database</h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive property information and analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              >
                {viewMode === 'table' ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" leftIcon={<UploadIcon className="h-4 w-4" />}>
                Import
              </Button>
              <Button onClick={() => setAddPropertyModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
                Add Property
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search properties..."
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
                { value: 'miami', label: 'Miami' },
              ]}
              placeholder="Market"
              className="w-36"
            />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending Review' },
              ]}
              placeholder="Status"
              className="w-36"
            />
          </div>
        </div>

        {viewMode === 'table' ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Occupancy</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProperties.map((property) => (
                  <TableRow key={property.id} onClick={() => setSelectedProperty(property)}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{property.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {property.city}, {property.state} {property.zipCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="ghost">{property.propertyType}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{property.subType}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium">{formatSqft(property.buildingSize)} SF</p>
                      <p className="text-xs text-muted-foreground">{property.floors} floors</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatValue(property.currentValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={property.occupancy >= 90 ? 'text-success' : property.occupancy >= 80 ? 'text-warning' : 'text-destructive'}>
                        {property.occupancy}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CircularProgress
                          value={property.aiScore}
                          size={28}
                          strokeWidth={3}
                          showValue={false}
                          variant={property.aiScore >= 95 ? 'success' : property.aiScore >= 85 ? 'default' : 'warning'}
                        />
                        <span className="text-sm">{property.aiScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={property.status === 'active' ? 'success' : 'warning'}
                        label={property.status.replace('_', ' ')}
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
                        <DropdownItem icon={<EyeIcon className="h-4 w-4" />}>View Details</DropdownItem>
                        <DropdownItem icon={<SparklesIcon className="h-4 w-4" />}>AI Analysis</DropdownItem>
                        <DropdownItem icon={<EditIcon className="h-4 w-4" />}>Edit</DropdownItem>
                        <DropdownItem icon={<DocumentIcon className="h-4 w-4" />}>Generate Report</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem icon={<TrashIcon className="h-4 w-4" />} destructive>Archive</DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={currentPage}
              totalPages={285}
              onPageChange={setCurrentPage}
              totalItems={2847}
              pageSize={10}
              onPageSizeChange={() => {}}
            />
          </>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProperties.map((property) => (
              <Card
                key={property.id}
                variant="outline"
                padding="none"
                className="overflow-hidden hover:shadow-elevation-2 transition-shadow cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BuildingIcon className="h-12 w-12 text-primary/40" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{property.address}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <Badge variant="ghost" size="sm">{property.propertyType}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-semibold">{formatValue(property.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-semibold">{formatSqft(property.buildingSize)} SF</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Add Property Modal */}
      <Modal isOpen={addPropertyModal} onClose={() => setAddPropertyModal(false)} size="xl">
        <ModalHeader>
          <ModalTitle>Add New Property</ModalTitle>
          <ModalDescription>
            Enter property details or let AI extract information from documents
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Tabs defaultValue="manual">
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="ai">AI Import</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="space-y-4">
                <Input label="Property Address" placeholder="Enter street address" />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City" placeholder="City" />
                  <Select
                    label="State"
                    options={[
                      { value: 'NY', label: 'New York' },
                      { value: 'CA', label: 'California' },
                      { value: 'IL', label: 'Illinois' },
                      { value: 'TX', label: 'Texas' },
                      { value: 'FL', label: 'Florida' },
                    ]}
                    placeholder="Select state"
                  />
                  <Input label="ZIP Code" placeholder="00000" />
                </div>
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
                  <Select
                    label="Property Class"
                    options={[
                      { value: 'a', label: 'Class A' },
                      { value: 'b', label: 'Class B' },
                      { value: 'c', label: 'Class C' },
                    ]}
                    placeholder="Select class"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Building Size (SF)" type="number" placeholder="0" />
                  <Input label="Land Area (SF)" type="number" placeholder="0" />
                  <Input label="Number of Floors" type="number" placeholder="0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Year Built" type="number" placeholder="1990" />
                  <Input label="Year Renovated" type="number" placeholder="Optional" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <UploadIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">Drop documents here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload appraisals, rent rolls, or property reports
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <SparklesIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">AI Document Processing</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gemini AI will extract property details, financial data, and key metrics
                        from your uploaded documents automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setAddPropertyModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddProperty}>
            Add Property
          </Button>
        </ModalFooter>
      </Modal>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <Modal isOpen={!!selectedProperty} onClose={() => setSelectedProperty(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedProperty.address}</ModalTitle>
            <ModalDescription>
              {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-xl font-bold">{formatValue(selectedProperty.currentValue)}</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Building Size</p>
                  <p className="text-xl font-bold">{formatSqft(selectedProperty.buildingSize)} SF</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="text-xl font-bold">{selectedProperty.occupancy}%</p>
                </Card>
                <Card variant="filled" padding="md" className="text-center">
                  <p className="text-sm text-muted-foreground">AI Score</p>
                  <p className="text-xl font-bold text-primary">{selectedProperty.aiScore}</p>
                </Card>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Building Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Property Type</dt>
                      <dd className="font-medium">{selectedProperty.propertyType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Class</dt>
                      <dd className="font-medium">{selectedProperty.subType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Floors</dt>
                      <dd className="font-medium">{selectedProperty.floors}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Land Area</dt>
                      <dd className="font-medium">{selectedProperty.landArea.toLocaleString()} SF</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Year Built</dt>
                      <dd className="font-medium">{selectedProperty.yearBuilt}</dd>
                    </div>
                    {selectedProperty.yearRenovated && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Last Renovated</dt>
                        <dd className="font-medium">{selectedProperty.yearRenovated}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Ownership & Status</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Owner</dt>
                      <dd className="font-medium">{selectedProperty.owner}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Property ID</dt>
                      <dd className="font-mono text-xs">{selectedProperty.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Valuation</dt>
                      <dd className="font-medium">{new Date(selectedProperty.lastValuation).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd>
                        <StatusBadge
                          status={selectedProperty.status === 'active' ? 'success' : 'warning'}
                          label={selectedProperty.status.replace('_', ' ')}
                          size="sm"
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Quick Actions */}
              <Card variant="outline" padding="md">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" leftIcon={<SparklesIcon className="h-4 w-4" />}>
                    Run AI Valuation
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<CompareIcon className="h-4 w-4" />}>
                    Find Comparables
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<DocumentIcon className="h-4 w-4" />}>
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<MapIcon className="h-4 w-4" />}>
                    View on Map
                  </Button>
                </div>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedProperty(null)}>
              Close
            </Button>
            <Button leftIcon={<EditIcon className="h-4 w-4" />}>
              Edit Property
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}
