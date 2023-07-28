'use client';

import SpecimenEvents from "@/app/specimens/[uuid]/specimen-details";
import { Coordinates, Specimen, SpecimenDetails } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Collapse, Grid, Group, LoadingOverlay, Paper, Table, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ClipboardList as IconClipboardList, Pencil as IconPencil, BuildingBank as IconBuildingBank, Cell as IconCell, Map2 as IconMap, ArrowUpRight} from 'tabler-icons-react';

const PointMap = dynamic(() => import('../../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


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

type SpecimenQueryResults = {
  specimen: SpecimenDetails,
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


function SpecimenMap({ specimens }: { specimens: Specimen[] }) {
  let coordinates = specimens
    .filter(s => s.latitude && s.longitude)
    .map(s => s as Coordinates)

  return (
    <Box pos="relative" h={300}>
      <PointMap coordinates={coordinates} borderRadius="16px 16px 0 0" />
    </Box>
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

      <Paper radius="lg" mt={0}>
        <SpecimenMap specimens={records || []} />
        { records ? <SpecimenTable records={records} /> : null }
      </Paper>
    </Box>
  );
}
