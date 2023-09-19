'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Drawer, Grid, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { AttributeValue } from "@/app/components/highlight-stack";
import { LoadOverlay } from "@/app/components/load-overlay";
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/app/components/pagination";
import { ArgaMap } from "@/app/components/mapping";
import { RecordItem } from "@/app/components/record-list";


const PAGE_SIZE = 5;

const GET_WHOLE_GENOMES = gql`
query SpeciesWholeGenomes($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    wholeGenomes(page: $page, pageSize: $pageSize) {
      total
      records {
        sequenceId
        dnaExtractId
        datasetName
        accession
        materialSampleId
        name
        quality
        releaseType
        representation
        versionStatus
        estimatedSize
        excludedFromRefseq
        assemblyType
        genomeSize
        dataType
        sequencedBy
        assembledBy
        annotatedBy
        depositedBy
      }
    }
  }
}`;

type WholeGenome = {
  id: string,
  dnaExtractId: string,
  accession: string,
  datasetName: string,
  materialSampleId?: string,
  name?: string,
  quality?: string,
  releaseType?: string,
  representation?: string,
  versionStatus?: string,
  estimatedSize?: number,
  excludedFromRefseq?: string,
  assemblyType?: string,
  genomeSize?: number,
  dataType?: string,
  sequencedBy?: string,
  assembledBy?: string,
  annotatedBy?: string,
  depositedBy?: string,
  coordinates: {
    latitude: number,
    longitude: number,
  },
}

type Species = {
  wholeGenomes: {
    total: number,
    records: WholeGenome[],
  },
}

type QueryResults = {
  species: Species,
};


function LabeledValue({ label, value }: { label: string, value: string|undefined }) {
  return (
    <Group spacing={20}>
      <Text weight={300} size="sm">{label}</Text>
      <Text weight={600}>{value}</Text>
    </Group>
  )
}


function RecordItemContent({ record }: { record: WholeGenome }) {
  return (
      <Grid p={20}>
        <Grid.Col span={8}>
          <Stack spacing={5}>
            <SimpleGrid cols={2}>
            <LabeledValue label="Accession" value={record.accession} />
            <LabeledValue label="Release date" value="No data"/>
            </SimpleGrid>
            <Text size="xs" weight={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Genome size" value={Humanize.fileSize(record.genomeSize || 0)}/>
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Assmebly level" value={record.quality}/>
        </Grid.Col>
      </Grid>
  )
}

function RecordList({ records }: { records: WholeGenome[] }) {
  return (
    <>
      { records.map(record => (
        <RecordItem key={record.id}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </>
  )
}


function WholeGenomeMap({ records }: { records : WholeGenome[] | undefined }) {
  return (
    <Box pos="relative" h={560} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


export function WholeGenome({ canonicalName }: { canonicalName: string }) {
  const [mapExpand, setMapExpand] = useState(false);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_WHOLE_GENOMES, {
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
    <Container maw={MAX_WIDTH} py={20}>
      <Stack spacing={5}>
        <Title order={3}>All genomes</Title>
        <Grid>
          <Grid.Col span={8}>
            <Box pos="relative">
              <LoadOverlay visible={loading} />
              { data?.species.wholeGenomes ? <RecordList records={data?.species.wholeGenomes.records} /> : null }
            </Box>

            <PaginationBar
              total={data?.species.wholeGenomes.total}
              page={page}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <WholeGenomeMap records={data?.species.wholeGenomes.records} />
          </Grid.Col>
        </Grid>
      </Stack>

      <Drawer
        opened={mapExpand}
        onClose={() => setMapExpand(false)}
        overlayOpacity={0.55}
        overlayBlur={3}
        zIndex={2000}
        position="right"
        size="75%"
        withCloseButton={false}
      >
        <WholeGenomeMap records={data?.species.wholeGenomes.records} />
      </Drawer>
    </Container>
  );
}
