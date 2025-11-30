'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Prediction {
  metric: string;
  current: number;
  predictions: { month: string; value: number; low: number; high: number }[];
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }[];
}

const mockPredictions: Prediction[] = [
  {
    metric: 'Property Value',
    current: 12500000,
    predictions: [
      { month: 'Jan 2025', value: 12625000, low: 12400000, high: 12850000 },
      { month: 'Apr 2025', value: 12875000, low: 12550000, high: 13200000 },
      { month: 'Jul 2025', value: 13150000, low: 12700000, high: 13600000 },
      { month: 'Oct 2025', value: 13400000, low: 12850000, high: 13950000 },
      { month: 'Jan 2026', value: 13650000, low: 13000000, high: 14300000 },
    ],
    trend: 'up',
    confidence: 87,
    factors: [
      { name: 'Market Cap Rate Compression', impact: 'positive', weight: 35 },
      { name: 'Rent Growth Momentum', impact: 'positive', weight: 28 },
      { name: 'Interest Rate Environment', impact: 'negative', weight: 20 },
      { name: 'Local Employment Growth', impact: 'positive', weight: 17 },
    ],
  },
  {
    metric: 'Cap Rate',
    current: 5.75,
    predictions: [
      { month: 'Jan 2025', value: 5.65, low: 5.50, high: 5.80 },
      { month: 'Apr 2025', value: 5.55, low: 5.35, high: 5.75 },
      { month: 'Jul 2025', value: 5.45, low: 5.20, high: 5.70 },
      { month: 'Oct 2025', value: 5.40, low: 5.10, high: 5.70 },
      { month: 'Jan 2026', value: 5.35, low: 5.00, high: 5.70 },
    ],
    trend: 'down',
    confidence: 78,
    factors: [
      { name: 'Investor Demand', impact: 'positive', weight: 40 },
      { name: 'Property Quality', impact: 'positive', weight: 25 },
      { name: 'Market Liquidity', impact: 'neutral', weight: 20 },
      { name: 'Risk Premiums', impact: 'negative', weight: 15 },
    ],
  },
  {
    metric: 'NOI',
    current: 850000,
    predictions: [
      { month: 'Jan 2025', value: 867000, low: 850000, high: 884000 },
      { month: 'Apr 2025', value: 884000, low: 859000, high: 909000 },
      { month: 'Jul 2025', value: 901000, low: 867000, high: 935000 },
      { month: 'Oct 2025', value: 918000, low: 876000, high: 960000 },
      { month: 'Jan 2026', value: 935000, low: 884000, high: 986000 },
    ],
    trend: 'up',
    confidence: 82,
    factors: [
      { name: 'Rent Escalations', impact: 'positive', weight: 45 },
      { name: 'Occupancy Stability', impact: 'positive', weight: 30 },
      { name: 'OpEx Inflation', impact: 'negative', weight: 15 },
      { name: 'Lease Renewals', impact: 'positive', weight: 10 },
    ],
  },
];

const scenarios = [
  { name: 'Base Case', probability: 55, valueChange: '+8.5%' },
  { name: 'Bull Case', probability: 25, valueChange: '+14.2%' },
  { name: 'Bear Case', probability: 20, valueChange: '-3.8%' },
];

export default function AIPredictionsPage() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(mockPredictions[0]);
  const [forecastMonths, setForecastMonths] = useState(12);

  const formatValue = (value: number, metric: string) => {
    if (metric === 'Cap Rate') return `${value.toFixed(2)}%`;
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
              <span className="text-3xl">🔮</span>
              Predictive Analytics
            </h1>
            <p className="text-muted-foreground">ML-powered forecasting and scenario analysis</p>
          </div>
        </div>
        <Badge variant="success" size="sm" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Vertex ML Active
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-indigo-600">18mo</p>
            <p className="text-sm text-muted-foreground">Forecast Range</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-emerald-600">91%</p>
            <p className="text-sm text-muted-foreground">Historical Accuracy</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">47</p>
            <p className="text-sm text-muted-foreground">Input Variables</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">Real-time</p>
            <p className="text-sm text-muted-foreground">Model Updates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Metric Selection */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Forecast Metrics</CardTitle>
            <CardDescription>Select metric to view predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPredictions.map((pred, i) => (
              <button
                key={i}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedPrediction.metric === pred.metric
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
                onClick={() => setSelectedPrediction(pred)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pred.metric}</span>
                  {pred.trend === 'up' ? (
                    <TrendUpIcon className={`h-5 w-5 ${selectedPrediction.metric === pred.metric ? 'text-white' : 'text-success'}`} />
                  ) : pred.trend === 'down' ? (
                    <TrendDownIcon className={`h-5 w-5 ${selectedPrediction.metric === pred.metric ? 'text-white' : 'text-destructive'}`} />
                  ) : (
                    <MinusIcon className="h-5 w-5" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${selectedPrediction.metric === pred.metric ? '' : 'text-foreground'}`}>
                  {formatValue(pred.current, pred.metric)}
                </p>
                <p className={`text-sm mt-1 ${selectedPrediction.metric === pred.metric ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {pred.confidence}% confidence
                </p>
              </button>
            ))}

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-medium mb-2 block">Forecast Horizon</label>
              <div className="flex gap-2">
                {[6, 12, 18].map((months) => (
                  <Button
                    key={months}
                    variant={forecastMonths === months ? 'primary' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setForecastMonths(months)}
                  >
                    {months}mo
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Forecast Chart */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedPrediction.metric} Forecast</CardTitle>
                  <CardDescription>{forecastMonths}-month prediction with confidence intervals</CardDescription>
                </div>
                <Badge variant={selectedPrediction.trend === 'up' ? 'success' : selectedPrediction.trend === 'down' ? 'destructive' : 'ghost'}>
                  {selectedPrediction.trend === 'up' ? '↑ Bullish' : selectedPrediction.trend === 'down' ? '↓ Bearish' : '→ Stable'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-4 px-4">
                {/* Current Value */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      className="w-12 bg-muted rounded-t"
                      style={{ height: '120px' }}
                    />
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">Current</p>
                  <p className="text-xs font-medium">{formatValue(selectedPrediction.current, selectedPrediction.metric)}</p>
                </div>

                {/* Predictions */}
                {selectedPrediction.predictions.map((pred, i) => {
                  const baseHeight = 120;
                  const changeRatio = pred.value / selectedPrediction.current;
                  const height = baseHeight * changeRatio;
                  const lowHeight = baseHeight * (pred.low / selectedPrediction.current);
                  const highHeight = baseHeight * (pred.high / selectedPrediction.current);

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full flex justify-center">
                        {/* Confidence Range */}
                        <div
                          className="absolute w-8 bg-primary/10 rounded"
                          style={{
                            height: `${highHeight - lowHeight}px`,
                            bottom: `${lowHeight}px`,
                          }}
                        />
                        {/* Predicted Value */}
                        <div
                          className="w-8 bg-gradient-to-t from-primary to-primary/70 rounded-t relative z-10"
                          style={{ height: `${height}px` }}
                        />
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">{pred.month.split(' ')[0]}</p>
                      <p className="text-xs font-medium">{formatValue(pred.value, selectedPrediction.metric)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>Predicted Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/20" />
                  <span>Confidence Range</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contributing Factors */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Key Drivers</CardTitle>
              <CardDescription>Factors influencing this prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPrediction.factors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      factor.impact === 'positive' ? 'bg-success/10 text-success' :
                      factor.impact === 'negative' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {factor.impact === 'positive' ? <TrendUpIcon className="h-4 w-4" /> :
                       factor.impact === 'negative' ? <TrendDownIcon className="h-4 w-4" /> :
                       <MinusIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{factor.name}</span>
                        <span className="text-sm text-muted-foreground">{factor.weight}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            factor.impact === 'positive' ? 'bg-success' :
                            factor.impact === 'negative' ? 'bg-destructive' :
                            'bg-muted-foreground'
                          }`}
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Analysis */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Scenario Analysis</CardTitle>
              <CardDescription>Probability-weighted outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {scenarios.map((scenario, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      scenario.name === 'Base Case' ? 'border-primary bg-primary/5' :
                      scenario.name === 'Bull Case' ? 'border-success bg-success/5' :
                      'border-destructive bg-destructive/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{scenario.name}</span>
                      <Badge variant="ghost">{scenario.probability}%</Badge>
                    </div>
                    <p className={`text-2xl font-bold ${
                      scenario.name === 'Base Case' ? 'text-primary' :
                      scenario.name === 'Bull Case' ? 'text-success' :
                      'text-destructive'
                    }`}>
                      {scenario.valueChange}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Value Change</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1">
              <DocumentIcon className="h-4 w-4 mr-2" />
              Generate Forecast Report
            </Button>
            <Button variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
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

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function TrendDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
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
