"use client";

import { Text } from "@mantine/core";
import { PopupMarker } from ".";
import { Coordinates, Specimen } from "../../type";


export function SpecimenMarker({ specimen }: { specimen: Specimen }) {
  const position = specimen.latitude && specimen.longitude && specimen as Coordinates;
  if (!position) return null;

  return (
    <PopupMarker position={position}>
      <Text>Type: {specimen.typeStatus}</Text>
      <Text>Catalog number: {specimen.catalogNumber}</Text>
      <Text>Institution: {specimen.institutionName}</Text>
    </PopupMarker>
  )
}

export function SpecimensLayer({ specimens }: { specimens: Specimen[] }) {
  return (
    <>
      { specimens.map(specimen => (<SpecimenMarker specimen={specimen} key={specimen.id} />)) }
    </>
  )
}
