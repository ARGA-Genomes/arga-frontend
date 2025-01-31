"use client";

import { SpecimenDetails } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { PaginationBar } from "@/components/pagination";
import { LoadOverlay } from "@/components/load-overlay";
import { RecordItem, RecordList } from "@/components/record-list";
import { Attribute } from "@/components/highlight-stack";
import { AnalysisMap, ArgaMap } from "@/components/mapping";
import { usePathname } from "next/navigation";
import { Marker } from "@/components/mapping/analysis-map";
import { getCanonicalName } from "@/helpers/getCanonicalName";

const PAGE_SIZE = 5;

const GET_SPECIMENS = gql`
  query SpeciesSpecimens($canonicalName: String, $page: Int, $pageSize: Int) {
    species(canonicalName: $canonicalName) {
      specimens(page: $page, pageSize: $pageSize) {
        total
        records {
          id
          recordId
          datasetName
          accession
          institutionCode
          typeStatus
          locality
          country
          sequences
          wholeGenomes
          markers
          latitude
          longitude
        }
      }
    }
  }
`;

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
  }
`;

type Specimen = {
  id: string;
  recordId: string;
  datasetName: string;
  accession?: string;
  institutionCode?: string;
  typeStatus?: string;
  locality?: string;
  country?: string;
  sequences: number;
  wholeGenomes: number;
  markers: number;
  latitude?: number;
  longitude?: number;
};

type Species = {
  specimens: {
    total: number;
    records: Specimen[];
  };
};

type QueryResults = {
  species: Species;
};

type SpecimenQueryResults = {
  specimen: SpecimenDetails;
};

function toMarker(
  color: [number, number, number, number],
  records?: Specimen[]
) {
  if (!records) return [];
  return records.map((r) => {
    return {
      recordId: r.recordId || "unknown",
      latitude: r.latitude,
      longitude: r.longitude,
      color: color,
    };
  });
}

function SpecimenMap({ records }: { records: Specimen[] | undefined }) {
  const markers = toMarker([103, 151, 180, 220], records).filter(
    (s) => s.latitude
  ) as Marker[];

  return (
    <Box pos="relative" h="100%">
      <AnalysisMap
        markers={markers}
        style={{ borderRadius: "var(--mantine-radius-lg)", overflow: "hidden" }}
      ></AnalysisMap>
    </Box>
  );
}

function LabeledValue({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <Group gap={20}>
      <Text fw={300} size="sm">
        {label}
      </Text>
      <Text fw={600}>{value}</Text>
    </Group>
  );
}

function RecordItemContent({ record }: { record: Specimen }) {
  const registration = record.accession
    ? `${record.institutionCode || ""} ${record.accession}`
    : record.recordId;

  return (
    <Grid p={20}>
      <Grid.Col span={4}>
        <Stack gap={5}>
          <LabeledValue label="Registration number" value={registration} />
          <Text size="xs" fw={600}>
            {record.datasetName}
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={4}>
        <Attribute label="Collection location" value={record.locality} />
      </Grid.Col>
      <Grid.Col span={2}>
        <Attribute label="Type status" value={record.typeStatus} />
      </Grid.Col>
      <Grid.Col span={2}>
        <Attribute
          label="Genomic data"
          value={record.sequences > 0 ? "yes" : "no"}
        />
      </Grid.Col>
    </Grid>
  );
}

function SpecimenList({ records }: { records: Specimen[] }) {
  const path = usePathname();

  return (
    <RecordList>
      {records.map((record) => (
        <RecordItem key={record.id} href={`${path}/${record.recordId}`}>
          <RecordItemContent record={record} />
        </RecordItem>
      ))}
    </RecordList>
  );
}

export default function Specimens({ params }: { params: { name: string } }) {
  const canonicalName = getCanonicalName(params);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
    },
  });

  const records = data?.species.specimens.records;
  const holotypeId = records?.find(
    (record) => record.typeStatus == "HOLOTYPE"
  )?.id;

  const holotype = useQuery<SpecimenQueryResults>(GET_SPECIMEN, {
    variables: {
      specimenId: holotypeId,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <>
      <Paper radius="lg" p={20} withBorder>
        <Title order={3}>All specimens</Title>

        <Grid py={20}>
          <Grid.Col span={8}>
            <Box pos="relative" mih={568}>
              <LoadOverlay visible={loading} />
              {data?.species.specimens ? (
                <SpecimenList records={data.species.specimens.records} />
              ) : null}
            </Box>
          </Grid.Col>
          <Grid.Col span={4} mih={568}>
            <SpecimenMap records={data?.species.specimens.records} />
          </Grid.Col>

          <Grid.Col span={8}>
            <PaginationBar
              total={data?.species.specimens.total}
              page={page}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}
