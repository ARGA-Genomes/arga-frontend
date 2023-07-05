import { Specimen } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Collapse, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, Timeline, Title, useMantineTheme } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";
import { ClipboardList as IconClipboardList, Pencil as IconPencil, BuildingBank as IconBuildingBank, Cell as IconCell, Map2 as IconMap, ArrowUpRight, VaccineBottle as IconVaccineBottle, Tag as IconTag, WaveSine as IconWaveSine, Microscope as IconMicroscope, BuildingWarehouse as IconBuildingWarehouse, SeparatorVertical } from 'tabler-icons-react';


const GET_SPECIMENS = gql`
query SpeciesSpecimens($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    specimens {
      id
      typeStatus
      institutionName
      institutionCode
      collectionCode
      catalogNumber
      recordedBy
      organismId
      locality
      latitude
      longitude
      details
      remarks
    }
  }
}`;


const GET_SPECIMEN = gql`
query SpecimenDetails($specimenId: String) {
  specimen(specimenId: $specimenId) {
    id
    typeStatus
    catalogNumber
    collectionCode
    institutionName
    institutionCode
    organismId
    latitude
    longitude
    recordedBy
    remarks

    events {
      id
      eventDate
      eventId
      eventRemarks
      fieldNotes
      fieldNumber
      habitat
      samplingEffort
      samplingProtocol
      samplingSizeUnit
      samplingSizeValue

      events {
        ... on CollectionEvent {
          id
          behavior
          catalogNumber
          degreeOfEstablishment
          establishmentMeans
          individualCount
          lifeStage
          occurrenceStatus
          organismId
          organismQuantity
          organismQuantityType
          otherCatalogNumbers
          pathway
          preparation
          recordNumber
          reproductiveCondition
          sex
        }
      }
    }
  }
}`;

type Species = {
  specimens: Specimen[],
}

type QueryResults = {
  species: Species,
}

type Event = {
  id: string,
  eventDate: string,
  eventId: string,
  eventRemarks: string,
  fieldNotes: string,
  fieldNumber: string,
  habitat: string,
  samplingEffort: string,
  samplingProtocol: string,
  samplingSizeUnit: string,
  samplingSizeValue: string,

  events: CollectionEvent[]
}

type CollectionEvent = {
  id: string,
  behavior: string,
  catalogNumber: string,
  degreeOfEstablishment: string,
  establishmentMeans: string,
  individualCount: string,
  lifeStage: string,
  occurrenceStatus: string,
  organismId: string,
  organismQuantity: string,
  organismQuantityType: string,
  otherCatalogNumbers: string,
  pathway: string,
  preparation: string,
  recordNumber: string,
  reproductiveCondition: string,
  sex: string,
}

type SpecimenDetails = {
  id: string,
  typeStatus: string,
  institutionName?: string,
  institutionCode?: string,
  collectionCode?: string,
  catalogNumber?: string,
  recordedBy?: string,
  organismId?: string,
  locality?: string,
  latitude?: number,
  longitude?: number,
  remarks?: string,

  events: Event[],
}

type SpecimenQueryResults = {
  specimen: SpecimenDetails,
}


interface EventTimelineProps {
  events: Event[],
  onSelected: (event: Event) => void,
}

function EventTimeline({ events, onSelected }: EventTimelineProps) {
  const [active, setActive] = useState(0)

  const onClick = (event: Event, idx: number) => {
    onSelected(event)
    setActive(idx)
  }

  return (
    <Timeline active={active} lineWidth={4}>
      { events.map((event, idx) => (
        <Timeline.Item key={idx} title="Collection" bulletSize={34} bullet={<IconVaccineBottle />} onClick={() => onClick(event, idx)} lineVariant="dashed">
          <Text color="dimmed" size="sm">
            Date: {event.eventDate}
          </Text>
        </Timeline.Item>
      ))}
      <Timeline.Item title="Accession" bulletSize={34} bullet={<IconTag color="grey" />} lineVariant="dashed" c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>
      <Timeline.Item title="Subsampling" bulletSize={34} bullet={<IconMicroscope color="grey" />} lineVariant="dashed" c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>
      <Timeline.Item title="Sequencing" bulletSize={34} bullet={<IconWaveSine color="grey" />} lineVariant="dashed" c="dimmed">
        <Text color="dimmed" size="sm">
          Not supplied
        </Text>
      </Timeline.Item>
      <Timeline.Item title="Data Deposition" bulletSize={34} bullet={<IconBuildingWarehouse color="grey" />} lineVariant="dashed" c="dimmed">
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
        <SpecimenField label="Life stage" value={ event ? JSON.parse(event.lifeStage)["concept"] : undefined} icon={<IconClipboardList size={16} />} />
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


function SpecimenEvents({ specimen }: { specimen : SpecimenDetails }) {
  const [event, setEvent] = useState<Event | undefined>(specimen.events[0]);

  return (
      <Grid>
        <Grid.Col span={2} bg="midnight.0" p={30} sx={{ borderRadius: "16px 0 0 16px" }}>
          <EventTimeline events={specimen.events} onSelected={setEvent} />
        </Grid.Col>

        <Grid.Col span={10} p={30}>
          <Title order={5}>Specimen</Title>
          <SpecimenDetails record={specimen} />

          <Title order={5} mt={20}>Event</Title>
          <EventDetails event={event} />

          <Title order={5} mt={20}>Collection</Title>
          <CollectionEventDetails event={event?.events[0]} />
        </Grid.Col>
      </Grid>
  )
}


interface SpecimenFieldProps {
  label: string,
  value?: string | number,
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
      <Grid.Col span={3}>
        <SpecimenField label="Catalog number" value={record.catalogNumber} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Institution code" value={record.institutionCode} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Collection code" value={record.collectionCode} icon={<IconClipboardList size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Institution name" value={record.institutionName} icon={<IconBuildingBank size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Organism" value={record.organismId} icon={<IconCell size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Recorded by" value={record.recordedBy} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Latitude" value={record.latitude} icon={<IconMap size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Longitude" value={record.longitude} icon={<IconMap size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Locality" value={record.locality} icon={<IconMap size={16} />} />
      </Grid.Col>

      <Grid.Col span={3}>
        <SpecimenField label="Details" value={record.details} icon={<IconPencil size={16} />} />
      </Grid.Col>
      <Grid.Col span={3}>
        <SpecimenField label="Remarks" value={record.remarks} icon={<IconPencil size={16} />} />
      </Grid.Col>
    </Grid>
  )
}


interface SpecimenRecordProps {
  record: Specimen,
  selected: boolean,
  onSelected: (record: Specimen) => void;
}

function SpecimenRecord(props: SpecimenRecordProps) {
  return (
    <>
    <tr
      style={{ cursor: 'pointer' }}
      onClick={() => props.onSelected(props.record)}
    >
      <td style={{ paddingLeft: 25 }}>{props.record.typeStatus}</td>
      <td>{props.record.institutionName}</td>
      <td>{props.record.institutionCode}</td>
      <td>{props.record.collectionCode}</td>
      <td>{props.record.catalogNumber}</td>
      <td>
        <Link href={`/specimens/${props.record.id}`}>
          <Button size="xs" variant="light" rightIcon={<ArrowUpRight size={16} />}>All details</Button>
        </Link>
      </td>
    </tr>
    <tr>
      <td colSpan={8} style={{ padding: 0, border: 'none' }}>
        <Collapse in={props.selected}>
          <Box p={20} bg="gray.1">
            <SpecimenDetails record={props.record} />
          </Box>
        </Collapse>
      </td>
    </tr>
    </>
  )
}


function SpecimenTable({ records }: { records: Specimen[] }) {
  const [selected, handler] = useListState<Specimen>([]);

  function toggle(record: Specimen) {
    let idx = selected.indexOf(record);
    if (idx >= 0) {
      handler.remove(idx);
    } else {
      handler.append(record);
    }
  }

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <td style={{ paddingLeft: 25 }}>Type Status</td>
          <td>Institution Name</td>
          <td>Institution Code</td>
          <td>Collection Code</td>
          <td>Catalog Number</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        { records.map(record => {
          return (<SpecimenRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={record.id}
          />)
        })}
      </tbody>
    </Table>
  )
}


export function Specimens({ canonicalName }: { canonicalName: string }) {
  const theme = useMantineTheme();

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
      canonicalName,
    },
  });

  const records = data?.species.specimens;
  const holotypeId = records?.find(record => record.typeStatus == "HOLOTYPE")?.id;

  const holotype = useQuery<SpecimenQueryResults>(GET_SPECIMEN, {
    variables: {
      specimenId: holotypeId,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />

      { holotype.data ? (<>
        <Title order={3} color="white" py={20}>Holotype</Title>
        <Paper radius="lg">
          <SpecimenEvents specimen={holotype.data.specimen} />
        </Paper>
      </>) : null }

      <Title order={3} color="white" py={20}>All Sequences</Title>
      <Paper radius="lg" py={20}>
        { records ? <SpecimenTable records={records} /> : null }
      </Paper>
    </Box>
  );
}
