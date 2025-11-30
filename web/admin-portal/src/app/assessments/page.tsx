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

// Mock assessment data
const mockAssessments = [
  {
    id: 'ASS-2024-001',
    parcelId: 'NYC-MN-001-234',
    address: '350 Fifth Avenue, New York, NY',
    propertyType: 'Office',
    landValue: 125000000,
    improvementValue: 275000000,
    totalValue: 400000000,
    priorValue: 380000000,
    changePercent: 5.3,
    status: 'finalized',
    taxYear: 2024,
    lastUpdated: '2024-01-10',
    aiConfidence: 94,
  },
  {
    id: 'ASS-2024-002',
    parcelId: 'NYC-MN-002-567',
    address: '200 Park Avenue, New York, NY',
    propertyType: 'Office',
    landValue: 98000000,
    improvementValue: 192000000,
    totalValue: 290000000,
    priorValue: 295000000,
    changePercent: -1.7,
    status: 'under_review',
    taxYear: 2024,
    lastUpdated: '2024-01-12',
    aiConfidence: 87,
  },
  {
    id: 'ASS-2024-003',
    parcelId: 'NYC-BK-003-890',
    address: '1 MetroTech Center, Brooklyn, NY',
    propertyType: 'Office',
    landValue: 45000000,
    improvementValue: 85000000,
    totalValue: 130000000,
    priorValue: 118000000,
    changePercent: 10.2,
    status: 'pending',
    taxYear: 2024,
    lastUpdated: '2024-01-08',
    aiConfidence: 91,
  },
  {
    id: 'ASS-2024-004',
    parcelId: 'NYC-QN-004-123',
    address: '27-01 Queens Plaza North, Queens, NY',
    propertyType: 'Multifamily',
    landValue: 35000000,
    improvementValue: 75000000,
    totalValue: 110000000,
    priorValue: 105000000,
    changePercent: 4.8,
    status: 'finalized',
    taxYear: 2024,
    lastUpdated: '2024-01-05',
    aiConfidence: 96,
  },
];

export default function AssessmentsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<typeof mockAssessments[0] | null>(null);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { success, error } = useToast();

  const handleBulkProcess = () => {
    success('Processing Started', 'AI is analyzing assessment data...');
    setBulkUploadModal(false);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value="45,892"
          change={{ value: 2847, label: 'this cycle' }}
          trend="up"
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Total Assessed Value"
          value="$89.4B"
          change={{ value: 4.2, label: 'vs prior year' }}
          trend="up"
          icon={<DollarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Review"
          value="1,247"
          change={{ value: -320, label: 'this week' }}
          trend="down"
          icon={<ClockIcon className="h-5 w-5" />}
        />
        <StatCard
          title="AI Accuracy"
          value="96.8%"
          change={{ value: 1.2 }}
          trend="up"
          icon={<SparklesIcon className="h-5 w-5" />}
        />
      </div>

      {/* Main Content */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Property Assessments</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered mass appraisal and assessment management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<UploadIcon className="h-4 w-4" />} onClick={() => setBulkUploadModal(true)}>
                Bulk Upload
              </Button>
              <Button leftIcon={<SparklesIcon className="h-4 w-4" />}>
                Run AI Analysis
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="finalized">Finalized</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search parcels..."
                className="w-64"
                leftIcon={<SearchIcon className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: '2024', label: 'Tax Year 2024' },
                  { value: '2023', label: 'Tax Year 2023' },
                  { value: '2022', label: 'Tax Year 2022' },
                ]}
                defaultValue="2024"
                className="w-36"
              />
            </div>
          </div>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcel / Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Land Value</TableHead>
                  <TableHead className="text-right">Improvements</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssessments.map((assessment) => (
                  <TableRow key={assessment.id} onClick={() => setSelectedAssessment(assessment)}>
                    <TableCell>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{assessment.parcelId}</p>
                        <p className="font-medium">{assessment.address.split(',')[0]}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="ghost">{assessment.propertyType}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(assessment.landValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(assessment.improvementValue)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(assessment.totalValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={assessment.changePercent >= 0 ? 'text-success' : 'text-destructive'}>
                        {assessment.changePercent >= 0 ? '+' : ''}{assessment.changePercent}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CircularProgress
                          value={assessment.aiConfidence}
                          size={28}
                          strokeWidth={3}
                          showValue={false}
                          variant={assessment.aiConfidence >= 90 ? 'success' : 'default'}
                        />
                        <span className="text-sm">{assessment.aiConfidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          assessment.status === 'finalized'
                            ? 'success'
                            : assessment.status === 'under_review'
                            ? 'warning'
                            : 'pending'
                        }
                        label={assessment.status.replace('_', ' ')}
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
                        <DropdownItem icon={<SparklesIcon className="h-4 w-4" />}>Re-analyze</DropdownItem>
                        <DropdownItem icon={<EditIcon className="h-4 w-4" />}>Edit Values</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem icon={<DocumentIcon className="h-4 w-4" />}>Export</DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={currentPage}
              totalPages={100}
              onPageChange={setCurrentPage}
              totalItems={45892}
              pageSize={10}
              onPageSizeChange={() => {}}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Bulk Upload Modal */}
      <Modal isOpen={bulkUploadModal} onClose={() => setBulkUploadModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Bulk Assessment Upload</ModalTitle>
          <ModalDescription>
            Upload property data for AI-powered mass assessment
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <UploadIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports CSV, Excel, and JSON formats
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tax Year"
                options={[
                  { value: '2024', label: '2024' },
                  { value: '2025', label: '2025' },
                ]}
                defaultValue="2024"
              />
              <Select
                label="Assessment Type"
                options={[
                  { value: 'full', label: 'Full Assessment' },
                  { value: 'reassessment', label: 'Reassessment' },
                  { value: 'interim', label: 'Interim Update' },
                ]}
                placeholder="Select type"
              />
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary">AI Mass Appraisal</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gemini AI will analyze each property using market data, comparable sales,
                    and advanced valuation models to generate accurate assessments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setBulkUploadModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleBulkProcess} leftIcon={<SparklesIcon className="h-4 w-4" />}>
            Start Processing
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <Modal isOpen={!!selectedAssessment} onClose={() => setSelectedAssessment(null)} size="xl">
          <ModalHeader>
            <ModalTitle>{selectedAssessment.address}</ModalTitle>
            <ModalDescription>
              Parcel: {selectedAssessment.parcelId} | Tax Year {selectedAssessment.taxYear}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Value Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="filled" padding="lg" className="text-center">
                  <p className="text-sm text-muted-foreground">Land Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAssessment.landValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((selectedAssessment.landValue / selectedAssessment.totalValue) * 100).toFixed(1)}% of total
                  </p>
                </Card>
                <Card variant="filled" padding="lg" className="text-center">
                  <p className="text-sm text-muted-foreground">Improvement Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAssessment.improvementValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((selectedAssessment.improvementValue / selectedAssessment.totalValue) * 100).toFixed(1)}% of total
                  </p>
                </Card>
                <Card variant="outline" padding="lg" className="text-center border-2 border-primary">
                  <p className="text-sm text-muted-foreground">Total Assessed Value</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedAssessment.totalValue)}</p>
                  <p className={`text-xs mt-1 ${selectedAssessment.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {selectedAssessment.changePercent >= 0 ? '+' : ''}{selectedAssessment.changePercent}% vs prior year
                  </p>
                </Card>
              </div>

              {/* AI Analysis */}
              <Card variant="outline" padding="md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <SparklesIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">AI Assessment Analysis</h4>
                      <Badge variant="success">
                        {selectedAssessment.aiConfidence}% Confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      The AI analysis indicates the property value has{' '}
                      {selectedAssessment.changePercent >= 0 ? 'increased' : 'decreased'} by{' '}
                      {Math.abs(selectedAssessment.changePercent)}% compared to the prior assessment year.
                      This change is consistent with market trends in the submarket, where similar{' '}
                      {selectedAssessment.propertyType.toLowerCase()} properties have experienced{' '}
                      {selectedAssessment.changePercent >= 0 ? 'appreciation' : 'depreciation'}.
                      The land-to-improvement ratio of{' '}
                      {((selectedAssessment.landValue / selectedAssessment.totalValue) * 100).toFixed(0)}%/{((selectedAssessment.improvementValue / selectedAssessment.totalValue) * 100).toFixed(0)}%{' '}
                      is typical for {selectedAssessment.propertyType.toLowerCase()} properties in this location.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Comparison */}
              <div>
                <h4 className="font-medium mb-3">Year-over-Year Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card variant="filled" padding="md">
                    <p className="text-sm text-muted-foreground mb-2">Prior Year ({selectedAssessment.taxYear - 1})</p>
                    <p className="text-xl font-semibold">{formatCurrency(selectedAssessment.priorValue)}</p>
                    <Progress value={100} className="mt-2" variant="secondary" />
                  </Card>
                  <Card variant="filled" padding="md">
                    <p className="text-sm text-muted-foreground mb-2">Current Year ({selectedAssessment.taxYear})</p>
                    <p className="text-xl font-semibold">{formatCurrency(selectedAssessment.totalValue)}</p>
                    <Progress
                      value={(selectedAssessment.totalValue / selectedAssessment.priorValue) * 100}
                      className="mt-2"
                      variant={selectedAssessment.changePercent >= 0 ? 'success' : 'destructive'}
                    />
                  </Card>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Property Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Property Type</dt>
                      <dd className="font-medium">{selectedAssessment.propertyType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Parcel ID</dt>
                      <dd className="font-mono text-xs">{selectedAssessment.parcelId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Assessment ID</dt>
                      <dd className="font-mono text-xs">{selectedAssessment.id}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Assessment Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tax Year</dt>
                      <dd className="font-medium">{selectedAssessment.taxYear}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Updated</dt>
                      <dd className="font-medium">{new Date(selectedAssessment.lastUpdated).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd>
                        <StatusBadge
                          status={selectedAssessment.status === 'finalized' ? 'success' : selectedAssessment.status === 'under_review' ? 'warning' : 'pending'}
                          label={selectedAssessment.status.replace('_', ' ')}
                          size="sm"
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedAssessment(null)}>
              Close
            </Button>
            <Button variant="outline" leftIcon={<DocumentIcon className="h-4 w-4" />}>
              Generate Notice
            </Button>
            <Button leftIcon={<CheckIcon className="h-4 w-4" />}>
              Finalize Assessment
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
