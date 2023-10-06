"use client";

import 'maplibre-gl/dist/maplibre-gl.css';

import Map from 'react-map-gl/maplibre';
import DeckGL, { BitmapLayer, GeoJsonLayer, MapView, ScatterplotLayer, TileLayer } from 'deck.gl/typed';
import { useState } from 'react';
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

export interface Marker {
  recordId: string,
  latitude: number,
  longitude: number,
  color: [number, number, number, number],
}


interface AnalysisMapProps {
  regions?: Regions,
  markers?: Marker[],
  children?: React.ReactNode,
  style?: Partial<CSSStyleDeclaration>,
}

export default function AnalysisMap({ regions, markers, children, style }: AnalysisMapProps) {
  const [tolerance, setTolerance] = useState(0.01);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined)
  const [selectedMarker, setSelectedMarker] = useState<string | undefined>(undefined)

  const { loading, error, data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions ? [...regions.ibra, ...regions.imcra] : [],
      tolerance: tolerance,
    },
  });

  const bioRegions = {
    ibra: data && JSON.parse(data.maps.ibra) as GeoJSON,
    imcra: data && JSON.parse(data.maps.imcraProvincial) as GeoJSON,
    selected: selectedRegion,
  }

  const specimens = {
    markers: markers || [],
    selected: selectedMarker,
  }

  const view = new MapView({ repeat: true });

  const getTooltip = ({ object }: { object?: any }): string => {
    return object?.properties?.name || object?.recordId;
  }

  const onHover = ({ object }: { object?: any }) => {
    if (object?.properties) {
      setSelectedRegion(object?.properties?.name);
    }
    else if (object?.recordId) {
      setSelectedMarker(object?.recordId);
    }
    else {
      setSelectedRegion(undefined);
      setSelectedMarker(undefined);
    }
  }

  return (
    <DeckGL
      views={view}
      initialViewState={{
        latitude: DEFAULT_POSITION[0],
        longitude: DEFAULT_POSITION[1],
        zoom: 3.7,
        }}
      layers={[
        bioRegionLayers(bioRegions),
        specimenPlotLayer(specimens),
      ]}
      getTooltip={getTooltip}
      onHover={onHover}
      controller={true}
      style={style}
    >
      <Map
        reuseMaps
        mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      />
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
  selected?: string
}

function bioRegionLayers(regions: BioRegions) {
  const ibraColor: [number, number, number, number] = [254, 195, 55, 70];
  const ibraHover: [number, number, number, number] = [254, 195, 55, 140];

  const imcraColor: [number, number, number, number] = [88, 163, 157, 70];
  const imcraHover: [number, number, number, number] = [88, 163, 157, 140];

  const ibra = new GeoJsonLayer({
    id: "ibra-layer",
    data: regions.ibra || [],
    getFillColor: d => d.properties?.name === regions.selected ? ibraHover : ibraColor,
    getLineColor: [254, 195, 55, 200],
    pickable: true,
    filled: true,
    pointType: 'circle',
    lineWidthMinPixels: 1,
  });

  const imcra = new GeoJsonLayer({
    id: "imcra-layer",
    data: regions.imcra || [],
    getFillColor: d => d.properties?.name === regions.selected ? imcraHover : imcraColor,
    getLineColor: [88, 163, 157, 200],
    pickable: true,
    filled: true,
    pointType: 'circle',
    lineWidthMinPixels: 1,
  });

  return [ibra, imcra];
}


interface Specimens {
  markers: Marker[],
  selected?: string,
}

function specimenPlotLayer({ markers, selected }: Specimens) {
  return new ScatterplotLayer({
    id: 'scatter-plot',
    data: markers,
    radiusScale: 20,
    radiusMinPixels: 5,
    getPosition: (d: Marker) => [d.longitude, d.latitude],
    getFillColor: (d: Marker) => d.color,
    getRadius: 1,
    pickable: true,
  })
}
