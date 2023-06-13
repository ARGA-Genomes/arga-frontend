'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, LoadingOverlay, Text } from '@mantine/core';
import {GenomicData} from "@/app/type";
import {GenomeRecords} from "./genomeRecords";


const GET_RESOURCES = gql`
query Species($canonicalName: String) {
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
    data: GenomicData[]
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
      <Text style={{padding: 25}} color="white">Genome Sequence Records</Text>
      { data ? <GenomeRecords data={data.species.data} expandable={false}/> : null }
    </Box>
  );
}
