'use client';

import 'leaflet/dist/leaflet.css';

import { Box, Text, Button } from "@mantine/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from 'leaflet';
import { Coordinates } from "@/app/type";

const customMarker = new Icon({
  iconUrl: '/pin.svg',
  iconSize: [41, 64],
  iconAnchor: [20, 64],
});

function PopupMarker({ position, children }: { position: Coordinates, children: React.ReactNode }) {
  const pos = [position.latitude, position.longitude] as LatLngExpression;
  return (
    <Marker position={pos} icon={customMarker}>
      <Popup>
        <Box>
          {children}
        </Box>
      </Popup>
    </Marker>
  )
}

function MarkersList({ coordinates }: { coordinates: Coordinates[] }) {
  const markers = coordinates.map((position, idx) => (
    <PopupMarker position={position} key={idx}>
      <Text>Latitude: {position.latitude}</Text>
      <Text>Longitude: {position.longitude}</Text>
    </PopupMarker>
  ));

  return (<>{markers}</>);
}


interface PointMapProperties {
  coordinates?: Coordinates[],
  borderRadius?: string,
  children?: React.ReactNode,
}

export default function PointMap(props: PointMapProperties) {
  const position = [-28.30638, 134.38380] as LatLngExpression;

  return (
    <Box m={0}>
      <MapContainer center={position} zoom={3} scrollWheelZoom={true} style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: props.borderRadius || "0 0 0 0",
      }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { props.coordinates ? <MarkersList coordinates={props.coordinates}/> : null }

        {props.children}
      </MapContainer>
    </Box>
  );
}
