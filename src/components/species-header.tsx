"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Container,
  Grid,
  Group,
  Paper,
  Text,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import {
  Conservation,
  IndigenousEcologicalKnowledge,
  Taxonomy,
} from "@/app/type";
import IconBar from "./icon-bar";
import { LoadOverlay } from "./load-overlay";
import { MAX_WIDTH } from "@/app/constants";
import { CircleCheck, CircleX } from "tabler-icons-react";

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
      referenceGenome {
        recordId
      }
    }
  }
`;

type QueryResults = {
  species: {
    taxonomy: Taxonomy[];
    conservation: Conservation[];
    indigenousEcologicalKnowledge: IndigenousEcologicalKnowledge[];
    referenceGenome?: { recordId: string };
  };
};

interface HeaderProps {
  taxonomy: Taxonomy[];
  conservation?: Conservation[];
  traits?: IndigenousEcologicalKnowledge[];
  referenceGenome?: { recordId: string };
}

function Header({
  taxonomy,
  conservation,
  traits,
  referenceGenome,
}: HeaderProps) {
  const theme = useMantineTheme();

  return (
    <Flex
      justify="space-between"
      direction={{ base: "column", md: "row" }}
      gap="md"
      wrap="wrap"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 0, md: 40 }}
        align={{ base: "normal", md: "center" }}
      >
        <Text c="dimmed" fw={400}>
          Species
        </Text>
        <Text fz={38} fw={700} fs="italic">
          {taxonomy[0]?.canonicalName}
        </Text>
      </Flex>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: "md", md: "xl" }}
      >
        <IconBar
          taxonomy={taxonomy[0]}
          conservation={conservation}
          traits={traits}
        />

        <Group h="100%" wrap="nowrap">
          <Text fw={700} c="dimmed" style={{ whiteSpace: "nowrap" }}>
            Reference Genome
          </Text>
          {referenceGenome ? (
            <CircleCheck size={35} color={theme.colors.moss[5]} />
          ) : (
            <CircleX size={35} color={theme.colors.red[5]} />
          )}
        </Group>
      </Flex>
    </Flex>
  );
}

export default function SpeciesHeader({
  canonicalName,
}: {
  canonicalName: string;
}) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const taxonomy = data?.species.taxonomy;
  const conservation = data?.species.conservation;
  const traits = data?.species.indigenousEcologicalKnowledge;
  const referenceGenome = data?.species.referenceGenome;

  return (
    <Paper py={20} pos="relative">
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>
        {taxonomy ? (
          <Header
            taxonomy={taxonomy}
            conservation={conservation}
            traits={traits}
            referenceGenome={referenceGenome}
          />
        ) : null}
      </Container>
    </Paper>
  );
}
