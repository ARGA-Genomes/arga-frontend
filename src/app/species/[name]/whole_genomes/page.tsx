'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Center, Drawer, Grid, Group, Paper, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import { AttributePill, AttributeValue, DataField } from "@/components/highlight-stack";
import { LoadOverlay } from "@/components/load-overlay";
import { PaginationBar } from "@/components/pagination";
import { ArgaMap } from "@/components/mapping";
import { RecordItem } from "@/components/record-list";
import { usePathname } from "next/navigation";
import { Eye } from "tabler-icons-react";
import Link from "next/link";


const PAGE_SIZE = 5;

const GET_REFERENCE_GENOME = gql`
query SpeciesReferenceGenome($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    referenceGenome {
      sequenceId
      dnaExtractId
      datasetName
      recordId
      accession
      materialSampleId
      name
      quality
      releaseType
      releaseDate
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
}`;


const GET_WHOLE_GENOMES = gql`
query SpeciesWholeGenomes($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    wholeGenomes(page: $page, pageSize: $pageSize) {
      total
      records {
        sequenceId
        datasetName
        recordId
        accession
        quality
        genomeSize
        releaseDate
      }
    }
  }
}`;

type WholeGenome = {
  id: string,
  dnaExtractId: string,
  datasetName: string,
  recordId: string,
  accession?: string,
  materialSampleId?: string,
  name?: string,
  quality?: string,
  releaseType?: string,
  releaseDate?: string,
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

type RefseqResults = {
  species: {
    referenceGenome?: WholeGenome,
  }
}


function LabeledValue({ label, value }: { label: string, value: string|undefined }) {
  return (
    <Group gap={20}>
      <Text fw={300} size="sm">{label}</Text>
      <Text fw={600}>{value}</Text>
    </Group>
  )
}


function RecordItemContent({ record }: { record: WholeGenome }) {
  return (
      <Grid p={20}>
        <Grid.Col span={8}>
          <Stack gap={5}>
            <SimpleGrid cols={2}>
            <LabeledValue label="Accession" value={record.recordId} />
            <LabeledValue label="Release date" value={record.releaseDate}/>
            </SimpleGrid>
            <Text size="xs" fw={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Genome size" value={Humanize.fileSize(record.genomeSize || 0)}/>
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Assembly level" value={record.quality}/>
        </Grid.Col>
      </Grid>
  )
}

function RecordList({ records }: { records: WholeGenome[] }) {
  const path = usePathname();

  return (
    <>
      { records.map((record, idx) => (
        <RecordItem key={idx} href={`${path}/${record.recordId}`}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </>
  )
}


function WholeGenomeMap({ records }: { records : WholeGenome[] | undefined }) {
    /* sx={theme => ({
    *       overflow: "hidden",
    *       borderRadius: theme.radius.lg,
    *     })} */
  return (
    <Box pos="relative" h={560}>
      <ArgaMap />
    </Box>
  )
}


function ReferenceGenome({ canonicalName }: { canonicalName: string }) {
  const path = usePathname();

  const { loading, error, data } = useQuery<RefseqResults>(GET_REFERENCE_GENOME, {
    variables: { canonicalName },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  return (
    <Paper p="lg" radius="lg" pos="relative" withBorder>
      <LoadOverlay visible={loading} />
      <Title order={3} mb={10}>Representative genome</Title>

      <Grid gutter={50}>
        <Grid.Col span={3}>
          <Stack gap={20}>
          <Table>
            <tbody>
            <tr>
              <td>Representation</td>
              <td><AttributePill value={data?.species.referenceGenome?.representation} /></td>
            </tr>
            <tr>
              <td>Release date</td>
              <td><DataField value={data?.species.referenceGenome?.releaseDate} /></td>
            </tr>
            <tr>
              <td>Assembly type</td>
              <td><AttributePill value={data?.species.referenceGenome?.assemblyType} /></td>
            </tr>
            <tr>
              <td>Accession</td>
              <td><DataField value={data?.species.referenceGenome?.accession} /></td>
            </tr>
            <tr>
              <td>Data source</td>
              <td><DataField value={data?.species.referenceGenome?.datasetName} /></td>
            </tr>
            </tbody>
          </Table>

          { data &&
            <Link href={`${path}/${data?.species.referenceGenome?.recordId}`}>
              <Center>
                <Button color="midnight" radius="md" leftSection={<Eye />}>view</Button>
              </Center>
            </Link>
          }
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <AssemblyStats genome={data?.species.referenceGenome} />
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function AssemblyStats({ genome }: { genome: WholeGenome | undefined }) {
  return (
    <Paper p="lg" radius="lg" pos="relative" withBorder>
      <LoadOverlay visible={false} />
      <Title order={5} mb={10}>Assembly statistics</Title>

      <SimpleGrid cols={5} spacing={50}>
        <Stack>
          <AttributeValue label="Genome size" value={Humanize.fileSize(genome?.genomeSize || 0)} />
          <AttributeValue label="Ungapped length" value={Humanize.fileSize(0)} />
          <AttributeValue label="BUSCO score" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of chromosones" value={undefined} />
          <AttributeValue label="Number of organelles" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of scaffolds" value={undefined} />
          <AttributeValue label="Scaffold N50" value={Humanize.fileSize(0)} />
          <AttributeValue label="Scaffold L50" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of contigs" value={undefined} />
          <AttributeValue label="Contig N50" value={Humanize.fileSize(0)} />
          <AttributeValue label="Contig L50" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="GC percentage" value={undefined} />
          <AttributeValue label="Genome coverage" value={undefined} />
          <AttributeValue label="Assembly level" value={genome?.quality} />
        </Stack>
      </SimpleGrid>
    </Paper>
  )
}


export default function WholeGenome({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

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
    <>
      <Stack gap={20}>
        <ReferenceGenome canonicalName={canonicalName} />

        <Paper p="lg" radius="lg" withBorder>
          <Title order={3} mb={10}>All genomes</Title>
          <Grid>
            <Grid.Col span={8}>
              <Box pos="relative">
                <LoadOverlay visible={loading} />
                { data?.species.wholeGenomes ? <RecordList records={data?.species.wholeGenomes.records} /> : null }
                <PaginationBar
                  total={data?.species.wholeGenomes.total}
                  page={page}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={4}>
              <WholeGenomeMap records={data?.species.wholeGenomes.records} />
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>

      <Drawer
        opened={mapExpand}
        onClose={() => setMapExpand(false)}
        opacity={0.55}
        zIndex={2000}
        position="right"
        size="75%"
        withCloseButton={false}
      >
        <WholeGenomeMap records={data?.species.wholeGenomes.records} />
      </Drawer>
    </>
  );
}
