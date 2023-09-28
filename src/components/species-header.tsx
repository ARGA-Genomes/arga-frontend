'use client';

import { gql, useQuery } from "@apollo/client";
import { Container, Grid, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";
import { LoadOverlay } from "./load-overlay";
import { MAX_WIDTH } from "@/app/constants";
import { CircleCheck } from "tabler-icons-react";


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
  const theme = useMantineTheme();

  return (
    <Grid>
      <Grid.Col span="auto">
        <Group gap={40}>
          <Text c="dimmed" fw={400}>Species</Text>
          <Text fz={38} fw={700} fs="italic">{taxonomy.canonicalName}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span="content">
        <IconBar taxonomy={taxonomy} conservation={conservation} traits={traits} />
      </Grid.Col>
      <Grid.Col span="content" ml={80}>
        <Group h="100%" pl={30}>
          <Text fw={700} c="dimmed">Reference Genome</Text>
          <CircleCheck size={35} color={theme.colors.moss[5]} />
        </Group>
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
    <Paper py={20} pos="relative">
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>
      { taxonomy ? <Header taxonomy={taxonomy} conservation={conservation} traits={traits} /> : null }
      </Container>
    </Paper>
  )
}
