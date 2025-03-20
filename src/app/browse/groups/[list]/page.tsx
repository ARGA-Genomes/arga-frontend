"use client";

import { useEffect, useState, useMemo, use } from "react";
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
  Button,
  Accordion,
  Badge,
  Avatar,
  useMantineTheme,
  Anchor,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconClockHour4, IconExternalLink, IconArrowsSort } from "@tabler/icons-react";
import { Photo } from "@/app/type";
import Link from "next/link";

// App components & constants
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/components/pagination";
import { DataPageCitation } from "@/components/page-citation";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { HasDataFilters } from "@/components/filtering/has-data";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";

import classes from "../../../../components/record-list.module.css";
import { map as queryMap } from "../_data/all";
import { useRouter } from "next/navigation";
import { getLicense } from "@/helpers/getLicense";

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

interface Dataset {
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  citation?: string;
  license?: string;
  rightsHolder?: string;
  createdAt: string;
  updatedAt: string;
  reusePill?: ReusePillType;
  accessPill?: AccessPillType;
  publicationYear?: number;
}

interface ListGroup {
  category: string;
  image: string;
  source: string;
  filter: {
    name: string;
    value: {
      string?: string;
      bool?: boolean;
      int?: number;
    };
  };
}

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

interface SpeciesCount {
  total: number;
}

interface Source {
  license: string;
  accessRights: string;
  rightsHolder: string;
  author: string;
  name: string;
  listsId: string | null;
  reusePill?: ReusePillType;
  accessPill?: AccessPillType;
  species: SpeciesCount;
  datasets: Dataset[];
}

interface DetailsQueryResults {
  source: Source;
}

const GET_SPECIES = gql`
  query SourceSpecies(
    $name: String
    $page: Int
    $pageSize: Int
    $filters: [FilterItem]
    $speciesAttribute: NameAttributeFilter
  ) {
    source(by: { name: $name }, filters: $filters, speciesAttribute: $speciesAttribute) {
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

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

interface SpeciesRecord {
  taxonomy: { canonicalName: string };
  photo: Photo;
  dataSummary: DataSummary;
}

interface SpeciesQueryResults {
  source: {
    species: {
      records: SpeciesRecord[];
      total: number;
    };
  };
}

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

function Species({ group }: { group: ListGroup }) {
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
      name: group.source,
      filters: flattenFilters(filters)
        .map(intoFilterItem)
        .filter((item) => item),
      speciesAttribute: group.filter || null,
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

function SourceDetails({ source, loading }: { source: Source; loading: boolean }) {
  const theme = useMantineTheme();

  // Gross and hacky and terrible, to fix at a later date
  const LISTS_URL = location.href.startsWith("https://app") ? "lists.ala.org.au" : "lists.test.ala.org.au";

  const license = getLicense(source.license);

  return (
    <Box w="100%">
      <Stack gap={4}>
        <LoadOverlay visible={loading} />
        <Text c="dimmed" size="xs">
          From{" "}
          <Anchor fw="bold" component={Link} href={`/browse/sources/${encodeURIComponent(source.name)}`}>
            {source.name}
          </Anchor>
          , {source.author}
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
          <Paper miw={150} radius="lg" bg="#d6e4ed" px={10} py={3}>
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>{source.datasets.length}</b> source datasets
              </Text>
            </Group>
          </Paper>
          <Paper miw={150} radius="lg" bg="#d6e4ed" px={10} py={3}>
            <Group gap={5} justify="center" wrap="nowrap">
              <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                <b>{source.species.total}</b> species
              </Text>
            </Group>
          </Paper>
          <Paper
            miw={150}
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
            miw={150}
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
            <Paper component={Link} href={license.url} target="_blank" miw={150} radius="lg" px={10} py={3} withBorder>
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

export default function BrowseSource(props: { params: Promise<{ list: string }> }) {
  const params = use(props.params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = (queryMap as Record<string, ListGroup>)[params.list];
  const [_, setPreviousPage] = usePreviousPage();

  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: group?.source.replaceAll("_", " ") || "" },
    skip: !group,
  });

  useEffect(() => {
    if (group) {
      setPreviousPage({
        name: `browsing ${group.category}`,
        url: `/browse/sources/${params.list}`,
      });
    } else {
      router.replace("/browse/groups");
    }
  }, [group, params.list, router, setPreviousPage]);

  if (!group) return null;

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Text c="dimmed" fw={400}>
                LIST GROUP
              </Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Stack gap={0}>
                <Text fz={38} fw={700}>
                  {group.category}
                </Text>
                {data?.source ? <SourceDetails source={data.source} loading={loading} /> : error?.message}
              </Stack>
            </Grid.Col>
            <Grid.Col span="content">
              <Image maw={125} alt={`${group.category} icon`} src={group.image} />
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH} pb={16}>
          <Stack>
            {/** TODO: IMPLEMENT DASHBOARD: ASK GORAN FOR HELP */}
            {/**
             * Taxonomic breakdown (Rename to data summary):
             * - Number of species
             * - Species with genomes
             * - Species with data
             * - Species with most genomes
             * - Species with most data
             * We want all excluding phyla with genomes
             * We also want:
             * - sunburst from genome tracker
             * - Accumulation curve
             * - taxonomic coverage (start at kingdom level)
             * Artfully arange into an aesthetically pleasing order
             * - Put the genome content above any genetic data (separate)
             */}
            <Paper p="xl" radius="lg" withBorder>
              <Species group={group} />
            </Paper>
          </Stack>
        </Container>
        <DataPageCitation />
      </Paper>
    </Stack>
  );
}
