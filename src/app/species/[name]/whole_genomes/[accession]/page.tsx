"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  ButtonProps,
  Center,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LoadPanel } from "@/components/load-overlay";
import { AttributePill, Attribute, DataField } from "@/components/highlight-stack";
import { ArrowNarrowLeft, CircleCheck, CircleX, CloudUpload, Download as IconDownload, Link as IconLink, Microscope } from "tabler-icons-react";
import Link from "next/link";
import { AnnotationEvent, AssemblyEvent, DataDepositionEvent, Sequence, SequencingEvent, SequencingRunEvent } from "@/queries/sequence";
import { ArgaMap } from "@/components/mapping";
import { DataTable, DataTableRow } from "@/components/data-table";

const GET_ASSEMBLY = gql`
  query AssemblyFullData($recordId: String) {
    sequence(by: { recordId: $recordId }) {
      id
      ...SequenceDetails

      events {
        sequencing { ...SequencingEventDetails }
        sequencingRuns {
          id
          ...SequencingRunEventDetails
        }
        assemblies { ...AssemblyEventDetails }
        annotations { ...AnnotationEventDetails }
        dataDepositions { ...DataDepositionEventDetails }
      }
    }

    specimen(by: { sequenceRecordId: $recordId }) {
      recordId
      collectionCode
      latitude
      longitude
      events {
        accessions { id }
      }
    }
  }
`;

type SequenceDetails = Sequence & {
  id: string,
  events: {
    sequencing: SequencingEvent[],
    sequencingRuns: { id: string } & SequencingRunEvent[],
    assemblies: AssemblyEvent[],
    annotations: AnnotationEvent[],
    dataDepositions: DataDepositionEvent[],
  },
}

type SpecimenDetails = {
  recordId: string,
  collectionCode?: string,
  latitude?: number,
  longitude?: number,
  events: {
    accessions: { id: string }[],
  }
}

type SequenceQueryResults = {
  sequence: SequenceDetails[],
  specimen: SpecimenDetails,
};


interface LinkButtonProps extends ButtonProps {
  href?: string,
  children?: React.ReactNode,
}

function LinkButton({ href, children, ...buttonProps }: LinkButtonProps) {
  return href
       ? <Button component="a" href={href} target="_blank" {...buttonProps}>{children}</Button>
       : <Button {...buttonProps} disabled>{children}</Button>
}


function GenomeDetails({ sequence }: { sequence: SequenceDetails | undefined }) {
  const assembly = sequence?.events.assemblies[0];
  const annotation = sequence?.events.annotations[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Grid>
      <Grid.Col span={8}>
        <DataTable w={1}>
          <DataTableRow label="Genome status"><AttributePill value={deposition?.dataType} /></DataTableRow>
          <DataTableRow label="Representation"><AttributePill value={annotation?.representation} /></DataTableRow>
          <DataTableRow label="Assembly type"><AttributePill value={assembly?.assemblyType} /></DataTableRow>
          <DataTableRow label="Release date"><DataField value={deposition?.eventDate} /></DataTableRow>
          <DataTableRow label="Release type"><AttributePill value={annotation?.releaseType} /></DataTableRow>
          <DataTableRow label="Version status"><DataField value={assembly?.versionStatus} /></DataTableRow>
          <DataTableRow label="Sequencing method"><DataField value={undefined} /></DataTableRow>
          <DataTableRow label="Publication"><DataField value={deposition?.title} /></DataTableRow>
        </DataTable>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="lg" radius="lg" pos="relative" withBorder>
          <Stack>
            <Title order={5}>Original data</Title>
            <LinkButton color="midnight" radius="md" leftSection={<IconDownload />} href={deposition?.sourceUri}>get data</LinkButton>
            <LinkButton color="midnight" radius="md" leftSection={<IconLink />} href={deposition?.url}>go to source</LinkButton>
            <Button color="midnight" radius="md" leftSection={<CloudUpload />} disabled>send to Galaxy</Button>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

function AssemblyStats({ sequence }: { sequence: SequenceDetails | undefined }) {
  const assembly = sequence?.events.assemblies[0];

  return (
      <SimpleGrid cols={2} spacing={50}>
        <Stack>
          <Attribute label="Genome size" value={Humanize.compactInteger(assembly?.genomeSize || 0, 3)} />
          <Attribute label="Ungapped length" value={Humanize.compactInteger(0)} />
        </Stack>
        <Stack>
          <Attribute label="Number of chromosones" value={undefined} />
          <Attribute label="Number of organelles" value={undefined} />
        </Stack>
        <Stack>
          <Attribute label="Assembly level" value={assembly?.quality} />
          <Attribute label="BUSCO score" value={undefined} />
        </Stack>
        <Stack>
          <Attribute label="Genome coverage" value={undefined} />
          <Attribute label="GC percentage" value={undefined} />
        </Stack>
        <Stack>
          <Attribute label="Number of scaffolds" value={undefined} />
          <Attribute label="Scaffold N50" value={undefined} />
          <Attribute label="Scaffold L50" value={undefined} />
        </Stack>
        <Stack>
          <Attribute label="Number of contigs" value={undefined} />
          <Attribute label="Contig N50" value={undefined} />
          <Attribute label="Contig L50" value={undefined} />
        </Stack>
      </SimpleGrid>
  )
}

function DataAvailabilityItem({ value, children }: { value: boolean|undefined, children: React.ReactNode }) {
  return (
    <Group wrap="nowrap">
      { value ? <CircleCheck color="green" /> : <CircleX color="red" /> }
      <Text fz="sm" fw={300}>{children}</Text>
    </Group>
  )
}

function DataAvailability({ sequence, specimen }: { sequence: SequenceDetails | undefined, specimen: SpecimenDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const assembly = sequence?.events.assemblies[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Stack>
      <DataAvailabilityItem value={!!sequencing}>Genome data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!assembly}>Assembly data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.sourceUri}>Assembly source files available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.url}>Genome publication available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen}>Specimen collection data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen?.events.accessions.length}>Specimen voucher accessioned</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen?.latitude}>Specimen location available</DataAvailabilityItem>
    </Stack>
  )
}

function DataProvenance({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const assembly = sequence?.events.assemblies[0];
  const annotation = sequence?.events.annotations[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <DataTable>
      <DataTableRow label="Accession"><DataField value={deposition?.accession} /></DataTableRow>
      <DataTableRow label="Sequenced by"><DataField value={sequencing?.sequencedBy} /></DataTableRow>
      <DataTableRow label="Assembled by"><DataField value={assembly?.assembledBy} /></DataTableRow>
      <DataTableRow label="Annotated by"><DataField value={annotation?.annotatedBy} /></DataTableRow>
      <DataTableRow label="Deposited by"><DataField value={deposition?.submittedBy} /></DataTableRow>
    </DataTable>
  )
}

function SpecimenPreview({ specimen }: { specimen: SpecimenDetails | undefined }) {
  return (
    <Grid>
      <Grid.Col span={7}>
        <Stack>
          <Title order={5}>Specimen information</Title>

          <DataTable>
            <DataTableRow label="Sample ID"><DataField value={specimen?.recordId} /></DataTableRow>
            <DataTableRow label="Sequenced by"><DataField value={specimen?.collectionCode} /></DataTableRow>
          </DataTable>

          <Center>
            <Link href={`../specimens/${specimen?.recordId}`}>
              <Button radius="md" color="midnight" leftSection={<Microscope />}>go to specimen</Button>
            </Link>
          </Center>
        </Stack>
      </Grid.Col>
      <Grid.Col span={5}>
        <SpecimenMap specimen={specimen} />
      </Grid.Col>
    </Grid>
  )
}

function SpecimenMap({ specimen }: { specimen : SpecimenDetails | undefined }) {
  return (
    <Box pos="relative" h={180}>
      <ArgaMap />
    </Box>
  )
}


export default function AssemblyPage({ params }: { params: { accession: string } }) {
  const { loading, error, data } = useQuery<SequenceQueryResults>(GET_ASSEMBLY, {
    variables: {
      recordId: params.accession,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const sequence = data?.sequence[0];

  return (
    <Stack gap={20}>
      <Link href="./">
        <Group gap={5}>
          <ArrowNarrowLeft />
          <Text fz={18}>Back to whole genomes</Text>
        </Group>
      </Link>

      <Paper p="md" radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Full data view: ${sequence?.recordId}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
          <Text fz="sm" c="dimmed" fw={700}>{sequence?.datasetName}</Text>
        </Group>

        <Grid>
          <Grid.Col span={9}>
            <Grid>
              <Grid.Col span={8}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5}>Genome details</Title>
                  <GenomeDetails sequence={sequence} />
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={4}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5} mb={10}>Data availability</Title>
                  <DataAvailability sequence={sequence} specimen={data?.specimen} />
                </LoadPanel>
              </Grid.Col>

              <Grid.Col span={6}>
                <LoadPanel visible={loading}>
                  <Title order={5} mb={10}>Data provenance</Title>
                  <DataProvenance sequence={sequence} />
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={6}>
                <LoadPanel visible={loading}>
                  <SpecimenPreview specimen={data?.specimen} />
                </LoadPanel>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Assembly statistics</Title>
              <AssemblyStats sequence={sequence} />
            </LoadPanel>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
