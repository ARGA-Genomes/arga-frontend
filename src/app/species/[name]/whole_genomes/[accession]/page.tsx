"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { LoadPanel } from "@/app/components/load-overlay";
import { AttributePill, AttributeValue, DataField } from "@/app/components/highlight-stack";
import { ArrowNarrowLeft, CircleCheck, CircleX, CloudUpload, Download as IconDownload, Link as IconLink, Microscope } from "tabler-icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTableStyles } from "@/app/components/data-fields";
import { AnnotationEvent, AssemblyEvent, DataDepositionEvent, Sequence, SequencingEvent, SequencingRunEvent } from "@/app/queries/sequence";
import { ArgaMap } from "@/app/components/mapping";

const GET_ASSEMBLY = gql`
  query AssemblyFullData($accession: String) {
    sequence(by: { accession: $accession }) {
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

    specimen(by: { sequenceAccession: $accession }) {
      accession
      collectionCode
      latitude
      longitude
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
  accession: string,
  collectionCode?: string,
  latitude?: number,
  longitude?: number,
}

type SequenceQueryResults = {
  sequence: SequenceDetails,
  specimen: SpecimenDetails,
};


function GenomeDetails({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();

  return (
    <Grid>
      <Grid.Col span={8}>
        <Table className={classes.table} w={1}>
          <tbody>
          <tr>
            <td>Genome status</td>
            <td><AttributePill value={sequence?.events.dataDepositions[0].dataType} /></td>
          </tr>
          <tr>
            <td>Representation</td>
            <td><AttributePill value={sequence?.events.annotations[0].representation} /></td>
          </tr>
          <tr>
            <td>Assembly type</td>
            <td><AttributePill value={sequence?.events.assemblies[0].assemblyType} /></td>
          </tr>
          <tr>
            <td>Release date</td>
            <td><DataField value={undefined} /></td>
          </tr>
          <tr>
            <td>Release type</td>
            <td><AttributePill value={sequence?.events.annotations[0].releaseType} /></td>
          </tr>
          <tr>
            <td>Version status</td>
            <td><DataField value={sequence?.events.assemblies[0].versionStatus} /></td>
          </tr>
          <tr>
            <td>Sequencing method</td>
            <td><DataField value={undefined} /></td>
          </tr>
          <tr>
            <td>Publication</td>
            <td><DataField value={sequence?.events.dataDepositions[0].title} /></td>
          </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="lg" radius="lg" pos="relative" withBorder>
          <Stack>
            <Title order={5}>Original data</Title>
            <Button color="midnight" radius="md" leftIcon={<IconDownload />}>get data</Button>
            <Button color="midnight" radius="md" leftIcon={<IconLink />}>go to source</Button>
            <Button color="midnight" radius="md" leftIcon={<CloudUpload />} disabled>send to Galaxy</Button>
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
          <AttributeValue label="Genome size" value={Humanize.fileSize(assembly?.genomeSize || 0)} />
          <AttributeValue label="Ungapped length" value={Humanize.fileSize(0)} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of chromosones" value={undefined} />
          <AttributeValue label="Number of organelles" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Assembly level" value={assembly?.quality} />
          <AttributeValue label="BUSCO score" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Genome coverage" value={undefined} />
          <AttributeValue label="GC percentage" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of scaffolds" value={undefined} />
          <AttributeValue label="Scaffold N50" value={Humanize.fileSize(0)} />
          <AttributeValue label="Scaffold L50" value={undefined} />
        </Stack>
        <Stack>
          <AttributeValue label="Number of contigs" value={undefined} />
          <AttributeValue label="Contig N50" value={Humanize.fileSize(0)} />
          <AttributeValue label="Contig L50" value={undefined} />
        </Stack>
      </SimpleGrid>
  )
}

function DataAvailabilityItem({ value, children }: { value: boolean|undefined, children: React.ReactNode }) {
  return (
    <Group noWrap>
      { value ? <CircleCheck color="green" /> : <CircleX color="red" /> }
      <Text fz="sm" weight={300}>{children}</Text>
    </Group>
  )
}

function DataAvailability({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const assembly = sequence?.events.assemblies[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Stack>
      <DataAvailabilityItem value={!!sequencing}>Genome data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!assembly}>Assembly data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.sourceUri}>Assembly source files available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.url}>Genome publication available</DataAvailabilityItem>
      <DataAvailabilityItem value={false}>Specimen collection data available</DataAvailabilityItem>
      <DataAvailabilityItem value={false}>Specimen voucher accessioned</DataAvailabilityItem>
      <DataAvailabilityItem value={false}>Specimen location available</DataAvailabilityItem>
    </Stack>
  )
}

function DataProvenance({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();

  return (
    <Table className={classes.table}>
      <tbody>
      <tr>
        <td>Accession</td>
        <td><DataField value={sequence?.accession} /></td>
      </tr>
      <tr>
        <td>Sequenced by</td>
        <td><DataField value={sequence?.events.sequencing[0].sequencedBy} /></td>
      </tr>
      <tr>
        <td>Assembled by</td>
        <td><DataField value={sequence?.events.assemblies[0].submittedBy} /></td>
      </tr>
      <tr>
        <td>Annotated by</td>
        <td><DataField value={sequence?.events.annotations[0].annotatedBy} /></td>
      </tr>
      <tr>
        <td>Deposited by</td>
        <td><DataField value={sequence?.events.dataDepositions[0].submittedBy} /></td>
      </tr>
      </tbody>
    </Table>
  )
}

function SpecimenPreview({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const { classes } = useTableStyles();
  const basePath = usePathname()?.split('/').slice(1, 3).join('/');
  const path = `${basePath}/specimens/${specimen?.accession}`;

  return (
    <Grid>
      <Grid.Col span={7}>
        <Stack>
          <Title order={5}>Specimen information</Title>
          <Table className={classes.table}>
            <tbody>
              <tr>
                <td>Sample ID</td>
                <td><DataField value={specimen?.accession} /></td>
              </tr>
              <tr>
                <td>Sequenced by</td>
                <td><DataField value={specimen?.collectionCode} /></td>
              </tr>
            </tbody>
          </Table>

          <Flex justify="flex-end">
            <Link href={path}>
              <Button radius="md" color="midnight" leftIcon={<Microscope />}>go to specimen</Button>
            </Link>
          </Flex>
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
    <Box pos="relative" h={180} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


export default function AssemblyPage({ params }: { params: { accession: string } }) {
  let basePath = usePathname()?.replace(params.accession, '');

  const { loading, error, data } = useQuery<SequenceQueryResults>(GET_ASSEMBLY, {
    variables: {
      accession: params.accession,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Stack spacing={20}>
      <Link href={basePath || ''}>
        <Group spacing={5}>
          <ArrowNarrowLeft />
          <Text fz={18}>Back to whole genomes</Text>
        </Group>
      </Link>

      <Paper p="md" radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Full data view: ${data?.sequence.accession}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
          <Text fz="sm" c="dimmed" weight={700}>{data?.sequence.datasetName}</Text>
        </Group>

        <Grid>
          <Grid.Col span={9}>
            <Grid>
              <Grid.Col span={8}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5}>Genome details</Title>
                  <GenomeDetails sequence={data?.sequence} />
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={4}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5} mb={10}>Data availability</Title>
                  <DataAvailability sequence={data?.sequence} />
                </LoadPanel>
              </Grid.Col>

              <Grid.Col span={6}>
                <LoadPanel visible={loading}>
                  <Title order={5} mb={10}>Data provenance</Title>
                  <DataProvenance sequence={data?.sequence} />
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
              <AssemblyStats sequence={data?.sequence} />
            </LoadPanel>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
