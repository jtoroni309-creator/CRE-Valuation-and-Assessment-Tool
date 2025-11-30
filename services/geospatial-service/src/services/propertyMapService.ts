import { logger } from '@axxiom/shared';
import { db } from '../database';

interface PropertyFilter {
  propertyType?: string;
  minValue?: number;
  maxValue?: number;
  minSqft?: number;
  maxSqft?: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  limit?: number;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export async function getPropertiesWithLocation(tenantId: string, filters: PropertyFilter): Promise<any[]> {
  logger.info({ tenantId, filters }, 'Querying properties with location data');

  try {
    let query = `
      SELECT
        p.id,
        p.address,
        p.city,
        p.state,
        p.zip_code,
        p.latitude,
        p.longitude,
        p.property_type,
        p.square_feet,
        p.year_built,
        p.assessed_value,
        p.market_value,
        p.image_url,
        p.status,
        p.created_at
      FROM properties p
      WHERE p.tenant_id = $1
        AND p.latitude IS NOT NULL
        AND p.longitude IS NOT NULL
    `;

    const params: any[] = [tenantId];
    let paramIndex = 2;

    // Apply filters
    if (filters.propertyType) {
      query += ` AND p.property_type = $${paramIndex}`;
      params.push(filters.propertyType);
      paramIndex++;
    }

    if (filters.minValue) {
      query += ` AND p.market_value >= $${paramIndex}`;
      params.push(filters.minValue);
      paramIndex++;
    }

    if (filters.maxValue) {
      query += ` AND p.market_value <= $${paramIndex}`;
      params.push(filters.maxValue);
      paramIndex++;
    }

    if (filters.minSqft) {
      query += ` AND p.square_feet >= $${paramIndex}`;
      params.push(filters.minSqft);
      paramIndex++;
    }

    if (filters.maxSqft) {
      query += ` AND p.square_feet <= $${paramIndex}`;
      params.push(filters.maxSqft);
      paramIndex++;
    }

    // Geographic bounds filter
    if (filters.bounds) {
      query += ` AND p.latitude BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.bounds.south, filters.bounds.north);
      paramIndex += 2;

      query += ` AND p.longitude BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.bounds.west, filters.bounds.east);
      paramIndex += 2;
    }

    // Limit results
    const limit = filters.limit || 500;
    query += ` ORDER BY p.market_value DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await db.query(query, params);

    logger.info({ tenantId, count: result.rows.length }, 'Properties fetched for map');

    return result.rows;
  } catch (error) {
    logger.error({ error, tenantId }, 'Error fetching properties for map');
    // Return mock data for development
    return getMockProperties(filters);
  }
}

export async function getPropertyClusters(tenantId: string, zoom: number, bounds: Bounds): Promise<any> {
  logger.info({ tenantId, zoom, bounds }, 'Calculating property clusters');

  try {
    // Use PostGIS ST_ClusterKMeans for clustering at different zoom levels
    const clusterSize = zoom < 10 ? 20 : zoom < 14 ? 10 : 5;

    const query = `
      WITH clustered AS (
        SELECT
          p.id,
          p.latitude,
          p.longitude,
          p.property_type,
          p.market_value,
          ST_ClusterKMeans(
            ST_MakePoint(p.longitude, p.latitude),
            $2
          ) OVER () AS cluster_id
        FROM properties p
        WHERE p.tenant_id = $1
          AND p.latitude IS NOT NULL
          AND p.longitude IS NOT NULL
          AND p.latitude BETWEEN $3 AND $4
          AND p.longitude BETWEEN $5 AND $6
      )
      SELECT
        cluster_id,
        COUNT(*) as property_count,
        AVG(latitude) as center_lat,
        AVG(longitude) as center_lng,
        SUM(market_value) as total_value,
        array_agg(DISTINCT property_type) as property_types
      FROM clustered
      GROUP BY cluster_id
      ORDER BY property_count DESC
    `;

    const result = await db.query(query, [
      tenantId,
      clusterSize,
      bounds.south,
      bounds.north,
      bounds.west,
      bounds.east,
    ]);

    return {
      zoom,
      clusters: result.rows.map((row) => ({
        id: row.cluster_id,
        count: parseInt(row.property_count),
        center: {
          lat: parseFloat(row.center_lat),
          lng: parseFloat(row.center_lng),
        },
        totalValue: parseFloat(row.total_value),
        propertyTypes: row.property_types,
      })),
    };
  } catch (error) {
    logger.error({ error, tenantId }, 'Error calculating clusters');
    return getMockClusters(bounds);
  }
}

export async function getProperty3DVisualization(tenantId: string, propertyId: string): Promise<any> {
  logger.info({ tenantId, propertyId }, 'Fetching 3D property visualization data');

  try {
    const query = `
      SELECT
        p.id,
        p.address,
        p.latitude,
        p.longitude,
        p.property_type,
        p.square_feet,
        p.year_built,
        p.building_height,
        p.number_of_floors,
        p.assessed_value,
        p.market_value,
        p.image_url,
        p.parcel_id
      FROM properties p
      WHERE p.tenant_id = $1 AND p.id = $2
    `;

    const result = await db.query(query, [tenantId, propertyId]);

    if (result.rows.length === 0) {
      return null;
    }

    const property = result.rows[0];

    return {
      id: property.id,
      address: property.address,
      location: {
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude),
      },
      propertyType: property.property_type,
      squareFeet: property.square_feet,
      yearBuilt: property.year_built,
      buildingHeight: property.building_height || estimateHeight(property.number_of_floors),
      numberOfFloors: property.number_of_floors,
      assessedValue: property.assessed_value,
      marketValue: property.market_value,
      imageUrl: property.image_url,
      parcelId: property.parcel_id,
      visualization: {
        tilt: 45, // 3D tilt angle
        heading: 0, // Camera heading
        zoom: 19, // Close-up zoom for 3D view
      },
    };
  } catch (error) {
    logger.error({ error, tenantId, propertyId }, 'Error fetching 3D property data');
    return getMock3DProperty(propertyId);
  }
}

export async function getHeatmapData(tenantId: string, metric: string, bounds: Bounds): Promise<any> {
  logger.info({ tenantId, metric, bounds }, 'Generating heatmap data');

  try {
    let valueColumn = 'market_value';
    switch (metric) {
      case 'sqft':
        valueColumn = 'square_feet';
        break;
      case 'age':
        valueColumn = 'EXTRACT(YEAR FROM CURRENT_DATE) - year_built';
        break;
      case 'assessment_ratio':
        valueColumn = 'CASE WHEN market_value > 0 THEN (assessed_value::float / market_value::float) * 100 ELSE 0 END';
        break;
      default:
        valueColumn = 'market_value';
    }

    const query = `
      SELECT
        latitude,
        longitude,
        ${valueColumn} as weight
      FROM properties
      WHERE tenant_id = $1
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        AND latitude BETWEEN $2 AND $3
        AND longitude BETWEEN $4 AND $5
      ORDER BY weight DESC
      LIMIT 1000
    `;

    const result = await db.query(query, [
      tenantId,
      bounds.south,
      bounds.north,
      bounds.west,
      bounds.east,
    ]);

    return {
      metric,
      points: result.rows.map((row) => ({
        location: {
          lat: parseFloat(row.latitude),
          lng: parseFloat(row.longitude),
        },
        weight: parseFloat(row.weight) || 0,
      })),
    };
  } catch (error) {
    logger.error({ error, tenantId, metric }, 'Error generating heatmap');
    return getMockHeatmap(metric, bounds);
  }
}

// Helper function to estimate building height from floors
function estimateHeight(floors?: number): number {
  if (!floors) return 15; // Default 15 feet for single story
  return floors * 12; // Assume 12 feet per floor
}

// Mock data functions for development
function getMockProperties(filters: PropertyFilter): any[] {
  const mockProperties = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      address: '123 Commerce St',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90012',
      latitude: 34.0522,
      longitude: -118.2437,
      property_type: 'office',
      square_feet: 50000,
      year_built: 2010,
      assessed_value: 8500000,
      market_value: 9200000,
      image_url: 'https://example.com/property1.jpg',
      status: 'active',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      address: '456 Retail Plaza',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90013',
      latitude: 34.0505,
      longitude: -118.2468,
      property_type: 'retail',
      square_feet: 25000,
      year_built: 2015,
      assessed_value: 4200000,
      market_value: 4650000,
      image_url: 'https://example.com/property2.jpg',
      status: 'active',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      address: '789 Industrial Way',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90021',
      latitude: 34.0407,
      longitude: -118.2468,
      property_type: 'industrial',
      square_feet: 100000,
      year_built: 2005,
      assessed_value: 6800000,
      market_value: 7500000,
      image_url: 'https://example.com/property3.jpg',
      status: 'active',
    },
  ];

  return mockProperties.slice(0, filters.limit || 500);
}

function getMockClusters(bounds: Bounds): any {
  return {
    clusters: [
      {
        id: 1,
        count: 15,
        center: { lat: 34.0522, lng: -118.2437 },
        totalValue: 125000000,
        propertyTypes: ['office', 'retail'],
      },
      {
        id: 2,
        count: 8,
        center: { lat: 34.0505, lng: -118.2468 },
        totalValue: 45000000,
        propertyTypes: ['retail', 'mixed_use'],
      },
    ],
  };
}

function getMock3DProperty(propertyId: string): any {
  return {
    id: propertyId,
    address: '123 Commerce St, Los Angeles, CA 90012',
    location: { lat: 34.0522, lng: -118.2437 },
    propertyType: 'office',
    squareFeet: 50000,
    yearBuilt: 2010,
    buildingHeight: 120,
    numberOfFloors: 10,
    assessedValue: 8500000,
    marketValue: 9200000,
    imageUrl: 'https://example.com/property1.jpg',
    visualization: {
      tilt: 45,
      heading: 0,
      zoom: 19,
    },
  };
}

function getMockHeatmap(metric: string, bounds: Bounds): any {
  return {
    metric,
    points: [
      { location: { lat: 34.0522, lng: -118.2437 }, weight: 9200000 },
      { location: { lat: 34.0505, lng: -118.2468 }, weight: 4650000 },
      { location: { lat: 34.0407, lng: -118.2468 }, weight: 7500000 },
    ],
  };
}
