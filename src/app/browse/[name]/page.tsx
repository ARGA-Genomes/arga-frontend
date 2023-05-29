'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Card, createStyles, LoadingOverlay, Paper, SegmentedControl, SimpleGrid, Text, Title, Image, Grid } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { CircleCheck, CircleX } from "tabler-icons-react";



const GET_TAXA = gql`
query lists($name: String) {
  lists(name: $name) {
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
        wholeGenomes
        mitogenomes
        barcodes
        other
      }
    }
  }
}`;

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
  mitogenomes: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: Taxonomy,
  photo: Photo,
  dataSummary: DataSummary,
}

type Lists = {
  species: Species[],
};

type QueryResults = {
  lists: Lists,
};


function DataItem({ name, count }: { name: string, count: number }) {
  return (
    <Grid>
      <Grid.Col span="content" pb={0} pr={0} mr={0}>
        { count > 0 ? <CircleCheck color="green" /> : <CircleX color="red" /> }
      </Grid.Col>
      <Grid.Col span="auto"><Text>{name}</Text></Grid.Col>
      <Grid.Col span="content"><Text c="dimmed">{count} records</Text></Grid.Col>
    </Grid>
  )
}


function SpeciesCard({ species }: { species: Species }) {
  const itemLinkName = species.taxonomy.canonicalName.replaceAll(" ", "_");

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}`}>
        <Title order={4}>{ species.taxonomy.canonicalName }</Title>
      </Link>

      <Box py={20}>
        <DataItem name="Whole genome" count={species.dataSummary.wholeGenomes} />
        <DataItem name="Mitogenome" count={species.dataSummary.mitogenomes} />
        <DataItem name="Barcode" count={species.dataSummary.barcodes} />
        <DataItem name="Other" count={species.dataSummary.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}`}>
          { species.photo
            ? <Image src={species.photo.url} height={160} alt={species.taxonomy.canonicalName} />
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

export default function BrowseList({ params }: { params: { name: string } }) {
  const segmented = useSearchTypeStyles();
  const [taxaType, setTaxaType] = useState('vertebrates');

  const { loading, error, data } = useQuery<QueryResults>(GET_TAXA, {
    variables: {
        name: params.name.replaceAll("_", " "),
    },
  });

  return (
    <Box>
      <Paper bg="midnight.6" p={10} radius="lg">
        <SegmentedControl
          size="md"
          m={10}
          value={taxaType}
          onChange={setTaxaType}
          classNames={segmented.classes}
          data={[
            { value: 'vertebrates', label: 'Vertebrates' },
            { value: 'invertebrates', label: 'Invertebrates' },
          ]}
        />
      </Paper>

      <Box mt={40}>
        <LoadingOverlay visible={false} />
        { !loading && data ? <BrowseResults list={data.lists.species} /> : null }
      </Box>
    </Box>
  );
}


// Custom segmented control style for the search block
const useSearchTypeStyles = createStyles((theme, _params, _getRef) => {
  return {
    root: {
      color: "white",
      backgroundColor: theme.colors.midnight[6],
      paddingLeft: 0,
      paddingRight: 0,
      borderWidth: 0,
      borderRadius: 0,
    },
    label: {
      fontSize: "20px",
      fontWeight: 400,
      color: theme.colors.gray[3],

      '&:hover': {
        color: "white",
      },
      '&[data-active]': {
        '&, &:hover': {
          color: "white",
        },
      },
    },
    control: {
      borderWidth: 0,
      borderRadius: 0,
    },
    active: {
      color: "white",
      backgroundColor: theme.colors.midnight[5],
      left: 5,
      bottom: 0,
      borderRadius: 5,
      borderBottomColor: theme.colors.bushfire[4],
      borderBottomWidth: "6px",
      borderBottomStyle: "solid",
      boxShadow: "none",
    },
  }
});
