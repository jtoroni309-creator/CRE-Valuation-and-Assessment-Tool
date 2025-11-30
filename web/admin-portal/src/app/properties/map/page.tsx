'use client';

import React from 'react';
import PropertyMap3D from '@/components/PropertyMap3D';

export default function PropertiesMapPage() {
  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property);
    // You can navigate to property details page or open a modal here
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Google Maps API Key Not Configured
          </h2>
          <p className="text-gray-600">
            Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Commercial Properties Map
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Interactive 3D visualization of all commercial properties in your portfolio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/properties"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to List View
            </a>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="flex-1 relative">
        <PropertyMap3D
          apiKey={googleMapsApiKey}
          center={{ lat: 34.0522, lng: -118.2437 }} // Los Angeles
          zoom={12}
          onPropertyClick={handlePropertyClick}
        />
      </main>
    </div>
  );
}
