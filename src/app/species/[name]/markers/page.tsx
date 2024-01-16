'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Grid, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { AnalysisMap, ArgaMap } from "@/components/mapping";

import React, { useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { Attribute } from "@/components/highlight-stack";
import { RecordItem, RecordList } from "@/components/record-list";
import { PaginationBar } from "@/components/pagination";
import { usePathname } from "next/navigation";
import { Marker } from "@/components/mapping/analysis-map";


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
        latitude
        longitude
      }
    }
  }
}`;

type Loci = {
  sequenceId: string,
  datasetName: string,
  recordId: string,
  accession?: string,
  materialSampleId?: string,
  sequencedBy?: string,
  targetGene: string,
  releaseDate?: string,
  latitude?: number,
  longitude?: number,
}

type QueryResults = {
  species: {
    markers: {
      total: number,
      records: Loci[],
    }
  },
};


function toMarker (color: [number, number, number, number], records?: Loci[]) {
  if (!records) return [];
  return records.map(r => {
    return {
      recordId: r.recordId || "unknown",
      latitude: r.latitude,
      longitude: r.longitude,
      color: color,
    }
  })
}

function MarkerMap({ records }: { records : Loci[] | undefined }) {
  const markers = toMarker([123, 161, 63, 220], records).filter(s => s.latitude) as Marker[];

  return (
    <Box pos="relative" h="100%">
      <AnalysisMap
        markers={markers}
        style={{ borderRadius: 'var(--mantine-radius-lg)', overflow: 'hidden' }}
      >
      </AnalysisMap>
    </Box>
  )
}


function LabeledValue({ label, value }: { label: string, value: string|undefined }) {
  return (
    <Group gap={20}>
      <Text fw={300} size="sm">{label}</Text>
      <Text fw={600}>{value}</Text>
    </Group>
  )
}

function RecordItemContent({ record }: { record: Loci }) {
  return (
      <Grid p={20}>
        <Grid.Col span={6}>
          <Stack gap={5}>
            <SimpleGrid cols={2}>
            <LabeledValue label="Accession" value={record.recordId} />
            <LabeledValue label="Release date" value={record.releaseDate}/>
            </SimpleGrid>
            <Text size="xs" fw={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Gene name" value={record.targetGene} />
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Sequence length" value="No data" />
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Source molecule" value="No data"/>
        </Grid.Col>
      </Grid>
  )
}

function LociList({ records }: { records: Loci[] }) {
  const path = usePathname();

  return (
    <RecordList>
      { records.map(record => (
        <RecordItem key={record.sequenceId} href={`${path}/${record.recordId}`}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </RecordList>
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
          <Box pos="relative" mih={568}>
            <LoadOverlay visible={loading} />
            { data?.species.markers ? <LociList records={data.species.markers.records} /> : null }
          </Box>
        </Grid.Col>
        <Grid.Col span={4} mih={568}>
          <MarkerMap records={data?.species.markers.records} />
        </Grid.Col>

        <Grid.Col span={8}>
          <PaginationBar
            total={data?.species.markers.total}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
