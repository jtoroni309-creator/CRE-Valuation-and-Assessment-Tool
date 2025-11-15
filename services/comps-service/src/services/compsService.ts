/**
 * Comparable properties service - Business logic
 */

import { logger } from '@axxiom/shared';
import { query } from '../database';

export interface SearchCompsParams {
  propertyType: string;
  latitude: number;
  longitude: number;
  radiusMiles: number;
  minSqft?: number;
  maxSqft?: number;
  minSaleDate?: Date;
  maxSaleDate?: Date;
  limit: number;
}

export interface ComparableProperty {
  propertyId: string;
  address: string;
  propertyType: string;
  sqft: number;
  salePrice?: number;
  saleDate?: Date;
  distanceMiles: number;
  similarityScore: number;
}

/**
 * Search for comparable properties based on location and criteria
 */
export async function searchComparables(
  tenantId: string,
  params: SearchCompsParams
): Promise<ComparableProperty[]> {
  const whereClauses: string[] = ['p.property_type = $2'];
  const sqlParams: any[] = [tenantId, params.propertyType];
  let paramIndex = 3;

  // Distance filter using lat/long
  // Using Haversine formula for distance calculation
  const distanceFormula = `
    (6371 * acos(
      cos(radians($${paramIndex})) * cos(radians(p.latitude)) *
      cos(radians(p.longitude) - radians($${paramIndex + 1})) +
      sin(radians($${paramIndex})) * sin(radians(p.latitude))
    ) * 0.621371)
  `;

  sqlParams.push(params.latitude, params.longitude);
  whereClauses.push(`${distanceFormula} <= $${paramIndex + 2}`);
  sqlParams.push(params.radiusMiles);
  paramIndex += 3;

  // Size filters
  if (params.minSqft) {
    whereClauses.push(`b.gross_building_area >= $${paramIndex++}`);
    sqlParams.push(params.minSqft);
  }
  if (params.maxSqft) {
    whereClauses.push(`b.gross_building_area <= $${paramIndex++}`);
    sqlParams.push(params.maxSqft);
  }

  // Sale date filters
  if (params.minSaleDate) {
    whereClauses.push(`s.sale_date >= $${paramIndex++}`);
    sqlParams.push(params.minSaleDate);
  }
  if (params.maxSaleDate) {
    whereClauses.push(`s.sale_date <= $${paramIndex++}`);
    sqlParams.push(params.maxSaleDate);
  }

  // Only verified sales
  whereClauses.push('s.verified = true');

  const sql = `
    SELECT
      p.property_id,
      p.street_number || ' ' || p.street_name || ', ' || p.city || ', ' || p.state AS address,
      p.property_type,
      b.gross_building_area AS sqft,
      s.sale_price,
      s.sale_date,
      ${distanceFormula} AS distance_miles,
      0.85 AS similarity_score
    FROM properties p
    JOIN buildings b ON p.property_id = b.property_id
    LEFT JOIN sales s ON p.property_id = s.property_id
    WHERE p.tenant_id = $1 AND ${whereClauses.join(' AND ')}
    ORDER BY distance_miles ASC, s.sale_date DESC
    LIMIT $${paramIndex}
  `;

  sqlParams.push(params.limit);

  const result = await query<ComparableProperty>(sql, sqlParams, tenantId);

  logger.info(
    { tenantId, found: result.rows.length, params },
    'Comparables search completed'
  );

  return result.rows;
}

/**
 * Get AI-suggested comparables for a property
 */
export async function getSuggestedComps(
  tenantId: string,
  propertyId: string,
  limit: number
): Promise<ComparableProperty[]> {
  // Get subject property details
  const subjectResult = await query(
    `SELECT p.*, b.gross_building_area, p.latitude, p.longitude
     FROM properties p
     JOIN buildings b ON p.property_id = b.property_id
     WHERE p.property_id = $1 AND p.tenant_id = $2`,
    [propertyId, tenantId],
    tenantId
  );

  if (subjectResult.rows.length === 0) {
    return [];
  }

  const subject = subjectResult.rows[0];

  // Search for similar properties
  return searchComparables(tenantId, {
    propertyType: subject.property_type,
    latitude: subject.latitude,
    longitude: subject.longitude,
    radiusMiles: 5,
    minSqft: subject.gross_building_area * 0.7,
    maxSqft: subject.gross_building_area * 1.3,
    limit,
  });
}

/**
 * Calculate similarity score between two properties
 * Uses weighted factors: location, size, type, age, condition
 */
export async function calculateSimilarityScore(
  tenantId: string,
  subjectPropertyId: string,
  compPropertyId: string
): Promise<{ score: number; factors: Record<string, number> }> {
  const sql = `
    SELECT
      p1.property_id AS subject_id,
      p1.property_type AS subject_type,
      p1.latitude AS subject_lat,
      p1.longitude AS subject_lon,
      b1.gross_building_area AS subject_sqft,
      b1.year_built AS subject_year,
      b1.condition AS subject_condition,
      p2.property_id AS comp_id,
      p2.property_type AS comp_type,
      p2.latitude AS comp_lat,
      p2.longitude AS comp_lon,
      b2.gross_building_area AS comp_sqft,
      b2.year_built AS comp_year,
      b2.condition AS comp_condition
    FROM properties p1
    JOIN buildings b1 ON p1.property_id = b1.property_id
    CROSS JOIN properties p2
    JOIN buildings b2 ON p2.property_id = b2.property_id
    WHERE p1.property_id = $1
      AND p2.property_id = $2
      AND p1.tenant_id = $3
      AND p2.tenant_id = $3
  `;

  const result = await query(sql, [subjectPropertyId, compPropertyId, tenantId], tenantId);

  if (result.rows.length === 0) {
    throw new Error('Properties not found');
  }

  const data = result.rows[0];

  // Calculate individual factor scores
  const factors: Record<string, number> = {};

  // Type similarity (exact match = 1.0, different = 0.0)
  factors.type = data.subject_type === data.comp_type ? 1.0 : 0.0;

  // Location similarity (distance-based, max 5 miles)
  const distance = calculateDistance(
    data.subject_lat,
    data.subject_lon,
    data.comp_lat,
    data.comp_lon
  );
  factors.location = Math.max(0, 1 - distance / 5);

  // Size similarity (within 30% = good score)
  const sizeDiff = Math.abs(data.subject_sqft - data.comp_sqft) / data.subject_sqft;
  factors.size = Math.max(0, 1 - sizeDiff / 0.3);

  // Age similarity (within 10 years = good score)
  if (data.subject_year && data.comp_year) {
    const ageDiff = Math.abs(data.subject_year - data.comp_year);
    factors.age = Math.max(0, 1 - ageDiff / 10);
  } else {
    factors.age = 0.5; // neutral if missing
  }

  // Condition similarity
  const conditionMap: Record<string, number> = {
    excellent: 5,
    good: 4,
    average: 3,
    fair: 2,
    poor: 1,
  };
  const subjectCond = conditionMap[data.subject_condition] || 3;
  const compCond = conditionMap[data.comp_condition] || 3;
  factors.condition = 1 - Math.abs(subjectCond - compCond) / 4;

  // Weighted overall score
  const weights = {
    type: 0.25,
    location: 0.25,
    size: 0.20,
    age: 0.15,
    condition: 0.15,
  };

  const score =
    factors.type * weights.type +
    factors.location * weights.location +
    factors.size * weights.size +
    factors.age * weights.age +
    factors.condition * weights.condition;

  return { score: parseFloat(score.toFixed(3)), factors };
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
