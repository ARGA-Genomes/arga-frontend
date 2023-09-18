"use client";

import { Text } from "@mantine/core";
import { PopupMarker } from ".";
import { Coordinates} from "../../type";


interface SpecimenLocation {
  id: string,
  accession: string,
  typeStatus?: string,
  latitude?: number,
  longitude?: number,
  institutionName?: string,
};

export function SpecimenMarker({ specimen }: { specimen: SpecimenLocation }) {
  const position = specimen.latitude && specimen.longitude && specimen as Coordinates;
  if (!position) return null;

  return (
    <PopupMarker position={position}>
      <Text>Type: {specimen.typeStatus}</Text>
      <Text>Accession: {specimen.accession}</Text>
      <Text>Institution: {specimen.institutionName}</Text>
    </PopupMarker>
  )
}

export function SpecimensLayer({ specimens }: { specimens: SpecimenLocation[] }) {
  return (
    <>
      { specimens.map(specimen => (<SpecimenMarker specimen={specimen} key={specimen.id} />)) }
    </>
  )
}
