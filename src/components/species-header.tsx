"use client";

import { gql, useQuery } from "@apollo/client";
import { Container, Group, Paper, Text, Flex, useMantineTheme } from "@mantine/core";
import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";
import { LoadOverlay } from "./load-overlay";
import { MAX_WIDTH } from "@/app/constants";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

const GET_SPECIES = gql`
  query SpeciesWithConservation($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        vernacularGroup
        source
        rank
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
      attributes {
        name
        valueBool
        valueInt
        valueDecimal
        valueStr
      }
    }
  }
`;

interface NameAttribute {
  name: string;
  valueBool?: boolean;
  valueInt?: number;
  valueDecimal?: number;
  valueStr?: string;
}

interface QueryResults {
  species: {
    taxonomy: Taxonomy[];
    conservation: Conservation[];
    indigenousEcologicalKnowledge: IndigenousEcologicalKnowledge[];
    referenceGenome?: { recordId: string };
    attributes?: NameAttribute[];
  };
}

interface HeaderProps {
  taxonomy: Taxonomy[];
  conservation?: Conservation[];
  traits?: IndigenousEcologicalKnowledge[];
  referenceGenome?: { recordId: string };
  attributes?: NameAttribute[];
}

function Header({ taxonomy, conservation, traits, referenceGenome, attributes }: HeaderProps) {
  const theme = useMantineTheme();

  const details = taxonomy.find((t) => t.source === "Atlas of Living Australia");

  return (
    // Original format
    <Flex
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      align={{ base: "normal", lg: "center" }}
      gap="md"
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 0, lg: 40 }}
        align={{ base: "normal", lg: "center" }}
      >
        <Text c="dimmed" fw={400}>
          {details?.rank}
        </Text>
        <Text fz={38} fw={700} fs="italic">
          {details?.canonicalName}
        </Text>
      </Flex>

      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: "md", lg: "xl" }}
        align={{ base: "normal", lg: "center" }}
      >
        {details && <IconBar taxonomy={details} conservation={conservation} traits={traits} attributes={attributes} />}

        <Group h="100%" wrap="nowrap" gap={5}>
          <Text fw={700} c="dimmed" style={{ whiteSpace: "nowrap" }}>
            Reference genome available
          </Text>
          {referenceGenome ? (
            <IconCircleCheck size={35} color={theme.colors.moss[5]} />
          ) : (
            <IconCircleX size={35} color={theme.colors.red[5]} />
          )}
        </Group>
      </Flex>
    </Flex>
  );
}

export default function SpeciesHeader({ canonicalName }: { canonicalName: string }) {
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
  const attributes = data?.species.attributes;

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
            attributes={attributes}
          />
        ) : null}
      </Container>
    </Paper>
  );
}
