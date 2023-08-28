import Link from "next/link";
import { Box, Card, Text, Title, Image, Grid } from "@mantine/core";
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


function DataItem({ name, count }: { name: string, count: number | undefined }) {
  const hasData = count && count > 0;
  const dimmed = 'rgba(134, 142, 150, .5)';
  const extraDimmed = 'rgba(134, 142, 150, .3)';

  return (
    <Grid>
      <Grid.Col span="content" pb={0} pr={0} mr={0}>
        { hasData ? <CircleCheck color="green" /> : <CircleX color={extraDimmed} /> }
      </Grid.Col>
      <Grid.Col span="auto">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400 }>{name}</Text>
      </Grid.Col>
      <Grid.Col span="content">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400 }>{count || 0} records</Text>
      </Grid.Col>
    </Grid>
  )
}


export function SpeciesCard({ species }: { species: Species }) {
  const itemLinkName = species.taxonomy.canonicalName?.replaceAll(" ", "_");

  function small(photo: Photo) {
    return photo.url.replaceAll("original", "small");
  }

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}/summary`}>
        <Title order={4}>{ species.taxonomy.canonicalName }</Title>
      </Link>

      <Box py={20}>
        <DataItem name="Whole genome" count={species.dataSummary?.wholeGenomes} />
        <DataItem name="Organelles" count={species.dataSummary?.organelles} />
        <DataItem name="Barcode" count={species.dataSummary?.barcodes} />
        <DataItem name="Other" count={species.dataSummary?.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}/summary`}>
          { species.photo
            ? <Image src={small(species.photo)} height={160} alt={species.taxonomy.canonicalName} />
            : <Image withPlaceholder height={160} alt={species.taxonomy.canonicalName} />
          }
        </Link>
      </Card.Section>
    </Card>
  )
}
