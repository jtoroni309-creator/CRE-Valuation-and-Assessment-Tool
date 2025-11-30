'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Spinner } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { type: string; title: string }[];
  suggestedActions?: string[];
}

const suggestedPrompts = [
  {
    title: 'Valuation Analysis',
    prompt: 'Analyze the market value of a 50,000 SF office building in downtown Chicago',
    icon: '📊',
  },
  {
    title: 'Appeal Strategy',
    prompt: 'Help me build a tax appeal case for an over-assessed retail property',
    icon: '⚖️',
  },
  {
    title: 'Market Research',
    prompt: 'What are the current cap rate trends for industrial properties in Texas?',
    icon: '📈',
  },
  {
    title: 'Compare Properties',
    prompt: 'Find comparable sales for a 200-unit multifamily property in Atlanta',
    icon: '🔍',
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm Axxiom AI, your intelligent CRE valuation assistant powered by Google Gemini.

I can help you with:
- **Property Valuations** - Analyze market value using multiple approaches
- **Tax Appeals** - Build compelling appeal arguments with evidence
- **Market Analysis** - Get insights on trends, cap rates, and forecasts
- **Document Processing** - Extract data from appraisals, rent rolls, and leases
- **Comparable Analysis** - Find and adjust comparable sales

How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(messageText),
        timestamp: new Date(),
        sources: [
          { type: 'Market Data', title: 'Q4 2024 Market Report' },
          { type: 'Comparable', title: 'Recent Sales Analysis' },
        ],
        suggestedActions: [
          'Generate detailed report',
          'Find more comparables',
          'Run sensitivity analysis',
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    if (prompt.toLowerCase().includes('valuation') || prompt.toLowerCase().includes('value')) {
      return `Based on my analysis, I've evaluated the property using multiple valuation approaches:

**Income Approach**
- Estimated NOI: $850,000
- Market Cap Rate: 6.75%
- Indicated Value: **$12,593,000**

**Sales Comparison Approach**
- Analyzed 5 comparable sales within 1 mile
- Average $/SF: $285
- Indicated Value: **$14,250,000**

**Reconciled Value: $13,400,000** (±5%)

The confidence level is **89%** based on the quality of available market data and comparable transactions.

Would you like me to:
1. Generate a detailed narrative for the appraisal report?
2. Show the comparable sales analysis?
3. Run a sensitivity analysis on key assumptions?`;
    }

    if (prompt.toLowerCase().includes('appeal') || prompt.toLowerCase().includes('tax')) {
      return `I've analyzed your property for potential tax appeal opportunities:

**Assessment Overview**
- Current Assessed Value: $5,200,000
- Estimated Market Value: $4,150,000
- Potential Overassessment: **20.2%**

**Recommended Grounds for Appeal:**
1. **Unequal Assessment** - Subject is assessed 15% higher than comparable properties
2. **Incorrect Data** - Building SF should be 42,500, not 48,000
3. **Market Decline** - Recent sales indicate 12% value reduction

**Supporting Evidence Needed:**
- Independent appraisal (highest impact)
- 3-5 comparable property assessments
- Property condition documentation

**Estimated Appeal Success Rate: 78%**

Shall I draft the formal appeal argument or help gather evidence?`;
    }

    if (prompt.toLowerCase().includes('market') || prompt.toLowerCase().includes('cap rate')) {
      return `Here's my analysis of current market conditions:

**Industrial Market - Texas (Q4 2024)**

📊 **Cap Rate Trends**
- Current: 5.8% (down 25 bps YoY)
- 5-Year Average: 6.4%
- Forecast: Expected to stabilize at 5.5-6.0%

📈 **Key Metrics**
- Vacancy: 4.2% (historic low)
- Absorption: 12.5M SF YTD
- Rent Growth: +8.3% YoY
- Under Construction: 28M SF

🔮 **12-Month Outlook**
- Strong demand from e-commerce and logistics
- Limited new supply coming online
- Rent growth expected to moderate to 4-5%
- Cap rate compression likely to slow

**Top Performing Submarkets:**
1. Dallas-Fort Worth (5.5% cap)
2. Houston (5.9% cap)
3. Austin (5.7% cap)

Would you like a detailed breakdown of any specific submarket?`;
    }

    return `I've analyzed your request and here's what I found:

Based on the available data and my analysis, I can provide insights on this topic. The commercial real estate market continues to show dynamic trends that affect property valuations and investment decisions.

**Key Observations:**
- Market conditions remain favorable for well-positioned assets
- Location and property quality continue to drive value premiums
- Interest rate environment is a key factor in current valuations

Would you like me to dive deeper into any specific aspect of this analysis?`;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card variant="elevated" padding="none" className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Axxiom AI</h2>
                <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">Online</Badge>
              <Button variant="ghost" size="icon-sm">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-container'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line.startsWith('**') ? (
                          <strong>{line.replace(/\*\*/g, '')}</strong>
                        ) : line.startsWith('- ') ? (
                          <span className="block pl-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, i) => (
                          <Badge key={i} variant="ghost" size="sm">
                            {source.type}: {source.title}
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
                <div className="bg-surface-container rounded-2xl p-4 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about valuations, appeals, market trends..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Axxiom AI can make mistakes. Verify important information.
            </p>
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-4 hidden lg:block">
        {/* Suggested Prompts */}
        <Card variant="elevated">
          <CardHeader noBorder>
            <CardTitle className="text-base">Quick Start</CardTitle>
            <CardDescription>Try these prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.prompt)}
                  className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{prompt.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {prompt.prompt}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card variant="elevated">
          <CardHeader noBorder>
            <CardTitle className="text-base">AI Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <CapabilityItem
                icon={<ValuationIcon className="h-4 w-4" />}
                title="Valuations"
                description="Multi-approach analysis"
              />
              <CapabilityItem
                icon={<AppealIcon className="h-4 w-4" />}
                title="Appeals"
                description="Build strong cases"
              />
              <CapabilityItem
                icon={<MarketIcon className="h-4 w-4" />}
                title="Market Intel"
                description="Real-time insights"
              />
              <CapabilityItem
                icon={<DocumentIcon className="h-4 w-4" />}
                title="Document AI"
                description="Extract & analyze"
              />
              <CapabilityItem
                icon={<VisionIcon className="h-4 w-4" />}
                title="Vision AI"
                description="Property analysis"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CapabilityItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function ValuationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function AppealIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

function MarketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
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

function VisionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}
