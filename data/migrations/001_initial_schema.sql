-- ============================================================================
-- Axxiom Database Schema - Initial Migration
-- Version: 001
-- Description: Creates foundational tables for multi-tenancy, properties,
--              valuations, assessments, and appeals
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- Multi-Tenancy & IAM
-- ============================================================================

CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    plan_id UUID,
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'churned')),
    onboarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(role_id),
    status VARCHAR(50) NOT NULL DEFAULT 'invited' CHECK (status IN ('active', 'inactive', 'invited')),
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- ============================================================================
-- Property Domain
-- ============================================================================

CREATE TABLE parcels (
    parcel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    apn VARCHAR(100) NOT NULL,
    legal_description TEXT,
    lot_size_sqft DECIMAL(15, 2),
    zoning VARCHAR(50),
    jurisdiction_id UUID,
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, apn)
);

CREATE TABLE owners (
    owner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    owner_type VARCHAR(50) CHECK (owner_type IN ('individual', 'corporation', 'llc', 'trust', 'government', 'other')),
    contact_info JSONB,
    entity_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE properties (
    property_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES parcels(parcel_id) ON DELETE CASCADE,
    owner_id UUID REFERENCES owners(owner_id) ON DELETE SET NULL,
    street_number VARCHAR(50),
    street_name VARCHAR(255),
    unit VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    county VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    h3_index VARCHAR(20),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('office', 'retail', 'industrial', 'multifamily', 'hotel', 'mixed_use', 'land', 'special_purpose')),
    property_class VARCHAR(1) CHECK (property_class IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE buildings (
    building_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    name VARCHAR(255),
    year_built INTEGER,
    year_renovated INTEGER,
    gross_building_area DECIMAL(15, 2),
    rentable_area DECIMAL(15, 2),
    stories INTEGER,
    construction_type VARCHAR(100),
    condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'average', 'fair', 'poor')),
    occupancy_rate DECIMAL(5, 4),
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE units (
    unit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(building_id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    floor INTEGER,
    sqft DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    current_rent DECIMAL(10, 2),
    market_rent DECIMAL(10, 2),
    lease_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(building_id, unit_number)
);

-- ============================================================================
-- Transaction Domain
-- ============================================================================

CREATE TABLE sales (
    sale_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    sale_date DATE NOT NULL,
    sale_price DECIMAL(15, 2) NOT NULL,
    price_per_sqft DECIMAL(10, 2),
    buyer VARCHAR(255),
    seller VARCHAR(255),
    financing_type VARCHAR(100),
    conditions TEXT[],
    verified BOOLEAN NOT NULL DEFAULT false,
    source_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE listings (
    listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    list_date DATE NOT NULL,
    list_price DECIMAL(15, 2) NOT NULL,
    price_per_sqft DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'pending', 'sold', 'withdrawn')),
    days_on_market INTEGER,
    agent VARCHAR(255),
    source_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE leases (
    lease_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(unit_id) ON DELETE CASCADE,
    tenant_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    rent_escalation DECIMAL(5, 4),
    lease_type VARCHAR(50) CHECK (lease_type IN ('gross', 'net', 'modified_gross', 'triple_net')),
    terms TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Valuation Domain
-- ============================================================================

CREATE TABLE valuations (
    valuation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL,
    approach VARCHAR(50) NOT NULL CHECK (approach IN ('sales_comparison', 'income', 'cost', 'reconciled')),
    value_amount DECIMAL(15, 2),
    value_range_low DECIMAL(15, 2),
    value_range_high DECIMAL(15, 2),
    confidence_score DECIMAL(5, 4),
    model_version VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    created_by UUID NOT NULL REFERENCES users(user_id),
    approved_by UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE comparables (
    comp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_id UUID NOT NULL REFERENCES valuations(valuation_id) ON DELETE CASCADE,
    comp_property_id UUID NOT NULL REFERENCES properties(property_id),
    distance_miles DECIMAL(10, 2),
    similarity_score DECIMAL(5, 4),
    sale_price DECIMAL(15, 2) NOT NULL,
    sale_date DATE NOT NULL,
    adjusted_price DECIMAL(15, 2),
    weight DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE adjustments (
    adjustment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comp_id UUID NOT NULL REFERENCES comparables(comp_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('location', 'size', 'age', 'condition', 'amenities', 'market_conditions', 'financing', 'time')),
    amount DECIMAL(15, 2) NOT NULL,
    percentage DECIMAL(7, 4),
    rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE explanations (
    explanation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_id UUID NOT NULL REFERENCES valuations(valuation_id) ON DELETE CASCADE,
    explanation_type VARCHAR(50) NOT NULL CHECK (explanation_type IN ('shap', 'feature_importance', 'counterfactual', 'narrative')),
    feature_importance JSONB,
    narrative TEXT,
    comparable_rationale TEXT,
    adjustments_summary TEXT,
    model_name VARCHAR(100),
    model_version VARCHAR(50),
    training_date TIMESTAMP WITH TIME ZONE,
    accuracy_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_id UUID NOT NULL REFERENCES valuations(valuation_id) ON DELETE CASCADE,
    format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'docx')),
    template VARCHAR(50),
    file_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- Assessment Domain
-- ============================================================================

CREATE TABLE jurisdictions (
    jurisdiction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    county VARCHAR(100),
    rules JSONB DEFAULT '{}',
    exemptions JSONB DEFAULT '{}',
    tax_rate DECIMAL(7, 6),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(name, state, county)
);

CREATE TABLE assessment_runs (
    run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(jurisdiction_id),
    tax_year INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    total_parcels INTEGER DEFAULT 0,
    completed_parcels INTEGER DEFAULT 0,
    failed_parcels INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE roll_entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES assessment_runs(run_id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES parcels(parcel_id),
    assessed_value DECIMAL(15, 2),
    market_value DECIMAL(15, 2),
    ratio DECIMAL(7, 4),
    status VARCHAR(50) NOT NULL DEFAULT 'assessed' CHECK (status IN ('assessed', 'exception', 'appealed')),
    exceptions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE ratio_studies (
    study_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES assessment_runs(run_id) ON DELETE CASCADE,
    property_class VARCHAR(1) NOT NULL,
    sample_size INTEGER NOT NULL,
    median_ratio DECIMAL(7, 4),
    prd DECIMAL(7, 4),
    cod DECIMAL(7, 4),
    prb DECIMAL(7, 4),
    iaao_compliant BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Appeals Domain
-- ============================================================================

CREATE TABLE appeal_cases (
    case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(jurisdiction_id),
    tax_year INTEGER NOT NULL,
    current_assessed_value DECIMAL(15, 2) NOT NULL,
    proposed_value DECIMAL(15, 2) NOT NULL,
    grounds TEXT[] NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'filed', 'under_review', 'scheduled', 'decided', 'withdrawn')),
    filing_deadline DATE NOT NULL,
    hearing_date DATE,
    outcome_decision VARCHAR(20) CHECK (outcome_decision IN ('granted', 'partial', 'denied')),
    outcome_final_value DECIMAL(15, 2),
    outcome_savings DECIMAL(15, 2),
    outcome_decided_date DATE,
    created_by UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence (
    evidence_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES appeal_cases(case_id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN ('comparable_sales', 'income_analysis', 'property_condition', 'market_analysis', 'appraisal_errors', 'jurisdictional_data')),
    description TEXT,
    strength_score DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_type VARCHAR(100),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Data Platform Domain
-- ============================================================================

CREATE TABLE data_sources (
    source_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('api', 'scraper', 'file_upload', 'manual_entry')),
    url TEXT,
    license_type VARCHAR(50) CHECK (license_type IN ('public_domain', 'licensed', 'proprietary')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    last_sync TIMESTAMP WITH TIME ZONE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE provenance (
    provenance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL,
    record_type VARCHAR(100) NOT NULL,
    source_id UUID NOT NULL REFERENCES data_sources(source_id),
    ingested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    lineage TEXT[],
    content_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE data_quality (
    dq_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provenance_id UUID NOT NULL REFERENCES provenance(provenance_id) ON DELETE CASCADE,
    completeness_score DECIMAL(5, 4),
    accuracy_score DECIMAL(5, 4),
    freshness_score DECIMAL(5, 4),
    overall_score DECIMAL(5, 4),
    issues JSONB DEFAULT '[]',
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Multi-tenancy indexes
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_valuations_tenant ON valuations(tenant_id);
CREATE INDEX idx_appeal_cases_tenant ON appeal_cases(tenant_id);

-- Property lookups
CREATE INDEX idx_parcels_apn ON parcels(apn);
CREATE INDEX idx_properties_location ON properties(city, state, zip);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_h3 ON properties(h3_index);

-- Geospatial indexes
CREATE INDEX idx_parcels_geometry ON parcels USING GIST(geometry);
CREATE INDEX idx_properties_coords ON properties(latitude, longitude);

-- Transaction queries
CREATE INDEX idx_sales_property ON sales(property_id);
CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_price ON sales(sale_price);
CREATE INDEX idx_listings_property ON listings(property_id);
CREATE INDEX idx_listings_status ON listings(status);

-- Valuation queries
CREATE INDEX idx_valuations_property ON valuations(property_id);
CREATE INDEX idx_valuations_date ON valuations(valuation_date DESC);
CREATE INDEX idx_valuations_status ON valuations(status);
CREATE INDEX idx_valuations_created_by ON valuations(created_by);
CREATE INDEX idx_comparables_valuation ON comparables(valuation_id);

-- Assessment queries
CREATE INDEX idx_assessment_runs_jurisdiction ON assessment_runs(jurisdiction_id);
CREATE INDEX idx_assessment_runs_year ON assessment_runs(tax_year);
CREATE INDEX idx_roll_entries_run ON roll_entries(run_id);
CREATE INDEX idx_roll_entries_parcel ON roll_entries(parcel_id);

-- Appeals queries
CREATE INDEX idx_appeal_cases_property ON appeal_cases(property_id);
CREATE INDEX idx_appeal_cases_status ON appeal_cases(status);
CREATE INDEX idx_appeal_cases_deadline ON appeal_cases(filing_deadline);
CREATE INDEX idx_evidence_case ON evidence(case_id);

-- Data platform queries
CREATE INDEX idx_provenance_record ON provenance(record_id, record_type);
CREATE INDEX idx_provenance_source ON provenance(source_id);

-- ============================================================================
-- Row-Level Security (RLS) for Multi-Tenancy
-- ============================================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeal_cases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (tenant isolation)
CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

CREATE POLICY tenant_isolation_properties ON properties
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

CREATE POLICY tenant_isolation_valuations ON valuations
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

CREATE POLICY tenant_isolation_appeal_cases ON appeal_cases
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- ============================================================================
-- Triggers for updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON parcels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valuations_updated_at BEFORE UPDATE ON valuations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jurisdictions_updated_at BEFORE UPDATE ON jurisdictions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appeal_cases_updated_at BEFORE UPDATE ON appeal_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE tenants IS 'Multi-tenant organizations using the platform';
COMMENT ON TABLE users IS 'Users with role-based access control';
COMMENT ON TABLE properties IS 'Commercial real estate properties';
COMMENT ON TABLE valuations IS 'Property valuations with AI/ML model results';
COMMENT ON TABLE comparables IS 'Comparable properties used in valuations';
COMMENT ON TABLE assessment_runs IS 'Mass appraisal runs for government assessment';
COMMENT ON TABLE appeal_cases IS 'Property tax appeal cases';
COMMENT ON TABLE provenance IS 'Data lineage and source tracking';
