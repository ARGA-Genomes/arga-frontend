import Link from "next/link";
import { Box, Card, Text, Title, Image, Grid, Group, Stack, SimpleGrid } from "@mantine/core";
import { CircleCheck, CircleX } from "tabler-icons-react";


export interface Taxonomy {
  canonicalName: string,
};

export interface Photo {
  url: string,
}

export interface DataSummary {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
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

  function small(photo: { url: string }) {
    return photo.url.replaceAll("original", "small");
  }

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Card.Section>
        <Link href={`/species/${itemLinkName}/taxonomy`}>
          {species.photo ? (
            <Image
              src={small(species.photo)}
              height={260}
              alt={species.taxonomy.canonicalName}
            />
          ) : (
            <Image
              height={260}
              alt={species.taxonomy.canonicalName}
            />
          )}
        </Link>
      </Card.Section>

      <Stack gap={5}>
        <Link href={`/species/${itemLinkName}/taxonomy`}>
          <Text fz="sm" fw={700} fs="italic">{species.taxonomy.canonicalName}</Text>
        </Link>
        <SimpleGrid cols={2}>
          <DataItem name="Genome" count={species.dataSummary.wholeGenomes} />
          <DataItem name="Genetic marker" count={species.dataSummary.barcodes} />
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
