'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Progress';

interface ExtractedField {
  name: string;
  value: string;
  confidence: number;
  location?: { page: number; boundingBox: number[] };
}

interface ProcessedDocument {
  id: string;
  fileName: string;
  fileType: string;
  documentType: string;
  status: 'processing' | 'completed' | 'error';
  extractedFields: ExtractedField[];
  summary: string;
  entities: { type: string; value: string; count: number }[];
  processedAt: Date;
  confidence: number;
}

const mockDocuments: ProcessedDocument[] = [
  {
    id: '1',
    fileName: 'Appraisal_Report_123Main.pdf',
    fileType: 'PDF',
    documentType: 'Appraisal Report',
    status: 'completed',
    extractedFields: [
      { name: 'Property Address', value: '123 Main Street, New York, NY 10001', confidence: 99 },
      { name: 'Appraised Value', value: '$12,500,000', confidence: 98 },
      { name: 'Effective Date', value: '2024-09-15', confidence: 97 },
      { name: 'Property Type', value: 'Office Building', confidence: 96 },
      { name: 'Building Size', value: '45,000 SF', confidence: 95 },
      { name: 'Year Built', value: '2005', confidence: 94 },
      { name: 'Land Area', value: '0.5 acres', confidence: 93 },
      { name: 'Appraiser', value: 'John Smith, MAI', confidence: 99 },
    ],
    summary: 'Commercial office building appraisal indicating a market value of $12.5M using income and sales comparison approaches. Property is in good condition with stable tenancy.',
    entities: [
      { type: 'Currency', value: 'USD', count: 47 },
      { type: 'Date', value: 'Various', count: 23 },
      { type: 'Address', value: 'Various', count: 8 },
      { type: 'Person', value: 'Various', count: 5 },
    ],
    processedAt: new Date(),
    confidence: 96,
  },
  {
    id: '2',
    fileName: 'Rent_Roll_Q3_2024.xlsx',
    fileType: 'Excel',
    documentType: 'Rent Roll',
    status: 'completed',
    extractedFields: [
      { name: 'Total Units', value: '45', confidence: 100 },
      { name: 'Occupied Units', value: '42', confidence: 100 },
      { name: 'Total Monthly Rent', value: '$187,500', confidence: 98 },
      { name: 'Average Rent/Unit', value: '$4,464', confidence: 97 },
      { name: 'Occupancy Rate', value: '93.3%', confidence: 99 },
      { name: 'Lease Expirations (12mo)', value: '8 leases', confidence: 95 },
    ],
    summary: 'Rent roll showing 45-unit property with 93.3% occupancy. Monthly gross potential rent of $201,000 with actual collections of $187,500.',
    entities: [
      { type: 'Currency', value: 'USD', count: 90 },
      { type: 'Date', value: 'Various', count: 45 },
      { type: 'Tenant', value: 'Various', count: 42 },
    ],
    processedAt: new Date(Date.now() - 3600000),
    confidence: 98,
  },
];

const supportedDocTypes = [
  { name: 'Appraisal Reports', icon: '📋', count: 1250 },
  { name: 'Rent Rolls', icon: '📊', count: 3420 },
  { name: 'Lease Agreements', icon: '📝', count: 8900 },
  { name: 'Financial Statements', icon: '💰', count: 2100 },
  { name: 'Property Tax Bills', icon: '🏛️', count: 4500 },
  { name: 'Insurance Policies', icon: '🛡️', count: 890 },
  { name: 'Inspection Reports', icon: '🔍', count: 1800 },
  { name: 'Title Documents', icon: '📜', count: 2300 },
];

export default function AIDocumentsPage() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">📑</span>
              AI Document Intelligence
            </h1>
            <p className="text-muted-foreground">Extract, analyze, and validate any document with AI</p>
          </div>
        </div>
        <Badge variant="success" size="sm" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Document AI Ready
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">50+</p>
            <p className="text-sm text-muted-foreground">Document Types</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-emerald-600">99.1%</p>
            <p className="text-sm text-muted-foreground">Extraction Accuracy</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-purple-600">2.1M</p>
            <p className="text-sm text-muted-foreground">Documents Processed</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">0.8s</p>
            <p className="text-sm text-muted-foreground">Avg Processing Time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Upload Documents</CardTitle>
              <CardDescription>Drag and drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="space-y-3">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="text-sm text-muted-foreground">Processing with AI...</p>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">Drop files here</p>
                    <p className="text-sm text-muted-foreground mb-4">PDF, Excel, Word, Images</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Supported Types */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Supported Document Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {supportedDocTypes.map((type, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <Badge variant="ghost" size="sm">{type.count.toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Documents</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          {documents.map((doc) => (
            <Card
              key={doc.id}
              variant="elevated"
              className={`cursor-pointer transition-all ${
                selectedDoc?.id === doc.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                    {doc.fileType === 'PDF' ? '📄' : '📊'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      <Badge variant={doc.status === 'completed' ? 'success' : 'warning'} size="sm">
                        {doc.status === 'completed' ? 'Processed' : 'Processing...'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.documentType}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{doc.extractedFields.length} fields extracted</span>
                      <span>{doc.confidence}% confidence</span>
                    </div>
                  </div>
                </div>

                {selectedDoc?.id === doc.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">{doc.summary}</p>

                    <h4 className="text-sm font-medium mb-2">Extracted Fields</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {doc.extractedFields.map((field, i) => (
                        <div key={i} className="p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">{field.name}</p>
                          <p className="text-sm font-medium truncate">{field.value}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${field.confidence}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{field.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1">
                        <DocumentIcon className="h-4 w-4 mr-1" />
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icons
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
