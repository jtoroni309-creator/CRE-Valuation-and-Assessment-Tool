'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Progress';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { type: string; title: string; confidence: number }[];
  suggestedActions?: string[];
  metadata?: {
    model: string;
    tokensUsed: number;
    responseTime: number;
    confidence: number;
  };
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  status: 'online' | 'offline' | 'limited';
}

const aiModels: AIModel[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Advanced reasoning & analysis',
    icon: '🧠',
    capabilities: ['Valuations', 'Appeals', 'Analysis', 'Research'],
    status: 'online',
  },
  {
    id: 'gemini-vision',
    name: 'Gemini Vision',
    description: 'Property image analysis',
    icon: '👁️',
    capabilities: ['Image Analysis', 'Condition Assessment', 'Defect Detection'],
    status: 'online',
  },
  {
    id: 'document-ai',
    name: 'Document AI',
    description: 'Intelligent document processing',
    icon: '📄',
    capabilities: ['OCR', 'Entity Extraction', 'Form Processing'],
    status: 'online',
  },
  {
    id: 'vertex-ml',
    name: 'Vertex ML',
    description: 'Predictive models & forecasting',
    icon: '📊',
    capabilities: ['Price Prediction', 'Risk Analysis', 'Forecasting'],
    status: 'online',
  },
];

const suggestedPrompts = [
  {
    title: 'AI Valuation',
    prompt: 'Perform a comprehensive valuation analysis for a 75,000 SF Class A office building in Manhattan with 95% occupancy',
    icon: '💰',
    category: 'valuation',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Appeal Strategy',
    prompt: 'Develop a multi-pronged tax appeal strategy for a $25M retail property that appears over-assessed by 18%',
    icon: '⚖️',
    category: 'appeal',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Market Intelligence',
    prompt: 'Provide a comprehensive market analysis for industrial properties in the Dallas-Fort Worth metroplex with 5-year projections',
    icon: '📈',
    category: 'market',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Investment Analysis',
    prompt: 'Analyze investment potential for a 300-unit multifamily acquisition at $45M with value-add opportunity',
    icon: '🎯',
    category: 'investment',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Risk Assessment',
    prompt: 'Conduct a comprehensive risk assessment for a portfolio of 12 retail properties across 5 states',
    icon: '🛡️',
    category: 'risk',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    title: 'Comparable Search',
    prompt: 'Find and analyze the best comparable sales for a 150-room limited-service hotel in suburban Chicago',
    icon: '🔍',
    category: 'comparable',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

const aiCapabilities = [
  {
    title: 'Valuation Engine',
    description: 'AI-powered multi-approach valuations with confidence scoring',
    href: '/ai/valuation',
    icon: '💎',
    features: ['Income Approach', 'Sales Comparison', 'Cost Approach', 'Reconciliation'],
    metric: '99.2%',
    metricLabel: 'Accuracy',
  },
  {
    title: 'Market Intelligence',
    description: 'Real-time market analytics and predictive insights',
    href: '/ai/market',
    icon: '📊',
    features: ['Trend Analysis', 'Forecasting', 'Heat Maps', 'Alerts'],
    metric: '2.5M+',
    metricLabel: 'Data Points',
  },
  {
    title: 'Document Intelligence',
    description: 'Extract and analyze data from any document type',
    href: '/ai/documents',
    icon: '📑',
    features: ['OCR', 'Data Extraction', 'Classification', 'Validation'],
    metric: '50+',
    metricLabel: 'Doc Types',
  },
  {
    title: 'Property Analyzer',
    description: 'Computer vision for property condition analysis',
    href: '/ai/vision',
    icon: '👁️',
    features: ['Condition Scoring', 'Defect Detection', 'Quality Assessment', 'Measurements'],
    metric: '95%',
    metricLabel: 'Detection Rate',
  },
  {
    title: 'Predictive Analytics',
    description: 'ML-powered forecasting and predictions',
    href: '/ai/predictions',
    icon: '🔮',
    features: ['Value Forecasts', 'Risk Modeling', 'Scenario Analysis', 'Trends'],
    metric: '18mo',
    metricLabel: 'Forecast Range',
  },
  {
    title: 'Investment Advisor',
    description: 'AI-driven investment analysis and recommendations',
    href: '/ai/investment',
    icon: '💼',
    features: ['Deal Scoring', 'ROI Analysis', 'Portfolio Optimization', 'Comparisons'],
    metric: '$2.8B',
    metricLabel: 'Analyzed',
  },
];

export default function AIHubPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    setShowChat(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with enhanced metadata
    setTimeout(() => {
      const responseTime = Math.floor(Math.random() * 1500) + 800;
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateEnhancedResponse(messageText),
        timestamp: new Date(),
        sources: generateSources(messageText),
        suggestedActions: generateActions(messageText),
        metadata: {
          model: selectedModel,
          tokensUsed: Math.floor(Math.random() * 2000) + 500,
          responseTime,
          confidence: Math.floor(Math.random() * 15) + 85,
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const generateSources = (prompt: string): Message['sources'] => {
    const allSources = [
      { type: 'Market Data', title: 'CoStar Q4 2024 Report', confidence: 94 },
      { type: 'Comparable', title: '123 Main St Sale ($12.5M)', confidence: 91 },
      { type: 'Assessment', title: 'County Records 2024', confidence: 98 },
      { type: 'Research', title: 'CBRE Industrial Outlook', confidence: 89 },
      { type: 'Financial', title: 'Property Financials YTD', confidence: 96 },
      { type: 'Demographic', title: 'Census Bureau ACS 2023', confidence: 99 },
    ];
    return allSources.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const generateActions = (prompt: string): string[] => {
    if (prompt.toLowerCase().includes('valuation')) {
      return ['Generate Full Appraisal Report', 'Run Sensitivity Analysis', 'Export to PDF', 'Compare Approaches'];
    }
    if (prompt.toLowerCase().includes('appeal')) {
      return ['Draft Appeal Letter', 'Gather Evidence Package', 'Schedule Hearing', 'Calculate Potential Savings'];
    }
    if (prompt.toLowerCase().includes('market') || prompt.toLowerCase().includes('investment')) {
      return ['Create Investment Memo', 'Run Scenario Models', 'Generate Presentation', 'Set Market Alerts'];
    }
    return ['Generate Report', 'Deep Dive Analysis', 'Export Results', 'Schedule Follow-up'];
  };

  const generateEnhancedResponse = (prompt: string): string => {
    if (prompt.toLowerCase().includes('valuation') || prompt.toLowerCase().includes('value')) {
      return `## Comprehensive Valuation Analysis

I've completed a detailed valuation analysis using our proprietary AI valuation engine. Here's the executive summary:

### Property Overview
- **Asset Class:** Class A Office
- **Size:** 75,000 SF
- **Location:** Manhattan, NY
- **Occupancy:** 95% (above market average of 87%)

---

### Income Approach Analysis
| Metric | Value | Confidence |
|--------|-------|------------|
| Potential Gross Income | $6,750,000 | 94% |
| Vacancy & Collection Loss | ($337,500) | 91% |
| Effective Gross Income | $6,412,500 | 93% |
| Operating Expenses | ($2,180,250) | 89% |
| Net Operating Income | **$4,232,250** | 92% |
| Market Cap Rate | 5.25% | 88% |
| **Indicated Value** | **$80,614,286** | 91% |

---

### Sales Comparison Approach
Analyzed **12 comparable sales** within 0.5 miles, closed within 18 months:

| Comparable | Sale Price | $/SF | Adj. Value |
|------------|-----------|------|------------|
| 450 Park Ave | $95.2M | $1,134 | $1,089/SF |
| 530 Fifth Ave | $82.4M | $1,098 | $1,067/SF |
| 375 Hudson St | $71.8M | $987 | $1,021/SF |

**Indicated Value:** **$78,750,000** ($1,050/SF)

---

### Cost Approach
- Land Value: $32,000,000
- Replacement Cost: $54,375,000
- Less Depreciation: ($8,156,250)
- **Indicated Value:** **$78,218,750**

---

### 🎯 Reconciled Value Opinion

| Approach | Indication | Weight | Contribution |
|----------|------------|--------|--------------|
| Income | $80,614,286 | 45% | $36,276,429 |
| Sales Comparison | $78,750,000 | 40% | $31,500,000 |
| Cost | $78,218,750 | 15% | $11,732,813 |

## **Final Value Conclusion: $79,500,000**
### Confidence Level: 92% | Range: $77.5M - $81.5M

---

### AI Insights
- Property trades at 4% premium to submarket due to recent renovations
- NOI could increase 12% with lease-up of remaining vacancy
- Cap rate compression of 25 bps expected in next 12 months
- ESG improvements could add 3-5% value premium`;
    }

    if (prompt.toLowerCase().includes('appeal') || prompt.toLowerCase().includes('tax')) {
      return `## Strategic Tax Appeal Analysis

I've conducted a comprehensive analysis of the property's assessment and identified multiple grounds for a successful appeal.

### Current Assessment Status
| Item | Assessed | Market | Variance |
|------|----------|--------|----------|
| Land Value | $8,500,000 | $7,200,000 | +18.1% |
| Improvements | $16,500,000 | $13,800,000 | +19.6% |
| **Total** | **$25,000,000** | **$21,000,000** | **+19.0%** |

---

### 🎯 Appeal Strategy Matrix

#### Primary Ground: Unequal Assessment (Strongest)
- **Confidence Score:** 94%
- **Evidence:** 8 comparable properties assessed 15-22% lower
- **Potential Reduction:** $3,200,000 - $4,000,000

#### Secondary Ground: Market Value Overstatement
- **Confidence Score:** 87%
- **Evidence:** Recent sales indicate 12% market decline
- **Potential Reduction:** $2,800,000 - $3,200,000

#### Tertiary Ground: Incorrect Property Data
- **Confidence Score:** 91%
- **Issues Found:**
  - Building SF: 48,000 (actual: 42,500) — **11.5% overstatement**
  - Year Built: Listed as 2005 (actual: 1998)
  - Condition: Listed "Excellent" (actual: "Good")

---

### Supporting Evidence Package

| Evidence Type | Source | Impact | Status |
|---------------|--------|--------|--------|
| Independent Appraisal | Cushman & Wakefield | High | Recommended |
| Comparable Assessments | County Records | High | ✅ Gathered |
| Income & Expense | Property Records | Medium | ✅ Available |
| Condition Report | Engineering Firm | Medium | Recommended |
| Recent Sales Data | CoStar/RCA | High | ✅ Analyzed |

---

### 📊 Financial Impact Analysis

| Scenario | Assessed Value | Tax Liability | Annual Savings |
|----------|---------------|---------------|----------------|
| Current | $25,000,000 | $625,000 | — |
| Conservative Win | $22,500,000 | $562,500 | **$62,500** |
| Expected Win | $21,000,000 | $525,000 | **$100,000** |
| Best Case | $19,500,000 | $487,500 | **$137,500** |

### **Success Probability: 84%**
### **Expected NPV of Appeal (5-year): $425,000**

---

### Recommended Timeline
1. **Week 1-2:** Gather all evidence, order appraisal
2. **Week 3:** File informal appeal with evidence package
3. **Week 4-6:** Negotiation with assessor's office
4. **If needed:** File formal appeal by deadline`;
    }

    if (prompt.toLowerCase().includes('market') || prompt.toLowerCase().includes('industrial')) {
      return `## Dallas-Fort Worth Industrial Market Intelligence

I've analyzed the DFW industrial market using real-time data from multiple sources to provide comprehensive insights and projections.

### 📊 Market Snapshot (Q4 2024)

| Metric | Current | YoY Change | 5-Yr Avg |
|--------|---------|------------|----------|
| Total Inventory | 1.02B SF | +4.8% | 890M SF |
| Vacancy Rate | 5.2% | +180 bps | 4.1% |
| Avg. Asking Rent | $8.45/SF NNN | +6.2% | $6.78/SF |
| Net Absorption | 8.2M SF QTD | -22% | 11.4M SF |
| Under Construction | 42.5M SF | -31% | 58.2M SF |
| Cap Rate | 5.65% | +35 bps | 5.15% |

---

### 🗺️ Submarket Performance Matrix

| Submarket | Vacancy | Rent Growth | Absorption | Rating |
|-----------|---------|-------------|------------|--------|
| South Dallas | 3.8% | +8.4% | Strong | ⭐⭐⭐⭐⭐ |
| DFW Airport | 4.2% | +7.1% | Strong | ⭐⭐⭐⭐⭐ |
| Fort Worth | 5.1% | +5.8% | Moderate | ⭐⭐⭐⭐ |
| Great SW | 6.3% | +4.2% | Moderate | ⭐⭐⭐ |
| North Fort Worth | 7.8% | +3.1% | Slowing | ⭐⭐⭐ |

---

### 📈 5-Year Market Projections

\`\`\`
Vacancy Rate Forecast:
2024: 5.2% ━━━━━━━━━━━━━━━━
2025: 5.8% ━━━━━━━━━━━━━━━━━━━
2026: 5.5% ━━━━━━━━━━━━━━━━━
2027: 4.8% ━━━━━━━━━━━━━━━
2028: 4.2% ━━━━━━━━━━━━━

Rent Growth Forecast (Annual):
2024: +6.2%  ████████████
2025: +4.5%  █████████
2026: +5.8%  ███████████
2027: +6.1%  ████████████
2028: +5.5%  ███████████
\`\`\`

---

### 🔮 AI-Powered Investment Signals

| Signal | Direction | Confidence | Timeframe |
|--------|-----------|------------|-----------|
| Cap Rate | Compression | 78% | 12-18 mo |
| Rent Growth | Acceleration | 82% | 6-12 mo |
| Development | Slowdown | 91% | Ongoing |
| Demand | Strong | 85% | 24+ mo |

---

### 🎯 Key Investment Recommendations

**BUY Zones:**
- South Dallas (I-20/I-45 corridor)
- DFW Airport area (esp. near Amazon hub)
- Intermodal hubs near railroads

**HOLD Zones:**
- Established Fort Worth industrial parks
- I-35 corridor (Austin-DFW)

**CAUTION Zones:**
- Speculative developments in outer submarkets
- Properties with single-tenant risk

---

### 📡 Market Alerts Configured
- Cap rate changes > 25 bps
- Vacancy spikes > 150 bps
- Major lease signings > 200K SF
- New development announcements`;
    }

    if (prompt.toLowerCase().includes('investment') || prompt.toLowerCase().includes('multifamily')) {
      return `## Investment Analysis: 300-Unit Multifamily Acquisition

I've performed a comprehensive investment analysis for this value-add multifamily opportunity.

### 📋 Property Overview
| Attribute | Details |
|-----------|---------|
| Units | 300 |
| Avg. Unit Size | 925 SF |
| Year Built | 2008 |
| Acquisition Price | $45,000,000 |
| Price/Unit | $150,000 |
| Price/SF | $162 |

---

### 💰 Current Financial Performance

| Metric | Current | Market | Gap |
|--------|---------|--------|-----|
| Avg. Rent | $1,425 | $1,685 | $260 (18.2%) |
| Occupancy | 91% | 95% | 4% |
| OpEx Ratio | 48% | 42% | 6% |
| NOI | $2,847,000 | $3,986,400 | $1,139,400 |
| Cap Rate (In-Place) | 6.33% | — | — |

---

### 🔨 Value-Add Strategy Analysis

**Renovation Program:**
| Item | Cost/Unit | Total Cost | Rent Premium |
|------|-----------|------------|--------------|
| Kitchen Upgrade | $8,500 | $2,550,000 | +$125/mo |
| Bath Renovation | $4,200 | $1,260,000 | +$75/mo |
| Flooring | $3,800 | $1,140,000 | +$50/mo |
| Smart Home | $1,200 | $360,000 | +$35/mo |
| **Total Interior** | **$17,700** | **$5,310,000** | **+$285/mo** |

**Common Area Improvements:**
| Item | Cost | Impact |
|------|------|--------|
| Clubhouse Renovation | $450,000 | Retention +3% |
| Pool/Amenity Upgrade | $280,000 | Rent Premium +$25 |
| Fitness Center | $175,000 | Competitive parity |
| Landscaping/Signage | $125,000 | Curb appeal |
| **Total Common** | **$1,030,000** | — |

---

### 📊 Pro Forma Projections (5-Year)

| Year | Occupancy | Avg Rent | NOI | Value (@5.5%) |
|------|-----------|----------|-----|---------------|
| Y0 | 91% | $1,425 | $2,847,000 | $45,000,000 |
| Y1 | 88% | $1,525 | $2,956,000 | $53,745,000 |
| Y2 | 93% | $1,650 | $3,512,000 | $63,854,000 |
| Y3 | 95% | $1,710 | $3,842,000 | $69,855,000 |
| Y4 | 95% | $1,760 | $3,986,000 | $72,473,000 |
| Y5 | 96% | $1,815 | $4,186,000 | $76,109,000 |

---

### 🎯 Return Analysis

| Metric | Unlevered | Levered (65% LTV) |
|--------|-----------|-------------------|
| Total Equity | $45,000,000 | $15,750,000 |
| 5-Year IRR | 12.4% | **19.8%** |
| Equity Multiple | 1.69x | **2.31x** |
| Cash-on-Cash (Avg) | 6.8% | **11.2%** |
| NPV (@10% discount) | $8,420,000 | $6,890,000 |

---

### ⚠️ Risk Assessment

| Risk Factor | Probability | Impact | Mitigation |
|-------------|-------------|--------|------------|
| Renovation Cost Overrun | 35% | Medium | 15% contingency |
| Lease-Up Delay | 25% | Medium | Phased renovation |
| Rate Environment | 40% | High | Fixed-rate debt |
| Market Softening | 20% | High | Conservative underwriting |

### **AI Deal Score: 82/100 — RECOMMENDED**
### **Risk-Adjusted Return: 17.2% IRR**`;
    }

    return `## Analysis Complete

I've analyzed your request and generated comprehensive insights based on available data.

### Key Findings

Based on my analysis using multiple data sources and AI models, here are the primary observations:

1. **Market Position:** The subject property/portfolio shows favorable positioning relative to market benchmarks
2. **Value Drivers:** Key factors influencing value include location, condition, and income potential
3. **Risk Factors:** Moderate risk profile with identifiable mitigation strategies
4. **Opportunities:** Several value-enhancement opportunities have been identified

### Data Sources Analyzed
- Market transaction data (12,450 records)
- Comparable property assessments (2,340 records)
- Economic indicators (156 metrics)
- Demographic trends (48 variables)

### Confidence Metrics
- Overall Analysis Confidence: 89%
- Data Quality Score: 94%
- Model Agreement: 91%

Would you like me to dive deeper into any specific aspect of this analysis?`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <SparklesIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Axxiom AI</h1>
              <p className="text-white/80">The Most Advanced CRE Intelligence Platform</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {aiModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-2xl transition-all ${
                  selectedModel === model.id
                    ? 'bg-white text-primary shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{model.icon}</span>
                  <Badge
                    variant={model.status === 'online' ? 'success' : 'warning'}
                    size="sm"
                    className={selectedModel === model.id ? '' : 'bg-white/20 text-white border-0'}
                  >
                    {model.status}
                  </Badge>
                </div>
                <p className={`font-semibold ${selectedModel === model.id ? '' : 'text-white'}`}>
                  {model.name}
                </p>
                <p className={`text-xs ${selectedModel === model.id ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {model.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card variant="elevated" padding="none" className="overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-surface-container to-surface">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold">AI Assistant</h2>
                    <p className="text-xs text-muted-foreground">
                      {aiModels.find(m => m.id === selectedModel)?.name} • Ready
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
                    <RefreshIcon className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages or Welcome */}
            <div className="h-[500px] overflow-y-auto p-4">
              {!showChat || messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                    <SparklesIcon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Ask me anything about property valuations, tax appeals, market analysis,
                    investment opportunities, or document processing.
                  </p>

                  {/* Quick Prompts Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt.prompt)}
                        className={`p-4 rounded-2xl text-left transition-all hover:scale-105 bg-gradient-to-br ${prompt.gradient} text-white shadow-lg`}
                      >
                        <span className="text-2xl block mb-2">{prompt.icon}</span>
                        <p className="font-medium text-sm">{prompt.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar
                        src={message.role === 'assistant' ? undefined : 'https://i.pravatar.cc/150?u=user'}
                        fallback={message.role === 'assistant' ? 'AI' : 'U'}
                        className={message.role === 'assistant' ? 'bg-gradient-to-br from-primary to-secondary text-white' : ''}
                      />
                      <div
                        className={`max-w-[85%] rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground p-4'
                            : 'bg-surface-container p-4'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                            <div dangerouslySetInnerHTML={{
                              __html: message.content
                                .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-4 mb-2">$1</h2>')
                                .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
                                .replace(/^#### (.*$)/gm, '<h4 class="text-sm font-medium mt-2 mb-1">$1</h4>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\|(.*)\|/g, (match) => {
                                  const cells = match.split('|').filter(c => c.trim());
                                  return `<tr>${cells.map(c => `<td class="border border-border px-2 py-1 text-xs">${c.trim()}</td>`).join('')}</tr>`;
                                })
                                .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-2 rounded text-xs overflow-x-auto">$1</pre>')
                                .replace(/\n/g, '<br/>')
                            }} />
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}

                        {message.metadata && (
                          <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>🧠 {message.metadata.model}</span>
                            <span>⚡ {message.metadata.responseTime}ms</span>
                            <span>🎯 {message.metadata.confidence}% confidence</span>
                          </div>
                        )}

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">📚 Sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((source, i) => (
                                <Badge key={i} variant="ghost" size="sm" className="text-xs">
                                  {source.type}: {source.title} ({source.confidence}%)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.suggestedActions && message.suggestedActions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestedActions.map((action, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                size="xs"
                                onClick={() => handleSend(action)}
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar fallback="AI" className="bg-gradient-to-br from-primary to-secondary text-white" />
                      <div className="bg-surface-container rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <Spinner size="sm" />
                          <span className="text-sm text-muted-foreground">
                            Analyzing with {aiModels.find(m => m.id === selectedModel)?.name}...
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <div className="h-1.5 w-20 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-surface-container/50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about valuations, appeals, market trends, investments..."
                    className="pr-24"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                      <AttachIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                      <MicIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="px-6"
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI-generated insights should be verified. Press Enter to send.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - AI Capabilities */}
        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader noBorder>
              <CardTitle className="text-base flex items-center gap-2">
                <RocketIcon className="h-5 w-5 text-primary" />
                AI Capabilities
              </CardTitle>
              <CardDescription>Specialized AI-powered tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiCapabilities.map((capability, i) => (
                <Link
                  key={i}
                  href={capability.href}
                  className="block p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{capability.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {capability.title}
                        </p>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {capability.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-1">
                          {capability.features.slice(0, 2).map((f, j) => (
                            <Badge key={j} variant="ghost" size="sm" className="text-[10px]">
                              {f}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{capability.metric}</p>
                          <p className="text-[10px] text-muted-foreground">{capability.metricLabel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card variant="elevated">
            <CardHeader noBorder>
              <CardTitle className="text-base">Platform Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <p className="text-2xl font-bold text-primary">2.8M</p>
                  <p className="text-xs text-muted-foreground">Properties Analyzed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5">
                  <p className="text-2xl font-bold text-secondary">99.2%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5">
                  <p className="text-2xl font-bold text-accent">1.2s</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5">
                  <p className="text-2xl font-bold text-success">$4.2B</p>
                  <p className="text-xs text-muted-foreground">Value Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Icons
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function AttachIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
