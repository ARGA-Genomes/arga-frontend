"use client";

import { Container, Divider, Grid, Group, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { useMemo } from "react";
import { MAX_WIDTH } from "../app/constants";

import { TaxonResult } from "@/app/(taxonomy)/[rank]/[name]/page";
import { getTaxonIcon } from "@/helpers/getTaxonIcon";
import { isLatin, latinilizeNormalRank, normalizeLatinRank } from "@/helpers/rankHelpers";
import { IconArrowUpRight } from "@tabler/icons-react";
import { AttributePill, AttributePillValue } from "./data-fields";

interface ClassificationHeaderProps {
  rawRank: string;
  taxon?: TaxonResult;
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

export default function ClassificationHeader({ taxon, rawRank }: ClassificationHeaderProps) {
  const details = useMemo(() => {
    if (taxon) {
      const latin = isLatin(taxon);
      const normalRank = normalizeLatinRank(taxon.rank);
      const latinRank = latinilizeNormalRank(taxon.rank);

      return {
        rank: (latin ? latinRank : normalRank).toUpperCase(),
        icon: getTaxonIcon(latinRank.toLowerCase(), taxon.canonicalName),
        hierarchy: taxon.hierarchy.toSorted((a, b) => b.depth - a.depth),
        latin,
        latinRank,
        normalRank,
      };
    }
  }, [taxon]);

  return (
    <Paper py={30}>
      <Container maw={MAX_WIDTH}>
        <Grid>
          <Grid.Col span="auto">
            <Stack>
              <Stack gap={0}>
                <Skeleton maw={75} visible={!details} mb={10}>
                  <Text c="dimmed" fw={400} h={20}>
                    {details?.rank || "RANK"}
                  </Text>
                </Skeleton>
                <Skeleton maw={300} visible={!taxon}>
                  <Text fz={38} fw={700}>
                    {taxon?.canonicalName || "Canonical name"}
                  </Text>
                </Skeleton>
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
                      <Text fw={400}>{taxon?.scientificName || taxon?.canonicalName || ""}</Text>
                    </Skeleton>
                  </Group>
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span="content">
            <Skeleton
              circle
              h={!details || details.icon ? 180 : 0}
              w={!details || details.icon ? 180 : 0}
              visible={!details}
            >
              {details?.icon && <Image maw={180} alt={`${taxon?.canonicalName || "Taxon"} icon`} src={details.icon} />}
            </Skeleton>
          </Grid.Col>
          <Grid.Col span={12}>
            <Divider variant="dashed" my="sm" />
          </Grid.Col>
          <Grid.Col span={12}>
            {rawRank.toUpperCase() !== "DOMAIN" && (
              <Group justify="space-between" align="flex-end">
                <Group>
                  {details
                    ? details.hierarchy.map((node, idx) => (
                        <AttributePill
                          key={idx}
                          label={
                            details.latin && node.rank !== "DOMAIN"
                              ? latinilizeNormalRank(node.rank)
                              : Humanize.capitalize(node.rank.toLowerCase())
                          }
                          value={node.canonicalName}
                          href={`/${(details.latin && node.rank !== "DOMAIN"
                            ? latinilizeNormalRank(node.rank)
                            : node.rank
                          ).toLowerCase()}/${node.canonicalName}`}
                          icon={IconArrowUpRight}
                          popoverDisabled
                          showIconOnHover
                        />
                      ))
                    : ALL_RANKS.slice(0, ALL_RANKS.indexOf(normalizeLatinRank(rawRank).toUpperCase()) + 2).map(
                        (skeletonRank) => (
                          <AttributePill
                            loading
                            key={skeletonRank}
                            label={Humanize.capitalize(skeletonRank)}
                            value="Placeholder"
                            icon={IconArrowUpRight}
                            showIconOnHover
                          />
                        )
                      )}
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
