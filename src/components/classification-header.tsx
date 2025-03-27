"use client";

import { useMemo } from "react";
import { Container, Divider, Grid, Group, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { MAX_WIDTH } from "../app/constants";
import * as Humanize from "humanize-plus";

import { Taxonomy } from "@/app/(taxonomy)/[rank]/[name]/page";
import { taxon as taxonOptions } from "../app/(home)/_data";
import { AttributePill, AttributePillValue } from "./data-fields";
import { IconArrowUpRight } from "@tabler/icons-react";

interface ClassificationHeaderProps {
  rank: string;
  classification: string;
  taxon?: Taxonomy;
}

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

export default function ClassificationHeader({ rank, classification, taxon }: ClassificationHeaderProps) {
  const hierarchy = taxon?.hierarchy.toSorted((a, b) => b.depth - a.depth);
  const taxonIcon = useMemo(
    () =>
      taxonOptions.find((item) => {
        const [itemRank, itemClassification] = item.link.substring(1).split("/");
        return itemRank.toUpperCase() === rank && itemClassification === classification;
      })?.image,
    [rank, classification]
  );

  return (
    <Paper py={30} pos="relative">
      <Container maw={MAX_WIDTH}>
        <Grid>
          <Grid.Col span="auto">
            <Stack h="100%" justify="center" style={{ flexGrow: 1 }}>
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
                      <Text fs="italic" fw={400}>
                        {taxon?.scientificName || classification}
                      </Text>
                    </Skeleton>
                  </Group>
                </Group>
              </Stack>
              {rank !== "DOMAIN" && (
                <>
                  <Divider mt="sm" mb={4} />
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
                      : ALL_RANKS.slice(0, ALL_RANKS.indexOf(rank) + 1).map((skeletonRank) => (
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
                </>
              )}
            </Stack>
          </Grid.Col>
          {taxonIcon && (
            <Grid.Col span="content">
              <Image mr="xl" maw={180} alt={`${rank} ${classification} icon`} src={taxonIcon} />
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Paper>
  );
}
