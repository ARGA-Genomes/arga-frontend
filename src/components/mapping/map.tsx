"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer} from "react-leaflet";
import { LatLngExpression } from "leaflet";


// center on Australia by default
const DEFAULT_POSITION = [-28.30638, 134.3838] as LatLngExpression;


interface MapProps {
  children?: React.ReactNode,
}

export default function Map({ children }: MapProps) {
  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={4}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
