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
import { copyFileSync } from "fs";

const GET_DATASETS = gql`
  query DatasetsAndSources {
    sources {
      name
      author
      rightsHolder
      accessRights
      license

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

type Source = {
  name: string;
  author: string;
  rightsHolder: string;
  accessRights: string;
  license: string;
  datasets: Dataset[];
};

type ContentType = {
  name: string;
  sources?: Source[];
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
        <Grid.Col span={5} p="lg">
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

function SourceListContainer({ source }: { source: Source }) {
  const theme = useMantineTheme();
  const license = source.license
    ? LICENSES[source.license.toLowerCase()]
    : undefined;
  return (
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
      <Accordion.Item key={source.name} value={source.name}>
        <Accordion.Control>
          <Stack>
            <Group>
              <Link
                href={`/browse/sources/${source.name}`}
                className={classes.browseSpeciesBtn}
              >
                <span className={classes.browseSpeciesSpan}>
                  <Group gap={15} pt={4.5} pl={5}>
                    <IoEye size={25} className={classes.browseSpeciesIcon} />
                    <Text
                      fw={600}
                      fz={17}
                      className={classes.browseSpeciesText}
                    >
                      Browse {source.name} list
                    </Text>
                  </Group>
                </span>
              </Link>
            </Group>
            <Group grow align="flex-end" pr={10}>
              <AttributePill
                label="Data source name"
                // color="midnight.10"
                value={
                  // <Link href={`/browse/sources/${source.name}`}>
                  //   <Group gap={5}>
                  //     <IoEye size={25} color="white" />
                  //     <Text fw={600} c="white">
                  //       {source.name}
                  //     </Text>
                  //   </Group>
                  // </Link>
                  source.name
                }
              />
              <AttributePill
                label="Rights holder"
                value={source.rightsHolder}
              />
              <AttributePill
                label="Access rights"
                value={license?.accessRights || source.license}
                href={license?.url}
                color={
                  license?.accessRights === "Open"
                    ? "moss.3"
                    : license?.accessRights === "Conditional"
                    ? "wheat.3"
                    : undefined
                }
              />
              <AttributePill label="Number of records" value="No data" />
              <AttributePill label="Last updated" value="No data" />
              {/* <Box> */}
              {/* <Center> */}
              {/* <Link href={`/browse/sources/${source.name}`} target="_blank">
                <Button
                  px={20}
                  size="xl"
                  radius="xl"
                  color="midnight.10"
                  // fullWidth
                  justify="center"
                  leftSection={<IoEye size={55} color="white" />}
                >
                  <Stack gap={0}>
                    <Text fw={600} size="md" truncate c="white">
                      browse
                    </Text>
                    <Text fw={600} size="md" truncate c="white" mt={-7}>
                      species
                    </Text>
                  </Stack> */}
              {/* <Group wrap="nowrap">
                  <IoEye size={50} color="white" />
                  <Stack gap={0}>
                    <Text fw={600} size="md" truncate c="white">
                      browse
                    </Text>
                    <Text fw={600} size="md" truncate c="white">
                      species
                    </Text>
                  </Stack>
                </Group> */}
              {/* </Button> */}
              {/* </Link> */}
              {/* </Center> */}
              {/* </Box> */}
            </Group>
          </Stack>
        </Accordion.Control>
        <Accordion.Panel>
          <ScrollArea h={450} type="auto" offsetScrollbars>
            <Box pr={10}>
              {source.datasets.map((dataset, idx) => (
                <ComponentDatasetRow
                  dataset={dataset}
                  key={idx}
                  sourceLength={source.datasets.length}
                  count={idx + 1}
                />
              ))}
            </Box>
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
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
              value={license?.accessRights || collection.license}
              href={license?.url}
              group={true}
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
                <Grid.Col span={5} p="lg">
                  <Text
                    fw={600}
                    size="md"
                    c="white"
                    p={10}
                    style={{ whiteSpace: "nowrap" }}
                  >
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
                    value={license?.accessRights || collection.license}
                    href={license?.url}
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

function SourceContainer({ source }: { source: Source }) {
  const theme = useMantineTheme();
  var isList = false;
  if (
    source.name === "ARGA Bushfire Recovery" ||
    source.name === "ARGA Commercial Species" ||
    source.name === "ARGA Threatened Species" ||
    source.name === "ARGA Venomous and Poisonous Species"
  ) {
    isList = true;
  }
  return (
    <Accordion.Item key={source.name} value={source.name}>
      <Accordion.Control>
        <Text
          fw={600}
          fz="var(--mantine-h4-font-size)"
          c={theme.colors.midnight[10]}
        >
          {source.name}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        {isList ? (
          <SourceListContainer source={source} />
        ) : (
          source.datasets.map((dataset, idx) => (
            <DatasetRow
              dataset={dataset}
              key={idx}
              sourceLength={source.datasets.length}
              count={idx + 1}
            />
          ))
        )}
        {/* {source.datasets.map((dataset, idx) => (
          <DatasetRow
            dataset={dataset}
            key={idx}
            sourceLength={source.datasets.length}
            count={idx + 1}
          />
        ))} */}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function ContentTypeContainer({ contentType }: { contentType: ContentType }) {
  const theme = useMantineTheme();
  const [layoutView, setLayoutView] = useState("card");

  return (
    <Accordion.Item key={contentType.name} value={contentType.name}>
      <Accordion.Control>
        <Group justify="space-between" pr={30}>
          <Text
            fw={600}
            fz="var(--mantine-h4-font-size)"
            c={theme.colors.midnight[10]}
          >
            {contentType.name} data sources
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

export default function DatasetsPage() {
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);
  const theme = useMantineTheme();

  const sourceContent: { [key: string]: string } = {
    "ARGA Backbone Taxonomy": "Taxonomic",
    "ARGA Bushfire Recovery": "Traits and ecological",
    "ARGA Commercial Species": "Traits and ecological",
    "ARGA Genomes": "Genomics",
    "ARGA IEK": "Traits and ecological",
    "ARGA Threatened Species": "Traits and ecological",
    "ARGA Venomous and Poisonous Species": "Traits and ecological",
    OZCAM: "Biological specimens",
  };

  let contentData: ContentType[] = [
    { name: "Genomics" },
    { name: "Biological specimens" },
    { name: "Taxonomic" },
    { name: "Traits and ecological" },
  ];

  contentData = contentData.map((contentItem) => {
    // Filter sources based on the content type name
    let correspondingSources =
      data?.sources.filter((source) => {
        const contentType = sourceContent[source.name];
        return contentType && contentType.includes(contentItem.name);
      }) ?? []; // Default to an empty array if data?.sources is undefined
    return {
      ...contentItem,
      sources:
        correspondingSources.length > 0 ? correspondingSources : undefined,
    };
  });

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
            {/* {data?.sources.map((source) => (
              <SourceContainer source={source} key={source.name} />
            ))} */}
            {contentData?.map((contentType) => (
              <ContentTypeContainer
                contentType={contentType}
                key={contentType.name}
              />
            ))}
          </Accordion>
        </Container>
      </Paper>
    </Stack>
  );
}
