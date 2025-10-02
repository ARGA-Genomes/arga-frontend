"use client";

import { SortChip } from "@/components/sorting/sort-chips";
import { getLicense } from "@/helpers/getLicense";
import {
  Center,
  Chip,
  Flex,
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
import { useMemo, useState } from "react";
import classes from "../../../components/record-list.module.css";

// Icons data
import { DatasetDetails, RankSummary, Source } from "@/generated/types";

import pageClasses from "../page.module.css";

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

export function ComponentDatasets({ datasets }: { datasets?: DatasetDetails[] }) {
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
    <UnstyledButton className={pageClasses.gotoSource} component={Link} href={dataset?.url || "#"} target="_blank">
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
