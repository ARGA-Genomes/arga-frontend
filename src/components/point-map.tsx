'use client';

import 'leaflet/dist/leaflet.css';

import { Box, Text, Button } from "@mantine/core";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
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
  const markers = coordinates.filter(c => c?.latitude && c?.longitude).map((position, idx) => (
    <PopupMarker position={position} key={idx}>
      <Text>Latitude: {position.latitude}</Text>
      <Text>Longitude: {position.longitude}</Text>
    </PopupMarker>
  ));

  return (<>{markers}</>);
}


function MapBounds({ coordinates }: { coordinates: Coordinates[] }) {
  const map = useMap();

  let min = coordinates[0];
  let max = coordinates[0];

  for (const coord of coordinates) {
    if (coord.latitude <= min.latitude) {
      min = { latitude: coord.latitude, longitude: min.longitude };
    }
    if (coord.longitude <= min.longitude) {
      min = { latitude: min.latitude, longitude: coord.longitude };
    }

    if (coord.latitude >= max.latitude) {
      max = { latitude: coord.latitude, longitude: max.longitude };
    }
    if (coord.longitude >= max.longitude) {
      max = { latitude: max.latitude, longitude: coord.longitude };
    }
  }

  const bounds = [
    [min.latitude, min.longitude],
    [max.latitude, max.longitude],
  ];
  map.fitBounds(bounds as LatLngBoundsExpression);
  return null;
}


interface PointMapProperties {
  coordinates?: Coordinates[],
  borderRadius?: string,
  center?: Coordinates,
  children?: React.ReactNode,
}

export default function PointMap(props: PointMapProperties) {
  const position = [
    props.center?.latitude || -28.30638,
    props.center?.longitude || 134.38380
  ] as LatLngExpression;

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

        { props.coordinates && props.coordinates.length > 1 ? <MapBounds coordinates={props.coordinates} /> : null }
      </MapContainer>
    </Box>
  );
}
