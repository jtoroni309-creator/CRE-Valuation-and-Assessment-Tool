'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Progress';

interface ConditionAnalysis {
  overall: number;
  components: {
    name: string;
    score: number;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    findings: string[];
  }[];
  defects: {
    type: string;
    severity: 'Critical' | 'Major' | 'Minor' | 'Cosmetic';
    location: string;
    estimatedCost: number;
    confidence: number;
  }[];
  features: {
    name: string;
    detected: boolean;
    quality: string;
    confidence: number;
  }[];
  recommendations: string[];
}

const mockAnalysis: ConditionAnalysis = {
  overall: 78,
  components: [
    {
      name: 'Roof',
      score: 72,
      condition: 'Good',
      findings: ['Minor wear on shingles', 'Flashing intact', 'No visible leaks'],
    },
    {
      name: 'Exterior Walls',
      score: 85,
      condition: 'Good',
      findings: ['Paint in good condition', 'Minor cracks noted', 'Siding secure'],
    },
    {
      name: 'Windows',
      score: 80,
      condition: 'Good',
      findings: ['Double-pane glass', 'Seals intact', 'Frames showing age'],
    },
    {
      name: 'Landscaping',
      score: 75,
      condition: 'Good',
      findings: ['Well-maintained lawn', 'Mature trees', 'Irrigation system visible'],
    },
    {
      name: 'Parking Lot',
      score: 68,
      condition: 'Fair',
      findings: ['Some cracking visible', 'Striping faded', 'Drainage adequate'],
    },
    {
      name: 'HVAC Units',
      score: 82,
      condition: 'Good',
      findings: ['Rooftop units visible', 'Appear well-maintained', 'No rust detected'],
    },
  ],
  defects: [
    { type: 'Roof Wear', severity: 'Minor', location: 'Northwest corner', estimatedCost: 5000, confidence: 89 },
    { type: 'Parking Cracks', severity: 'Minor', location: 'East lot entrance', estimatedCost: 8000, confidence: 94 },
    { type: 'Facade Staining', severity: 'Cosmetic', location: 'South wall', estimatedCost: 3000, confidence: 91 },
    { type: 'Gutter Damage', severity: 'Minor', location: 'Building A', estimatedCost: 2500, confidence: 87 },
  ],
  features: [
    { name: 'Loading Docks', detected: true, quality: 'Good', confidence: 98 },
    { name: 'Roof Solar Panels', detected: true, quality: 'Excellent', confidence: 99 },
    { name: 'Fire Sprinkler System', detected: true, quality: 'Standard', confidence: 92 },
    { name: 'Security Cameras', detected: true, quality: 'Modern', confidence: 95 },
    { name: 'EV Charging Stations', detected: false, quality: 'N/A', confidence: 97 },
    { name: 'Covered Parking', detected: true, quality: 'Good', confidence: 96 },
  ],
  recommendations: [
    'Schedule roof inspection within 6 months to address minor wear',
    'Seal-coat and re-stripe parking lot within 12 months',
    'Power wash south facade to remove staining',
    'Consider adding EV charging infrastructure for tenant demand',
    'Overall property condition supports current valuation assumptions',
  ],
};

export default function AIVisionPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ConditionAnalysis | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'Major': return 'warning';
      case 'Minor': return 'ghost';
      default: return 'ghost';
    }
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
              <span className="text-3xl">👁️</span>
              AI Property Analyzer
            </h1>
            <p className="text-muted-foreground">Computer vision for property condition analysis</p>
          </div>
        </div>
        <Badge variant="success" size="sm" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Vision AI Ready
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-violet-500/10 to-purple-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-violet-600">95%</p>
            <p className="text-sm text-muted-foreground">Detection Accuracy</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-muted-foreground">Detectable Features</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-emerald-500/10 to-green-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-emerald-600">1.2M</p>
            <p className="text-sm text-muted-foreground">Images Analyzed</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">2.8s</p>
            <p className="text-sm text-muted-foreground">Avg Analysis Time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Property Images</CardTitle>
            <CardDescription>Upload photos for AI analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
              <CameraIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium mb-1">Drop images here</p>
              <p className="text-sm text-muted-foreground mb-4">JPG, PNG, HEIC, Drone images</p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>

            {/* Sample Images */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center cursor-pointer hover:ring-2 ring-primary transition-all"
                  onClick={() => setSelectedImages((prev) => [...prev, `image-${i}`])}
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              ))}
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
                  Run Vision Analysis
                </>
              )}
            </Button>
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
                <h3 className="text-lg font-semibold mb-2">Vision AI Processing</h3>
                <p className="text-muted-foreground mb-6">Analyzing property images...</p>
                <div className="space-y-2 max-w-xs mx-auto text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Images loaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span>Running object detection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner size="sm" />
                    <span>Analyzing condition...</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : analysis ? (
            <>
              {/* Overall Score */}
              <Card variant="elevated" className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Overall Property Condition</p>
                      <p className="text-5xl font-bold">{analysis.overall}/100</p>
                      <Badge className="mt-2 bg-white/20 text-white border-0">Good Condition</Badge>
                    </div>
                    <div className="h-32 w-32 rounded-full border-8 border-white/30 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{analysis.overall}%</p>
                        <p className="text-xs text-white/70">Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Component Scores */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Component Analysis</CardTitle>
                  <CardDescription>Condition scoring by property component</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.components.map((comp, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{comp.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={comp.condition === 'Excellent' || comp.condition === 'Good' ? 'success' : 'warning'}>
                              {comp.condition}
                            </Badge>
                            <span className={`text-lg font-bold ${getScoreColor(comp.score)}`}>
                              {comp.score}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full ${
                              comp.score >= 80 ? 'bg-success' : comp.score >= 60 ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${comp.score}%` }}
                          />
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {comp.findings.map((f, j) => (
                            <li key={j} className="flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Defects */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Detected Issues</CardTitle>
                  <CardDescription>AI-identified defects and repair estimates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium">Issue</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Location</th>
                          <th className="text-center py-3 px-4 text-sm font-medium">Severity</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Est. Cost</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.defects.map((defect, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">{defect.type}</td>
                            <td className="py-3 px-4 text-muted-foreground">{defect.location}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={getSeverityColor(defect.severity) as "destructive" | "warning" | "ghost"}>
                                {defect.severity}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">${defect.estimatedCost.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">{defect.confidence}%</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/50">
                          <td colSpan={3} className="py-3 px-4 font-medium">Total Estimated Repairs</td>
                          <td className="py-3 px-4 text-right font-bold">
                            ${analysis.defects.reduce((sum, d) => sum + d.estimatedCost, 0).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <LightbulbIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <DocumentIcon className="h-4 w-4 mr-2" />
                  Generate Condition Report
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
                  <span className="text-4xl">👁️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Property Analysis</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Upload property photos to instantly analyze condition, detect defects,
                  identify features, and get repair cost estimates.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">🔍</p>
                    <p className="text-sm font-medium">Defect Detection</p>
                    <p className="text-xs text-muted-foreground">156 issue types</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">📏</p>
                    <p className="text-sm font-medium">Measurements</p>
                    <p className="text-xs text-muted-foreground">AI-estimated</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl mb-1">💰</p>
                    <p className="text-sm font-medium">Cost Estimates</p>
                    <p className="text-xs text-muted-foreground">Repair pricing</p>
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

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
