"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { LoadPanel } from "@/app/components/load-overlay";
import { AttributePill, DataField } from "@/app/components/highlight-stack";
import { ArrowNarrowLeft, CircleCheck, CircleX, CloudUpload, Download as IconDownload, Link as IconLink } from "tabler-icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CopyableData, useTableStyles } from "@/app/components/data-fields";

const GET_ASSEMBLY = gql`
  query MarkerFullData($accession: String) {
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
  materialSampleId?: string,
  sequencedBy?: string,
  targetGene?: string,
  ampliconSize?: string,
  estimatedSize?: string,
  concentration?: string,
  baitSetName?: string,
  baitSetReference?: string,
  sourceMolecule?: string,
  dnaSequence?: string,
  translation?: string,
}

type SequencingRunEvent = {
  id: string,
  traceName?: string,
  traceId?: string,
  traceLink?: string,
  targetGene?: string,
  sequencingDate?: string,
  sequencingEventId?: string,
  sequencingMethod?: string,
  sequencingCenter?: string,
  sequencingCenterCode?: string,
  sequencePrimerForwardName?: string,
  sequencingPrimerReverseName?: string,
  direction?: string,
  analysisSoftware?: string,
  analysisDescription?: string,
  libraryProtocol?: string,
}

type DataDepositionEvent = {
  dataType?: string,
  institutionName?: string,
  collectionName?: string,
  collectionCode?: string,
  materialSampleId?: string,
  submittedBy?: string,
  asmNotLiveDate?: string,
  excludedFromRefseq?: string,
  lastUpdated?: string,
  title?: string,
  url?: string,
  fundingAttribution?: string,
  reference?: string,
  accessRights?: string,
  rightsHolder?: string,
  sourceUri?: string,
}

type SequenceDetails = {
  id: string,
  dnaExtractId: string,
  accession: string,
  genbankAccession?: string,
  datasetName: string,

  events: {
    sequencing: SequencingEvent[],
    sequencingRuns: SequencingRunEvent[],
    dataDepositions: DataDepositionEvent[],
  },
};

type SequenceQueryResults = {
  sequence: SequenceDetails;
};


function MoleculeDetails({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const sequencing = sequence?.events.sequencing[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Grid>
      <Grid.Col span={8}>
        <Table className={classes.table} w={1}>
          <tbody>
          <tr>
            <td>Gene name</td>
            <td><AttributePill value={sequencing?.targetGene} /></td>
          </tr>
          <tr>
            <td>Sequence length</td>
            <td><AttributePill value={sequencing?.ampliconSize} /></td>
          </tr>
          <tr>
            <td>Source molecule</td>
            <td><AttributePill value={sequencing?.sourceMolecule} /></td>
          </tr>
          <tr>
            <td>Sequencing method</td>
            <td><DataField value={undefined} /></td>
          </tr>
          <tr>
            <td>Release date</td>
            <td><DataField value={undefined} /></td>
          </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="lg" radius="lg" pos="relative" withBorder>
          <Stack>
            <Title order={5}>Original data</Title>
            <Button color="midnight" radius="md" leftIcon={<IconDownload />}>get FASTA</Button>
            <Button color="midnight" radius="md" leftIcon={<IconLink />}>go to source</Button>
            <Button color="midnight" radius="md" leftIcon={<CloudUpload />} disabled>send to Galaxy</Button>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <Table className={classes.table}>
          <tbody>
          <tr>
            <td>Publication</td>
            <td><DataField value={deposition?.reference} /></td>
          </tr>
          <tr>
            <td>Sequence</td>
            <td>
              { sequencing?.dnaSequence
                ?<CopyableData value={sequencing.dnaSequence} />
                : <DataField value={undefined} />
              }
            </td>
          </tr>
          <tr>
            <td>Translation</td>
            <td>
              { sequencing?.translation
                ?<CopyableData value={sequencing.translation} />
                : <DataField value={undefined} />
              }
            </td>
          </tr>
          </tbody>
        </Table>
      </Grid.Col>
    </Grid>
  )
}

function TraceData({ sequence }: { sequence: SequenceDetails | undefined }) {
  return (
    <>
    </>
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
  const sequencingRun = sequence?.events.sequencingRuns[0];
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <Stack>
      <DataAvailabilityItem value={!!sequencing?.dnaSequence}>Marker data available</DataAvailabilityItem>
      <DataAvailabilityItem value={false}>Contig data available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!sequencingRun?.traceLink}>Trace files available</DataAvailabilityItem>
      <DataAvailabilityItem value={!!deposition?.url}>Marker publication available</DataAvailabilityItem>
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
        <td>Sequence author</td>
        <td><DataField value={sequence?.events.sequencing[0]?.sequencedBy} /></td>
      </tr>
      <tr>
        <td>Institution</td>
        <td><DataField value={sequence?.events.dataDepositions[0]?.institutionName} /></td>
      </tr>
      <tr>
        <td>Deposited by</td>
        <td><DataField value={sequence?.events.dataDepositions[0]?.submittedBy} /></td>
      </tr>
      </tbody>
    </Table>
  )
}

function AmplificationMethods({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <Table className={classes.table}>
      <tbody>
      <tr>
        <td>Primer forward</td>
        <td><DataField value={sequencingRun?.sequencePrimerForwardName} /></td>
      </tr>
      <tr>
        <td>Primer reverse</td>
        <td><DataField value={sequencingRun?.sequencingPrimerReverseName} /></td>
      </tr>
      <tr>
        <td>Data source</td>
        <td><DataField value={sequence?.datasetName} /></td>
      </tr>
      </tbody>
    </Table>
  )
}


export default function MarkerPage({ params }: { params: { accession: string } }) {
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
          <Text fz={18}>Back to markers</Text>
        </Group>
      </Link>

      <Paper p="md" radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Full data view: ${data?.sequence.accession}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
          <Text fz="sm" c="dimmed" weight={700}>{data?.sequence.datasetName}</Text>
        </Group>

        <Grid>
              <Grid.Col span={6}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5}>Molecule data</Title>
                  <MoleculeDetails sequence={data?.sequence} />
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={3}>
                <LoadPanel visible={loading} h={450}>
                  <Title order={5} mb={10}>Data availability</Title>
                  <DataAvailability sequence={data?.sequence} />
                </LoadPanel>
              </Grid.Col>

          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Trace data</Title>
              <TraceData sequence={data?.sequence} />
            </LoadPanel>
          </Grid.Col>


          <Grid.Col span={4}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Data provenance</Title>
              <DataProvenance sequence={data?.sequence} />
            </LoadPanel>
          </Grid.Col>
          <Grid.Col span={5}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Specimen information</Title>
            </LoadPanel>
          </Grid.Col>
          <Grid.Col span={3}>
            <LoadPanel visible={loading}>
              <Title order={5} mb={10}>Amplification methods</Title>
              <AmplificationMethods sequence={data?.sequence} />
            </LoadPanel>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
