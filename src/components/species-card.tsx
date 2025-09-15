import { SpeciesCard as SpeciesCardType } from "@/generated/types";
import { Box, Card, Group, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import Link from "next/link";
import { SpeciesPhoto } from "./species-image";

export interface Taxonomy {
  canonicalName: string;
}

export interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

export function DataItem({ name, count, textWidth }: { name?: string; count?: number; textWidth?: number }) {
  const hasData = count || 0 > 0;
  const label = [...[count === undefined ? [] : [count.toString()]], ...[!name ? [] : [name]]].join(" ");

  return (
    <Group gap="sm">
      {hasData ? <IconCircleCheck color="green" /> : <IconCircleX color="red" />}
      <Text fw={300} w={textWidth} fz="xs">
        {label}
      </Text>
    </Group>
  );
}

export function SpeciesCard({ species }: { species?: SpeciesCardType }) {
  const itemLinkName = species?.taxonomy.canonicalName.replaceAll(" ", "_") || "";
  const height = 260;

  return (
    <Card shadow="sm" radius="lg" withBorder miw={313}>
      <Card.Section bg="#a6c0cf" h={height} mah={height}>
        <Link href={`/species/${itemLinkName}`}>
          <Box h={height} mah={height}>
            <SpeciesPhoto photo={species?.photo} flatBottom />
          </Box>
        </Link>
      </Card.Section>

      <Stack gap={5} mt="sm">
        <Skeleton visible={!species}>
          <Link href={`/species/${itemLinkName}`}>
            <Text fz="sm" fw={700} fs="italic">
              {species?.taxonomy.canonicalName || "Name"}
            </Text>
          </Link>
        </Skeleton>
        <SimpleGrid cols={2}>
          <Skeleton visible={!species}>
            <DataItem name="Genomes" count={species?.dataSummary.genomes || 0} />
          </Skeleton>
          <Skeleton visible={!species}>
            <DataItem name="Genetic loci" count={species?.dataSummary.loci || 0} />
          </Skeleton>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
