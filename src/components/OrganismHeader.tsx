"use client";

import { MAX_WIDTH } from "@/app/constants";
import { Taxonomy } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Container, Flex, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import IconBar from "./icon-bar";
import { LoadOverlay } from "./load-overlay";

interface HeaderProps {
  taxonomy: Taxonomy[];
  referenceGenome?: { recordId: string };
}

function Header({ taxonomy, referenceGenome }: HeaderProps) {
  const theme = useMantineTheme();

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
        {details && <IconBar taxonomy={details} conservation={[]} traits={[]} attributes={attributes} />}

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
  const referenceGenome = data?.species.referenceGenome;
  const attributes = data?.species.attributes;

  return (
    <Paper py={20} pos="relative">
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>
        {taxonomy ? <Header taxonomy={taxonomy} referenceGenome={referenceGenome} attributes={attributes} /> : null}
      </Container>
    </Paper>
  );
}
