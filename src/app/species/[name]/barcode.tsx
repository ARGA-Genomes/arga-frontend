'use client';

import {Grid, Paper, Text} from "@mantine/core";
import { QueryResults} from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import GenomeTable from "@/app/species/[name]/commonGenomeRecordTable";

const PointMap = dynamic(() => import('../../components/point-map'), {
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

export function Barcode({ data }: { data : QueryResults }) {

  const barcodeRecords = data.species.data.filter((record) => record.dataResource?.includes("BOLD"));

  return (
    <>
      <BarcodeDataSection data={data}/>
      <Paper radius="lg" py={25} mt={15}>
        <GenomeTable records={barcodeRecords} />
      </Paper>
    </>);
}
