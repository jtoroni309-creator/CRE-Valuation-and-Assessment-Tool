'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Progress';

interface ValuationApproach {
  name: string;
  value: number;
  confidence: number;
  weight: number;
  details: Record<string, string | number>;
}

interface ValuationResult {
  propertyAddress: string;
  propertyType: string;
  size: number;
  finalValue: number;
  valueRange: { low: number; high: number };
  confidence: number;
  approaches: ValuationApproach[];
  comparables: Array<{
    address: string;
    salePrice: number;
    pricePerSF: number;
    saleDate: string;
    adjustedValue: number;
    similarity: number;
  }>;
  insights: string[];
  generatedAt: Date;
}

const mockValuation: ValuationResult = {
  propertyAddress: '123 Main Street, Manhattan, NY 10001',
  propertyType: 'Class A Office',
  size: 75000,
  finalValue: 79500000,
  valueRange: { low: 77500000, high: 81500000 },
  confidence: 92,
  approaches: [
    {
      name: 'Income Approach',
      value: 80614286,
      confidence: 91,
      weight: 45,
      details: {
        'Potential Gross Income': '$6,750,000',
        'Vacancy & Credit Loss': '5%',
        'Effective Gross Income': '$6,412,500',
        'Operating Expenses': '$2,180,250',
        'Net Operating Income': '$4,232,250',
        'Capitalization Rate': '5.25%',
      },
    },
    {
      name: 'Sales Comparison',
      value: 78750000,
      confidence: 89,
      weight: 40,
      details: {
        'Comparables Analyzed': 12,
        'Average $/SF': '$1,050',
        'Median $/SF': '$1,042',
        'Adjustment Range': '-8% to +12%',
      },
    },
    {
      name: 'Cost Approach',
      value: 78218750,
      confidence: 85,
      weight: 15,
      details: {
        'Land Value': '$32,000,000',
        'Replacement Cost New': '$54,375,000',
        'Physical Depreciation': '10%',
        'Functional Obsolescence': '3%',
        'External Obsolescence': '2%',
      },
    },
  ],
  comparables: [
    { address: '450 Park Avenue', salePrice: 95200000, pricePerSF: 1134, saleDate: '2024-08-15', adjustedValue: 81675000, similarity: 94 },
    { address: '530 Fifth Avenue', salePrice: 82400000, pricePerSF: 1098, saleDate: '2024-06-22', adjustedValue: 80025000, similarity: 91 },
    { address: '375 Hudson Street', salePrice: 71800000, pricePerSF: 987, saleDate: '2024-09-10', adjustedValue: 76575000, similarity: 88 },
    { address: '200 West 41st St', salePrice: 68500000, pricePerSF: 952, saleDate: '2024-05-18', adjustedValue: 74250000, similarity: 85 },
    { address: '1440 Broadway', salePrice: 89100000, pricePerSF: 1089, saleDate: '2024-07-30', adjustedValue: 79125000, similarity: 92 },
  ],
  insights: [
    'Property trades at 4% premium to submarket average due to recent lobby and HVAC renovations',
    'Current 95% occupancy exceeds market average of 87%, supporting premium valuation',
    'NOI could increase 12% with lease-up of remaining 3,750 SF of vacancy',
    'Cap rate compression of 25 bps expected in next 12 months based on market trends',
    'ESG improvements (LEED certification) could add 3-5% value premium',
    'Strong tenant credit profile reduces risk premium by estimated 15 bps',
  ],
  generatedAt: new Date(),
};

export default function AIValuationPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [formData, setFormData] = useState({
    address: '',
    propertyType: 'office',
    size: '',
    yearBuilt: '',
    occupancy: '',
    noi: '',
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setValuation(mockValuation);
      setIsAnalyzing(false);
    }, 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

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
              <span className="text-3xl">💎</span>
              AI Valuation Engine
            </h1>
            <p className="text-muted-foreground">Multi-approach property valuation with ML-powered insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Gemini Pro Active
          </Badge>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-emerald-600">99.2%</p>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">2.8M</p>
            <p className="text-sm text-muted-foreground">Properties Valued</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-purple-600">1.4s</p>
            <p className="text-sm text-muted-foreground">Avg Analysis Time</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">$142B</p>
            <p className="text-sm text-muted-foreground">Total Value Analyzed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
            <CardDescription>Enter property information for AI valuation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Property Address</label>
              <Input
                placeholder="123 Main St, City, State ZIP"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Property Type</label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              >
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
                <option value="multifamily">Multifamily</option>
                <option value="hotel">Hotel</option>
                <option value="mixed">Mixed-Use</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Size (SF)</label>
                <Input
                  type="number"
                  placeholder="75,000"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Year Built</label>
                <Input
                  type="number"
                  placeholder="2005"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Occupancy (%)</label>
                <Input
                  type="number"
                  placeholder="95"
                  value={formData.occupancy}
                  onChange={(e) => setFormData({ ...formData, occupancy: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">NOI (Annual)</label>
                <Input
                  placeholder="$4,200,000"
                  value={formData.noi}
                  onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Analyzing Property...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Run AI Valuation
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full">
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing ? (
            <Card variant="elevated" className="p-12">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                  <Spinner size="lg" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Valuation in Progress</h3>
                <p className="text-muted-foreground mb-6">Analyzing property data and market comparables...</p>
                <div className="space-y-2 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Property data validated</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Market comparables identified</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner size="sm" />
                    <span>Running valuation models...</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : valuation ? (
            <>
              {/* Value Summary */}
              <Card variant="elevated" className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Final Value Opinion</p>
                      <p className="text-4xl font-bold">{formatCurrency(valuation.finalValue)}</p>
                      <p className="text-white/70 text-sm mt-1">
                        Range: {formatCurrency(valuation.valueRange.low)} - {formatCurrency(valuation.valueRange.high)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-2xl font-bold">{valuation.confidence}%</span>
                        <span className="text-sm">Confidence</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1 bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Property</p>
                      <p className="font-medium">{valuation.propertyType}</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Size</p>
                      <p className="font-medium">{valuation.size.toLocaleString()} SF</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Price/SF</p>
                      <p className="font-medium">{formatCurrency(valuation.finalValue / valuation.size)}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">{valuation.propertyAddress}</p>
                </CardContent>
              </Card>

              {/* Approaches */}
              <div className="grid md:grid-cols-3 gap-4">
                {valuation.approaches.map((approach, i) => (
                  <Card key={i} variant="elevated">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{approach.name}</CardTitle>
                        <Badge variant="ghost">{approach.weight}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {formatCurrency(approach.value)}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            style={{ width: `${approach.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{approach.confidence}%</span>
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(approach.details).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparables */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Comparable Sales Analysis</CardTitle>
                  <CardDescription>AI-selected and adjusted comparable properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium">Property</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Sale Price</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">$/SF</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Sale Date</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Adj. Value</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Similarity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {valuation.comparables.map((comp, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <p className="font-medium">{comp.address}</p>
                            </td>
                            <td className="text-right py-3 px-4">{formatCurrency(comp.salePrice)}</td>
                            <td className="text-right py-3 px-4">${comp.pricePerSF}</td>
                            <td className="text-right py-3 px-4 text-muted-foreground">{comp.saleDate}</td>
                            <td className="text-right py-3 px-4 font-medium">{formatCurrency(comp.adjustedValue)}</td>
                            <td className="text-right py-3 px-4">
                              <Badge variant={comp.similarity >= 90 ? 'success' : 'warning'}>
                                {comp.similarity}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                    AI Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {valuation.insights.map((insight, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <LightbulbIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <DocumentIcon className="h-4 w-4 mr-2" />
                  Generate Full Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <ChartIcon className="h-4 w-4 mr-2" />
                  Sensitivity Analysis
                </Button>
                <Button variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </>
          ) : (
            <Card variant="elevated" className="p-12">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Property Valuation</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Enter property details or upload documents to get an instant, comprehensive
                  valuation analysis using our advanced AI models.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">📊</p>
                    <p className="text-sm font-medium">3 Approaches</p>
                    <p className="text-xs text-muted-foreground">Income, Sales, Cost</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">🎯</p>
                    <p className="text-sm font-medium">99.2% Accuracy</p>
                    <p className="text-xs text-muted-foreground">Industry-leading</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">⚡</p>
                    <p className="text-sm font-medium">Instant Results</p>
                    <p className="text-xs text-muted-foreground">Under 2 seconds</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
