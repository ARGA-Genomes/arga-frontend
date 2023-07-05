'use client';

import 'leaflet/dist/leaflet.css';

import { Box } from "@mantine/core";
import { GeoJSON, MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import { useEffect, useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { LatLngExpression } from 'leaflet';


const GET_GEOMETRY = gql`
query BioRegions($regions: [String], $tolerance: Float) {
  maps(tolerance: $tolerance) {
    ibra(regions: $regions)
    imcraProvincial(regions: $regions)
    imcraMesoscale(regions: $regions)
  }
}`;

type Maps = {
  ibra: string,
  imcraProvincial: string,
  imcraMesoscale: string,
};

type QueryResults = {
  maps: Maps,
};


function BioRegionLayers({ regions }: { regions: string[] }) {
  const [ibra, setIbra] = useState(undefined);
  const [imcraProvincial, setImcraProvincial] = useState(undefined);
  const [imcraMesoscale, setImcraMesoscale] = useState(undefined);
  const [tolerance, setTolerance] = useState(0.1);

  const { loading, error, data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions,
      tolerance: tolerance,
    }
  });

  useEffect(() => {
    if (data) {
      setIbra(JSON.parse(data.maps.ibra))
      setImcraProvincial(JSON.parse(data.maps.imcraProvincial))
      setImcraMesoscale(JSON.parse(data.maps.imcraMesoscale))
    }
  }, [data, setIbra, setImcraProvincial, setImcraMesoscale]);

  const map = useMapEvent('zoomend', () => {
    const invertZoom = (2 ^ map.getMaxZoom()) - (2 ^ map.getZoom());
    const tolerance = 0.001 * invertZoom;
    setTolerance(tolerance);
  });

  return (
    <>
    { ibra ? <GeoJSON key={`ibra-${tolerance}`} data={ibra} /> : null }
    { imcraProvincial ? <GeoJSON key={`imcra-prov-${tolerance}`} data={imcraProvincial} /> : null }
    { imcraMesoscale ? <GeoJSON key={`imcra-meso-${tolerance}`} data={imcraMesoscale} /> : null }
    </>
  )
}

export default function RegionMap({ regions }: { regions: string[] }) {
  const position = [-28.30638, 134.38380] as LatLngExpression;
  return (
    <Box h={500} w={700}>
      <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BioRegionLayers regions={regions} />
      </MapContainer>
    </Box>
  );
}
