"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { Photo, Taxonomy, Regions, StatsSpecies, Species } from "@/app/type";
import Link from "next/link";
import dynamic from "next/dynamic";

const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    stats {
      species(canonicalName: $canonicalName) {
        total
        wholeGenomes
        mitogenomes
        barcodes
      }
    }
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authorship
        kingdom
        phylum
        class
        order
        family
        genus
        vernacularGroup
      }
      photos {
        url
        referenceUrl
        publisher
        license
        rightsHolder
      }
      regions {
        ibra {
          name
        }
        imcra {
          name
        }
      }
    }
  }
`;

type StatsResults = {
  species: StatsSpecies;
};

type QueryResults = {
  stats: StatsResults;
  species: Species;
};

const RegionMap = dynamic(() => import("../../../components/region-map"), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
});

function SpeciesPhoto({ photo }: { photo: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Box>
      <Image
        width={300}
        height={300}
        radius="lg"
        src={small(photo.url)}
        alt="Species image"
      />
      <Text fz="sm" c="dimmed">
        &copy; {photo.rightsHolder}
      </Text>
      <Text fz="sm" c="dimmed">
        <Link href={photo.referenceUrl || "#"} target="_blank">
          {photo.publisher}
        </Link>
      </Text>
    </Box>
  );
}

function DataSummary({ stats }: { stats: StatsSpecies }) {
  return (
    <Paper bg="midnight.6" radius="lg" p="lg">
      <Group position="apart">
        <Text color="white">Whole Genomes</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.wholeGenomes}
        </Text>
      </Group>
      <Group position="apart">
        <Text color="white">Mitogenomes</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.mitogenomes}
        </Text>
      </Group>
      <Group position="apart">
        <Text color="white">Barcodes</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.barcodes}
        </Text>
      </Group>
      <Group position="apart">
        <Text color="white">Other Data</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.total -
            stats.wholeGenomes -
            stats.mitogenomes -
            stats.barcodes}
        </Text>
      </Group>
    </Paper>
  );
}

function Attribution({ name, url }: { name: string; url: string }) {
  return (
    <Group position="right" mt={20}>
      <Text color="dimmed">Source:</Text>
      <Link href={url}>{name}</Link>
    </Group>
  );
}

function Taxonomy({
  taxonomy,
  regions,
}: {
  taxonomy: Taxonomy;
  regions: Regions;
}) {
  const attribution = "Australian Faunal Directory";
  const sourceUrl = `https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`;
  const allRegions = [...regions.ibra, ...regions.imcra];

  return (
    <Paper bg="midnight.6" p="lg" radius="lg">
      <Grid>
        <Grid.Col span={3}>
          <Text size="xl" weight={600} color="white">
            Taxonomy
          </Text>
          <Stack>
            <Text color="white" c="dimmed">
              {taxonomy.kingdom}
            </Text>
            <Text color="white" c="dimmed">
              {taxonomy.phylum}
            </Text>
            <Text color="white" c="dimmed">
              {taxonomy.class}
            </Text>
            <Text color="white" c="dimmed">
              {taxonomy.order}
            </Text>
            <Link href={`/family/${taxonomy.family}`}>{taxonomy.family}</Link>
            <Link href={`/genus/${taxonomy.genus}`}>{taxonomy.genus}</Link>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto">
          <RegionMap regions={allRegions.map((region) => region.name)} />
          <Text c="dimmed" fz="sm">
            {allRegions.map((region) => region.name).join(", ")}
          </Text>

          {allRegions.length > 0 ? (
            <Attribution name={attribution} url={sourceUrl} />
          ) : null}
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export function Summary({ canonicalName }: { canonicalName: string }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: "xl", color: "moss.5" }}
        visible={loading}
      />

      <Grid py={40}>
        <Grid.Col span="content">
          <Stack>
            {data?.species.photos[0] ? (
              <SpeciesPhoto photo={data?.species.photos[0]} />
            ) : (
              <Image
                width={300}
                height={300}
                radius="lg"
                alt="Species image"
                withPlaceholder
              />
            )}

            {data?.stats ? <DataSummary stats={data.stats.species} /> : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          {data ? (
            <Taxonomy
              taxonomy={data.species.taxonomy}
              regions={data.species.regions}
            />
          ) : null}
        </Grid.Col>
      </Grid>
    </>
  );
}
