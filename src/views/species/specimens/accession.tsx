"use client";

import "@mantine/carousel/styles.css";
import classes from "./event-block.module.css";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Timeline,
  Title,
  Image,
  Button,
  Collapse,
  Table,
  Tooltip,
} from "@mantine/core";
import { AttributePill, DataField } from "@/components/highlight-stack";
import {
  IconArrowNarrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnalysisMap } from "@/components/mapping";
import { Marker } from "@/components/mapping/analysis-map";
import { AccessionEvent, CollectionEvent, Specimen } from "@/queries/specimen";
import { Subsample, SubsampleEvent } from "@/queries/subsample";
import { DnaExtract, DnaExtractionEvent } from "@/queries/dna-extract";
import {
  AnnotationEvent,
  AssemblyEvent,
  DataDepositionEvent,
  Sequence,
  SequencingEvent,
  SequencingRunEvent,
} from "@/queries/sequence";
import { DataTable, DataTableRow } from "@/components/data-table";
import { Carousel, Embla } from "@mantine/carousel";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { DateTime } from "luxon";

const GET_SPECIMEN = gql`
  query SpecimenFullData($recordId: String) {
    specimen(by: { recordId: $recordId }) {
      ...SpecimenDetails
      events {
        collections {
          ...CollectionEventDetails
        }
        accessions {
          ...AccessionEventDetails
        }
      }
    }

    subsample(by: { specimenRecordId: $recordId }) {
      ...SubsampleDetails
      events {
        subsamples {
          ...SubsampleEventDetails
        }
      }
    }

    dnaExtract(by: { specimenRecordId: $recordId }) {
      ...DnaExtractDetails
      events {
        dnaExtracts {
          ...DnaExtractionEventDetails
        }
      }
    }

    sequence(by: { specimenRecordId: $recordId }) {
      ...SequenceDetails
      events {
        sequencing {
          ...SequencingEventDetails
        }
        sequencingRuns {
          ...SequencingRunEventDetails
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
  }
`;

type SpecimenDetails = Specimen & {
  events: {
    collections: CollectionEvent[];
    accessions: AccessionEvent[];
  };
};

type SubsampleDetails = Subsample & {
  events: {
    subsamples: SubsampleEvent[];
  };
};

type DnaExtractDetails = DnaExtract & {
  events: {
    dnaExtracts: DnaExtractionEvent[];
  };
};

type SequenceDetails = Sequence & {
  events: {
    sequencing: SequencingEvent[];
    sequencingRuns: { id: string } & SequencingRunEvent[];
    assemblies: AssemblyEvent[];
    annotations: AnnotationEvent[];
    dataDepositions: DataDepositionEvent[];
  };
};

type SpecimenQueryResults = {
  specimen: SpecimenDetails;
  subsample: SubsampleDetails;
  dnaExtract: DnaExtractDetails;
  sequence: SequenceDetails[];
};

const GET_PROVENANCE = gql`
  query Provenance($entityId: String) {
    provenance {
      specimen(by: { entityId: $entityId }) {
        operationId
        entityId
        loggedAt
        action
        atom {
          ... on SpecimenAtomText {
            type
            value
          }
          ... on SpecimenAtomNumber {
            type
            value
          }
        }
        dataset {
          id
          name
          shortName
          rightsHolder
          citation
          license
          description
          url
        }
      }
    }
  }
`;

enum AtomTextType {
  Empty,
  ScientificName,
  ActedOn,
  NomenclaturalAct,
  Publication,
  SourceUrl,
}

enum AtomNumberType {
  CreatedAt,
  UpdatedAt,
}

interface AtomText {
  type: AtomTextType;
  value: string;
}

interface AtomNumber {
  type: AtomNumberType;
  value: string;
}

interface Dataset {
  id: string;
  name: string;
  shortName?: string;
  rightsHolder?: string;
  citation?: string;
  license?: string;
  description?: string;
  url?: string;
}

type ProvenanceQuery = {
  provenance: {
    specimen: [
      {
        operationId: string;
        entityId: string;
        action: string;
        atom: AtomText | AtomNumber;
        dataset: Dataset;
        loggedAt: string;
      }
    ];
  };
};

function Provenance({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<ProvenanceQuery>(GET_PROVENANCE, {
    variables: { entityId },
  });

  if (loading) return "Loading";
  if (error) return error.message;

  return (
    <Table mt={130}>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Logged at
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Operation ID
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Reference ID
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Dataset
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Action
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="xs" fw={600}>
              Atom
            </Text>
          </Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.provenance.specimen.map((op) => (
          <Table.Tr key={op.operationId}>
            <Table.Td>
              <Text fz="xs" fw={400}>
                {DateTime.fromISO(op.loggedAt).toHTTP()}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" fw={400}>
                {op.operationId}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" fw={400}>
                {op.entityId}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" fw={400}>
                <Tooltip label={op.dataset.name}>
                  <Link href={op.dataset.url || "#"}>
                    {op.dataset.shortName}
                  </Link>
                </Tooltip>
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" fw={400}>
                {op.action}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" fw={600}>
                {op.atom.type}{" "}
              </Text>
              <Text fz="xs" fw={400}>
                {op.atom.value}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function SpecimenMap({ specimen }: { specimen: SpecimenDetails | undefined }) {
  let position: [number, number] | undefined =
    specimen && specimen.latitude && specimen.longitude
      ? [Number(specimen.latitude), Number(specimen.longitude)]
      : undefined;

  let marker =
    position &&
    ({
      recordId: specimen?.recordId,
      latitude: position[0],
      longitude: position[1],
      color: [103, 151, 180, 220],
    } as Marker);

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

function Collections({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const [opened, { toggle }] = useDisclosure(false);

  const collection = specimen?.events.collections[0];
  const coordinates =
    specimen?.latitude && `${specimen.latitude}, ${specimen.longitude}`;

  return (
    <Grid>
      <Grid.Col span={{ base: 4, md: 4, sm: 12 }}>
        <DataTable>
          <DataTableRow label="Field identifier">
            <DataField value={collection?.fieldNumber} />
          </DataTableRow>
          <DataTableRow label="Organism name">
            <DataField value={specimen?.organismId} />
          </DataTableRow>
          <DataTableRow label="Habitat">
            <DataField value={collection?.habitat} />
          </DataTableRow>
          <DataTableRow label="Elevation">
            <DataField value={specimen?.elevation} />
          </DataTableRow>
          <DataTableRow label="Environment (broad)">
            <DataField value={collection?.envBroadScale} />
          </DataTableRow>
          <DataTableRow label="Environment medium">
            <DataField value={collection?.envMedium} />
          </DataTableRow>
          <DataTableRow label="Preparation">
            <DataField value={collection?.preparation} />
          </DataTableRow>

          <DataTableRow label="Fixation method">
            <DataField value={undefined} />
          </DataTableRow>
          <DataTableRow label="Other data">
            <DataField value={specimen?.remarks} />
          </DataTableRow>
          <DataTableRow label="Source">
            <DataField value={specimen?.institutionName} />
          </DataTableRow>
          <DataTableRow label="Publication">
            <DataField value={undefined} />
          </DataTableRow>
          <DataTableRow label="Field notes">
            <DataField value={collection?.fieldNotes} />
          </DataTableRow>
          <DataTableRow label="Remarks">
            <DataField value={collection?.remarks} />
          </DataTableRow>
        </DataTable>
      </Grid.Col>

      <Grid.Col span={{ base: 4, md: 4, sm: 12 }}>
        <DataTable>
          <DataTableRow label="Collected by">
            <DataField value={specimen?.recordedBy} />
          </DataTableRow>
          <DataTableRow label="Identified by">
            <DataField value={specimen?.identifiedBy} />
          </DataTableRow>
          <DataTableRow label="Sampling protocol">
            <DataField value={undefined} />
          </DataTableRow>
          <DataTableRow label="Depth (m)">
            <DataField value={specimen?.depth} />
          </DataTableRow>
          <DataTableRow label="Environment (local)">
            <DataField value={collection?.envLocalScale} />
          </DataTableRow>
          <DataTableRow label="Life stage">
            <DataField value={collection?.lifeStage} />
          </DataTableRow>
          <DataTableRow label="Sex">
            <DataField value={collection?.sex} />
          </DataTableRow>
        </DataTable>
      </Grid.Col>

      <Grid.Col span={{ base: 4, md: 4, sm: 12 }}>
        <DataTable>
          <DataTableRow label="Collection location">
            <DataField value={specimen?.locality} />
          </DataTableRow>
          <DataTableRow label="Coordinates">
            <DataField value={coordinates} />
          </DataTableRow>
        </DataTable>

        <SpecimenMap specimen={specimen} />
      </Grid.Col>

      <Grid.Col span={12}>
        <Group justify="center" mb={5}>
          <Button onClick={toggle} variant="subtle" color="midnight.4">
            View changes
          </Button>
        </Group>
        <Collapse in={opened}>
          {opened && specimen?.entityId && (
            <Provenance entityId={specimen.entityId} />
          )}
        </Collapse>
      </Grid.Col>
    </Grid>
  );
}

function Accessions({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const accession = specimen?.events.accessions[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Registration number">
          <DataField value={accession?.accession} />
        </DataTableRow>
        <DataTableRow label="Collection">
          <DataField value={specimen?.collectionCode} />
        </DataTableRow>
        <DataTableRow label="Type status">
          <AttributePill value={accession?.typeStatus} />
        </DataTableRow>
        <DataTableRow label="Organism name">
          <DataField value={specimen?.organismId} />
        </DataTableRow>
        <DataTableRow label="Disposition">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Institution">
          <DataField value={accession?.institutionName} />
        </DataTableRow>
        <DataTableRow label="Identified by">
          <DataField value={specimen?.identifiedBy} />
        </DataTableRow>
        <DataTableRow label="Fixation method">
          <DataField value={undefined} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Institution code">
          <DataField value={accession?.institutionCode} />
        </DataTableRow>
        <DataTableRow label="Identified date">
          <DataField value={specimen?.identifiedDate} />
        </DataTableRow>
        <DataTableRow label="Identification remarks">
          <DataField value={specimen?.identificationRemarks} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function Subsamples({
  subsample,
}: {
  subsample: SubsampleDetails | undefined;
}) {
  const event = subsample?.events.subsamples[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Sample number">
          <DataField value={subsample?.materialSampleId} />
        </DataTableRow>
        <DataTableRow label="Subsample available">
          <AttributePill value={undefined} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Subsampled by">
          <DataField value={event?.subsampledBy} />
        </DataTableRow>
        <DataTableRow label="Remarks">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Preparation type">
          <DataField value={event?.preparationType} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Subsampling date">
          <DataField value={event?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Type status">
          <DataField value={subsample?.typeStatus} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function DnaExtracts({
  dnaExtract,
}: {
  dnaExtract: DnaExtractDetails | undefined;
}) {
  const extraction = dnaExtract?.events.dnaExtracts[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Extraction number">
          <DataField value={dnaExtract?.recordId} />
        </DataTableRow>
        <DataTableRow label="Extract available">
          <AttributePill value={undefined} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Quality">
          <DataField value={extraction?.quality} />
        </DataTableRow>
        <DataTableRow label="Absorbance 260/230">
          <DataField value={extraction?.absorbance260230} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Extracted by">
          <DataField value={extraction?.extractedBy} />
        </DataTableRow>
        <DataTableRow label="Protocol">
          <DataField value={extraction?.extractionMethod} />
        </DataTableRow>
        <DataTableRow label="Measurement method">
          <DataField value={extraction?.measurementMethod} />
        </DataTableRow>
        <DataTableRow label="Concentration method">
          <DataField value={extraction?.concentrationMethod} />
        </DataTableRow>
        <DataTableRow label="Absorbance 260/280">
          <DataField value={extraction?.absorbance260280} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="DNA Extraction date">
          <DataField value={extraction?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Preparation">
          <DataField value={extraction?.preparationType} />
        </DataTableRow>
        <DataTableRow label="Preservation">
          <DataField value={extraction?.preservationType} />
        </DataTableRow>
        <DataTableRow label="Concentration">
          <DataField value={extraction?.concentration} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function Sequencing({ sequence }: { sequence: SequenceDetails | undefined }) {
  const sequencing = sequence?.events.sequencing[0];
  const sequencingRun = sequence?.events.sequencingRuns[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Amplification number">
          <DataField value={sequence?.recordId} />
        </DataTableRow>
        <DataTableRow label="Target region">
          <DataField value={sequencing?.targetGene} />
        </DataTableRow>
        <DataTableRow label="Sequence numbers">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Sequencing protocol">
          <DataField value={sequencingRun?.libraryProtocol} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={sequence?.datasetName} />
        </DataTableRow>
        <DataTableRow label="Concentration">
          <DataField value={sequencing?.concentration} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Amplified by">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Primer forward">
          <DataField value={sequencingRun?.sequencePrimerForwardName} />
        </DataTableRow>
        <DataTableRow label="Sequenced by">
          <DataField value={sequencing?.sequencedBy} />
        </DataTableRow>
        <DataTableRow label="Visualised by">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Amplicon size">
          <DataField value={sequencing?.ampliconSize} />
        </DataTableRow>
        <DataTableRow label="Bait set name">
          <DataField value={sequencing?.baitSetName} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Amplification date">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Primer reverse">
          <DataField value={sequencingRun?.sequencingPrimerReverseName} />
        </DataTableRow>
        <DataTableRow label="Sequencing date">
          <DataField value={sequencing?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Visualisation date">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Estimated size">
          <DataField value={sequencing?.estimatedSize} />
        </DataTableRow>
        <DataTableRow label="Bait set reference">
          <DataField value={sequencing?.baitSetReference} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function Assemblies({ sequence }: { sequence: SequenceDetails | undefined }) {
  const assembly = sequence?.events.assemblies[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Assembly number">
          <DataField value={assembly?.name} />
        </DataTableRow>
        <DataTableRow label="Assembly level">
          <AttributePill value={assembly?.quality} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Genome size">
          <DataField value={assembly?.genomeSize} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Assembled by">
          <DataField value={assembly?.assembledBy} />
        </DataTableRow>
        <DataTableRow label="Institution">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Number of scaffolds">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Version">
          <DataField value={assembly?.versionStatus} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Assembly date">
          <DataField value={assembly?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Assembly method">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="CG content">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Name">
          <DataField value={assembly?.name} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function Annotations({ sequence }: { sequence: SequenceDetails | undefined }) {
  const annotation = sequence?.events.annotations[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Annotation number">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Representation">
          <DataField value={annotation?.representation} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Annotated by">
          <DataField value={annotation?.annotatedBy} />
        </DataTableRow>
        <DataTableRow label="Institution">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Coverage">
          <DataField value={annotation?.coverage} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Annotated date">
          <DataField value={annotation?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Annotation method">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="BUSCO score">
          <DataField value={undefined} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

function Depositions({ sequence }: { sequence: SequenceDetails | undefined }) {
  const deposition = sequence?.events.dataDepositions[0];

  return (
    <SimpleGrid cols={3}>
      <DataTable>
        <DataTableRow label="Accession number">
          <DataField value={deposition?.accession} />
        </DataTableRow>
        <DataTableRow label="Sample number">
          <DataField value={deposition?.materialSampleId} />
        </DataTableRow>
        <DataTableRow label="Data source">
          <DataField value={undefined} />
        </DataTableRow>
        <DataTableRow label="Data type">
          <DataField value={deposition?.dataType} />
        </DataTableRow>
        <DataTableRow label="Reference">
          <DataField value={deposition?.reference} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Deposited by">
          <DataField value={deposition?.submittedBy} />
        </DataTableRow>
        <DataTableRow label="Institution">
          <DataField value={deposition?.institutionName} />
        </DataTableRow>
        <DataTableRow label="Collection">
          <DataField value={deposition?.collectionName} />
        </DataTableRow>
        <DataTableRow label="Rights holder">
          <DataField value={deposition?.rightsHolder} />
        </DataTableRow>
        <DataTableRow label="Title">
          <DataField value={deposition?.title} />
        </DataTableRow>
      </DataTable>

      <DataTable>
        <DataTableRow label="Deposition date">
          <DataField value={deposition?.eventDate} />
        </DataTableRow>
        <DataTableRow label="Last updated">
          <DataField value={deposition?.lastUpdated} />
        </DataTableRow>
        <DataTableRow label="Access rights">
          <DataField value={deposition?.accessRights} />
        </DataTableRow>
      </DataTable>
    </SimpleGrid>
  );
}

interface EventTimelineProps {
  specimen?: SpecimenDetails;
  subsample?: SubsampleDetails;
  dnaExtract?: DnaExtractDetails;
  sequences?: SequenceDetails[];
}

function EventTimeline(props: EventTimelineProps) {
  const collection = props.specimen?.events.collections[0];
  const accession = props.specimen?.events.accessions[0];
  const subsample = props.subsample?.events.subsamples[0];
  const extraction = props.dnaExtract?.events.dnaExtracts[0];

  const sequencing = props.sequences
    ?.map((seq) => seq.events.sequencing)
    .flat();
  const assemblies = props.sequences
    ?.map((seq) => seq.events.assemblies)
    .flat();
  const annotations = props.sequences
    ?.map((seq) => seq.events.annotations)
    .flat();
  const depositions = props.sequences
    ?.map((seq) => seq.events.dataDepositions)
    .flat();

  return (
    <Timeline color="midnight" active={8} bulletSize={45} lineWidth={4}>
      <Timeline.Item
        bullet={
          <Image alt="Collection" src="/timeline-icons/collection.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Collection
          </Text>
        }
      >
        <Group>
          <Text ml={30} fz="xs" fw={300}>
            Event date
          </Text>
          <DataField value={collection?.eventDate} fz="xs" />
        </Group>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Accession" src="/timeline-icons/accession.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Accession
          </Text>
        }
      >
        <Group>
          <Text ml={30} fz="xs" fw={300}>
            Event date
          </Text>
          <DataField value={accession?.eventDate} fz="xs" />
        </Group>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image
            alt="Subsampling"
            src="/timeline-icons/subsampling.svg"
            w={50}
          />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Subsampling
          </Text>
        }
      >
        <Group>
          <Text ml={30} fz="xs" fw={300}>
            Event date
          </Text>
          <DataField value={subsample?.eventDate} fz="xs" />
        </Group>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Extraction" src="/timeline-icons/extraction.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            DNA extraction
          </Text>
        }
      >
        <Group>
          <Text ml={30} fz="xs" fw={300}>
            Event date
          </Text>
          <DataField value={extraction?.eventDate} fz="xs" />
        </Group>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Sequencing" src="/timeline-icons/sequencing.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Amplification and sequencing
          </Text>
        }
      >
        <Stack gap={0}>
          {sequencing?.map((event, idx) => (
            <Group key={idx}>
              <Text ml={30} fz="xs" fw={300}>
                Event date
              </Text>
              <DataField value={event?.eventDate} fz="xs" />
            </Group>
          ))}
        </Stack>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Assembly" src="/timeline-icons/assembly.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Sequence assembly
          </Text>
        }
      >
        <Stack gap={0}>
          {assemblies?.map((event, idx) => (
            <Group key={idx}>
              <Text ml={30} fz="xs" fw={300}>
                Event date
              </Text>
              <DataField value={event?.eventDate} fz="xs" />
            </Group>
          ))}
        </Stack>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Annotation" src="/timeline-icons/annotation.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Sequence annotation
          </Text>
        }
      >
        <Stack gap={0}>
          {annotations?.map((event, idx) => (
            <Group key={idx}>
              <Text ml={30} fz="xs" fw={300}>
                Event date
              </Text>
              <DataField value={event?.eventDate} fz="xs" />
            </Group>
          ))}
        </Stack>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Deposition" src="/timeline-icons/deposition.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Data deposition
          </Text>
        }
      >
        <Stack gap={0}>
          {depositions?.map((event, idx) => (
            <Group key={idx}>
              <Text ml={30} fz="xs" fw={300}>
                Event date
              </Text>
              <DataField value={event?.eventDate} fz="xs" />
            </Group>
          ))}
        </Stack>
      </Timeline.Item>
      <Timeline.Item
        bullet={
          <Image alt="Data reuse" src="/timeline-icons/data-reuse.svg" w={50} />
        }
        title={
          <Text fz="sm" ml={20} fw={700}>
            Data reuse
          </Text>
        }
      >
        <Group>
          <Text ml={30} fz="xs" fw={300}>
            Event date
          </Text>
          <DataField value={undefined} fz="xs" />
        </Group>
      </Timeline.Item>
    </Timeline>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box px={20} pt={30} pb={15} style={{ borderTop: "1px solid #d6e4ed" }}>
      {children}
    </Box>
  );
}

function EventCarousel({ children }: { children: React.ReactNode }) {
  const [slide, setSlide] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const total = React.Children.count(children);

  return (
    <Stack>
      <Carousel
        withControls={false}
        align="start"
        draggable={false}
        slideSize="100%"
        classNames={classes}
        getEmblaApi={setEmbla}
        onSlideChange={setSlide}
        speed={30}
      >
        {React.Children.map(children, (child: React.ReactNode, idx) => (
          <Carousel.Slide key={idx}>{child}</Carousel.Slide>
        ))}
      </Carousel>

      <Group gap="xs" justify="space-between">
        <Button
          variant="light"
          disabled={slide == 0}
          onClick={() => embla?.scrollPrev()}
          leftSection={<IconChevronLeft />}
        >
          Event {slide <= 1 ? 1 : slide}
        </Button>
        <Group>
          {React.Children.map(children, (_child, idx) => (
            <div
              key={idx}
              className={classes.indicator}
              data-active={idx === slide}
            ></div>
          ))}
        </Group>
        <Button
          variant="light"
          disabled={slide == total - 1}
          onClick={() => embla?.scrollNext()}
          rightSection={<IconChevronRight />}
        >
          Event {slide >= total - 1 ? total : slide + 2}
        </Button>
      </Group>
    </Stack>
  );
}

export default function SpecimenAccession({
  params,
}: {
  params: { accession: string };
}) {
  let basePath = usePathname()?.replace(params.accession, "");

  const { loading, error, data } = useQuery<SpecimenQueryResults>(
    GET_SPECIMEN,
    {
      variables: {
        recordId: decodeURIComponent(params.accession),
      },
    }
  );

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Stack gap={20}>
      <Link href={basePath || ""}>
        <Group gap={5}>
          <IconArrowNarrowLeft />
          <Text fz={18}>Back to specimens</Text>
        </Group>
      </Link>

      <Paper p={20} radius="lg" withBorder>
        <Group align="inherit">
          <Title
            order={3}
            mb={10}
          >{`Complete specimen view: ${data?.specimen.recordId}`}</Title>
          <Text fz="sm" c="dimmed">
            Source
          </Text>
        </Group>

        <Grid
          columns={24}
          gutter={0}
          style={{
            border: "1px solid #d6e4ed",
            borderRadius: "var(--mantine-radius-lg)",
          }}
        >
          <Grid.Col span={5}>
            <Paper
              p={15}
              bg="#d6e4ed"
              h="100%"
              style={{
                borderRadius:
                  "var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)",
                border: "none",
              }}
            >
              <EventTimeline
                specimen={data?.specimen}
                subsample={data?.subsample}
                dnaExtract={data?.dnaExtract}
                sequences={data?.sequence}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={19}>
            <Stack gap={0}>
              <Paper
                bg="#eaf1f5"
                withBorder={false}
                style={{
                  borderRadius: "0 var(--mantine-radius-lg) 0 0",
                  border: "none",
                }}
              >
                <Box px={20} pt={30} pb={15}>
                  <Title order={5}>Collection event</Title>
                  <Collections specimen={data?.specimen} />
                </Box>
              </Paper>
              <Panel>
                <Title order={5}>Accession event</Title>
                <Accessions specimen={data?.specimen} />
              </Panel>
              <Panel>
                <Title order={5}>Subsample event</Title>
                <Subsamples subsample={data?.subsample} />
              </Panel>
              <Panel>
                <Title order={5}>DNA extraction event</Title>
                <DnaExtracts dnaExtract={data?.dnaExtract} />
              </Panel>
              <Panel>
                <Title order={5}>Amplification and sequencing event</Title>
                <EventCarousel>
                  {data?.sequence.map((sequence) => (
                    <Sequencing sequence={sequence} key={sequence.id} />
                  ))}
                </EventCarousel>
              </Panel>
              <Panel>
                <Title order={5}>Sequence assembly event</Title>
                <EventCarousel>
                  {data?.sequence.map((sequence) => (
                    <Assemblies sequence={sequence} key={sequence.id} />
                  ))}
                </EventCarousel>
              </Panel>
              <Panel>
                <Title order={5}>Sequence annotation event</Title>
                <EventCarousel>
                  {data?.sequence.map((sequence) => (
                    <Annotations sequence={sequence} key={sequence.id} />
                  ))}
                </EventCarousel>
              </Panel>
              <Panel>
                <Title order={5}>Data deposition event</Title>
                <EventCarousel>
                  {data?.sequence.map((sequence) => (
                    <Depositions sequence={sequence} key={sequence.id} />
                  ))}
                </EventCarousel>
              </Panel>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
