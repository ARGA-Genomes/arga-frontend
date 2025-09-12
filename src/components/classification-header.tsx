"use client";

import { Container, Divider, Grid, Group, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { MAX_WIDTH } from "../app/constants";

import { Dataset, Taxon } from "@/generated/types";
import { getTaxonIcon } from "@/helpers/getTaxonIcon";
import { isLatin, latinilizeNormalRank, normalizeLatinRank } from "@/helpers/rankHelpers";
import { AttributePillValue } from "./data-fields";
import { Hierarchy } from "./hierarchy";

interface ClassificationHeaderProps {
  rawRank: string;
  taxon?: Taxon;
  dataset?: Dataset;
}

export default function ClassificationHeader({ taxon, rawRank, dataset }: ClassificationHeaderProps) {
  const details = useMemo(() => {
    if (taxon) {
      const latin = isLatin(taxon);
      const normalRank = normalizeLatinRank(taxon.rank);
      const latinRank = latinilizeNormalRank(taxon.rank);
      const rank = (latin ? latinRank : normalRank).toUpperCase();

      return {
        rank,
        icon: getTaxonIcon(rank.toLowerCase(), taxon.canonicalName),
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
            {rawRank.toUpperCase() !== "DOMAIN" && <Hierarchy taxon={taxon} rawRank={rawRank} dataset={dataset} />}
          </Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
}
