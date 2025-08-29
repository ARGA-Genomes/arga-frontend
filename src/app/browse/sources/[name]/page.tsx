"use client";

import { MAX_WIDTH } from "@/app/constants";
import { AttributePill } from "@/components/data-fields";
import { Filter, intoFilterItem } from "@/components/filtering/common";
import { HasDataFilters } from "@/components/filtering/has-data";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { DataPageCitation } from "@/components/page-citation";
import { PaginationBar } from "@/components/pagination";
import { SortChip } from "@/components/sorting/sort-chips";
import { SpeciesCard } from "@/components/species-card";
import { getLicense } from "@/helpers/getLicense";
import { gql, useQuery } from "@apollo/client";
import {
  Accordion,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Chip,
  Container,
  Drawer,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowsSort, IconClockHour4, IconExternalLink, IconFilter } from "@tabler/icons-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import classes from "../../../../components/record-list.module.css";

// Icons data
import { DatasetDetails, Source } from "@/generated/types";
import { grouping as groupingData } from "../../../(home)/_data";
import { array as groupingExtra } from "../../../browse/groups/_data/all";

const PAGE_SIZE = 10;
interface Filters {
  classifications: Filter[];
  dataTypes: Filter[];
}

const GET_DETAILS = gql`
  query SourceDetails($name: String) {
    source(by: { name: $name }) {
      license
      accessRights
      rightsHolder
      author
      name
      listsId
      accessPill
      reusePill

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
        accessPill
        reusePill
        publicationYear
      }
    }
  }
`;

type AccessPillType = "OPEN" | "RESTRICTED" | "CONDITIONAL" | "VARIABLE";

const accessPillColours: Record<AccessPillType, string> = {
  OPEN: "moss.3",
  RESTRICTED: "red.3",
  CONDITIONAL: "wheat.3",
  VARIABLE: "wheat.3",
};

type ReusePillType = "LIMITED" | "NONE" | "UNLIMITED" | "VARIABLE";

const reusePillColours: Record<ReusePillType, string> = {
  UNLIMITED: "moss.3",
  LIMITED: "wheat.3",
  NONE: "#d6e4ed",
  VARIABLE: "wheat.3",
};

const GET_SPECIES = gql`
  query SourceSpecies($name: String, $page: Int, $pageSize: Int, $filters: [FilterItem]) {
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

interface FiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications);
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
            image="/icons/data-type/Data type_ Whole genome.svg"
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
            image="/icons/data-type/Data type_ Higher taxon report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters filters={classifications} onChange={setClassifications} />
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
  return (
    <Badge variant="outline">
      {filter.scientificName || filter.canonicalName || filter.vernacularGroup || filter.hasData}
    </Badge>
  );
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

  const { loading, error, data } = useQuery<{ source: Source }>(GET_SPECIES, {
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
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
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
            {flattenFilters(filters).map((filter, idx) => (
              <FilterBadge key={idx} filter={filter} />
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

      {records.length === 0 && <Text className={classes.emptyList}>no data</Text>}

      <SimpleGrid cols={5}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar total={data?.source.species.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
    </Stack>
  );
}

function DatasetSort({ sortBy, setSortBy }: { sortBy: string | null; setSortBy: (value: string | null) => void }) {
  const theme = useMantineTheme();
  const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === sortBy) {
      setSortBy(null);
    }
  };
  return (
    <Group>
      <Group gap={5}>
        <IconArrowsSort color={theme.colors.midnight[10]} />
        <Text size="sm" fw={550} c={theme.colors.midnight[10]}>
          Sort by
        </Text>
      </Group>
      <Chip.Group multiple={false} value={sortBy} onChange={setSortBy}>
        <Group>
          <SortChip value="alphabetical" onClick={handleChipClick}>
            <b>A-Z</b>
          </SortChip>

          <SortChip value="date" onClick={handleChipClick}>
            <b>Last updated</b>
          </SortChip>

          <SortChip value="records" onClick={handleChipClick} disabled>
            <b>Records</b>
          </SortChip>
        </Group>
      </Chip.Group>
    </Group>
  );
}

function BrowseComponentDatasets({ datasets }: { datasets: DatasetDetails[] }) {
  const [sortBy, setSortBy] = useState<string | null>(null);

  const filteredDatasets = datasets.filter((dataset) => dataset.name.trim() !== "");

  const sortedDatasets = useMemo(() => {
    return [...filteredDatasets].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "year": {
          const yearA = a.publicationYear ? a.publicationYear : 0;
          const yearB = b.publicationYear ? b.publicationYear : 0;
          return yearB - yearA; // Newest to Oldest
        }
        default:
          return 0;
      }
    });
  }, [filteredDatasets, sortBy]);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={5}>Component Datasets</Title>
        <DatasetSort sortBy={sortBy} setSortBy={setSortBy} />
      </Group>

      <ScrollArea.Autosize mah={300} type="auto" offsetScrollbars>
        <Box p={10}>
          {sortedDatasets.length === 0 && (
            <Center>
              <Text className={classes.emptyList}>no data</Text>
            </Center>
          )}

          {sortedDatasets.map((dataset, idx) => {
            return <DatasetRow key={idx} dataset={dataset} />;
          })}
        </Box>
      </ScrollArea.Autosize>
    </Stack>
  );
}

function DatasetRow({ dataset }: { dataset: DatasetDetails }) {
  const theme = useMantineTheme();

  return (
    <Paper radius="lg" withBorder mb={20}>
      <Grid>
        <Grid.Col span={3} p="lg">
          <Stack gap={3}>
            <Text fw={600} size="md" c="midnight.10">
              {dataset.name}
            </Text>
            <Group gap={3}>
              <IconClockHour4 size={15} color={theme.colors.gray[6]} />
              <Text c="dimmed" size="xs">
                Last updated: {DateTime.fromISO(dataset.updatedAt).toLocaleString()}
              </Text>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Rights holder" value={dataset.rightsHolder} popoverDisabled textColor="black" />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Access rights"
            value={
              dataset.accessPill
                ?.toLowerCase()
                .charAt(0)
                .toUpperCase()
                .concat(dataset.accessPill.slice(1).toLowerCase()) || "No data"
            }
            color={dataset.accessPill ? accessPillColours[dataset.accessPill] : "#d6e4ed"}
            popoverDisabled
            textColor="black"
          />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Data reuse status"
            value={
              dataset.reusePill
                ?.toLowerCase()
                .charAt(0)
                .toUpperCase()
                .concat(dataset.reusePill.slice(1).toLowerCase()) || "No data"
            }
            color={dataset.reusePill ? reusePillColours[dataset.reusePill] : "#d6e4ed"}
            popoverDisabled
            textColor="black"
          />
        </Grid.Col>
        <Grid.Col span={1} p="lg">
          <AttributePill label="Records" value="No data" popoverDisabled textColor="black" />
        </Grid.Col>
        <Grid.Col span={1} p="lg">
          <AttributePill label="Year" value={dataset.publicationYear || "No data"} popoverDisabled textColor="black" />
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

function SourceDetails({ source, loading }: { source: Source; loading: boolean }) {
  const theme = useMantineTheme();

  // Gross and hacky and terrible, to fix at a later date
  const LISTS_URL = location.href.startsWith("https://app") ? "lists.ala.org.au" : "lists.test.ala.org.au";

  const license = getLicense(source.license);

  return (
    <Box w="100%">
      <Stack gap={4}>
        <LoadOverlay visible={loading} />
        <Text fw="bold" c="dimmed" size="xs">
          {source.author}
        </Text>
        <Text c="dimmed" size="xs">
          &copy; {source.rightsHolder}
        </Text>
        {source.listsId && (
          <Anchor
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            target="_blank"
            size="xs"
            href={`https://${LISTS_URL}/list/${source.listsId}`}
            mt="sm"
          >
            View on ALA Lists <IconExternalLink size="0.8rem" />
          </Anchor>
        )}
        <Group mt="lg">
          <Paper miw={110} radius="lg" bg="#d6e4ed" px={10} py={3}>
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>{source.datasets.length}</b> datasets
              </Text>
            </Group>
          </Paper>
          <Paper miw={110} radius="lg" bg="#d6e4ed" px={10} py={3}>
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>{source.species.total}</b> species
              </Text>
            </Group>
          </Paper>
          <Paper
            miw={110}
            radius="lg"
            bg={source.accessPill ? accessPillColours[source.accessPill] : "#d6e4ed"}
            px={10}
            py={3}
          >
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>
                  {source.accessPill
                    ?.toLowerCase()
                    .charAt(0)
                    .toUpperCase()
                    .concat(source.accessPill.slice(1).toLowerCase())}
                </b>{" "}
                access
              </Text>
            </Group>
          </Paper>
          <Paper
            miw={110}
            radius="lg"
            bg={source.reusePill ? reusePillColours[source.reusePill] : "#d6e4ed"}
            px={10}
            py={3}
          >
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>
                  {source.reusePill
                    ?.toLowerCase()
                    .charAt(0)
                    .toUpperCase()
                    .concat(source.reusePill.slice(1).toLowerCase())}
                </b>{" "}
                reuse
              </Text>
            </Group>
          </Paper>
          {license && (
            <Paper component={Link} href={license.url} target="_blank" miw={110} radius="lg" px={10} py={3} withBorder>
              <Group gap={5} justify="center" wrap="nowrap">
                <IconExternalLink size="0.8rem" />
                <Text fw="bold" size="xs" c={theme.colors.midnight[10]} p={4}>
                  {license.name.substring(1, license.name.length - 1)}
                </Text>
              </Group>
            </Paper>
          )}
        </Group>
      </Stack>
    </Box>
  );
}

export default function BrowseSource(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);
  const source = decodeURIComponent(params.name).replaceAll("_", " ");
  const [_, setPreviousPage] = usePreviousPage();

  const names = [params.name, decodeURIComponent(params.name), decodeURIComponent(params.name).replaceAll(" ", "_")];

  const sourceIcon = useMemo(
    () =>
      [
        ...groupingData,
        ...groupingExtra
          .filter((item) => !item.filter)
          .map((item) => ({
            image: item.image,
            link: `/${item.source}`,
          })),
      ].find((item) => {
        const link = item.link.substring(item.link.lastIndexOf("/") + 1);
        return names.includes(link);
      })?.image,
    [params.name]
  );

  const { loading, error, data } = useQuery<{ source: Source }>(GET_DETAILS, {
    variables: { name: source },
  });

  useEffect(() => {
    setPreviousPage({
      name: `browsing ${source}`,
      url: `/browse/sources/${params.name}`,
    });
  }, [source, params.name, setPreviousPage]);

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Grid align="center">
            <Grid.Col span="auto">
              <Stack gap={0}>
                <Text c="dimmed" fw={400}>
                  DATA COLLECTION
                </Text>
                <Text fz={38} fw={700}>
                  {source}
                </Text>
                {data?.source ? <SourceDetails source={data.source} loading={loading} /> : error?.message}
              </Stack>
            </Grid.Col>
            {sourceIcon && (
              <Grid.Col span="content">
                <Image maw={180} alt={`${sourceIcon} icon`} src={sourceIcon} />
              </Grid.Col>
            )}
          </Grid>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH} pb={16}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              {data?.source.datasets ? <BrowseComponentDatasets datasets={data.source.datasets} /> : error?.message}
            </Paper>
            <Paper p="xl" radius="lg" withBorder>
              <Species source={source} />
            </Paper>
          </Stack>
        </Container>
        <DataPageCitation />
      </Paper>
    </Stack>
  );
}
