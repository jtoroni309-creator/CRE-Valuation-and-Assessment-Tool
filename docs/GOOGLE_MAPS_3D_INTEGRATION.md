# Google 3D Maps Integration for Axxiom Platform

## Overview

The Axxiom platform now includes a comprehensive Google 3D Maps integration that visualizes all commercial properties in an interactive, real-time 3D map interface. This feature provides powerful geospatial analysis and property exploration capabilities for real estate professionals.

## Features

### 🗺️ Interactive 3D Map Visualization
- **3D Building View**: 45-degree tilt angle with realistic building renderings
- **Property Markers**: Color-coded pins based on property type
- **Satellite Imagery**: High-resolution satellite base layer
- **Street View Integration**: Integrated Google Street View for ground-level exploration

### 🔍 Advanced Filtering
- **Property Type Filter**: Office, Retail, Industrial, Multifamily, Hospitality, Mixed Use, Land
- **Value Range Filter**: Min/Max market value filtering
- **Geographic Bounds**: Automatic filtering based on visible map area
- **Dynamic Updates**: Real-time property updates as you pan/zoom

### 📊 Data Visualization
- **Property Clustering**: Intelligent clustering for different zoom levels
- **Heatmap Layer**: Value density heatmap with gradient visualization
- **Property Details**: Rich info panels with images and key metrics
- **Legend**: Color-coded legend for property types

### 🎯 Key Capabilities
- Display up to 1,000 properties per view
- GeoJSON FeatureCollection format for standard compatibility
- PostGIS spatial queries for optimal performance
- Real-time geospatial analytics

---

## Architecture

### Backend Services

#### 1. Geospatial Service (Port 3009)
**New Map Endpoints:**

```
GET /api/v1/map/properties
  - Fetch properties within map bounds
  - Parameters: bounds, propertyType, minValue, maxValue, limit
  - Returns: GeoJSON FeatureCollection

GET /api/v1/map/clusters
  - Get property clusters for different zoom levels
  - Parameters: zoom, bounds
  - Returns: Cluster data with counts and center points

GET /api/v1/map/properties/:propertyId/3d
  - Get 3D visualization data for specific property
  - Returns: Property details with tilt/heading/zoom settings

GET /api/v1/map/heatmap
  - Get heatmap data for value/sqft/age metrics
  - Parameters: metric, bounds
  - Returns: Weighted location points for heatmap rendering
```

#### 2. Database Queries
**PostGIS Spatial Queries:**

```sql
-- Properties within bounds
SELECT * FROM properties
WHERE latitude BETWEEN $south AND $north
  AND longitude BETWEEN $west AND $east
  AND tenant_id = $tenantId;

-- Property clustering (using ST_ClusterKMeans)
SELECT
  cluster_id,
  COUNT(*) as property_count,
  AVG(latitude) as center_lat,
  AVG(longitude) as center_lng,
  SUM(market_value) as total_value
FROM (
  SELECT *, ST_ClusterKMeans(
    ST_MakePoint(longitude, latitude), 20
  ) OVER () AS cluster_id
  FROM properties
  WHERE ...
) clustered
GROUP BY cluster_id;
```

#### 3. API Gateway Routing
```typescript
// Added route in services/api-gateway/src/proxy.ts
app.use('/api/v1/map', /* ... routing to geospatial service */);
```

### Frontend Components

#### PropertyMap3D Component
**Location:** `web/admin-portal/src/components/PropertyMap3D.tsx`

**Key Features:**
- Google Maps JavaScript API v3
- Advanced Marker API for custom pins
- Visualization library for heatmaps
- React hooks for state management
- TypeScript for type safety

**Component Props:**
```typescript
interface PropertyMapProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  onPropertyClick?: (property: Property) => void;
}
```

#### Map Page
**Location:** `web/admin-portal/src/app/properties/map/page.tsx`

Full-page map view with header and navigation.

---

## Setup Instructions

### 1. Google Maps API Configuration

#### Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Maps SDK for Android** (if mobile needed)
   - **Places API** (optional, for search)
   - **Geocoding API** (optional, for address lookup)

4. Create API credentials:
   - Navigate to **APIs & Services > Credentials**
   - Click **Create Credentials > API Key**
   - Copy the API key

5. Restrict the API key (IMPORTANT for production):
   ```
   Application Restrictions:
   - HTTP referrers
   - Add: https://app.axxiom.ai/*
   - Add: http://localhost:3100/* (for development)

   API Restrictions:
   - Restrict key
   - Select: Maps JavaScript API, Geocoding API
   ```

### 2. Environment Variables

Add to `.env` file:

```bash
# Google Maps API Key (for server-side if needed)
GOOGLE_MAPS_API_KEY=AIzaSy...

# Public API Key for frontend (domain-restricted)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- **ALWAYS restrict public keys by domain**
- Use different keys for dev/staging/production
- Enable billing alerts in Google Cloud Console

### 3. Database Setup

Ensure PostGIS extension is enabled:

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add spatial columns to properties table (if not exists)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add spatial index for performance
CREATE INDEX IF NOT EXISTS idx_properties_location
  ON properties USING GIST (ST_MakePoint(longitude, latitude));

-- Add additional columns for 3D visualization
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS building_height INTEGER,
  ADD COLUMN IF NOT EXISTS number_of_floors INTEGER,
  ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 4. Install Dependencies

```bash
# Root workspace
npm install

# Specific services
cd services/geospatial-service
npm install

cd ../../web/admin-portal
npm install @googlemaps/js-api-loader
```

### 5. Start Services

```bash
# Development (docker-compose)
docker-compose up -d

# Or manually
npm run dev # in root workspace
```

### 6. Access the Map

Navigate to: `http://localhost:3100/properties/map`

---

## Usage Guide

### Basic Navigation

1. **Pan**: Click and drag the map
2. **Zoom**: Use mouse wheel or +/- buttons
3. **Rotate**: Hold Ctrl/Cmd + drag
4. **Tilt**: Hold Shift + drag vertically

### Property Exploration

1. **View Properties**: Properties appear as colored pins
2. **Click Property**: See details panel with info
3. **3D View**: Click property to zoom and tilt to 3D view
4. **Filter**: Use left panel to filter by type, value

### Advanced Features

#### Enable 3D View
```
Click "Enable 3D View" button in control panel
- Sets tilt to 45 degrees
- Shows building heights and structures
```

#### Show Heatmap
```
Click "Show Value Heatmap" button
- Displays color gradient based on property values
- Red = High value concentration
- Blue = Lower value areas
```

#### Property Clustering
```
Automatic clustering at different zoom levels:
- Zoom < 10: Clusters of ~20 properties
- Zoom 10-14: Clusters of ~10 properties
- Zoom > 14: Individual properties shown
```

---

## API Reference

### Get Properties for Map

```typescript
GET /api/v1/map/properties

Query Parameters:
- north: number (latitude)
- south: number (latitude)
- east: number (longitude)
- west: number (longitude)
- propertyType?: string (optional)
- minValue?: number (optional)
- maxValue?: number (optional)
- limit?: number (default: 500, max: 1000)

Response:
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "id": "uuid",
        "geometry": {
          "type": "Point",
          "coordinates": [-118.2437, 34.0522] // [lng, lat]
        },
        "properties": {
          "id": "uuid",
          "address": "123 Commerce St",
          "propertyType": "office",
          "squareFeet": 50000,
          "assessedValue": 8500000,
          "marketValue": 9200000,
          "yearBuilt": 2010,
          "imageUrl": "https://...",
          "status": "active"
        }
      }
    ]
  }
}
```

### Get Property Clusters

```typescript
GET /api/v1/map/clusters

Query Parameters:
- zoom: number (0-22)
- north: number
- south: number
- east: number
- west: number

Response:
{
  "success": true,
  "data": {
    "zoom": 12,
    "clusters": [
      {
        "id": 1,
        "count": 15,
        "center": { "lat": 34.0522, "lng": -118.2437 },
        "totalValue": 125000000,
        "propertyTypes": ["office", "retail"]
      }
    ]
  }
}
```

### Get 3D Property Data

```typescript
GET /api/v1/map/properties/:propertyId/3d

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "address": "123 Commerce St",
    "location": { "lat": 34.0522, "lng": -118.2437 },
    "propertyType": "office",
    "buildingHeight": 120, // feet
    "numberOfFloors": 10,
    "visualization": {
      "tilt": 45,
      "heading": 0,
      "zoom": 19
    }
  }
}
```

### Get Heatmap Data

```typescript
GET /api/v1/map/heatmap

Query Parameters:
- metric: 'value' | 'sqft' | 'age' | 'assessment_ratio'
- north: number
- south: number
- east: number
- west: number

Response:
{
  "success": true,
  "data": {
    "metric": "value",
    "points": [
      {
        "location": { "lat": 34.0522, "lng": -118.2437 },
        "weight": 9200000
      }
    ]
  }
}
```

---

## Performance Optimization

### Backend Optimizations

1. **Database Indexing**
   ```sql
   -- Spatial index for fast geographic queries
   CREATE INDEX idx_properties_location ON properties
     USING GIST (ST_MakePoint(longitude, latitude));

   -- Composite index for common filters
   CREATE INDEX idx_properties_type_value ON properties
     (property_type, market_value, tenant_id);
   ```

2. **Query Limits**
   - Default limit: 500 properties per request
   - Maximum limit: 1,000 properties
   - Use clustering for zoom levels < 14

3. **Caching Strategy**
   - Cache property data in Redis (15-minute TTL)
   - Cache clusters by zoom level and bounds
   - Invalidate cache on property updates

### Frontend Optimizations

1. **Marker Rendering**
   - Use Advanced Marker API (better performance than legacy markers)
   - Implement marker clustering for 100+ markers
   - Lazy load property images

2. **Debouncing**
   - Debounce map bounds changes (300ms)
   - Debounce filter updates (500ms)

3. **Memory Management**
   - Clear old markers when updating
   - Remove event listeners on component unmount
   - Limit heatmap data points to 1,000

---

## Security Best Practices

### API Key Security

1. **Domain Restrictions**
   ```
   Production: https://app.axxiom.ai/*
   Development: http://localhost:3100/*
   ```

2. **API Restrictions**
   - Only enable required APIs
   - Disable unused APIs (e.g., Directions, Routes)

3. **Usage Monitoring**
   - Set up billing alerts
   - Monitor API usage in Google Cloud Console
   - Alert on unusual spikes

### Data Security

1. **Multi-Tenant Isolation**
   - All queries filtered by `tenant_id`
   - Row-Level Security (RLS) enforced
   - JWT authentication required

2. **Rate Limiting**
   - 200 requests per 15 minutes per tenant
   - Applied at API Gateway level

---

## Troubleshooting

### Common Issues

#### Map Not Loading

**Problem:** Blank screen or error message

**Solutions:**
1. Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
2. Verify API key is valid in Google Cloud Console
3. Check browser console for errors
4. Verify domain is in API key restrictions

#### No Properties Showing

**Problem:** Map loads but no markers appear

**Solutions:**
1. Check database has properties with lat/lng
2. Verify authentication token is valid
3. Check browser Network tab for API errors
4. Ensure properties exist in current map bounds

#### 3D View Not Working

**Problem:** Map doesn't tilt to 3D

**Solutions:**
1. Verify `mapId` is set in map initialization
2. Check area has 3D building data (major cities only)
3. Zoom level must be >= 17 for 3D buildings
4. Satellite view required for 3D features

#### Performance Issues

**Problem:** Slow rendering with many markers

**Solutions:**
1. Implement marker clustering
2. Reduce property limit (default 500)
3. Use server-side clustering for zoom < 14
4. Enable browser GPU acceleration

### Debug Mode

Enable debug logging:

```typescript
// Add to PropertyMap3D component
useEffect(() => {
  if (map) {
    google.maps.event.addListener(map, 'bounds_changed', () => {
      console.log('Bounds:', map.getBounds()?.toJSON());
    });
  }
}, [map]);
```

---

## Future Enhancements

### Planned Features

1. **Property Search**
   - Autocomplete address search
   - Fuzzy search by property name
   - Search within radius

2. **Drawing Tools**
   - Draw custom boundaries
   - Measure distances
   - Calculate area

3. **Advanced Analytics**
   - Comparative market analysis (CMA)
   - Price per square foot visualization
   - Cap rate heatmaps
   - Market trends overlay

4. **Export Capabilities**
   - Export visible properties to CSV
   - Generate map screenshot
   - Create shareable map links

5. **Real-Time Updates**
   - WebSocket integration
   - Live property updates
   - Collaborative viewing

### Potential Integrations

- **Demographic Data**: Census data overlay
- **Traffic Patterns**: Google Traffic layer
- **Transit Access**: Public transit stops/lines
- **Crime Data**: Local crime statistics
- **School Districts**: School boundaries and ratings
- **Zoning Overlay**: Zoning district boundaries

---

## Cost Estimates

### Google Maps API Pricing (as of 2024)

**Maps JavaScript API:**
- First 28,000 loads per month: FREE
- Additional loads: $7.00 per 1,000 loads

**Typical Usage (1,000 users/month):**
- Average 10 map views per user = 10,000 loads
- Cost: **FREE** (within free tier)

**High Usage (10,000 users/month):**
- Average 10 map views per user = 100,000 loads
- Free tier: 28,000 loads
- Billable: 72,000 loads
- Cost: **$504/month**

**Cost Optimization:**
- Implement session tokens
- Cache map tiles
- Use marker clustering to reduce loads
- Lazy load map on page scroll

---

## Support & Resources

### Documentation
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Advanced Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers)
- [Visualization Library](https://developers.google.com/maps/documentation/javascript/visualization)

### Community
- [Stack Overflow - google-maps](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Community](https://www.googlemapscommunity.com/)

### Internal Support
- **Backend Issues**: Geospatial Service Team
- **Frontend Issues**: Admin Portal Team
- **API Keys**: DevOps Team

---

## License

This integration is proprietary to Axxiom Platform.

**Google Maps Platform:**
- Subject to [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
- Attribution required on all map displays

---

**Document Version:** 1.0
**Last Updated:** 2025-11-30
**Author:** Axxiom Platform Team
