'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Grid, LoadingOverlay, Paper, Text} from "@mantine/core";
import { CommonGenome } from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import GenomeTable from "../commonGenomeRecordTable";


const GET_SPECIES = gql`
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
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={8}>
          <Text color="white" style={{ padding: 15 }}>No of records: {barcodeRecords.length}</Text>
        </Grid.Col>
        <Grid.Col span="auto">
          <PointMap coordinates={coordinates}/>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


export function Barcode({ canonicalName }: { canonicalName: string }) {
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
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      { data ? <BarcodeDataSection data={data}/> : null }
      <Paper radius="lg" py={25} mt={15}>
        { barcodeRecords ? <GenomeTable records={barcodeRecords} /> : null }
      </Paper>
    </Box>
  );
}
