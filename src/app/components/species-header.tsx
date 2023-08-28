'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Grid, LoadingOverlay, Paper, Stack, Text, Title } from "@mantine/core";
import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";


const GET_SPECIES = gql`
query SpeciesWithConservation($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    taxonomy {
      canonicalName
      authority
      status
      kingdom
      phylum
      class
      order
      family
      genus
      vernacularGroup
      vernacularNames {
        name
      }
      synonyms {
        scientificName
      }
    }
    conservation {
      status
      state
      source
    }
    indigenousEcologicalKnowledge {
      id
      name
      datasetName
      culturalConnection
      foodUse
      medicinalUse
      sourceUrl
    }
  }
}`;

type QueryResults = {
  species: {
    taxonomy: Taxonomy,
    conservation: Conservation[],
    indigenousEcologicalKnowledge: IndigenousEcologicalKnowledge[],
  },
};


interface HeaderProps {
  taxonomy: Taxonomy,
  conservation?: Conservation[],
  traits?: IndigenousEcologicalKnowledge[],
}

function Header({ taxonomy, conservation, traits }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Stack justify="center" h="100%" spacing={0}>
          <Title order={3} size={26}>
            <i>{taxonomy.canonicalName}</i> {taxonomy.authority}
          </Title>
          <Text color="gray" mt={-8}>
            <b>Taxonomic Status: </b>{taxonomy.status.toLowerCase()}
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Stack h="100%" justify="center">
          <IconBar taxonomy={taxonomy} conservation={conservation} traits={traits} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}


export default function SpeciesHeader({ canonicalName }: { canonicalName: string }) {
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
  const traits = data?.species.indigenousEcologicalKnowledge;

  return (
    <Box pos="relative">
      <Paper radius="lg" p={20}>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />
      { taxonomy ? <Header taxonomy={taxonomy} conservation={conservation} traits={traits} /> : null }
      </Paper>
    </Box>
  )
}
