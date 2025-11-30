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
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';

// Mock reports data
const mockReports = [
  {
    id: 'RPT-2024-001',
    name: 'Q4 2024 Portfolio Valuation Summary',
    type: 'Portfolio Summary',
    format: 'PDF',
    properties: 45,
    totalValue: 2400000000,
    status: 'completed',
    generatedAt: '2024-01-15T10:30:00Z',
    generatedBy: 'AI + Review',
    size: '4.2 MB',
  },
  {
    id: 'RPT-2024-002',
    name: 'Manhattan Office Market Analysis',
    type: 'Market Analysis',
    format: 'PDF',
    properties: 128,
    totalValue: 8900000000,
    status: 'completed',
    generatedAt: '2024-01-14T15:45:00Z',
    generatedBy: 'AI',
    size: '12.8 MB',
  },
  {
    id: 'RPT-2024-003',
    name: '350 Fifth Avenue - Full Appraisal Report',
    type: 'Full Appraisal',
    format: 'PDF',
    properties: 1,
    totalValue: 400000000,
    status: 'generating',
    generatedAt: null,
    generatedBy: 'AI',
    size: null,
  },
  {
    id: 'RPT-2024-004',
    name: 'Tax Year 2024 Assessment Roll Export',
    type: 'Assessment Export',
    format: 'Excel',
    properties: 45892,
    totalValue: 89400000000,
    status: 'completed',
    generatedAt: '2024-01-12T09:00:00Z',
    generatedBy: 'System',
    size: '156 MB',
  },
  {
    id: 'RPT-2024-005',
    name: 'Comparable Sales Analysis - Industrial',
    type: 'Comparable Analysis',
    format: 'PDF',
    properties: 24,
    totalValue: 450000000,
    status: 'failed',
    generatedAt: null,
    generatedBy: 'AI',
    size: null,
  },
];

const reportTemplates = [
  { id: 'full-appraisal', name: 'Full Appraisal Report', description: 'Comprehensive USPAP-compliant appraisal report', icon: DocumentIcon },
  { id: 'summary', name: 'Summary Report', description: 'Executive summary with key findings', icon: SummaryIcon },
  { id: 'market-analysis', name: 'Market Analysis', description: 'Detailed market conditions and trends', icon: ChartIcon },
  { id: 'comparable-grid', name: 'Comparable Grid', description: 'Sales comparison approach documentation', icon: GridIcon },
  { id: 'portfolio', name: 'Portfolio Summary', description: 'Multi-property portfolio overview', icon: FolderIcon },
  { id: 'assessment-notice', name: 'Assessment Notice', description: 'Official property assessment notification', icon: MailIcon },
];

export default function ReportsPage() {
  const [newReportModal, setNewReportModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { success, error } = useToast();

  const handleGenerateReport = () => {
    success('Report Generation Started', 'AI is generating your report...');
    setNewReportModal(false);
    setSelectedTemplate(null);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Documents</h1>
          <p className="text-muted-foreground">
            AI-generated reports, appraisals, and documentation
          </p>
        </div>
        <Button onClick={() => setNewReportModal(true)} leftIcon={<SparklesIcon className="h-4 w-4" />}>
          Generate Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value="3,847"
          change={{ value: 234, label: 'this month' }}
          trend="up"
          icon={<DocumentIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Generated Today"
          value="47"
          change={{ value: 12 }}
          trend="up"
          icon={<CalendarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Storage Used"
          value="24.8 GB"
          change={{ value: 2.4, label: 'this week' }}
          trend="up"
          icon={<StorageIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Generation Time"
          value="2.3 min"
          change={{ value: -18, label: 'improvement' }}
          trend="down"
          icon={<ClockIcon className="h-5 w-5" />}
        />
      </div>

      {/* Reports List */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search reports..."
                className="w-64"
                leftIcon={<SearchIcon className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'appraisal', label: 'Appraisal' },
                  { value: 'market', label: 'Market Analysis' },
                  { value: 'portfolio', label: 'Portfolio' },
                  { value: 'assessment', label: 'Assessment' },
                ]}
                placeholder="Type"
                className="w-36"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-xl
                    ${report.format === 'PDF' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}
                  `}>
                    {report.format === 'PDF' ? <PDFIcon className="h-6 w-6" /> : <ExcelIcon className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="ghost" size="sm">{report.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {report.properties.toLocaleString()} {report.properties === 1 ? 'property' : 'properties'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatValue(report.totalValue)}
                      </span>
                    </div>
                    {report.generatedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Generated {new Date(report.generatedAt).toLocaleString()} by {report.generatedBy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {report.status === 'generating' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="text-sm text-muted-foreground">Generating...</span>
                    </div>
                  ) : report.status === 'failed' ? (
                    <StatusBadge status="error" label="Failed" />
                  ) : (
                    <>
                      <span className="text-sm text-muted-foreground">{report.size}</span>
                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="icon-sm">
                            <DotsIcon className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem icon={<DownloadIcon className="h-4 w-4" />}>Download</DropdownItem>
                        <DropdownItem icon={<EyeIcon className="h-4 w-4" />}>Preview</DropdownItem>
                        <DropdownItem icon={<ShareIcon className="h-4 w-4" />}>Share</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem icon={<TrashIcon className="h-4 w-4" />} destructive>Delete</DropdownItem>
                      </Dropdown>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* New Report Modal */}
      <Modal isOpen={newReportModal} onClose={() => { setNewReportModal(false); setSelectedTemplate(null); }} size="xl">
        <ModalHeader>
          <ModalTitle>Generate New Report</ModalTitle>
          <ModalDescription>
            Choose a template and let AI generate a comprehensive report
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {!selectedTemplate ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select a report template:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {reportTemplates.map((template) => (
                  <Card
                    key={template.id}
                    variant="outline"
                    padding="md"
                    className="cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-xl bg-primary/10 mb-3">
                        <template.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to templates
              </Button>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reportTemplates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  label="Select Property/Portfolio"
                  options={[
                    { value: 'prop-1', label: '350 Fifth Avenue, New York, NY' },
                    { value: 'prop-2', label: '200 Park Avenue, New York, NY' },
                    { value: 'portfolio-1', label: 'Manhattan Office Portfolio (45 properties)' },
                  ]}
                  placeholder="Select property or portfolio"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Output Format"
                    options={[
                      { value: 'pdf', label: 'PDF Document' },
                      { value: 'word', label: 'Word Document' },
                      { value: 'excel', label: 'Excel Spreadsheet' },
                    ]}
                    defaultValue="pdf"
                  />
                  <Select
                    label="Detail Level"
                    options={[
                      { value: 'executive', label: 'Executive Summary' },
                      { value: 'standard', label: 'Standard' },
                      { value: 'detailed', label: 'Detailed' },
                      { value: 'comprehensive', label: 'Comprehensive' },
                    ]}
                    defaultValue="standard"
                  />
                </div>

                <Input
                  label="Additional Instructions (Optional)"
                  placeholder="Any specific requirements or focus areas..."
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setNewReportModal(false); setSelectedTemplate(null); }}>
            Cancel
          </Button>
          {selectedTemplate && (
            <Button onClick={handleGenerateReport} leftIcon={<SparklesIcon className="h-4 w-4" />}>
              Generate Report
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}

// Icons
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SummaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

function StorageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
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

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}

function PDFIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13.5c0-.83.67-1.5 1.5-1.5h.5v3h-.5c-.83 0-1.5-.67-1.5-1.5zm5 0c0-.83.67-1.5 1.5-1.5h.5v3h-.5c-.83 0-1.5-.67-1.5-1.5z" />
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
