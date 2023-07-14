"use client";

import { gql, useQuery } from "@apollo/client";
import {
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
        organelles
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

function SpeciesPhoto({ photo }: { photo?: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Paper bg="midnight.6" radius="lg">
      <Image
        width={375}
        height={250}
        radius="lg"
        src={photo ? small(photo.url) : ""}
        alt="Species image"
        styles={{
          image: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        withPlaceholder
      />
      {photo && (
        <Group px="md" py="xs" position="apart">
          <Text fz="sm" c="dimmed">
            &copy; {photo?.rightsHolder}
          </Text>
          <Text fz="sm" c="dimmed">
            <Link href={photo?.referenceUrl || "#"} target="_blank">
              {photo?.publisher}
            </Link>
          </Text>
        </Group>
      )}
    </Paper>
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
        <Text color="white">Organelles</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.organelles}
        </Text>
      </Group>
      <Group position="apart">
        <Text color="white">Genetic Loci*</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.barcodes}
        </Text>
      </Group>
      <Group position="apart">
        <Text color="white">Other Data</Text>
        <Text color="white" fw={700} fz={30}>
          {stats.total -
            stats.wholeGenomes -
            stats.organelles -
            stats.barcodes}
        </Text>
      </Group>
    </Paper>
  );
}

function Attribution({ name, url }: { name: string; url: string }) {
  return (
    <Text color="dimmed" size="sm" weight="bold">
      Source:{" "}
      <Link style={{ fontSize: 14 }} href={url} target="_blank">
        {name}
      </Link>
    </Text>
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
    <Paper bg="midnight.6" radius="lg">
      <Grid gutter={0}>
        <Grid.Col span="content" py="xl" px={30} miw={200}>
          <Text size="xl" weight={600} color="white" mb="sm">
            Taxonomy
          </Text>
          <Stack spacing={8}>
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
          <RegionMap
            regions={allRegions.map((region) => region.name)}
            sx={(theme) => ({
              overflow: "hidden",
              borderTopRightRadius: theme.radius.lg,
              borderBottomRightRadius:
                allRegions.length > 0 ? 0 : theme.radius.lg,
            })}
          />
        </Grid.Col>
        {allRegions.length > 0 && (
          <Grid.Col span={12}>
            <Paper
              bg="midnight.8"
              py="md"
              px={30}
              sx={(theme) => ({
                overflow: "hidden",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: theme.radius.lg,
                borderBottomRightRadius: theme.radius.lg,
              })}
            >
              <Text c="dimmed" size="sm" mb="xs">
                {allRegions.map((region) => region.name).join(", ")}
              </Text>
              <Attribution name={attribution} url={sourceUrl} />
            </Paper>
          </Grid.Col>
        )}
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

      <Grid pb={40} pt="xl">
        <Grid.Col span="content">
          <Stack>
            <SpeciesPhoto photo={data?.species.photos[0]} />
            {data?.stats ? <DataSummary stats={data.stats.species} /> : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          {data && (
            <Taxonomy
              taxonomy={data.species.taxonomy}
              regions={data.species.regions}
            />
          )}
        </Grid.Col>
      </Grid>
    </>
  );
}
