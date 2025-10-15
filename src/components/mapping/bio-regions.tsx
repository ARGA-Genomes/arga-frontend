"use client";

import { GeoJSON, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_GEOMETRY = gql`
  query BioRegions($regions: [String], $tolerance: Float) {
    maps(tolerance: $tolerance) {
      ibra(regions: $regions)
      imcraProvincial(regions: $regions)
      imcraMesoscale(regions: $regions)
    }
  }
`;

interface QueryResults {
  maps: {
    ibra: string;
    imcraProvincial: string;
    imcraMesoscale: string;
  };
}

export function BioRegionLayers({ regions }: { regions: string[] }) {
  const [ibra, setIbra] = useState(undefined);
  const [imcraProvincial, setImcraProvincial] = useState(undefined);
  const [imcraMesoscale, setImcraMesoscale] = useState(undefined);
  const [tolerance, setTolerance] = useState(0.1);

  const { data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions,
      tolerance: tolerance,
    },
  });

  useEffect(() => {
    if (data) {
      setIbra(JSON.parse(data.maps.ibra));
      setImcraProvincial(JSON.parse(data.maps.imcraProvincial));
      setImcraMesoscale(JSON.parse(data.maps.imcraMesoscale));
    }
  }, [data, setIbra, setImcraProvincial, setImcraMesoscale]);

  const map = useMapEvent("zoomend", () => {
    const invertZoom = (2 ^ map.getMaxZoom()) - (2 ^ map.getZoom());
    const tolerance = 0.001 * invertZoom;
    setTolerance(tolerance);
  });

  return (
    <>
      {ibra ? <GeoJSON key={`ibra-${tolerance}`} data={ibra} /> : null}
      {imcraProvincial ? (
        <GeoJSON key={`imcra-prov-${tolerance}`} data={imcraProvincial} />
      ) : null}
      {imcraMesoscale ? (
        <GeoJSON key={`imcra-meso-${tolerance}`} data={imcraMesoscale} />
      ) : null}
    </>
  );
}
