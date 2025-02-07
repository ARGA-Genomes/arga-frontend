"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import classes from "./analysis-map.module.css";

/* import Map from "react-map-gl/maplibre"; */
import { Map } from "@vis.gl/react-maplibre";

import DeckGL, { GeoJsonLayer, MapView, PickingInfo, ScatterplotLayer } from "deck.gl";
import { useState, useEffect } from "react";
import { GeoJSON } from "geojson";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
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

export interface Marker {
  recordId: string;
  latitude: number;
  longitude: number;
  color: [number, number, number, number];
  type?: Layer;
}

interface AnalysisMapProps {
  regions?: Regions;
  markers?: Marker[];
  speciesName?: string;
  children?: React.ReactNode;
  style?: Partial<CSSStyleDeclaration>;
  initialPosition?: [number, number];
  initialZoom?: number;
}

export default function AnalysisMap({
  regions,
  markers,
  speciesName,
  children,
  style,
  initialPosition,
  initialZoom,
}: AnalysisMapProps) {
  const [tolerance, _setTolerance] = useState(0.01);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [selectedMarker, setSelectedMarker] = useState<string | undefined>(undefined);
  const [clickedMarker, setClickedMarker] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupLink, setPopupLink] = useState(``);

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

  const specimens = {
    markers: markers || [],
    selected: selectedMarker,
  };

  const view = new MapView({ repeat: true });

  const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
      const setFromEvent = (e: { clientX: number; clientY: number }) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", setFromEvent);

      return () => {
        window.removeEventListener("mousemove", setFromEvent);
      };
    }, []);
    return position;
  };

  const getTooltip = (info: PickingInfo): string => {
    return (
      info.object && {
        html: `${info.object.properties?.name || info.object.recordId}`,
        style: {
          backgroundColor: `rgba(${info.object.color || [0, 0, 0, 256]})`,
          color: "white",
          borderRadius: "5px",
        },
      }
    );
  };
  const position = useMousePosition();

  const onHover = (info: PickingInfo) => {
    if (info.object?.properties) {
      setSelectedRegion(info.object?.properties?.name);
    } else if (info.object?.recordId) {
      setSelectedMarker(info.object?.recordId);
    } else {
      setSelectedRegion(undefined);
      setSelectedMarker(undefined);
    }
  };

  const onClick = (info: PickingInfo) => {
    if (info.object?.recordId) {
      setClickedMarker(info.object?.recordId);
      setIsOpen(true);
      setPopupPosition(position);
      getPopUpLink(info.object.type, speciesName, info.object?.recordId);
    } else {
      setIsOpen(false);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const getPopUpLink = (type: Layer, speciesName: string | undefined, clickedMarker: string | undefined) => {
    if (type === Layer.Specimens) {
      setPopupLink(`/species/${speciesName}/specimens/${clickedMarker}`);
    } else if (type === Layer.Loci) {
      setPopupLink(`/species/${speciesName}/markers/${clickedMarker}`);
    } else if (type === Layer.WholeGenome) {
      setPopupLink(`/species/${speciesName}/whole_genomes/${clickedMarker}`);
    } else {
      setPopupLink(``);
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
        layers={[bioRegionLayers(bioRegions), specimenPlotLayer(specimens)]}
        getTooltip={getTooltip}
        onHover={onHover}
        onClick={onClick}
        onViewStateChange={closePopup}
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

      {isOpen && (
        <Paper
          h={50}
          w={300}
          radius={5}
          p={10}
          style={{
            zIndex: 200,
            display: isOpen ? "table" : "hidden",
            position: "fixed",
            left: popupPosition.x,
            top: popupPosition.y,
            alignContent: "center",
          }}
          onClick={closePopup}
        >
          View details: &nbsp;
          <Link href={popupLink}>{clickedMarker}</Link>
        </Paper>
      )}
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

interface Specimens {
  markers: Marker[];
  selected?: string;
}

function specimenPlotLayer({ markers }: Specimens) {
  return new ScatterplotLayer({
    id: "scatter-plot",
    data: markers,
    radiusScale: 20,
    radiusMinPixels: 5,
    getPosition: (d: Marker) => [d.longitude, d.latitude],
    getFillColor: (d: Marker) => d.color,
    getRadius: 1,
    pickable: true,
  });
}
