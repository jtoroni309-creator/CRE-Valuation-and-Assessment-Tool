'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Property {
  id: string;
  address: string;
  propertyType: string;
  squareFeet: number;
  assessedValue: number;
  marketValue: number;
  yearBuilt: number;
  imageUrl?: string;
  status: string;
}

interface PropertyFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: Property;
}

interface PropertyMapProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  onPropertyClick?: (property: Property) => void;
}

export default function PropertyMap3D({
  apiKey,
  center = { lat: 34.0522, lng: -118.2437 }, // Default: Los Angeles
  zoom = 14,
  onPropertyClick,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [properties, setProperties] = useState<PropertyFeature[]>([]);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [view3DEnabled, setView3DEnabled] = useState(true);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    minValue: '',
    maxValue: '',
  });
  const [loading, setLoading] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || map) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['marker', 'visualization'],
    });

    loader
      .load()
      .then(async () => {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

        const mapInstance = new Map(mapRef.current!, {
          center,
          zoom,
          mapId: 'AXXIOM_3D_MAP', // Required for 3D features
          tilt: 45, // 45-degree tilt for 3D buildings
          heading: 0,
          mapTypeId: 'satellite',
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: true,
        });

        setMap(mapInstance);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });
  }, [apiKey, center, zoom, map]);

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    if (!map) return;

    setLoading(true);
    try {
      const bounds = map.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const params = new URLSearchParams({
        north: ne.lat().toString(),
        south: sw.lat().toString(),
        east: ne.lng().toString(),
        west: sw.lng().toString(),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.minValue && { minValue: filters.minValue }),
        ...(filters.maxValue && { maxValue: filters.maxValue }),
      });

      const response = await fetch(`/api/v1/map/properties?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch properties');

      const data = await response.json();
      setProperties(data.data.features || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [map, filters]);

  // Create markers for properties
  useEffect(() => {
    if (!map || !properties.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.map = null);

    const createMarkers = async () => {
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      const newMarkers = properties.map((feature) => {
        const property = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        // Create custom pin with property type color
        const pinColor = getPropertyTypeColor(property.propertyType);
        const pin = new PinElement({
          background: pinColor,
          borderColor: '#fff',
          glyphColor: '#fff',
          scale: 1.2,
        });

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat, lng },
          content: pin.element,
          title: property.address,
        });

        // Add click listener
        marker.addListener('click', () => {
          setSelectedProperty(property);
          if (onPropertyClick) {
            onPropertyClick(property);
          }

          // Center map on property and tilt for 3D view
          if (view3DEnabled) {
            map.setCenter({ lat, lng });
            map.setZoom(19);
            map.setTilt(45);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    };

    createMarkers();
  }, [map, properties, onPropertyClick, view3DEnabled]);

  // Update map view when bounds change
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('idle', () => {
      fetchProperties();
    });

    // Initial fetch
    fetchProperties();

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, fetchProperties]);

  // Toggle 3D view
  const toggle3DView = useCallback(() => {
    if (!map) return;

    if (view3DEnabled) {
      map.setTilt(0);
      map.setHeading(0);
    } else {
      map.setTilt(45);
    }

    setView3DEnabled(!view3DEnabled);
  }, [map, view3DEnabled]);

  // Toggle heatmap
  const toggleHeatmap = useCallback(async () => {
    if (!map) return;

    if (heatmap) {
      heatmap.setMap(null);
      setHeatmap(null);
      setHeatmapEnabled(false);
      return;
    }

    try {
      const bounds = map.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const params = new URLSearchParams({
        metric: 'value',
        north: ne.lat().toString(),
        south: sw.lat().toString(),
        east: ne.lng().toString(),
        west: sw.lng().toString(),
      });

      const response = await fetch(`/api/v1/map/heatmap?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch heatmap data');

      const data = await response.json();

      const { HeatmapLayer } = await google.maps.importLibrary('visualization') as google.maps.VisualizationLibrary;

      const heatmapData = data.data.points.map((point: any) => ({
        location: new google.maps.LatLng(point.location.lat, point.location.lng),
        weight: point.weight / 1000000, // Normalize to millions
      }));

      const heatmapLayer = new HeatmapLayer({
        data: heatmapData,
        map,
        radius: 20,
        opacity: 0.6,
      });

      setHeatmap(heatmapLayer);
      setHeatmapEnabled(true);
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  }, [map, heatmap]);

  // Helper function to get color based on property type
  const getPropertyTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      office: '#3B82F6',       // Blue
      retail: '#10B981',       // Green
      industrial: '#F59E0B',   // Orange
      multifamily: '#8B5CF6',  // Purple
      hospitality: '#EC4899',  // Pink
      mixed_use: '#06B6D4',    // Cyan
      land: '#84CC16',         // Lime
    };
    return colors[type] || '#6B7280'; // Default gray
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Controls Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-4 max-w-sm">
        <h3 className="text-lg font-semibold">Map Controls</h3>

        {/* Filters */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Property Type
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="office">Office</option>
              <option value="retail">Retail</option>
              <option value="industrial">Industrial</option>
              <option value="multifamily">Multifamily</option>
              <option value="hospitality">Hospitality</option>
              <option value="mixed_use">Mixed Use</option>
              <option value="land">Land</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Min Value
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="$0"
              value={filters.minValue}
              onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Max Value
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="$100,000,000"
              value={filters.maxValue}
              onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
            />
          </label>

          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={fetchProperties}
          >
            Apply Filters
          </button>
        </div>

        {/* View Controls */}
        <div className="border-t pt-4 space-y-2">
          <button
            className={`w-full px-4 py-2 rounded-md transition ${
              view3DEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={toggle3DView}
          >
            {view3DEnabled ? '3D View Enabled' : 'Enable 3D View'}
          </button>

          <button
            className={`w-full px-4 py-2 rounded-md transition ${
              heatmapEnabled
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={toggleHeatmap}
          >
            {heatmapEnabled ? 'Hide Heatmap' : 'Show Value Heatmap'}
          </button>
        </div>

        {/* Property Count */}
        <div className="text-sm text-gray-600 border-t pt-2">
          Showing {properties.length} properties
          {loading && <span className="ml-2 text-blue-600">Loading...</span>}
        </div>
      </div>

      {/* Selected Property Info Panel */}
      {selectedProperty && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{selectedProperty.address}</h3>
            <button
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {selectedProperty.imageUrl && (
            <img
              src={selectedProperty.imageUrl}
              alt={selectedProperty.address}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">{selectedProperty.propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Square Feet:</span>
              <span className="font-medium">{selectedProperty.squareFeet.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Year Built:</span>
              <span className="font-medium">{selectedProperty.yearBuilt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Assessed Value:</span>
              <span className="font-medium">{formatCurrency(selectedProperty.assessedValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Market Value:</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(selectedProperty.marketValue)}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              View Details
            </button>
            <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
              Create Valuation
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Property Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
            <span>Office</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span>Retail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span>Industrial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
            <span>Multifamily</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EC4899' }} />
            <span>Hospitality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
            <span>Mixed Use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84CC16' }} />
            <span>Land</span>
          </div>
        </div>
      </div>
    </div>
  );
}
