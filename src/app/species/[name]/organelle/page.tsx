"use client";
import { use } from "react";

import { Center, Text } from "@mantine/core";

export default function OrganelleChromosomesPage(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder organelle chromosomes page for {params.name}</Text>
    </Center>
  );
}