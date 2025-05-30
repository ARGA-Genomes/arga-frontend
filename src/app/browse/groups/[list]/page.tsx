"use client";

import { useEffect, use } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  Text,
  Group,
  Stack,
  Container,
  Box,
  Grid,
  useMantineTheme,
  Anchor,
  Image,
  // Flex,
  // ThemeIcon,
} from "@mantine/core";
import { IconExternalLink /*, IconStarFilled*/ } from "@tabler/icons-react";
import Link from "next/link";

// App components & constants
import { MAX_WIDTH } from "@/app/constants";
import { DataPageCitation } from "@/components/page-citation";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";

import { groupInclude, GroupItem, map as queryMap } from "../_data/all";
import { useRouter } from "next/navigation";
import { getLicense } from "@/helpers/getLicense";
import { BrowseSpecies } from "@/components/browse-species";
// import { DataSummary, Taxonomy } from "./data-summary";

// import stubData from "./data-summary-stub.json";

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
        name
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
    $sort: SpeciesSort
    $sortDirection: SortDirection
  ) {
    browse: source(by: { name: $name }, filters: $filters) {
      species(page: $page, pageSize: $pageSize, sort: $sort, sortDirection: $sortDirection) {
        total
        records {
          taxonomy {
            canonicalName
            status
            vernacularGroup
            source
            sourceUrl
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

const DOWNLOAD_SPECIES = gql`
  query DownloadSourceSpecies($name: String, $filters: [FilterItem]) {
    download: source(by: { name: $name }, filters: $filters) {
      csv: speciesCsv
    }
  }
`;

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
  const theme = useMantineTheme();
  const params = use(props.params);
  const router = useRouter();

  const group = (queryMap as Record<string, GroupItem>)[params.list];
  const [_, setPreviousPage] = usePreviousPage();

  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: group?.source.replaceAll("_", " ") || "", filters: groupInclude(group) },
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

  const OPTION = 2;

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
            {/* <Paper radius="lg" pos="relative" withBorder>
              <Stack
                justify="center"
                align="center"
                px="xl"
                py="md"
                mb={34}
                bg="wheat.0"
                style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              >
                <Text fw="bold" c="wheat.7">
                  Dataset highlights
                </Text>
                <Flex direction="row" align="center" justify="center" mb={-48} gap="lg">
                  <Paper miw={200} radius="lg" p="xs" shadow="sm" withBorder>
                    <Stack gap={4}>
                      <Text c="dimmed" size="xs" fw="bold">
                        LATEST GENOME RELEASE
                      </Text>
                      <Text fw="bold" fs="italic" c="shellfish.9">
                        Slaysia slayness
                      </Text>
                    </Stack>
                  </Paper>
                  <ThemeIcon radius="xl" color="wheat" variant="white">
                    <IconStarFilled size="1rem" />
                  </ThemeIcon>
                  <Paper miw={200} radius="lg" p="xs" shadow="sm" withBorder>
                    <Stack gap={4}>
                      <Text c="dimmed" size="xs" fw="bold">
                        MOST GENOMES
                      </Text>
                      <Text fw="bold" fs="italic" c="shellfish.9">
                        Slaysia slayness
                      </Text>
                    </Stack>
                  </Paper>
                  <ThemeIcon radius="xl" color="wheat" variant="white">
                    <IconStarFilled size="1rem" />
                  </ThemeIcon>
                  <Paper miw={200} radius="lg" p="xs" shadow="sm" withBorder>
                    <Stack gap={4}>
                      <Text c="dimmed" size="xs" fw="bold">
                        MOST LOCI
                      </Text>
                      <Text fw="bold" fs="italic" c="shellfish.9">
                        Slaysia slayness
                      </Text>
                    </Stack>
                  </Paper>
                  <ThemeIcon radius="xl" color="wheat" variant="white">
                    <IconStarFilled size="1rem" />
                  </ThemeIcon>
                  <Paper miw={200} radius="lg" p="xs" shadow="sm" withBorder>
                    <Stack gap={4}>
                      <Text c="dimmed" size="xs" fw="bold">
                        MOST DATA
                      </Text>
                      <Text fw="bold" fs="italic" c="shellfish.9">
                        Slaysia slayness
                      </Text>
                    </Stack>
                  </Paper>
                </Flex>
              </Stack>
              <Box p="xl">
                <DataSummary rank="KINGDOM" taxon={stubData as unknown as Taxonomy} />
              </Box>
            </Paper> */}
            <Paper p="xl" radius="lg" withBorder>
              <BrowseSpecies
                query={{
                  content: GET_SPECIES,
                  download: DOWNLOAD_SPECIES,
                  variables: { name: group.source, filters: groupInclude(group) },
                }}
              />
            </Paper>
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
