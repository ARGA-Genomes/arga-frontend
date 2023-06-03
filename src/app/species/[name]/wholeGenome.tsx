'use client';

import { Box, Button, Collapse, Grid, Group, Paper, Table, Text, ThemeIcon } from "@mantine/core";
import { WholeGenome, QueryResults} from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useListState } from "@mantine/hooks";
import { Link as IconLink, Pencil as IconPencil, License as IconLicense, ArrowUpRight } from 'tabler-icons-react';


const FORMATTED_TYPE: Record<string, string> = {
  'PRESERVED_SPECIMEN': 'Preserved specimen',
  'OCCURRENCE': 'Occurrence',
}


const PointMap = dynamic(() => import('../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function WholeGenomeSection({ data }: { data : QueryResults }) {

  const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" ||
    record.refseqCategory == "reference genome" || record.accession?.includes("GC"));

  const coordinates = wholeGenomeRecords.map(record => record.coordinates);

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={8}>
          <Link
            href={{
              pathname: `/species/${data.species.taxonomy.canonicalName.replaceAll(" ", "_")}/wholeGenome`
            }}><Text color="blue" underline>Whole Genome Summary</Text></Link>
        </Grid.Col>

        <Grid.Col span="auto">
          <PointMap coordinates={coordinates}/>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


function genomeDetailsURL() {
  return `${window.location.href}/wholeGenome`
}


interface GenomeFieldProps {
  label: string,
  value?: string,
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
        <GenomeField label="Provenance" value={record.provenance} icon={<IconLink size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Recorded by" value={record.recordedBy?.join(', ')} icon={<IconPencil size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="License" value={record.license} icon={<IconLicense size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Category" value={record.refseqCategory} icon={<IconLicense size='1rem' />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="Occurred" value={record.occurrenceYear?.join(', ')} icon={<IconLink size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Catalog numbers" value={record.otherCatalogNumbers?.join(', ')} icon={<IconPencil size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI BioProject" value={record.ncbiBioproject} icon={<IconLicense size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI BioSample" value={record.ncbiBiosample} icon={<IconLicense size='1rem' />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="NCBI Release" value={record.ncbiReleaseType} icon={<IconLink size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="NCBI Nuccore" value={record.ncbiNuccore} icon={<IconPencil size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="Paired Asm Comp" value={record.pairedAsmComp} icon={<IconLicense size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000005" value={record.mixs0000005} icon={<IconLicense size='1rem' />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000026" value={record.mixs0000026} icon={<IconLicense size='1rem' />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <GenomeField label="MIXS 0000029" value={record.mixs0000029} icon={<IconLicense size='1rem' />} />
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
      <td>{props.record?.type ? (FORMATTED_TYPE[props.record.type] || props.record.type) : "Not Supplied"}</td>
      <td>{props.record.dataResource}</td>
      <td>{props.record.eventDate}</td>
      <td>
        <Link href={genomeDetailsURL()}>
          <Button size="xs" variant="light" rightIcon={<ArrowUpRight size="1rem" />}>All details</Button>
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
          <td>Data Resource</td>
          <td>Event Date</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        { records.map(record => (
          <GenomeRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={record.accessionUri}
          />
        ))}
      </tbody>
    </Table>
  )
}

export function WholeGenome({ records }: { records : WholeGenome[] }) {
  return (
    <Paper radius="lg" py={25}>
      <GenomeTable records={records} />
    </Paper>
  );
}
