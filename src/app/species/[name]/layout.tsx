'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Group, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { Conservation, Taxonomy } from "@/app/type";
import IconBar from "../../components/icon-bar";


const GET_SPECIES = gql`
query SpeciesWithConservation($canonicalName: String) {
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
    conservation {
      status
      state
      source
    }
  }
}`;

type QueryResults = {
  species: {
    taxonomy: Taxonomy,
    conservation: Conservation[],
  },
};


interface HeaderProps {
  taxonomy: Taxonomy,
  conservation?: Conservation[],
}

function Header({ taxonomy, conservation }: HeaderProps) {
  return (
    <Stack>
      <Grid>
        <Grid.Col span="auto">
          <Title order={3} color="white" mb={10}>
            <Group>
              <Text italic={true} fw={500}>{taxonomy.canonicalName}</Text><Text fw="normal">{taxonomy.authorship}</Text>
            </Group>
          </Title>
        </Grid.Col>
        <Grid.Col span="content">
          <IconBar taxonomy={taxonomy} conservation={conservation} />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}


interface SpeciesLayoutProps {
  params: { name: string },
  children: React.ReactNode,
}

export default function SpeciesLayout(props: SpeciesLayoutProps) {
  const canonicalName = props.params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
        canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const taxonomy = data?.species.taxonomy;
  const conservation = data?.species.conservation;

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />
      { taxonomy ? <Header taxonomy={taxonomy} conservation={conservation} /> : null }
      { props.children }
    </Box>
  )
}
