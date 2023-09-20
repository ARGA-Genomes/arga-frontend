"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  createStyles,
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
import { CircleCheck, CircleX, CloudUpload, Download as IconDownload, Link as IconLink } from "tabler-icons-react";

const GET_ASSEMBLY = gql`
  query AssemblyFullData($accession: String) {
    sequence(accession: $accession) {
      id
      dnaExtractId
      accession
      genbankAccession
      datasetName

      events {
        sequencing {
          materialSampleId
          sequencedBy
          targetGene
          ampliconSize
          estimatedSize
          concentration
          baitSetName
          baitSetReference
          dnaSequence
        }
        sequencingRuns {
          id
          traceName
          traceId
          traceLink
          targetGene
          sequencingDate
          sequencingEventId
          sequencingMethod
          sequencingCenter
          sequencingCenterCode
          sequencePrimerForwardName
          sequencePrimerReverseName
          pcrPrimerNameForward
          pcrPrimerNameReverse
          direction
          analysisSoftware
          analysisDescription
          libraryProtocol
        }
        assemblies {
          name
          quality
          assemblyType
          genomeSize
          submittedBy
          versionStatus
        }
        annotations {
          representation
          releaseType
          replicons
          coverage
          standardOperatingProcedures
          annotatedBy
        }
        dataDepositions {
          dataType
          institutionName
          collectionName
          collectionCode
          materialSampleId
          submittedBy
          asmNotLiveDate
          excludedFromRefseq
          lastUpdated

          title
          url
          fundingAttribution
          reference
          accessRights
          rightsHolder
          sourceUri
        }
      }
    }
  }
`;

type SequencingEvent = {
  materialSampleId: string,
  sequencedBy: string,
  targetGene: string,
  ampliconSize: string,
  estimatedSize: string,
  concentration: string,
  baitSetName: string,
  baitSetReference: string,
  dnaSequence: string,
}

type SequencingRunEvent = {
  id: string,
  traceName: string,
  traceId: string,
  traceLink: string,
  targetGene: string,
  sequencingDate: string,
  sequencingEventId: string,
  sequencingMethod: string,
  sequencingCenter: string,
  sequencingCenterCode: string,
  sequencePrimerForwardName: string,
  sequencingPrimerReverseName: string,
  direction: string,
  analysisSoftware: string,
  analysisDescription: string,
  libraryProtocol: string,
}

type AssemblyEvent = {
  name: string,
  quality: string,
  assemblyType: string,
  genomeSize: number,
  submittedBy: string,
  versionStatus: string,
}

type AnnotationEvent = {
  representation: string,
  releaseType: string,
  replicons: string,
  coverage: string,
  standardOperatingProcedures: string,
  annotatedBy: string,
}

type DataDepositionEvent = {
  dataType: string,
  institutionName: string,
  collectionName: string,
  collectionCode: string,
  materialSampleId: string,
  submittedBy: string,
  asmNotLiveDate: string,
  excludedFromRefseq: string,
  lastUpdated: string,
  title: string,
  url: string,
  fundingAttribution: string,
  reference: string,
  accessRights: string,
  rightsHolder: string,
  sourceUri: string,
}

type SequenceDetails = {
  id: string,
  dnaExtractId: string,
  accession: string,
  genbankAccession: string,
  datasetName: string,

  events: {
    sequencing: SequencingEvent[],
    sequencingRuns: SequencingRunEvent[],
    assemblies: AssemblyEvent[],
    annotations: AnnotationEvent[],
    dataDepositions: DataDepositionEvent[],
  },
};

type SequenceQueryResults = {
  sequence: SequenceDetails;
};


const useTableStyles = createStyles((theme, _params, _getRef) => {
  return {
    table: {
      td: {
        height: 45,
      },
      "td:first-child": {
        textAlign: "left",
        whiteSpace: "nowrap",
        width: 1,
        paddingRight: theme.spacing.xl,
        fontSize: theme.fontSizes.sm,
        fontWeight: 300,
      },
    },
  }
});

function GenomeDetails({ sequence }: { sequence: SequenceDetails | undefined }) {
  let { classes } = useTableStyles();

  return (
    <Grid>
      <Grid.Col span={8}>
        <Table className={classes.table} w={1}>
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
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="lg" radius="lg" pos="relative" withBorder>
          <Stack>
            <Title order={5}>Original data</Title>
            <Button color="midnight" radius="md" leftIcon={<IconDownload />}>get data</Button>
            <Button color="midnight" radius="md" leftIcon={<IconLink />}>go to source</Button>
            <Button color="midnight" radius="md" leftIcon={<CloudUpload />} disabled>send to galaxy</Button>
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
    </Table>
  )
}

export default function AssemblyPage({ params }: { params: { accession: string } }) {
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
                  <Title order={5} mb={10}>Specimen information</Title>
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
