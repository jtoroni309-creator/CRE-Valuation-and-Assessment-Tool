'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface MarketData {
  metro: string;
  propertyType: string;
  metrics: {
    capRate: number;
    capRateChange: number;
    vacancy: number;
    vacancyChange: number;
    rentGrowth: number;
    absorption: string;
    inventory: string;
    underConstruction: string;
  };
  forecast: {
    year: number;
    capRate: number;
    vacancy: number;
    rentGrowth: number;
  }[];
  submarkets: {
    name: string;
    vacancy: number;
    rentGrowth: number;
    rating: number;
    signal: 'buy' | 'hold' | 'sell';
  }[];
  signals: {
    metric: string;
    direction: 'up' | 'down' | 'stable';
    confidence: number;
    timeframe: string;
  }[];
}

const mockMarketData: MarketData = {
  metro: 'Dallas-Fort Worth',
  propertyType: 'Industrial',
  metrics: {
    capRate: 5.65,
    capRateChange: 0.35,
    vacancy: 5.2,
    vacancyChange: 1.8,
    rentGrowth: 6.2,
    absorption: '8.2M SF',
    inventory: '1.02B SF',
    underConstruction: '42.5M SF',
  },
  forecast: [
    { year: 2024, capRate: 5.65, vacancy: 5.2, rentGrowth: 6.2 },
    { year: 2025, capRate: 5.45, vacancy: 5.8, rentGrowth: 4.5 },
    { year: 2026, capRate: 5.30, vacancy: 5.5, rentGrowth: 5.8 },
    { year: 2027, capRate: 5.20, vacancy: 4.8, rentGrowth: 6.1 },
    { year: 2028, capRate: 5.15, vacancy: 4.2, rentGrowth: 5.5 },
  ],
  submarkets: [
    { name: 'South Dallas', vacancy: 3.8, rentGrowth: 8.4, rating: 5, signal: 'buy' },
    { name: 'DFW Airport', vacancy: 4.2, rentGrowth: 7.1, rating: 5, signal: 'buy' },
    { name: 'Fort Worth', vacancy: 5.1, rentGrowth: 5.8, rating: 4, signal: 'hold' },
    { name: 'Great Southwest', vacancy: 6.3, rentGrowth: 4.2, rating: 3, signal: 'hold' },
    { name: 'North Fort Worth', vacancy: 7.8, rentGrowth: 3.1, rating: 3, signal: 'sell' },
    { name: 'Arlington', vacancy: 5.5, rentGrowth: 5.2, rating: 4, signal: 'hold' },
  ],
  signals: [
    { metric: 'Cap Rate', direction: 'down', confidence: 78, timeframe: '12-18 months' },
    { metric: 'Rent Growth', direction: 'up', confidence: 82, timeframe: '6-12 months' },
    { metric: 'Development', direction: 'down', confidence: 91, timeframe: 'Ongoing' },
    { metric: 'Demand', direction: 'up', confidence: 85, timeframe: '24+ months' },
  ],
};

const metros = [
  'Dallas-Fort Worth', 'Houston', 'Austin', 'San Antonio', 'Los Angeles',
  'San Francisco', 'New York', 'Chicago', 'Atlanta', 'Miami',
];

const propertyTypes = ['Industrial', 'Office', 'Retail', 'Multifamily', 'Hotel'];

export default function AIMarketPage() {
  const [selectedMetro, setSelectedMetro] = useState('Dallas-Fort Worth');
  const [selectedType, setSelectedType] = useState('Industrial');
  const [marketData] = useState<MarketData>(mockMarketData);

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
              <span className="text-3xl">📊</span>
              AI Market Intelligence
            </h1>
            <p className="text-muted-foreground">Real-time market analytics and predictive insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm">
            <BellIcon className="h-4 w-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Metro Area</label>
              <select
                className="h-10 px-3 rounded-lg border border-input bg-background min-w-[200px]"
                value={selectedMetro}
                onChange={(e) => setSelectedMetro(e.target.value)}
              >
                {metros.map((metro) => (
                  <option key={metro} value={metro}>{metro}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Property Type</label>
              <div className="flex gap-2">
                {propertyTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Cap Rate</span>
              <Badge variant={marketData.metrics.capRateChange > 0 ? 'warning' : 'success'} size="sm">
                {marketData.metrics.capRateChange > 0 ? '+' : ''}{marketData.metrics.capRateChange}%
              </Badge>
            </div>
            <p className="text-3xl font-bold">{marketData.metrics.capRate}%</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Vacancy</span>
              <Badge variant={marketData.metrics.vacancyChange > 0 ? 'warning' : 'success'} size="sm">
                +{marketData.metrics.vacancyChange}% YoY
              </Badge>
            </div>
            <p className="text-3xl font-bold">{marketData.metrics.vacancy}%</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rent Growth</span>
              <Badge variant="success" size="sm">YoY</Badge>
            </div>
            <p className="text-3xl font-bold text-success">+{marketData.metrics.rentGrowth}%</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Net Absorption</span>
              <Badge variant="ghost" size="sm">QTD</Badge>
            </div>
            <p className="text-3xl font-bold">{marketData.metrics.absorption}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Forecast Chart */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>5-Year Market Forecast</CardTitle>
              <CardDescription>AI-powered predictions based on 2.5M+ data points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2">
                {marketData.forecast.map((year, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full space-y-1 mb-2">
                      <div
                        className="w-full bg-primary/80 rounded-t"
                        style={{ height: `${(year.rentGrowth / 8) * 150}px` }}
                        title={`Rent Growth: ${year.rentGrowth}%`}
                      />
                      <div
                        className="w-full bg-secondary/60 rounded"
                        style={{ height: `${(year.vacancy / 8) * 100}px` }}
                        title={`Vacancy: ${year.vacancy}%`}
                      />
                    </div>
                    <p className="text-sm font-medium">{year.year}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      <p>Cap: {year.capRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/80" />
                  <span>Rent Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-secondary/60" />
                  <span>Vacancy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submarket Analysis */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Submarket Performance</CardTitle>
              <CardDescription>AI investment signals by submarket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium">Submarket</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Vacancy</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Rent Growth</th>
                      <th className="text-center py-3 px-4 text-sm font-medium">Rating</th>
                      <th className="text-center py-3 px-4 text-sm font-medium">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.submarkets.map((sub, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{sub.name}</td>
                        <td className="text-right py-3 px-4">{sub.vacancy}%</td>
                        <td className="text-right py-3 px-4 text-success">+{sub.rentGrowth}%</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex justify-center">
                            {[...Array(5)].map((_, j) => (
                              <StarIcon
                                key={j}
                                className={`h-4 w-4 ${j < sub.rating ? 'text-amber-500' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge
                            variant={sub.signal === 'buy' ? 'success' : sub.signal === 'hold' ? 'warning' : 'destructive'}
                          >
                            {sub.signal.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Signals */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                AI Investment Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.signals.map((signal, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{signal.metric}</span>
                    <div className="flex items-center gap-1">
                      {signal.direction === 'up' ? (
                        <TrendUpIcon className="h-4 w-4 text-success" />
                      ) : signal.direction === 'down' ? (
                        <TrendDownIcon className="h-4 w-4 text-destructive" />
                      ) : (
                        <MinusIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${
                        signal.direction === 'up' ? 'text-success' :
                        signal.direction === 'down' ? 'text-destructive' : ''
                      }`}>
                        {signal.direction === 'up' ? 'Bullish' : signal.direction === 'down' ? 'Bearish' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{signal.confidence}% confidence</span>
                    <span>{signal.timeframe}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Stats */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Inventory</span>
                <span className="font-medium">{marketData.metrics.inventory}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Under Construction</span>
                <span className="font-medium">{marketData.metrics.underConstruction}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Net Absorption (QTD)</span>
                <span className="font-medium">{marketData.metrics.absorption}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Data Freshness</span>
                <Badge variant="success" size="sm">Live</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <DocumentIcon className="h-4 w-4 mr-2" />
                Generate Market Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BellIcon className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
