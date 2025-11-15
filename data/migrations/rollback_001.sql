-- ============================================================================
-- Rollback Script for Migration 001
-- ============================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS data_quality CASCADE;
DROP TABLE IF EXISTS provenance CASCADE;
DROP TABLE IF EXISTS data_sources CASCADE;

DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS appeal_cases CASCADE;

DROP TABLE IF EXISTS ratio_studies CASCADE;
DROP TABLE IF EXISTS roll_entries CASCADE;
DROP TABLE IF EXISTS assessment_runs CASCADE;
DROP TABLE IF EXISTS jurisdictions CASCADE;

DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS explanations CASCADE;
DROP TABLE IF EXISTS adjustments CASCADE;
DROP TABLE IF EXISTS comparables CASCADE;
DROP TABLE IF EXISTS valuations CASCADE;

DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS sales CASCADE;

DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS parcels CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop extensions (optional - may be used by other schemas)
-- DROP EXTENSION IF EXISTS postgis;
-- DROP EXTENSION IF EXISTS "uuid-ossp";
