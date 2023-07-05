'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Grid, LoadingOverlay, Paper, Text, useMantineTheme} from "@mantine/core";
import { CommonGenome } from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import GenomeTable from "../commonGenomeRecordTable";


const GET_SPECIES = gql`
query SpeciesBarcodes($canonicalName: String) {
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
      associatedSequences {
        sequenceID
        genbankAccession
        markercode
        nucleotides
      }
    }
  }
}`;

type QueryResults = {
  species: {
    data: CommonGenome[]
  },
};


const PointMap = dynamic(() => import('../../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


function BarcodeDataSection({ data }: { data : QueryResults }) {
  const barcodeRecords = data.species.data.filter((record) => record.dataResource?.includes("BOLD"));
  const coordinates = barcodeRecords.map(record => record.coordinates);

  return (
    <Box pos="relative" h={300}>
      <PointMap coordinates={coordinates} borderRadius="16px 16px 0 0" />
    </Box>
  )
}


export function Barcode({ canonicalName }: { canonicalName: string }) {
  const theme = useMantineTheme();

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const barcodeRecords = data?.species.data.filter((record) => record.dataResource?.includes("BOLD"));

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />

      <Paper radius="lg" mt={15}>
        { data ? <BarcodeDataSection data={data}/> : null }
        { barcodeRecords ? <GenomeTable records={barcodeRecords} /> : null }
      </Paper>
    </Box>
  );
}
