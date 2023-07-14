'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Card, createStyles, LoadingOverlay, Paper, SegmentedControl, SimpleGrid, Text, Title, Image, Grid, Pagination, MantineProvider } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleCheck, CircleX } from "tabler-icons-react";


const GET_SPECIES = gql`
query SpeciesWithAssemblies {
  assemblies {
    species {
      taxonomy {
        scientificName
        canonicalName
        authorship
        kingdom
        phylum
        class
        order
        family
        genus
      }
      photo {
        url
      }
      dataSummary {
        barcodes
        other
        partialGenomes
        wholeGenomes
      }
    }
  }
}`;

type Pagination = {
  page: number,
  pageSize: number,
}

type FilterItem = {
  filter: string,
  action: string,
  value: string,
}


type Taxonomy = {
  scientificName: string,
  canonicalName: string,
  authorship: string,
  kingdom: string,
  phylum: string,
  class: string,
  order: string,
  family: string,
  genus: string,
};

type Photo = {
  url: string,
}

type DataSummary = {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: Taxonomy,
  photo: Photo,
  dataSummary: DataSummary,
}

type Assemblies = {
  species: Species[],
};

type QueryResults = {
  assemblies: Assemblies,
};


function DataItem({ name, count }: { name: string, count: number }) {
  const hasData = count > 0;
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
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400 }>{count} records</Text>
      </Grid.Col>
    </Grid>
  )
}


function SpeciesCard({ species }: { species: Species }) {
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
        <DataItem name="Whole genome" count={species.dataSummary.wholeGenomes} />
        <DataItem name="Organelles" count={species.dataSummary.organelles} />
        <DataItem name="Barcode" count={species.dataSummary.barcodes} />
        <DataItem name="Other" count={species.dataSummary.other} />
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


function BrowseResults({ list }: { list: Species[]}) {
  return (
    <SimpleGrid cols={4}>
      { list.map(item => (<SpeciesCard species={item} key={item.taxonomy.scientificName} />)) }
    </SimpleGrid>
  )
}

const VERTEBRATE_FILTERS = [
  { filter: 'KINGDOM', action: 'INCLUDE', value: 'Animalia' },
  { filter: 'PHYLUM', action: 'INCLUDE', value: 'Chordata' },
];

const INVERTEBRATE_FILTERS = [
  { filter: 'KINGDOM', action: 'INCLUDE', value: 'Animalia' },
  { filter: 'PHYLUM', action: 'EXCLUDE', value: 'Chordata' },
];

const PAGE_SIZE = 20;

export default function GenomesList({ params }: { params: { name: string } }) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES);

  return (
    <Box>
      <Box mt={40}>
        <LoadingOverlay
          overlayColor="black"
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
        />
        { !loading && data ? <BrowseResults list={data.assemblies.species} /> : null }
      </Box>
    </Box>
  );
}
