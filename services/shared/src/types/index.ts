/**
 * Shared TypeScript types for Axxiom platform
 */

// ============================================================================
// Common Types
// ============================================================================

export type UUID = string;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// Multi-Tenancy
// ============================================================================

export interface Tenant {
  tenantId: UUID;
  name: string;
  subdomain: string;
  planId: UUID;
  settings: TenantSettings;
  status: TenantStatus;
  onboardedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  jurisdictions: UUID[];
  featuresEnabled: string[];
  branding: BrandingConfig;
}

export interface BrandingConfig {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
}

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'churned';

export interface User {
  userId: UUID;
  tenantId: UUID;
  email: string;
  name: string;
  roleId: UUID;
  status: UserStatus;
  mfaEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'active' | 'inactive' | 'invited';

export interface Role {
  roleId: UUID;
  tenantId: UUID;
  name: string;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: Date;
}

export type Permission =
  | 'properties.read'
  | 'properties.write'
  | 'properties.delete'
  | 'valuations.create'
  | 'valuations.read'
  | 'valuations.update'
  | 'valuations.delete'
  | 'valuations.approve'
  | 'assessments.create'
  | 'assessments.read'
  | 'assessments.run'
  | 'appeals.create'
  | 'appeals.read'
  | 'appeals.update'
  | 'appeals.file'
  | 'admin.users'
  | 'admin.roles'
  | 'admin.tenants'
  | 'admin.billing'
  | 'admin.settings';

// ============================================================================
// Property Domain
// ============================================================================

export interface Address {
  streetNumber: string;
  streetName: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  latitude: number;
  longitude: number;
  h3Index: string;
}

export type PropertyType =
  | 'office'
  | 'retail'
  | 'industrial'
  | 'multifamily'
  | 'hotel'
  | 'mixed_use'
  | 'land'
  | 'special_purpose';

export type PropertyClass = 'A' | 'B' | 'C' | 'D';

export interface Property {
  propertyId: UUID;
  tenantId: UUID;
  parcelId: UUID;
  address: Address;
  propertyType: PropertyType;
  propertyClass: PropertyClass;
  ownerId: UUID;
  assessmentId?: UUID;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Valuation Domain
// ============================================================================

export type ValuationApproach = 'sales_comparison' | 'income' | 'cost' | 'reconciled';

export type ValuationStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Valuation {
  valuationId: UUID;
  tenantId: UUID;
  propertyId: UUID;
  valuationDate: Date;
  approach: ValuationApproach;
  valueAmount: number;
  valueRangeLow: number;
  valueRangeHigh: number;
  confidenceScore: number;
  modelVersion: string;
  status: ValuationStatus;
  createdBy: UUID;
  approvedBy?: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comparable {
  compId: UUID;
  valuationId: UUID;
  compPropertyId: UUID;
  distanceMiles: number;
  similarityScore: number;
  salePrice: number;
  saleDate: Date;
  adjustments: Adjustment[];
  adjustedPrice: number;
  weight: number;
  createdAt: Date;
}

export type AdjustmentCategory =
  | 'location'
  | 'size'
  | 'age'
  | 'condition'
  | 'amenities'
  | 'market_conditions'
  | 'financing'
  | 'time';

export interface Adjustment {
  adjustmentId: UUID;
  compId: UUID;
  category: AdjustmentCategory;
  amount: number;
  percentage: number;
  rationale: string;
  createdAt: Date;
}

// ============================================================================
// Assessment Domain
// ============================================================================

export type AssessmentRunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AssessmentRun {
  runId: UUID;
  tenantId: UUID;
  jurisdictionId: UUID;
  taxYear: number;
  status: AssessmentRunStatus;
  startDate: Date;
  endDate?: Date;
  totalParcels: number;
  completedParcels: number;
  failedParcels: number;
  createdBy: UUID;
  createdAt: Date;
}

// ============================================================================
// Appeals Domain
// ============================================================================

export type AppealStatus =
  | 'draft'
  | 'filed'
  | 'under_review'
  | 'scheduled'
  | 'decided'
  | 'withdrawn';

export type AppealGrounds =
  | 'overvaluation'
  | 'unequal_appraisal'
  | 'incorrect_property_info'
  | 'market_decline'
  | 'exemption_denial';

export interface AppealCase {
  caseId: UUID;
  tenantId: UUID;
  propertyId: UUID;
  jurisdictionId: UUID;
  taxYear: number;
  currentAssessedValue: number;
  proposedValue: number;
  grounds: AppealGrounds[];
  status: AppealStatus;
  filingDeadline: Date;
  hearingDate?: Date;
  outcome?: AppealOutcome;
  createdBy: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppealOutcome {
  decision: 'granted' | 'partial' | 'denied';
  finalValue: number;
  savings: number;
  decidedDate: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: Pagination;
  metadata?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  traceId: string;
}

// ============================================================================
// Request Context
// ============================================================================

export interface RequestContext {
  tenantId: UUID;
  userId: UUID;
  permissions: Permission[];
  traceId: string;
  timestamp: Date;
}

// ============================================================================
// Events
// ============================================================================

export interface DomainEvent<T = any> {
  eventId: UUID;
  eventType: string;
  aggregateId: UUID;
  aggregateType: string;
  tenantId: UUID;
  payload: T;
  metadata: EventMetadata;
  timestamp: Date;
}

export interface EventMetadata {
  userId?: UUID;
  correlationId: string;
  causationId?: string;
  version: number;
}
