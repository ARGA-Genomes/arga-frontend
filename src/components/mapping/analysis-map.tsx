"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import classes from "./analysis-map.module.css";

import { Map } from "@vis.gl/react-maplibre";

import DeckGL, { GeoJsonLayer, MapView, PickingInfo, ScatterplotLayer } from "deck.gl";
import { useState } from "react";
import { GeoJSON } from "geojson";
import { gql, useQuery } from "@apollo/client";
import { Text, Paper, Center } from "@mantine/core";
import { Layer } from "@/app/type";

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

interface QueryResults {
  maps: {
    ibra: string;
    imcraProvincial: string;
    imcraMesoscale: string;
  };
}

interface Regions {
  ibra: string[];
  imcra: string[];
}

export interface Marker<T> {
  latitude: number;
  longitude: number;
  tooltip?: string;
  color?: [number, number, number, number] | [number, number, number];
  type?: Layer;
  renderLayer?: number;
  data?: T;
}

interface AnalysisMapProps<T> {
  regions?: Regions;
  markers?: Marker<T>[];
  children?: React.ReactNode;
  style?: Partial<CSSStyleDeclaration>;
  initialPosition?: [number, number];
  initialZoom?: number;
  onMarkerClick?(marker: T): void;
}

export default function AnalysisMap<T>({
  regions,
  markers,
  children,
  style,
  initialPosition,
  initialZoom,
  onMarkerClick,
}: AnalysisMapProps<T>) {
  const [tolerance, _setTolerance] = useState(0.01);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);

  const { data } = useQuery<QueryResults>(GET_GEOMETRY, {
    variables: {
      regions: regions ? [...regions.ibra, ...regions.imcra] : [],
      tolerance: tolerance,
    },
  });

  const bioRegions = {
    ibra: data && (JSON.parse(data.maps.ibra) as GeoJSON),
    imcra: data && (JSON.parse(data.maps.imcraProvincial) as GeoJSON),
    selected: selectedRegion,
  };

  const view = new MapView({ repeat: true });

  const getTooltip = (info: PickingInfo): string => {
    return (
      info.object && {
        html: `${info.object.properties?.name || info.object.tooltip}`,
        style: {
          backgroundColor: `rgba(${info.object.color || [0, 0, 0, 256]})`,
          color: "white",
          borderRadius: "5px",
        },
      }
    );
  };

  const onHover = (info: PickingInfo) => {
    if (info.object?.properties) {
      setSelectedRegion(info.object?.properties?.name);
    } else {
      setSelectedRegion(undefined);
    }
  };

  const onClick = (info: PickingInfo) => {
    if (onMarkerClick && info.object?.data) {
      onMarkerClick(info.object.data);
    }
  };

  const hasData = markers && markers.length > 0;

  return (
    <>
      {!hasData && (
        <Paper className={classes.emptyMapOverlay}>
          <Center>
            <Text className={classes.emptyMapText}>no data</Text>
          </Center>
        </Paper>
      )}
      <DeckGL
        views={view}
        initialViewState={{
          latitude: initialPosition?.[0] || DEFAULT_POSITION[0],
          longitude: initialPosition?.[1] || DEFAULT_POSITION[1],
          zoom: initialZoom || 3.1,
        }}
        layers={[bioRegionLayers(bioRegions), markerPlotLayer(markers ?? [])]}
        getTooltip={getTooltip}
        onHover={onHover}
        onClick={onClick}
        controller={true}
        style={style}
      >
        <Map
          key="map"
          reuseMaps
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          id="ausmap"
          initialViewState={{
            latitude: DEFAULT_POSITION[0],
            longitude: DEFAULT_POSITION[1],
            zoom: 3.1,
          }}
        >
          {children}
        </Map>
      </DeckGL>
    </>
  );
}

interface BioRegions {
  ibra?: GeoJSON;
  imcra?: GeoJSON;
  selected?: string;
}

function bioRegionLayers(regions: BioRegions) {
  const ibraColor: [number, number, number, number] = [254, 195, 55, 70];
  const ibraHover: [number, number, number, number] = [254, 195, 55, 140];

  const imcraColor: [number, number, number, number] = [88, 163, 157, 70];
  const imcraHover: [number, number, number, number] = [88, 163, 157, 140];

  const ibra = new GeoJsonLayer({
    id: "ibra-layer",
    data: regions.ibra || [],
    getFillColor: (d) => (d.properties?.name === regions.selected ? ibraHover : ibraColor),
    getLineColor: [254, 195, 55, 200],
    pickable: true,
    filled: true,
    pointType: "circle",
    lineWidthMinPixels: 1,
  });

  const imcra = new GeoJsonLayer({
    id: "imcra-layer",
    data: regions.imcra || [],
    getFillColor: (d) => (d.properties?.name === regions.selected ? imcraHover : imcraColor),
    getLineColor: [88, 163, 157, 200],
    pickable: true,
    filled: true,
    pointType: "circle",
    lineWidthMinPixels: 1,
  });

  return [ibra, imcra];
}

function markerPlotLayer<T>(markers: Marker<T>[]) {
  // sort order isn't that important for a scatterplot but because we don't support
  // adding multiple scatter plots on the map we sort them with an internal render layer
  // to make sure some markers are rendered last so that they are more visible
  markers.sort(({ renderLayer: a = 0 }, { renderLayer: b = 0 }) => {
    if (a < b) return 1;
    else if (a > b) return -1;
    else return 0;
  });

  return new ScatterplotLayer({
    id: "scatter-plot",
    data: markers,
    radiusScale: 20,
    radiusMinPixels: 5,
    getPosition: (d: Marker<T>) => [d.longitude, d.latitude],
    getFillColor: (d: Marker<T>) => d.color ?? [0, 0, 0],
    getRadius: 1,
    pickable: true,
  });
}
