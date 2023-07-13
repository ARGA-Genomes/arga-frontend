'use client';

import { gql, useQuery } from "@apollo/client";
import SpeciesHeader from "@/app/components/species-header";
import { Box } from "@mantine/core";


const GET_MARKER_SPECIES_NAME = gql`
query MarkerDetails($accession: String) {
  marker(accession: $accession) {
    canonicalName
  }
}`;

type QueryResults = {
  marker: { canonicalName: string },
};


interface MarkerLayoutProps {
  params: { accession: string },
  children: React.ReactNode,
}

export default function MarkerLayout({ params, children }: MarkerLayoutProps) {
  const { loading, error, data } = useQuery<QueryResults>(GET_MARKER_SPECIES_NAME, {
    variables: {
      accession: params.accession,
    },
  });

  return (
    <Box>
      <Box mb={40}>
        { data ? <SpeciesHeader canonicalName={data.marker.canonicalName} /> : null }
      </Box>
      { children }
    </Box>
  )
}
