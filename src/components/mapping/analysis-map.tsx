"use client";

import Map from 'react-map-gl/maplibre';
import DeckGL, { BitmapLayer, GeoJsonLayer, PathLayer, TileLayer } from 'deck.gl/typed';
import { useEffect, useState } from 'react';
import { GeoJSON } from 'geojson';
import { gql, useQuery } from '@apollo/client';


// center on Australia by default
const DEFAULT_POSITION = [-28.30638, 134.3838];

const GET_GEOMETRY = gql`
  query BioRegions($regions: [String], $tolerance: Float) {
    maps(tolerance: $tolerance) {
      ibra(regions: $regions)
      imcraProvincial(regions: $regions)
      imcraMesoscale(regions: $regions)
    }
  }
`;

type QueryResults = {
  maps: {
    ibra: string;
    imcraProvincial: string;
    imcraMesoscale: string;
  };
};


interface Regions {
  ibra: string[],
  imcra: string[],
}


interface AnalysisMapProps {
  regions?: Regions,
  children?: React.ReactNode,
}

export default function AnalysisMap({ regions, children }: AnalysisMapProps) {
  const [tolerance, setTolerance] = useState(0.01);

  const { loading, error, data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions ? [...regions.ibra, ...regions.imcra] : [],
      tolerance: tolerance,
    },
  });

  let bioRegions = {
    ibra: data && JSON.parse(data.maps.ibra) as GeoJSON,
    imcra: data && JSON.parse(data.maps.imcraProvincial) as GeoJSON,
  }

  return (
    <DeckGL
      initialViewState={{
        latitude: DEFAULT_POSITION[0],
        longitude: DEFAULT_POSITION[1],
        zoom: 4,
      }}
      layers={[
        tileLayer(),
        bioRegionLayers(bioRegions),
      ]}
      controller={true}
      style={{ width: '100%', height: '100%' }}
    >
      <Map />
      {children}
    </DeckGL>
  )
}


function tileLayer() {
  return new TileLayer({
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxRequests: 20,
    pickable: true,
    autoHighlight: false,
    highlightColor: [60, 60, 60, 40],
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: props => {
      const [[west, south], [east, north]] = props.tile.boundingBox;
      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [west, south, east, north]
      })
    },
  });
}


interface BioRegions {
  ibra?: GeoJSON,
  imcra?: GeoJSON,
}

function bioRegionLayers(regions: BioRegions) {
  const ibra = new GeoJsonLayer({
    id: "ibra-layer",
    data: regions.ibra || [],
    getFillColor: [244, 124, 46, 70],
    getLineColor: [244, 124, 46, 200],
    pickable: true,
    filled: true,
    pointType: 'circle',
    lineWidthMinPixels: 1,
  });

  const imcra = new GeoJsonLayer({
    id: "imcra-layer",
    data: regions.imcra || [],
    getFillColor: [244, 124, 46, 70],
    getLineColor: [244, 124, 46, 200],
    pickable: true,
    filled: true,
    pointType: 'circle',
    lineWidthMinPixels: 1,
  });

  return [ibra, imcra];
}
