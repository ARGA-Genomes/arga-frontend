"use client";

import { MAX_WIDTH } from "@/app/constants";
import { gql, useQuery } from "@apollo/client";
import { Container, Flex, Paper, Text } from "@mantine/core";
import { LoadOverlay } from "./load-overlay";

const GET_ORGANISM = gql`
  query OrganismHeader($entityId: String) {
    organism(by: { entityId: $entityId }) {
      organismId
    }
  }
`;

interface OrganismQuery {
  organism: { organismId: string };
}

interface HeaderProps {
  organismId: string;
}

function Header({ organismId }: HeaderProps) {
  return (
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
          ORGANISM
        </Text>
        <Text fz={38} fw={700}>
          {organismId}
        </Text>
      </Flex>
    </Flex>
  );
}

export default function OrganismHeader({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_ORGANISM, {
    variables: {
      entityId,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Paper py={20} pos="relative">
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>{data && <Header organismId={data.organism.organismId} />}</Container>
    </Paper>
  );
}
