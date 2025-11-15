# Axxiom Data Model

## Overview

This document describes the core data model for the Axxiom platform, including entities, relationships, and data schemas.

## Entity Relationship Diagram (ERD)

### Core Entities

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Tenant     │◄───────►│    User      │◄───────►│     Role     │
│              │         │              │         │              │
│ • tenant_id  │         │ • user_id    │         │ • role_id    │
│ • name       │         │ • tenant_id  │         │ • name       │
│ • subdomain  │         │ • email      │         │ • permissions│
│ • plan_id    │         │ • name       │         │              │
│ • settings   │         │ • role_id    │         └──────────────┘
│ • status     │         │ • status     │
└──────┬───────┘         └──────────────┘
       │
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Property Domain                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐    1    ┌──────────────┐    1    ┌──────────────┐
│    Parcel    │◄────┬───┤   Property   │◄────────┤   Building   │
│              │     │   │              │         │              │
│ • parcel_id  │     │   │ • property_id│    ┌────┤ • building_id│
│ • apn        │     │   │ • parcel_id  │    │    │ • property_id│
│ • legal_desc │     │   │ • address    │    │    │ • name       │
│ • lot_size   │     │   │ • property_  │    │    │ • year_built │
│ • zoning     │     │   │   type       │    │    │ • sqft       │
│ • jurisdiction│    │   │ • class      │    │    │ • stories    │
└──────┬───────┘     │   │ • owner_id   │    │    │ • condition  │
       │             │   └──────┬───────┘    │    └──────────────┘
       │             │          │            │
       │             │          │      1     │    N
       │             │          └────────────┼──────►┌──────────────┐
       │             │                       │       │     Unit     │
       │             │                       │       │              │
       │       N     │                       │       │ • unit_id    │
       └─────────────┼───────────────────────┘       │ • building_id│
                     │                               │ • unit_num   │
                     │                               │ • sqft       │
                     │                               │ • bed/bath   │
                     │                               │ • rent       │
                     ▼                               └──────────────┘
              ┌──────────────┐
              │    Owner     │
              │              │
              │ • owner_id   │
              │ • name       │
              │ • type       │
              │ • contact    │
              │ • entity_id  │
              └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     Transaction Domain                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     Sale     │         │    Listing   │         │    Lease     │
│              │         │              │         │              │
│ • sale_id    │         │ • listing_id │         │ • lease_id   │
│ • property_id│         │ • property_id│         │ • unit_id    │
│ • sale_date  │         │ • list_date  │         │ • tenant_name│
│ • sale_price │         │ • list_price │         │ • start_date │
│ • buyer      │         │ • status     │         │ • end_date   │
│ • seller     │         │ • agent      │         │ • rent_amt   │
│ • conditions │         └──────────────┘         │ • terms      │
└──────────────┘                                  └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      Valuation Domain                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐    1    ┌──────────────┐    N    ┌──────────────┐
│  Valuation   │◄────────┤   Comp       │◄────────┤  Adjustment  │
│              │         │              │         │              │
│ • val_id     │         │ • comp_id    │         │ • adj_id     │
│ • property_id│         │ • val_id     │         │ • comp_id    │
│ • val_date   │         │ • comp_prop  │         │ • category   │
│ • approach   │         │ • distance   │         │ • amount     │
│ • value_amt  │         │ • similarity │         │ • percentage │
│ • confidence │         │ • sale_price │         │ • rationale  │
│ • model_ver  │    ┌────┤ • adjustments│         └──────────────┘
│ • created_by │    │    │ • adj_price  │
└──────┬───────┘    │    └──────────────┘
       │            │
       │      N     │
       └────────────┼───────►┌──────────────┐
                    │        │ Explanation  │
                    │        │              │
                    │        │ • expl_id    │
                    │        │ • val_id     │
                    │        │ • type       │
                    │        │ • content    │
                    │        │ • features   │
                    │        └──────────────┘
                    │
                    └────────►┌──────────────┐
                             │   Report     │
                             │              │
                             │ • report_id  │
                             │ • val_id     │
                             │ • format     │
                             │ • file_url   │
                             │ • created_at │
                             └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     Assessment Domain                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐    1    ┌──────────────┐    N    ┌──────────────┐
│ Assessment   │◄────────┤   Roll       │◄────────┤   Ratio      │
│   Run        │         │   Entry      │         │   Study      │
│              │         │              │         │              │
│ • run_id     │         │ • entry_id   │         │ • study_id   │
│ • juris_id   │         │ • run_id     │         │ • run_id     │
│ • tax_year   │         │ • parcel_id  │         │ • property_  │
│ • status     │         │ • assessed_  │         │   class      │
│ • start_date │         │   value      │         │ • prd        │
│ • end_date   │         │ • market_    │         │ • cod        │
│ • total_     │         │   value      │         │ • prb        │
│   parcels    │         │ • ratio      │         │ • sample_n   │
└──────────────┘         │ • status     │         │ • iaao_      │
                         │ • exceptions │         │   compliant  │
                         └──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐
│ Jurisdiction │         │    Rules     │
│              │         │    Engine    │
│ • juris_id   │         │              │
│ • name       │         │ • rule_id    │
│ • state      │         │ • juris_id   │
│ • county     │         │ • rule_type  │
│ • rules      │◄────────┤ • conditions │
│ • exemptions │         │ • actions    │
│ • tax_rate   │         │ • effective_ │
└──────────────┘         │   date       │
                         └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       Appeals Domain                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐    1    ┌──────────────┐    N    ┌──────────────┐
│ Appeal Case  │◄────────┤   Evidence   │◄────────┤   Document   │
│              │         │              │         │              │
│ • case_id    │         │ • evidence_id│         │ • doc_id     │
│ • property_id│         │ • case_id    │         │ • evidence_id│
│ • tenant_id  │         │ • type       │         │ • filename   │
│ • juris_id   │         │ • description│         │ • file_url   │
│ • tax_year   │         │ • strength   │         │ • doc_type   │
│ • current_   │         └──────────────┘         └──────────────┘
│   assessed   │
│ • proposed_  │    1    ┌──────────────┐
│   value      │◄────────┤   Argument   │
│ • grounds    │         │              │
│ • status     │         │ • arg_id     │
│ • deadline   │         │ • case_id    │
│ • outcome    │         │ • type       │
└──────┬───────┘         │ • content    │
       │                 │ • comps      │
       │                 │ • calcs      │
       │                 └──────────────┘
       │      N
       └─────────────────►┌──────────────┐
                         │   Activity   │
                         │              │
                         │ • activity_id│
                         │ • case_id    │
                         │ • type       │
                         │ • user_id    │
                         │ • timestamp  │
                         │ • details    │
                         └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      Data Platform Domain                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Data Source  │         │  Provenance  │         │ Data Quality │
│              │         │              │         │              │
│ • source_id  │◄────────┤ • prov_id    │◄────────┤ • dq_id      │
│ • name       │         │ • record_id  │         │ • prov_id    │
│ • type       │         │ • source_id  │         │ • complete   │
│ • url        │         │ • ingested_at│         │ • accurate   │
│ • license    │         │ • version    │         │ • fresh      │
│ • status     │         │ • lineage    │         │ • score      │
│ • last_sync  │         │ • hash       │         │ • checked_at │
└──────────────┘         └──────────────┘         └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        ML/AI Domain                               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐    1    ┌──────────────┐    1    ┌──────────────┐
│    Model     │◄────────┤   Training   │◄────────┤   Dataset    │
│              │         │     Run      │         │              │
│ • model_id   │         │              │         │ • dataset_id │
│ • name       │         │ • run_id     │         │ • name       │
│ • type       │         │ • model_id   │         │ • version    │
│ • version    │         │ • dataset_id │         │ • location   │
│ • framework  │         │ • start_time │         │ • size       │
│ • location   │         │ • end_time   │         │ • split      │
│ • status     │         │ • metrics    │         │ • features   │
│ • created_at │         │ • params     │         └──────────────┘
└──────┬───────┘         │ • artifacts  │
       │                 └──────────────┘
       │      N
       └─────────────────►┌──────────────┐
                         │ Performance  │
                         │   Metrics    │
                         │              │
                         │ • metric_id  │
                         │ • model_id   │
                         │ • date       │
                         │ • mape       │
                         │ • rmse       │
                         │ • drift      │
                         │ • latency    │
                         └──────────────┘

┌──────────────┐
│  Prediction  │
│              │
│ • pred_id    │
│ • model_id   │
│ • input_hash │
│ • output     │
│ • confidence │
│ • latency_ms │
│ • timestamp  │
└──────────────┘
```

## Core Entity Definitions

### 1. Multi-Tenancy

#### Tenant
```typescript
interface Tenant {
  tenant_id: UUID;
  name: string;
  subdomain: string;
  plan_id: UUID;
  settings: TenantSettings;
  status: 'active' | 'suspended' | 'trial' | 'churned';
  onboarded_at: Date;
  created_at: Date;
  updated_at: Date;
}

interface TenantSettings {
  timezone: string;
  currency: string;
  date_format: string;
  jurisdictions: UUID[];
  features_enabled: string[];
  branding: BrandingConfig;
}
```

#### User
```typescript
interface User {
  user_id: UUID;
  tenant_id: UUID;
  email: string;
  name: string;
  role_id: UUID;
  status: 'active' | 'inactive' | 'invited';
  mfa_enabled: boolean;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
}
```

#### Role
```typescript
interface Role {
  role_id: UUID;
  tenant_id: UUID;
  name: string;
  permissions: Permission[];
  is_system_role: boolean;
  created_at: Date;
}

type Permission =
  | 'properties.read'
  | 'properties.write'
  | 'valuations.create'
  | 'valuations.approve'
  | 'assessments.run'
  | 'appeals.create'
  | 'admin.users'
  | 'admin.billing';
```

### 2. Property Domain

#### Parcel
```typescript
interface Parcel {
  parcel_id: UUID;
  tenant_id: UUID;
  apn: string; // Assessor's Parcel Number
  legal_description: string;
  lot_size_sqft: number;
  zoning: string;
  jurisdiction_id: UUID;
  geometry: GeoJSON; // Polygon
  created_at: Date;
  updated_at: Date;
}
```

#### Property
```typescript
interface Property {
  property_id: UUID;
  tenant_id: UUID;
  parcel_id: UUID;
  address: Address;
  property_type: PropertyType;
  property_class: PropertyClass;
  owner_id: UUID;
  assessment_id?: UUID;
  created_at: Date;
  updated_at: Date;
}

type PropertyType =
  | 'office'
  | 'retail'
  | 'industrial'
  | 'multifamily'
  | 'hotel'
  | 'mixed_use'
  | 'land'
  | 'special_purpose';

type PropertyClass = 'A' | 'B' | 'C' | 'D';

interface Address {
  street_number: string;
  street_name: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  latitude: number;
  longitude: number;
  h3_index: string;
}
```

#### Building
```typescript
interface Building {
  building_id: UUID;
  property_id: UUID;
  name?: string;
  year_built: number;
  year_renovated?: number;
  gross_building_area: number;
  rentable_area: number;
  stories: number;
  construction_type: string;
  condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
  occupancy_rate: number;
  amenities: string[];
  created_at: Date;
  updated_at: Date;
}
```

#### Unit
```typescript
interface Unit {
  unit_id: UUID;
  building_id: UUID;
  unit_number: string;
  floor: number;
  sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  current_rent?: number;
  market_rent?: number;
  lease_id?: UUID;
  created_at: Date;
  updated_at: Date;
}
```

### 3. Transaction Domain

#### Sale
```typescript
interface Sale {
  sale_id: UUID;
  property_id: UUID;
  sale_date: Date;
  sale_price: number;
  price_per_sqft: number;
  buyer: string;
  seller: string;
  financing_type: string;
  conditions: string[];
  verified: boolean;
  source_id: UUID;
  created_at: Date;
}
```

#### Listing
```typescript
interface Listing {
  listing_id: UUID;
  property_id: UUID;
  list_date: Date;
  list_price: number;
  price_per_sqft: number;
  status: 'active' | 'pending' | 'sold' | 'withdrawn';
  days_on_market: number;
  agent: string;
  source_id: UUID;
  created_at: Date;
  updated_at: Date;
}
```

#### Lease
```typescript
interface Lease {
  lease_id: UUID;
  unit_id: UUID;
  tenant_name: string;
  start_date: Date;
  end_date: Date;
  rent_amount: number;
  rent_escalation: number;
  lease_type: 'gross' | 'net' | 'modified_gross' | 'triple_net';
  terms: string;
  status: 'active' | 'expired' | 'terminated';
  created_at: Date;
  updated_at: Date;
}
```

### 4. Valuation Domain

#### Valuation
```typescript
interface Valuation {
  valuation_id: UUID;
  tenant_id: UUID;
  property_id: UUID;
  valuation_date: Date;
  approach: ValuationApproach;
  value_amount: number;
  value_range_low: number;
  value_range_high: number;
  confidence_score: number;
  model_version: string;
  created_by: UUID;
  approved_by?: UUID;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

type ValuationApproach = 'sales_comparison' | 'income' | 'cost' | 'reconciled';
```

#### Comp (Comparable)
```typescript
interface Comp {
  comp_id: UUID;
  valuation_id: UUID;
  comp_property_id: UUID;
  distance_miles: number;
  similarity_score: number;
  sale_price: number;
  sale_date: Date;
  adjustments: Adjustment[];
  adjusted_price: number;
  weight: number;
  created_at: Date;
}
```

#### Adjustment
```typescript
interface Adjustment {
  adjustment_id: UUID;
  comp_id: UUID;
  category: AdjustmentCategory;
  amount: number;
  percentage: number;
  rationale: string;
  created_at: Date;
}

type AdjustmentCategory =
  | 'location'
  | 'size'
  | 'age'
  | 'condition'
  | 'amenities'
  | 'market_conditions'
  | 'financing'
  | 'time';
```

#### Explanation
```typescript
interface Explanation {
  explanation_id: UUID;
  valuation_id: UUID;
  type: 'shap' | 'feature_importance' | 'counterfactual' | 'narrative';
  content: ExplanationContent;
  created_at: Date;
}

interface ExplanationContent {
  features?: Record<string, number>; // SHAP values
  narrative?: string; // LLM-generated explanation
  visualizations?: string[]; // URLs to charts
}
```

### 5. Assessment Domain

#### AssessmentRun
```typescript
interface AssessmentRun {
  run_id: UUID;
  tenant_id: UUID;
  jurisdiction_id: UUID;
  tax_year: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_date: Date;
  end_date?: Date;
  total_parcels: number;
  completed_parcels: number;
  failed_parcels: number;
  created_by: UUID;
  created_at: Date;
}
```

#### RollEntry
```typescript
interface RollEntry {
  entry_id: UUID;
  run_id: UUID;
  parcel_id: UUID;
  assessed_value: number;
  market_value: number;
  ratio: number;
  status: 'assessed' | 'exception' | 'appealed';
  exceptions: string[];
  created_at: Date;
}
```

#### RatioStudy
```typescript
interface RatioStudy {
  study_id: UUID;
  run_id: UUID;
  property_class: PropertyClass;
  sample_size: number;
  median_ratio: number;
  prd: number; // Price-Related Differential
  cod: number; // Coefficient of Dispersion
  prb: number; // Price-Related Bias
  iaao_compliant: boolean;
  created_at: Date;
}
```

### 6. Appeals Domain

#### AppealCase
```typescript
interface AppealCase {
  case_id: UUID;
  tenant_id: UUID;
  property_id: UUID;
  jurisdiction_id: UUID;
  tax_year: number;
  current_assessed_value: number;
  proposed_value: number;
  grounds: AppealGrounds[];
  status: AppealStatus;
  filing_deadline: Date;
  hearing_date?: Date;
  outcome?: AppealOutcome;
  created_by: UUID;
  created_at: Date;
  updated_at: Date;
}

type AppealGrounds =
  | 'overvaluation'
  | 'unequal_appraisal'
  | 'incorrect_property_info'
  | 'market_decline'
  | 'exemption_denial';

type AppealStatus =
  | 'draft'
  | 'filed'
  | 'under_review'
  | 'scheduled'
  | 'decided'
  | 'withdrawn';

interface AppealOutcome {
  decision: 'granted' | 'partial' | 'denied';
  final_value: number;
  savings: number;
  decided_date: Date;
}
```

#### Evidence
```typescript
interface Evidence {
  evidence_id: UUID;
  case_id: UUID;
  type: EvidenceType;
  description: string;
  strength_score: number;
  documents: Document[];
  created_at: Date;
}

type EvidenceType =
  | 'comparable_sales'
  | 'income_analysis'
  | 'property_condition'
  | 'market_analysis'
  | 'appraisal_errors'
  | 'jurisdictional_data';
```

### 7. Data Platform Domain

#### DataSource
```typescript
interface DataSource {
  source_id: UUID;
  name: string;
  type: 'api' | 'scraper' | 'file_upload' | 'manual_entry';
  url?: string;
  license_type: 'public_domain' | 'licensed' | 'proprietary';
  status: 'active' | 'inactive' | 'error';
  last_sync: Date;
  config: SourceConfig;
  created_at: Date;
}
```

#### Provenance
```typescript
interface Provenance {
  provenance_id: UUID;
  record_id: UUID;
  record_type: string;
  source_id: UUID;
  ingested_at: Date;
  version: number;
  lineage: string[];
  content_hash: string;
  metadata: Record<string, any>;
}
```

#### DataQuality
```typescript
interface DataQuality {
  dq_id: UUID;
  provenance_id: UUID;
  completeness_score: number;
  accuracy_score: number;
  freshness_score: number;
  overall_score: number;
  issues: QualityIssue[];
  checked_at: Date;
}

interface QualityIssue {
  field: string;
  issue_type: 'missing' | 'invalid' | 'stale' | 'outlier';
  severity: 'low' | 'medium' | 'high';
  description: string;
}
```

### 8. ML/AI Domain

#### Model
```typescript
interface Model {
  model_id: UUID;
  name: string;
  type: ModelType;
  version: string;
  framework: 'lightgbm' | 'xgboost' | 'pytorch' | 'sklearn' | 'onnx';
  location: string; // Azure ML model URI
  status: 'training' | 'registered' | 'deployed' | 'archived';
  created_at: Date;
}

type ModelType =
  | 'valuation_hedonic'
  | 'valuation_spatial'
  | 'valuation_income'
  | 'assessment_mass'
  | 'comp_similarity';
```

#### TrainingRun
```typescript
interface TrainingRun {
  run_id: UUID;
  model_id: UUID;
  dataset_id: UUID;
  start_time: Date;
  end_time?: Date;
  status: 'running' | 'completed' | 'failed';
  metrics: TrainingMetrics;
  hyperparameters: Record<string, any>;
  artifacts: string[];
  created_at: Date;
}

interface TrainingMetrics {
  mape: number;
  rmse: number;
  r2_score: number;
  mae: number;
  training_samples: number;
  validation_samples: number;
}
```

#### Prediction
```typescript
interface Prediction {
  prediction_id: UUID;
  model_id: UUID;
  input_hash: string;
  output: PredictionOutput;
  confidence: number;
  latency_ms: number;
  timestamp: Date;
}

interface PredictionOutput {
  value: number;
  uncertainty: number;
  explanations?: Explanation[];
}
```

## Indexing Strategy

### High-Performance Indexes

```sql
-- Property lookups
CREATE INDEX idx_property_apn ON properties(apn);
CREATE INDEX idx_property_address ON properties(address);
CREATE INDEX idx_property_geohash ON properties(h3_index);

-- Transaction queries
CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_property ON sales(property_id);
CREATE INDEX idx_sales_price ON sales(sale_price);

-- Valuation queries
CREATE INDEX idx_valuation_property_date ON valuations(property_id, valuation_date DESC);
CREATE INDEX idx_valuation_status ON valuations(status);

-- Appeals tracking
CREATE INDEX idx_appeal_deadline ON appeal_cases(filing_deadline);
CREATE INDEX idx_appeal_status ON appeal_cases(status);

-- Multi-tenancy (RLS)
CREATE INDEX idx_tenant_isolation ON properties(tenant_id);
CREATE INDEX idx_user_tenant ON users(tenant_id);
```

## Data Retention Policy

| Entity | Retention Period | Archive Strategy |
|--------|------------------|------------------|
| Sales Transactions | 10 years | Cold storage after 2 years |
| Valuations | 7 years | Immutable after approval |
| Assessments | 10 years | Compliance requirement |
| Appeals | 10 years | Legal requirement |
| Audit Logs | 7 years | Compliance requirement |
| ML Training Data | 5 years | Versioned snapshots |
| User Activity | 1 year | Aggregated metrics only |

## Data Privacy & Security

### PII Classification

| Field | Classification | Protection |
|-------|----------------|------------|
| User email | PII | Encrypted, masked |
| Owner name | PII | Dynamic masking |
| SSN/TIN | Sensitive PII | Not stored |
| Property address | Public | No restriction |
| Transaction amount | Public | No restriction |

### Row-Level Security (RLS)

```sql
-- Tenant isolation policy
CREATE POLICY tenant_isolation ON properties
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- User access policy
CREATE POLICY user_access ON valuations
  USING (
    tenant_id = current_setting('app.current_tenant')::uuid
    AND (created_by = current_setting('app.current_user')::uuid
         OR has_permission('valuations.read'))
  );
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Owner**: Data Architecture Team
