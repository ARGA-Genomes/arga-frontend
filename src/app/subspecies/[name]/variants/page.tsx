"use client";;
import { use } from "react";

import { Center, Text } from "@mantine/core";

export default function VariantsPopulationSetsPage(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder variants and population sets page for {params.name}</Text>
    </Center>
  );
}
