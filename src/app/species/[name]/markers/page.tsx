'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Grid, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { ArgaMap } from "@/app/components/mapping";

import React, { useState } from "react";
import { LoadOverlay } from "@/app/components/load-overlay";
import { AttributeValue } from "@/app/components/highlight-stack";
import { RecordItem } from "@/app/components/record-list";
import { PaginationBar } from "@/app/components/pagination";
import { usePathname } from "next/navigation";


const PAGE_SIZE = 5;

const GET_SPECIES = gql`
query SpeciesBarcodes($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    markers(page: $page, pageSize: $pageSize) {
      total
      records {
        sequenceId
        datasetName
        recordId
        accession
        materialSampleId
        sequencedBy
        targetGene
        releaseDate
      }
    }
  }
}`;

type Marker = {
  sequenceId: string,
  datasetName: string,
  recordId: string,
  accession?: string,
  materialSampleId?: string,
  sequencedBy?: string,
  targetGene: string,
  releaseDate?: string,
}

type QueryResults = {
  species: {
    markers: {
      total: number,
      records: Marker[],
    }
  },
};


function MarkerMap({ records }: { records : Marker[] | undefined }) {
  return (
    <Box pos="relative" h={560} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


function LabeledValue({ label, value }: { label: string, value: string|undefined }) {
  return (
    <Group spacing={20}>
      <Text weight={300} size="sm">{label}</Text>
      <Text weight={600}>{value}</Text>
    </Group>
  )
}

function RecordItemContent({ record }: { record: Marker }) {
  return (
      <Grid p={20}>
        <Grid.Col span={6}>
          <Stack spacing={5}>
            <SimpleGrid cols={2}>
            <LabeledValue label="Accession" value={record.recordId} />
            <LabeledValue label="Release date" value={record.releaseDate}/>
            </SimpleGrid>
            <Text size="xs" weight={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Gene name" value={record.targetGene} />
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Sequence length" value="No data" />
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Source molecule" value="No data"/>
        </Grid.Col>
      </Grid>
  )
}

function RecordList({ records }: { records: Marker[] }) {
  const path = usePathname();

  return (
    <>
      { records.map(record => (
        <RecordItem key={record.sequenceId} href={`${path}/${record.recordId}`}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </>
  )
}


export default function Markers({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  return (
    <Paper radius="lg" p={20} withBorder>
      <Title order={3}>Genetic markers and single loci</Title>

      <Grid py={20}>
        <Grid.Col span={8}>
          <Box pos="relative">
            <LoadOverlay visible={loading} />
            { data?.species.markers ? <RecordList records={data.species.markers.records} /> : null }
          </Box>

          <PaginationBar
            total={data?.species.markers.total}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MarkerMap records={data?.species.markers.records} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}