"use client";

import { Container, Divider, Grid, Group, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { useMemo } from "react";
import { MAX_WIDTH } from "../app/constants";

import { Taxonomy } from "@/app/(taxonomy)/[rank]/[name]/page";
import { getTaxonIcon } from "@/helpers/getTaxonIcon";
import { IconArrowUpRight } from "@tabler/icons-react";
import { taxon as taxonOptions } from "../app/(home)/_data";
import { AttributePill, AttributePillValue } from "./data-fields";

interface ClassificationHeaderProps {
  rank: string;
  classification: string;
  taxon?: Taxonomy;
}

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

interface SourcePillProps {
  value: string;
}

function SourcePill({ value }: SourcePillProps) {
  return (
    <AttributePillValue
      color="transparent"
      value={value}
      textColor="shellfish"
      style={{
        border: "1px solid var(--mantine-color-shellfish-5)",
        minWidth: 90,
      }}
      popoverDisabled
    />
  );
}

export default function ClassificationHeader({ rank, classification, taxon }: ClassificationHeaderProps) {
  const hierarchy = taxon?.hierarchy.toSorted((a, b) => b.depth - a.depth);
  const taxonIcon = useMemo(
    () =>
      getTaxonIcon(classification) ||
      taxonOptions.find((item) => {
        const [itemRank, itemClassification] = item.link.substring(1).split("/");
        return itemRank.toUpperCase() === rank && itemClassification === classification;
      })?.image,
    [rank, classification]
  );

  return (
    <Paper py={30}>
      <Container maw={MAX_WIDTH}>
        <Grid>
          <Grid.Col span="auto">
            <Stack>
              <Stack gap={0}>
                <Text c="dimmed" fw={400}>
                  {rank}
                </Text>
                <Text fz={38} fw={700} fs={rank === "GENUS" ? "italic" : ""}>
                  {classification}
                </Text>
                <Group mt="xs">
                  <Group>
                    <Skeleton h={31} visible={!taxon} radius="xl">
                      <Group>
                        <AttributePillValue value={taxon?.status.toLocaleLowerCase() || "Accepted"} />
                      </Group>
                    </Skeleton>
                  </Group>
                  <Group>
                    <Skeleton h={31} style={{ display: "flex", alignItems: "center" }} visible={!taxon}>
                      <Text fw={400}>{taxon?.scientificName || classification}</Text>
                    </Skeleton>
                  </Group>
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
          {taxonIcon && (
            <Grid.Col span="content">
              <Image maw={180} alt={`${rank} ${classification} icon`} src={taxonIcon} />
            </Grid.Col>
          )}
          <Grid.Col span={12}>
            <Divider variant="dashed" my="sm" />
          </Grid.Col>
          <Grid.Col span={12}>
            {rank !== "DOMAIN" && (
              <Group justify="space-between" align="flex-end">
                <Group>
                  {hierarchy
                    ? hierarchy.map((node, idx) => (
                        <AttributePill
                          key={idx}
                          label={Humanize.capitalize(node.rank.toLowerCase())}
                          value={node.canonicalName}
                          href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
                          icon={IconArrowUpRight}
                          popoverDisabled
                          showIconOnHover
                        />
                      ))
                    : ALL_RANKS.slice(0, ALL_RANKS.indexOf(rank) + 2).map((skeletonRank) => (
                        <AttributePill
                          loading
                          key={skeletonRank}
                          label={Humanize.capitalize(skeletonRank)}
                          value="Placeholder"
                          icon={IconArrowUpRight}
                          showIconOnHover
                        />
                      ))}
                </Group>
                <Group>
                  <Text size="sm">Source</Text>
                  <Group>
                    <SourcePill value="Atlas of Living Australia" />
                  </Group>
                </Group>
              </Group>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
}
