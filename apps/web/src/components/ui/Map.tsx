"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

// Dynamically import to avoid SSR issues
const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  markers?: Array<{
    position: LatLngExpression;
    title: string;
    description?: string;
  }>;
  className?: string;
  height?: string;
}

export default function Map({
  center = [21.0285, 105.8542], // Hanoi coordinates
  zoom = 13,
  markers = [],
  className = "",
  height = "h-64",
}: MapProps) {
  return (
    <div className={`w-full ${height} ${className}`}>
      <DynamicMap center={center} zoom={zoom} markers={markers} />
    </div>
  );
}

// Technology locations map
export function TechnologyMap({ className = "" }: { className?: string }) {
  const technologyMarkers = [
    {
      position: [21.0285, 105.8542] as LatLngExpression,
      title: "HANOTEX Office",
      description: "Main office location",
    },
    {
      position: [21.0245, 105.8412] as LatLngExpression,
      title: "Research Institute A",
      description: "AI Technology Research",
    },
    {
      position: [21.0325, 105.8672] as LatLngExpression,
      title: "University B",
      description: "Biotechnology Research",
    },
  ];

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Technology Locations
      </h3>
      <Map
        center={[21.0285, 105.8542]}
        zoom={12}
        markers={technologyMarkers}
        height="h-80"
      />
    </div>
  );
}

// User distribution map
export function UserDistributionMap({
  className = "",
}: {
  className?: string;
}) {
  const userMarkers = [
    {
      position: [21.0285, 105.8542] as LatLngExpression,
      title: "Hanoi - 45 users",
      description: "Main user base",
    },
    {
      position: [10.8231, 106.6297] as LatLngExpression,
      title: "Ho Chi Minh City - 32 users",
      description: "Southern region",
    },
    {
      position: [16.0544, 108.2022] as LatLngExpression,
      title: "Da Nang - 18 users",
      description: "Central region",
    },
  ];

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Distribution
      </h3>
      <Map
        center={[16.0544, 108.2022]}
        zoom={6}
        markers={userMarkers}
        height="h-80"
      />
    </div>
  );
}
