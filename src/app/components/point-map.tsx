'use client';

import 'leaflet/dist/leaflet.css';

import { Box } from "@mantine/core";
import {GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import { useEffect, useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { LatLngExpression } from 'leaflet';
import { Coordinates } from "@/app/type";


const GET_GEOMETRY = gql`
query Maps($regions: [String], $tolerance: Float) {
  maps(tolerance: $tolerance) {
    ibra(regions: $regions)
  }
}`;



type Maps = {
  ibra: string,
};

type QueryResults = {
  maps: Maps,
};


function IbraLayers({ regions }: { regions: string[] }) {
  const [json, setJson] = useState(undefined);
  const [tolerance, setTolerance] = useState(0.1);

  const { loading, error, data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions,
      tolerance: tolerance,
    }
  });

  useEffect(() => {
    if (data) {
      setJson(JSON.parse(data.maps.ibra))
    }
  }, [data, setJson]);

  const map = useMapEvent('zoomend', () => {
    const invertZoom = (2 ^ map.getMaxZoom()) - (2 ^ map.getZoom());
    const tolerance = 0.001 * invertZoom;
    setTolerance(tolerance);
  });

  return (
    <>
    { json ? <GeoJSON key={`${tolerance}-${json}`} data={json} /> : null }
    </>
  )
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

        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}