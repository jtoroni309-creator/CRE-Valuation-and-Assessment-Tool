# Database Migrations

This directory contains SQL migration scripts for the Axxiom platform database.

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all tables, indexes, RLS, and triggers
- `002_seed_data.sql` - Seed data for development and testing
- `rollback_001.sql` - Rollback script for migration 001

## Running Migrations

### Using psql

```bash
# Connect to your database
psql -h localhost -U postgres -d axxiom_dev

# Run initial schema
\i data/migrations/001_initial_schema.sql

# Run seed data
\i data/migrations/002_seed_data.sql
```

### Using Environment Variables

```bash
# Set database connection
export DATABASE_URL="postgresql://user:password@localhost:5432/axxiom_dev"

# Run migrations
psql $DATABASE_URL -f data/migrations/001_initial_schema.sql
psql $DATABASE_URL -f data/migrations/002_seed_data.sql
```

### Rollback

```bash
psql $DATABASE_URL -f data/migrations/rollback_001.sql
```

## Schema Overview

### Multi-Tenancy & IAM
- `tenants` - Organizations using the platform
- `users` - Users with role-based access
- `roles` - Permission sets

### Property Domain
- `parcels` - Tax parcels with APN and geospatial data
- `owners` - Property owners
- `properties` - Real estate properties
- `buildings` - Building information
- `units` - Individual rental units

### Transaction Domain
- `sales` - Property sales transactions
- `listings` - Property listings
- `leases` - Lease agreements

### Valuation Domain
- `valuations` - Property valuations
- `comparables` - Comparable properties
- `adjustments` - Valuation adjustments
- `explanations` - AI/ML model explanations
- `reports` - Generated reports

### Assessment Domain
- `jurisdictions` - Government jurisdictions
- `assessment_runs` - Mass appraisal runs
- `roll_entries` - Assessment roll entries
- `ratio_studies` - IAAO ratio studies

### Appeals Domain
- `appeal_cases` - Tax appeal cases
- `evidence` - Supporting evidence
- `documents` - Filed documents

### Data Platform
- `data_sources` - External data sources
- `provenance` - Data lineage tracking
- `data_quality` - Data quality metrics

## Row-Level Security (RLS)

RLS is enabled on tenant-scoped tables to ensure data isolation:

```sql
-- Set tenant context before queries
SET app.current_tenant = '11111111-1111-1111-1111-111111111111';

-- Now queries are automatically scoped to that tenant
SELECT * FROM properties;
```

## Indexes

The schema includes comprehensive indexes for:
- Multi-tenant isolation
- Property lookups (APN, address, location)
- Geospatial queries (PostGIS GIST indexes)
- Transaction queries (date, price ranges)
- Valuation queries (status, dates)
- Assessment and appeals queries

## Sample Data

The seed data includes:
- 3 tenants (Demo, Property Pros, City of Springfield)
- 5 users with different roles
- 4 jurisdictions
- 3 properties with buildings
- 3 valuations in different statuses
- 1 assessment run
- 1 appeal case

## Best Practices

1. **Always use migrations** - Never modify the database schema directly
2. **Test rollbacks** - Ensure rollback scripts work before deploying
3. **Version control** - Keep all migrations in git
4. **Backup before migrating** - Always backup production before running migrations
5. **Use transactions** - Wrap migrations in BEGIN/COMMIT when possible
6. **Document changes** - Add comments to complex migrations

## Migration Naming Convention

```
<number>_<description>.sql

Examples:
001_initial_schema.sql
002_seed_data.sql
003_add_property_images.sql
004_add_analytics_tables.sql
```

## Troubleshooting

### Error: Extension "uuid-ossp" does not exist

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Run as superuser or ensure the extension is available in your PostgreSQL installation.

### Error: Extension "postgis" does not exist

Install PostGIS:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-15-postgis-3

# macOS (Homebrew)
brew install postgis
```

### RLS Policies Not Working

Ensure you're setting the tenant context:

```sql
SET app.current_tenant = '<tenant-uuid>';
```

Or bypass RLS for admin operations:

```sql
SET ROLE postgres;  -- Or another superuser role
```
