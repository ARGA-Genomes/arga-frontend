import Link from "next/link";
import { Card, Text, Group, Stack, SimpleGrid } from "@mantine/core";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { SpeciesImage } from "./species-image";


export interface Taxonomy {
  canonicalName: string,
  kingdom?: string,
};

export interface Photo {
  url: string,
}

export interface DataSummary {
  genomes: number,
  loci: number,
  specimens: number,
  other: number,
}

export interface Species {
  taxonomy: Taxonomy,
  photo: Photo,
  dataSummary: DataSummary,
}


function DataItem({ name, count }: { name: string; count: number }) {
  const hasData = count > 0;

  return (
    <Group>
      {hasData ? <CircleCheck color="green" /> : <CircleX color="red" />}
      <Text fw={300} fz="xs">{ name }</Text>
    </Group>
  )
}


export function SpeciesCard({ species }: { species: Species }) {
  const itemLinkName = species.taxonomy.canonicalName?.replaceAll(" ", "_");

  return (
    <Card shadow="sm" radius="lg" withBorder miw={313}>
      <Card.Section bg="#a6c0cf">
        <Link href={`/species/${itemLinkName}`}>
          <SpeciesImage
            photo={species.photo}
            taxonomy={species.taxonomy}
            h={260}
            w="auto"
          />
        </Link>
      </Card.Section>

      <Stack gap={5} mt="sm">
        <Link href={`/species/${itemLinkName}`}>
          <Text fz="sm" fw={700} fs="italic">{species.taxonomy.canonicalName}</Text>
        </Link>
        <SimpleGrid cols={2}>
          <DataItem name="Genome" count={species.dataSummary.genomes} />
          <DataItem name="Genetic loci" count={species.dataSummary.loci} />
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
