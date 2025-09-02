"use client";

import { CopyableData } from "@/components/data-fields";
import { DataTable, DataTableRow } from "@/components/data-table";
import { AttributePill, DataField } from "@/components/highlight-stack";
import { LoadPanel } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";
import { Marker } from "@/components/mapping/analysis-map";
import { TraceData } from "@/components/traces/trace-data";
import { Sequence, Specimen } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, ButtonProps, Center, Flex, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconArrowNarrowLeft,
  IconCircleCheck,
  IconCircleX,
  IconCloudUpload,
  IconDownload,
  IconLink,
} from "@tabler/icons-react";
import Link from "next/link";

const GET_ASSEMBLY = gql`
  query MarkerFullData($recordId: String) {
    sequence(by: { recordId: $recordId }) {
      id
      ...SequenceDetails

      events {
        sequencing {
          ...SequencingEventDetails
        }
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
        assemblies {
          ...AssemblyEventDetails
        }
        annotations {
          ...AnnotationEventDetails
        }
        dataDepositions {
          ...DataDepositionEventDetails
        }
      }
    }

    specimen(by: { sequenceRecordId: $recordId }) {
      recordId
      collectionCode
      latitude
      longitude
      events {
        accessions {
          id
        }
      }
    }
  }
`;

interface LinkButtonProps extends ButtonProps {
  href?: string | null;
  children?: React.ReactNode;
}

function LinkButton({ href, children, ...buttonProps }: LinkButtonProps) {
  return href ? (
    <Button component="a" href={href} target="_blank" {...buttonProps}>
      {children}
    </Button>
  ) : (
    <Button {...buttonProps} disabled>
      {children}
    </Button>
  );
}

function MoleculeDetails({ sequence }: { sequence?: Sequence }) {
  const sequencing = sequence?.events.sequencing[0];
  const deposition = sequence?.events.dataDepositions[0];

  const depositionBase =
    sequence?.datasetName === "BOLD" && "https://www.boldsystems.org/index.php/Public_RecordView?processid=";

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
            <LinkButton color="midnight.10" radius="md" leftSection={<IconDownload />} href={deposition?.sourceUri}>
              get FASTA
            </LinkButton>
            <LinkButton
              color="midnight.10"
              radius="md"
              leftSection={<IconLink />}
              href={deposition?.accession && `${depositionBase}${deposition.accession}`}
            >
              go to source
            </LinkButton>
            <Button color="midnight.10" radius="md" leftSection={<IconCloudUpload />} disabled>
              send to Galaxy
            </Button>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <DataTable>
          <DataTableRow label="Publication">
            <DataField value={deposition?.reference} />
          </DataTableRow>
          <DataTableRow label="Sequence">
            {sequencing?.dnaSequence ? (
              <CopyableData value={sequencing.dnaSequence} />
            ) : (
              <DataField value={undefined} />
            )}
          </DataTableRow>
          <DataTableRow label="Translation">
            <DataField value={undefined} />
          </DataTableRow>
        </DataTable>
      </Grid.Col>
    </Grid>
  );
}

function DataAvailabilityItem({ value, children }: { value: boolean | undefined; children: React.ReactNode }) {
  return (
    <Group wrap="nowrap">
      {value ? <IconCircleCheck color="green" /> : <IconCircleX color="red" />}
      <Text fz="sm" fw={300}>
        {children}
      </Text>
    </Group>
  );
}

function DataAvailability({ sequence, specimen }: { sequence?: Sequence; specimen?: Specimen }) {
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
      <DataAvailabilityItem value={!!specimen?.events.accessions.length}>
        Specimen voucher accessioned
      </DataAvailabilityItem>
      {/* No longer exists on specimen type */}
      {/* <DataAvailabilityItem value={!!specimen?.latitude}>Specimen location available</DataAvailabilityItem> */}
    </Stack>
  );
}

function DataProvenance({ sequence }: { sequence?: Sequence }) {
  const sequencing = sequence?.events.sequencing[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <DataTable>
      <DataTableRow label="Accession">
        <DataField value={sequence?.recordId} />
      </DataTableRow>
      <DataTableRow label="Sequence author">
        <DataField value={sequencing?.sequencedBy} />
      </DataTableRow>
      <DataTableRow label="Institution">
        <DataField value={deposition?.institutionName} />
      </DataTableRow>
      <DataTableRow label="Deposited by">
        <DataField value={deposition?.submittedBy} />
      </DataTableRow>
    </DataTable>
  );
}

function AmplificationMethods({ sequence }: { sequence?: Sequence }) {
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <DataTable>
      <DataTableRow label="Primer forward">
        <DataField value={sequencingRun?.sequencePrimerForwardName} />
      </DataTableRow>
      <DataTableRow label="Primer reverse">
        <DataField value={sequencingRun?.sequencePrimerReverseName} />
      </DataTableRow>
      <DataTableRow label="Data source">
        <DataField value={sequence?.datasetName} />
      </DataTableRow>
    </DataTable>
  );
}

function SpecimenPreview({ specimen }: { specimen?: Specimen }) {
  return (
    <Grid>
      <Grid.Col span={7}>
        <Stack>
          <Title order={5}>Specimen information</Title>

          <DataTable>
            <DataTableRow label="Sample ID">
              {/* <DataField value={specimen?.recordId} /> */}
              No longer exists on Specimen type
            </DataTableRow>
            <DataTableRow label="Sequenced by">
              {/* <DataField value={specimen?.collectionCode} /> */}
              No longer exists on Specimen type
            </DataTableRow>
          </DataTable>

          <Center>
            {/* <Link href={`../specimens/${specimen?.recordId}`}>
              <Button radius="md" color="midnight.10" leftSection={<IconMicroscope />}>
                go to specimen
              </Button>
            </Link> */}
            No longer exists on Specimen type
          </Center>
        </Stack>
      </Grid.Col>
      <Grid.Col span={5}>
        <SpecimenMap specimen={specimen} />
      </Grid.Col>
    </Grid>
  );
}

function SpecimenMap({ specimen }: { specimen?: Specimen }) {
  // const position: [number, number] | undefined =
  //  specimen?.latitude && specimen.longitude ? [Number(specimen.latitude), Number(specimen.longitude)] : undefined;
  // latitude & longitude no longer exists on Specimen type
  const position: [number, number] | undefined = undefined;

  const marker =
    position &&
    ({
      // tooltip: specimen?.recordId, // recordID no longer exists on Specimen type
      tooltip: specimen?.entityId,
      latitude: position[0],
      longitude: position[1],
      color: [103, 151, 180, 220],
    } as Marker<null>);

  return (
    <Box pos="relative" h={300}>
      <AnalysisMap
        markers={marker ? [marker] : []}
        style={{ borderRadius: "var(--mantine-radius-lg)", overflow: "hidden" }}
        initialPosition={position}
        initialZoom={position ? 7.0 : 2.4}
      ></AnalysisMap>
    </Box>
  );
}

function TraceDataList({ sequence }: { sequence?: Sequence }) {
  return (
    <Stack>
      {sequence?.events.sequencingRuns.map((run, idx) => run.trace && <TraceData key={idx} trace={run.trace} />)}
    </Stack>
  );
}

export default function MarkerAccession({ params }: { params: { accession: string } }) {
  const { loading, error, data } = useQuery<{ sequence: Sequence[]; specimen: Specimen }>(GET_ASSEMBLY, {
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
          <IconArrowNarrowLeft />
          <Text fz={18}>Back to markers</Text>
        </Group>
      </Link>

      <Paper p="md" radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Full data view: ${sequence?.recordId}`}</Title>
          <Text fz="sm" c="dimmed">
            Source
          </Text>
          <Text fz="sm" c="dimmed" fw={700}>
            {sequence?.datasetName}
          </Text>
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
              <Title order={5} mb={10}>
                Data availability
              </Title>
              <DataAvailability sequence={sequence} specimen={data?.specimen} />
            </LoadPanel>
          </Grid.Col>

          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>
                Trace data
              </Title>
              <TraceDataList sequence={sequence} />
            </LoadPanel>
          </Grid.Col>

          <Grid.Col span={4}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>
                Data provenance
              </Title>
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
              <Title order={5} mb={10}>
                Amplification methods
              </Title>
              <AmplificationMethods sequence={sequence} />
            </LoadPanel>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
