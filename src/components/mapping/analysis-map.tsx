"use client";

import Map from 'react-map-gl/maplibre';
import DeckGL, { BitmapLayer, GeoJsonLayer, TileLayer } from 'deck.gl/typed';
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';


// center on Australia by default
const DEFAULT_POSITION = [-28.30638, 134.3838];


interface Regions {
  ibra: string[],
  imcra: string[],
}


interface AnalysisMapProps {
  regions?: Regions,
  children?: React.ReactNode,
}

export default function AnalysisMap({ regions, children }: AnalysisMapProps) {
  let layers: any[] = [tileLayer()];

  if (regions) {
    const allRegions = [...regions.ibra, ...regions.imcra];
    layers.push(bioRegionAnalysisLayers({ regions: allRegions }));
  }

  return (
    <DeckGL
      initialViewState={{
        latitude: DEFAULT_POSITION[0],
        longitude: DEFAULT_POSITION[1],
        zoom: 4,
      }}
      layers={layers}
      controller={true}
      style={{ width: '100%', height: '100%' }}
    >
      <Map />
      {children}
    </DeckGL>
  )
}

/* mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' */


function tileLayer() {
  return new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,


          renderSubLayers: props => {
            const {
              bbox: {west, south, east, north}
            } = props.tile;

            return new BitmapLayer(props, {
              data: null,
              image: props.data,
              bounds: [west, south, east, north]
            });
          }
  });
}


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


function bioRegionAnalysisLayers({ regions }: { regions: string[] }) {
  const [ibra, setIbra] = useState(undefined);
  const [tolerance, setTolerance] = useState(0.01);

  const { loading, error, data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions,
      tolerance: tolerance,
    },
  });

  useEffect(() => {
    if (data) {
      setIbra(JSON.parse(data.maps.ibra));
    }
  }, [data, setIbra]);

  return new GeoJsonLayer({
    id: "ibra-layer",
    data: ibra || [],
    getFillColor: [218, 93, 11, 30],
    getLineColor: [218, 93, 11, 200],

    pickable: true,
    filled: true,
    pointType: 'circle',
    lineWidthMinPixels: 1,
  })
}
