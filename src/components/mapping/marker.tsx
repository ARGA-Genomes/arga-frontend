"use client";

import "leaflet/dist/leaflet.css";

import { Box } from "@mantine/core";
import { Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Coordinates } from "./common";

const CUSTOM_ICON = new Icon({
  iconUrl: "/pin.svg",
  iconSize: [31, 54],
  iconAnchor: [15, 54],
});

export function PopupMarker({ position, children }: { position: Coordinates; children: React.ReactNode }) {
  const pos = [position.latitude, position.longitude] as LatLngExpression;

  return (
    <Marker position={pos} icon={CUSTOM_ICON}>
      <Popup>
        <Box>{children}</Box>
      </Popup>
    </Marker>
  );
}
