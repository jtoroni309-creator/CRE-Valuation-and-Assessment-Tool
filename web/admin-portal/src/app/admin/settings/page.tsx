'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { success } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Settings Saved', 'Your changes have been saved successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Organization Profile</CardTitle>
              <CardDescription>Basic organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Organization Name" defaultValue="Apex Commercial Realty" />
                <Input label="Domain" defaultValue="apexcommercial.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Contact Email" type="email" defaultValue="admin@apexcommercial.com" />
                <Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <Input label="Address" defaultValue="123 Business Center Dr, Suite 500, New York, NY 10001" />
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Regional Settings</CardTitle>
              <CardDescription>Localization and formatting preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Timezone"
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  ]}
                  defaultValue="America/New_York"
                />
                <Select
                  label="Currency"
                  options={[
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' },
                    { value: 'GBP', label: 'British Pound (£)' },
                  ]}
                  defaultValue="USD"
                />
                <Select
                  label="Date Format"
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                  ]}
                  defaultValue="MM/DD/YYYY"
                />
              </div>
              <Select
                label="Measurement Units"
                options={[
                  { value: 'imperial', label: 'Imperial (sq ft, acres)' },
                  { value: 'metric', label: 'Metric (sq m, hectares)' },
                ]}
                defaultValue="imperial"
              />
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Default Values</CardTitle>
              <CardDescription>Default settings for new valuations and assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Default Valuation Approach"
                  options={[
                    { value: 'income', label: 'Income Approach' },
                    { value: 'sales', label: 'Sales Comparison' },
                    { value: 'cost', label: 'Cost Approach' },
                    { value: 'hybrid', label: 'Hybrid (AI Recommended)' },
                  ]}
                  defaultValue="hybrid"
                />
                <Select
                  label="Default Property Type"
                  options={[
                    { value: 'office', label: 'Office' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'industrial', label: 'Industrial' },
                    { value: 'multifamily', label: 'Multifamily' },
                  ]}
                  placeholder="Select type"
                />
              </div>
              <Input
                label="Default Cap Rate (%)"
                type="number"
                defaultValue="6.0"
                step="0.1"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Authentication</CardTitle>
              <CardDescription>Configure authentication methods and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Single Sign-On (SSO)</p>
                  <p className="text-sm text-muted-foreground">Enable SAML or OIDC authentication</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Enabled</Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Optional</Badge>
                  <Button variant="outline" size="sm">Enforce</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                </div>
                <Select
                  options={[
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                    { value: '480', label: '8 hours' },
                  ]}
                  defaultValue="60"
                  className="w-36"
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Password Policy</CardTitle>
              <CardDescription>Set password requirements for users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Minimum Length" type="number" defaultValue="12" min="8" />
                <Select
                  label="Password Expiry"
                  options={[
                    { value: '30', label: '30 days' },
                    { value: '60', label: '60 days' },
                    { value: '90', label: '90 days' },
                    { value: 'never', label: 'Never' },
                  ]}
                  defaultValue="90"
                />
              </div>
              <div className="space-y-2">
                {[
                  { id: 'uppercase', label: 'Require uppercase letters', checked: true },
                  { id: 'lowercase', label: 'Require lowercase letters', checked: true },
                  { id: 'numbers', label: 'Require numbers', checked: true },
                  { id: 'special', label: 'Require special characters', checked: true },
                ].map((req) => (
                  <label key={req.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={req.checked} className="rounded" />
                    <span className="text-sm">{req.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">IP Restrictions</CardTitle>
              <CardDescription>Limit access from specific IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-muted-foreground">Only allow access from approved IPs</p>
                </div>
                <Button variant="outline" size="sm">Manage IPs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Email Notifications</CardTitle>
              <CardDescription>Configure when to send email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'valuation_complete', label: 'Valuation completed', description: 'When a valuation is finished', checked: true },
                { id: 'appeal_filed', label: 'Appeal filed', description: 'When a new appeal is submitted', checked: true },
                { id: 'report_ready', label: 'Report ready', description: 'When a report is generated', checked: true },
                { id: 'user_invited', label: 'User invited', description: 'When a new user is invited', checked: true },
                { id: 'weekly_digest', label: 'Weekly digest', description: 'Summary of weekly activity', checked: false },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked={notif.checked} className="rounded" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Webhook Notifications</CardTitle>
              <CardDescription>Send events to external systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Webhook URL" placeholder="https://your-system.com/webhook" />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Test Webhook</Button>
                <Button variant="ghost" size="sm">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Connected Services</CardTitle>
              <CardDescription>Third-party integrations and data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Google Maps', status: 'connected', description: 'Property location and mapping' },
                { name: 'CoStar', status: 'connected', description: 'Market data and comparables' },
                { name: 'Zillow', status: 'disconnected', description: 'Residential property data' },
                { name: 'Salesforce', status: 'connected', description: 'CRM integration' },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <IntegrationIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.status === 'connected' ? 'success' : 'ghost'}>
                      {integration.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">AI Model Settings</CardTitle>
              <CardDescription>Configure Gemini AI behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Default Model"
                options={[
                  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Recommended)' },
                  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Faster)' },
                  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision (Images)' },
                ]}
                defaultValue="gemini-1.5-pro"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Temperature"
                  type="number"
                  defaultValue="0.7"
                  min="0"
                  max="2"
                  step="0.1"
                  helperText="Lower = more focused, Higher = more creative"
                />
                <Input
                  label="Max Output Tokens"
                  type="number"
                  defaultValue="2048"
                  min="256"
                  max="8192"
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">AI Features</CardTitle>
              <CardDescription>Enable or disable AI capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'auto_narrative', label: 'Automatic Narrative Generation', description: 'Generate valuation narratives automatically', checked: true },
                { id: 'image_analysis', label: 'Property Image Analysis', description: 'Analyze property photos with Vision AI', checked: true },
                { id: 'document_ai', label: 'Document Processing', description: 'Extract data from uploaded documents', checked: true },
                { id: 'market_prediction', label: 'Market Predictions', description: 'AI-powered market trend analysis', checked: true },
                { id: 'comp_suggestions', label: 'Comparable Suggestions', description: 'AI-recommended comparable properties', checked: true },
              ].map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked={feature.checked} className="rounded" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle size="sm">Usage Limits</CardTitle>
              <CardDescription>Set AI usage limits and quotas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Monthly Token Limit"
                  type="number"
                  defaultValue="1000000"
                  helperText="Tokens per month across all users"
                />
                <Input
                  label="Per-Request Limit"
                  type="number"
                  defaultValue="8192"
                  helperText="Maximum tokens per AI request"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IntegrationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
