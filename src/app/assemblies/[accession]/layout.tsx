'use client';

import { gql, useQuery } from "@apollo/client";
import SpeciesHeader from "@/app/components/species-header";
import { Box } from "@mantine/core";


const GET_ASSEMBLY_SPECIES_NAME = gql`
query AssemblyDetails($accession: String) {
  assembly(accession: $accession) {
    canonicalName
  }
}`;

type QueryResults = {
  assembly: { canonicalName: string },
};


interface AssemblyLayoutProps {
  params: { accession: string },
  children: React.ReactNode,
}

export default function SpeciesLayout({ params, children }: AssemblyLayoutProps) {
  const { loading, error, data } = useQuery<QueryResults>(GET_ASSEMBLY_SPECIES_NAME, {
    variables: {
      accession: params.accession,
    },
  });

  return (
    <Box>
      <Box mb={40}>
        { data ? <SpeciesHeader canonicalName={data.assembly.canonicalName} /> : null }
      </Box>
      { children }
    </Box>
  )
}
