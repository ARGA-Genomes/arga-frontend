"use client";

import 'maplibre-gl/dist/maplibre-gl.css';

import { Map } from 'react-map-gl/maplibre';
import DeckGL, { BitmapLayer, GeoJsonLayer, MapView, ScatterplotLayer, TileLayer } from 'deck.gl/typed';
import { useState, useEffect } from 'react';
import { GeoJSON } from 'geojson';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Modal, Paper } from '@mantine/core';
import { Layer } from '@/app/type';

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
  type: Layer
}


interface AnalysisMapProps {
  regions?: Regions,
  markers?: Marker[],
  speciesName?: string,
  children?: React.ReactNode,
  style?: Partial<CSSStyleDeclaration>,
  initialPosition?: [number, number],
  initialZoom?: number,
}

export default function AnalysisMap(this: any, { regions, markers, speciesName, children, style, initialPosition, initialZoom }: AnalysisMapProps) {
  const [tolerance, setTolerance] = useState(0.01);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined)
  const [selectedMarker, setSelectedMarker] = useState<string | undefined>(undefined)
  const [clickedMarker, setClickedMarker] = useState<string | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupLink, setPopupLink] = useState(``)


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

  const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
      const setFromEvent = (e: { clientX: any; clientY: any; }) => setPosition({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", setFromEvent);

      return () => {
        window.removeEventListener("mousemove", setFromEvent);
      };
    }, []);
    return position;
  };

  const getTooltip = ({ object }: { object?: any }): string => {
    return (
      object && {
        html: `${object?.properties?.name || object?.recordId}`,
        style: {
          backgroundColor: `rgba(${object?.color || [0, 0, 0, 256]})`,
          color: 'white',
          borderRadius: '5px'
        }
      }
    );
  }
  const position = useMousePosition()

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

  const onClick = ({ object }: { object?: any }) => {
    if (object && object.recordId) {
      setClickedMarker(object?.recordId);
      setIsOpen(true);
      setPopupPosition(position)
      getPopUpLink(object.type, speciesName, object?.recordId)
    }else {
    setIsOpen(false);
    }
  }

  const closePopup =() => {
    setIsOpen(false);
  }

  const getPopUpLink = (type: Layer, speciesName: string | undefined, clickedMarker: string | undefined) => {
    if (type === Layer.Specimens) {
      setPopupLink( `/species/${speciesName}/specimens/${clickedMarker}`)
    } else if (type ===Layer.Loci) {
      setPopupLink( `/species/${speciesName}/markers/${clickedMarker}`)
    } else if(type === Layer.WholeGenome) {
      setPopupLink( `/species/${speciesName}/whole_genomes/${clickedMarker}`)
    }
    else {setPopupLink(``)}
  }


  return (
    <>
      <DeckGL
        views={view}
        initialViewState={{
          latitude: DEFAULT_POSITION[0],
          longitude: DEFAULT_POSITION[1],
          zoom: initialZoom || 3.7,
        }}
        layers={[
          bioRegionLayers(bioRegions),
          specimenPlotLayer(specimens),
        ]}
        getTooltip={getTooltip}
        onHover={onHover}
        onClick={onClick}
        onViewStateChange={closePopup}
        controller={true}
      >
        <Map
          key="map"
          reuseMaps
          mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
          id="ausmap"
          initialViewState={{
            latitude: DEFAULT_POSITION[0],
            longitude: DEFAULT_POSITION[1],
            zoom: 3.7,
          }}
        >
          {children}
        </Map>
      </DeckGL>
      {/* Use either the modal or the paper div for popup */}
      {/* <Modal opened={isOpen} onClose={() => setIsOpen(false)} centered>
        View specimen details: &nbsp;
        <Link href={`/species/${speciesName}/specimens/${clickedMarker}`}>{clickedMarker}
        </Link>
      </Modal> */}
      {isOpen && <Paper h={50} w={300} radius={5} p={10} 
      style={{zIndex:200, display: isOpen? 'table': 'hidden', position: 'fixed', left: popupPosition.x, top: popupPosition.y, alignContent: 'center'}} onClick={closePopup}>
        View specimen details: &nbsp;
        <Link href={popupLink}>{clickedMarker}
        </Link>
      </Paper>}
    </>

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
