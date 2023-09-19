'use client';

import SpecimenEvents from "@/app/specimens/[uuid]/specimen-details";
import { Coordinates, SpecimenDetails } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Grid, Group, Paper, Stack, Text, Title} from "@mantine/core";
import { useState } from "react";
import { PaginationBar } from "@/app/components/pagination";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay } from "@/app/components/load-overlay";
import { RecordItem } from "@/app/components/record-list";
import { AttributeValue } from "@/app/components/highlight-stack";
import { ArgaMap } from "@/app/components/mapping";


const PAGE_SIZE = 5;

const GET_SPECIMENS = gql`
query SpeciesSpecimens($canonicalName: String, $page: Int, $pageSize: Int) {
  species(canonicalName: $canonicalName) {
    specimens(page: $page, pageSize: $pageSize) {
      total
      records {
        id
        accession
        datasetName
        typeStatus
        locality
        country
        sequences
        wholeGenomes
        markers
      }
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


type Specimen = {
  id: string,
  accession: string,
  datasetName: string,
  typeStatus: string,
  locality: string,
  country: string,
  sequences: number,
  wholeGenomes: number,
  markers: number,
}

type Species = {
  specimens: {
    total: number,
    records: Specimen[]
  },
}

type QueryResults = {
  species: Species,
}

type SpecimenQueryResults = {
  specimen: SpecimenDetails,
}


function SpecimenMap({ records }: { records: Specimen[] | undefined }) {
  return (
    <Box pos="relative" h={560} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


function LabeledValue({ label, value }: { label: string, value: string|undefined }) {
  return (
    <Group spacing={20}>
      <Text weight={300} size="sm">{label}</Text>
      <Text weight={600}>{value}</Text>
    </Group>
  )
}

function RecordItemContent({ record }: { record: Specimen }) {
  return (
      <Grid p={20}>
        <Grid.Col span={4}>
          <Stack spacing={5}>
            <LabeledValue label="Registration number" value={record.accession} />
            <Text size="xs" weight={600}>{record.datasetName}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <AttributeValue label="Collection location" value={record.locality} />
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Type status" value={record.typeStatus} />
        </Grid.Col>
        <Grid.Col span={2}>
          <AttributeValue label="Genomic data" value={record.sequences > 0 ? "yes" : "no"}/>
        </Grid.Col>
      </Grid>
  )
}

function RecordList({ records }: { records: Specimen[] }) {
  return (
    <>
      { records.map(record => (
        <RecordItem key={record.id}>
          <RecordItemContent record={record} />
        </RecordItem>)) }
    </>
  )
}


export function Specimens({ canonicalName }: { canonicalName: string }) {
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
    },
  });

  const records = data?.species.specimens.records;
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
    <Container maw={MAX_WIDTH} py={20}>
      { holotype.data ? (<>
        <Paper radius="lg">
          <SpecimenEvents specimen={holotype.data.specimen} />
        </Paper>
      </>) : null }

      <Paper radius="lg" p={20} withBorder>
        <Title order={3}>All specimens</Title>

        <Grid py={20}>
          <Grid.Col span={8}>
            <Box pos="relative">
              <LoadOverlay visible={loading} />
              { data?.species.specimens ? <RecordList records={data.species.specimens.records} /> : null }
            </Box>

            <PaginationBar
              total={data?.species.specimens.total}
              page={page}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <SpecimenMap records={data?.species.specimens.records} />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}
