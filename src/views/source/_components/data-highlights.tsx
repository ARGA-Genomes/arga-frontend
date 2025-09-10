"use client";

import { Source } from "@/generated/types";
import { Flex, Paper, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";
import classes from "./data-highlights.module.css";

const HIGHLIGHT_WIDTH = 280;

export default function DataHighlights({ source, loading }: { source?: Source; loading: boolean }) {
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

  const latestGenomeReleases = useMemo(
    () =>
      source?.latestGenomeReleases.map((summary) => {
        const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
        return {
          name: summary.canonicalName || "",
          value: summary.releaseDate,
          href: `/species/${linkName}`,
        };
      }),
    [source?.latestGenomeReleases]
  );

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      align="center"
      mb={34}
      bg="wheat.0"
      style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      gap={48}
    >
      <Flex
        px="xl"
        py="md"
        direction={{ base: "column", lg: "row" }}
        align="center"
        justify="center"
        gap="lg"
        style={{ overflowX: "auto" }}
      >
        <Text fw="bold" c="wheat.7" pr="xl">
          Dataset highlights
        </Text>
        <Paper
          className={latestGenomeReleases?.[0] ? classes.stat : undefined}
          component={latestGenomeReleases?.[0] ? Link : undefined}
          href={latestGenomeReleases?.[0]?.href || "#"}
          w={HIGHLIGHT_WIDTH}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              Latest genome release
            </Text>
            <Skeleton radius="lg" visible={loading}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {latestGenomeReleases?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
        <ThemeIcon size="xl" radius="xl" color="wheat" variant="white">
          <IconStarFilled size="1.5rem" />
        </ThemeIcon>
        <Paper
          className={speciesGenomes?.[0] ? classes.stat : undefined}
          component={speciesGenomes?.[0] ? Link : undefined}
          href={speciesGenomes?.[0]?.href || "#"}
          w={HIGHLIGHT_WIDTH}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              Most genomes
            </Text>
            <Skeleton radius="lg" visible={loading}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesGenomes?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
        <ThemeIcon size="xl" radius="xl" color="wheat" variant="white">
          <IconStarFilled size="1.5rem" />
        </ThemeIcon>
        <Paper
          className={speciesLoci?.[0] ? classes.stat : undefined}
          component={speciesLoci?.[0] ? Link : undefined}
          href={speciesLoci?.[0]?.href || "#"}
          w={HIGHLIGHT_WIDTH}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              Most loci
            </Text>
            <Skeleton radius="lg" visible={loading}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesLoci?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
        <ThemeIcon size="xl" radius="xl" color="wheat" variant="white">
          <IconStarFilled size="1.5rem" />
        </ThemeIcon>
        <Paper
          className={speciesOther?.[0] ? classes.stat : undefined}
          component={speciesOther?.[0] ? Link : undefined}
          href={speciesOther?.[0]?.href || "#"}
          w={HIGHLIGHT_WIDTH}
          radius="lg"
          p="xs"
          shadow="sm"
          withBorder
        >
          <Stack gap={4}>
            <Text c="dimmed" size="xs" fw="bold">
              Most data
            </Text>
            <Skeleton radius="lg" visible={loading}>
              <Text fw="bold" fs="italic" c="shellfish.9">
                {speciesOther?.[0]?.name || "Unknown"}
              </Text>
            </Skeleton>
          </Stack>
        </Paper>
      </Flex>
    </Flex>
  );
}
