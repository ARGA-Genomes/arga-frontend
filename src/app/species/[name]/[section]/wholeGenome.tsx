'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Button, Center, Collapse, Drawer, Grid, Group, LoadingOverlay, Overlay, Paper, Table, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { WholeGenome, Coordinates } from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useListState } from "@mantine/hooks";
import { Link as IconLink, Pencil as IconPencil, License as IconLicense, ArrowUpRight, ArrowsMaximize, ArrowsMinimize } from 'tabler-icons-react';
import { useState } from "react";


const REFSEQ_MAP_HEIGHT = 400;
const GENOME_MAP_HEIGHT = 500;


const FORMATTED_TYPE: Record<string, string> = {
  'PRESERVED_SPECIMEN': 'Preserved specimen',
  'OCCURRENCE': 'Occurrence',
}

const GET_WHOLE_GENOMES = gql`
query SpeciesWholeGenomes($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    wholeGenomes {
      type
      dataResource
      recordedBy
      license
      provenance
      eventDate
      occurrenceYear
      otherCatalogNumbers
      accession
      accessionUri
      refseqCategory
      coordinates {
        latitude
        longitude
      }
      ncbiNuccore
      ncbiBioproject
      ncbiBiosample
      mixs0000005
      mixs0000029
      mixs0000026
      pairedAsmComp
      rawRecordedBy
      ncbiReleaseType
    }
  }
}`;

type Species = {
  wholeGenomes: WholeGenome[],
}

type QueryResults = {
  species: Species,
};



const PointMap = dynamic(() => import('../../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


function ReferenceSequence({ refseq }: { refseq : WholeGenome | undefined }) {
  return (
    <Grid mah={REFSEQ_MAP_HEIGHT} pos="relative" m={0}>
        <Grid.Col span={3} h={REFSEQ_MAP_HEIGHT} w={200} pos="relative" m={0} p={0}>
          <PointMap coordinates={refseq?.coordinates ? [refseq.coordinates] : undefined} borderRadius="16px 0 0 16px" />
          <Overlay color="grey" opacity={0.7} blur={0.4} sx={{ "z-index": 1000, borderRadius: "16px 0 0 16px" }} />
        </Grid.Col>

        <Grid.Col span={9} p={30}>
          { refseq ? <GenomeDetails record={refseq} columns={3} /> : null }
        </Grid.Col>
      </Grid>
  )
}


interface GenomeFieldProps {
  label: string,
  value?: string | number,
  icon: React.ReactNode,
}

function GenomeField(props: GenomeFieldProps) {
  return (
    <Group position="left">
      <ThemeIcon variant='light' size={28} radius='xl'>
        { props.icon}
      </ThemeIcon>
      <Box>
        <Text color='dimmed' size='xs'>{props.label}</Text>
        <Text size='sm' weight='bold' c={props.value ? "black" : "dimmed"}>
          {props.value || "Not Supplied"}
        </Text>
      </Box>
    </Group>
  )
}

function GenomeDetails({ record, columns }: { record: WholeGenome, columns: number }) {
  const cols = 12 / columns;

  return (
    <Grid>
      <Grid.Col span={cols}>
        <GenomeField label="Accension" value={record.accession} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Data resource" value={record.dataResource} icon={<IconLink size={16} />} />
      </Grid.Col>

      <Grid.Col span={cols}>
        <GenomeField label="Provenance" value={record.provenance} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Recorded by" value={record.recordedBy?.join(', ')} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="License" value={record.license} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Category" value={record.refseqCategory} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={cols}>
        <GenomeField label="Occurred" value={record.occurrenceYear?.join(', ')} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Catalog numbers" value={record.otherCatalogNumbers?.join(', ')} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="NCBI BioProject" value={record.ncbiBioproject} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="NCBI BioSample" value={record.ncbiBiosample} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={cols}>
        <GenomeField label="NCBI Release" value={record.ncbiReleaseType} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="NCBI Nuccore" value={record.ncbiNuccore} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Paired Asm Comp" value={record.pairedAsmComp} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="MIXS 0000005" value={record.mixs0000005} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={cols}>
        <GenomeField label="MIXS 0000026" value={record.mixs0000026} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="MIXS 0000029" value={record.mixs0000029} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Type" value={record?.type ? (FORMATTED_TYPE[record.type] || record.type) : "Not Supplied"} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={cols}>
        <GenomeField label="Event" value={record.eventDate} icon={<IconLicense size={16} />} />
      </Grid.Col>
    </Grid>
  )
}

interface GenomeRecordProps {
  record: WholeGenome,
  selected: boolean,
  onSelected: (record: WholeGenome) => void;
}

function GenomeRecord(props: GenomeRecordProps) {
  return (
    <>
    <tr
      style={{ cursor: 'pointer' }}
      onClick={() => props.onSelected(props.record)}
    >
      <td style={{ paddingLeft: 25 }}>{props.record.accession}</td>
      <td>{props.record.type}</td>
      <td>{props.record.refseqCategory}</td>
      <td>{props.record.dataResource}</td>
      <td>
        <Link href={`/assemblies/${props.record.accession}`}>
          <Button size="xs" variant="light" rightIcon={<ArrowUpRight size={16} />}>All details</Button>
        </Link>
      </td>
    </tr>
    <tr>
      <td colSpan={8} style={{ padding: 0, border: 'none' }}>
        <Collapse in={props.selected}>
          <Box p={20} bg="gray.1">
            <GenomeDetails record={props.record} columns={3} />
          </Box>
        </Collapse>
      </td>
    </tr>
    </>
  )
}

function GenomeTable({ records }: { records: WholeGenome[] }) {
  const [selected, handler] = useListState<WholeGenome>([]);

  function toggle(record: WholeGenome) {
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
          <td>Type</td>
          <td>Category</td>
          <td>Data Resource</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        { records.map(record => {
          return (<GenomeRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={record.accessionUri}
          />)
        })}
      </tbody>
    </Table>
  )
}


interface GenomeMapProperties {
  records?: WholeGenome[],
  onExpandToggle: () => void,
}

function GenomeMap({ records, onExpandToggle }: GenomeMapProperties) {
  let positions = records?.map(record => record.coordinates).filter(record => record);

  return (
    <PointMap coordinates={positions} borderRadius="0 16px 16px 0">
      <Button sx={{ zIndex: 1000, right: 20, top: 20, position: "absolute"}} rightIcon={<ArrowsMaximize />} onClick={() => onExpandToggle()}>Expand</Button>
    </PointMap>
  )
}


function MapViewer({ records, onExpandToggle }: GenomeMapProperties) {
  let positions = records?.map(record => record.coordinates).filter(record => record);

  return (
    <PointMap coordinates={positions} borderRadius="0 16px 16px 0">
      <Button sx={{ zIndex: 1000, right: 20, top: 20, position: "absolute" }} rightIcon={<ArrowsMinimize />} onClick={() => onExpandToggle()}>Close</Button>
    </PointMap>
  )
}


export function WholeGenome({ canonicalName }: { canonicalName: string }) {
  const theme = useMantineTheme();
  const [mapExpand, setMapExpand] = useState(false);

  const { loading, error, data } = useQuery<QueryResults>(GET_WHOLE_GENOMES, {
    variables: {
      canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const records = data?.species.wholeGenomes;
  const refseq = records?.find(record => record.refseqCategory == "representative genome");

  console.log(records?.map(record => record.coordinates))
  console.log(refseq?.coordinates)

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />

      <Grid mah={600}>
        <Grid.Col span="auto">
          <Title order={3} color="white" py={20}>Reference Genome Sequence</Title>
          <Paper mb={20} radius="lg">
            <ReferenceSequence refseq={refseq} />
          </Paper>
        </Grid.Col>
      </Grid>

      <Title order={3} color="white" py={20}>All Sequences</Title>
      <Paper radius="lg">
      <Grid pl={10}>
        <Grid.Col span={8} px={0} mx={0}>
          { records ? <GenomeTable records={records} /> : null }
        </Grid.Col>

        <Grid.Col pos="relative" span={4} h={GENOME_MAP_HEIGHT} p={0} m={0}>
          <GenomeMap records={records} onExpandToggle={() => setMapExpand(true)} />
        </Grid.Col>
      </Grid>
      </Paper>

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
        <MapViewer records={records} onExpandToggle={() => setMapExpand(false)}/>
      </Drawer>
    </Box>
  );
}
