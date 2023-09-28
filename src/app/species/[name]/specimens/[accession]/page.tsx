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
  Image,
} from "@mantine/core";
import { AttributePill, DataField } from "@/components/highlight-stack";
import { ArrowNarrowLeft } from "tabler-icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArgaMap } from "@/components/mapping";
import { AccessionEvent, CollectionEvent, Specimen } from "@/queries/specimen";
import { Subsample, SubsampleEvent } from "@/queries/subsample";
import { DnaExtract, DnaExtractionEvent } from "@/queries/dna-extract";
import { AnnotationEvent, AssemblyEvent, DataDepositionEvent, Sequence, SequencingEvent, SequencingRunEvent } from "@/queries/sequence";


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
    <Box pos="relative" h={300} style={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


function Collections({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const collection = specimen?.events.collections[0];
  const coordinates = specimen?.latitude && `${specimen.latitude}, ${specimen.longitude}`;

  return (
    <Grid>
      <Grid.Col span={4}>
        <Table>
          <tbody>
            <tr>
              <td>Field identifier</td>
              <td><DataField value={collection?.fieldNumber}/></td>
            </tr>
            <tr>
              <td>Organism name</td>
              <td><DataField value={specimen?.organismId}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Table>
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
        <Table>
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
            <Table>
              <tbody>
                <tr>
                  <td>Habitat</td>
                  <td><DataField value={collection?.habitat} /></td>
                </tr>
                <tr>
                  <td>Elevation</td>
                  <td><DataField value={specimen?.elevation}/></td>
                </tr>
                <tr>
                  <td>Environment (broad)</td>
                  <td><DataField value={collection?.envBroadScale}/></td>
                </tr>
                <tr>
                  <td>Environment medium</td>
                  <td><DataField value={collection?.envMedium}/></td>
                </tr>
                <tr>
                  <td>Preparation</td>
                  <td><DataField value={collection?.preparation}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
          <Grid.Col span={6}>
            <Table>
              <tbody>
                <tr>
                  <td>Sampling protocol</td>
                  <td><DataField value={undefined} /></td>
                </tr>
                <tr>
                  <td>Depth (m)</td>
                  <td><DataField value={specimen?.depth}/></td>
                </tr>
                <tr>
                  <td>Environment (local)</td>
                  <td><DataField value={collection?.envBroadScale}/></td>
                </tr>
                <tr>
                  <td>Life stage</td>
                  <td><DataField value={collection?.lifeStage}/></td>
                </tr>
                <tr>
                  <td>Sex</td>
                  <td><DataField value={collection?.sex}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
        </Grid>

        <Table>
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
            <tr>
              <td>Field notes</td>
              <td><DataField value={collection?.fieldNotes}/></td>
            </tr>
            <tr>
              <td>Remarks</td>
              <td><DataField value={collection?.remarks}/></td>
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
  const accession = specimen?.events.accessions[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
        <tbody>
          <tr>
            <td>Registration number</td>
            <td><DataField value={accession?.accession}/></td>
          </tr>
          <tr>
            <td>Collection</td>
            <td><DataField value={specimen?.collectionCode}/></td>
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
      <Table>
        <tbody>
          <tr>
            <td>Institution</td>
            <td><DataField value={accession?.institutionName}/></td>
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
      <Table>
        <tbody>
          <tr>
            <td>Institution code</td>
            <td><DataField value={specimen?.institutionCode}/></td>
          </tr>
          <tr>
            <td>Identified date</td>
            <td><DataField value={specimen?.identifiedDate}/></td>
          </tr>
          <tr>
            <td>Identification remarks</td>
            <td><DataField value={specimen?.identificationRemarks}/></td>
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
  return (
    <SimpleGrid cols={3}>
      <Table>
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
      <Table>
        <tbody>
          <tr>
            <td>Subsampled by</td>
            <td><DataField value={subsample?.institutionName}/></td>
          </tr>
          <tr>
            <td>Remarks</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Preparation type</td>
            <td><DataField value={subsample?.events.subsamples[0].preparationType}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <td>Subsampling date</td>
            <td><DataField value={subsample?.events.subsamples[0].eventDate}/></td>
          </tr>
          <tr>
            <td>Type status</td>
            <td><DataField value={subsample?.typeStatus}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function DnaExtracts({ dnaExtract }: { dnaExtract: DnaExtractDetails | undefined }) {
  const extraction = dnaExtract?.events.dnaExtracts[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
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
          <tr>
            <td>Quality</td>
            <td><DataField value={extraction?.quality}/></td>
          </tr>
          <tr>
            <td>Absorbance 260/230</td>
            <td><DataField value={extraction?.absorbance260230}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <td>Extracted by</td>
            <td><DataField value={extraction?.extractedBy}/></td>
          </tr>
          <tr>
            <td>Protocol</td>
            <td><DataField value={extraction?.extractionMethod}/></td>
          </tr>
          <tr>
            <td>Measurement method</td>
            <td><DataField value={extraction?.measurementMethod}/></td>
          </tr>
          <tr>
            <td>Concentration method</td>
            <td><DataField value={extraction?.concentrationMethod}/></td>
          </tr>
          <tr>
            <td>Absorbance 260/280</td>
            <td><DataField value={extraction?.absorbance260280}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <td>DNA extraction date</td>
            <td><DataField value={extraction?.eventDate}/></td>
          </tr>
          <tr>
            <td>Preparation</td>
            <td><DataField value={extraction?.preparationType}/></td>
          </tr>
          <tr>
            <td>Preservation</td>
            <td><DataField value={extraction?.preservationType}/></td>
          </tr>
          <tr>
            <td>Concentration</td>
            <td><DataField value={extraction?.concentration}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function Sequencing({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
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
          <tr>
            <td>Concentration</td>
            <td><DataField value={sequencing?.concentration}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
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
          <tr>
            <td>Amplicon size</td>
            <td><DataField value={sequencing?.ampliconSize}/></td>
          </tr>
          <tr>
            <td>Bait set name</td>
            <td><DataField value={sequencing?.baitSetName}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
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
            <td><DataField value={sequencing?.eventDate}/></td>
          </tr>
          <tr>
            <td>Visualisation date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Estimated size</td>
            <td><DataField value={sequencing?.estimatedSize}/></td>
          </tr>
          <tr>
            <td>Bait set reference</td>
            <td><DataField value={sequencing?.baitSetReference}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}

function Assemblies({ sequence }: { sequence: SequenceDetails | undefined }) {
  const assembly = sequence?.events.assemblies[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
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
          <tr>
            <td>Genome size</td>
            <td><DataField value={assembly?.genomeSize}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
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
          <tr>
            <td>Version</td>
            <td><DataField value={assembly?.versionStatus}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <td>Assembly date</td>
            <td><DataField value={assembly?.eventDate}/></td>
          </tr>
          <tr>
            <td>Assembly method</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>CG content</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Name</td>
            <td><DataField value={assembly?.name}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}

function Annotations({ sequence }: { sequence: SequenceDetails | undefined }) {
  const annotation = sequence?.events.annotations[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
        <tbody>
          <tr>
            <td>Annotation number</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Representation</td>
            <td><DataField value={annotation?.representation}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
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
      <Table>
        <tbody>
          <tr>
            <td>Annotated date</td>
            <td><DataField value={annotation?.eventDate}/></td>
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
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <SimpleGrid cols={3}>
      <Table>
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
          <tr>
            <td>Data type</td>
            <td><DataField value={deposition?.dataType}/></td>
          </tr>
          <tr>
            <td>Reference</td>
            <td><DataField value={deposition?.reference}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
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
            <td>Collection</td>
            <td><DataField value={deposition?.collectionName}/></td>
          </tr>
          <tr>
            <td>Rights holder</td>
            <td><DataField value={deposition?.rightsHolder}/></td>
          </tr>
          <tr>
            <td>Title</td>
            <td><DataField value={deposition?.title}/></td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <td>Deposition date</td>
            <td><DataField value={deposition?.eventDate}/></td>
          </tr>
          <tr>
            <td>Last updated</td>
            <td><DataField value={deposition?.lastUpdated}/></td>
          </tr>
          <tr>
            <td>Access rights</td>
            <td><DataField value={deposition?.accessRights}/></td>
          </tr>
          <tr>
            <td></td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


interface EventTimelineProps {
  specimen?: SpecimenDetails,
  subsample?: SubsampleDetails,
  dnaExtract?: DnaExtractDetails,
  sequence?: SequenceDetails,
}

function EventTimeline(props: EventTimelineProps) {
  const collection = props.specimen?.events.collections[0];
  const accession = props.specimen?.events.accessions[0];
  const subsample = props.subsample?.events.subsamples[0];
  const extraction = props.dnaExtract?.events.dnaExtracts[0];
  const sequence = props.sequence?.events.sequencing[0];
  const assembly = props.sequence?.events.assemblies[0];
  const annotation = props.sequence?.events.annotations[0];
  const deposition = props.sequence?.events.dataDepositions[0];

  return (
    <Timeline color="midnight" active={8} bulletSize={45} lineWidth={4}>
      <Timeline.Item bullet={<Image src='/timeline-icons/collection.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Collection</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={collection?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/accession.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Accession</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={accession?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/subsampling.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Subsampling</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={subsample?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/extraction.svg'/>} title={<Text fz="sm" ml={20} fw={700}>DNA extraction</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={extraction?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/sequencing.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Amplification and sequencing</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={sequence?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/assembly.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Sequence assembly</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={assembly?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/annotation.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Sequence annotation</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={annotation?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/deposition.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Data deposition</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
          <DataField value={deposition?.eventDate} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<Image src='/timeline-icons/data-reuse.svg'/>} title={<Text fz="sm" ml={20} fw={700}>Data reuse</Text>}>
        <Group>
          <Text ml={30} fz="xs" fw={300}>Event date</Text>
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
    <Stack gap={20}>
      <Link href={basePath || ''}>
        <Group gap={5}>
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
            <Paper p={15} bg="#d6e4ed" h="100%" style={{ borderRadius: "10px 0 10px 10px" }}>
              <EventTimeline
                specimen={data?.specimen}
                subsample={data?.subsample}
                dnaExtract={data?.dnaExtract}
                sequence={data?.sequence}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={9}>
            <Stack>
              <Paper px={20} pt={30} pb={15} bg="#eaf1f5" style={{ borderRadius: "0 10px 10px 0" }}>
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
