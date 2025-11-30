'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@/components/ui/Table';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

const mockAppeals = [
  {
    id: 'APL-2024-001',
    property: '500 Commerce Tower, Dallas, TX',
    propertyType: 'Office',
    currentAssessment: 12500000,
    claimedValue: 9800000,
    potentialSavings: 67500,
    status: 'in_progress',
    deadline: '2024-02-15',
    hearingDate: '2024-02-28',
    successProbability: 82,
    taxYear: 2024,
  },
  {
    id: 'APL-2024-002',
    property: '1200 Industrial Park, Houston, TX',
    propertyType: 'Industrial',
    currentAssessment: 8750000,
    claimedValue: 7200000,
    potentialSavings: 38750,
    status: 'pending_hearing',
    deadline: '2024-02-20',
    hearingDate: '2024-03-05',
    successProbability: 75,
    taxYear: 2024,
  },
  {
    id: 'APL-2024-003',
    property: '789 Retail Plaza, Austin, TX',
    propertyType: 'Retail',
    currentAssessment: 5200000,
    claimedValue: 4100000,
    potentialSavings: 27500,
    status: 'won',
    deadline: '2024-01-15',
    settledValue: 4250000,
    reduction: 18.3,
    taxYear: 2024,
  },
  {
    id: 'APL-2023-048',
    property: '456 Medical Center, San Antonio, TX',
    propertyType: 'Medical Office',
    currentAssessment: 15800000,
    claimedValue: 12500000,
    potentialSavings: 82500,
    status: 'lost',
    deadline: '2023-12-01',
    taxYear: 2023,
  },
];

export default function AppealsPage() {
  const [selectedAppeal, setSelectedAppeal] = useState<typeof mockAppeals[0] | null>(null);
  const [newAppealModal, setNewAppealModal] = useState(false);
  const { success, info } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'success';
      case 'lost': return 'error';
      case 'pending_hearing': return 'warning';
      case 'in_progress': return 'pending';
      default: return 'inactive';
    }
  };

  const handleAIAnalysis = () => {
    info('AI Analysis Started', 'Analyzing property data and generating appeal strategy...');
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Appeals"
          value="23"
          icon={<ScaleIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Potential Savings"
          value="$847K"
          change={{ value: 15.2 }}
          trend="up"
          icon={<DollarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Success Rate"
          value="76%"
          change={{ value: 4.5, label: 'YoY' }}
          trend="up"
          icon={<TrophyIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Upcoming Deadlines"
          value="5"
          icon={<CalendarIcon className="h-5 w-5" />}
        />
      </div>

      {/* AI Appeal Assistant */}
      <Card variant="premium" className="border-primary/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Appeal Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Let AI analyze your properties and identify the best appeal opportunities
              </p>
            </div>
          </div>
          <Button onClick={handleAIAnalysis} leftIcon={<SparklesIcon className="h-4 w-4" />}>
            Analyze Portfolio
          </Button>
        </div>
      </Card>

      {/* Main Content */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Tax Appeals</h2>
              <p className="text-sm text-muted-foreground">
                Manage and track property tax appeal cases
              </p>
            </div>
            <Button onClick={() => setNewAppealModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
              New Appeal
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending Hearing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search appeals..."
                className="w-64"
                leftIcon={<SearchIcon className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: '2024', label: 'Tax Year 2024' },
                  { value: '2023', label: 'Tax Year 2023' },
                  { value: '2022', label: 'Tax Year 2022' },
                ]}
                placeholder="Tax Year"
                className="w-40"
              />
            </div>
          </div>

          <TabsContent value="active">
            <div className="space-y-4">
              {mockAppeals
                .filter((a) => ['in_progress', 'pending_hearing'].includes(a.status))
                .map((appeal) => (
                  <AppealCard
                    key={appeal.id}
                    appeal={appeal}
                    onClick={() => setSelectedAppeal(appeal)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {mockAppeals
                .filter((a) => a.status === 'pending_hearing')
                .map((appeal) => (
                  <AppealCard
                    key={appeal.id}
                    appeal={appeal}
                    onClick={() => setSelectedAppeal(appeal)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Original</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                  <TableHead>Reduction</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAppeals
                  .filter((a) => ['won', 'lost'].includes(a.status))
                  .map((appeal) => (
                    <TableRow key={appeal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appeal.property.split(',')[0]}</p>
                          <p className="text-xs text-muted-foreground font-mono">{appeal.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appeal.propertyType}</TableCell>
                      <TableCell className="text-right">
                        ${(appeal.currentAssessment / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right">
                        ${((appeal.settledValue || appeal.currentAssessment) / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell>
                        {appeal.reduction ? (
                          <Badge variant="success">-{appeal.reduction}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={appeal.status === 'won' ? 'success' : 'error'}
                          label={appeal.status === 'won' ? 'Won' : 'Lost'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Appeal Detail Modal */}
      {selectedAppeal && (
        <Modal isOpen={!!selectedAppeal} onClose={() => setSelectedAppeal(null)} size="xl">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <ModalTitle>{selectedAppeal.property}</ModalTitle>
              <StatusBadge
                status={getStatusColor(selectedAppeal.status) as any}
                label={selectedAppeal.status.replace('_', ' ')}
              />
            </div>
            <ModalDescription>
              {selectedAppeal.id} | Tax Year {selectedAppeal.taxYear}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Value Comparison */}
                <Card variant="filled">
                  <CardHeader noBorder>
                    <CardTitle className="text-base">Value Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Assessment</p>
                        <p className="text-2xl font-bold text-destructive">
                          ${selectedAppeal.currentAssessment.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Claimed Value</p>
                        <p className="text-2xl font-bold text-success">
                          ${selectedAppeal.claimedValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reduction Requested</span>
                        <span className="font-medium">
                          {(
                            ((selectedAppeal.currentAssessment - selectedAppeal.claimedValue) /
                              selectedAppeal.currentAssessment) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((selectedAppeal.currentAssessment - selectedAppeal.claimedValue) /
                            selectedAppeal.currentAssessment) *
                          100
                        }
                        variant="success"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Success Analysis */}
                <Card variant="filled">
                  <CardHeader noBorder>
                    <CardTitle className="text-base flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-primary" />
                      AI Success Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <CircularProgress
                        value={selectedAppeal.successProbability}
                        size={100}
                        strokeWidth={8}
                        variant={
                          selectedAppeal.successProbability >= 75
                            ? 'success'
                            : selectedAppeal.successProbability >= 50
                            ? 'warning'
                            : 'destructive'
                        }
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">Key Factors</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-success" />
                            Strong comparable evidence
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-success" />
                            Market value decline documented
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertIcon className="h-4 w-4 text-warning" />
                            Property condition issues need documentation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {/* Timeline */}
                <Card variant="outline" padding="sm">
                  <h5 className="font-medium mb-3">Timeline</h5>
                  <div className="space-y-3">
                    <TimelineItem
                      date={selectedAppeal.deadline}
                      label="Filing Deadline"
                      status="completed"
                    />
                    <TimelineItem
                      date={selectedAppeal.hearingDate || 'TBD'}
                      label="Hearing Date"
                      status={selectedAppeal.hearingDate ? 'upcoming' : 'pending'}
                    />
                    <TimelineItem
                      date="TBD"
                      label="Decision Expected"
                      status="pending"
                    />
                  </div>
                </Card>

                {/* Actions */}
                <Card variant="outline" padding="sm">
                  <h5 className="font-medium mb-3">Actions</h5>
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth leftIcon={<SparklesIcon className="h-4 w-4" />}>
                      Generate Argument
                    </Button>
                    <Button variant="outline" fullWidth leftIcon={<DocumentIcon className="h-4 w-4" />}>
                      Upload Evidence
                    </Button>
                    <Button variant="outline" fullWidth leftIcon={<PrinterIcon className="h-4 w-4" />}>
                      Print Package
                    </Button>
                  </div>
                </Card>

                {/* Potential Savings */}
                <Card variant="filled" className="bg-success/10 border-success/20">
                  <div className="text-center">
                    <p className="text-sm text-success">Potential Annual Savings</p>
                    <p className="text-2xl font-bold text-success">
                      ${selectedAppeal.potentialSavings.toLocaleString()}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedAppeal(null)}>
              Close
            </Button>
            <Button leftIcon={<EditIcon className="h-4 w-4" />}>
              Edit Appeal
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

function AppealCard({
  appeal,
  onClick,
}: {
  appeal: typeof mockAppeals[0];
  onClick: () => void;
}) {
  const reduction =
    ((appeal.currentAssessment - appeal.claimedValue) / appeal.currentAssessment) * 100;

  return (
    <Card
      variant="interactive"
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <ScaleIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{appeal.property}</h3>
            <p className="text-sm text-muted-foreground">
              {appeal.id} | {appeal.propertyType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Reduction</p>
            <p className="font-semibold text-success">-{reduction.toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Savings</p>
            <p className="font-semibold">${appeal.potentialSavings.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <CircularProgress
              value={appeal.successProbability}
              size={48}
              strokeWidth={4}
              variant={appeal.successProbability >= 75 ? 'success' : 'warning'}
            />
            <StatusBadge
              status={appeal.status === 'pending_hearing' ? 'warning' : 'pending'}
              label={appeal.status.replace('_', ' ')}
            />
          </div>
        </div>
      </div>

      {appeal.hearingDate && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          Hearing: {appeal.hearingDate}
        </div>
      )}
    </Card>
  );
}

function TimelineItem({
  date,
  label,
  status,
}: {
  date: string;
  label: string;
  status: 'completed' | 'upcoming' | 'pending';
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-2 w-2 rounded-full ${
          status === 'completed'
            ? 'bg-success'
            : status === 'upcoming'
            ? 'bg-warning'
            : 'bg-muted-foreground'
        }`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

// Icons
function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
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

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function PrinterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
