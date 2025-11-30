'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Progress';

interface InvestmentAnalysis {
  property: {
    name: string;
    type: string;
    location: string;
    price: number;
    size: number;
  };
  score: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  returns: {
    irr: number;
    equityMultiple: number;
    cashOnCash: number;
    capRate: number;
  };
  risks: {
    name: string;
    level: 'Low' | 'Medium' | 'High';
    impact: string;
    mitigation: string;
  }[];
  opportunities: {
    name: string;
    potential: string;
    probability: number;
  }[];
  comparisons: {
    metric: string;
    subject: number;
    market: number;
    percentile: number;
  }[];
  aiInsights: string[];
}

const mockAnalysis: InvestmentAnalysis = {
  property: {
    name: 'Riverside Business Park',
    type: 'Industrial',
    location: 'Dallas, TX',
    price: 28500000,
    size: 185000,
  },
  score: 82,
  recommendation: 'Buy',
  returns: {
    irr: 18.5,
    equityMultiple: 2.15,
    cashOnCash: 8.2,
    capRate: 6.1,
  },
  risks: [
    { name: 'Single Tenant Risk', level: 'Medium', impact: 'High rollover exposure in Y3', mitigation: 'Negotiate early renewal with rent step' },
    { name: 'Interest Rate Risk', level: 'High', impact: 'Refinance risk at exit', mitigation: 'Lock in fixed-rate debt' },
    { name: 'Market Cyclicality', level: 'Low', impact: 'Industrial demand strong', mitigation: 'Focus on logistics tenants' },
    { name: 'Environmental', level: 'Low', impact: 'Phase I clear', mitigation: 'Standard indemnification' },
  ],
  opportunities: [
    { name: 'Below-Market Rents', potential: '+$2.50/SF upon renewal', probability: 85 },
    { name: 'Parking Expansion', potential: '+25 trailer spaces', probability: 70 },
    { name: 'Solar Installation', potential: 'Revenue + ESG premium', probability: 60 },
    { name: 'Land Subdivision', potential: '2 acres excess land', probability: 45 },
  ],
  comparisons: [
    { metric: 'Cap Rate', subject: 6.1, market: 5.8, percentile: 35 },
    { metric: 'Price/SF', subject: 154, market: 168, percentile: 72 },
    { metric: 'NOI/SF', subject: 9.40, market: 8.75, percentile: 68 },
    { metric: 'Occupancy', subject: 100, market: 94.5, percentile: 92 },
  ],
  aiInsights: [
    'Property trades at 8% discount to market on $/SF basis, indicating potential value',
    'Strong credit tenant with 12 years remaining - rare in current market',
    'Submarket vacancy at 3.2% supports rent growth thesis',
    'Exit cap rate compression likely given logistics demand trends',
    'Value-add through land development could add $2-3M to exit value',
    'ESG improvements (solar, LED) could attract premium buyers at exit',
  ],
};

const recentDeals = [
  { name: 'Metro Office Tower', type: 'Office', score: 76, recommendation: 'Hold', returns: 14.2 },
  { name: 'Sunset Apartments', type: 'Multifamily', score: 88, recommendation: 'Strong Buy', returns: 21.5 },
  { name: 'Harbor Retail Center', type: 'Retail', score: 62, recommendation: 'Sell', returns: 8.1 },
  { name: 'Tech Campus III', type: 'Office', score: 71, recommendation: 'Hold', returns: 12.8 },
];

export default function AIInvestmentPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('Buy')) return 'success';
    if (rec.includes('Hold')) return 'warning';
    return 'destructive';
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
              <span className="text-3xl">💼</span>
              AI Investment Advisor
            </h1>
            <p className="text-muted-foreground">AI-driven investment analysis and recommendations</p>
          </div>
        </div>
        <Badge variant="success" size="sm" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          ML Models Active
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-emerald-500/10 to-green-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-emerald-600">$2.8B</p>
            <p className="text-sm text-muted-foreground">Deals Analyzed</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">89%</p>
            <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-purple-600">156</p>
            <p className="text-sm text-muted-foreground">Risk Factors</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">18.5%</p>
            <p className="text-sm text-muted-foreground">Avg Recommended IRR</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input / Recent Deals */}
        <div className="space-y-6">
          {/* Quick Analysis */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Analyze Deal</CardTitle>
              <CardDescription>Enter property details for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Property Name</label>
                <Input placeholder="Riverside Business Park" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Property Type</label>
                <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                  <option>Industrial</option>
                  <option>Office</option>
                  <option>Retail</option>
                  <option>Multifamily</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price</label>
                  <Input placeholder="$28,500,000" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Size (SF)</label>
                  <Input placeholder="185,000" />
                </div>
              </div>
              <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Deals */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentDeals.map((deal, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{deal.name}</span>
                    <Badge variant={getRecommendationColor(deal.recommendation) as "success" | "warning" | "destructive"} size="sm">
                      {deal.recommendation}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{deal.type}</span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground">{deal.score}</span>
                      Score | {deal.returns}% IRR
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing ? (
            <Card variant="elevated" className="p-12">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                  <Spinner size="lg" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
                <p className="text-muted-foreground mb-6">Evaluating investment opportunity...</p>
                <div className="space-y-2 max-w-xs mx-auto text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Property data validated</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Market comparables loaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner size="sm" />
                    <span>Running investment models...</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : analysis ? (
            <>
              {/* Score Card */}
              <Card variant="elevated" className="overflow-hidden">
                <div className={`bg-gradient-to-r ${getScoreColor(analysis.score)} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{analysis.property.name}</p>
                      <p className="text-lg">{analysis.property.type} • {analysis.property.location}</p>
                      <p className="text-3xl font-bold mt-2">{formatCurrency(analysis.property.price)}</p>
                    </div>
                    <div className="text-right">
                      <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold">{analysis.score}</p>
                        <p className="text-xs text-white/80">AI Score</p>
                      </div>
                      <Badge className="mt-3 bg-white text-primary border-0" size="lg">
                        {analysis.recommendation}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{analysis.returns.irr}%</p>
                      <p className="text-xs text-muted-foreground">Projected IRR</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{analysis.returns.equityMultiple}x</p>
                      <p className="text-xs text-muted-foreground">Equity Multiple</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{analysis.returns.cashOnCash}%</p>
                      <p className="text-xs text-muted-foreground">Cash-on-Cash</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{analysis.returns.capRate}%</p>
                      <p className="text-xs text-muted-foreground">Cap Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Risks */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.risks.map((risk, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{risk.name}</span>
                          <Badge variant={risk.level === 'High' ? 'destructive' : risk.level === 'Medium' ? 'warning' : 'success'} size="sm">
                            {risk.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{risk.impact}</p>
                        <p className="text-xs text-success">✓ {risk.mitigation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg text-success">Value-Add Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.opportunities.map((opp, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{opp.name}</span>
                          <span className="text-xs text-muted-foreground">{opp.probability}% likely</span>
                        </div>
                        <p className="text-sm text-success font-medium">{opp.potential}</p>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${opp.probability}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Market Comparison */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Market Positioning</CardTitle>
                  <CardDescription>How this deal compares to market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.comparisons.map((comp, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{comp.metric}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Subject: <strong>{comp.subject}{comp.metric === 'Cap Rate' || comp.metric === 'Occupancy' ? '%' : ''}</strong></span>
                            <span className="text-muted-foreground">Market: {comp.market}{comp.metric === 'Cap Rate' || comp.metric === 'Occupancy' ? '%' : ''}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-full" style={{ width: `${comp.percentile}%` }} />
                          <div className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded" style={{ left: `${comp.percentile}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{comp.percentile}th percentile</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                    AI Investment Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {analysis.aiInsights.map((insight, i) => (
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
                  Generate Investment Memo
                </Button>
                <Button variant="outline" className="flex-1">
                  <ChartIcon className="h-4 w-4 mr-2" />
                  Run Sensitivity Analysis
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
                  <span className="text-4xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Investment Analysis</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Enter deal details to get AI-powered investment recommendations,
                  risk assessment, and value-add opportunities.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">🎯</p>
                    <p className="text-sm font-medium">Deal Scoring</p>
                    <p className="text-xs text-muted-foreground">0-100 scale</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">⚠️</p>
                    <p className="text-sm font-medium">Risk Analysis</p>
                    <p className="text-xs text-muted-foreground">156 factors</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">💡</p>
                    <p className="text-sm font-medium">Opportunities</p>
                    <p className="text-xs text-muted-foreground">Value-add ideas</p>
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
