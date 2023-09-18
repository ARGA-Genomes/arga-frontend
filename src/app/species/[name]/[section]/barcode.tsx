'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Button, Collapse, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, useMantineTheme} from "@mantine/core";

import { Coordinates } from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import {ArrowUpRight, License as IconLicense, Link as IconLink, Pencil as IconPencil} from "tabler-icons-react";


const GET_SPECIES = gql`
query SpeciesBarcodes($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    markers {
      sequenceId
      datasetName
      accession
      materialSampleId
      sequencedBy
      targetGene
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
    markers: Marker[],
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

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />

      <Paper radius="lg" mt={0} pb={20}>
        { data ? <BarcodeDataSection data={data}/> : null }
        { data?.species.markers ? <MarkerTable records={data.species.markers} /> : null }
      </Paper>
    </Box>
  );
}
