'use client';

import { gql, useQuery } from "@apollo/client";
import {Box, Button, Collapse, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, useMantineTheme} from "@mantine/core";

import { CommonGenome, Coordinates, Marker } from "@/app/type";
import dynamic from "next/dynamic";
import React from "react";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import {ArrowUpRight, License as IconLicense, Link as IconLink, Pencil as IconPencil} from "tabler-icons-react";


const GET_SPECIES = gql`
query SpeciesBarcodes($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    markers {
      id
      accession
      basepairs
      fastaUrl
      sourceUrl
      gbAcs
      markerCode
      materialSampleId
      nucleotide
      recordedBy
      shape
      type
      version
    }
  }
}`;

type QueryResults = {
  species: {
    markers: Marker[],
    data: CommonGenome[]
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


function MarkerDetails({ record }: { record: Marker }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <RecordField label="GB Acs" value={record.gbAcs} icon={<IconLink />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <RecordField label="Marker code" value={record.markerCode} icon={<IconLink />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <RecordField label="Material sample ID" value={record.materialSampleId} icon={<IconLink />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <RecordField label="Recorded by" value={record.recordedBy} icon={<IconLink />} />
      </Grid.Col>

      { record.nucleotide &&
        <><div style={{display:"-webkit-flex"}}>
          <Grid.Col span={6}>
            <Group position="left">
              <ThemeIcon variant='light' size={28} radius='xl'>
                <IconLicense size={16}/>
              </ThemeIcon>
              <Text color='dimmed' size='xs'>Coloured Barcode</Text>
              {/* <Barcode nucleotides={record.nucleotide} /> */}
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="left">
              <ThemeIcon variant='light' size={28} radius='xl'>
                <IconLicense size={16}/>
              </ThemeIcon>
              <Text color='dimmed' size='xs'>Nucleotides</Text>
              <textarea cols={100} rows={10} readOnly={true} value={record.nucleotide} />
            </Group>
          </Grid.Col>
        </div>
        </>
      }
    </Grid>
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
        <td>{props.record.version}</td>
        <td>{props.record.type || "Not Supplied"}</td>
        <td>{props.record.shape}</td>
        <td>{props.record.basepairs}</td>
        <td align="right">
          <Link href={`/markers/${props.record.accession}`}>
            <Button mr={20} size="xs" variant="light" rightIcon={<ArrowUpRight size={16} />}>All details</Button>
          </Link>
        </td>
      </tr>
      <tr>
        <td colSpan={8} style={{ padding: 0, border: 'none' }}>
          <Collapse in={props.selected}>
            <Box p={20} bg="gray.1">
              <MarkerDetails record={props.record} />
            </Box>
          </Collapse>
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
        <td>Version</td>
        <td>Type</td>
        <td>Shape</td>
        <td>Base pairs</td>
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
