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
query SpeciesComponents($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    genomicComponents(page: $page, pageSize: $pageSize) {
      total
      records {
        sequenceId
        datasetName
        recordId
        accession
        latitude
        longitude
        materialSampleId
        sequencedBy
        depositedBy
        estimatedSize
        releaseDate
        dataType
      }
    }
  }
}`;

type GenomicComponent = {
  sequenceId: string,
  datasetName: string,
  recordId: string,
  accession?: string,
  latitude?: number,
  longitude?: number,
  materialSampleId?: string,
  sequencedBy?: string,
  depositedBy?: string,
  estimatedSize?: string,
  releaseDate?: string,
  dataType?: string,
}

type QueryResults = {
  species: {
    genomicComponents: {
      total: number,
      records: GenomicComponent[],
    }
  },
};


function toMarker (color: [number, number, number, number], records?: GenomicComponent[]) {
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

function MarkerMap({ records }: { records : GenomicComponent[] | undefined }) {
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

function RecordItemContent({ record }: { record: GenomicComponent }) {
  return (
      <Grid p={20}>
        <Grid.Col span={6}>
          <Stack gap={5}>
            <LabeledValue label="Accession" value={record.accession} />
            <Text size="xs" fw={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Library type" value={record.dataType} />
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Publication date" value={record.releaseDate} />
        </Grid.Col>
        <Grid.Col span={2}>
          <Attribute label="Source" value="No data"/>
        </Grid.Col>
      </Grid>
  )
}

function GenomicComponentList({ records }: { records: GenomicComponent[] }) {
  const path = usePathname();

  return (
    <RecordList>
      { records.map(record => (
        <RecordItem key={record.sequenceId} href={`${path}/${encodeURIComponent(record.recordId)}`}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </RecordList>
  )
}


export default function GenomicComponents({ params }: { params: { name: string } }) {
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
      <Title order={3}>Genomic components</Title>

      <Grid py={20}>
        <Grid.Col span={8}>
          <Box pos="relative" mih={568}>
            <LoadOverlay visible={loading} />
            {data?.species.genomicComponents ? <GenomicComponentList records={data.species.genomicComponents.records} /> : null }
          </Box>
        </Grid.Col>
        <Grid.Col span={4} mih={568}>
          <MarkerMap records={data?.species.genomicComponents.records} />
        </Grid.Col>

        <Grid.Col span={8}>
          <PaginationBar
            total={data?.species.genomicComponents.total}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
