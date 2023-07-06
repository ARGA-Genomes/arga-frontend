import PointMap from "@/app/components/point-map";
import { Coordinates, Specimen, SpecimenDetails, Event, CollectionEvent, SequencingEvent, SequencingRunEvent } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Collapse, Divider, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, Timeline, Title, useMantineTheme } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";
import { ClipboardList as IconClipboardList, Pencil as IconPencil, BuildingBank as IconBuildingBank, Cell as IconCell, Map2 as IconMap, ArrowUpRight, VaccineBottle as IconVaccineBottle, Tag as IconTag, WaveSine as IconWaveSine, Microscope as IconMicroscope, BuildingWarehouse as IconBuildingWarehouse, SeparatorVertical } from 'tabler-icons-react';



interface EventTimelineProps {
  events: Event[],
  onSelected: (event: Event) => void,
}

function EventTimeline({ events, onSelected }: EventTimelineProps) {
  const [active, setActive] = useState(3)

  const onClick = (event: Event, idx: number) => {
    onSelected(event)
    setActive(idx)
  }

  const flattened = events.map(ev => ev.events).flat();
  const collection = flattened.filter(ev => ev.__typename == 'CollectionEvent') as CollectionEvent[];
  const sequencing = flattened.filter(ev => ev.__typename == 'SequencingEvent') as SequencingEvent[];

  return (
    <Timeline active={active} lineWidth={4}>
      { collection.map((event, idx) => (
        <Timeline.Item key={idx} title="Collection" bulletSize={34} bullet={<IconVaccineBottle />}>
          <Text color="dimmed" size="sm">
            Date: Not supplied
                  {/* Date: {event.eventDate} */}
          </Text>
        </Timeline.Item>
      ))}
      { collection.length == 0 && (
          <Timeline.Item title="Collection" bulletSize={34} bullet={<IconVaccineBottle />} c="dimmed">
            <Text color="dimmed" size="sm">Date: Not supplied</Text>
        </Timeline.Item>
      )}

      <Timeline.Item title="Accession" bulletSize={34} bullet={<IconTag />} c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Subsampling" bulletSize={34} bullet={<IconMicroscope />} c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>

      { sequencing.map((event, idx) => (
        <Timeline.Item key={idx} title="Sequencing" bulletSize={34} bullet={<IconWaveSine />}>
          <Text color="dimmed" size="sm">{event.runs?.length > 0 ? event.runs[0].sequencingDate : "Not supplied"}</Text>
        </Timeline.Item>
      ))}
      { sequencing.length == 0 && (
        <Timeline.Item title="Sequencing" bulletSize={34} bullet={<IconWaveSine color="grey" />} c="dimmed">
          <Text color="dimmed" size="sm">Not supplied</Text>
        </Timeline.Item>
      )}

      <Timeline.Item title="Data Deposition" bulletSize={34} bullet={<IconBuildingWarehouse color="grey" />} c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>
    </Timeline>
  )
}


function EventDetails({ event }: { event: Event | undefined }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <SpecimenField label="Event Date" value={event?.eventDate} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Event ID" value={event?.eventId} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Event Remarks" value={event?.eventRemarks} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Field notes" value={event?.fieldNotes} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Field number" value={event?.fieldNumber} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Habitat" value={event?.habitat} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Sampling effort" value={event?.samplingEffort} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Sampling protocol" value={event?.samplingProtocol} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Sampling size unit" value={event?.samplingSizeUnit} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Sampling size value" value={event?.samplingSizeValue} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
    </Grid>
  )
}

function CollectionEventDetails({ event }: { event: CollectionEvent | undefined }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <SpecimenField label="Behavior" value={event?.behavior} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Catalog number" value={event?.catalogNumber} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Degree of establishment" value={event?.degreeOfEstablishment} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Establishment means" value={event?.establishmentMeans} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Individual count" value={event?.individualCount} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Life stage" value={ event ? JSON.parse(event.lifeStage)?.concept : undefined} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Occurrence status" value={event?.occurrenceStatus} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Organism quantity" value={event?.organismQuantity} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Organism quantity type" value={event?.organismQuantityType} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Other catalog numbers" value={event?.otherCatalogNumbers} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Pathway" value={event?.pathway} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Preparation" value={event?.preparation} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Record number" value={event?.recordNumber} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Reproductive condition" value={event?.reproductiveCondition} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Sex" value={event?.sex} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
    </Grid>
  )
}

function SequencingEventDetails({ event }: { event: SequencingEvent | undefined }) {
  return (
    <Grid>
      <Grid.Col span={3}>
        <SpecimenField label="Organism ID" value={event?.organismId} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Sequence ID" value={event?.sequenceId} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Genbank accession" value={event?.genbankAccession} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Target gene" value={event?.targetGene} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={12}>
        <Text color='dimmed' size='xs'>DNA sequence</Text>
        <Text size='sm' weight={event?.dnaSequence ? 'normal' : 'bold'} c={event?.dnaSequence ? "black" : "dimmed"} truncate>
          {event?.dnaSequence || "Not Supplied"}
        </Text>
      </Grid.Col>
    </Grid>
  )
}

function SequencingRunEventDetails({ event }: { event: SequencingRunEvent }) {
  return (
    <Grid>
      <Grid.Col span={4}>
        <SpecimenField label="Trace ID" value={event.traceId} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Trace name" value={event.traceName} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Trace link" value={<Link href={event.traceLink} target="_blank">Get trace file</Link>} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Sequencing date" value={event.sequencingDate} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenField label="Sequencing center" value={event.sequencingCenter} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Target gene" value={event.targetGene} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Direction" value={event.direction} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenField label="PCR primer name forward" value={event.pcrPrimerNameForward} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="PCR primer name reverse" value={event.pcrPrimerNameReverse} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Sequence primer forward name" value={event.sequencePrimerForwardName} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Sequence primer reverse name" value={event.sequencePrimerReverseName} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>
    </Grid>
  )
}


function EventData({ event }: { event: CollectionEvent | SequencingEvent }) {
  let title = null;
  let details = null;

  if (event.__typename == "CollectionEvent") {
    title = "Collection"
    details = <CollectionEventDetails event={event as CollectionEvent} />
  }
  else if (event.__typename == "SequencingEvent") {
    title = "Sequencing"
    details = (
      <>
        <SequencingEventDetails event={event as SequencingEvent} />
        {(event as SequencingEvent).runs.map((ev, idx) => (
          <Box py={40} key={idx}>
            <Divider />
            <Title order={6} my={20}>Sequence run {idx + 1}</Title>
          <SequencingRunEventDetails event={ev} />
          </Box>
        ))}
      </>
    )
  }

  return (
    <>
    <Title order={5} mt={20} pl={30}>{title}</Title>
    <Box p={30}>
      {details}
    </Box>
    </>
  )
}



interface SpecimenFieldProps {
  label: string,
  value?: string | number | React.ReactNode,
  icon: React.ReactNode,
}

function SpecimenField(props: SpecimenFieldProps) {
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

function SpecimenDetails({ record }: { record: Specimen }) {
  return (
    <Grid>
      <Grid.Col span={4}>
        <SpecimenField label="Catalog number" value={record.catalogNumber} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Institution code" value={record.institutionCode} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Collection code" value={record.collectionCode} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Institution name" value={record.institutionName} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenField label="Organism" value={record.organismId} icon={<IconCell size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Recorded by" value={record.recordedBy} icon={<IconPencil size={16} />} />
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenField label="Locality" value={record.locality} icon={<IconMap size={16} />} />
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenField label="Details" value={record.details} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={4}>
        <SpecimenField label="Remarks" value={record.remarks} icon={<IconPencil size={16} />} />
      </Grid.Col>
    </Grid>
  )
}


export function SpecimenEvents({ specimen }: { specimen : SpecimenDetails }) {
  const [event, setEvent] = useState<Event | undefined>(specimen.events[0]);
  const coords = specimen.latitude && specimen.longitude ? [specimen] as Coordinates[] : undefined;

  return (
    <Grid m={0}>
        <Grid.Col span={2} bg="midnight.0" p={30} sx={{ borderRadius: "16px 0 0 16px" }}>
          <EventTimeline events={specimen.events} onSelected={setEvent} />
        </Grid.Col>

        <Grid.Col span={10} p={0} m={0}>
            <Grid p={0} m={0}>
              <Grid.Col span={8} p={30} bg="shellfish.0">
                <Title order={5}>Specimen</Title>
                <SpecimenDetails record={specimen} />
              </Grid.Col>
              <Grid.Col span={4} p={0} m={0} pos="relative">
                <PointMap coordinates={coords} center={coords && coords[0]} borderRadius="0 16px 0 0" />
              </Grid.Col>
            </Grid>

          <Box px={30} pb={30}>
            <Title order={5} mt={20}>Event</Title>
            <EventDetails event={event} />
          </Box>

          { event && <EventData event={event?.events[0]} /> }
        </Grid.Col>
      </Grid>
  )
}
