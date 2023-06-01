'use client';

import { Box, Grid, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { Photo, Taxonomy, Regions, QueryResults} from "@/app/type";
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

export function Summary({ data }: { data : QueryResults }) {

  const taxonomy = data.species.taxonomy;
  const photos = data.species.photos;
  const regions = data.species.regions;

  return (
    <>
      <Grid p={40}>
        <Grid.Col span="content">
          {photos[0]
            ? <SpeciesPhoto photo={photos[0]}/>
            : <Image width={300} height={300} radius="lg" alt="Species image" withPlaceholder/>}
        </Grid.Col>
        <Grid.Col span="auto">
          <Taxonomy taxonomy={taxonomy} regions={regions}/>
        </Grid.Col>
      </Grid>
    </>);
}
