'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, LoadingOverlay, Paper, Text } from '@mantine/core';
import { CommonGenome } from "@/app/type";
import GenomeTable from "../commonGenomeRecordTable";


const GET_RESOURCES = gql`
query SpeciesResources($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    data {
      canonicalName
      type
      dataResource
      recordedBy
      license
      provenance
      eventDate
      accession
      accessionUri
      refseqCategory
      coordinates {
        latitude
        longitude
      }
    }
  }
}`;

type QueryResults = {
  species: {
    data: CommonGenome[]
  },
};


export function Resources({ canonicalName }: { canonicalName: string }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_RESOURCES, {
    variables: {
      canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      <Text style={{padding: 25}} color="white">All Genome Sequence Records</Text>
      <Paper radius="lg" py={25}>
        { data ? <GenomeTable records={data.species.data} /> : null }
      </Paper>
    </Box>
  );
}
