"use client";

import { useMemo } from "react";
import { Container, Grid, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { MAX_WIDTH } from "../app/constants";

import { taxon as taxonOptions } from "../app/(home)/_data";

export default function ClassificationHeader({ rank, classification }: { rank: string; classification: string }) {
  const taxon = useMemo(
    () =>
      taxonOptions.find((item) => {
        const [itemRank, itemClassification] = item.link.substring(1).split("/");
        return itemRank.toUpperCase() === rank && itemClassification === classification;
      }),
    [rank, classification]
  );

  return (
    <Paper py={20} pos="relative">
      <Container maw={MAX_WIDTH}>
        <Grid>
          <Grid.Col span="auto">
            <Stack h="100%" justify="center">
              <Group gap={40}>
                <Text c="dimmed" fw={400}>
                  {rank}
                </Text>
                <Text fz={38} fw={700} fs={rank === "GENUS" ? "italic" : ""}>
                  {classification}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
          {taxon && (
            <Grid.Col span="content">
              <Image mr="xl" maw={180} alt={`${rank} ${classification} icon`} src={taxon.image} />
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Paper>
  );
}
