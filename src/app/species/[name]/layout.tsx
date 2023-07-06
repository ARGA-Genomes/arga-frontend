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
import { useEffect, useState } from "react";

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

interface TaxonMatch {
  identifier: string;
  name: string;
  acceptedIdentifier: string;
  acceptedName: string;
}

function Header({ taxonomy, conservation }: HeaderProps) {
  const [matchedTaxon, setMatchedTaxon] = useState<string[] | null>(null);
  const hasFrogID = false;
  const hasAFD = false;

  // Fetch the taxon UID from the given name
  useEffect(() => {
    async function matchTaxon() {
      try {
        const response = await fetch(
          `https://api.ala.org.au/species/guid/${encodeURIComponent(
            taxonomy.canonicalName
          )}`
        );
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(
          matches.map(({ acceptedIdentifier }) => acceptedIdentifier)
        );
      } catch (error) {
        setMatchedTaxon([]);
      }
    }

    matchTaxon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid>
      <Grid.Col span="auto">
        <Stack justify="center" h="100%" spacing={0} pt="sm">
          <Title order={3} color="white" size={26}>
            <i>{taxonomy.canonicalName}</i> {taxonomy.authorship}
          </Title>
          <Text color="gray" mt={-8}>
            <b>Taxonomic Status: </b>Unknown
          </Text>
          <Group mt="md" spacing="xs">
            <Button
              component="a"
              radius="md"
              color="midnight"
              size="xs"
              leftIcon={<ExternalLink size="1rem" />}
              loading={!matchedTaxon}
              disabled={
                Array.isArray(matchedTaxon) && matchedTaxon.length === 0
              }
              href={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
              target="_blank"
              sx={(theme) => ({
                border: `1px solid ${theme.colors["shellfish"][6]}`,
              })}
            >
              View on&nbsp;<b>ALA</b>
            </Button>
            {hasFrogID && (
              <Button
                radius="md"
                color="midnight"
                size="xs"
                leftIcon={<ExternalLink size="1rem" />}
                sx={(theme) => ({
                  border: `1px solid ${theme.colors["shellfish"][6]}`,
                })}
              >
                View on&nbsp;<b>FrogID</b>
              </Button>
            )}
            {hasAFD && (
              <Button
                radius="md"
                color="midnight"
                size="xs"
                leftIcon={<ExternalLink size="1rem" />}
                sx={(theme) => ({
                  border: `1px solid ${theme.colors["shellfish"][6]}`,
                })}
              >
                View on&nbsp;<b>AFD</b>
              </Button>
            )}
          </Group>
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Stack h="100%" justify="center">
          <IconBar taxonomy={taxonomy} conservation={conservation} />
        </Stack>
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
