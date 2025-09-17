'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  center: LatLngExpression;
  zoom: number;
  markers: Array<{
    position: LatLngExpression;
    title: string;
    description?: string;
  }>;
}

export default function MapComponent({ center, zoom, markers }: MapComponentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <div>
              <h3 className="font-semibold">{marker.title}</h3>
              {marker.description && (
                <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
