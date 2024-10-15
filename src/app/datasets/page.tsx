"use client";

import { LoadOverlay } from "@/components/load-overlay";
import { gql, useQuery } from "@apollo/client";
import {
  Grid,
  Title,
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
  Overlay,
} from "@mantine/core";
import Link from "next/link";
import { DateTime } from "luxon";
import { AttributePill } from "@/components/data-fields";
import {
  IconExternalLink,
  IconCaretDownFilled,
  IconEye,
  IconArrowUpRight,
  IconClockHour4,
  IconTable,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { MAX_WIDTH } from "../constants";
import classes from "./page.module.css";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import { access, copyFileSync } from "fs";

const GET_DATASETS = gql`
  query DatasetsAndSources {
    sources {
      name
      author
      rightsHolder
      accessRights
      license
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
  reusePill?: ReusePillType;
  accessPill?: AccessPillType;
  publicationYear?: number;
};

type Source = {
  name: string;
  author: string;
  rightsHolder: string;
  accessRights: string;
  license: string;
  reusePill?: ReusePillType;
  accessPill?: AccessPillType;
  contentType?: string;
  datasets: Dataset[];
};

type ContentType = {
  name: string;
  sources?: Source[];
};

type GroupedSources = {
  contentType: string;
  sources: Source[];
};

type QueryResults = {
  sources: Source[];
};

interface License {
  name: string;
  url: string;
  accessRights: string;
}

const LICENSES: Record<string, License> = {
  "cc-by-nc-nd": {
    name: "(CC-BY-NC)",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0",
    accessRights: "Conditional",
  },
  "cc-by-nc-sa": {
    name: "(CC-BY-NC-SA)",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0",
    accessRights: "Conditional",
  },
  "cc-by-nc": {
    name: "(CC-BY-NC)",
    url: "http://creativecommons.org/licenses/by-nc/4.0",
    accessRights: "Conditional",
  },
  "cc-by-nd": {
    name: "(CC-BY-ND)",
    url: "http://creativecommons.org/licenses/by-nd/4.0",
    accessRights: "Conditional",
  },
  "cc-by-sa": {
    name: "(CC-BY-SA)",
    url: "http://creativecommons.org/licenses/by-sa/4.0",
    accessRights: "Conditional",
  },
  "cc-by": {
    name: "(CC-BY)",
    url: "http://creativecommons.org/licenses/by/4.0",
    accessRights: "Conditional",
  },
  cc0: {
    name: "(CC0)",
    url: "http://creativecommons.org/publicdomain/zero/1.0",
    accessRights: "Open",
  },

  "http://creativecommons.org/licenses/by-nc-sa/4.0/": {
    name: "CC-BY-NC-SA",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-nc/4.0/": {
    name: "CC-BY-NC",
    url: "http://creativecommons.org/licenses/by-nc/4.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by/4.0/": {
    name: "CC-BY",
    url: "http://creativecommons.org/licenses/by/4.0/",
    accessRights: "Conditional",
  },
  "https://creativecommons.org/licenses/by/4.0/": {
    name: "CC-BY",
    url: "http://creativecommons.org/licenses/by/4.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-sa/4.0/": {
    name: "CC-BY-SA",
    url: "http://creativecommons.org/licenses/by-sa/4.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": {
    name: "CC-BY-NC-ND",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0/",
    accessRights: "Conditional",
  },

  "http://creativecommons.org/licenses/by-nc-sa/3.0/": {
    name: "CC-BY-NC-SA",
    url: "http://creativecommons.org/licenses/by-nc-sa/3.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-nc/3.0/": {
    name: "CC-BY-NC",
    url: "http://creativecommons.org/licenses/by-nc/3.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by/3.0/": {
    name: "CC-BY",
    url: "http://creativecommons.org/licenses/by/3.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-sa/3.0/": {
    name: "CC-BY-SA",
    url: "http://creativecommons.org/licenses/by-sa/3.0/",
    accessRights: "Conditional",
  },
  "http://creativecommons.org/licenses/by-nc-nd/3.0/": {
    name: "CC-BY-NC-ND",
    url: "http://creativecommons.org/licenses/by-nc-nd/3.0/",
    accessRights: "Conditional",
  },

  "public domain mark": {
    name: "Public Domain",
    url: "http://creativecommons.org/publicdomain/mark/1.0",
    accessRights: "Open",
  },
  "attribution-noncommercial 4.0 international": {
    name: "(CC-BY-NC)",
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
    accessRights: "Conditional",
  },
  "attribution 4.0 international": {
    name: "(CC-BY)",
    url: "https://creativecommons.org/licenses/by/4.0/",
    accessRights: "Conditional",
  },
};

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
  VARIABLE: "#d6e4ed",
};

const licenseAccessRights = {};

function DatasetRow({
  dataset,
  sourceLength,
  count,
}: {
  dataset: Dataset;
  sourceLength: number;
  count: number;
}) {
  const theme = useMantineTheme();
  const license = dataset.license
    ? LICENSES[dataset.license.toLowerCase()]
    : undefined;

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
          <AttributePill
            label="Access rights"
            value={dataset.accessPill?.toLocaleLowerCase() || "No data"}
            href={dataset.license !== "NONE" ? dataset.license : ""}
            color={
              dataset.accessPill
                ? accessPillColours[dataset.accessPill]
                : "#d6e4ed"
            }
          />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Data reuse status"
            value={dataset.reusePill?.toLocaleLowerCase() || "No data"}
            color={
              dataset.reusePill
                ? reusePillColours[dataset.reusePill]
                : "#d6e4ed"
            }
          />
        </Grid.Col>
        <Grid.Col span={1} p="lg">
          <AttributePill label="Records" value="No data" />
        </Grid.Col>
        <Grid.Col span={1} p="lg">
          <AttributePill
            label="Year"
            value={dataset.publicationYear || "No data"}
          />
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

function ComponentDatasetRow({
  dataset,
  sourceLength,
  count,
}: {
  dataset: Dataset;
  sourceLength: number;
  count: number;
}) {
  const license = dataset.license
    ? LICENSES[dataset.license.toLowerCase()]
    : undefined;

  return (
    <Paper radius="lg" withBorder mb={count === sourceLength ? 0 : 20}>
      <Grid>
        <Grid.Col span={5} p="lg">
          <Stack gap={5}>
            <Text fw={300} size="sm">
              Component source citation
            </Text>
            <Text fw={300} size="xs" pl={10}>
              {dataset.citation}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Rights holder" value={dataset.rightsHolder} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Access rights"
            value={license?.accessRights || dataset.license}
            href={license?.url}
            color={
              license?.accessRights === "Open"
                ? "moss.3"
                : license?.accessRights === "Conditional"
                ? "wheat.3"
                : undefined
            }
          />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Last updated"
            value={DateTime.fromISO(dataset.updatedAt).toLocaleString()}
          />
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
  const theme = useMantineTheme();
  const license = collection.license
    ? LICENSES[collection.license.toLowerCase()]
    : undefined;
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
                <Text fw={600} size="md" c="white" p={10}>
                  {collection.name}
                </Text>

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
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill
              label="Access rights"
              value={collection.accessPill?.toLocaleLowerCase() || "No data"}
              href={collection.license !== "none" ? collection.license : ""}
              group={true}
              color={
                collection.accessPill
                  ? accessPillColours[collection.accessPill]
                  : "#d6e4ed"
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill
              label="Data reuse status"
              value={collection.reusePill?.toLocaleLowerCase() || "No data"}
              group={true}
              color={
                collection.reusePill
                  ? reusePillColours[collection.reusePill]
                  : "#d6e4ed"
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <AttributePill label="Number of records" group={true} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

function CollectionRow({ collection }: { collection: Source }) {
  const license = collection.license
    ? LICENSES[collection.license.toLowerCase()]
    : undefined;
  return (
    <Paper radius="lg" withBorder>
      <Stack>
        <UnstyledButton>
          <Link href={`/browse/sources/${collection.name}`}>
            <Paper radius="lg" w="100%" className={classes.collectionHeader}>
              <Grid>
                <Grid.Col span={3} p="lg">
                  <Text fw={600} size="md" c="white" p={10}>
                    {collection.name}
                  </Text>
                </Grid.Col>
                <Grid.Col span={2} p="lg">
                  <AttributePill
                    label="Rights holder"
                    labelColor="white"
                    value={collection.rightsHolder}
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg">
                  <AttributePill
                    label="Access rights"
                    labelColor="white"
                    value={
                      collection.accessPill?.toLocaleLowerCase() || "No data"
                    }
                    href={
                      collection.license !== "none" ? collection.license : ""
                    }
                    color={
                      collection.accessPill
                        ? accessPillColours[collection.accessPill]
                        : "#d6e4ed"
                    }
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg">
                  <AttributePill
                    label="Data reuse status"
                    labelColor="white"
                    value={
                      collection.reusePill?.toLocaleLowerCase() || "No data"
                    }
                    color={
                      collection.reusePill
                        ? reusePillColours[collection.reusePill]
                        : "#d6e4ed"
                    }
                  />
                </Grid.Col>
                <Grid.Col span={2} p="lg">
                  {" "}
                  <AttributePill label="Number of records" labelColor="white" />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Group
                    justify="flex-end"
                    className={classes.collectionArrowRowBtn}
                  >
                    <IconArrowUpRight color="white" />
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Link>
        </UnstyledButton>
        <ScrollArea.Autosize mah={350} type="auto" offsetScrollbars>
          <Box p={10}>
            {collection.datasets.map((dataset, idx) => (
              <DatasetRow
                dataset={dataset}
                key={idx}
                sourceLength={collection.datasets.length}
                count={idx + 1}
              />
            ))}
          </Box>
        </ScrollArea.Autosize>
      </Stack>
    </Paper>
  );
}

function ContentTypeContainer({
  contentType,
}: {
  contentType: GroupedSources;
}) {
  const theme = useMantineTheme();
  const [layoutView, setLayoutView] = useState("card");

  return (
    <Accordion.Item
      key={contentType.contentType}
      value={contentType.contentType}
    >
      <Accordion.Control>
        <Group justify="space-between" pr={30}>
          <Text
            fw={600}
            fz="var(--mantine-h4-font-size)"
            c={theme.colors.midnight[10]}
          >
            {contentType.contentType
              .toLocaleLowerCase()
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            data sources
          </Text>
          <Group gap={10} mt={15}>
            <UnstyledButton
              onClick={(e) => {
                e.stopPropagation();
                setLayoutView("table");
              }}
            >
              <Stack gap={1} align="center">
                <IconTable
                  color={
                    layoutView === "table" ? "white" : theme.colors.midnight[10]
                  }
                  className={classes.tableLayoutViewBtn}
                  fill={
                    layoutView === "table" ? theme.colors.midnight[10] : "none"
                  }
                />
                <Text size="xs" c={theme.colors.midnight[10]}>
                  Table
                </Text>
              </Stack>
            </UnstyledButton>
            <UnstyledButton
              onClick={(e) => {
                e.stopPropagation();
                setLayoutView("card");
              }}
            >
              <Stack gap={1} align="center">
                <IconLayoutGrid
                  color={theme.colors.midnight[10]}
                  className={classes.cardLayoutViewBtn}
                  fill={
                    layoutView === "card" ? theme.colors.midnight[10] : "none"
                  }
                />
                <Text size="xs" c={theme.colors.midnight[10]}>
                  Card
                </Text>
              </Stack>
            </UnstyledButton>
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {layoutView === "card" && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {contentType.sources?.map((collection, idx) => (
              <CollectionCard collection={collection} key={idx} />
            ))}
          </SimpleGrid>
        )}
        {layoutView === "table" && (
          <SimpleGrid cols={1}>
            {contentType.sources?.map((collection, idx) => (
              <CollectionRow collection={collection} key={idx} />
            ))}
          </SimpleGrid>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function groupByContentType(sources?: Source[]): GroupedSources[] {
  if (sources) {
    const grouped = sources.reduce(
      (acc: { [key: string]: Source[] }, source) => {
        let contentType = source.contentType || "Unknown"; // Default to 'Unknown' if contentType is undefined
        if (contentType === "NONGENOMIC_DATA") {
          contentType = "Non-genomic";
        }

        // If this contentType doesn't exist in the accumulator, create a new array
        if (!acc[contentType]) {
          acc[contentType] = [];
        }

        // Push the current source into the corresponding contentType group
        acc[contentType].push(source);

        return acc;
      },
      {}
    );

    // Convert the object into an array of GroupedSources
    return Object.keys(grouped).map((contentType) => ({
      contentType,
      sources: grouped[contentType],
    }));
  } else {
    return [];
  }
}

export default function DatasetsPage() {
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);
  const theme = useMantineTheme();

  const groupedSources = groupByContentType(data?.sources).filter(
    (group) => group.contentType !== "Unknown"
  );

  return (
    <Stack gap="xl" my="xl">
      <Paper py={20} pos="relative">
        <Container maw={MAX_WIDTH}>
          <Text fz={38} fw={700}>
            Data sources indexed in ARGA
          </Text>
        </Container>
      </Paper>

      <Paper py="lg">
        <Container maw={MAX_WIDTH}>
          <LoadOverlay visible={loading} />
          <Accordion
            variant="separated"
            radius="lg"
            classNames={classes}
            chevron={
              <IconCaretDownFilled
                fill={theme.colors.midnight[10]}
                color={theme.colors.midnight[10]}
              />
            }
          >
            {groupedSources?.map((group) => (
              <ContentTypeContainer
                contentType={group}
                key={group.contentType}
              />
            ))}
          </Accordion>
        </Container>
      </Paper>
    </Stack>
  );
}
