"use client";

import { MAX_WIDTH } from "@/app/constants";
import { DataPageCitation } from "@/components/page-citation";
import { getLicense } from "@/helpers/getLicense";
import { gql, useQuery } from "@apollo/client";
import {
  Anchor,
  Box,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

// Icons data
import { BrowseSpecies } from "@/components/browse-species";
import { FilterItem } from "@/components/filtering-redux/filters/common";
import { RankSummary, Source } from "@/generated/types";
import { grouping as groupingData } from "../../app/(home)/_data";
import { groupInclude, array as groupingExtra, GroupItem } from "../../app/browse/list-groups/_data/all";
import DataHighlights from "./_components/data-highlights";
import { DataSummary } from "./_components/data-summary";

import { usePreviousPage } from "@/components/navigation-history";
import { ComponentDatasets } from "./_components/component-datasets";

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

function SourceDetails({ source, group }: { source?: ExtendedSource; group?: GroupItem }) {
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
            View {group ? "full list" : "list"} on ALA Lists <IconExternalLink size="0.8rem" />
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
  const filters = group ? groupInclude(group) : [];
  const [, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({
      name: `browsing ${name}`,
      url: `/browse/${group ? "list-groups" : "source"}/${name}`,
    });
  }, [source, name, group, setPreviousPage]);

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
                {error ? <Text fw="bold">{error.message}</Text> : <SourceDetails source={data?.source} group={group} />}
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
            {!group && (
              <Paper p="xl" radius="lg" withBorder>
                {error ? (
                  <Center>
                    <Text>{error.message}</Text>
                  </Center>
                ) : (
                  <ComponentDatasets datasets={data?.source.datasets} />
                )}
              </Paper>
            )}
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
