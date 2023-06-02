'use client';

import {Grid, Group, Modal, Paper, Text} from "@mantine/core";
import { QueryResults} from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import {GenomeRecords} from "@/app/species/[name]/genomeRecords";

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
          <h2>Barcode Summary Stats</h2>
          <Text color="white" style={{ padding: 15 }}>No of records: {barcodeRecords.length}</Text>
        </Grid.Col>
        <Grid.Col span="auto">
          <PointMap coordinates={coordinates}/>
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col>
          <Text style={{padding: 25}} color="white">Records</Text><GenomeRecords data={barcodeRecords} expandable={true}/>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export function Barcode({ data }: { data : QueryResults }) {

  return (
    <>
      <Grid p={40}>
        <Grid.Col span="auto">
          <BarcodeDataSection data={data}/>
        </Grid.Col>
      </Grid>
    </>);
}
