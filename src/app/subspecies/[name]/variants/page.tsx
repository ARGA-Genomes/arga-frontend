"use client";

import { Center, Text } from "@mantine/core";

export default function VariantsPopulationSetsPage({ params }: { params: { name: string } }) {

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder variants and population sets page for {params.name}</Text>
    </Center>
  );
}
