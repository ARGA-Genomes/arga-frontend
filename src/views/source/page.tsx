"use client";

import { MAX_WIDTH } from "@/app/constants";
import { AttributePill } from "@/components/data-fields";
import { usePreviousPage } from "@/components/navigation-history";
import { DataPageCitation } from "@/components/page-citation";
import { SortChip } from "@/components/sorting/sort-chips";
import { getLicense } from "@/helpers/getLicense";
import { gql, useQuery } from "@apollo/client";
import {
  Anchor,
  Box,
  Button,
  Center,
  Chip,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowsSort, IconClockHour4, IconExternalLink } from "@tabler/icons-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import classes from "../../components/record-list.module.css";

// Icons data
import { BrowseSpecies } from "@/components/browse-species";
import { FilterItem } from "@/components/filtering-redux/filters/common";
import { DatasetDetails, Source } from "@/generated/types";
import { grouping as groupingData } from "../../app/(home)/_data";
import { groupInclude, array as groupingExtra, GroupItem } from "../../app/browse/groups/_data/all";
import DataHighlights from "./_components/data-highlights";
import { DataSummary } from "./_components/data-summary";

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
    browse: source(by: { name: $name }, filters: $filters) {
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

function SourceDetails({ source }: { source?: Source }) {
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
                <Group gap={5} justify="center" wrap="nowrap">
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
                <Group gap={5} justify="center" wrap="nowrap">
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

  const { loading, error, data } = useQuery<{ source: Source }>(GET_DETAILS, {
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
              {data?.source.datasets ? <BrowseComponentDatasets datasets={data.source.datasets} /> : error?.message}
            </Paper>
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
