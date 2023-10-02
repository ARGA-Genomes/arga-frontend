'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Paper, Text } from '@mantine/core';
import { CommonGenome } from "@/app/type";
import GenomeTable from "../commonGenomeRecordTable";
import { LoadOverlay } from "@/components/load-overlay";


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


export default function Resources({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

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
      <LoadOverlay visible={loading} />

      <Text style={{padding: 25}} c="white">All Genome Sequence Records</Text>
      <Paper radius="lg" py={25}>
        { data ? <GenomeTable records={data.species.data} /> : null }
      </Paper>
    </Box>
  );
}
