"use client";

import { Filter, intoFilterItem } from "@/components/filtering/common";
import { SpeciesCard } from "@/components/species-card";
import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  SimpleGrid,
  Text,
  Title,
  Group,
  Stack,
  Container,
  Drawer,
  Box,
  Grid,
  SegmentedControl,
  Button,
  Accordion,
  Badge,
  Avatar,
  useMantineTheme,
  ScrollArea,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { PaginationBar } from "@/components/pagination";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFilter,
  IconClockHour4,
  IconExternalLink,
  IconDatabase,
  IconLicense,
  IconPaw,
} from "@tabler/icons-react";
import { HasDataFilters } from "@/components/filtering/has-data";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";
import { Photo } from "@/app/type";
import { AttributePill } from "@/components/data-fields";
import { DateTime } from "luxon";
import Link from "next/link";

const PAGE_SIZE = 10;
type Filters = {
  classifications: Filter[];
  dataTypes: Filter[];
};

const GET_DETAILS = gql`
  query SourceDetails($name: String) {
    source(by: { name: $name }) {
      license
      accessRights
      rightsHolder
      author
      name

      species(page: 1, pageSize: 1) {
        total
      }

      datasets {
        name
        shortName
        description
        url
        citation
        license
        rightsHolder
        createdAt
        updatedAt
      }
    }
  }
`;

type Dataset = {
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  citation?: string;
  license?: string;
  rightsHolder?: string;
  createdAt: string;
  updatedAt: string;
};

type SpeciesCount = {
  total: number;
};

type Source = {
  license: string;
  accessRights: string;
  rightsHolder: string;
  author: string;
  name: string;
  species: SpeciesCount;
  datasets: Dataset[];
};

type DetailsQueryResults = {
  source: Source;
};

const GET_SPECIES = gql`
  query SourceSpecies(
    $name: String
    $page: Int
    $pageSize: Int
    $filters: [FilterItem]
  ) {
    source(by: { name: $name }, filters: $filters) {
      species(page: $page, pageSize: $pageSize) {
        total
        records {
          taxonomy {
            canonicalName
          }
          photo {
            url
            publisher
            license
            rightsHolder
          }
          dataSummary {
            genomes
            loci
            specimens
            other
          }
        }
      }
    }
  }
`;

type DataSummary = {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
};

type Record = {
  taxonomy: { canonicalName: string };
  photo: Photo;
  dataSummary: DataSummary;
};

type SpeciesQueryResults = {
  source: {
    species: {
      records: Record[];
      total: number;
    };
  };
};

interface FiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(
    filters.classifications
  );
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes);

  useEffect(() => {
    onChange({
      classifications,
      dataTypes,
    });
  }, [classifications, dataTypes, onChange]);

  return (
    <Accordion defaultValue="hasData" variant="separated">
      <Accordion.Item value="hasData">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show species that have specific types of data"
            image="/card-icons/type/whole_genomes.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HasDataFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="classification">
        <Accordion.Control>
          <FilterGroup
            label="Higher classification filters"
            description="Limit data based on taxonomy"
            image="/card-icons/type/higher_taxon_report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters
            filters={classifications}
            onChange={setClassifications}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

interface FilterGroupProps {
  label: string;
  description: string;
  image: string;
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

function FilterBadge({ filter }: { filter: Filter }) {
  return <Badge variant="outline">{filter.value}</Badge>;
}

function Species({ source }: { source: string }) {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [],
    dataTypes: [],
  });

  const flattenFilters = (filters: Filters) => {
    const items = [...filters.classifications, ...filters.dataTypes];

    return items.filter((item): item is Filter => !!item);
  };

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: {
      page,
      pageSize: PAGE_SIZE,
      name: source,
      filters: flattenFilters(filters)
        .map(intoFilterItem)
        .filter((item) => item),
    },
  });

  const records = Array.from(data?.source.species.records || []);

  return (
    <Stack>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xl"
      >
        <Box pt={200}>
          <Filters filters={filters} onChange={setFilters} />
        </Box>
      </Drawer>

      <LoadOverlay visible={loading} />

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Title order={5}>Browse species</Title>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>
              Filters
            </Text>
            {flattenFilters(filters).map((filter) => (
              <FilterBadge filter={filter} key={filter.value} />
            ))}
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Button leftSection={<IconFilter />} variant="subtle" onClick={open}>
            Filter
          </Button>
        </Grid.Col>
      </Grid>

      {error ? <Title order={4}>{error.message}</Title> : null}

      <SimpleGrid cols={5}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar
        total={data?.source.species.total}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </Stack>
  );
}

function BrowseComponentDatasets({ datasets }: { datasets: Dataset[] }) {
  return (
    <Stack>
      <Title order={5}>Component Datasets</Title>
      <ScrollArea.Autosize
        mah={300}
        type="auto"
        scrollbars="y"
        offsetScrollbars
      >
        <Box p={10}>
          {datasets.map((dataset, idx) => {
            return <DatasetRow key={idx} dataset={dataset} />;
          })}
        </Box>
      </ScrollArea.Autosize>
    </Stack>
  );
}

function DatasetRow({ dataset }: { dataset: Dataset }) {
  const theme = useMantineTheme();

  return (
    <Paper radius="lg" withBorder mb={20}>
      <Grid>
        <Grid.Col span={5} p="lg">
          <Stack gap={3}>
            <Text
              fw={600}
              size="md"
              c="midnight.10"
              // style={{ whiteSpace: "nowrap" }}
            >
              {dataset.name}
            </Text>
            <Group gap={3}>
              <IconClockHour4 size={15} color={theme.colors.midnight[1]} />
              <Text c={theme.colors.midnight[1]} size="xs">
                Last updated:{" "}
                {DateTime.fromISO(dataset.updatedAt).toLocaleString()}
              </Text>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Rights holder" value={dataset.rightsHolder} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Access rights" value={dataset.license} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Number of records" value="No data" />
        </Grid.Col>

        <Grid.Col span={1}>
          <Link href={dataset.url || "#"} target="_blank">
            <Button
              w="100%"
              h="100%"
              color="midnight.10"
              style={{ borderRadius: "0 16px 16px 0" }}
              disabled={!dataset.url}
            >
              <Stack align="center" gap={5}>
                <IconExternalLink size="30px" strokeWidth={1.5} />
                <Text fw={650} fz={8.5}>
                  Go to source
                </Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function SourceDetails({
  source,
  loading,
}: {
  source: Source;
  loading: boolean;
}) {
  const theme = useMantineTheme();
  return (
    <Box w="100%">
      <Stack gap={0}>
        <LoadOverlay visible={loading} />

        <Text c="dimmed" size="xs">
          {source.author}
        </Text>
        <Text c="dimmed" size="xs">
          &copy; {source.rightsHolder}
        </Text>
        <Grid pt={10}>
          <Grid.Col span={3}>
            <Paper radius="lg" bg="#d6e4ed" px={10} py={3}>
              <Group gap={5} justify="center" wrap="nowrap">
                <IconDatabase color={theme.colors.midnight[10]} />
                <Text size="xs" c={theme.colors.midnight[10]}>
                  <b>{source.datasets.length}</b> datasets
                </Text>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper radius="lg" bg="#d6e4ed" px={10} py={3}>
              <Group gap={5} justify="center" wrap="nowrap">
                <IconPaw color={theme.colors.midnight[10]} />
                <Text size="xs" c={theme.colors.midnight[10]}>
                  <b>{source.species.total}</b> species
                </Text>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper radius="lg" bg="#d6e4ed" px={10} py={3}>
              <Group gap={5} justify="center" wrap="nowrap">
                <IconLicense color={theme.colors.midnight[10]} />
                <Text size="xs" c={theme.colors.midnight[10]}>
                  <b>Open</b> access
                </Text>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
}

export default function BrowseSource({ params }: { params: { name: string } }) {
  const source = decodeURIComponent(params.name).replaceAll("_", " ");
  const [_, setPreviousPage] = usePreviousPage();

  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: source },
  });

  useEffect(() => {
    setPreviousPage({
      name: `browsing ${source}`,
      url: `/browse/sources/${params.name}`,
    });
  }, [setPreviousPage]);

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Text c="dimmed" fw={400}>
                DATA COLLECTION
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap={0}>
                <Text fz={38} fw={700}>
                  {source}
                </Text>
                {data?.source ? (
                  <SourceDetails source={data?.source} loading={loading} />
                ) : (
                  error?.message
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              {data?.source.datasets ? (
                <BrowseComponentDatasets datasets={data?.source.datasets} />
              ) : (
                error?.message
              )}
            </Paper>
            <Paper p="xl" radius="lg" withBorder>
              <Species source={source} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
