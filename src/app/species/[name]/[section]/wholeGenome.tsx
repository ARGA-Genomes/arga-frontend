'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Accordion, Badge, Box, Button, Center, Collapse, Container, Drawer, Grid, Group, LoadingOverlay, Paper, SimpleGrid, Stack, Table, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { GenomicData, CommonGenome} from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useHover, useListState } from "@mantine/hooks";
import { Link as IconLink, Pencil as IconPencil, License as IconLicense, ArrowUpRight, ArrowsMaximize, ArrowsMinimize, ExternalLink, Microscope, ChevronDown, Eye } from 'tabler-icons-react';
import { useState } from "react";
import { Attribute, AttributeValue } from "@/app/components/highlight-stack";
import { LoadOverlay } from "@/app/components/load-overlay";
import { MAX_WIDTH } from "@/app/constants";


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
  wholeGenomes: WholeGenome[],
  data: GenomicData[]
}

type QueryResults = {
  species: Species,
};



const PointMap = dynamic(() => import('../../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


function ReferenceSequence({ refseq }: { refseq: WholeGenome | undefined }) {
  return (
    <Grid mah={REFSEQ_MAP_HEIGHT} pos="relative" m={0}>
      <Grid.Col span={9} p={20}>
        <Title order={3}>Reference Genome Sequence</Title>
        { refseq ? <GenomeDetails record={refseq} columns={3} /> : null }
      </Grid.Col>
      <Grid.Col span={3} h={REFSEQ_MAP_HEIGHT} w={200} pos="relative" m={0} p={0}>
        <PointMap coordinates={refseq?.coordinates ? [refseq.coordinates] : undefined} borderRadius="0 16px 0 0" />
      </Grid.Col>
    </Grid>
  )
}


interface AllSequencesProps {
  records: WholeGenome[],
  onExpandToggle: () => void,
}

function AllSequences({ records, onExpandToggle }: AllSequencesProps) {
  return (
    <Grid mah={GENOME_MAP_HEIGHT} pos="relative" m={0}>
      <Grid.Col span={9} p={20}>
        <Title order={3}>All Sequences</Title>
        { records ? <GenomeList records={records}/> : null }
      </Grid.Col>
      <Grid.Col span={3} h={GENOME_MAP_HEIGHT} w={200} pos="relative" m={0} p={0}>
        <GenomeMap records={records} onExpandToggle={onExpandToggle} />
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
        <GenomeField label="Accession" value={record.accession} icon={<IconLink size={16} />} />
      </Grid.Col>
          {/* <Grid.Col span={cols}>
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
      </Grid.Col> */}
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
      <td>{props.record.name}</td>
      <td>{props.record.representation}</td>
      <td>{props.record.datasetName}</td>
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
          <td>Name</td>
          <td>Representation</td>
          <td>Data Source</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        { records.map(record => {
          return (<GenomeRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={record.accession}
          />)
        })}
      </tbody>
    </Table>
  )
}


function GenomeList({ records }: { records: WholeGenome[] }) {
  return (
    <Accordion>
      { records.map(record => (
        <Accordion.Item value={record.accession} key={record.id}>
          <Accordion.Control>{record.accession} - {record.name}</Accordion.Control>
          <Accordion.Panel><GenomeSummary record={record} /></Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}


function GenomeSummary({ record }: { record: WholeGenome }) {
  return (
    <SimpleGrid cols={5}>
      <AttributeValue label="Accession" value={record.accession} />
      <AttributeValue label="Dataset" value={record.datasetName} />
      <AttributeValue label="Material sample" value={record.materialSampleId} />
      <AttributeValue label="Name" value={record.name} />
      <AttributeValue label="Quality" value={record.quality} />
      <AttributeValue label="Release type" value={record.releaseType} />
      <AttributeValue label="Representation" value={record.representation} />
      <AttributeValue label="Version" value={record.versionStatus} />
      <AttributeValue label="Estimated size" value={record.estimatedSize} />
      <AttributeValue label="Assembly type" value={record.assemblyType} />
      <AttributeValue label="Data type" value={record.dataType} />
      <AttributeValue label="Sequenced by" value={record.sequencedBy} />
      <AttributeValue label="Assembled by" value={record.assembledBy} />
      <AttributeValue label="Annotated by" value={record.annotatedBy} />
      <AttributeValue label="Deposited by" value={record.depositedBy} />
    </SimpleGrid>
  )
}

const BADGE_COLOURS: Record<string, string> = {
  "representative genome": "yellow",
  "Full": "moss",
  "Partial": "bushfire.3",
  "Chromosome": "moss",
  "Contig": "bushfire.3",
}

function RecordBadge({ value }: { value: string }) {
  return (
    <Badge color={BADGE_COLOURS[value] || "blue"}>{value}</Badge>
  )
}


function RecordBadges({ record }: { record: WholeGenome }) {
  return (
    <Group>
      { record.dataType && <RecordBadge value={record.dataType} /> }
      { record.representation && <RecordBadge value={record.representation} /> }
      { record.quality && <RecordBadge value={record.quality} /> }
    </Group>
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


function RecordItemHeader({ record }: { record: WholeGenome }) {
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

function RecordItem({ record }: { record: WholeGenome }) {
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius={16}
      mb={15}
      ref={ref}
      bg={ hovered ? "#F5F5F5" : "white" }
      withBorder
    >
      <Grid gutter={0}>
        <Grid.Col span="auto">
          <RecordItemHeader record={record} />
        </Grid.Col>
        <Grid.Col span="content">
          <Button color="midnight" h="100%" w={100} sx={{ borderRadius: "0 16px 16px 0" }}>
            <Stack>
              <Eye size="lg" />
              view
            </Stack>
          </Button>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function RecordList({ records }: { records: WholeGenome[] }) {
  return (
    <>
      { records.map(record => <RecordItem record={record} key={record.id} />) }
    </>
  )
}


interface GenomeMapProperties {
  records?: WholeGenome[],
  onExpandToggle: () => void,
}

function GenomeMap({ records, onExpandToggle }: GenomeMapProperties) {
  let positions = records?.map(record => record.coordinates).filter(record => record);

  return (
    <PointMap coordinates={positions} borderRadius="16px 16px 16px 16px">
      <Button sx={{ zIndex: 1000, right: 20, top: 20, position: "absolute"}} rightIcon={<ArrowsMaximize />} onClick={() => onExpandToggle()}>Expand</Button>
    </PointMap>
  )
}


function MapViewer({ records, onExpandToggle }: GenomeMapProperties) {
  let positions = records?.map(record => record.coordinates).filter(record => record);

  return (
    <PointMap coordinates={positions} borderRadius="16px 16px 16px 16px">
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

  const records = data ? data.species.wholeGenomes : [];
    /* const otherRecords = data ? data.species.data.filter(record => record.dataResource.includes("BPA")) : [];
  * const refseq = records?.find(record => record.refseqCategory == "representative genome"); */

  return (
    <Container maw={MAX_WIDTH} py={20}>
      <LoadOverlay visible={loading} />

      <Stack spacing={5}>
        <Title order={3}>All genomes</Title>
        <Grid>
          <Grid.Col span={8}>
            <RecordList records={records} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Box w={600} h={600} pos="absolute">
            <MapViewer records={records} onExpandToggle={() => {}} />
            </Box>
          </Grid.Col>
        </Grid>
              {/* <ReferenceSequence refseq={refseq} /> */}
              {/* <AllSequences records={records} onExpandToggle={() => setMapExpand(true)} /> */}
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
        <MapViewer records={records} onExpandToggle={() => setMapExpand(false)}/>
      </Drawer>
    </Container>
  );
}
