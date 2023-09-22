"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import { AttributePill, DataField } from "@/app/components/highlight-stack";
import { ArrowNarrowLeft, CircleCaretUp} from "tabler-icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTableStyles } from "@/app/components/data-fields";
import { ArgaMap } from "@/app/components/mapping";
import { AccessionEvent, CollectionEvent, Specimen } from "@/app/queries/specimen";
import { Subsample, SubsampleEvent } from "@/app/queries/subsample";
import { DnaExtract, DnaExtractionEvent } from "@/app/queries/dna-extract";
import { AnnotationEvent, AssemblyEvent, DataDepositionEvent, Sequence, SequencingEvent, SequencingRunEvent } from "@/app/queries/sequence";


const GET_SPECIMEN = gql`
  query SpecimenFullData($recordId: String) {
    specimen(by: { recordId: $recordId }) {
      ...SpecimenDetails
      events {
        collections { ...CollectionEventDetails }
        accessions { ...AccessionEventDetails }
      }
    }

    subsample(by: { specimenRecordId: $recordId }) {
      ...SubsampleDetails
      events {
        subsamples { ...SubsampleEventDetails }
      }
    }

    dnaExtract(by: { specimenRecordId: $recordId }) {
      ...DnaExtractDetails
      events {
        dnaExtracts { ...DnaExtractionEventDetails }
      }
    }

    sequence(by: { specimenRecordId: $recordId }) {
      ...SequenceDetails
      events {
        sequencing { ...SequencingEventDetails }
        sequencingRuns { ...SequencingRunEventDetails }
        assemblies { ...AssemblyEventDetails }
        annotations { ...AnnotationEventDetails }
        dataDepositions { ...DataDepositionEventDetails }
      }
    }

  }
`;

type SpecimenDetails = Specimen & {
  events: {
    collections: CollectionEvent[],
    accessions: AccessionEvent[],
  },
};

type SubsampleDetails = Subsample & {
  events: {
    subsamples: SubsampleEvent[],
  },
};

type DnaExtractDetails = DnaExtract & {
  events: {
    dnaExtracts: DnaExtractionEvent[],
  },
};

type SequenceDetails = Sequence & {
  events: {
    sequencing: SequencingEvent[],
    sequencingRuns: { id: string } & SequencingRunEvent[],
    assemblies: AssemblyEvent[],
    annotations: AnnotationEvent[],
    dataDepositions: DataDepositionEvent[],
  },
}

type SpecimenQueryResults = {
  specimen: SpecimenDetails;
  subsample: SubsampleDetails;
  dnaExtract: DnaExtractDetails;
  sequence: SequenceDetails;
};


function SpecimenMap({ specimen }: { specimen : SpecimenDetails | undefined }) {
  return (
    <Box pos="relative" h={300} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


function Collections({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const { classes } = useTableStyles();
  const collection = specimen?.events.collections[0];
  const coordinates = specimen?.latitude && `${specimen.latitude}, ${specimen.longitude}`;

  return (
    <Grid>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Field identifier</td>
              <td><DataField value={undefined}/></td>
            </tr>
            <tr>
              <td>Organism name</td>
              <td><DataField value={specimen?.organismId}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Collected by</td>
              <td><DataField value={specimen?.recordedBy}/></td>
            </tr>
            <tr>
              <td>Identified by</td>
              <td><DataField value={specimen?.identifiedBy}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Collection location</td>
              <td><DataField value={specimen?.locality} /></td>
            </tr>
            <tr>
              <td>Coordinates</td>
              <td><DataField value={coordinates}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>

      <Grid.Col span={8}>
        <Grid>
          <Grid.Col span={6}>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td>Habitat</td>
                  <td><DataField value={collection?.envBroadScale} /></td>
                </tr>
                <tr>
                  <td>Elevation</td>
                  <td><DataField value={specimen?.elevation}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
          <Grid.Col span={6}>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td>Sampling protocol</td>
                  <td><DataField value={undefined} /></td>
                </tr>
                <tr>
                  <td>Depth (m)</td>
                  <td><DataField value={specimen?.depth}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
        </Grid>

        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Fixation method</td>
              <td><DataField value={collection?.preparation} /></td>
            </tr>
            <tr>
              <td>Other data</td>
              <td><DataField value={specimen?.remarks}/></td>
            </tr>
            <tr>
              <td>Source</td>
              <td><DataField value={specimen?.institutionName}/></td>
            </tr>
            <tr>
              <td>Publication</td>
              <td><DataField value={undefined}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenMap specimen={specimen}/>
      </Grid.Col>
    </Grid>
  )
}


function Accessions({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const { classes } = useTableStyles();
  const accession = specimen?.events.accessions[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Registration number</td>
            <td><DataField value={accession?.accession}/></td>
          </tr>
          <tr>
            <td>Institution</td>
            <td><DataField value={accession?.institutionName}/></td>
          </tr>
          <tr>
            <td>Type status</td>
            <td><AttributePill value={accession?.typeStatus}/></td>
          </tr>
          <tr>
            <td>Organism name</td>
            <td><DataField value={specimen?.organismId}/></td>
          </tr>
          <tr>
            <td>Disposition</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Collection</td>
            <td><DataField value={specimen?.collectionCode}/></td>
          </tr>
          <tr>
            <td>Identified by</td>
            <td><DataField value={specimen?.identifiedBy}/></td>
          </tr>
          <tr>
            <td>Fixation method</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function Subsamples({ subsample }: { subsample: SubsampleDetails | undefined }) {
  const { classes } = useTableStyles();

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Sample number</td>
            <td><DataField value={subsample?.materialSampleId}/></td>
          </tr>
          <tr>
            <td>Subsample available</td>
            <td><AttributePill value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Subsampled by</td>
            <td><DataField value={subsample?.institutionName}/></td>
          </tr>
          <tr>
            <td>Remarks</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Subsampling date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function DnaExtracts({ dnaExtract }: { dnaExtract: DnaExtractDetails | undefined }) {
  const { classes } = useTableStyles();
  const extraction = dnaExtract?.events.dnaExtracts[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Extraction number</td>
            <td><DataField value={dnaExtract?.recordId}/></td>
          </tr>
          <tr>
            <td>Extract available</td>
            <td><AttributePill value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Extracted by</td>
            <td><DataField value={extraction?.extractedBy}/></td>
          </tr>
          <tr>
            <td>Protocol</td>
            <td><DataField value={extraction?.extractionMethod}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>DNA extraction date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function Sequencing({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const sequencing = sequence?.events.sequencing[0];
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Amplification number</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Target region</td>
            <td><DataField value={sequencing?.targetGene}/></td>
          </tr>
          <tr>
            <td>Sequence numbers</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Sequencing protocol</td>
            <td><DataField value={sequencingRun?.libraryProtocol}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={sequence?.datasetName}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Amplified by</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Primer forward</td>
            <td><DataField value={sequencingRun?.sequencePrimerForwardName}/></td>
          </tr>
          <tr>
            <td>Sequenced by</td>
            <td><DataField value={sequencing?.sequencedBy}/></td>
          </tr>
          <tr>
            <td>Visualised by</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Amplification date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Primer reverse</td>
            <td><DataField value={sequencingRun?.sequencingPrimerReverseName}/></td>
          </tr>
          <tr>
            <td>Sequencing date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Visualisation date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}

function Assemblies({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const assembly = sequence?.events.assemblies[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Assembly number</td>
            <td><DataField value={assembly?.name}/></td>
          </tr>
          <tr>
            <td>Assembly level</td>
            <td><AttributePill value={assembly?.quality}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Assembled by</td>
            <td><DataField value={assembly?.assembledBy}/></td>
          </tr>
          <tr>
            <td>Institution</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Number of scaffolds</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Assembly date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Assembly method</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>CG content</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}

function Annotations({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const annotation = sequence?.events.annotations[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Annotation number</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Genome size</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Annotated by</td>
            <td><DataField value={annotation?.annotatedBy}/></td>
          </tr>
          <tr>
            <td>Institution</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Coverage</td>
            <td><DataField value={annotation?.coverage}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Annotated date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Annotation method</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>BUSCO score</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}

function Depositions({ sequence }: { sequence: SequenceDetails | undefined }) {
  const { classes } = useTableStyles();
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Accession number</td>
            <td><DataField value={deposition?.accession}/></td>
          </tr>
          <tr>
            <td>Sample number</td>
            <td><DataField value={deposition?.materialSampleId}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Deposited by</td>
            <td><DataField value={deposition?.submittedBy}/></td>
          </tr>
          <tr>
            <td>Institution</td>
            <td><DataField value={deposition?.institutionName}/></td>
          </tr>
          <tr>
            <td>Release type</td>
            <td><AttributePill value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Deposition date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Organism name</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Representation</td>
            <td><AttributePill value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function EventTimeline({ specimen }: { specimen: SpecimenDetails | undefined }) {
  return (
    <Timeline color="midnight" active={8} bulletSize={45} lineWidth={4}>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Collection</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Accession</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Subsampling</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>DNA extraction</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Amplification and sequencing</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Sequence assembly</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Sequence annotation</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Data deposition</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Data reuse</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
    </Timeline>
  )
}


export default function SpecimenPage({ params }: { params: { accession: string } }) {
  let basePath = usePathname()?.replace(params.accession, '');

  const { loading, error, data } = useQuery<SpecimenQueryResults>(GET_SPECIMEN, {
    variables: {
      recordId: params.accession,
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
          <Text fz={18}>Back to specimens</Text>
        </Group>
      </Link>

      <Paper p={20} radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Complete specimen view: ${data?.specimen.recordId}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
        </Group>

        <Grid gutter={0}>
          <Grid.Col span={3}>
            <Paper p={15} bg="#d6e4ed" h="100%" sx={{ borderRadius: "10px 0 10px 10px" }}>
              <EventTimeline specimen={data?.specimen} />
            </Paper>
          </Grid.Col>

          <Grid.Col span={9}>
            <Stack>
              <Paper px={20} pt={30} pb={15} bg="#eaf1f5" sx={{ borderRadius: "0 10px 10px 0" }}>
                <Title order={5}>Collection event</Title>
                <Collections specimen={data?.specimen} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Accession event</Title>
                <Accessions specimen={data?.specimen} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Subsample event</Title>
                <Subsamples subsample={data?.subsample} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>DNA extraction event</Title>
                <DnaExtracts dnaExtract={data?.dnaExtract} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Amplificaton and sequencing event</Title>
                <Sequencing sequence={data?.sequence} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Sequence assembly event</Title>
                <Assemblies sequence={data?.sequence} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Sequence annotation event</Title>
                <Annotations sequence={data?.sequence} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Data deposition event</Title>
                <Depositions sequence={data?.sequence} />
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
