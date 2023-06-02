'use client';

import { Box, Grid, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { Photo, Taxonomy, Regions, QueryResults, StatsSpecies} from "@/app/type";
import Link from "next/link";
import dynamic from "next/dynamic";

const RegionMap = dynamic(() => import('../../components/region-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function SpeciesPhoto({ photo }: { photo: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Box>
      <Image width={300} height={300} radius="lg" src={small(photo.url)} alt="Species image" />
      <Text fz="sm" c="dimmed">&copy; { photo.rightsHolder }</Text>
      <Text fz="sm" c="dimmed"><Link href={ photo.referenceUrl } target="_blank">{ photo.publisher }</Link></Text>
    </Box>
  )
}

function DataSummary({ stats }: { stats: StatsSpecies }) {
  return (
    <Paper bg="midnight.6" radius="xl" py={20} px={40}>
      <Group position="apart">
        <Text color="white">Whole Genomes</Text>
        <Text color="white" fw={700} fz={30}>{stats.wholeGenomes}</Text>
      </Group>
      <Group position="apart">
        <Text color="white">Mitogenomes</Text>
        <Text color="white" fw={700} fz={30}>{stats.mitogenomes}</Text>
      </Group>
      <Group position="apart">
        <Text color="white">Barcodes</Text>
        <Text color="white" fw={700} fz={30}>{stats.barcodes}</Text>
      </Group>
      <Group position="apart">
        <Text color="white">Other Data</Text>
        <Text color="white" fw={700} fz={30}>{stats.total - stats.wholeGenomes - stats.mitogenomes - stats.barcodes}</Text>
      </Group>
    </Paper>
  )
}

function Attribution({ name, url }: { name: string, url: string }) {
  return (
    <Group position="right" mt={20}>
      <Text color="dimmed">Source:</Text>
      <Link href={url}>{name}</Link>
    </Group>
  )
}

function Taxonomy({ taxonomy, regions }: { taxonomy: Taxonomy, regions: Regions }) {
  const attribution = 'Australian Faunal Directory'
  const sourceUrl = `https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`
  const hasRegions = regions.ibra.length > 0 || regions.imcra.length > 0

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={3}>
          <Text style={{ paddingBottom: 25 }} color="white">Taxonomy Classification</Text>
          <Stack>
            <Text color="white" c="dimmed">{taxonomy.kingdom}</Text>
            <Text color="white" c="dimmed">{taxonomy.phylum}</Text>
            <Text color="white" c="dimmed">{taxonomy.class}</Text>
            <Text color="white" c="dimmed">{taxonomy.order}</Text>
            <Link href={`/family/${taxonomy.family}`}>{taxonomy.family}</Link>
            <Link href={`/genus/${taxonomy.genus}`}>{taxonomy.genus}</Link>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto">
          <RegionMap regions={regions.ibra.map(region => region.name)}/>
          <Text c="dimmed" fz="sm">
            {regions.ibra.map(region => region.name).join(", ")}
            {regions.imcra.map(region => region.name).join(", ")}
          </Text>

          { hasRegions ? <Attribution name={attribution} url={sourceUrl} /> : null }
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


interface SummaryProps {
  photos: Photo[],
  stats: StatsSpecies,
  taxonomy: Taxonomy,
  regions: Regions,
}

export function Summary(props: SummaryProps) {
  return (
    <>
      <Grid py={40}>
        <Grid.Col span="content">
          <Stack>
          { props.photos[0]
            ? <SpeciesPhoto photo={props.photos[0]}/>
            : <Image width={300} height={300} radius="lg" alt="Species image" withPlaceholder/>
          }

          { props.stats ? <DataSummary stats={props.stats} /> : null }
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          <Taxonomy taxonomy={props.taxonomy} regions={props.regions}/>
        </Grid.Col>
      </Grid>
    </>);
}
