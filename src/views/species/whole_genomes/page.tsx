"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Drawer,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { PaginationBar } from "@/components/pagination";
import { AnalysisMap } from "@/components/mapping";
import { RecordItem, RecordList } from "@/components/record-list";
import { usePathname } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { Marker } from "@/components/mapping/analysis-map";
import { FilterBar } from "@/components/filtering/filter-bar";
import { SequenceFilters } from "@/components/filtering/sequence-filters";
import { Filter, intoFilterItem } from "@/components/filtering/common";
import {
  AttributePill,
  AttributePillValue,
  DataField,
} from "@/components/data-fields";
import { DataTable, DataTableRow } from "@/components/data-table";

const PAGE_SIZE = 5;

const GET_REFERENCE_GENOME = gql`
  query SpeciesReferenceGenome($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      referenceGenome {
        sequenceId
        dnaExtractId
        datasetName
        recordId
        accession
        materialSampleId
        name
        quality
        releaseType
        releaseDate
        representation
        versionStatus
        estimatedSize
        excludedFromRefseq
        assemblyType
        genomeSize
        dataType
        sequencedBy
        assembledBy
        annotatedBy
        depositedBy
      }
    }
  }
`;

const GET_WHOLE_GENOMES = gql`
  query SpeciesWholeGenomes(
    $canonicalName: String
    $page: Int
    $pageSize: Int
    $filters: [FilterItem]
  ) {
    species(canonicalName: $canonicalName) {
      wholeGenomes(page: $page, pageSize: $pageSize, filters: $filters) {
        total
        records {
          sequenceId
          datasetName
          recordId
          accession
          quality
          genomeSize
          releaseDate
          latitude
          longitude
          representation
        }
      }
    }
  }
`;

interface WholeGenome {
  id: string;
  dnaExtractId: string;
  datasetName: string;
  recordId: string;
  accession?: string;
  materialSampleId?: string;
  name?: string;
  quality?: string;
  releaseType?: string;
  releaseDate?: string;
  representation?: string;
  versionStatus?: string;
  estimatedSize?: number;
  excludedFromRefseq?: string;
  assemblyType?: string;
  genomeSize?: number;
  dataType?: string;
  sequencedBy?: string;
  assembledBy?: string;
  annotatedBy?: string;
  depositedBy?: string;
  latitude?: number;
  longitude?: number;
}

interface Species {
  wholeGenomes: {
    total: number;
    records: WholeGenome[];
  };
}

interface QueryResults {
  species: Species;
}

interface RefseqResults {
  species: {
    referenceGenome?: WholeGenome;
  };
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

function RecordItemContent({ record }: { record: WholeGenome }) {
  return (
    <Grid p={20}>
      <Grid.Col span={4}>
        <Stack gap={5}>
          <LabeledValue label="Accession" value={record.accession} />
          <Text size="xs" fw={600}>
            {record.datasetName}
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Release date" value={record.releaseDate} />
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill
          label="Genome size"
          value={Humanize.fileSize(record.genomeSize ?? 0)}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Representation" value={record.representation} />
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Assembly level" value={record.quality} />
      </Grid.Col>
    </Grid>
  );
}

function WholeGenomeList({ records }: { records: WholeGenome[] }) {
  const path = usePathname();

  return (
    <RecordList>
      {records.map((record, idx) => (
        <RecordItem
          key={idx}
          href={`${path}/${encodeURIComponent(record.accession ?? "")}`}
        >
          <RecordItemContent record={record} />
        </RecordItem>
      ))}
    </RecordList>
  );
}

function toMarker(
  color: [number, number, number, number],
  records?: WholeGenome[],
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

function WholeGenomeMap({ records }: { records: WholeGenome[] | undefined }) {
  const markers = toMarker([243, 117, 36, 220], records).filter(
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

function ReferenceGenome({ canonicalName }: { canonicalName: string }) {
  const path = usePathname();

  const { loading, error, data } = useQuery<RefseqResults>(
    GET_REFERENCE_GENOME,
    {
      variables: { canonicalName },
    },
  );

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  if (!data?.species.referenceGenome) {
    return null;
  }

  return (
    <Paper p="lg" radius="lg" pos="relative" withBorder>
      <LoadOverlay visible={loading} />
      <Title order={3} mb={10}>
        Representative genome
      </Title>

      <Grid gutter={50}>
        <Grid.Col span={3}>
          <Stack gap={20}>
            <DataTable>
              <DataTableRow label="Representation">
                <AttributePillValue
                  value={data.species.referenceGenome.representation}
                />
              </DataTableRow>
              <DataTableRow label="Release date">
                <DataField value={data.species.referenceGenome.releaseDate} />
              </DataTableRow>
              <DataTableRow label="Assembly type">
                <AttributePillValue
                  value={data.species.referenceGenome.assemblyType}
                />
              </DataTableRow>
              <DataTableRow label="Accession">
                <DataField value={data.species.referenceGenome.accession} />
              </DataTableRow>
              <DataTableRow label="Data source">
                <DataField value={data.species.referenceGenome.datasetName} />
              </DataTableRow>
            </DataTable>

            <Link
              href={`${path}/${data.species.referenceGenome.accession ?? "#"}`}
            >
              <Center>
                <Button
                  color="midnight.10"
                  radius="md"
                  leftSection={<IconEye />}
                >
                  view
                </Button>
              </Center>
            </Link>
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <AssemblyStats genome={data.species.referenceGenome} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function AssemblyStats({ genome }: { genome: WholeGenome | undefined }) {
  return (
    <Paper p="lg" radius="lg" pos="relative" withBorder>
      <LoadOverlay visible={false} />
      <Title order={5} mb={10}>
        Assembly statistics
      </Title>

      <SimpleGrid cols={5} spacing={50}>
        <Stack>
          <AttributePill
            label="Genome size"
            value={Humanize.fileSize(genome?.genomeSize ?? 0)}
          />
          <AttributePill label="Ungapped length" value={Humanize.fileSize(0)} />
          <AttributePill label="BUSCO score" value={undefined} />
        </Stack>
        <Stack>
          <AttributePill label="Number of chromosones" value={undefined} />
          <AttributePill label="Number of organelles" value={undefined} />
        </Stack>
        <Stack>
          <AttributePill label="Number of scaffolds" value={undefined} />
          <AttributePill label="Scaffold N50" value={Humanize.fileSize(0)} />
          <AttributePill label="Scaffold L50" value={undefined} />
        </Stack>
        <Stack>
          <AttributePill label="Number of contigs" value={undefined} />
          <AttributePill label="Contig N50" value={Humanize.fileSize(0)} />
          <AttributePill label="Contig L50" value={undefined} />
        </Stack>
        <Stack>
          <AttributePill label="GC percentage" value={undefined} />
          <AttributePill label="Genome coverage" value={undefined} />
          <AttributePill label="Assembly level" value={genome?.quality} />
        </Stack>
      </SimpleGrid>
    </Paper>
  );
}

export default function WholeGenome({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const canonicalName = name.replaceAll("_", " ");

  const [filters, setFilters] = useState<Filter[]>([]);
  const [mapExpand, setMapExpand] = useState(false);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<QueryResults>(GET_WHOLE_GENOMES, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
      filters: filters.map(intoFilterItem).filter((item) => item),
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <>
      <Stack gap={20}>
        <ReferenceGenome canonicalName={canonicalName} />

        <Paper p="lg" radius="lg" withBorder>
          <Stack>
            <FilterBar title="All genomes" filters={[]}>
              <SequenceFilters
                filters={{ assembly: [] }}
                onChange={setFilters}
              />
            </FilterBar>

            <Grid>
              <Grid.Col span={8}>
                <Box pos="relative" mih={568}>
                  <LoadOverlay visible={loading} />
                  {data?.species.wholeGenomes && (
                    <WholeGenomeList
                      records={data.species.wholeGenomes.records}
                    />
                  )}
                </Box>
              </Grid.Col>
              <Grid.Col span={4} mih={568}>
                <WholeGenomeMap records={data?.species.wholeGenomes.records} />
              </Grid.Col>
              <Grid.Col span={8}>
                <PaginationBar
                  total={data?.species.wholeGenomes.total}
                  page={page}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Stack>

      <Drawer
        opened={mapExpand}
        onClose={() => {
          setMapExpand(false);
        }}
        opacity={0.55}
        zIndex={2000}
        position="right"
        size="75%"
        withCloseButton={false}
      >
        <WholeGenomeMap records={data?.species.wholeGenomes.records} />
      </Drawer>
    </>
  );
}
