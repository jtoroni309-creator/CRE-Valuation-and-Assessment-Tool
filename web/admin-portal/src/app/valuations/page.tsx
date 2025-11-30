'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination, TableEmpty } from '@/components/ui/Table';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';

// Mock data
const mockValuations = [
  {
    id: 'VAL-001',
    property: '123 Main Street, New York, NY',
    propertyType: 'Office',
    approach: 'Income',
    value: 15750000,
    pricePerSqft: 425,
    confidence: 92,
    status: 'completed',
    date: '2024-01-15',
    analyst: 'AI + Review',
  },
  {
    id: 'VAL-002',
    property: '456 Oak Avenue, Chicago, IL',
    propertyType: 'Retail',
    approach: 'Sales Comparison',
    value: 3200000,
    pricePerSqft: 285,
    confidence: 88,
    status: 'pending_review',
    date: '2024-01-14',
    analyst: 'AI',
  },
  {
    id: 'VAL-003',
    property: '789 Industrial Blvd, Houston, TX',
    propertyType: 'Industrial',
    approach: 'Cost',
    value: 8500000,
    pricePerSqft: 175,
    confidence: 95,
    status: 'completed',
    date: '2024-01-12',
    analyst: 'AI + Review',
  },
  {
    id: 'VAL-004',
    property: '321 Park Place, Miami, FL',
    propertyType: 'Multifamily',
    approach: 'Income',
    value: 12300000,
    pricePerSqft: 315,
    confidence: 78,
    status: 'in_progress',
    date: '2024-01-10',
    analyst: 'AI',
  },
];

export default function ValuationsPage() {
  const [selectedValuation, setSelectedValuation] = useState<typeof mockValuations[0] | null>(null);
  const [newValuationModal, setNewValuationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { success, error } = useToast();

  const handleStartValuation = () => {
    success('Valuation Started', 'AI is analyzing the property data...');
    setNewValuationModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Valuations"
          value="1,247"
          change={{ value: 12.5, label: 'vs last month' }}
          trend="up"
          icon={<ChartIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total Value"
          value="$2.4B"
          change={{ value: 8.3, label: 'vs last month' }}
          trend="up"
          icon={<DollarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Confidence"
          value="91.2%"
          change={{ value: 2.1 }}
          trend="up"
          icon={<TargetIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Review"
          value="23"
          change={{ value: -15, label: 'vs last month' }}
          trend="down"
          icon={<ClockIcon className="h-5 w-5" />}
        />
      </div>

      {/* Main Content */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Property Valuations</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered valuations with multi-approach analysis
              </p>
            </div>
            <Button onClick={() => setNewValuationModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
              New Valuation
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search valuations..."
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
                className="w-40"
              />
            </div>
          </div>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Approach</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">$/SF</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockValuations.map((valuation) => (
                  <TableRow key={valuation.id} onClick={() => setSelectedValuation(valuation)}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{valuation.property.split(',')[0]}</p>
                        <p className="text-xs text-muted-foreground">
                          {valuation.property.split(',').slice(1).join(',')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="ghost">{valuation.propertyType}</Badge>
                    </TableCell>
                    <TableCell>{valuation.approach}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${(valuation.value / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right">${valuation.pricePerSqft}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CircularProgress
                          value={valuation.confidence}
                          size={32}
                          strokeWidth={3}
                          showValue={false}
                          variant={valuation.confidence >= 90 ? 'success' : valuation.confidence >= 80 ? 'default' : 'warning'}
                        />
                        <span className="text-sm">{valuation.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          valuation.status === 'completed'
                            ? 'success'
                            : valuation.status === 'pending_review'
                            ? 'warning'
                            : 'pending'
                        }
                        label={valuation.status.replace('_', ' ')}
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
                        <DropdownItem icon={<EditIcon className="h-4 w-4" />}>Edit</DropdownItem>
                        <DropdownItem icon={<DocumentIcon className="h-4 w-4" />}>Generate Report</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem icon={<TrashIcon className="h-4 w-4" />} destructive>Delete</DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              totalItems={98}
              pageSize={10}
              onPageSizeChange={() => {}}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* New Valuation Modal */}
      <Modal isOpen={newValuationModal} onClose={() => setNewValuationModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Create New Valuation</ModalTitle>
          <ModalDescription>
            Start an AI-powered property valuation with comprehensive analysis
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Property Address" placeholder="Enter property address" />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Property Type"
                options={[
                  { value: 'office', label: 'Office' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'industrial', label: 'Industrial' },
                  { value: 'multifamily', label: 'Multifamily' },
                  { value: 'mixed_use', label: 'Mixed Use' },
                ]}
                placeholder="Select type"
              />
              <Select
                label="Valuation Approach"
                options={[
                  { value: 'income', label: 'Income Approach' },
                  { value: 'sales', label: 'Sales Comparison' },
                  { value: 'cost', label: 'Cost Approach' },
                  { value: 'hybrid', label: 'Hybrid (Recommended)' },
                ]}
                placeholder="Select approach"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Building Size (SF)" type="number" placeholder="0" />
              <Input label="Year Built" type="number" placeholder="1990" />
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary">AI Analysis Included</p>
                  <p className="text-sm text-muted-foreground">
                    Gemini AI will analyze market data, comparables, and generate narratives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setNewValuationModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartValuation} leftIcon={<SparklesIcon className="h-4 w-4" />}>
            Start AI Valuation
          </Button>
        </ModalFooter>
      </Modal>

      {/* Valuation Detail Modal */}
      {selectedValuation && (
        <Modal isOpen={!!selectedValuation} onClose={() => setSelectedValuation(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedValuation.property}</ModalTitle>
            <ModalDescription>
              {selectedValuation.propertyType} | {selectedValuation.approach} Approach
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Value Summary */}
                <Card variant="filled" padding="lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Concluded Value</p>
                      <p className="text-3xl font-bold">
                        ${selectedValuation.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${selectedValuation.pricePerSqft}/SF
                      </p>
                    </div>
                    <div className="text-center">
                      <CircularProgress
                        value={selectedValuation.confidence}
                        size={80}
                        strokeWidth={6}
                        variant={selectedValuation.confidence >= 90 ? 'success' : 'default'}
                      />
                      <p className="text-sm font-medium mt-2">Confidence</p>
                    </div>
                  </div>
                </Card>

                {/* Analysis Summary */}
                <div>
                  <h4 className="font-medium mb-3">AI Analysis Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The subject property is a well-maintained {selectedValuation.propertyType.toLowerCase()} building
                    located in a prime market area. Based on the {selectedValuation.approach.toLowerCase()} approach,
                    utilizing {selectedValuation.approach === 'Income' ? 'capitalization of net operating income' :
                    selectedValuation.approach === 'Sales Comparison' ? 'analysis of 5 comparable sales' :
                    'depreciated replacement cost analysis'}, the concluded market value is
                    ${selectedValuation.value.toLocaleString()}. The confidence level of {selectedValuation.confidence}%
                    reflects strong market data support and clear valuation indicators.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Card variant="outline" padding="sm">
                  <h5 className="font-medium mb-2">Quick Actions</h5>
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth leftIcon={<DocumentIcon className="h-4 w-4" />}>
                      Generate Report
                    </Button>
                    <Button variant="outline" fullWidth leftIcon={<SparklesIcon className="h-4 w-4" />}>
                      AI Analysis
                    </Button>
                    <Button variant="outline" fullWidth leftIcon={<CompareIcon className="h-4 w-4" />}>
                      View Comparables
                    </Button>
                  </div>
                </Card>

                <Card variant="outline" padding="sm">
                  <h5 className="font-medium mb-2">Details</h5>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">ID</dt>
                      <dd className="font-mono">{selectedValuation.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd>{selectedValuation.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Analyst</dt>
                      <dd>{selectedValuation.analyst}</dd>
                    </div>
                  </dl>
                </Card>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedValuation(null)}>
              Close
            </Button>
            <Button leftIcon={<EditIcon className="h-4 w-4" />}>
              Edit Valuation
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
