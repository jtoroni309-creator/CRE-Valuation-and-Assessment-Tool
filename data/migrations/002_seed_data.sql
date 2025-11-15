-- ============================================================================
-- Axxiom Database - Seed Data for Development
-- Version: 002
-- Description: Inserts sample data for local development and testing
-- ============================================================================

-- ============================================================================
-- Tenants
-- ============================================================================

INSERT INTO tenants (tenant_id, name, subdomain, settings, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Axxiom Demo', 'demo', '{"timezone": "America/New_York", "currency": "USD"}', 'active'),
('22222222-2222-2222-2222-222222222222', 'Property Pros LLC', 'propros', '{"timezone": "America/Chicago", "currency": "USD"}', 'active'),
('33333333-3333-3333-3333-333333333333', 'City of Springfield', 'springfield', '{"timezone": "America/Los_Angeles", "currency": "USD"}', 'active');

-- ============================================================================
-- Roles
-- ============================================================================

INSERT INTO roles (role_id, tenant_id, name, permissions, is_system_role) VALUES
-- Demo tenant roles
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Admin',
 ARRAY['properties.read', 'properties.write', 'valuations.create', 'valuations.approve', 'admin.users', 'admin.billing'], true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Appraiser',
 ARRAY['properties.read', 'properties.write', 'valuations.create', 'valuations.read'], false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Viewer',
 ARRAY['properties.read', 'valuations.read'], false),

-- Property Pros roles
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Admin',
 ARRAY['properties.read', 'properties.write', 'valuations.create', 'valuations.approve', 'appeals.create', 'admin.users'], true),

-- City of Springfield roles
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Assessor',
 ARRAY['properties.read', 'assessments.create', 'assessments.run'], false);

-- ============================================================================
-- Users
-- ============================================================================

INSERT INTO users (user_id, tenant_id, email, name, role_id, status) VALUES
-- Demo tenant users
('00000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'admin@demo.axxiom.ai', 'Demo Admin', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'active'),
('00000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'appraiser@demo.axxiom.ai', 'Jane Appraiser', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'active'),
('00000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'viewer@demo.axxiom.ai', 'Bob Viewer', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'active'),

-- Property Pros users
('00000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'admin@propros.com', 'Sarah Admin', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'active'),

-- City of Springfield users
('00000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'assessor@springfield.gov', 'John Assessor', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'active');

-- ============================================================================
-- Jurisdictions
-- ============================================================================

INSERT INTO jurisdictions (jurisdiction_id, name, state, county, tax_rate) VALUES
('jjjjjjj1-jjjj-jjjj-jjjj-jjjjjjjjjjj1', 'Cook County', 'IL', 'Cook', 0.0207),
('jjjjjjj2-jjjj-jjjj-jjjj-jjjjjjjjjjj2', 'Los Angeles County', 'CA', 'Los Angeles', 0.0120),
('jjjjjjj3-jjjj-jjjj-jjjj-jjjjjjjjjjj3', 'Harris County', 'TX', 'Harris', 0.0215),
('jjjjjjj4-jjjj-jjjj-jjjj-jjjjjjjjjjj4', 'Maricopa County', 'AZ', 'Maricopa', 0.0085);

-- ============================================================================
-- Sample Parcels
-- ============================================================================

INSERT INTO parcels (parcel_id, tenant_id, apn, lot_size_sqft, zoning, jurisdiction_id) VALUES
('ppppppp1-pppp-pppp-pppp-pppppppppppp', '11111111-1111-1111-1111-111111111111', '123-456-789-00', 43560.0, 'C-2', 'jjjjjjj1-jjjj-jjjj-jjjj-jjjjjjjjjjj1'),
('ppppppp2-pppp-pppp-pppp-pppppppppppp', '11111111-1111-1111-1111-111111111111', '987-654-321-00', 87120.0, 'M-1', 'jjjjjjj2-jjjj-jjjj-jjjj-jjjjjjjjjjj2'),
('ppppppp3-pppp-pppp-pppp-pppppppppppp', '22222222-2222-2222-2222-222222222222', '555-123-456-00', 52272.0, 'R-4', 'jjjjjjj3-jjjj-jjjj-jjjj-jjjjjjjjjjj3');

-- ============================================================================
-- Sample Owners
-- ============================================================================

INSERT INTO owners (owner_id, tenant_id, name, owner_type) VALUES
('ooooooo1-oooo-oooo-oooo-oooooooooooo', '11111111-1111-1111-1111-111111111111', 'ABC Properties LLC', 'llc'),
('ooooooo2-oooo-oooo-oooo-oooooooooooo', '11111111-1111-1111-1111-111111111111', 'XYZ Investment Trust', 'trust'),
('ooooooo3-oooo-oooo-oooo-oooooooooooo', '22222222-2222-2222-2222-222222222222', 'Main Street Holdings', 'corporation');

-- ============================================================================
-- Sample Properties
-- ============================================================================

INSERT INTO properties (property_id, tenant_id, parcel_id, owner_id, street_number, street_name, city, state, zip, county, latitude, longitude, property_type, property_class) VALUES
('prop0001-prop-prop-prop-prop00000001', '11111111-1111-1111-1111-111111111111', 'ppppppp1-pppp-pppp-pppp-pppppppppppp', 'ooooooo1-oooo-oooo-oooo-oooooooooooo',
 '123', 'Main Street', 'Chicago', 'IL', '60601', 'Cook', 41.8781, -87.6298, 'office', 'A'),
('prop0002-prop-prop-prop-prop00000002', '11111111-1111-1111-1111-111111111111', 'ppppppp2-pppp-pppp-pppp-pppppppppppp', 'ooooooo1-oooo-oooo-oooo-oooooooooooo',
 '456', 'Commerce Ave', 'Los Angeles', 'CA', '90012', 'Los Angeles', 34.0522, -118.2437, 'industrial', 'B'),
('prop0003-prop-prop-prop-prop00000003', '22222222-2222-2222-2222-222222222222', 'ppppppp3-pppp-pppp-pppp-pppppppppppp', 'ooooooo3-oooo-oooo-oooo-oooooooooooo',
 '789', 'Park Boulevard', 'Houston', 'TX', '77002', 'Harris', 29.7604, -95.3698, 'multifamily', 'A');

-- ============================================================================
-- Sample Buildings
-- ============================================================================

INSERT INTO buildings (building_id, property_id, name, year_built, gross_building_area, rentable_area, stories, condition, occupancy_rate) VALUES
('bldg0001-bldg-bldg-bldg-bldg00000001', 'prop0001-prop-prop-prop-prop00000001', 'Main Street Tower', 2015, 125000.0, 112500.0, 15, 'excellent', 0.95),
('bldg0002-bldg-bldg-bldg-bldg00000002', 'prop0002-prop-prop-prop-prop00000002', 'Commerce Warehouse', 2008, 200000.0, 190000.0, 2, 'good', 0.88),
('bldg0003-bldg-bldg-bldg-bldg00000003', 'prop0003-prop-prop-prop-prop00000003', 'Park Apartments', 2020, 85000.0, 75000.0, 8, 'excellent', 0.92);

-- ============================================================================
-- Sample Sales
-- ============================================================================

INSERT INTO sales (sale_id, property_id, sale_date, sale_price, price_per_sqft, verified) VALUES
('sale0001-sale-sale-sale-sale00000001', 'prop0001-prop-prop-prop-prop00000001', '2023-06-15', 28500000.00, 228.00, true),
('sale0002-sale-sale-sale-sale-sale0002', 'prop0002-prop-prop-prop-prop00000002', '2023-08-22', 15750000.00, 78.75, true);

-- ============================================================================
-- Sample Valuations
-- ============================================================================

INSERT INTO valuations (valuation_id, tenant_id, property_id, valuation_date, approach, value_amount, value_range_low, value_range_high, confidence_score, model_version, status, created_by) VALUES
('valu0001-valu-valu-valu-valu00000001', '11111111-1111-1111-1111-111111111111', 'prop0001-prop-prop-prop-prop00000001',
 '2024-01-15', 'sales_comparison', 29500000.00, 28000000.00, 31000000.00, 0.87, 'v1.2.0', 'approved', '00000002-0000-0000-0000-000000000002'),
('valu0002-valu-valu-valu-valu00000002', '11111111-1111-1111-1111-111111111111', 'prop0002-prop-prop-prop-prop00000002',
 '2024-01-20', 'income', 16200000.00, 15500000.00, 17000000.00, 0.82, 'v1.2.0', 'pending', '00000002-0000-0000-0000-000000000002'),
('valu0003-valu-valu-valu-valu00000003', '22222222-2222-2222-2222-222222222222', 'prop0003-prop-prop-prop-prop00000003',
 '2024-02-01', 'sales_comparison', 12500000.00, 12000000.00, 13000000.00, 0.90, 'v1.2.0', 'draft', '00000004-0000-0000-0000-000000000004');

-- ============================================================================
-- Sample Comparables
-- ============================================================================

INSERT INTO comparables (comp_id, valuation_id, comp_property_id, distance_miles, similarity_score, sale_price, sale_date, adjusted_price, weight) VALUES
('comp0001-comp-comp-comp-comp00000001', 'valu0001-valu-valu-valu-valu00000001', 'prop0002-prop-prop-prop-prop00000002',
 5.2, 0.85, 15750000.00, '2023-08-22', 28900000.00, 0.30);

-- ============================================================================
-- Sample Data Sources
-- ============================================================================

INSERT INTO data_sources (source_id, name, source_type, license_type, status) VALUES
('src00001-src0-src0-src0-src000000001', 'Cook County Assessor', 'api', 'public_domain', 'active'),
('src00002-src0-src0-src0-src000000002', 'CoStar Data Feed', 'api', 'licensed', 'active'),
('src00003-src0-src0-src0-src000000003', 'Zillow API', 'api', 'licensed', 'active'),
('src00004-src0-src0-src0-src000000004', 'Manual Entry', 'manual_entry', 'proprietary', 'active');

-- ============================================================================
-- Sample Assessment Run
-- ============================================================================

INSERT INTO assessment_runs (run_id, tenant_id, jurisdiction_id, tax_year, status, total_parcels, completed_parcels, created_by) VALUES
('arun0001-arun-arun-arun-arun00000001', '33333333-3333-3333-3333-333333333333', 'jjjjjjj3-jjjj-jjjj-jjjj-jjjjjjjjjjj3',
 2024, 'completed', 1, 1, '00000005-0000-0000-0000-000000000005');

-- ============================================================================
-- Sample Appeal Case
-- ============================================================================

INSERT INTO appeal_cases (case_id, tenant_id, property_id, jurisdiction_id, tax_year, current_assessed_value, proposed_value, grounds, status, filing_deadline, created_by) VALUES
('appl0001-appl-appl-appl-appl00000001', '22222222-2222-2222-2222-222222222222', 'prop0003-prop-prop-prop-prop00000003', 'jjjjjjj3-jjjj-jjjj-jjjj-jjjjjjjjjjj3',
 2024, 13000000.00, 12000000.00, ARRAY['overvaluation', 'market_decline'], 'draft', '2024-06-30', '00000004-0000-0000-0000-000000000004');

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Verify data was inserted
DO $$
BEGIN
    RAISE NOTICE 'Tenants: %', (SELECT COUNT(*) FROM tenants);
    RAISE NOTICE 'Users: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Properties: %', (SELECT COUNT(*) FROM properties);
    RAISE NOTICE 'Valuations: %', (SELECT COUNT(*) FROM valuations);
    RAISE NOTICE 'Jurisdictions: %', (SELECT COUNT(*) FROM jurisdictions);
END $$;
