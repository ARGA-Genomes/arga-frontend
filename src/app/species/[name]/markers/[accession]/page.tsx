"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LoadPanel } from "@/components/load-overlay";
import { AttributePill, DataField } from "@/components/highlight-stack";
import { ArrowNarrowLeft, CircleCheck, CircleX, CloudUpload, Download as IconDownload, Link as IconLink, Microscope } from "tabler-icons-react";
import Link from "next/link";
import { CopyableData } from "@/components/data-fields";
import { DataDepositionEvent, Sequence, SequencingEvent, SequencingRunEvent } from "@/queries/sequence";
import { ArgaMap } from "@/components/mapping";
import { DataTable, DataTableRow } from "@/components/data-table";
import { TraceData } from "@/components/traces/trace-data";


const GET_ASSEMBLY = gql`
  query MarkerFullData($recordId: String) {
    sequence(by: { recordId: $recordId }) {
      id
      ...SequenceDetails

      events {
        sequencing { ...SequencingEventDetails }
        sequencingRuns {
          id
          ...SequencingRunEventDetails
          trace {
            accession
            traceName
            traceId
            traceLink
          }
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
  events: {
    sequencing: SequencingEvent[],
    sequencingRuns: SequencingRunEvent[],
    dataDepositions: DataDepositionEvent[],
  },
};

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


function MoleculeDetails({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Grid>
      <Grid.Col span={8}>
        <DataTable>
          <DataTableRow label="Gene name">
            <Flex>
              <AttributePill value={sequencing?.targetGene} />
            </Flex>
          </DataTableRow>
          <DataTableRow label="Sequence length">
            <Flex>
              <AttributePill value={sequencing?.estimatedSize} />
            </Flex>
          </DataTableRow>
          <DataTableRow label="Source molecule">
            <Flex>
              <AttributePill value={undefined} />
            </Flex>
          </DataTableRow>
          <DataTableRow label="Sequencing method">
            <Flex>
              <AttributePill value={undefined} />
            </Flex>
          </DataTableRow>
          <DataTableRow label="Release date">
            <Flex>
              <AttributePill value={deposition?.eventDate} />
            </Flex>
          </DataTableRow>
        </DataTable>
      </Grid.Col>

      <Grid.Col span={4}>
        <Paper p="lg" radius="lg" pos="relative" withBorder>
          <Stack>
            <Title order={5}>Original data</Title>
            <Button color="midnight" radius="md" leftSection={<IconDownload />}>get FASTA</Button>
            <Button color="midnight" radius="md" leftSection={<IconLink />}>go to source</Button>
            <Button color="midnight" radius="md" leftSection={<CloudUpload />} disabled>send to Galaxy</Button>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <DataTable>
          <DataTableRow label="Publication"><DataField value={deposition?.reference} /></DataTableRow>
          <DataTableRow label="Sequence">
            { sequencing?.dnaSequence
              ?<CopyableData value={sequencing.dnaSequence} />
              : <DataField value={undefined} />
            }
          </DataTableRow>
          <DataTableRow label="Translation"><DataField value={undefined} /></DataTableRow>
        </DataTable>
      </Grid.Col>
    </Grid>
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
  const sequencingRun = sequence?.events.sequencingRuns[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Stack>
      <DataAvailabilityItem value={!!sequencing?.dnaSequence}>Marker data available</DataAvailabilityItem>
      <DataAvailabilityItem value={false}>Contig data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!sequencingRun?.trace?.traceLink}>Trace files available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.url}>Marker publication available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen}>Specimen collection data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen?.events.accessions.length}>Specimen voucher accessioned</DataAvailabilityItem>
      <DataAvailabilityItem value={!!specimen?.latitude}>Specimen location available</DataAvailabilityItem>
    </Stack>
  )
}

function DataProvenance({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <DataTable>
      <DataTableRow label="Accession"><DataField value={sequence?.recordId} /></DataTableRow>
      <DataTableRow label="Sequence author"><DataField value={sequencing?.sequencedBy} /></DataTableRow>
      <DataTableRow label="Institution"><DataField value={deposition?.institutionName} /></DataTableRow>
      <DataTableRow label="Deposited by"><DataField value={deposition?.submittedBy} /></DataTableRow>
    </DataTable>
  )
}

function AmplificationMethods({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <DataTable>
      <DataTableRow label="Primer forward"><DataField value={sequencingRun?.sequencePrimerForwardName} /></DataTableRow>
      <DataTableRow label="Primer reverse"><DataField value={sequencingRun?.sequencingPrimerReverseName} /></DataTableRow>
      <DataTableRow label="Data source"><DataField value={sequence?.datasetName} /></DataTableRow>
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


function TraceDataList({ sequence }: { sequence: SequenceDetails | undefined }) {
  return (
    <Stack>
      { sequence?.events.sequencingRuns.map((run, idx) => (
        <TraceData key={idx} trace={run.trace} />
      ))}
    </Stack>
  )
}


export default function MarkerPage({ params }: { params: { accession: string } }) {
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
          <Text fz={18}>Back to markers</Text>
        </Group>
      </Link>

      <Paper p="md" radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Full data view: ${sequence?.recordId}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
          <Text fz="sm" c="dimmed" fw={700}>{sequence?.datasetName}</Text>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <LoadPanel visible={loading} h={450}>
              <Title order={5}>Molecule data</Title>
              <MoleculeDetails sequence={sequence} />
            </LoadPanel>
          </Grid.Col>
          <Grid.Col span={3}>
            <LoadPanel visible={loading} h={450}>
              <Title order={5} mb={10}>Data availability</Title>
              <DataAvailability sequence={sequence} specimen={data?.specimen} />
            </LoadPanel>
          </Grid.Col>

          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Trace data</Title>
              <TraceDataList sequence={sequence} />
            </LoadPanel>
          </Grid.Col>


          <Grid.Col span={4}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Data provenance</Title>
              <DataProvenance sequence={sequence} />
            </LoadPanel>
          </Grid.Col>
          <Grid.Col span={5}>
            <LoadPanel visible={loading}>
              <SpecimenPreview specimen={data?.specimen} />
            </LoadPanel>
          </Grid.Col>
          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Amplification methods</Title>
              <AmplificationMethods sequence={sequence} />
            </LoadPanel>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
