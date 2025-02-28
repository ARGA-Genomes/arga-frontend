"use client";

import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useState, use } from "react";
import { PaginationBar } from "@/components/pagination";
import { LoadOverlay } from "@/components/load-overlay";
import { RecordItem, RecordList } from "@/components/record-list";
import { Attribute } from "@/components/highlight-stack";
import { AnalysisMap } from "@/components/mapping";
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

interface Specimen {
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
}

interface Species {
  specimens: {
    total: number;
    records: Specimen[];
  };
}

interface QueryResults {
  species: Species;
}

function toMarker(
  color: [number, number, number, number],
  records?: Specimen[],
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
    (s) => s.latitude,
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

export default function Specimens(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);
  const canonicalName = getCanonicalName(params);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
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
