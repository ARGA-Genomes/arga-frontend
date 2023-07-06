"use client";

import { gql, useQuery } from "@apollo/client";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Conservation, Taxonomy } from "@/app/type";
import IconBar from "../../components/icon-bar";
import { ExternalLink } from "tabler-icons-react";

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
  }
`;

type QueryResults = {
  species: {
    taxonomy: Taxonomy;
    conservation: Conservation[];
  };
};

interface HeaderProps {
  taxonomy: Taxonomy;
  conservation?: Conservation[];
}

function Header({ taxonomy, conservation }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Stack justify="center" h="100%" spacing={0} pt="sm">
          <Title order={3} color="white" size={26}>
            <i>{taxonomy.canonicalName}</i> {taxonomy.authorship}
          </Title>
          <Box mt={4}>
            <Button
              radius="md"
              color="shellfish"
              size="xs"
              leftIcon={<ExternalLink size="1rem" />}
            >
              View on ALA
            </Button>
          </Box>
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <IconBar taxonomy={taxonomy} conservation={conservation} />
      </Grid.Col>
    </Grid>
  );
}

interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({
  params,
  children,
}: SpeciesLayoutProps) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName,
    },
  });

  if (error) return <Text>Error : {error.message}</Text>;

  const taxonomy = data?.species.taxonomy;
  const conservation = data?.species.conservation;

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: "xl", color: "moss.5" }}
        visible={loading}
      />
      {taxonomy && <Header taxonomy={taxonomy} conservation={conservation} />}
      {children}
    </Box>
  );
}
