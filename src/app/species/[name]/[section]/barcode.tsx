'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Button, Collapse, Container, Grid, Group, LoadingOverlay, Paper, SimpleGrid, Stack, Table, Text, ThemeIcon, Title, useMantineTheme} from "@mantine/core";

import { Coordinates } from "@/app/type";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import {ArrowUpRight, License as IconLicense, Link as IconLink, Pencil as IconPencil} from "tabler-icons-react";
import { LoadOverlay } from "@/app/components/load-overlay";
import { MAX_WIDTH } from "@/app/constants";
import { AttributeValue } from "@/app/components/highlight-stack";
import { RecordItem } from "@/app/components/record-list";
import { PaginationBar } from "@/app/components/pagination";


const PAGE_SIZE = 5;

const GET_SPECIES = gql`
query SpeciesBarcodes($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    markers(page: $page, pageSize: $pageSize) {
      total
      records {
        sequenceId
        datasetName
        accession
        materialSampleId
        sequencedBy
        targetGene
      }
    }
  }
}`;

type Marker = {
  sequenceId: string,
  datasetName: string,
  accession: string,
  materialSampleId?: string,
  sequencedBy?: string,
  targetGene: string,
}

type QueryResults = {
  species: {
    markers: {
      total: number,
      records: Marker[],
    }
  },
};


const PointMap = dynamic(() => import('../../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


function BarcodeDataSection({ data }: { data : QueryResults }) {
  let coordinates = [] as Coordinates[];
    /* const coordinates = data.markers.map(record => record.coordinates); */

  return (
    <Box pos="relative" h={300}>
      <PointMap coordinates={coordinates} borderRadius="16px 16px 0 0" />
    </Box>
  )
}


interface RecordFieldProps {
  label: string,
  value?: string | string[] | Object,
  icon: React.ReactNode,
}

function RecordField(props: RecordFieldProps) {
  return (
    <Group position="left">
      <ThemeIcon variant='light' size={28} radius='xl'>
        { props.icon }
      </ThemeIcon>
      <Box>
        <Text color='dimmed' size='xs'>{props.label}</Text>
        <Text size='sm' weight='bold' c={props.value ? "black" : "dimmed"}>
          { props.value?.toString() || "Not Supplied"}
        </Text>
      </Box>
    </Group>
  )
}


interface MarkerRecordProps {
  record: Marker,
  selected: boolean,
  onSelected: (record: Marker) => void;
}

function MarkerRecord(props: MarkerRecordProps) {
  return (
    <>
      <tr
        style={{ cursor: 'pointer' }}
        onClick={() => props.onSelected(props.record)}>
        <td style={{ paddingLeft: 25 }}>{props.record.accession}</td>
        <td>{props.record.datasetName}</td>
        <td>{props.record.sequencedBy || "Not Supplied"}</td>
        <td>{props.record.targetGene}</td>
        <td align="right">
          <Link href={`/markers/${props.record.accession}`}>
            <Button mr={20} size="xs" variant="light" rightIcon={<ArrowUpRight size={16} />}>All details</Button>
          </Link>
        </td>
      </tr>
    </>
  )
}


function MarkerTable({ records }: { records: Marker[] }) {
  const [selected, handler] = useListState<Marker>([]);

  function toggle(record: Marker) {
    let idx = selected.indexOf(record);
    if (idx >= 0) {
      handler.remove(idx);
    } else {
      handler.append(record);
    }
  }

  return (
    <Table highlightOnHover>
      <thead>
      <tr>
        <td style={{ paddingLeft: 25 }}>Accession</td>
        <td>Dataset</td>
        <td>Sequenced by</td>
        <td>Target gene</td>
        <td></td>
      </tr>
      </thead>
      <tbody>
        { records?.map((record, idx) => {
           return <MarkerRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={idx}
          />
      })}
      </tbody>
    </Table>
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
            <LabeledValue label="Accession" value={record.accession} />
            <LabeledValue label="Release date" value="No data"/>
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
  return (
    <>
      { records.map(record => (
        <RecordItem key={record.sequenceId}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </>
  )
}



export function Markers({ canonicalName }: { canonicalName: string }) {
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
    <Container maw={MAX_WIDTH} py={20}>
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
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}
