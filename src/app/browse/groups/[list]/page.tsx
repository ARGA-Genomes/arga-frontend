"use client";

import { useEffect, useState, use, ReactElement } from "react";
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
  Box,
  Grid,
  useMantineTheme,
  Anchor,
  Image,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { Photo } from "@/app/type";
import Link from "next/link";

// App components & constants
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/components/pagination";
import { DataPageCitation } from "@/components/page-citation";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";

import classes from "../../../../components/record-list.module.css";
import { map as queryMap } from "../_data/all";
import { useRouter } from "next/navigation";
import { getLicense } from "@/helpers/getLicense";
import { FiltersDrawer } from "@/components/filtering-redux/drawer";
import { FilterItem } from "@/components/filtering-redux/filters/common";

const PAGE_SIZE = 10;

const GET_DETAILS = gql`
  query SourceDetails($name: String, $speciesAttribute: NameAttributeFilter) {
    source(by: { name: $name }, speciesAttribute: $speciesAttribute) {
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
      }
    }
  }
`;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[];
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

function Species({ group }: { group: ListGroup }) {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [filterChips, setFilterChips] = useState<ReactElement[] | null>(null);

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: {
      page,
      pageSize: PAGE_SIZE,
      name: group.source,
      filters: filters,
      speciesAttribute: group.filter || null,
    },
  });

  const records = Array.from(data?.source.species.records || []);

  return (
    <Stack>
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
            <Group gap="xs">{filterChips}</Group>
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <FiltersDrawer types={["dataType", "classification"]} onFilter={setFilters} onFilterChips={setFilterChips} />
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

function GroupDetails({ source, loading }: { source: Source; loading: boolean }) {
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

export default function BrowseGroup(props: { params: Promise<{ list: string }> }) {
  const params = use(props.params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minDate = new Date("2009-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 10}-01-01`);

  const group = (queryMap as Record<string, ListGroup>)[params.list];
  const [_, setPreviousPage] = usePreviousPage();

  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: group?.source.replaceAll("_", " ") || "", speciesAttribute: group.filter || null },
    skip: !group,
  });

  useEffect(() => {
    if (group) {
      setPreviousPage({
        name: `browsing ${group.category}`,
        url: `/browse/groups/${params.list}`,
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
            <Grid.Col span="auto">
              <Stack gap={0}>
                <Text c="dimmed" fw={400}>
                  LIST GROUP
                </Text>
                <Text fz={38} fw={700}>
                  {group.category}
                </Text>
                {data?.source ? <GroupDetails source={data.source} loading={loading} /> : error?.message}
              </Stack>
            </Grid.Col>
            <Grid.Col span="content">
              <Image maw={180} alt={`${group.category} icon`} src={group.image} />
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>
      <Paper py={30}>
        <Container maw={MAX_WIDTH} pb={16}>
          <Stack>
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
