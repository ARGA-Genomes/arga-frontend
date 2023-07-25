"use client";

import "leaflet/dist/leaflet.css";

import { Box, Text } from "@mantine/core";
import { Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Coordinates, Specimen } from "../../type";


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

export function SpecimenMarker({ specimen }: { specimen: Specimen }) {
  const position = specimen.latitude && specimen.longitude && specimen as Coordinates;
  if (!position) return null;

  return (
    <PopupMarker position={position}>
      <Text>Type: {specimen.typeStatus}</Text>
      <Text>Catalog number: {specimen.catalogNumber}</Text>
      <Text>Institution: {specimen.institutionName}</Text>
    </PopupMarker>
  )
}

export function SpecimensLayer({ specimens }: { specimens: Specimen[] }) {
  return (
    <>
      { specimens.map(specimen => (<SpecimenMarker specimen={specimen} key={specimen.id} />)) }
    </>
  )
}
