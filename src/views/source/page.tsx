"use client";

import { MAX_WIDTH } from "@/app/constants";
import { usePreviousPage } from "@/components/navigation-history";
import { DataPageCitation } from "@/components/page-citation";
import { SortChip } from "@/components/sorting/sort-chips";
import { getLicense } from "@/helpers/getLicense";
import { gql, useQuery } from "@apollo/client";
import {
  Anchor,
  Box,
  Center,
  Chip,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowsSort, IconBuildingBank, IconClockHour4, IconExternalLink } from "@tabler/icons-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import classes from "../../components/record-list.module.css";

// Icons data
import { BrowseSpecies } from "@/components/browse-species";
import { FilterItem } from "@/components/filtering-redux/filters/common";
import { DatasetDetails, RankSummary, Source } from "@/generated/types";
import { grouping as groupingData } from "../../app/(home)/_data";
import { groupInclude, array as groupingExtra, GroupItem } from "../../app/browse/list-groups/_data/all";
import DataHighlights from "./_components/data-highlights";
import { DataSummary } from "./_components/data-summary";

import pageClasses from "./page.module.css";

const GET_DETAILS = gql`
  query SourceDetails($name: String, $filters: [FilterItem]) {
    source(by: { name: $name }, filters: $filters) {
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
        id
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

      speciesRankSummary: summary {
        total
        genomes
        loci
        genomicData
      }

      latestGenomeReleases {
        canonicalName
        releaseDate
      }

      speciesGenomicDataSummary {
        canonicalName
        totalGenomic
      }

      speciesGenomesSummary {
        canonicalName
        genomes
      }

      speciesLociSummary {
        canonicalName
        loci
      }

      taxonomicDiversity {
        kingdom
        phylum
        count
      }
    }
  }
`;

export interface ExtendedSource extends Source {
  speciesRankSummary: RankSummary;
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
  NONE: "bushfire.3",
  VARIABLE: "wheat.3",
};

const GET_SPECIES = gql`
  query SourceSpecies(
    $name: String
    $page: Int
    $pageSize: Int
    $filters: [FilterItem]
    $sort: SpeciesSort
    $sortDirection: SortDirection
  ) {
    browse: source(by: { name: $name }, filters: $filters) {
      species(page: $page, pageSize: $pageSize, sort: $sort, sortDirection: $sortDirection) {
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

function BrowseComponentDatasets({ datasets }: { datasets?: DatasetDetails[] }) {
  const [sortBy, setSortBy] = useState<string | null>(null);

  const sortedDatasets = useMemo(() => {
    if (datasets) {
      return datasets
        .filter((dataset) => dataset.name.trim() !== "")
        .sort((a, b) => {
          switch (sortBy) {
            case "alphabetical":
              return a.name.localeCompare(b.name);
            case "date": {
              return (b.publicationYear || 0) - (a.publicationYear || 0); // Newest to Oldest
            }
            default:
              return 0;
          }
        });
    }

    return null;
  }, [datasets, sortBy]);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={5}>Component Datasets</Title>
        <DatasetSort sortBy={sortBy} setSortBy={setSortBy} />
      </Group>
      <ScrollArea.Autosize mah={600} type="auto" offsetScrollbars>
        <Stack gap="lg">
          {sortedDatasets ? (
            sortedDatasets.length > 0 ? (
              sortedDatasets.map((dataset, idx) => {
                return <DatasetRow key={idx} dataset={dataset} />;
              })
            ) : (
              <Center>
                <Text className={classes.emptyList}>no data</Text>
              </Center>
            )
          ) : (
            [0, 1, 2, 3, 4, 5, 6].map((idx) => <DatasetRow key={idx} />)
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Stack>
  );
}

function ViewSourceButton({ dataset }: { dataset?: DatasetDetails }) {
  return (
    <UnstyledButton className={pageClasses.gotoSource} component={Link} href={dataset?.url || "#"}>
      <Paper radius="lg" pl="sm" pr={1} withBorder>
        <Group gap="xs" h={30.8}>
          <Text fw="bold" c="dimmed" size="xs">
            View source
          </Text>
          <ThemeIcon color="shellfish.4" radius="lg">
            <IconExternalLink size="1rem" />
          </ThemeIcon>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}

function DatasetRow({ dataset }: { dataset?: DatasetDetails }) {
  const license = dataset?.license ? getLicense(dataset.license) : null;
  const theme = useMantineTheme();

  return (
    <Paper px="md" py="md" radius="lg" shadow="sm" withBorder>
      <Stack gap="lg">
        <Flex gap="xl" justify="space-between">
          <Stack style={{ flexGrow: 1 }} gap="sm">
            <Skeleton maw="100%" visible={!dataset}>
              <Text fw={600} size="md" c="midnight.10">
                {dataset?.name || "Dataset name"}
              </Text>
            </Skeleton>
            <Skeleton visible={!dataset}>
              <Stack gap={4}>
                <Group gap="xs">
                  <IconBuildingBank size={15} color={theme.colors.gray[6]} />
                  <Text c="dimmed" size="xs" fw="bold">
                    {dataset?.rightsHolder || "Rights holder"}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconClockHour4 size={15} color={theme.colors.gray[6]} />
                  <Text c="dimmed" size="xs">
                    Last updated:{" "}
                    {dataset ? DateTime.fromISO(dataset.updatedAt).toLocaleString() : "Last updated: 1/1/2000"}
                  </Text>
                </Group>
                {license && (
                  <Group gap="xs">
                    <Image w={12} h={12} src={`/icons/creative-commons/${license.icons[0]}.svg`} opacity={0.5} />
                    <Text c="dimmed" size="xs">
                      {license.name.substring(1, license.name.length - 1)}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Skeleton>
          </Stack>
        </Flex>
        <Group justify="space-between">
          <Group>
            <Skeleton w={140} radius="lg" visible={!dataset}>
              <Paper
                shadow="none"
                radius="lg"
                bg={dataset?.accessPill ? accessPillColours[dataset.accessPill] : "#d6e4ed"}
                px={10}
                py={3}
              >
                <Group justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>
                      {dataset?.accessPill
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase()
                        .concat(dataset.accessPill.slice(1).toLowerCase()) || "Unknown"}
                    </b>{" "}
                    access
                  </Text>
                </Group>
              </Paper>
            </Skeleton>
            <Skeleton w={140} radius="lg" visible={!dataset}>
              <Paper
                shadow="none"
                radius="lg"
                bg={dataset?.reusePill ? reusePillColours[dataset.reusePill] : "#d6e4ed"}
                px={10}
                py={3}
              >
                <Group justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>
                      {dataset?.reusePill
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase()
                        .concat(dataset.reusePill.slice(1).toLowerCase()) || "Unknown"}
                    </b>{" "}
                    reuse
                  </Text>
                </Group>
              </Paper>
            </Skeleton>
            <Skeleton w={140} radius="lg" visible={!dataset}>
              <Paper shadow="none" radius="lg" bg="#d6e4ed" px={10} py={3}>
                <Group gap={5} justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>{dataset?.publicationYear || "Unknown"}</b> publish
                  </Text>
                </Group>
              </Paper>
            </Skeleton>
          </Group>
          <Skeleton radius="lg" w={126} visible={!dataset}>
            <ViewSourceButton dataset={dataset} />
          </Skeleton>
        </Group>
      </Stack>
    </Paper>
  );
}

function SourceDetails({ source }: { source?: ExtendedSource }) {
  const theme = useMantineTheme();

  // Gross and hacky and terrible, to fix at a later date
  const LISTS_URL =
    typeof window !== "undefined" && location.href.startsWith("https://app")
      ? "lists.ala.org.au"
      : "lists.test.ala.org.au";

  const loading = !source;
  const license = source ? getLicense(source.license) : "";

  return (
    <Box w="100%">
      <Stack gap={4}>
        <Skeleton visible={loading} maw={loading ? 100 : undefined}>
          <Text fw="bold" c="dimmed" size="xs">
            {source?.author || "Author"}
          </Text>
        </Skeleton>
        <Skeleton visible={loading} maw={loading ? 650 : undefined}>
          <Text c="dimmed" size="xs">
            &copy; {source?.rightsHolder || "Rights Holder"}
          </Text>
        </Skeleton>

        <Skeleton visible={loading} mt="sm" maw={loading ? 140 : undefined}>
          <Anchor
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            target="_blank"
            size="xs"
            href={`https://${LISTS_URL}/list/${source?.listsId}`}
          >
            View on ALA Lists <IconExternalLink size="0.8rem" />
          </Anchor>
        </Skeleton>
        <Group mt="lg">
          {loading ? (
            [0, 1, 2, 3, 4].map((index) => <Skeleton key={index} w={110} h={30.8} radius="xl" />)
          ) : (
            <>
              <Paper miw={110} radius="lg" bg="#d6e4ed" px={10} py={3}>
                <Group gap={5} justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>{source?.datasets.length}</b> datasets
                  </Text>
                </Group>
              </Paper>
              <Paper miw={110} radius="lg" bg="#d6e4ed" px={10} py={3}>
                <Group gap={5} justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>{source?.species.total}</b> species
                  </Text>
                </Group>
              </Paper>
              <Paper
                miw={110}
                radius="lg"
                bg={source?.accessPill ? accessPillColours[source.accessPill] : "#d6e4ed"}
                px={10}
                py={3}
              >
                <Group justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>
                      {source?.accessPill
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
                bg={source?.reusePill ? reusePillColours[source.reusePill] : "#d6e4ed"}
                px={10}
                py={3}
              >
                <Group justify="center" wrap="nowrap">
                  <Text size="xs" c={theme.colors.midnight[10]} p={4}>
                    <b>
                      {source?.reusePill
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
                <Paper
                  shadow="none"
                  component={Link}
                  href={license.url}
                  target="_blank"
                  miw={110}
                  radius="lg"
                  px={10}
                  py={3}
                  withBorder
                >
                  <Group gap={5} justify="center" wrap="nowrap">
                    <IconExternalLink size="0.8rem" />
                    <Text fw="bold" size="xs" c={theme.colors.midnight[10]} p={4}>
                      {license.name.substring(1, license.name.length - 1)}
                    </Text>
                  </Group>
                </Paper>
              )}
            </>
          )}
        </Group>
      </Stack>
    </Box>
  );
}

const DOWNLOAD_SPECIES = gql`
  query DownloadSourceSpecies($name: String, $filters: [FilterItem]) {
    download: source(by: { name: $name }, filters: $filters) {
      csv: speciesCsv
    }
  }
`;

interface SourceProps {
  source: string;
  name: string;
  group?: GroupItem;
}

export default function SourcePage(props: SourceProps) {
  const { source, name, group } = props;
  const [_, setPreviousPage] = usePreviousPage();

  // const names = [name, decodeURIComponent(name), decodeURIComponent(name).replaceAll(" ", "_")];
  const filters = group ? groupInclude(group) : [];

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
        return name.includes(link);
      })?.image,
    [name]
  );

  const { loading, error, data } = useQuery<{ source: ExtendedSource }>(GET_DETAILS, {
    variables: { name: source, filters },
  });

  useEffect(() => {
    setPreviousPage({
      name: `browsing ${name}`,
      url: `/browse/${group ? "groups" : "source"}/${name}`,
    });
  }, [source, name, setPreviousPage]);

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Grid align="center">
            <Grid.Col span="auto">
              <Stack gap={0}>
                <Text c="dimmed" fw={400}>
                  {group ? "LIST GROUP" : "DATA COLLECTION"}
                </Text>
                <Text fz={38} fw={700}>
                  {group ? group.category : source}
                </Text>
                {error ? <Text fw="bold">{error.message}</Text> : <SourceDetails source={data?.source} />}
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
            <Paper radius="lg" pos="relative" withBorder>
              <DataHighlights source={data?.source} loading={loading} />
              <Box p="xl">
                <DataSummary source={data?.source} filters={filters as FilterItem[]} />
              </Box>
            </Paper>
            <Paper p="xl" radius="lg" withBorder>
              <BrowseSpecies
                query={{
                  content: GET_SPECIES,
                  download: DOWNLOAD_SPECIES,
                  variables: { name: source, filters },
                }}
                values={{ datasets: data?.source.datasets }}
              />
            </Paper>
            <Paper p="xl" radius="lg" withBorder>
              {error ? (
                <Center>
                  <Text>{error.message}</Text>
                </Center>
              ) : (
                <BrowseComponentDatasets datasets={data?.source.datasets} />
              )}
            </Paper>
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
