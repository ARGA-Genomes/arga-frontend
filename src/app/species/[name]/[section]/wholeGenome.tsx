'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Button, Center, Collapse, Divider, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, Title } from "@mantine/core";
import { WholeGenome, Coordinates, AssemblyStats, BioSample, BioSampleAttribute } from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useListState } from "@mantine/hooks";
import { Link as IconLink, Pencil as IconPencil, License as IconLicense, ArrowUpRight } from 'tabler-icons-react';


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

function UnknownLocation() {
  return (
    <Center mih={200}>
      <Text c="dimmed">Location not supplied</Text>
    </Center>
  )
}

function ReferenceSequence({ refseq }: { refseq : WholeGenome | undefined }) {
    /* const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" ||
  *   record.refseqCategory == "reference genome" || record.accession?.includes("GC")); */

  return (
      <Grid>
        <Grid.Col span={9}>
          { refseq ? <GenomeDetails record={refseq} /> : null }
        </Grid.Col>

        <Grid.Col span={3}>
            {refseq?.coordinates ? <PointMap coordinates={[refseq.coordinates]} /> : <UnknownLocation /> }
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

function GenomeDetails({ record }: { record: WholeGenome }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <GenomeField label="Accension" value={record.accession} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Data resource" value={record.dataResource} icon={<IconLink size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Provenance" value={record.provenance} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Recorded by" value={record.recordedBy?.join(', ')} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="License" value={record.license} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Category" value={record.refseqCategory} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Occurred" value={record.occurrenceYear?.join(', ')} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Catalog numbers" value={record.otherCatalogNumbers?.join(', ')} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI BioProject" value={record.ncbiBioproject} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI BioSample" value={record.ncbiBiosample} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="NCBI Release" value={record.ncbiReleaseType} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI Nuccore" value={record.ncbiNuccore} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Paired Asm Comp" value={record.pairedAsmComp} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000005" value={record.mixs0000005} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000026" value={record.mixs0000026} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000029" value={record.mixs0000029} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Type" value={record?.type ? (FORMATTED_TYPE[record.type] || record.type) : "Not Supplied"} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Event" value={record.eventDate} icon={<IconLicense size={16} />} />
      </Grid.Col>
    </Grid>
  )
}

function GenomeStats({ record }: { record: AssemblyStats }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <GenomeField label="Total Length" value={record.totalLength} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Total Gap Length" value={record.totalGapLength} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Spanned Gaps" value={record.spannedGaps} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Unspanned Gaps" value={record.unspannedGaps} icon={<IconLink size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Top Level Count" value={record.topLevelCount} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Region Count" value={record.regionCount} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Molecule Count" value={record.moleculeCount} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Component Count" value={record.componentCount} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Contig Count" value={record.contigCount} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Contig L50" value={record.contigL50} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Contig N50" value={record.contigN50} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="GC Perc" value={record.gcPerc} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Scaffold Count" value={record.scaffoldCount} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Scaffold L50" value={record.scaffoldL50} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Scaffold N50" value={record.scaffoldN50} icon={<IconLicense size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Scaffold N75" value={record.scaffoldN75} icon={<IconLicense size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Scaffold N90" value={record.scaffoldN90} icon={<IconLicense size={16} />} />
      </Grid.Col>
    </Grid>
  )
}

function GenomeBioSample({ record }: { record: BioSample }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <GenomeField label="Accession" value={record.accession} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="SRA" value={record.sra} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Submission Date" value={record.submissionDate} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Publication Date" value={record.publicationDate} icon={<IconLink size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Title" value={record.title} icon={<IconLink size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Owner" value={record.owner} icon={<IconPencil size={16} />} />
      </Grid.Col>

      { record.attributes?.map(attr => (
        <Grid.Col span={3}>
          <GenomeField label={attr.name} value={attr.value} icon={<IconPencil size={16} />} />
        </Grid.Col>
      ))}
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
            <GenomeDetails record={props.record} />
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

export function WholeGenome({ canonicalName }: { canonicalName: string }) {
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
  /* const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" ||
  *   record.refseqCategory == "reference genome" || record.accession?.includes("GC")); */

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      { refseq ? (<>
      <Title order={3} color="white" py={20}>Reference Genome Sequence</Title>
      <Paper mb={20} p={30} radius="lg">
        <ReferenceSequence refseq={refseq} />
      </Paper>
      </>) : null }

      <Title order={3} color="white" py={20}>All Sequences</Title>
      <Paper radius="lg" py={20}>
        { records ? <GenomeTable records={records} /> : null }
      </Paper>
    </Box>
  );
}
