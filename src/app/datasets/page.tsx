"use client";

import { LoadOverlay } from "@/components/load-overlay";
import { gql, useQuery } from "@apollo/client";
import {
  Grid,
  Paper,
  Button,
  Stack,
  Container,
  Text,
  Group,
  useMantineTheme,
  Accordion,
  Center,
  ScrollArea,
  Box,
  SimpleGrid,
  UnstyledButton,
  Chip,
} from "@mantine/core";
import Link from "next/link";
import { DateTime } from "luxon";
import { AttributePill } from "@/components/data-fields";
import {
  IconExternalLink,
  IconArrowUpRight,
  IconClockHour4,
  IconArrowsSort,
  IconChevronDown,
} from "@tabler/icons-react";
import { MAX_WIDTH } from "../constants";
import classes from "./page.module.css";
import { useState, useMemo } from "react";
import { SortChip } from "@/components/sorting/sort-chips";
import { DataPageCitation } from "@/components/page-citation";
import styles from "../../components/record-list.module.css";
import { TableCardLayout, TableCardSwitch } from "@/components/table-card-switch";

const GET_DATASETS = gql`
  query DatasetsAndSources {
    sources {
      name
      author
      rightsHolder
      accessRights
      license
      listsId
      reusePill
      accessPill
      contentType

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
        reusePill
        accessPill
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

interface Source {
  name: string;
  author: string;
  rightsHolder: string;
  accessRights: string;
  license: string;
  listsId: string | null;
  reusePill?: ReusePillType;
  accessPill?: AccessPillType;
  contentType?: ContentType;
  datasets: Dataset[];
  lastUpdated?: string;
}

interface GroupedSources {
  contentType: string;
  sources: Source[];
}

interface QueryResults {
  sources: Source[];
}

type AccessPillType = "OPEN" | "RESTRICTED" | "CONDITIONAL" | "VARIABLE";

const accessPillColours: Record<AccessPillType, string> = {
  OPEN: "moss.3",
  RESTRICTED: "bushfire.4",
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

type ContentType =
  | "TAXONOMIC_BACKBONE"
  | "ECOLOGICAL_TRAITS"
  | "GENOMIC_DATA"
  | "SPECIMENS"
  | "NONGENOMIC_DATA"
  | "MORPHOLOGICAL_TRAITS"
  | "BIOCHEMICAL_TRAITS"
  | "MIXED_DATATYPES"
  | "FUNCTIONAL_TRAITS"
  | "ETHNOBIOLOGY";

const renameContentType: Record<ContentType, string> = {
  GENOMIC_DATA: "Genomics sources",
  ECOLOGICAL_TRAITS: "Ecological traits sources",
  ETHNOBIOLOGY: "Ethnobiology sources",
  BIOCHEMICAL_TRAITS: "Biochemical traits sources",
  SPECIMENS: "Specimens sources",
  TAXONOMIC_BACKBONE: "Taxonomy sources",
  NONGENOMIC_DATA: "Other non-genomics sources",
  MIXED_DATATYPES: "Mixed data types sources",
  FUNCTIONAL_TRAITS: "Functional traits sources",
  MORPHOLOGICAL_TRAITS: "Morphological traits sources",
};

function DatasetRow({ dataset, sourceLength, count }: { dataset: Dataset; sourceLength: number; count: number }) {
  const theme = useMantineTheme();

  return (
    <Paper radius="lg" withBorder mb={count === sourceLength ? 0 : 20}>
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

function CollectionCard({ collection }: { collection: Source }) {
  return (
    <Paper radius="lg" withBorder className={classes.collectionCard}>
      <Stack gap={10}>
        <UnstyledButton>
          <Link href={`/browse/sources/${collection.name}`}>
            <Paper
              radius="lg"
              // bg="midnight.10"
              w="100%"
              // style={{ borderRadius: "16px 16px 0 0" }}
              className={classes.collectionHeader}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={1}>
                  <Text fw={600} size="md" c="white" pl={10} pt={10} pr={10}>
                    {collection.name}
                  </Text>
                  <Group gap={3} pl={10} pb={10}>
                    <IconClockHour4 size={15} color="white" />
                    {collection.lastUpdated && (
                      <Text c="white" size="xs">
                        Last updated:{" "}
                        {collection.lastUpdated === "01/01/1970"
                          ? "N/A"
                          : DateTime.fromISO(collection.lastUpdated).toLocaleString()}
                      </Text>
                    )}
                  </Group>
                </Stack>

                <Box className={classes.collectionArrowBtn}>
                  <IconArrowUpRight color="white" />
                </Box>
              </Group>
            </Paper>
          </Link>
        </UnstyledButton>
        <Grid py={20} px={40} style={{ position: "relative" }}>
          <Grid.Col span={12}>
            <AttributePill
              label="Rights holder"
              value={collection.rightsHolder}
              group={true}
              popoverDisabled
              textColor="black"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill
              label="Access rights"
              value={
                collection.accessPill
                  ?.toLowerCase()
                  .charAt(0)
                  .toUpperCase()
                  .concat(collection.accessPill.slice(1).toLowerCase()) || "No data"
              }
              group={true}
              color={collection.accessPill ? accessPillColours[collection.accessPill] : "#d6e4ed"}
              popoverDisabled
              textColor="black"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill
              label="Data reuse status"
              value={
                collection.reusePill
                  ?.toLowerCase()
                  .charAt(0)
                  .toUpperCase()
                  .concat(collection.reusePill.slice(1).toLowerCase()) || "No data"
              }
              group={true}
              color={collection.reusePill ? reusePillColours[collection.reusePill] : "#d6e4ed"}
              popoverDisabled
              textColor="black"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill label="Number of records" group={true} popoverDisabled textColor="black" />
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

function CollectionRow({ collection }: { collection: Source }) {
  return (
    <Paper radius="lg" withBorder>
      <Stack>
        <UnstyledButton>
          <Link href={`/browse/sources/${collection.name}`}>
            <Paper radius="lg" w="100%" className={classes.collectionHeader}>
              <Grid>
                <Grid.Col span={3} p="lg">
                  <Stack gap={1}>
                    <Text fw={600} size="md" c="white" pl={10} pt={10} pr={10}>
                      {collection.name}
                    </Text>
                    <Group gap={3} pl={10} pb={10}>
                      <IconClockHour4 size={15} color="white" />
                      {collection.lastUpdated && (
                        <Text c="white" size="xs">
                          Last updated:{" "}
                          {collection.lastUpdated === "01/01/1970"
                            ? "N/A"
                            : DateTime.fromISO(collection.lastUpdated).toLocaleString()}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={2} p="lg" style={{ cursor: "default" }}>
                  <AttributePill
                    label="Rights holder"
                    labelColor="white"
                    value={collection.rightsHolder}
                    popoverDisabled
                    textColor="black"
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg" style={{ cursor: "default" }}>
                  <AttributePill
                    label="Access rights"
                    labelColor="white"
                    value={
                      collection.accessPill
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase()
                        .concat(collection.accessPill.slice(1).toLowerCase()) || "No data"
                    }
                    color={collection.accessPill ? accessPillColours[collection.accessPill] : "#d6e4ed"}
                    popoverDisabled
                    textColor="black"
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg" style={{ cursor: "default" }}>
                  <AttributePill
                    label="Data reuse status"
                    labelColor="white"
                    value={
                      collection.reusePill
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase()
                        .concat(collection.reusePill.slice(1).toLowerCase()) || "No data"
                    }
                    color={collection.reusePill ? reusePillColours[collection.reusePill] : "#d6e4ed"}
                    popoverDisabled
                    textColor="black"
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg" style={{ cursor: "default" }}>
                  {" "}
                  <AttributePill label="Number of records" labelColor="white" popoverDisabled textColor="black" />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Group justify="flex-end" className={classes.collectionArrowRowBtn}>
                    <IconArrowUpRight color="white" />
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Link>
        </UnstyledButton>
        <ScrollArea.Autosize mah={350} type="auto" offsetScrollbars>
          <Box p={10}>
            {collection.datasets.length === 0 && (
              <Center>
                <Text className={styles.emptyList}>no data</Text>
              </Center>
            )}
            {collection.datasets.map((dataset, idx) => (
              <DatasetRow dataset={dataset} key={idx} sourceLength={collection.datasets.length} count={idx + 1} />
            ))}
          </Box>
        </ScrollArea.Autosize>
      </Stack>
    </Paper>
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

function ContentTypeContainer({ contentType }: { contentType: GroupedSources }) {
  const theme = useMantineTheme();
  const [layoutView, setLayoutView] = useState<TableCardLayout>("card");
  const [sortBy, setSortBy] = useState<string | null>(null);

  const sortedSources = useMemo(() => {
    return [...contentType.sources].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "date": {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA; // Newest to Oldest
        }
        default:
          return 0;
      }
    });
  }, [contentType.sources, sortBy]);

  return (
    <Accordion.Item key={contentType.contentType} value={contentType.contentType}>
      <Accordion.Control>
        <Group justify="space-between" pr={30}>
          <Text fw="bold" fz="var(--mantine-h4-font-size)" c="black">
            {renameContentType[contentType.contentType as ContentType]}
          </Text>
          <Group mt={15} gap={50} align="center">
            <DatasetSort sortBy={sortBy} setSortBy={setSortBy} />
            <TableCardSwitch layout={layoutView} onChange={setLayoutView} />
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {layoutView === "card" && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {sortedSources.map((collection, idx) => (
              <CollectionCard collection={collection} key={idx} />
            ))}
          </SimpleGrid>
        )}
        {layoutView === "table" && (
          <SimpleGrid cols={1}>
            {sortedSources.map((collection, idx) => (
              <CollectionRow collection={collection} key={idx} />
            ))}
          </SimpleGrid>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function findSourceLastUpdated(datasets: Dataset[]): string {
  return datasets.reduce((latest, d) => {
    const updatedAt = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
    return updatedAt > new Date(latest).getTime() ? d.updatedAt : latest;
  }, "01/01/1970");
}

function groupByContentType(sources?: Source[]): GroupedSources[] {
  const desiredOrder: ContentType[] = [
    "GENOMIC_DATA",
    "ECOLOGICAL_TRAITS",
    "ETHNOBIOLOGY",
    "BIOCHEMICAL_TRAITS",
    "SPECIMENS",
    "TAXONOMIC_BACKBONE",
    "NONGENOMIC_DATA",
    "MIXED_DATATYPES",
    "FUNCTIONAL_TRAITS",
    "MORPHOLOGICAL_TRAITS",
  ];

  if (sources) {
    const grouped = sources.reduce((acc: Record<string, Source[]>, source) => {
      const contentType = source.contentType || "Unknown"; // Default to 'Unknown' if contentType is undefined

      // If this contentType doesn't exist in the accumulator, create a new array
      if (!acc[contentType]) {
        acc[contentType] = [];
      }

      // Push the current source into the corresponding contentType group
      acc[contentType].push(source);

      return acc;
    }, {});

    // Convert the object into an array of GroupedSources and sort by the desired order
    return Object.keys(grouped)
      .map((contentType) => ({
        contentType,
        sources: grouped[contentType],
      }))
      .sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.contentType as ContentType);
        const indexB = desiredOrder.indexOf(b.contentType as ContentType);
        return (indexA !== -1 ? indexA : desiredOrder.length) - (indexB !== -1 ? indexB : desiredOrder.length);
      });
  } else {
    return [];
  }
}

export default function DatasetsPage() {
  const { loading, data } = useQuery<QueryResults>(GET_DATASETS);
  const theme = useMantineTheme();

  const filteredSources = data?.sources.map((source) => ({
    ...source,
    datasets: source.datasets.filter((dataset) => dataset.name !== ""), // Remove datasets with an empty `name`
  }));

  const sourcesWithLastUpdated = filteredSources?.map((source) => {
    return {
      ...source,
      lastUpdated: findSourceLastUpdated(source.datasets),
    };
  });

  const groupedSources = groupByContentType(sourcesWithLastUpdated).filter((group) => group.contentType !== "Unknown");

  return (
    <Stack gap="xl" my="xl">
      <Paper py={5} pos="relative">
        <Container maw={MAX_WIDTH}>
          <Text fz={38} fw={700}>
            Data sources indexed in ARGA
          </Text>
        </Container>
      </Paper>

      <Paper py="lg">
        <Container maw={MAX_WIDTH} pb={16}>
          <LoadOverlay visible={loading} />
          <Accordion
            variant="separated"
            radius="lg"
            classNames={classes}
            chevron={<IconChevronDown color={theme.colors.midnight[10]} />}
          >
            {groupedSources.map((group) => (
              <ContentTypeContainer contentType={group} key={group.contentType} />
            ))}
          </Accordion>
        </Container>
        <DataPageCitation />
      </Paper>
    </Stack>
  );
}
