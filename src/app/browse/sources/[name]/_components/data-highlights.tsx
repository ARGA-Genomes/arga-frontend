"use client";

import { Flex, Paper, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";
import { Source } from "../page";

export default function DataHighlights({ source }: { source?: Source }) {
  const speciesGenomes = useMemo(
    () =>
      source?.speciesGenomesSummary
        .filter((i) => i.genomes > 0)
        .map((summary) => {
          const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
          return {
            name: summary.canonicalName || "",
            value: summary.genomes,
            href: `/species/${linkName}`,
          };
        })
        .sort((a, b) => b.value - a.value),
    [source?.speciesGenomesSummary]
  );

  const speciesLoci = useMemo(
    () =>
      source?.speciesLociSummary
        .filter((i) => i.loci > 0)
        .map((summary) => {
          const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
          return {
            name: summary.canonicalName || "",
            value: summary.loci,
            href: `/species/${linkName}`,
          };
        })
        .sort((a, b) => b.value - a.value),
    [source?.speciesLociSummary]
  );

  const speciesOther = useMemo(
    () =>
      source?.speciesGenomicDataSummary
        .filter((i) => i.totalGenomic > 0)
        .map((summary) => {
          const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
          return {
            name: summary.canonicalName || "",
            value: summary.totalGenomic,
            href: `/species/${linkName}`,
          };
        })
        .sort((a, b) => b.value - a.value),
    [source?.speciesGenomicDataSummary]
  );

  return (
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
        <Paper
          component={Link}
          href={speciesGenomes?.[0].href || "#"}
          miw={200}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              MOST GENOMES
            </Text>
            <Skeleton radius="lg" visible={!speciesGenomes}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesGenomes?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
        <ThemeIcon radius="xl" color="wheat" variant="white">
          <IconStarFilled size="1rem" />
        </ThemeIcon>
        <Paper
          component={Link}
          href={speciesGenomes?.[0].href || "#"}
          miw={200}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              MOST LOCI
            </Text>
            <Skeleton radius="lg" visible={!speciesLoci}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesLoci?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
        <ThemeIcon radius="xl" color="wheat" variant="white">
          <IconStarFilled size="1rem" />
        </ThemeIcon>
        <Paper
          component={Link}
          href={speciesOther?.[0].href || "#"}
          miw={200}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              MOST DATA
            </Text>
            <Skeleton radius="lg" visible={!speciesOther}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesOther?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
      </Flex>
    </Stack>
  );
}
