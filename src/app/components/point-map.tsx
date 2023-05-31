'use client';

import 'leaflet/dist/leaflet.css';

import { Box } from "@mantine/core";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import L, {Icon, LatLngExpression} from 'leaflet';
import { Coordinates } from "@/app/type";
import React, { Fragment } from 'react';

const customMarker = new Icon({
  iconUrl: '/dot.svg',
  iconSize: [56, 72],
  iconAnchor: [26, 72],
});

const PopupMarker = ({ content, position }: { content: string, position: LatLngExpression }) => (
  <Marker position={position} icon={customMarker}>
    {/*<Popup>{content}</Popup>*/}
  </Marker>
)

const MarkersList = ({ coordinates }: { coordinates: Coordinates[] }) => {
  const items = coordinates.map(item => {
    let popupMarker = <PopupMarker content={'' + item} position={[item.latitude, item.longitude] as LatLngExpression}/>;
    return popupMarker
    });

  return <Fragment>{items}</Fragment>
}

export default function PointMap({ coordinates }: { coordinates: Coordinates[] }) {
  const position = [-28.30638, 134.38380] as LatLngExpression;
  return (
    <Box h={500} w={800}>
      <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkersList coordinates={coordinates}/>
      </MapContainer>
    </Box>
  );
}
