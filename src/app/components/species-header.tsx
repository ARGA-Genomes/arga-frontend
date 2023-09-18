'use client';

import { gql, useQuery } from "@apollo/client";
import { Container, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";
import { LoadOverlay } from "./load-overlay";
import { MAX_WIDTH } from "../constants";


const GET_SPECIES = gql`
query SpeciesWithConservation($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    taxonomy {
      canonicalName
      vernacularGroup
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
        <Group>
          <Text c="dimmed" weight={400}>Species</Text>
          <Text size={22} weight={600} italic>{taxonomy.canonicalName}</Text>
        </Group>
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
    <Paper py={20}>
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>
      { taxonomy ? <Header taxonomy={taxonomy} conservation={conservation} traits={traits} /> : null }
      </Container>
    </Paper>
  )
}
