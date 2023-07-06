'use client';

import { gql, useQuery } from "@apollo/client";
import SpeciesHeader from "@/app/components/species-header";
import { Box } from "@mantine/core";


const GET_SPECIMEN_SPECIES_NAME = gql`
query SpecimenNameDetails($specimenId: String) {
  specimen(specimenId: $specimenId) {
    canonicalName
  }
}`;

type QueryResults = {
  specimen: { canonicalName: string },
};


interface SpecimenLayoutProps {
  params: { uuid: string },
  children: React.ReactNode,
}

export default function SpecimenLayout({ params, children }: SpecimenLayoutProps) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMEN_SPECIES_NAME, {
    variables: {
      specimenId: params.uuid,
    },
  });

  return (
    <Box>
      <Box mb={40}>
        { data ? <SpeciesHeader canonicalName={data.specimen.canonicalName} /> : null }
      </Box>
      { children }
    </Box>
  )
}
